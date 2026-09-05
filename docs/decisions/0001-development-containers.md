# ADR 0001: Phase 0 development containers

Status: Accepted for the authorized Phase 0 foundation work.

Requirements: SDLC §§5.2, 7.1, 9.1, 9.2, and 11 (Phase 0).

The repository has runnable web, API, and worker entry points, but no shared
container environment. Adopt the topology already specified by the SDLC:
Caddy serves the built web application and proxies `/v1` and health routes to
FastAPI; PostgreSQL 16, Redis 7, MinIO, and a development mail catcher run on a
private data network. Only the edge and mail preview bind to host loopback.
The API and workers bridge the application and data networks.

Use one API image for HTTP and separate ingest, fast (alerts, notify, ads), and
reports worker pools. Declare queues explicitly and reject undeclared queues.
Heavy extraction will use the reports pool with an explicit queue selection
when extraction tasks are implemented; no task routing is invented here.
Application containers run as non-root with read-only roots and bounded memory.
Persistent service data lives in named volumes. Redis uses no-eviction and AOF
so this initial shared broker does not evict jobs; separate cache deployment
and eviction policy remain a later operational checkpoint.

The environment is development-only: it uses loopback HTTP and explicit local
credentials. It must not be used for staging or production. TLS, production
secrets, provider fakes, schema migrations, tenant/RLS enforcement, dependency
readiness, authentication, and automatic full-stack staging deployment remain
Phase 0 work. Existing readiness only reports process readiness; Compose
dependency probes do not replace application dependency readiness.

CI builds and starts the containers and checks routing, backing services, and
worker queue isolation. This establishes a usable infrastructure checkpoint;
it does not satisfy Phase 0's authenticated tenant-scoped staging exit gate.

Implementation references: [Compose startup ordering](https://docs.docker.com/compose/how-tos/startup-order/),
[Caddy SPA routing](https://caddyserver.com/docs/caddyfile/patterns), and
[uv container builds](https://docs.astral.sh/uv/guides/integration/docker/).
