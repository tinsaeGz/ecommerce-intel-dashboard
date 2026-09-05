FROM ghcr.io/astral-sh/uv:0.11.17 AS uv
FROM python:3.12-slim-bookworm

COPY --from=uv /uv /usr/local/bin/uv
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY apps/api/pyproject.toml apps/api/uv.lock ./
RUN uv sync --locked --no-dev --no-install-project
COPY apps/api/src ./src
RUN uv sync --locked --no-dev --no-editable \
    && groupadd --gid 10001 suq \
    && useradd --uid 10001 --gid suq --no-create-home suq
ENV PATH="/app/.venv/bin:$PATH"
USER 10001:10001
EXPOSE 8000
CMD ["uvicorn", "suq_api.main:app", "--host", "0.0.0.0", "--port", "8000", "--no-access-log"]
