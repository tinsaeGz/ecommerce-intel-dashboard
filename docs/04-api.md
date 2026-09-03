# 04 — API Design

One versioned REST API serves web, mobile, and the premium Sync API. FastAPI routers under `/v1`; OpenAPI schema auto-published at `/v1/openapi.json` (public docs rendered for Sync API endpoints only; internal endpoints tagged `x-internal` and stripped from public docs).

## 1. Conventions

- **Versioning:** URL prefix (`/v1`). Breaking changes → `/v2` with ≥ 6-month overlap. Additive changes (new fields, new endpoints) are not breaking; clients must ignore unknown fields.
- **Naming:** plural nouns, kebab-free snake_case JSON fields, no verbs in paths except explicit actions (`/alerts/{id}/acknowledge`).
- **Time:** all timestamps ISO-8601 UTC (`2026-09-01T10:00:00Z`). Date-bucketed analytics accept/return merchant-local `date` values; the server does timezone bucketing.
- **Money:** string decimals (`"1249.50"`) + `currency`, never floats.
- **IDs:** UUIDs as strings.
- **Locale:** `Accept-Language` honored for error messages and localized content; explicit `?locale=` overrides.
- **Compression:** brotli/gzip at the edge. **Every response** carries `X-Request-ID`.

## 2. Error model (RFC 9457 problem+json)

```json
{
  "type": "https://docs.suqinsights.com/errors/quota-exceeded",
  "title": "Upload quota exceeded",
  "status": 429,
  "detail": "Free plan allows 5 uploads per day. Quota resets at 2026-09-02T00:00:00+03:00.",
  "code": "quota.uploads_per_day",
  "request_id": "req_9f3c...",
  "errors": [ {"field": "file", "code": "file.too_large", "max_mb": 10} ]
}
```

- `code` is a stable machine key; `title`/`detail` are localized per `Accept-Language`.
- Validation errors (422) enumerate per-field `errors[]`.
- 5xx bodies never leak internals; Sentry gets the stack, the client gets `code: "internal"` + `request_id`.

## 3. Pagination, filtering, sorting

- **Cursor pagination everywhere** (`?cursor=...&limit=50`, max 100): stable under concurrent inserts, cheap on partitioned tables, mobile-friendly. Response envelope:
  ```json
  {"data": [...], "next_cursor": "eyJ...", "has_more": true}
  ```
- Cursors are opaque signed base64 (HMAC) so clients can't forge offsets into other tenants' keyspace.
- Filters are explicit query params (`?from=2026-08-01&to=2026-08-31&product_id=...`); no generic query language.

## 4. Endpoint catalog (v1)

### Auth & account
```
POST   /v1/auth/register              # merchant signup (email + password)
POST   /v1/auth/verify-email          # signed link / 6-digit code
POST   /v1/auth/verify-phone          # optional; SMS OTP — required only to enable SMS alert channel
POST   /v1/auth/login                 # password → cookie session (web) or token pair (mobile client_type)
POST   /v1/auth/refresh               # rotate refresh token
POST   /v1/auth/logout
POST   /v1/auth/forgot-password       # email reset link
POST   /v1/auth/2fa/enable|verify|disable
GET    /v1/me                         # principal + merchant + entitlements snapshot
PATCH  /v1/me                         # locale, name, notification prefs
```

### Team (premium)
```
GET/POST       /v1/team/members
PATCH/DELETE   /v1/team/members/{id}
POST           /v1/team/invitations
```

### Uploads & ingestion
```
POST   /v1/uploads                    # multipart; 202 + {upload_id}; Idempotency-Key supported
GET    /v1/uploads                    # history, cursor-paginated
GET    /v1/uploads/{id}               # status + stats
GET    /v1/uploads/{id}/events        # SSE progress stream
GET    /v1/uploads/{id}/proposed-mapping
POST   /v1/uploads/{id}/mapping       # confirm/adjust mapping → resumes pipeline
GET    /v1/uploads/{id}/errors        # per-row rejects (paginated) + link to full report
GET    /v1/mappings                   # saved shapes; DELETE /v1/mappings/{id}
```

### Dashboard analytics (read-only, cached, ETag)
```
GET /v1/dashboard/summary             # today/7d/30d KPI cards
GET /v1/dashboard/sales-velocity      # ?granularity=day|week&from&to → time series
GET /v1/dashboard/top-products        # ?metric=revenue|units&from&to
GET /v1/dashboard/inventory           # stock levels + days-of-stock-left + status
GET /v1/dashboard/retention           # cohort matrix (months × months)
GET /v1/dashboard/customers           # repeat vs one-time split, top customers
```

### Catalog
```
GET/POST      /v1/products
GET/PATCH/DELETE /v1/products/{id}
POST          /v1/products/{id}/inventory      # manual stock set
GET           /v1/orders                        # browse, filter; premium sees full history
GET           /v1/orders/{id}
```

### Alerts
```
GET    /v1/alerts                     # ?status=active
POST   /v1/alerts/{id}/acknowledge
GET/PATCH /v1/alert-rules             # thresholds, channels (channel=sms gated premium)
```

### Ads (merchant-facing serving)
```
GET  /v1/ads/slots?context=stockout&placement=dashboard_sidebar   # returns creative or 204; free tier only
POST /v1/ads/events                   # {creative_id, kind: impression|click, nonce}  (signed nonce from slot response)
```

### Advertiser portal
```
POST   /v1/advertiser/register
GET    /v1/advertiser/wallet          # balance + ledger (paginated)
POST   /v1/advertiser/wallet/topup    # → payment provider checkout URL
GET/POST /v1/advertiser/campaigns
GET/PATCH /v1/advertiser/campaigns/{id}   # pause/resume/edit
POST   /v1/advertiser/campaigns/{id}/creatives
GET    /v1/advertiser/campaigns/{id}/stats  # impressions, clicks, spend by day
```

### Billing
```
GET    /v1/billing/plans
GET    /v1/billing/subscription
POST   /v1/billing/subscribe          # → Stripe Checkout session {plan_id}
POST   /v1/billing/portal             # → Stripe customer portal URL (card update, invoices, cancel)
POST   /v1/billing/cancel
GET    /v1/billing/payments
POST   /v1/webhooks/stripe            # signature-verified, idempotent
POST   /v1/webhooks/{provider}        # reserved for regional providers (mercadopago, flutterwave)
```

### Sync API (premium; API-key auth; the only surface in public docs)
```
POST /v1/sync/orders                  # batch ≤ 500 orders; idempotent per row_fingerprint
POST /v1/sync/products                # batch upsert ≤ 500
POST /v1/sync/inventory               # batch stock snapshots
GET  /v1/sync/status                  # key info, quota remaining, last sync
```

### Exports
```
POST /v1/exports                      # {kind: orders|products, format: csv|xlsx, from, to} → 202 job
GET  /v1/exports/{id}                 # → presigned S3 download URL when ready
```

### Platform admin (role platform_admin, IP-restricted, `x-internal`)
```
GET/PATCH /v1/admin/merchants ...     # tenant mgmt, suspend
GET/POST  /v1/admin/advertisers ...   # review queue, creative moderation
GET       /v1/admin/metrics           # platform KPIs
POST      /v1/admin/impersonate/{merchant_id}   # audited, time-boxed support access
```

### Meta
```
GET /v1/health/live                   # process up
GET /v1/health/ready                  # DB+Redis+S3 reachable
GET /v1/version
```

## 5. Authentication modes

| Client | Mechanism | Notes |
|---|---|---|
| Web app | Session: httpOnly Secure SameSite=Lax cookies carrying JWT access (15 min) + rotating refresh (30 d) | CSRF double-submit token on mutations; see [05-security.md](05-security.md) |
| Mobile (phase 2) | Same token pair in JSON body (`client_type=mobile` at login); stored in secure storage | Identical endpoints — no mobile rework |
| Sync API | `Authorization: Bearer sqk_live_...` API key | Scoped, revocable, hashed at rest |
| Webhooks (inbound) | Provider signature (HMAC) + timestamp tolerance ±5 min | Never authenticated as a tenant |

## 6. HTTP caching (client-visible)

Dashboard GET endpoints return `ETag` (hash of merchant cache-version + query params) and `Cache-Control: private, max-age=0, must-revalidate`. Repeat visits revalidate with `If-None-Match` → 304 with empty body — significant on 3G. Server-side caching behind this: [09-performance.md](09-performance.md).

## 7. Rate-limit headers

All authenticated responses include:
```
RateLimit-Limit: 60
RateLimit-Remaining: 57
RateLimit-Reset: 22
```
On 429: `Retry-After` seconds. Policies per route class: [09-performance.md §5](09-performance.md).

## 8. Idempotency

Mutating endpoints where retries are dangerous (`POST /uploads`, `/sync/*`, `/billing/subscribe`, `/advertiser/wallet/topup`) accept `Idempotency-Key` (client UUID). Server stores `(merchant_id, key, request_hash, response)` for 24 h:

- Same key + same request hash → replay stored response (with `Idempotent-Replay: true`).
- Same key + different hash → `409 code=idempotency.key_reuse`.
- Sync API rows additionally dedupe on `row_fingerprint` regardless of key, so at-least-once POS integrations are safe.

## 9. Server-Sent Events

`GET /v1/uploads/{id}/events` streams `status`, `progress` (`{rows_done, rows_total}`), and terminal events; heartbeat comment every 15 s; client resumes with `Last-Event-ID`. Backed by Redis pub/sub (`upload:{id}:events`). Falls back gracefully: the status endpoint is poll-safe (cheap, cached 2 s) for clients that can't hold SSE open.

## 10. Webhooks (outbound, premium, later milestone)

Design reserved in v1 (table + signing scheme documented) but shipped in phase 5: merchant-configurable endpoints for `upload.completed`, `alert.created`. HMAC-SHA256 signature header, per-endpoint secret, 3 retries with backoff, auto-disable after 20 consecutive failures.

## 11. Deprecation policy

Response header `Deprecation: true` + `Sunset: <date>` on deprecated endpoints; changelog page; Sync API consumers additionally emailed at 90/30/7 days. Nothing is removed inside a major version.
