# Deployment

The Phase 0 development environment runs the built web application, FastAPI,
three Celery worker pools, PostgreSQL 16, Redis 7, MinIO, and Mailpit.
Caddy serves web routes and `/v1` from the same origin. Requirements and scope
are recorded in [ADR 0001](../docs/decisions/0001-development-containers.md).

## Run locally

From the repository root, with Docker Engine and Compose available:

```sh
cp deploy/.env.example deploy/.env
docker compose --env-file deploy/.env -f deploy/compose.yml up --build --detach --wait
python3 deploy/smoke.py
```

Open <http://localhost:8080> for the web application, `/v1/version` for the API,
and <http://localhost:8025> for the mail preview. The application is currently
a product preview; `/app` is not yet authenticated. No email is sent until the
notification adapter is implemented. Internal SMTP is `mailpit:1025`,
Phase 0 object-storage health stub is `object-storage:9000`, PostgreSQL is
`postgres:5432`, and Redis is `redis:6379`.
The database bootstrap account is a local administrator, **not** the future
application database role. No database credentials are passed to the API until
the tenant-safe persistence layer is implemented.

If Docker Desktop is stopped but system Docker is running, prefix these commands
with `DOCKER_CONTEXT=default`; there is no need to change the selected context.
Change `SUQ_HTTP_PORT` and `SUQ_MAIL_PORT` in `deploy/.env` for occupied ports,
and pass the corresponding `--base-url` and `--mail-url` to the smoke script. If changing
`COMPOSE_PROJECT_NAME`, pass the same `--project-name` to the smoke script.

API source changes require rebuilding the image; web images run the production
build and enforce its bundle budget. For the existing fast web edit loop, use
`npm run dev:web` outside containers.

## Inspect and stop

```sh
docker compose --env-file deploy/.env -f deploy/compose.yml ps
docker compose --env-file deploy/.env -f deploy/compose.yml logs --tail 100 api worker-fast
docker compose --env-file deploy/.env -f deploy/compose.yml down
```

Stopping preserves named volumes. Do not append `--volumes` unless intentionally
deleting that project's local data. CI uses its own project and deletes only
its ephemeral volumes. Only web and mail preview ports bind to host loopback;
backing services have no host ports. Application roots are read-only, temporary
files use tmpfs, and worker pools have separate queues and memory limits.

## Validation and remaining gates

CI validates Compose, builds images, waits for service health, then exercises
SPA/API routing, missing assets, real PostgreSQL and Redis commands, MinIO and
Mailpit readiness, queue isolation, and application container constraints.
The smoke suite does not yet prove authenticated journeys or storage persistence
through adapters. API readiness currently reports process readiness only.

Vercel still hosts only `apps/web`. This Compose file is development-only and
must not be deployed to staging or production. Phase 0 still needs schema and
RLS, the shared middleware chain, signup/login and tenant-scoped web journeys,
provider fakes, dependency-aware readiness, passing security scans, and
automatic full-stack staging deployment. No Phase 1 exit criteria are claimed.
