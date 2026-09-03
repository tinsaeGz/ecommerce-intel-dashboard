from celery import Celery

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
        timezone="UTC",
    )
    return application


celery_app = create_celery()
