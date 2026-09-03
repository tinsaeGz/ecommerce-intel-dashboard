# 14 — Implementation Roadmap

14 weeks to commercial launch (the original 12-week plan + 2 weeks that a paid product honestly requires for billing hardening and beta). Team shape: 2 backend, 1 frontend, 1 full-stack/devops (can compress to 2–3 people at +4–6 weeks). Long-lead items start in week 1 regardless of phase: **Stripe account + Stripe Tax registrations (EU VAT OSS), Twilio sender/number provisioning per launch country (some require regulatory bundles), es/fr translation contractor booking, GDPR paperwork (privacy policy, DPA templates, processing register), beta-merchant recruitment in all three language markets.**

## Phase 0 — Foundations (Weeks 1–2)
- Repo scaffold per [02-architecture.md §8](02-architecture.md); CI pipeline complete on day 3 (lint/test/build/scan) — CI before features.
- Compose dev environment (Postgres, Redis, MinIO, mailpit, fake SMS/payments).
- Core plumbing: config, structlog, error model, request-ID middleware, health endpoints, Alembic baseline, RLS helpers, Celery app + queues, Sentry.
- Auth vertical slice: signup (phone OTP via fake provider), login, refresh rotation, sessions, CSRF, rate-limit middleware with policy table.
- Deploy staging from CI (walking skeleton in prod-shaped clothes).
- **Exit:** a request can sign up, log in, and hit a tenant-scoped hello endpoint through the full middleware chain, deployed to staging automatically.

## Phase 1 — Ingestion core (Weeks 3–5)
- Schema migrations: merchants/users/products/orders/partitions/uploads/mappings/rollups.
- Upload endpoint → S3 → shell pre-pass (bats-tested) → sniffer → mapping proposal.
- Mapping API + dry-run preview; Polars normalize/validate/load; fingerprint dedup; rollup upsert; SSE progress; error reports.
- Fixture corpus seeded with ≥ 15 shapes incl. semicolon/comma-decimal CSVs, day-first ambiguity sets, localized month names, mojibake accents.
- Frontend: app shell, design tokens (light/dark), i18n scaffold with real keys from day one (retrofitting i18n is misery), auth screens, upload + mapping UI.
- **Exit:** messy fixture in → correct rollups out, visible progress, per-row errors downloadable; golden tests green.

## Phase 2 — Analytics dashboard (Weeks 6–7)
- Metric functions in `domain/metrics` + dashboard endpoints with Redis cache, version-key invalidation, ETags.
- Frontend: KPI cards, velocity charts (ECharts), inventory table with days-of-stock, retention matrix, orders browse.
- Alert engine (dashboard channel only), default rules at signup, acknowledge flow.
- **Exit:** the three questions answered end-to-end; p95 targets met on staging with load-test scenario (a).

## Phase 3 — Monetization rails (Weeks 8–10)
- Plans/subscriptions/entitlements middleware; history-window and quota enforcement live.
- Stripe Billing (Checkout, subscriptions, customer portal, Stripe Tax), webhook verification + re-fetch, reconciliation job; dunning states past_due/grace/expired driven by simulated webhooks in tests.
- Sync API (keys, batch endpoints, per-key limits, public OpenAPI docs page).
- Email provider live (verification, alerts, billing mail with DKIM/DMARC); Twilio SMS for optional phone verify + premium alert SMS with quiet hours + per-country cost caps.
- **Exit:** a merchant can pay real money on staging-sandbox and premium behavior flips everywhere within seconds; E2E journeys 4–5 green.

## Phase 4 — Ad platform (Weeks 11–12)
- Advertiser registration/review, wallet + ledger, campaigns/creatives, moderation queue in admin panel.
- Serving path (Redis index, auction, pacing, nonce), event validation, billing worker, advertiser stats.
- Admin panel generally: tenant management, impersonation (audited), platform metrics.
- **Exit:** E2E journeys 3 and 6 green; ad path failure-modes verified (kill switch, 204 degradation).

## Phase 5 — Hardening & beta (Weeks 13–14)
- Localization completion + native-speaker review (es LATAM-neutral, fr); locale screenshot diffing for French text expansion.
- Load tests (b)(c); ZAP + external penetration test; fix window.
- Backup/restore drill, DR rehearsal, alerting tuning, runbooks, status page.
- Closed beta (15–20 merchants across the three language markets) with daily triage; corpus grows with per-market POS export shapes; pricing interviews conclude → final price + regional price points set.
- Legal: ToS/privacy policy (en/es/fr), GDPR paperwork finalized (DPA, processing register, subprocessor list), Stripe Tax registrations verified end-to-end with a real EU VAT invoice.
- **Exit / launch gate:** all release-blocking E2E green · SLO dashboards live · restore drill passed · pen-test criticals closed · beta NPS/activation acceptable · billing reconciles to the cent for beta period.

## Post-launch (v1.x → v2 candidates, demand-ordered)
1. Refund/negative-row support in ingestion ([07-analytics.md §5](07-analytics.md))
2. Outbound webhooks ([04-api.md §10](04-api.md))
3. WhatsApp Business alerts (LATAM priority — template approval process starts during beta)
4. Mercado Pago (LATAM conversion) and Flutterwave/Paystack (West Africa) payment providers
5. React Native app (push notifications, camera ledger OCR ingestion) — triggers per [01-product.md §8](01-product.md)
6. Multi-currency dashboards; Portuguese (Brazil) locale; inventory management (POs); read replica / regional PoP per scale triggers

## Risk register

| Risk | L | I | Mitigation |
|---|---|---|---|
| Spreading launch across 3 language markets dilutes focus | High | High | One primary beachhead (LATAM/es) gets the marketing spend; fr/en launch as self-serve. Product is identical everywhere — only go-to-market is sequenced |
| Ad supply cold start ×3 markets | High | Med | Ads launch LATAM-first with 5–10 hand-sold anchor advertisers; other markets run house ads (premium upsell) until supply exists — the UI never looks broken |
| Twilio number/sender regulatory bundles per country | Med | Med | Start week 1; email is the primary channel so SMS delays degrade a premium feature, not signup |
| International SMS cost variance & pumping fraud | Med | Med | Per-country cost tables, caps + budget alarms from day one, high-risk prefix blocklist ([05-security.md §10](05-security.md)) |
| Messy-data long tail exceeds parser (now ×3 regional conventions) | High | Med | Corpus discipline + `needs_mapping` human-in-loop keeps unknowns from silently corrupting; day-first ambiguity never auto-resolved; beta feeds per-market POS fixtures |
| GDPR/tax compliance gaps at launch | Med | High | Stripe Tax carries VAT mechanics; GDPR paperwork on the week-1 long-lead list; EU hosting removes transfer questions |
| LATAM payment conversion poor on cards-only | Med | High | Accept at launch (Stripe covers cards + wallets); Mercado Pago (OXXO cash, installments) is the first post-launch integration if MX conversion data demands it |
| Low conversion to premium | Med | High | 13-month history retention as upgrade lever; predictive alerts as hero feature; price + regional-pricing test in beta |
| Single-host outage / LATAM latency | Med | Med | SLO honesty (99.5%), 2 h RTO rehearsed; ETag/SW caching absorbs RTT; read replica/regional PoP documented as scale-out |
| Support across 6+ timezones with a team of 4 | Med | Med | Async-first support (in-app + email SLA), localized help center before launch, alert quiet-hours logic already merchant-local |
| Team of 4 slips schedule | Med | Med | Phases are strictly vertical slices — a launch with Phase 4 deferred (no ads, premium-only monetization) is a viable fallback |
