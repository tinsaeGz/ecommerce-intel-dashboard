# CI coverage and startup diagnostics

Requirements: SDLC §§7.2, 8.1, 9.2; NFR-5/6/8/10.
Design: [ADR 0002](../docs/decisions/0002-affected-ci-gates.md).

Every PR into `dev` or `main` starts CI. Checks select affected subsystems from
the full Git diff. Each selected subsystem runs its whole suite, including
regressions in unchanged files. Manual dispatch runs every gate but never
deploys. Unknown paths, CI changes, and root dependency changes select all gates.
Deleted files and both sides of a rename participate in selection.

| Changed area | Selected checks |
|---|---|
| Web | Web lint, TypeScript, locale/component/axe tests, production build and 200 KB JS budget; security; container integration/images |
| Mobile | Native lint, TypeScript, unit tests, Android export; security |
| Shared packages | Package builds/tests, generated tokens, both client suites, security, containers; API-client changes also verify OpenAPI |
| API | Ruff formatting/lint/security rules, strict mypy, pytest, 85% overall coverage, 95% domain threshold when domain exists, pip audit; OpenAPI/client regeneration, both client suites, packages, security, containers, migration gate |
| Infrastructure | Compose validation, image builds, real PostgreSQL/Redis/MinIO/mail/worker smoke, CRITICAL image vulnerability scans, security, migration gate |
| Documentation only | Markdown lint and security scan (including secrets in docs) |
| Workflow, root lockfile, unknown paths | Every gate |

`workflow-policy` always validates workflow syntax and tests the selector and
aggregate gate. `ci-gate` always runs and rejects a failed, cancelled, missing,
or unexpectedly skipped selected job. Configure **ci-gate** as the required
check; do not require every conditional job individually.

Security scans include dependency vulnerabilities and secrets in tracked and
non-ignored source files. They exclude ignored workstation credentials, report
HIGH/CRITICAL vulnerability identifiers, and block on CRITICAL vulnerabilities
or any secret finding. Raw secret matches are never printed or uploaded. Image
scans include the built API/web and all running backing-service images. These
checks may expose existing dependency/image findings; do not suppress them to
obtain a green status.

## Migrations and integration limits

`migration-readiness` currently reports **not applicable**, because no schema,
Alembic project, or production snapshot exists. Introducing schema artifacts
without `deploy/check-migrations.sh` fails the gate. That harness must restore
a realistic scrubbed snapshot in isolated PostgreSQL, apply migrations, detect
schema drift, and execute tenant/RLS tests. It belongs with the first accepted
persistence design and migration; an empty migration is not a substitute.

Container smoke tests verify the existing entry points and infrastructure.
They do not claim authentication, storage-adapter, ingestion, billing, browser
critical-journey, or load coverage for features that have not been implemented.
Mobile export is not a device-level/native release validation. Phase 0 and the
SDLC release gates remain incomplete.

## Deployment

Only a push to `dev`/`main` with a successful aggregate gate and web-affecting
changes deploys the Vercel preview/production frontend. The job checks the
deployed `/` and `/app` HTML routes. Protected preview environments require the
`VERCEL_AUTOMATION_BYPASS_SECRET` secret for this probe; a login page is not a
passing smoke test. The probe refuses redirects to avoid forwarding credentials.
No PR receives deployment credentials. Configure required approval for the
production environment in GitHub; YAML cannot install that protection.

No backend staging host, migration snapshot, or deployment credentials exist in
this repository. API/worker images are built and tested, **not deployed**.
Full-stack staging/CD must be completed before Phase 0's staging exit gate.

## Why the current PRs show no checks

GitHub is creating `startup_failure` runs before any jobs or logs exist. The
manual CI dispatch [33953345103](https://github.com/backostech/ecommerce-intel-dashboard/actions/runs/33953345103)
also failed. The workflow passes local actionlint, Actions is enabled, all
actions are allowed, and the repository is neither disabled nor archived.
Existing Dependabot events show the same failure. The API has not exposed the
root cause; an account/service restriction is a hypothesis, not a diagnosis.

Separately, the branch-protection API returns HTTP 403 requiring a private-repo
plan upgrade. The [checked-in policy](branch-protection.json) is not installed.
“No conflicts” and an enabled merge button therefore say nothing about test
success. Do not merge until the required result exists and succeeds.

The repository owner should inspect the failed run in the Actions UI, check
organization Actions/billing restrictions, and provide the run ID to GitHub
Support if the UI exposes no actionable cause. Do not change repository
visibility, increase spending, disable checks, or delete workflow history as
a workaround. Once startup works, dispatch CI on the PR head, require a green
`ci-gate`, merge to `dev`, and verify the deployment job and its smoke result.

## Local checkpoint evidence

The full workspace check passes (43 tests and web/mobile builds), API quality
passes (4 tests, 86.15% coverage and dependency audit), 14 CI behavioral tests
pass, OpenAPI/client regeneration is clean, and real-container smoke passes.
The source dependency/secret scan including development dependencies reports
zero CRITICAL dependencies and zero secrets.

The image gate correctly fails on the existing images. Trivy 0.74.0 reports
the following CRITICAL findings; these are scanner findings requiring triage,
not a claim that every finding is exploitable in this application. No findings
are suppressed and deployment must remain blocked.

| Image | CRITICAL findings |
|---|---|
| `axllent/mailpit:v1.27.4` | 4 |
| `minio/minio:RELEASE.2025-04-22T22-12-26Z` | 8 |
| `postgres:16-bookworm` | 16 |
| `redis:7-bookworm` | 4 |
| `suq-api:local` | 5 |
| `suq-ci-validation-edge` | 7 |

Counts are from this local validation, not a permanent vulnerability inventory.
Use the next CI scan to assess patched images and vendor advisories. GitHub
runner execution, environment approvals, deployed-route probes, real migration
validation, and full-stack staging remain unverified or unavailable as described
above.
