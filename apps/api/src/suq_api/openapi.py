import json
from pathlib import Path

from suq_api.main import create_app


def export_openapi(destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(
        f"{json.dumps(create_app().openapi(), indent=2, sort_keys=True)}\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    repository_root = Path(__file__).resolve().parents[4]
    export_openapi(repository_root / "packages/api-client/openapi.json")
