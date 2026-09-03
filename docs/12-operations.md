# 12 — Operations: Deployment, Observability, Reliability

## 1. Environments

| Env | Where | Purpose |
|---|---|---|
| `dev` | Docker Compose on developer machines | Full stack incl. MinIO, mailpit, fake SMS/payment providers |
| `staging` | Small VPS, same compose topology as prod | Every merge to `main` auto-deploys; nightly restore of scrubbed prod snapshot |
| `prod` | Ubuntu 24.04 VPS (start: 8 vCPU / 16 GB / NVMe), **Hetzner EU (Falkenstein)** + Cloudflare in front | Single host at launch; EU region is a GDPR data-residency commitment ([05-security.md §9](05-security.md)); Cloudflare CDN carries static assets to LATAM/Africa edges — API latency from LATAM (~150 ms RTT) is absorbed by the ETag/SW caching design; a read-replica or regional PoP is the documented scale-out if LATAM p95 demands it |

Fake providers in dev/staging: `integrations/*` each ship a `FakeProvider` (records calls, controllable outcomes) selected by env config — payment and SMS flows are fully testable without spending money.

## 2. Runtime topology (prod compose)

```
caddy            (443/80; TLS via ACME, static SPA, reverse proxy, body caps, IP throttle)
api        ×2    (gunicorn -k uvicorn.workers.UvicornWorker, 4 workers each)
worker-ingest ×2 (celery -Q ingest, concurrency 2, mem limit 2G)
worker-fast   ×1 (celery -Q notify,ads,alerts, concurrency 8)
worker-heavy  ×1 (celery -Q reports, concurrency 2)
beat          ×1 (celery beat; schedules: partitions, pruning, reconciliation,
                  nightly alerts, watchdogs)
postgres      ×1 (16; tuned: shared_buffers 4G, WAL compression, pg_stat_statements)
redis         ×1 (7; maxmemory 2G, allkeys-lru for cache DB, noeviction for broker DB — two logical DBs)
minio         ×1
prometheus / grafana / loki / promtail / alertmanager
```

- All app images: single multi-stage Dockerfile (uv for deps), non-root user, read-only rootfs, healthchecks.
- Postgres data on NVMe volume; `pg_stat_statements` + `auto_explain` (>500 ms) enabled.
- Cloudflare (free tier) in front: DDoS absorption, CDN for static, hides origin IP.

## 3. CI/CD (GitHub Actions)

Pipeline on PR: lint (ruff, mypy, eslint, tsc) → unit tests → migration check (apply to snapshot) → integration tests (compose services) → frontend build + Lighthouse budget → image build + Trivy scan → pip-audit/npm audit.
On merge to `main`: build tagged images → push registry → auto-deploy staging → smoke suite (login, upload fixture, dashboard, ad slot) → **manual approval gate** → prod deploy.

Prod deploy = `deploy/release.sh`: pull images → run migrations (expand-only guaranteed by review discipline, [03-data-model.md §11](03-data-model.md)) → rolling restart api (2 replicas, health-gated) → restart workers (Celery warm shutdown: finish current task) → verify `/health/ready` + synthetic checks → tag release in Sentry/Grafana. Rollback = redeploy previous tag (migrations are backward-compatible by rule, so rollback is image-only).

## 4. Observability

### Logging
structlog JSON → stdout → promtail → Loki. Every line: `request_id`, `merchant_id`, `route`, `duration_ms`, `status`. Scrubbing processor ([05-security.md §8](05-security.md)). Retention 30 d hot, 90 d archived.

### Metrics (Prometheus)
- RED per route class: rate, error %, duration histograms.
- Business: uploads started/completed/failed, rows loaded/rejected, active alerts, SMS sent + cost, ad fill rate, 429s per class, cache hit ratio, queue depth + task age per queue, payment webhook lag.
- Infra: node exporter, postgres exporter (bloat, replication when added), redis exporter.

### Tracing
OpenTelemetry: FastAPI + SQLAlchemy + Redis + Celery instrumentation; trace ID joined to logs; sampled 10% (100% on errors). Exported to Grafana Tempo (same host, modest retention).

### Errors
Sentry (self-hosted GlitchTip if data-residency preferred): API + workers + frontend; release-tagged; alert on new-issue and regression.

### Alerting (Alertmanager → Telegram ops channel + SMS for P1)
| Alert | Threshold |
|---|---|
| API 5xx rate | > 1% for 5 min (P1) |
| p95 dashboard latency | > 600 ms for 10 min |
| Queue task age | ingest > 10 min; notify > 2 min (P1 — OTPs live here) |
| Upload watchdog | any non-terminal > 30 min |
| Disk / WAL | > 80% |
| Payment webhook failures | > 3 in 15 min (P1) |
| SMS daily spend | > budget threshold |
| Certificate/domain expiry | < 14 d |
| Backup job | missed or verification failed (P1) |

## 5. SLOs

| SLO | Target |
|---|---|
| API availability (rolling 30 d) | 99.5% (single-host launch reality; 99.9% after 2-host phase) |
| Dashboard read p95 | < 300 ms |
| Ingestion 10 MB p95 | < 60 s |
| OTP delivery p95 | < 15 s |
| Durability | RPO ≤ 15 min, RTO ≤ 2 h |

Error budget reviewed monthly; SLO burn alerts wired in Grafana.

## 6. Backups & disaster recovery

- **Postgres:** pgBackRest — full nightly + WAL archiving to *offsite* S3 (different provider, still an **EU region** — residency applies to backups too). PITR window 14 d. RPO ≤ 15 min via WAL push interval.
- **MinIO:** `mc mirror` nightly to same offsite bucket (raw uploads are re-processable assets).
- **Redis:** not backed up (cache + queue; queues drain, cache rebuilds). Idempotent tasks make lost-in-flight jobs safe; the upload watchdog resubmits.
- **Restore drill:** monthly automated job restores latest backup to a scratch container and runs row-count + checksum verification; drill failure = P1.
- **DR runbook:** provision new VPS from `deploy/` repo (compose + SOPS secrets) → restore Postgres + MinIO → repoint DNS (Cloudflare, low TTL). Target RTO 2 h, rehearsed quarterly.

## 7. Capacity planning (launch → 12 mo)

Assumptions: 2,000 merchants, 15% premium, avg 20k order rows/merchant/yr → ~40 M fact rows/yr ≈ 15 GB incl. indexes; Redis working set < 1 GB; MinIO ~100 GB/yr. The launch VPS carries this with ≥ 3× headroom; scale triggers documented in [02-architecture.md §7](02-architecture.md).

## 8. Scheduled jobs (beat) inventory

| Job | Schedule |
|---|---|
| Create future partitions (orders, order_items, ad_events) | monthly |
| Free-tier retention pruning | nightly 02:00 |
| Idempotency/token/OTP pruning | hourly |
| Nightly alert evaluation sweep | 06:00 per-tz batches |
| Payment reconciliation | daily 07:00 |
| Subscription renewal reminders + grace transitions | daily 09:00 |
| SMS cost & budget report | daily |
| Backup verification restore | monthly |
| Rollup consistency sampler (random merchants: rollup vs facts recompute) | weekly |

## 9. Incident response

Severity ladder (P1: money, data loss, sitewide down; P2: feature down; P3: degraded). On-call rotation (2 engineers initially). Runbooks in `deploy/runbooks/`: DB failover/restore, Redis flush recovery, queue backlog drain, payment provider outage (degrade: banner + retry queue), SMS provider failover, cert issues, tenant-isolation incident (immediate: revoke sessions, snapshot, audit query log). Every P1/P2 gets a blameless postmortem in-repo within 5 days.

## 10. Status page

Public status page (Uptime Kuma on a separate tiny VPS) monitoring API, web, checkout flow synthetically from outside; incident banners surfaced in-app via a feature-flag message.
