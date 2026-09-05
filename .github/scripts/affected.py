"""Select full subsystem gates from a complete Git diff, conservatively."""

import json
import os
import subprocess
from pathlib import Path

LANES = (
    "web",
    "mobile",
    "packages",
    "api",
    "contract",
    "docs",
    "security",
    "containers",
    "migrations",
    "deploy_web",
)


def select(paths: list[str], full: bool = False) -> dict[str, bool]:
    selected = set(LANES) if full else set()
    for path in paths:
        if path.endswith((".md", ".pdf")) or (
            path.startswith("docs/")
            and Path(path).suffix.lower()
            in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".drawio"}
        ):
            selected.update(("docs", "security"))
        elif path.startswith(".github/") or path in {
            "package.json",
            "package-lock.json",
            ".dockerignore",
            ".gitignore",
        }:
            selected.update(LANES)
        elif path.startswith("apps/web/"):
            selected.update(("web", "security", "containers", "deploy_web"))
        elif path.startswith("apps/mobile/"):
            selected.update(("mobile", "security"))
            if path.endswith("package.json"):
                selected.update(("containers", "web", "packages", "deploy_web"))
        elif path.startswith("packages/"):
            selected.update(
                ("packages", "web", "mobile", "security", "containers", "deploy_web")
            )
            if path.startswith("packages/api-client/"):
                selected.add("contract")
        elif path.startswith("apps/api/"):
            selected.update(
                (
                    "api",
                    "contract",
                    "packages",
                    "web",
                    "mobile",
                    "security",
                    "containers",
                    "migrations",
                )
            )
        elif path.startswith("deploy/"):
            selected.update(("containers", "migrations", "security"))
        elif path == "vercel.json":
            selected.update(("web", "security", "containers", "deploy_web"))
        elif path.startswith(".markdownlint"):
            selected.add("docs")
        else:
            selected.update(LANES)
    return {lane: lane in selected for lane in LANES}


def changed_paths(event_name: str, event: dict) -> list[str] | None:
    if event_name == "pull_request":
        base = event["pull_request"]["base"]["sha"]
        head = event["pull_request"]["head"]["sha"]
        revision = f"{base}...{head}"
    elif event_name == "push":
        base, head = event.get("before", ""), event.get("after", "")
        if not base or set(base) == {"0"}:
            return None
        revision = f"{base}..{head}"
    else:
        return None
    try:
        result = subprocess.check_output(
            ["git", "diff", "--no-renames", "--name-only", "-z", revision, "--"],
            timeout=30,
        )
    except subprocess.CalledProcessError:
        return None
    return [path for path in result.decode().split("\0") if path]


def main() -> None:
    event = json.loads(Path(os.environ["GITHUB_EVENT_PATH"]).read_text())
    paths = changed_paths(os.environ["GITHUB_EVENT_NAME"], event)
    selected = select(paths or [], full=paths is None)
    with Path(os.environ["GITHUB_OUTPUT"]).open("a") as output:
        for lane, enabled in selected.items():
            output.write(f"{lane}={str(enabled).lower()}\n")
    with Path(os.environ["GITHUB_STEP_SUMMARY"]).open("a") as summary:
        summary.write(
            "## Affected subsystem checks\n\n| Gate | Selected |\n|---|---|\n"
        )
        for lane, enabled in selected.items():
            summary.write(f"| {lane} | {'yes' if enabled else 'no'} |\n")
        summary.write("\nManual dispatch or unavailable diff selects all gates.\n")
    print(json.dumps(selected, sort_keys=True))


if __name__ == "__main__":
    main()
