import contextlib
import io
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from affected import LANES, changed_paths, select
from deployment_smoke import NoRedirect
from gate import JOBS, failures
from migrations import schema_paths
from security import main as security_scan


class SelectionTests(unittest.TestCase):
    def test_documentation_only(self):
        self.assertEqual(
            {key for key, value in select(["docs/design.md"]).items() if value},
            {"docs", "security"},
        )

    def test_web_does_not_run_unrelated_backend_or_mobile(self):
        lanes = select(["apps/web/src/app.tsx"])
        self.assertTrue(lanes["web"] and lanes["containers"] and lanes["deploy_web"])
        self.assertFalse(lanes["api"] or lanes["mobile"])

    def test_backend_rechecks_contract_consumers_without_web_deployment(self):
        lanes = select(["apps/api/src/suq_api/api/v1/version.py"])
        self.assertTrue(
            all(
                lanes[key] for key in ("api", "contract", "web", "mobile", "migrations")
            )
        )
        self.assertFalse(lanes["deploy_web"])

    def test_shared_packages_recheck_both_clients(self):
        for package in ("design-tokens", "shared-types", "api-client"):
            lanes = select([f"packages/{package}/src/index.ts"])
            self.assertTrue(
                all(lanes[key] for key in ("web", "mobile", "packages", "containers"))
            )

    def test_workflow_lockfile_unknown_and_manual_select_all(self):
        for path in (
            ".github/workflows/ci.yml",
            "package-lock.json",
            "new-subsystem/code.py",
        ):
            self.assertTrue(all(select([path]).values()))
        self.assertTrue(all(select([], full=True).values()))

    def test_deleted_or_moved_paths_affect_both_sides(self):
        lanes = select(["apps/web/old.ts", "apps/mobile/new.ts"])
        self.assertTrue(lanes["web"] and lanes["mobile"])

    def test_diff_uses_merge_base_for_pr_and_before_after_for_push(self):
        with patch(
            "affected.subprocess.check_output", return_value=b"old file\0new\nfile\0"
        ) as command:
            event = {"pull_request": {"base": {"sha": "abc"}, "head": {"sha": "def"}}}
            self.assertEqual(
                changed_paths("pull_request", event), ["old file", "new\nfile"]
            )
            self.assertIn("abc...def", command.call_args.args[0])
            self.assertIn("--no-renames", command.call_args.args[0])
            changed_paths("push", {"before": "abc", "after": "def"})
            self.assertIn("abc..def", command.call_args.args[0])

    def test_initial_push_and_manual_dispatch_run_all(self):
        self.assertIsNone(changed_paths("push", {"before": "0" * 40}))
        self.assertIsNone(changed_paths("workflow_dispatch", {}))


class GateTests(unittest.TestCase):
    def needs(self):
        return {
            "changes": {
                "result": "success",
                "outputs": {lane: "true" for lane in LANES},
            },
            "workflow": {"result": "success"},
            **{job: {"result": "success"} for job in JOBS.values()},
        }

    def test_all_required_checks_must_pass(self):
        self.assertEqual(failures(self.needs()), [])
        for result in ("skipped", "cancelled", "failure", None):
            needs = self.needs()
            needs["backend"]["result"] = result
            self.assertTrue(failures(needs))

    def test_only_unselected_checks_may_skip(self):
        needs = self.needs()
        needs["changes"]["outputs"]["api"] = "false"
        needs["backend"]["result"] = "skipped"
        self.assertEqual(failures(needs), [])

    def test_missing_selection_or_planner_failure_blocks_merge(self):
        needs = self.needs()
        del needs["changes"]["outputs"]["api"]
        self.assertTrue(failures(needs))
        needs = self.needs()
        needs["changes"]["result"] = "failure"
        self.assertTrue(failures(needs))


class MigrationTests(unittest.TestCase):
    def test_schema_artifacts_cannot_silently_skip(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.assertEqual(schema_paths(root), [])
            path = root / "apps/api/src/suq_api/models/merchant.py"
            path.parent.mkdir(parents=True)
            path.touch()
            self.assertIn(path, schema_paths(root))


class SecurityTests(unittest.TestCase):
    def test_secret_findings_fail_without_printing_the_match(self):
        def scan(command, **kwargs):
            destination = Path(command[command.index("--output") + 1])
            destination.write_text(
                json.dumps(
                    {"Results": [{"Secrets": [{"Match": "sensitive-test-sentinel"}]}]}
                )
            )

        output = io.StringIO()
        with (
            patch("security.subprocess.check_output", return_value=b""),
            patch("security.subprocess.run", side_effect=scan),
            contextlib.redirect_stdout(output),
            self.assertRaises(SystemExit),
        ):
            security_scan()
        self.assertNotIn("sensitive-test-sentinel", output.getvalue())
        self.assertIn("secret findings: 1 (redacted)", output.getvalue())

    def test_deployment_probe_never_forwards_credentials_on_redirect(self):
        self.assertIsNone(
            NoRedirect().redirect_request(
                None, None, 302, "Found", {}, "https://another-host.example"
            )
        )


if __name__ == "__main__":
    unittest.main()
