# 06 — Ingestion Pipeline

The product's moat. Input reality across es/fr/en markets: mixed encodings (UTF-8, Windows-1252/ISO-8859-1 mangling accented characters — `Ã©` for `é` is the single most common corruption, occasionally UTF-16 from Excel), **semicolon-delimited CSVs with comma decimals** (the default Excel export on es/fr locales), ambiguous DD/MM vs MM/DD dates, localized month names ("3 ene 2026", "12 févr. 2026"), currency symbols and thousands separators inside number cells (`$1.234,56`, `1 234,56 €`), merged/blank rows, trailing summary rows, duplicate rows from repeated exports.

## 1. Pipeline stages

```
upload (API) → preprocess (shell) → sniff & map → normalize (Polars) → validate → load (COPY+upsert) → rollup → finalize
```

Each stage is a Celery task in the `ingest` queue; state machine lives on the `uploads.status` column; every transition publishes an SSE progress event. One concurrent pipeline per merchant (Redis lock `ingest:lock:{merchant_id}`) — later uploads queue behind it.

### Stage A — Upload (request path, [04-api.md](04-api.md))
Size/MIME/magic-byte checks, SHA-256 while streaming to MinIO. If `content_sha256` matches a completed upload for this merchant → short-circuit to `completed` with `stats.duplicate_of` (merchants re-upload the same file constantly).

### Stage B — Shell preprocess (the spec's Unix-tools requirement, kept where it wins)
Streaming, near-zero memory, on a temp copy:

```bash
# scripts/shell/preclean.sh <in> <out>   — each step versioned & unit-tested
iconv -f "$(detect_encoding)" -t UTF-8//TRANSLIT        # encoding normalize (uchardet detect)
sed -e '1s/^\xEF\xBB\xBF//' -e 's/\r$//'                # strip BOM, CRLF→LF
tr -d '\000'                                             # null bytes
awk 'NF' RS='\n'                                         # drop fully-empty lines
awk -f normalize_quotes.awk                              # smart quotes → ascii, stray control chars
```

XLSX files skip the text pass and are converted to CSV first (Polars `read_excel` via fastexcel), then join the same path. Output: a clean UTF-8 CSV in scratch storage + basic stats (row count, byte size, delimiter guess via `csv.Sniffer` on a 64 KB sample).

### Stage C — Sniff & schema mapping
- Compute `header_fingerprint` = SHA-256 of the normalized header row (lowercased, trimmed, collapsed whitespace).
- **Known fingerprint** → apply saved `column_mappings` row automatically; continue.
- **Unknown** → build a mapping proposal and park in `needs_mapping`:
  - Header similarity against a multilingual synonym dictionary (`"Total Price"`, `"Precio total"`, `"Importe"`, `"Montant total"`, `"Prix total"` → `line_total`; ~40 target-field synonyms per language incl. accented/unaccented variants, grown from real uploads).
  - Column content probes: date-likeness, numeric-likeness, cardinality (per 1k-row sample) to score candidates.
  - Proposal includes detected delimiter (`,` vs `;` vs tab), decimal separator, and **day-first guess**: sample dates are parsed both ways; if any value exceeds 12 in the first position the format is proven, otherwise propose day-first from the merchant's locale (es/fr → DD/MM) and show the interpreted dates in the preview so the merchant confirms visually. Ambiguity is never silently resolved — it's the classic way analytics products corrupt a month of data.
- The React mapping UI shows first 20 rows, proposal pre-filled, per-column dropdowns, live preview of parsed values (a `POST .../mapping?dry_run=true` parses the sample server-side and returns rendered results). Confirming saves the mapping for future auto-runs.

Target schemas per upload `kind`:
- **sales:** `occurred_at`* , `product_name`*, `quantity`, `unit_price`, `line_total` (any 2 of the 3 amounts; third derived), `order_ref`, `customer_phone|customer_name`, `channel` (*required)
- **inventory:** `product_name`* , `quantity`* , `as_of`
- **products:** `name`*, `sku`, `category`, `unit_price`

### Stage D — Normalize (Polars)
Typed transformation on the full file (lazy frames, streaming for large files):
- Dates: format + day-first from mapping options; localized month-name parsing (es/fr/en abbreviations, with/without diacritics); midnight times get merchant-tz noon to avoid day-boundary flips.
- Numbers: strip currency tokens (`$`, `€`, `£`, `MXN`, `EUR`, spaces as thousands separators), decimal-separator per mapping options (`1.234,56` vs `1,234.56` disambiguated once at mapping, applied consistently); negatives in parentheses handled.
- Strings: trim, collapse whitespace; `normalized_name` = casefold + Unicode NFKC + diacritic-fold ("Café" ≡ "cafe") for product matching only — display names keep their accents.
- `customer_key` = HMAC(per-merchant salt, normalized phone or name) — raw customer PII never persisted ([05-security.md §8](05-security.md)).

### Stage E — Validate
Row-level rules → accept or reject with i18n `error_code`: unparseable date, date > today+1d or < 2015, negative/zero quantity, amount inconsistency (|qty×price − total| > 1%… flagged not rejected, total wins), missing required field. Rejects (up to 1000) → `upload_errors`; full reject file (original rows + reason column) → S3 for download. If reject ratio > 50% → status `failed` with a "check your column mapping" hint rather than loading garbage.

### Stage F — Load
- `COPY` accepted rows into an `UNLOGGED` staging table (per-upload temp name).
- Product resolution: match on `(merchant_id, sku)` then `(merchant_id, normalized_name)`; unmatched → auto-create products (flagged `source=upload` for merchant tidy-up UI).
- Insert into `orders`/`order_items` with `ON CONFLICT (merchant_id, occurred_at, row_fingerprint) DO NOTHING` → **idempotent loads**; conflict count reported as `rows_duplicate`.
- All in one transaction per batch of 10k rows (bounded WAL/lock time).

### Stage G — Rollup & finalize
- Incremental upsert of `daily_merchant_rollups`, `daily_product_rollups`, `customer_cohorts` **only for the (merchant, day) keys touched** (computed from staging distinct days).
- Bump merchant cache version key ([09-performance.md §3](09-performance.md)) → dashboard reflects new data instantly.
- Enqueue `alerts.evaluate(merchant_id)`.
- Status → `completed` / `completed_with_errors`; stats persisted; SSE terminal event; scratch files deleted.

## 2. Row fingerprint (dedup)

`row_fingerprint = sha256(merchant_id | occurred_at_date | order_ref? | normalized product | qty | line_total)` — designed so the same sale re-exported next week dedupes, while two identical-looking sales in one day with different order refs don't. When `order_ref` exists it dominates (`sha256(merchant_id|order_ref|product|qty)`). Documented for Sync API consumers ([04-api.md §8](04-api.md)).

## 3. Failure handling

- Every task: `acks_late=True`, `max_retries=3`, exponential backoff, idempotent by design (stages check current status before acting).
- Poison files (crash 3×) → `failed`, Sentry event with S3 key, ops runbook entry; merchant sees a friendly localized failure + support link.
- Worker memory ceiling (2 GB container limit) — Polars streaming keeps typical usage < 300 MB for 50 MB files.
- Watchdog beat task: any upload in a non-terminal state > 30 min → alarm + auto-fail with refunded quota.

## 4. Performance targets

| File | Target end-to-end (excl. mapping wait) |
|---|---|
| 1 MB / ~10k rows | < 10 s |
| 10 MB / ~100k rows | < 60 s (p95) |
| 50 MB / ~500k rows (premium) | < 5 min |

## 5. Quotas (entitlement-enforced)

Uploads/day and max size per tier ([01-product.md §4](01-product.md)); counted in Redis (`quota:uploads:{merchant_id}:{yyyymmdd}`, TTL 48 h) and double-checked against DB on boundary disputes. Failed/rejected uploads refund the quota unit.

## 6. Test corpus

`tests/fixtures/uploads/` accumulates every distinct real-world breakage (anonymized): mojibake accents (Windows-1252-as-UTF-8), semicolon CSVs with comma decimals, DD/MM vs MM/DD ambiguity sets, localized month names in 3 languages, thousands-separator ambiguity, merged header rows, trailing summary rows ("TOTAL: 45.000,00"), duplicated exports, exports from common POS/marketplace back-offices per market (Square, Clip, SumUp, Mercado Libre, Amazon Seller, WooCommerce). Golden-file tests: fixture in → exact expected rows + rejects out. This corpus is a permanent asset; every support incident that reveals a new shape adds a fixture.
