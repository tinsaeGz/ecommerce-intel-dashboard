"""Exercise a running development stack using only the Python standard library."""

import argparse
import json
import subprocess
import urllib.error
import urllib.request
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--env-file", default="deploy/.env")
    parser.add_argument("--project-name", default="suq-dev")
    parser.add_argument("--base-url", default="http://127.0.0.1:8080")
    parser.add_argument("--mail-url", default="http://127.0.0.1:8025")
    args = parser.parse_args()
    compose = [
        "docker",
        "compose",
        "--env-file",
        args.env_file,
        "-f",
        str(Path(__file__).with_name("compose.yml")),
        "-p",
        args.project_name,
    ]

    def execute(service: str, *command: str) -> str:
        return subprocess.check_output(
            [*compose, "exec", "-T", service, *command],
            text=True,
            timeout=30,
        )

    def request(path: str) -> tuple[int, str, bytes]:
        try:
            response = urllib.request.urlopen(args.base_url + path, timeout=10)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            return (
                response.status,
                response.headers.get("Content-Type", ""),
                response.read(),
            )

    for path in ("/", "/app", "/app/nested-route"):
        status, content_type, body = request(path)
        assert status == 200 and "text/html" in content_type and b'id="root"' in body, (
            path
        )
    for path in ("/health/live", "/health/ready"):
        status, _, body = request(path)
        assert status == 200 and json.loads(body) == {"status": "ok"}, path
    status, _, body = request("/v1/version")
    assert status == 200 and json.loads(body)["service"] == "suq-insights-api"
    status, content_type, _ = request("/v1/does-not-exist")
    assert status == 404 and "application/json" in content_type
    assert request("/assets/does-not-exist.js")[0] == 404
    print("PASS: same-origin API routing, SPA fallback, and missing assets")

    assert execute("redis", "redis-cli", "ping").strip() == "PONG"
    assert (
        execute(
            "postgres",
            "sh",
            "-c",
            'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT 1"',
        ).strip()
        == "1"
    )
    execute(
        "object-storage",
        "python",
        "-c",
        (
            "import urllib.request; "
            "urllib.request.urlopen('http://localhost:9000/health/ready', timeout=3)"
        ),
    )
    execute("mailpit", "/mailpit", "readyz")
    with urllib.request.urlopen(args.mail_url, timeout=10) as response:
        assert response.status == 200
    print(
        "PASS: PostgreSQL query, Redis command, "
        "S3-compatible object store and mail catcher readiness"
    )

    for service, expected in (
        ("worker-ingest", {"ingest"}),
        ("worker-fast", {"alerts", "notify", "ads"}),
        ("worker-reports", {"reports"}),
    ):
        result = execute(
            service,
            "sh",
            "-c",
            "celery --app suq_api.worker:celery_app inspect active_queues "
            '--destination "worker@$HOSTNAME" --timeout 10 --json',
        )
        workers = json.loads(result)
        assert len(workers) == 1, service
        queues = next(iter(workers.values()))
        assert {queue["name"] for queue in queues} == expected, service
    print("PASS: workload pools consume only their assigned queues")

    for service in ("api", "worker-ingest", "worker-fast", "worker-reports", "edge"):
        container = subprocess.check_output(
            [*compose, "ps", "-q", service], text=True, timeout=30
        ).strip()
        details = json.loads(
            subprocess.check_output(
                ["docker", "inspect", container], text=True, timeout=30
            )
        )[0]
        assert details["Config"]["User"] == "10001:10001", service
        assert details["HostConfig"]["ReadonlyRootfs"], service
        assert details["HostConfig"]["Memory"] > 0, service
    print("PASS: application containers are non-root, read-only, and memory bounded")


if __name__ == "__main__":
    main()
