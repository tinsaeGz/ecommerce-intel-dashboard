# 08 — Ad Engine (B2B Monetization Layer)

Contextual B2B ads shown to free-tier merchants at moments of commercial intent. The canonical example from the spec: a stockout alert renders with an adjacent promotion from a packaging supplier or logistics fleet. This is a small, honest ad system — no tracking pixels, no third-party ad tech, no merchant-identifiable targeting.

## 1. Ad slots & trigger contexts

| Slot | Placement | Trigger context | Priority |
|---|---|---|---|
| `stockout_sidebar` | Beside inventory alerts panel | `stockout` — merchant has ≥ 1 active stockout/low alert | Highest CPC value |
| `velocity_banner` | Below sales velocity chart | `velocity_spike` — 7d revenue up > 25% (growth spend moment: restock loans, logistics) | High |
| `retention_card` | Retention tab | `retention` — retention products (SMS marketing, loyalty vendors) | Medium |
| `dashboard_general` | Dashboard footer card | `dashboard_general` — always eligible | Fill inventory |

Max 1 ad per page view. Premium merchants: `GET /v1/ads/slots` always returns 204 (entitlement-checked server-side — ad-free is enforced at the API, not hidden in CSS).

## 2. Serving flow

1. Frontend requests `GET /v1/ads/slots?context=stockout&placement=stockout_sidebar`.
2. API resolves merchant context signal (from the merchant's own alert/rollup state — already in cache) and candidate set:
   - `campaigns` where `status=active`, `trigger_context` matches, targeting matches (`city`, `business_category`, locale has an approved creative), wallet balance ≥ bid, daily budget not exhausted.
   - Candidate set comes from a Redis-cached index (`ads:index:{context}`, TTL 60 s, rebuilt on campaign change) — serving never queries Postgres on the hot path.
3. **Auction:** generalized first-price with pacing score: `score = bid_micro × pacing_factor × quality_factor`. `pacing_factor` throttles campaigns ahead of their even-delivery curve; `quality_factor` = smoothed CTR of the creative (default 1.0 for new). Highest score wins; ties random.
4. Response: creative fields (localized to merchant locale), plus a **signed slot nonce** (HMAC of creative, merchant, slot, timestamp; 10-min validity, single-use via Redis SETNX).
5. Frontend fires `POST /v1/ads/events` for impression (on ≥ 50% visibility, 1 s) and click, carrying the nonce.

## 3. Event validation & billing

- Nonce must verify + be unspent → else event dropped (fraud-filtered counter).
- Dedup: `ad_events.dedup_key = nonce+kind`; DB unique constraint is the final guard.
- Click caps: same merchant-viewer charged max 2 clicks/campaign/day; further clicks recorded uncharged.
- Charging (`ads` queue worker, batched): CPC campaigns charged per validated click, CPM per 1000 validated impressions. Wallet debit + ledger append in one transaction; insufficient balance → campaign `exhausted`, index rebuilt.
- Advertiser-facing stats show charged vs filtered events transparently.

## 4. Advertiser lifecycle

1. Self-serve registration → `pending_review`; platform admin verifies business (manual review of website/registry; keeps scam ads out of merchants' dashboards) → `active`. Targeting is per-country/region, so an advertiser onboards per market.
2. Wallet top-up via Stripe checkout (min 50 USD/EUR equivalent; wallet currency fixed at creation). Prepaid only.
3. Campaign creation wizard: context, targeting, bid (min bids per context configured platform-side), budgets, schedule, creatives per locale.
4. **Creative moderation:** every creative starts `pending`; admin approves/rejects with note; text-only + reviewed image (uploaded to S3, served resized/optimized). House style enforced: ads render in the app's own card component, clearly labeled "Sponsored / Patrocinado / Sponsorisé" per locale (ad-disclosure labeling is a legal requirement in the EU — DSA — and in most LATAM consumer law).
5. Reporting: daily impressions/clicks/CTR/spend per campaign; aggregate audience stats only with ≥ 5-merchant buckets ([05-security.md §9](05-security.md)).

## 5. Platform admin controls

- Review queues (advertisers, creatives) with SLA metric (< 24 h).
- Kill switch per campaign/advertiser; global ads kill switch (feature flag) — if the ad system misbehaves the dashboard must degrade to "no ad", never to an error.
- Pricing config: min bids, platform fee visibility, context multipliers — all in a config table, not code.

## 6. Metrics that matter

Fill rate per context, eCPM, CTR per slot, advertiser wallet burn rate, filtered-event ratio (fraud signal), premium-conversion lift from ad exposure (are ads annoying enough to convert but not to churn — tracked via cohort comparison).

## 7. Failure modes

Ad path is strictly best-effort: any error/timeout (> 150 ms budget) in slot resolution returns 204. No ad code runs on the ingestion or analytics path. Ad events queue is isolated so an ads backlog never delays SMS alerts.
