# Phase 0 foundation status

Authority: SDLC v4.0. The product is reset to the bounded paid MVP; Phase 0 remains in progress.

| Scope | State | Evidence or next work |
|---|---|---|
| Monorepo and client boundaries | Implemented | `apps/web`, `apps/mobile`, `apps/api`, and shared packages |
| CI before features | Partial | Affected subsystem gates, security/image scans, and container smoke are wired; GitHub startup, migration/RLS, and authenticated journey gates remain open |
| Development containers | Implemented | `deploy/compose.yml`, container builds, `deploy/smoke.py`, ADR 0001, and scan-clean Phase 0 service images |
| Durable async foundation (SI-11) | Infrastructure partial | Worker pools exist; durable job/outbox semantics still need product implementation |
| Tenant-scoped accounts (SI-01) | Not implemented | Persistent accounts, secure sessions, workspace memberships, owner/staff authorization, CSRF, support/admin MFA, tenant/RLS binding, and negative tests |
| Safe upload foundation (SI-02) | Not implemented | Supported CSV/XLSX receipt, private source storage, quota checks, source hashing, file guardrails, and durable job handle |
| Reviewed mapping and source contracts (SI-03, SI-04) | Not implemented | Consequential ambiguity review, versioned source contracts, repeat-file skip rules, and Spanish merchant review flow |
| Billing and quotas (SI-13) | Not implemented | Trial, active, past-due, grace, read-only, cancellation, quota metering, export/delete exceptions, and webhook idempotency |
| Automatic staging deployment | Not implemented for full stack | Existing Vercel deployment serves the web preview only |
| Phase 0 exit gate | Not met | Tenant/auth slice plus durable upload/parser/review foundation for the first two supported adapter fixtures |

## Next implementation checkpoint

Align the pending authentication and tenant-persistence design with SI-01, then implement the first vertical slice: PostgreSQL migrations and RLS, centralized session and membership middleware, generated API client changes, Spanish-first web flows, CSRF/session negative tests, and a tenant-scoped endpoint through the full middleware chain.

The next ingestion foundation after SI-01 is SI-02: safe CSV/XLSX receipt, private source storage, quotas, source hash, file guardrails, and durable job creation. The review/source-contract work follows as SI-03 and SI-04.

Staging provisioning and encrypted runtime credentials remain external dependencies for the final Phase 0 exit gate. The development Compose environment is not a staging release candidate. Native mobile mutation, offline workflows, document extraction, advertising, public APIs, multi-location inventory, and mixed currencies are roadmap-gated by SDLC v4 evidence triggers.

## Checkpoint validation

- `npm run check`: passed; 43 workspace tests, generated-file checks, lint, TypeScript checks, web bundle budget, and mobile export.
- `npm run check:api`: passed; formatting, lint, strict typing, four tests, and dependency audit. The local application package is not a PyPI audit target.
- Compose `config --quiet` and `up --build --detach --wait`: passed against the system Docker daemon. All nine services became healthy.
- `python3 deploy/smoke.py --env-file deploy/.env.example --project-name suq-phase0-check`: passed with `DOCKER_CONTEXT=default`; same-origin routes, missing assets, PostgreSQL, Redis, object-storage readiness, mail preview, worker queue isolation, and non-root, read-only, memory-bounded application containers verified.
- Smoke-script Ruff formatting/lint and documentation lint: passed.
- Image vulnerability gate: local Trivy validation scanned every compose image reference with zero CRITICAL findings. See `.github/CI.md`; GitHub CI must still pass on the personal repository before merge.
- Authenticated staging, migration/RLS, storage-adapter integration, and v4 ingestion/review journeys are not implemented and have not been run.
