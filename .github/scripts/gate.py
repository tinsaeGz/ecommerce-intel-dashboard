"""Reject failed, missing, or unexpectedly skipped selected CI jobs."""

import json
import os

JOBS = {
    "web": "frontend",
    "mobile": "mobile",
    "packages": "packages",
    "api": "backend",
    "contract": "contract",
    "docs": "docs",
    "security": "security",
    "containers": "integration",
    "migrations": "migrations",
}


def failures(needs: dict) -> list[str]:
    errors = []
    for name in ("changes", "workflow"):
        if needs.get(name, {}).get("result") != "success":
            errors.append(name)
    outputs = needs.get("changes", {}).get("outputs", {})
    for lane, job in JOBS.items():
        selected = outputs.get(lane)
        result = needs.get(job, {}).get("result")
        if selected not in {"true", "false"}:
            errors.append(f"{job}: missing selection")
        elif selected == "true" and result != "success":
            errors.append(f"{job}: {result}")
        elif selected == "false" and result not in {"skipped", "success"}:
            errors.append(f"{job}: {result}")
    return errors


if __name__ == "__main__":
    errors = failures(json.loads(os.environ["CI_NEEDS"]))
    if errors:
        raise SystemExit("CI gate failed: " + ", ".join(errors))
    print("All selected subsystem checks passed.")
