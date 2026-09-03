from functools import lru_cache
from typing import Literal

from pydantic import RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Validated process configuration shared by API and worker entry points."""

    model_config = SettingsConfigDict(
        env_prefix="SUQ_",
        extra="forbid",
        frozen=True,
    )

    environment: Literal["development", "test", "staging", "production"] = "development"
    service_version: str = "0.1.0"
    redis_url: RedisDsn = RedisDsn("redis://localhost:6379/0")


@lru_cache
def get_settings() -> Settings:
    return Settings()
