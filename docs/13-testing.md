# 13 — Testing & QA

## 1. Test pyramid & tooling

| Level | Tooling | Scope | Gate |
|---|---|---|---|
| Unit (backend) | pytest + hypothesis | `domain/` pure logic: metrics, forecasting, billing display math, regional date/number parsing (property-based: parse∘format round-trips per locale), fingerprinting, auction scoring | PR, < 60 s |
| Unit (shell) | bats | Every `scripts/shell/*.sh` against fixture bytes (BOM, CRLF, nulls, encodings) | PR |
| Unit (frontend) | vitest + testing-library | Components, i18n rendering (all 3 locales), formatters | PR |
| Integration | pytest + real Postgres/Redis/MinIO via compose | API endpoints through the full middleware chain; ingestion pipeline end-to-end on the fixture corpus; RLS enforcement; webhook processing with fake providers | PR |
| Contract | schemathesis against OpenAPI | Fuzzes every endpoint for schema conformance + auth handling | nightly + PR on api/ changes |
| E2E | Playwright | Critical journeys (below) against staging build | merge + nightly |
| Load | Locust | Scenarios in [09-performance.md §8](09-performance.md) | pre-release |
| Security | bandit, pip-audit, npm audit, Trivy, ZAP baseline scan nightly on staging | | merge/nightly |

Coverage: `domain/` ≥ 95%, overall backend ≥ 85% — enforced, but the fixture-corpus golden tests are the real quality bar.

## 2. Critical E2E journeys (release-blocking)

1. Signup (email verification, Spanish locale) → first upload (semicolon/comma-decimal fixture) → mapping UI with day-first confirmation → dashboard shows correct numbers (asserted against fixture's known totals).
2. Re-upload same file → dedup: zero new rows, friendly notice.
3. Stockout path: inventory upload → alert appears → free tier sees packaging-supplier ad in slot → click recorded once (second click not billed).
4. Premium upgrade via Stripe test mode → webhook → history unlocks, ads disappear, SMS alert rule enabled (after phone verify) → alert fires → fake SMS recorded with French template; renewal-failure path drives past_due → grace → expired via simulated webhooks.
5. Sync API: key created → batch POST 500 orders (with duplicates) → idempotency verified → rate limit 429 with headers after threshold.
6. Advertiser: register → admin approves → top-up (fake) → campaign live → serves in matching context only; wallet exhaustion pauses campaign.
7. Downgrade: subscription expiry → grace → free; history windows to 90 d; seats deactivate; re-upgrade restores.
8. RLS canary: authenticated as merchant A, attempt every read endpoint with merchant B's resource IDs → all 404 (integration suite auto-generates this matrix from the router table).

## 3. Ingestion fixture corpus

Per [06-ingestion.md §6](06-ingestion.md) — golden tests: each fixture has `expected_rows.json` + `expected_errors.json`; any pipeline change that alters output fails visibly. New support incident → new anonymized fixture → regression locked forever. Corpus includes semicolon CSVs with comma decimals, DD/MM-vs-MM/DD ambiguity sets, localized month names (es/fr/en), mojibake accents (Windows-1252-as-UTF-8), trailing "TOTAL: 45.000,00" rows, common POS/marketplace export shapes per market, 100k-row size test, zip-bomb XLSX (must reject), formula-injection cells (must neutralize on re-export).

## 4. i18n QA

- CI: key parity across locales; ICU syntax validation; SMS segment-count budget per template; `"__mt": true` (machine-translated placeholder) blocks release.
- Pre-launch: paid native-speaker review pass (es — LATAM-neutral, fr) on staging with a review checklist per screen; screenshot diffing per locale (Playwright) to catch text overflow — French runs ~20% longer than English and is the standard layout-breaker; number/currency formatting snapshot-tested per locale×currency.

## 5. Manual QA & beta

- Two-week closed beta with 15–20 real merchants **spread across the three language markets** (recruited via merchant Facebook/WhatsApp groups, chambers of commerce, POS-vendor partners), free premium for feedback; structured weekly interviews per market; their real files (with consent) feed the corpus — this is where the per-market POS export shapes come from.
- Device matrix: low-end Android (2 GB RAM) on Chrome + Opera Mini extreme-savings mode (degrades to server-rendered? No — documented as unsupported with a friendly message; standard Chrome/Firefox/Samsung Internet supported), iOS Safari, desktop Chrome/Firefox.
- 3G throttle profile in Playwright for the dashboard journey — must be usable (< 8 s to interactive on repeat visit via SW cache).

## 6. Release checklist (per prod deploy)

Migrations reviewed & reversible-safe · staging smoke green · Sentry clean on staging for 24 h (non-trivial releases) · load-test rerun if capacity-relevant · changelog updated · rollback tag verified present · on-call aware.
