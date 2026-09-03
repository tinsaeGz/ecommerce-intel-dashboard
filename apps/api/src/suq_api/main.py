from fastapi import FastAPI

from suq_api.api.health import router as health_router
from suq_api.api.v1.version import router as version_router
from suq_api.core.settings import Settings, get_settings


def create_app(settings: Settings | None = None) -> FastAPI:
    resolved_settings = settings or get_settings()
    application = FastAPI(
        title="Suq Insights API",
        version=resolved_settings.service_version,
    )
    application.state.settings = resolved_settings
    application.include_router(health_router)
    application.include_router(version_router)
    return application


app = create_app()
