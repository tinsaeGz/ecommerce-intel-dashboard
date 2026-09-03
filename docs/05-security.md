# 05 — Security

Commercial posture: assume hostile input everywhere, assume credential stuffing from day one (phone/password auth in a market with heavy password reuse), assume uploaded files are attack vectors.

## 1. Authentication

- **Passwords:** argon2id (memory 64 MB, t=3, p=4); minimum 8 chars checked against a top-10k breached list; no composition rules (NIST 800-63B).
- **Email-first identity:** signup with email + verification link/code. Phone is optional and verified via SMS OTP (6 digits, 10-min expiry, 5 attempts, then 15-min lock) only when the merchant enables the SMS alert channel. OTP endpoints remain the most abusable surface → strictest rate limits ([09-performance.md §5](09-performance.md)) + per-destination daily SMS cap (protects our SMS budget from pumping fraud — international SMS pumping via premium-rate ranges is an active, expensive attack; high-risk country prefixes with no merchant base are blocklisted at the provider level).
- **Sessions (web):** JWT access token (15 min, `HS256` with rotated secret; claims: `sub`, `mid`, `role`, `plan`, `jti`) in httpOnly Secure cookie + rotating refresh token (30 d) in httpOnly cookie scoped to `/v1/auth/refresh`.
- **Refresh rotation with reuse detection:** each refresh issues a new token in the same `family_id`; presenting a *revoked* member of a family (theft signal) revokes the whole family and forces re-login. Audit-logged.
- **2FA:** TOTP optional for all, required for `platform_admin` and advertiser accounts with wallet access.
- **Account lockout:** progressive delay (2^n seconds up to 15 min) per account+IP after failed logins; CAPTCHA (self-hosted ALTCHA proof-of-work — no third-party beacon) after 3 failures.

## 2. Authorization (RBAC)

| Role | Scope |
|---|---|
| `owner` | Full merchant workspace incl. billing, team, API keys |
| `staff` | Dashboard, uploads, alerts; **no** billing/team/API keys |
| `advertiser` | Advertiser portal only; no merchant data |
| `platform_admin` | Admin surface; every action audit-logged; IP-allowlisted; 2FA enforced |

Enforcement is centralized: FastAPI dependency `require(permission)` mapping role→permission set; endpoints declare permissions, never check roles inline. Object-level checks always re-verify `merchant_id` ownership (no IDOR via UUID guessing — UUIDs are not authorization).

## 3. API keys (Sync API)

- Format `sqk_live_<32 bytes urlsafe>`; shown once; stored as SHA-256 hash; prefix retained for UI identification.
- Scoped (`sync:read`, `sync:write`), optional expiry, instant revocation (key cache in Redis invalidated on revoke), `last_used_at` surfaced in UI.
- Creation/revocation audit-logged and notifies the owner (SMS/email).

## 4. Tenant isolation

- Every ORM query goes through a tenant-scoped session helper; code review rule: raw queries must bind `merchant_id`.
- **PostgreSQL RLS** on all tenant tables: `USING (merchant_id = current_setting('app.current_merchant_id')::uuid)`. App role has no `BYPASSRLS`. Set per-transaction via `SET LOCAL`.
- Celery tasks receive `merchant_id` explicitly and open scoped sessions the same way.
- Cross-tenant surfaces (admin, ad targeting) use a distinct DB role; ad targeting reads only aggregate signal tables, never raw orders.

## 5. File upload security (critical surface)

1. Size cap enforced at Caddy (before app) per route: 10/50 MB by tier (app re-checks post-auth).
2. Content sniffing: magic bytes must match claimed type (CSV/TSV/XLSX only); XLSX = zip → validated with bounded decompression (zip-bomb guard: max 200 MB decompressed, max 50k rows v1, depth 1).
3. Files stream directly to MinIO (private bucket, SSE encryption); never executed, never served back raw — error reports are regenerated files, downloads only via short-lived presigned URLs.
4. CSV parsing in workers only, inside resource-limited containers (CPU/memory ulimits); parser timeouts kill runaway jobs.
5. **CSV formula injection:** on any export we generate, cells beginning with `= + - @ \t` are prefixed with `'` — merchant exports get opened in Excel.
6. Filenames sanitized to a generated key; original name stored as metadata only.
7. ClamAV scan of XLSX uploads (async, quarantines on hit) — cheap insurance for a commercial product.

## 6. Web app security

- **CSP:** `default-src 'self'`; no inline script (Vite nonce-based); `frame-ancestors 'none'`; images from self + MinIO presigned host.
- **CSRF:** SameSite=Lax cookies + double-submit token header (`X-CSRF-Token`) on all mutations.
- Headers: HSTS (preload), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal.
- CORS: exact-origin allowlist (app domains); Sync API allows no browser origins (keys must not live in browsers).
- All user-generated strings rendered as text (React default); ad creatives are plain-text fields + reviewed image, never HTML.

## 7. Payment & webhook security

- We never touch card credentials — always provider-hosted checkout (Stripe Checkout / customer portal; same rule for any regional provider added later). SAQ-A PCI scope only.
- Inbound webhooks: signature verification (Stripe `Stripe-Signature` HMAC), ±5-min timestamp tolerance, idempotent on event id / `provider_ref` (unique), processed in workers. **Amount/currency/status re-verified by retrieving the object from the provider's API before crediting** — never trust webhook payloads alone.
- Wallet math: integer micro-units only; ledger append-only; wallet balance updated in the same transaction as the ledger row with `CHECK (balance >= 0)` and row lock.

## 8. Secrets & data protection

- Secrets via environment from SOPS-encrypted files in the deploy repo (age keys held by 2 people); never in images or code. Rotation runbook per secret.
- App-level encryption (AES-GCM, key in env) for: TOTP secrets, SMS provider tokens stored per-integration.
- PII inventory: names, phones, emails (merchants/users); customer analysis uses **hashed** `customer_key` (HMAC with per-merchant salt) — we deliberately avoid storing merchants' customers' raw phone numbers when a hash suffices for retention analytics. If raw values arrive in a mapped column, only the hash is persisted.
- Backups encrypted (see [12-operations.md](12-operations.md)); TLS 1.2+ everywhere; Postgres/Redis/MinIO bound to the private Docker network only.
- Logs: structured, with a scrubbing processor that redacts passwords, tokens, OTPs, phone numbers (last 4 kept).

## 9. Privacy & compliance

- **GDPR is the governing regime** (France/EU merchants and EU hosting) and the design bar for all markets: lawful-basis records, DPAs with subprocessors, data-subject access/portability/erasure rights (self-serve export + deletion flows), 72-hour breach notification, records of processing. Mexico's **LFPDPPP** and other LATAM regimes are covered by the same posture (privacy notice, consent for marketing, ARCO rights map onto GDPR flows). Data residency: production and backups in the EU; this is a selling point, state it on the privacy page.
- Cookie/consent: the app itself uses only strictly-necessary cookies (session, CSRF) — no consent banner needed in-app; the marketing site treats analytics under a consent manager.
- **Merchant data promise (product-level):** advertisers never receive merchant-identifiable data; targeting is contextual only; stats returned to advertisers are aggregates with a minimum bucket size of 5 merchants.
- Account deletion: soft-suspend 30 days → hard delete (rows + S3 objects + backups noted in deletion log with completion date after backup rotation).
- Data-processing register + subprocessor list (SMS provider, payment providers, hosting) maintained in this repo.

## 10. Abuse & fraud controls

| Threat | Control |
|---|---|
| OTP/SMS pumping | Per-destination daily caps, per-IP caps, disposable-range blocklist, spend alarm on SMS cost metric |
| Credential stuffing | Progressive lockout, ALTCHA, breached-password list, login anomaly audit |
| Ad click fraud (advertisers billed per click) | Signed single-use nonce per served slot; server-side dedup key; per-merchant-viewer click caps; IP/UA heuristics; billing only for validated events; advertiser-visible "invalid clicks filtered" stat |
| Free-tier quota evasion (multi-accounting) | Email verification required for uploads; disposable-email-domain blocklist; device/IP heuristics flag, not block |
| Zip bombs / parser DoS | Bounds in §5; worker memory limits; per-merchant one concurrent parse job |

## 11. Security process

- Dependency scanning (pip-audit + npm audit) and image scanning (Trivy) in CI, blocking on criticals.
- Static analysis: ruff + bandit (backend), eslint-security (frontend) in CI.
- Pre-launch: external penetration test focused on tenant isolation, upload pipeline, payment flows.
- `security.txt`, responsible-disclosure inbox, incident-response runbook ([12-operations.md §9](12-operations.md)).
- Quarterly access review (DB roles, admin accounts, provider dashboards).
