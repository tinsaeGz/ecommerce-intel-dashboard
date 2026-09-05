# ADR 0004: Authentication and tenant persistence foundation

Status: Accepted for Phase 0 implementation planning.

Requirements: FR-A-1, FR-A-2, FR-A-5; SDLC §§5.2, 5.3, 7.2, 8.1, 11;
NFR-8.

## Context

Phase 0 exits only when a user can sign up, log in, and reach a tenant-scoped
endpoint through the full middleware chain on staging. The repository has the
monorepo, CI gates, application entry points, worker queues, and development
containers, but it has no persisted accounts, merchant tenants, sessions,
application database role, Alembic migrations, row-level security, or
middleware tenant binding.

The next implementation PR crosses API, database, generated clients, web
localization, and CI migration gates. The schema and middleware decisions must
therefore be fixed before adding tables so implementation does not spread auth,
entitlement, and tenant checks across endpoints.

## Decision

Implement the first auth and tenant vertical slice around a small persistence
core:

- `merchants` is the tenant root. It stores workspace identity, plan key,
  status, locale/timezone defaults, and audit timestamps.
- `users` belongs to one merchant for Phase 0. It stores email identity,
  display name, password hash, email verification state, role, locale, status,
  and audit timestamps. Future multi-workspace membership must be introduced by
  a membership table instead of overloading Phase 0 users.
- `email_verification_tokens` stores one-way token hashes, expiry, attempts,
  consumed time, and request metadata. Raw verification tokens are shown or sent
  once and never stored.
- `refresh_tokens` stores one-way token hashes, token family, expiry,
  revocation, replacement lineage, user agent hash, IP hash, and request
  metadata for refresh rotation and reuse detection.
- `audit_events` records authentication, verification, refresh reuse,
  role/status, and tenant-scope security events with merchant and actor fields
  where available.

Use Argon2id for password hashes with the parameters in `docs/05-security.md`.
Access tokens are 15-minute signed JWTs carrying `sub`, `mid`, `role`, `plan`,
and `jti`. Web login sets httpOnly Secure cookies; non-web clients receive the
token pair in the response body. Refresh tokens last 30 days and rotate on every
refresh. Reusing a revoked refresh token revokes the whole family and forces
re-authentication.

The middleware chain remains one funnel in this order: request ID/tracing, body
size guard, authentication, tenant resolution and database binding, entitlement
snapshot, rate limiting, idempotency, and conditional reads. Endpoints receive a
principal and tenant-scoped database session from shared dependencies. They do
not parse cookies, validate JWTs, load plans, or set RLS themselves.

Every tenant-owned ORM query must include `merchant_id` explicitly and execute
under PostgreSQL RLS. Tenant-bound database transactions set
`app.current_merchant_id` with `SET LOCAL`; tenant tables use policies of the
form `merchant_id = current_setting('app.current_merchant_id')::uuid`. The
application role must not own tables and must not have `BYPASSRLS`. Migration or
admin roles remain separate from runtime roles.

Cross-tenant behavior is out of scope for this slice except for returning
not-found on cross-tenant identifiers. Platform admin, advertiser, team
membership, API keys, password reset, phone verification, and TOTP remain later
vertical slices, but the table and middleware design must not block them.

## Migration and CI requirements

The implementation PR that adds these tables must also add Alembic and a real
migration harness. The migration gate stops being “not applicable” as soon as
schema artifacts exist. That same PR must validate:

- upgrade from an empty Phase 0 database into the new schema;
- runtime app-role permissions cannot bypass RLS;
- authenticated merchant A receives not-found for merchant B resources;
- refresh rotation revokes token families on reuse;
- email verification gates upload-capable state;
- generated OpenAPI and `packages/api-client` are committed with API changes;
- web auth copy exists in English, Spanish, and French;
- auth endpoints emit structured, scrubbed logs and stable problem codes.

## Consequences

The first implementation PR can remain narrow while proving the hardest product
invariant: tenant identity is bound once and enforced twice. CI will still run
full backend, contract, frontend, migration, security, and container gates for
that change.

The Phase 0 auth slice will not complete billing, team administration, SMS,
TOTP, API keys, ingestion, or the full staging release gate. Those remain
separate PRs with their own requirement evidence.
