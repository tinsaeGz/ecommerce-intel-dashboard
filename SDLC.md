# Suq Insights — improved product and software development life cycle

**Version:** proposed 4.0
**Date:** 5 September 2026
**Status:** founder and engineering working specification
**Supersedes:** the launch scope of SDLC v3.0. Implementation status remains unverified.

This document is the canonical product, engineering, delivery, and operating specification for Suq Insights. It supersedes older launch assumptions in `docs/`, especially the broader schema-on-read, composable-dashboard, mobile-offline, document-extraction, advertising, and international expansion scope. Those capabilities remain possible roadmap items only after the evidence gates in this document are met.

## 1. Product decision

Suq Insights starts as a paid, narrow inventory-decision MVP for one retail niche, one country, one stock location per workspace, one currency, CSV/XLSX ingestion, reviewed SKU mapping, stock counts and stock movements, one action screen, email reminders, and paid pilot billing.

The launch product is not a generic analytics canvas. It must help a merchant answer one operational question with trust: what should I check, count, reorder, or leave alone this week?

Broader ingestion, customer retention, offline entry, custom widgets, public APIs, advertising, additional markets, multi-location inventory, mixed currencies, and native-first workflows are gated roadmap work. They must not be treated as launch commitments until the corresponding evidence trigger is met.

## 2. Initial customer and launch constraints

The initial customer is the owner or purchasing manager of a non-perishable retailer with 100–2,000 SKUs, item-level records, weekly replenishment, and one physical stock location. The first country is chosen by evidence: ten interviews, five usable file sets, and three paid pilot commitments in the market that reaches that bar fastest.

Spanish is the initial merchant language. English remains the engineering language. Existing English and French interfaces may stay in the product, but launch acceptance is measured first against the Spanish merchant workflow unless a feature explicitly targets another locale.

The MVP includes:

- CSV and XLSX uploads from selected rectangular tables.
- Explicit source, date, currency, and unit settings.
- Two recurring export families from the selected niche/country.
- Merchant-confirmed SKU aliases.
- Sales, supplier receipts, stock counts, explicit stock adjustments, and refunds separated from physical returns.
- Complete load preview and undo.
- Deterministic sales and stock summaries.
- Lead-time-based reorder drafts.
- Export, owner plus one staff account, email reminders, and capped billing.

The proposed pilot limits are one location, 2,000 active SKUs, 10 MB per file, 100,000 rows per file, 100,000 committed rows per workspace per month, and 30 files per month. The product must not promise unlimited ingestion, unlimited history, or unlimited workspaces during the pilot.

The following are not launch capabilities: handwriting, scanned PDFs, XLS, ODS, JSON, arbitrary multi-table workbooks, mixed currencies, multi-location transfers, bundles, serial/lot/expiry inventory, automatic entity merges, customer profiling, autonomous ordering, SMS or WhatsApp notifications, public write APIs, offline stock mutation, widget marketplaces, and ad auctions.

## 3. Functional requirements

| ID | Requirement | Acceptance contract |
|---|---|---|
| SI-01 | Tenant-scoped accounts and owner/staff roles | A user signs in, selects only their workspace, and can perform only role-authorized actions. Cross-tenant resource identifiers return not found. |
| SI-02 | Safe CSV/XLSX submission | The API accepts supported files within quota, stores the source privately, rejects unsafe formats, and returns a durable job handle. |
| SI-03 | Reviewed semantic mapping | The system proposes field roles, units, date handling, and source type, then requires merchant review for consequential ambiguity. |
| SI-04 | Versioned source contract | Repeat imports may skip review only when the source contract, required roles, units, format version, and quality checks still match. |
| SI-05 | Explicit event identity and coverage | Sales, receipts, counts, refunds, returns, adjustments, corrections, and retries have stable identity separate from interpreted values. |
| SI-06 | Staged, atomic load publication | A load preview is staged before publication; commit is atomic and exposes a complete before/after summary. |
| SI-07 | Reversible loads and model revisions | A committed load can be reverted through an audited reversal; mapping/model revisions can re-derive retained history with impact preview. |
| SI-08 | Provenanced inventory balance | Every stock balance is traceable to source row, load, model revision, actor, and workspace while retained. |
| SI-09 | Decision-oriented analytics | The home experience shows freshness, items needing review, deterministic sales and stock summaries, and a single action list. |
| SI-10 | Reviewed replenishment draft | Reorder recommendations are drafts based on explicit lead time, review interval, demand estimate, buffer, pack size, and merchant confirmation. |
| SI-11 | Durable asynchronous work | Parsing, staging, publication, reversal, reminders, and exports survive worker crashes and retry idempotently. |
| SI-12 | Deduplicated reminders | Email reminders are opt-in, rate-limited, idempotent, and never duplicated by retry or provider callback ordering. |
| SI-13 | Billing and quotas | Paid pilot limits, subscription state, dunning, grace, read-only mode, quota metering, export, and deletion are enforced centrally. |
| SI-14 | Privacy lifecycle | Source blobs, raw values, staging data, generated exports, logs, audit events, backups, and deletion requests follow explicit retention rules. |
| SI-15 | Evaluation and auditability | Supported fixtures, adversarial cases, release journeys, quality thresholds, and model/version changes are measured before release. |

Completeness outranks acceptance rate. A row that is skipped, staged for review, or marked unknown is safer than a row that silently changes stock, money, currency, unit, date, or item identity.

## 4. Merchant ingestion workflow

The ingestion workflow is:

```text
submit → inspect → propose → review → stage → publish → reconcile
```

The merchant declares the source: POS sales, supplier receipt, or physical count. The product must not infer channel intent from values alone. The source contract records the expected roles, unit, currency, date rules, file shape, and quality checks.

The review step asks only for consequential ambiguity: source type, item identifier, quantity semantics, date interpretation, unit, currency, receipt versus sale, refund versus return, and whether a count is a checkpoint. Low-risk formatting details can be proposed automatically, but the preview must show interpreted values before commit.

Publication creates a load revision. Reconciliation then shows whether the new data changed inventory position, freshness, duplicate status, or action recommendations.

The load state machine is:

```text
RECEIVED → INSPECTING → NEEDS_REVIEW → READY → COMMITTING → COMMITTED
```

`VALIDATION_FAILED` and `EXPIRED` are terminal draft states. A committed load can become `REVERTED` only through an audited reversal. Repeat files skip review only when the source contract, required roles, units, format version, and quality checks match; a structural fingerprint alone is not enough.

## 5. Input security guardrails

The upload pipeline must:

- Allow only supported formats and content signatures.
- Cap bytes, sheets, cells, rows, columns, and parse time.
- Disable macros, external links, formula execution, and remote references.
- Run parsing in isolated workers without general network access.
- Store original source blobs privately and never serve them directly.
- Never interpolate file content into shell commands.
- Record source hash, parser version, source contract version, and model revision.

## 6. Data model

The v4 data model centers on these entities:

- `Workspace` and `Membership` for tenant and role boundaries.
- `SourceChannel` for merchant-declared source intent.
- `SourceBlob` or `Upload` for retained input material and metadata.
- `ModelRevision` and `RawRow` for interpretation history.
- `Item` and `ItemAlias` for reviewed SKU identity.
- `Load` and `EventRevision` for staged and committed facts.
- `CountCheckpoint` for physical-count anchors.
- `StockProjection` and `DailyMetric` as rebuildable caches.
- `Finding` and `ReorderDecision` for reviewed actions.
- `Job`, `Outbox`, and `Notification` for durable async work.
- `Subscription` and `AuditEvent` for quotas, billing, and governance.

The following invariants are mandatory:

- Event identity is immutable and independent of interpreted amount, date, currency, or unit.
- Quantities and money use decimal types. Incompatible units or currencies are never summed.
- Every retained stock or money result traces to source row, model revision, actor, and load.
- Stock projections are rebuildable caches, not editable truth.
- Publication is atomic per load revision.
- Tenant identity is assigned server-side. Request bodies cannot change it.
- Start with ordinary indexed PostgreSQL tables. Partition only after observed volume requires it.

## 7. Duplicate, overlap, reversal, and recomputation rules

The system must handle three duplicate classes independently: file retry, event retry, and overlapping exports that lack stable IDs.

File retry is detected by source hash and workspace. Event retry uses source contract, row identity, event identity, and source-specific identifiers when available. Overlapping exports are reconciled through preview, not hidden by broad deduplication.

Reversals and corrections use immutable revisions and supersession links. An owner model change creates an impact preview before it changes retained history. Reversal rebuilds stock and metrics from the preceding valid checkpoint and intervening events; it is not a blind opposite-sign insert.

The inventory key is `workspace + item + location + base unit`.

A representative balance sequence is: count 50, sell 12 leaves 38, receive 8 leaves 46, repeated receipt stays 46, late covered sale before the count leaves 46, reversing the receipt leaves 38, and a corrected count leaves 35.

## 8. Analytics and replenishment

The launch application has one action screen, not a blank dashboard canvas. It shows data freshness, ingestion status, items needing review, sales summary, inventory risk, and replenishment drafts.

The baseline replenishment formula is:

```text
target stock = estimated daily demand × (lead time + review interval) + buffer units
draft = max(0, target stock − inventory position), rounded by pack size
```

Forecasting or AI output cannot calculate authoritative money, stock, changed meaning, or purchase orders. A recommendation is a draft that requires merchant review. Forecast model promotion requires evidence from locked holdout fixtures and real pilot outcomes.

## 9. Architecture and processing

The launch architecture is a smaller modular web application:

- React frontend.
- Python API and worker processes.
- PostgreSQL.
- Private object storage, preferably managed during paid pilot if cost fits.
- Email and hosted-payment adapters.

Core modules are identity, ingestion, interpretation, inventory, analytics, decisions, billing, and operations.

The API and workers remain stateless. Heavy work runs asynchronously. Durable jobs and a transactional outbox are required for publication, reminders, exports, and billing side effects. Redis may be used as a cache or transport optimization, but correctness must not depend on disposable cache data. A broker and cache must not share an eviction domain only by using separate logical database numbers.

## 10. API, authorization, and subscription states

The launch API endpoint families are:

- `POST /uploads`
- `GET /uploads/{id}/preview`
- `POST /loads/{id}/commit`
- `POST /loads/{id}/revert`
- `GET /inventory`
- `POST /decisions/{id}/review`
- `POST /exports`
- `POST /billing/webhook`

Authentication, membership, action authorization, object authorization, entitlements, quota checks, rate limits, idempotency, and conditional requests live in shared middleware or service layers, not endpoint-specific conditionals.

Web sessions use secure `HttpOnly` cookies and CSRF protection. Platform admins and support users require MFA. Support access must be audited and scoped.

Pilot subscription states are:

```text
TRIAL → ACTIVE → PAST_DUE → GRACE → READ_ONLY
```

`GRACE` lasts seven days. `CANCELLING` remains active through the paid period, then transitions to `READ_ONLY`. Export and deletion remain available regardless of paid subscription state.

## 11. Privacy and retention

The MVP does not need customer identities. The system rejects or removes named customer, phone, email, address, and unrelated free-text fields by default unless a later lawful product decision explicitly adds that scope.

Retention rules:

| Data | Retention |
|---|---|
| Original source blob | 30 days |
| Allowed raw values, events, and decisions | 13 months while paid |
| Unconfirmed or failed staging data | 7 days |
| Generated exports | 24 hours |
| Operational logs | 30 days |
| Minimal security and audit events | 12 months |
| Backups | 30-day rolling window with deletion-journal replay |

Jurisdiction-specific notices are required before launch. Mexico privacy assumptions from older documents must be rechecked because Mexican privacy law changed in 2025.

## 12. Evaluation and release quality

The evidence corpus must contain 30–50 permissioned or deidentified files from at least five merchants and two export families, plus adversarial synthetic fixtures. Splits are by merchant and export family, with a locked holdout set.

Release conditions:

- Stock and money arithmetic is exact on deterministic fixtures.
- There are zero known high-risk semantic auto-commits.
- High-confidence proposals target at least 99% precision on critical fields.
- Median time to first verified result is at most 15 minutes.
- Repeat import time is at most five minutes.
- Model changes show no material regression on the locked corpus.
- Reliability recovery scenarios produce correct final state.

Required test layers are unit and property tests, integration tests against real PostgreSQL and object storage, end-to-end journeys, and security tests for tenant isolation, upload safety, auth/session behavior, billing webhooks, and privacy deletion/export.

The release journey suite must cover: Spanish comma-decimal files with ambiguous dates and footers; same upload retry and identical sales; overlapping POS and manual summaries; count, sale, receipt, reversal, and corrected count sequences; late events before counts; wrong units, missing receipts, negative stock, and damaged returns; model revisions that move rows; worker crashes before and after commit; cross-tenant URLs, jobs, exports, and pooled database access; duplicate and out-of-order payment events; export/delete plus backup restore; and provider/model/email outages.

## 13. Service objectives

Pilot service objectives are:

- 99.5% monthly availability for authenticated reads and accepted writes.
- 20 concurrent dashboard users and two simultaneous 10 MB supported CSV imports.
- Authenticated read p95 under 500 ms.
- Supported CSV processing under two minutes, excluding human review.
- Supported XLSX processing under five minutes, excluding human review.
- RPO at most 15 minutes and RTO at most two hours.
- WCAG 2.2 AA for merchant-facing screens.
- Spanish launch text and mobile layouts validated on a slow-network profile.

## 14. Build-to-revenue plan

Evidence-ready discovery runs for days 1–14:

- Interview ten buyers.
- Inspect five real file sets.
- Offer a bounded paid pilot.
- Observe one ordering cycle.
- Select the first country and two export families by evidence.
- Verify entity, payment, privacy, and support constraints.

Continue only with three paid commitments or an explicit one-more-test reason.

After discovery, the build interval is:

| Weeks | Scope |
|---|---|
| 1–2 | Tenant/auth slice, durable upload, parser, review flow, and two adapter fixtures |
| 3–4 | Event identity, count/movement ledger, reversals, and action screen |
| 5–6 | Replenishment review, reminders, paid plan, deletion/export, and operations |
| 7–8 | Fixes, security, load validation, and onboarding |

Pilot pricing to test is a US$75–150 equivalent setup/review fee for four weeks, followed by a US$29/month equivalent capped workspace.

By day 60, target five pilots, at least three paying, and first weekly reviews. By day 90, four of five pilots should complete three of four weekly reviews, at least three should renew, repeat import should be under five minutes, and support should be under 15 minutes per workspace per month.

## 15. Expansion triggers

Expansion work requires evidence:

| Capability | Trigger |
|---|---|
| Images, PDFs, or handwriting | Five prospects are blocked by visual-only sources and benchmark quality is acceptable. |
| Offline or native mobile stock mutation | Observed connectivity or capture failures block retained customers. |
| Customer retention | Repeated-buyer identity is lawful, useful, and requested by paying merchants. |
| Public Sync API or POS connectors | Three retained customers or a paid partner need the same adapter. |
| Multi-location or mixed currency | Paying customers need it and the inventory/money model can preserve correctness. |
| Custom widgets | Buyers cannot answer useful questions from the fixed action screen. |
| French or English market expansion | First-market renewals and support economics are proven. |
| SMS or WhatsApp | Email and in-app reminders are insufficient, and consent, provider, and cost constraints are verified. |
| Advertising | Merchant retention is proven, advertiser demand is pre-sold, and recommendation integrity is protected. |

## 16. What changed from v3

The original v3 chapters remain useful background but no longer define launch scope.

| v3 area | v4 treatment |
|---|---|
| Broad international SaaS | Narrow paid pilot in one country and niche. |
| Schema-on-read for many messy sources | Reviewed CSV/XLSX source contracts for two recurring export families. |
| Image/PDF/document extraction | Roadmap gated by demand and benchmark proof. |
| Composable dashboard/widget marketplace | One decision-oriented action screen. |
| Customer retention analytics | Deferred until lawful repeated-buyer identity is validated. |
| Offline/native/mobile mutation | Roadmap gated by observed operational failure. |
| Ads and advertiser billing | Deferred until merchant retention and advertiser demand are proven. |
| 97% accepted rows style target | Replaced by completeness, auditability, and zero high-risk semantic auto-commit. |
| Faster dashboard/ingestion targets | Replaced by pilot-scale targets that prioritize correctness and review. |

## 17. Source notes

This version incorporates the September 5, 2026 improved SDLC amendment supplied as `Suq_Insights_Improved_SDLC_v4.docx`. External legal, payment, and provider references in that document must be verified again before launch decisions that depend on them.
