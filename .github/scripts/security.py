"""Scan repository files while redacting secrets and ignoring local-only files."""

import json
import shutil
import subprocess
import tempfile
from pathlib import Path


def main() -> None:
    root = Path(__file__).resolve().parents[2]
    paths = (
        subprocess.check_output(
            ["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard"],
            cwd=root,
        )
        .decode()
        .split("\0")
    )
    with tempfile.TemporaryDirectory(prefix="suq-security-") as directory:
        stage = Path(directory) / "source"
        stage.mkdir()
        for name in filter(None, paths):
            source = root / name
            if source.is_symlink():
                continue
            if source.is_file():
                destination = stage / name
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(source, destination)
        report = Path(directory) / "report.json"
        subprocess.run(
            [
                "trivy",
                "fs",
                "--scanners",
                "vuln,secret",
                "--include-dev-deps",
                "--format",
                "json",
                "--output",
                str(report),
                str(stage),
            ],
            check=True,
            timeout=600,
        )
        data = json.loads(report.read_text())
        critical = 0
        secrets = 0
        for result in data.get("Results", []):
            for vulnerability in result.get("Vulnerabilities", []):
                severity = vulnerability["Severity"]
                if severity in {"HIGH", "CRITICAL"}:
                    print(
                        f"{severity}: {vulnerability['VulnerabilityID']} "
                        f"({vulnerability['PkgName']})"
                    )
                critical += severity == "CRITICAL"
            secrets += len(result.get("Secrets", []))
        print(
            f"Critical dependency vulnerabilities: {critical}; "
            f"secret findings: {secrets} (redacted)"
        )
        if critical or secrets:
            raise SystemExit(
                "Security gate failed. Inspect findings locally; "
                "never publish raw secret matches."
            )


if __name__ == "__main__":
    main()
