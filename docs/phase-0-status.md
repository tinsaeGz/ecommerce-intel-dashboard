# Phase 0 foundation status

Authority: SDLC v3.0 §11. Phase 0 remains in progress; Phase 1 has not started.

| Scope | State | Evidence or next work |
|---|---|---|
| Monorepo and client boundaries (§7.1) | Implemented | `apps/web`, `apps/mobile`, `apps/api`, and shared packages |
| CI before features (§9.2) | Partial | Affected subsystem gates, security/image scans and container smoke are wired; GitHub startup, real migrations and authenticated journey gates remain open |
| Development containers (§9.1) | Implemented | `deploy/compose.yml`, container builds, `deploy/smoke.py`, ADR 0001 |
| Isolated worker queues (§5.2) | Infrastructure implemented | Ingest, fast, and reports pools; real task routing follows task implementation |
| Core middleware (§5.3) | Not implemented | Request tracing, body guard, authentication, tenant/RLS binding, entitlements, limits, idempotency, conditional reads |
| Authentication (FR-A-1, FR-A-2, FR-A-5) | Not implemented | Persistent accounts, secure sessions, verification, roles, three-locale web flows and negative tests |
| Automatic staging deployment (§9.2) | Not implemented for full stack | Existing Vercel deployment serves the web preview only |
| Phase 0 exit gate (§11) | Not met | Signup, login, tenant-scoped endpoint through full middleware on staging |

## Next implementation checkpoint

Record the authentication and tenant-persistence design before adding tables.
Implement the first authentication vertical slice across PostgreSQL migrations
and RLS, centralized middleware/services, the generated API contract/client,
and the English, Spanish, and French web flows. Include real-service tenancy
and session negative tests. The local database administrator must never become
the runtime application's database role. Extend readiness to check the actual
dependencies once adapters exist.

Staging provisioning and encrypted runtime credentials are external dependencies
for the final Phase 0 exit gate. The development Compose environment is not a
staging release candidate. Native product delivery remains demand-triggered.

## Checkpoint validation

- `npm run check`: passed; 43 workspace tests, generated-file checks, lint,
  TypeScript checks, web bundle budget, and mobile export.
- `npm run check:api`: passed; formatting, lint, strict typing, four tests, and
  dependency audit (the local application package is not a PyPI audit target).
- Compose `config --quiet` and `up --build --detach --wait`: passed against the
  system Docker daemon. All nine services became healthy.
- `python3 deploy/smoke.py --env-file deploy/.env.example --project-name suq-phase0-check`:
  passed with `DOCKER_CONTEXT=default`; same-origin routes, missing assets,
  PostgreSQL, Redis, object-storage readiness, mail preview, worker queue
  isolation, and non-root, read-only, memory-bounded application containers
  verified.
- Smoke-script Ruff formatting/lint and documentation lint: passed.
- Image vulnerability gate: local Trivy validation scanned every compose image
  reference with zero CRITICAL findings. See `.github/CI.md`; GitHub CI must
  still pass on the personal repository before merge.
- Authenticated staging, migration/RLS, and storage-adapter integration gates
  are not implemented and have not been run.
