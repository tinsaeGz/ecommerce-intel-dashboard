# 15 — Software Development Life Cycle (SDLC)

This document defines *how* the product is built and operated over its life: methodology, roles, phase gates, engineering standards, release and change management, and maintenance. It binds the other documents together — requirements here trace into the designs (02–12), the test strategy (13), and the roadmap (14). Special attention is given to the **premium feature set** (§5): premium is the revenue line, so every premium feature carries formal requirements, acceptance criteria, and its own launch gates.

## 1. Methodology

- **Model:** iterative-incremental (Scrum-flavored) inside the phased roadmap of [14-roadmap.md](14-roadmap.md). Each roadmap phase = 1–2 sprints of 2 weeks.
- **Cadence:** sprint planning (Mon, 1 h) → daily async standup (written, in the team channel — the team may span timezones) → sprint review with a demo on staging (every 2nd Fri) → retrospective (30 min, actions tracked as issues).
- **Definition of vertical slice:** every sprint delivers user-visible behavior through the full stack (API + worker + UI + tests + docs), never a "backend-only sprint". This is what makes the fallback launches in the roadmap's risk register possible.
- **Work tracking:** GitHub Issues + Projects. Issue types: `feature`, `bug`, `tech-debt`, `security`, `ops`. Every feature issue links its requirement ID (§4/§5).

## 2. Roles & responsibilities (RACI summary)

| Activity | Product owner | Tech lead | Backend eng | Frontend eng | DevOps |
|---|---|---|---|---|---|
| Requirements & prioritization | **A/R** | C | C | C | C |
| Architecture / ADRs | C | **A/R** | R | R | C |
| Implementation | I | A | **R** | **R** | R |
| Code review | — | A | **R** | **R** | R |
| Test strategy & gates | C | **A** | R | R | R |
| Release approval (prod gate) | **A** | **R** | C | C | R |
| Incident command | I | **A** | R | R | **R** |
| Security reviews | I | **A/R** | R | R | R |

At a 4-person team, roles are hats, not headcount — but the *approval* points (release gate, ADR acceptance, security sign-off) are always explicit, named, and logged.

## 3. Lifecycle phases & gates

Every feature — and premium features especially — moves through these gates. Small changes may compress gates into a single PR; they may not skip them.

```
Idea → Requirement (ID'd, acceptance criteria) → Design note/ADR → Implementation (PR)
     → Review (code + security touchpoints) → Test gates (CI) → Staging verify
     → Release (flagged) → Post-release verification → Operate/Maintain
```

| Gate | Enforced by | Criteria |
|---|---|---|
| G1 Requirement ready | Product owner | Requirement has ID, user story, acceptance criteria, tier assignment (free/premium/both), i18n note |
| G2 Design accepted | Tech lead | Design note or ADR for anything crossing a module boundary, adding a table, or touching money/entitlements |
| G3 Merge | CI + 1 reviewer | All CI checks green ([13-testing.md](13-testing.md)); reviewer checklist (§6) |
| G4 Staging verified | Feature author | E2E journey updated/added; demoed in sprint review |
| G5 Release | Product owner + tech lead | Release checklist ([13-testing.md §6](13-testing.md)); premium features additionally pass the premium launch gate (§5.4) |
| G6 Post-release | Author | Metrics/alerts confirm behavior for 48 h; issue closed with links |

## 4. Requirements management

- **ID scheme:** `FR-<area>-<n>` functional, `NFR-<n>` non-functional, `FR-P-<n>` premium-tier functional (§5). IDs are permanent; requirements live in `docs/requirements/` as one file per area, reviewed via PR like code.
- Each requirement: user story, acceptance criteria (Given/When/Then), tier, locales affected, data-privacy note, tracing links (design doc §, test IDs, endpoints).
- **Traceability rule:** a PR that implements a requirement references its ID; the E2E suite tags tests with IDs; the release notes list shipped IDs. `scripts/trace-report` cross-references and flags orphans (requirement with no test, test with no requirement).
- **Non-functional requirements** are the budgets already defined elsewhere and are treated as requirements with the same discipline: NFR-1 dashboard p95 < 300 ms; NFR-2 ingestion p95 < 60 s/10 MB; NFR-3 99.5% availability; NFR-4 RPO 15 min/RTO 2 h; NFR-5 WCAG 2.1 AA on merchant-facing screens; NFR-6 < 0.5% missing-translation renders (es/fr); NFR-7 SLO'd rate limits per [09-performance.md §5](09-performance.md).

## 5. Premium feature set (formal register)

Premium is the paid contract with the customer. Its features get the strictest lifecycle: explicit requirements below, entitlement-gated implementation, dedicated E2E journeys, and a launch gate (§5.4). Source of truth for gating is the `plans.entitlements` JSON ([11-billing.md §3](11-billing.md)) — **every FR-P maps to exactly one entitlement key.**

### 5.1 Register

| ID | Feature | Entitlement key | Acceptance criteria (summary) | Design | Verified by |
|---|---|---|---|---|---|
| FR-P-1 | Unlimited data history | `history_days: null` | Dashboard, orders browse, and exports return data beyond 90 d; downgrade hides (not deletes) history; re-upgrade restores instantly (< 60 s cache flip) | [03 §10](03-data-model.md), [11 §2](11-billing.md) | E2E-7 |
| FR-P-2 | Predictive inventory alerts | `predictive_alerts` | Holt-Winters forecast replaces moving average when ≥ 6 wks history; alert fires on forecast depletion date; falls back to moving average gracefully | [07 §1](07-analytics.md) | E2E-4, unit `domain/forecast` |
| FR-P-3 | SMS alert channel | `sms_alerts` | SMS sent only with verified phone; localized template; quiet hours; per-merchant daily cap with digest collapse; delivery status visible | [10 §2](10-notifications-i18n.md) | E2E-4 |
| FR-P-4 | Email alert channel | `email_alerts` | Per-rule opt-in; localized; bounce suppression surfaces banner | [10 §2](10-notifications-i18n.md) | E2E-4 |
| FR-P-5 | Sync API access | `sync_api` | Owner can create/revoke scoped keys; batch endpoints idempotent per row fingerprint; per-key rate limit from plan (`api_rate_per_min`); keys suspended (not deleted) on downgrade | [04 §4](04-api.md), [05 §3](05-security.md) | E2E-5 |
| FR-P-6 | Upload capacity ×10 | `uploads_per_day: 50`, `upload_max_mb: 50` | Caps enforced pre-auth (edge) and post-auth (quota); failed uploads refund quota | [06 §5](06-ingestion.md) | integration quota suite |
| FR-P-7 | Team seats (5) | `seats: 5` | Owner invites staff by email; staff role excludes billing/team/API keys; seat deactivation on downgrade per policy, reactivation on re-upgrade | [05 §2](05-security.md), [11 §2](11-billing.md) | E2E-7 |
| FR-P-8 | Ad-free workspace | `ad_free` | `GET /v1/ads/slots` returns 204 for premium — enforced server-side; zero ad assets requested by client | [08 §1](08-ads.md) | E2E-4 |
| FR-P-9 | Full data export | `export_full` | Export any date range as CSV/XLSX; formula-injection-neutralized; delivered via presigned URL; job quota 5/day | [04 §4](04-api.md), [05 §5](05-security.md) | integration export suite |
| FR-P-10 | Priority support | `priority_support` | In-app support entry point with SLA badge; requests tagged premium in the support queue (response SLA: 1 business day) | ops process | manual QA |

### 5.2 Premium engineering rules

1. **One gate layer.** A premium check appears in exactly one place per concern (entitlements middleware / `require_entitlement` dependency / query-window helper) — never duplicated in UI logic alone. UI hides what the API forbids; the API is the enforcement.
2. **Fail toward the customer's paid state.** If the entitlement cache is unavailable, a paying merchant must not lose premium behavior: the middleware falls back to the last-known snapshot (Redis 2× TTL envelope), never to free.
3. **Downgrade is reversible by design.** No premium-flagged code path may destroy data on downgrade; visibility changes only (FR-P-1, FR-P-7 policies).
4. **Every FR-P has a paired negative test:** the same action attempted on the free tier must fail with the documented `code` (`quota.*` / `entitlement.*`) — this is generated into the integration suite from the register.
5. **Price/plan changes are data changes** (plan rows + Stripe products), deployed via migration + config PR with product-owner approval, never a code release.

### 5.3 Upsell surfaces (product requirement, tracked like features)

Free-tier users encounter premium boundaries as designed moments, not dead ends: history scroll edge shows a "your data continues — unlock 13 more months" card (FR-P-1); alert-rule SMS toggle shows plan comparison (FR-P-3); 6th upload of the day offers the capacity comparison (FR-P-6). Each surface is an ID'd requirement (`FR-UP-*`) with copy in all three locales and a conversion metric attached.

### 5.4 Premium launch gate (adds to G5)

A premium feature ships only when: entitlement key wired end-to-end (upgrade *and* downgrade verified in E2E) · negative tests green · billing reconciliation covers it (feature usage vs plan on the daily sweep where applicable, e.g. seats, API keys) · localized in es/fr including its upsell surface · support macro/help-center article written · usage + conversion metrics emitting.

## 6. Implementation standards

- **Branching:** trunk-based. Short-lived feature branches (`feat/<issue>-<slug>`, ≤ 3 days) → PR → squash-merge to `main`. `main` is always releasable; releases are tags (`v1.4.0`). No long-lived develop branch.
- **Feature flags** for anything spanning sprints or risky at launch (platform pseudo-entitlements, [11 §3](11-billing.md)); flags removed within 2 sprints of full rollout (tracked as `tech-debt` issues at creation time).
- **Commits:** Conventional Commits (`feat:`, `fix:`, `perf:`, `sec:`) — release notes and semver bumps derive from them.
- **Code review checklist (G3):** tenant scoping on every new query · entitlement/limit placement per §5.2 · i18n (no hardcoded strings, keys in all 3 catalogs) · error codes registered · migration zero-downtime rules ([03 §11](03-data-model.md)) · metrics/logs for new paths · docs updated in the same PR.
- **Style/static gates:** ruff + mypy(strict in `domain/`) + bandit; eslint + tsc; formatting is auto (no review comments about style).
- **Definition of done:** code + tests + docs + i18n + dashboards/alerts if operational behavior changed + requirement ID linked. "Works on staging" without the rest is not done.

## 7. Release management

- **Cadence:** continuous to staging on merge; prod releases at least weekly, any day except Friday; hotfixes any time via the same pipeline (no side doors).
- **Versioning:** semver on the platform (`vMAJOR.MINOR.PATCH`); API majors are URL-versioned separately ([04 §1](04-api.md)).
- **Pipeline & approval:** per [12-operations.md §3](12-operations.md); the manual prod gate is G5. Release notes generated from commits + shipped requirement IDs; customer-visible changes appended to the public changelog (en/es/fr for premium-relevant changes).
- **Rollback:** image-tag redeploy (migrations backward-compatible by rule); every release records its rollback tag before deploy proceeds.
- **DB changes:** expand → migrate/backfill → contract across ≥ 2 releases; contract steps require tech-lead sign-off in the PR.

## 8. Change & configuration management

- All environments defined in the `deploy/` repo (compose + SOPS secrets); no manual server changes — drift is a P3 incident.
- Config changes (rate-limit tables, plan rows, ad pricing, flags) follow the PR path with the same review as code; secrets rotation per the runbook with audit-log entries.
- Third-party dependency policy: Renovate bot PRs weekly; security patches expedited (criticals within 48 h — pip-audit/Trivy gate); new runtime dependencies require tech-lead approval in review (each one is an operational liability).

## 9. Maintenance & support operations

- **Bug triage:** daily 15-min triage; severity ladder S1 (data corruption/money/security — drop everything) · S2 (feature broken, no workaround — next release) · S3 (workaround exists — sprint backlog) · S4 (cosmetic — batched). Premium-reported bugs get one severity bump at equal impact (the paid SLA, FR-P-10).
- **Support loop:** support issues that reveal parser gaps must produce a fixture ([06 §6](06-ingestion.md)) before the ticket closes — the corpus rule is enforced at triage.
- **Tech-debt budget:** ≥ 15% of each sprint; debt items are issues with an owner, never TODO comments.
- **Deprecation/EOL:** API deprecation per [04 §11](04-api.md); dependency EOL (Python, Postgres majors) planned one minor release ahead on the roadmap.

## 10. Security in the lifecycle (DevSecOps touchpoints)

Threat-model note required at G2 for: new external input surface, new PII field, money paths, auth changes. Automated gates per [05 §11](05-security.md) at G3. Pen-test before launch and annually; findings enter triage as `security` issues with S1/S2 severity. Access reviews quarterly. Secrets never in code — CI secret-scan (gitleaks) blocks the merge.

## 11. Metrics & continuous improvement

- **Delivery (DORA):** deploy frequency, lead time (PR open → prod), change-failure rate, MTTR — reviewed monthly.
- **Quality:** escaped-bug count by severity, flaky-test rate (> 2% quarantines the test with an issue), coverage trend.
- **Product:** activation, conversion, ad fill, upload success, per-FR-P usage — the success metrics of [01 §7](01-product.md) reviewed monthly against targets; premium feature usage feeds the §5.3 upsell iteration.
- **Retro discipline:** every retro produces ≤ 3 actions with owners; unclosed actions surface in the next retro first.

## 12. Documentation lifecycle

Docs 01–15 are living: any PR that invalidates a statement in them updates the doc **in the same PR** (reviewer checklist item). ADRs are append-only (superseded, never edited away). The public-facing docs (Sync API reference, help center in 3 locales) are versioned with the release that changes them. A quarterly docs audit walks the set against reality; drift found is an S3 issue.
