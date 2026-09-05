"""Enforce the SDLC domain threshold whenever the pure domain package exists."""

import json
import sys
from pathlib import Path


def main() -> None:
    domain = Path("apps/api/src/suq_api/domain")
    if not domain.exists():
        print(
            "::notice::Pure domain package not implemented; no domain coverage claimed."
        )
        return
    report = json.loads(Path(sys.argv[1]).read_text())
    summaries = [
        data["summary"]
        for name, data in report["files"].items()
        if "/suq_api/domain/" in name.replace("\\", "/")
    ]
    statements = sum(item["num_statements"] for item in summaries)
    covered = sum(item["covered_lines"] for item in summaries)
    if not statements or covered / statements < 0.95:
        raise SystemExit(
            f"Domain coverage below 95%: {covered}/{statements} statements"
        )
    print(f"Domain coverage: {covered / statements:.2%}")


if __name__ == "__main__":
    main()
