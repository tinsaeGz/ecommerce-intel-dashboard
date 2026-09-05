from celery import Celery
from kombu import Queue

from suq_api.core.settings import Settings, get_settings


def create_celery(settings: Settings | None = None) -> Celery:
    resolved_settings = settings or get_settings()
    broker_url = str(resolved_settings.redis_url)
    application = Celery(
        "suq_insights",
        broker=broker_url,
        backend=broker_url,
    )
    application.conf.update(
        accept_content=["json"],
        enable_utc=True,
        result_serializer="json",
        task_serializer="json",
        task_default_queue="ingest",
        task_queues=tuple(Queue(name) for name in ("ingest", "alerts", "notify", "ads", "reports")),
        task_create_missing_queues=False,
        worker_prefetch_multiplier=1,
        timezone="UTC",
    )
    return application


celery_app = create_celery()
