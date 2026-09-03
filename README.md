# E-Commerce Intelligence Dashboard — "Suq Insights"

**Status:** Design complete, approved for development (rev. 2 — international market)
**Backend:** FastAPI (Python 3.12) · **Frontend:** React + TypeScript + Tailwind · **DB:** PostgreSQL 16 · **Cache/Queue:** Redis 7 + Celery
**Target deployment:** Ubuntu Linux server, EU region (Docker Compose), designed to scale out later
**Languages:** English · Español · Français

A commercial SaaS analytics platform for small and mid-size merchants internationally — Latin America, francophone Europe/Africa, and English-speaking markets. Merchants upload messy sales exports (CSV/Excel from POS systems, marketplace back-offices, WhatsApp/Telegram order logs, hand-kept spreadsheets); the platform normalizes them and turns them into daily actionable intelligence: sales velocity, stockout prediction, and customer retention. Monetized through a free ad-supported tier (contextual B2B ads) and a premium subscription (unlimited history, SMS/email alerts, sync API).

> **Standalone edition (v3 — channels, live entry, derived state):** [SDLC.md](SDLC.md) is a single self-contained document covering everything — requirements, use cases and scenarios, 19 diagrams (use case, ER, class, sequence, state, activity, deployment, component, UX), design, implementation, testing, deployment, and maintenance — with no cross-references. Share that file when one document must stand alone.
>
> **Note:** the standalone document supersedes the `docs/` set on data ingestion and on the dashboard. It specifies an **inferred domain model** — no predefined schema, structure and meaning derived from metadata and extracted values, merchant review and editing before commit, post-commit remodeling without re-upload, and image/PDF sources via document extraction. It also specifies **channels** (named, merchant-labelled streams whose label declares intent), a **day-to-day entry space** with offline sync and live canvas updates, **derived state** (count 50 today, sell 2 tomorrow, stock reads 48 — computed, never stored), a **drift guard** that is permissive about what it accepts and conservative about what it changes, and a **composable widget dashboard** — widgets as independently implemented backend modules over shared query primitives, a question-with-swappable-renders model, drag-and-drop canvases, multiple named dashboards, and a fourteen-widget launch catalog (Appendix A). The `docs/` set below still describes the earlier fixed-schema mapping design and fixed dashboard screens, and is being brought in line.

## Documentation index

| Doc | Contents |
|---|---|
| [01 — Product Definition](docs/01-product.md) | Vision, personas, feature tiers, monetization, mobile strategy |
| [02 — System Architecture](docs/02-architecture.md) | Components, diagrams, tech-stack decisions and rationale |
| [03 — Data Model](docs/03-data-model.md) | Full PostgreSQL schema, multi-tenancy, partitioning, retention |
| [04 — API Design](docs/04-api.md) | Conventions, endpoint catalog, versioning, errors, pagination, idempotency, webhooks, public sync API |
| [05 — Security](docs/05-security.md) | AuthN/AuthZ, API keys, upload security, OWASP checklist, secrets, compliance |
| [06 — Ingestion Pipeline](docs/06-ingestion.md) | Upload → parse → map → validate → load; schema mapping UX; dedup; error reporting |
| [07 — Analytics Engine](docs/07-analytics.md) | Metric definitions, computation strategy, alert engine |
| [08 — Ad Engine](docs/08-ads.md) | Contextual B2B ads: targeting, serving, pacing, advertiser portal, ad billing |
| [09 — Performance: Caching & Rate Limiting](docs/09-performance.md) | Every cache layer, every rate limit, with exact policies |
| [10 — Notifications & i18n](docs/10-notifications-i18n.md) | SMS/email/push, localization (en/es/fr), regional number/date formats |
| [11 — Billing & Subscriptions](docs/11-billing.md) | Plans, entitlements, Stripe (+ regional providers), taxes, dunning, proration |
| [12 — Operations](docs/12-operations.md) | Environments, CI/CD, deployment, backups, DR, observability, SLOs, runbooks |
| [13 — Testing & QA](docs/13-testing.md) | Test pyramid, fixtures for messy CSVs, load testing, security testing |
| [14 — Roadmap](docs/14-roadmap.md) | 14-week phased implementation plan, team shape, risk register |
| [15 — SDLC](docs/15-sdlc.md) | Methodology, roles, phase gates, premium feature register (FR-P-1…10) with launch gates, release/change management, maintenance |

## Reading order

- **Engineers starting implementation:** 15 → 02 → 03 → 04 → 06 → 09
- **Product/business stakeholders:** 01 → 08 → 11 → 14 → 15 §5
- **DevOps:** 02 → 12 → 09 → 05

## Non-negotiable engineering principles

1. **Tenant isolation everywhere.** Every query is scoped by `merchant_id`; PostgreSQL Row-Level Security backs this as defense-in-depth. There is no code path that reads cross-tenant data except the admin surface and the ad-targeting service (which sees only aggregate signals, never raw rows).
2. **The dashboard must feel instant on bad connections.** Aggregates are precomputed at ingestion time and cached; no dashboard request may fan out into raw-row scans. Target p95 < 300 ms for every dashboard read endpoint.
3. **Ingestion never blocks the request path.** Uploads return immediately with a job handle; all parsing happens in workers.
4. **Fail loudly to us, gracefully to merchants.** Every rejected row in an upload is reported back per-row in the merchant's language; every worker exception pages us via Sentry.
5. **Everything metered.** Rate limits, quotas, and entitlements are enforced in one middleware layer driven by the plan table — never hard-coded in endpoints.
