import pytest
from httpx import ASGITransport, AsyncClient
from pydantic import RedisDsn

from suq_api.core.settings import Settings
from suq_api.main import create_app
from suq_api.worker import create_celery


@pytest.mark.asyncio
async def test_health_and_version_entrypoints() -> None:
    app = create_app(Settings(environment="test", service_version="test-version"))

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="https://test.local",
    ) as client:
        assert (await client.get("/health/live")).json() == {"status": "ok"}
        assert (await client.get("/health/ready")).json() == {"status": "ok"}
        assert (await client.get("/v1/version")).json() == {
            "service": "suq-insights-api",
            "version": "test-version",
        }


def test_openapi_contract_contains_versioned_and_health_routes() -> None:
    paths = create_app(Settings(environment="test")).openapi()["paths"]

    assert {"/health/live", "/health/ready", "/v1/version"} <= paths.keys()


def test_worker_uses_validated_redis_configuration() -> None:
    worker = create_celery(Settings(environment="test", redis_url=RedisDsn("redis://redis:6379/3")))

    assert worker.conf.broker_url == "redis://redis:6379/3"
    assert worker.conf.result_backend == "redis://redis:6379/3"
    assert worker.conf.task_serializer == "json"
