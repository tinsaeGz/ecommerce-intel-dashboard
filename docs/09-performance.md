# 09 — Performance: Caching & Rate Limiting

A large share of users are on mid-range Android over patchy 3G/4G (LATAM, West Africa); EU/US users expect desktop-snappy. The server budget is one modest VPS at launch, serving users an ocean away from it. All of it points the same direction: cache aggressively (Cloudflare CDN shortens the last mile for static assets globally), meter everything.

## 1. Cache layers (outermost first)

| # | Layer | What | Policy |
|---|---|---|---|
| 1 | Browser/PWA | Static assets (hashed filenames) | `Cache-Control: public, max-age=31536000, immutable`; HTML `no-cache` |
| 2 | Browser conditional GET | Dashboard JSON | `ETag` + `private, must-revalidate` → 304s on revisit ([04-api.md §6](04-api.md)) |
| 3 | Service worker (PWA) | App shell + last-known dashboard payloads | Stale-while-revalidate; offline shows cached data with an "as of" banner |
| 4 | Edge (Caddy) | Static files, brotli, TLS session cache | No API response caching at edge (all API responses are private) |
| 5 | **Redis app cache** | Computed dashboard payloads, entitlement snapshots, ad indexes, i18n bundles | Detailed below |
| 6 | Postgres rollups | Precomputed aggregates | The "cache" that makes layer 5 cheap to rebuild ([07-analytics.md](07-analytics.md)) |

## 2. Redis application cache — keyspace

```
cache:v{N}:dash:{merchant_id}:{endpoint}:{params_hash}   TTL 300s   dashboard payloads
ent:{merchant_id}                                        TTL 60s    plan/entitlement snapshot
ads:index:{context}                                      TTL 60s    serving candidate sets
i18n:{locale}:{namespace}                                TTL 3600s  translation bundles
ratelimit:{class}:{principal}                            per-policy counters (below)
quota:uploads:{merchant_id}:{yyyymmdd}                   TTL 48h
lock:ingest:{merchant_id}                                TTL 1800s  single-flight ingestion
sess:otp:{phone}                                         TTL 600s   OTP state
idem:{merchant_id}:{key}                                 TTL 24h    idempotency fast path
ver:dash:{merchant_id}                                   no TTL     cache version counter
```

## 3. Invalidation: versioned namespaces

Per-merchant integer `ver:dash:{merchant_id}`; every dashboard cache key embeds its current value. Invalidation = `INCR` (O(1), no SCAN/DEL storms). Bumped on: ingestion completion, manual inventory edit, alert state change, retention pruning, plan change. Orphaned keys expire via TTL. The same version feeds the HTTP ETag, so browser 304 and Redis stay coherent automatically.

## 4. Cache correctness rules

- **Never cache across tenants**: merchant_id is in every key by construction; a helper builds all cache keys (no hand-built keys in endpoints).
- **Stampede control:** single-flight per key via short Redis lock (`SET NX PX 5000`); losers wait-and-reread (max 2×100 ms) then compute anyway — bounded staleness beats bounded latency loss here.
- **Serve-stale-on-error:** payloads stored with 2× TTL envelope; if recompute fails (DB hiccup), serve stale copy + log; dashboards degrade gracefully.
- Redis down → cache layer bypassed (circuit breaker, 30 s), site slower but up. Rate limiting fails **closed to defaults** (conservative fixed limit in-process) rather than open.

## 5. Rate limiting

**Algorithm:** token bucket in Redis (atomic Lua: refill+take in one round trip), keyed per policy class. Headers per [04-api.md §7](04-api.md). Enforcement at middleware after auth (per-principal), plus a coarse pre-auth IP layer at Caddy.

### Policy table (initial values; config-driven, hot-reloadable)

| Class | Key | Limit | Burst | Notes |
|---|---|---|---|---|
| `auth.otp_send` | phone | 3/hour, 5/day | 1 | + per-IP 10/h; the SMS-cost defense |
| `auth.email_send` | email | 5/hour | 2 | verification + reset mails; per-IP 20/h |
| `auth.login` | account+IP | 5/min | 5 | progressive lockout on top ([05-security.md §1](05-security.md)) |
| `auth.refresh` | user | 30/h | 5 | |
| `read.dashboard` | user | 120/min | 40 | generous; it's cached anyway |
| `read.general` | user | 60/min | 20 | lists, orders browse |
| `write.general` | user | 30/min | 10 | products, rules, settings |
| `uploads.create` | merchant | 5/day free · 50/day premium | 2 | quota (daily), plus 2/min velocity cap |
| `sync.api` | api_key | 60/min premium (plan-driven `api_rate_per_min`) | 20 | 429 + `Retry-After`; docs promise this number |
| `ads.slot` | merchant | 30/min | 10 | best-effort path anyway |
| `ads.event` | merchant | 60/min | 20 | + nonce single-use |
| `exports.create` | merchant | 5/day | 1 | expensive jobs |
| `webhooks.inbound` | provider IP | 120/min | 60 | above this → 429, providers retry |
| `admin.*` | user | 300/min | 50 | |
| **Pre-auth IP (Caddy)** | IP | 300/min | 100 | blunt DoS shield; also 100 req/10s per-IP on `/v1/auth/*` |

- Limits for authenticated classes scale with plan via `entitlements` (single lookup already in request context — no extra Redis hit).
- Every 429 increments a per-class Prometheus counter; sustained 429 spikes alert ops (either abuse or a mis-sized limit).
- Internal callers (workers hitting the API) — there are none by design; workers use the service layer directly.

## 6. Backend performance budgets

| Path | Budget (p95) | How it's met |
|---|---|---|
| Dashboard reads | 300 ms | Redis hit ≥ 90%; miss path = single rollup query with PK-range scan |
| Auth/login | 500 ms | argon2 dominates (intentionally) |
| Upload accept | 2 s for 10 MB | streaming hash+S3 put, no parsing inline |
| Ads slot | 150 ms hard timeout | Redis-only path |
| Sync API batch (500 rows) | 3 s | staging COPY + upsert |

Connection budgets: asyncpg pool 10/API replica + 5/worker; pgbouncer added when replica count × pool > 80. Slow-query log at 200 ms → weekly review.

## 7. Frontend performance

- Route-level code splitting; initial JS < 200 KB gz; charts chunk lazy-loaded.
- ECharts canvas rendering; series downsampled server-side to ≤ 400 points per chart.
- TanStack Query: `staleTime` 60 s aligned with server TTLs; background refetch on focus; optimistic updates on acknowledge/settings.
- Images (ad creatives) served resized (worker generates 2 sizes at upload) with `loading=lazy`.
- Fonts: single Latin-subset variable font self-hosted (covers en/es/fr diacritics), `font-display: swap`.
- Lighthouse budget in CI: perf ≥ 85 mobile-emulated on dashboard route.

## 8. Load testing

Locust scenarios in `tests/load/`: (a) 500 concurrent merchants browsing dashboards (target: p95 < 300 ms, error < 0.1%), (b) 50 simultaneous 10 MB ingestions with dashboards under load (ingestion p95 < 60 s, dashboards unaffected), (c) OTP abuse simulation (verify limiter math). Run before launch and before any capacity-relevant release; results archived in `docs/perf-runs/`.
