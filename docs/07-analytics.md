# 07 — Analytics Engine

All metrics have one definition, implemented once in `backend/app/domain/metrics/` (pure functions over rollup rows — unit-testable without a DB) and documented here. The dashboard, exports, and alerts all call the same functions.

## 1. Metric definitions

### Sales velocity
- **Revenue / units / orders per day-or-week**, from `daily_*_rollups`. Weeks bucket Mon–Sun in merchant timezone.
- **Comparison deltas:** each KPI card shows current period vs previous equal-length period (`Δ%`, guarded for zero denominators → "new").
- **Smoothing:** 7-day trailing moving average overlaid on daily series (merchants' sales are extremely weekday-spiky).

### Inventory intelligence
- `avg_daily_units(product)` = units sold over trailing 30 d ÷ 30 (per spec's 30-day moving average), computed from `daily_product_rollups`.
- `days_of_stock_left = current_stock / max(avg_daily_units, ε)`; `current_stock` = latest `inventory_levels` snapshot minus units sold since `as_of` (derived stock). No snapshot ever uploaded → status `unknown`, prompting an inventory upload.
- Status bands: `ok` (> 14 d), `watch` (7–14 d), `low` (3–7 d), `critical` (< 3 d), `stockout` (≤ 0).
- **Predictive (premium):** replaces the flat average with weekday-seasonal exponential smoothing (Holt-Winters additive, 7-day season) when ≥ 6 weeks of history; forecast horizon 14 d; the alert fires on *forecast* depletion date, giving earlier warning than the moving-average rule. Pure-python/Polars implementation in `domain/forecast.py` — no heavyweight ML dependency in v1.

### Customer retention
- Cohort matrix from `customer_cohorts`: rows = first-purchase month, columns = months since, cell = % of cohort active. Only rows where cohort size ≥ 3 shown (noise).
- KPI splits: repeat-customer share of revenue, one-time vs returning counts, top 10 customers by revenue (displayed by masked key + merchant-editable label since we store hashes).
- Requires `customer_phone`/`customer_name` mapped; otherwise the retention tab shows an explanatory empty state with a "remap your upload" CTA — not a broken chart.

## 2. Computation strategy

| Question | Source | When computed |
|---|---|---|
| Any dashboard chart/KPI | Rollup tables | Incrementally at ingestion (stage G) |
| Ad-hoc date range | Rollup tables (they're daily — every range is a rollup scan) | Query time, Redis-cached |
| Alert conditions | Rollups + inventory snapshots | Event-driven post-ingestion + nightly beat |
| Cohorts | `customer_cohorts` | Incrementally at ingestion |

Rule from README: **no dashboard endpoint touches `orders`/`order_items`**. Raw facts serve only: order browsing pages, exports, rollup (re)builds, and dedup. A `rebuild_rollups(merchant_id, from, to)` admin task exists for corruption recovery and metric-definition migrations.

## 3. Alert engine

Runs as `alerts.evaluate(merchant_id)`: (a) after every completed ingestion, (b) nightly at 06:00 merchant-local via beat (catches time-driven transitions with no new data).

- Evaluates each enabled `alert_rules` row → produces desired alert states.
- Upserts by `(merchant_id, dedup_key)`: new condition → create `active`; still true → update `last_evaluated_at` + payload (no duplicate notifications); no longer true → mark `resolved`.
- **Notification decision:** on transition into `active` (or severity escalation) with `sms`/`email` channels and premium entitlement → enqueue to `notify` queue. Quiet hours (21:00–08:00 local) hold non-critical SMS. Per-merchant SMS cap 10/day (cost control), overflow collapses into one digest SMS.
- Alert copy fully localized (en/es/fr); SMS templates written GSM-7-safe with accent-aware length budgeting ([10-notifications-i18n.md](10-notifications-i18n.md)).

## 4. Dashboard payload design

Endpoints return chart-ready series (labels + values arrays) — no client-side aggregation on low-end devices; typical summary payload < 5 KB. Sparse fields: `?fields=` supported on summary for the mobile home widget (phase 2).

## 5. Accuracy guarantees & edge cases

- Timezone bucketing: a sale at 23:30 Mexico City time lands on that local date even though UTC says next day (rollup bucketing done in merchant tz at ingestion); DST transitions handled by IANA tz rules (relevant for EU/LATAM merchants, and one of the reasons bucketing happens server-side once, not in every client).
- Currency: v1 assumes one currency per merchant (`default_currency`, chosen from a supported list at signup); mixed-currency rows are rejected at validation with a clear error. Multi-currency dashboards (per-currency series, no silent FX conversion) are a documented v2 item — schema already carries `currency` everywhere.
- Refunds/negative rows: rejected in v1 (validation), roadmap v1.1: accepted as negative revenue with a `is_refund` flag once real demand shows shape of the data.
- Late/backfilled data: rollup upsert is date-keyed, so uploading last month's file after this month's is fully supported and recomputes only touched days.
