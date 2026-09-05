"""Make missing migration infrastructure explicit and fail closed on new schema."""

import os
import subprocess
from pathlib import Path


def schema_paths(root: Path) -> list[Path]:
    config = root / "apps/api/alembic.ini"
    paths = [config] if config.exists() else []
    source = root / "apps/api/src"
    for path in source.rglob("*"):
        if path.is_file() and (
            path.suffix == ".sql"
            or path.name == "models.py"
            or (
                path.suffix == ".py"
                and any(word in path.read_text() for word in ("sqlalchemy", "alembic"))
            )
            or any(
                part in {"models", "migrations", "alembic", "db"}
                for part in path.relative_to(source).parts
            )
        ):
            paths.append(path)
    for directory in (root / "apps/api/migrations", root / "apps/api/alembic"):
        if directory.exists():
            paths.extend(path for path in directory.rglob("*") if path.is_file())
    paths.extend((root / "deploy").rglob("*.sql"))
    return paths


def main() -> None:
    root = Path(__file__).resolve().parents[2]
    harness = root / "deploy/check-migrations.sh"
    if harness.is_file():
        subprocess.run(["bash", str(harness)], cwd=root, check=True, timeout=600)
        return
    if schema_paths(root):
        raise SystemExit(
            "Schema detected without deploy/check-migrations.sh. Implement real "
            "PostgreSQL snapshot restore, upgrade, schema drift and tenant/RLS "
            "validation before merging."
        )
    message = (
        "Not applicable: no database schema or migrations exist. "
        "No migration/RLS tests ran."
    )
    print(f"::notice::{message}")
    if summary := os.environ.get("GITHUB_STEP_SUMMARY"):
        with Path(summary).open("a") as output:
            output.write(f"## Migrations\n\n{message}\n")


if __name__ == "__main__":
    main()
