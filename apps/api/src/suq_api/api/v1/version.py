from typing import Literal

from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter(prefix="/v1", tags=["system"])


class VersionResponse(BaseModel):
    service: Literal["suq-insights-api"]
    version: str


@router.get("/version", response_model=VersionResponse)
async def version(request: Request) -> VersionResponse:
    return VersionResponse(
        service="suq-insights-api",
        version=request.app.state.settings.service_version,
    )
