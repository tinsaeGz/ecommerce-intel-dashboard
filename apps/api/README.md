# Suq Insights API

Python 3.12 package containing the FastAPI and Celery process entry points. It
will own HTTP routers, middleware, persistence, domain services, workers, and
provider adapters as the SDLC phases are implemented.

```sh
uv sync --all-groups
uv run uvicorn suq_api.main:app --reload
uv run celery --app suq_api.worker:celery_app worker
```

Regenerate the checked-in OpenAPI contract from this directory with:

```sh
uv run python -m suq_api.openapi
```
