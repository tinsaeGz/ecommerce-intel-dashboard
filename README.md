# E-Commerce Intelligence Dashboard — "Suq Insights"

**Status:** Scope reset to SDLC v4 paid MVP; foundations in development
**API:** FastAPI (Python 3.12) · **Web:** React + TypeScript + vanilla CSS · **Mobile:** Expo/React Native compatibility only until demand-triggered
**DB:** PostgreSQL 16 · **Async work:** durable jobs/workers · **Storage:** private object storage
**Launch language:** Spanish merchant workflow first; English engineering language

Suq Insights is a paid, narrow inventory-decision MVP for a small retailer in one country and one niche. The launch product supports one workspace stock location, one currency, CSV/XLSX ingestion, reviewed SKU mapping, stock counts and movements, deterministic stock/sales summaries, one action screen, email reminders, capped billing, owner/staff access, and export.

[SDLC.md](SDLC.md) is the canonical product, architecture, delivery, and operations specification. It now reflects proposed version 4.0 and supersedes the broader v3 launch assumptions in `docs/`, including image/PDF ingestion, offline mobile entry, customer retention analytics, widget marketplaces, advertising, mixed currencies, multi-location inventory, and broad international expansion. Those capabilities are roadmap items only after the evidence triggers in SDLC v4 are met.

## Documentation index

| Doc | Contents | Authority |
|---|---|---|
| [SDLC](SDLC.md) | Canonical v4 product scope, requirements SI-01…SI-15, architecture, release gates, privacy, and build-to-revenue plan | Authoritative |
| [UI/UX Concept](UI-UX-CONCEPT.md) | Landing-page narrative, visual system, vanilla CSS conventions, component states, responsive behavior, accessibility, localization, and marketing initiatives | Implementation reference where consistent with SDLC v4 |
| [01 — Product Definition](docs/01-product.md) | Earlier v3 product, personas, feature tiers, monetization, and mobile strategy | Legacy reference |
| [02 — System Architecture](docs/02-architecture.md) | Earlier v3 architecture and scale-out assumptions | Legacy reference |
| [03 — Data Model](docs/03-data-model.md) | Earlier v3 PostgreSQL schema and retention design | Legacy reference |
| [04 — API Design](docs/04-api.md) | Earlier v3 endpoint catalog and public sync API assumptions | Legacy reference |
| [05 — Security](docs/05-security.md) | Security controls that may still apply after v4 review | Supporting reference |
| [06 — Ingestion Pipeline](docs/06-ingestion.md) | Earlier ingestion pipeline design | Legacy reference |
| [07 — Analytics Engine](docs/07-analytics.md) | Earlier metric and alerting design | Legacy reference |
| [08 — Ad Engine](docs/08-ads.md) | Advertising design | Roadmap only |
| [09 — Performance](docs/09-performance.md) | Earlier caching, rate limiting, and load assumptions | Legacy reference |
| [10 — Notifications & i18n](docs/10-notifications-i18n.md) | Earlier SMS/email/push and locale assumptions | Legacy reference |
| [11 — Billing & Subscriptions](docs/11-billing.md) | Billing concepts requiring v4 quota/subscription alignment | Supporting reference |
| [12 — Operations](docs/12-operations.md) | Earlier environments, deployment, backup, DR, and observability | Supporting reference |
| [13 — Testing & QA](docs/13-testing.md) | Earlier test pyramid and beta plan | Legacy reference |
| [14 — Roadmap](docs/14-roadmap.md) | Earlier 14-week roadmap | Legacy reference |
| [15 — SDLC](docs/15-sdlc.md) | Earlier SDLC methodology and premium feature register | Legacy reference |

## Reading order

- **Engineers starting implementation:** SDLC → AGENTS → 02 → 03 → 04 → 06, applying SDLC v4 where documents conflict.
- **Product/business stakeholders:** SDLC → 01 → 11 → 14, applying SDLC v4 where documents conflict.
- **DevOps:** SDLC → 12 → 05 → 09, applying SDLC v4 where documents conflict.

## Non-negotiable engineering principles

1. **Tenant isolation everywhere.** Every tenant-owned query is scoped server-side by workspace/merchant identity and backed by PostgreSQL Row-Level Security. Cross-tenant identifiers return not found.
2. **Trust beats automatic acceptance.** Ambiguous source type, item identity, quantity, unit, currency, date, refund/return, or count semantics require review before publication.
3. **Loads publish atomically.** Uploads, parsing, staging, publication, reversal, reminders, exports, and billing side effects run through durable, idempotent jobs and auditable revisions.
4. **Inventory and money are exact.** Use decimal quantities and money, never sum incompatible units or currencies, and trace retained results to source row, model revision, actor, and load.
5. **Everything is bounded.** Quotas, subscription state, export/deletion rights, reminders, and roadmap expansion are enforced centrally from the v4 pilot contract.
