# ADR 0002: CI gates selected by affected subsystems

Status: Accepted for the requested CI coverage work.

Requirements: SDLC §§7.2, 8.1, 9.2; NFR-5, NFR-6, NFR-8, NFR-10.

Run the workflow for every PR into dev/main and every push to those branches.
Select jobs inside the workflow, not with workflow-level path filters, so the
final `ci-gate` always reports a result. Selection uses a local Git diff with
rename detection disabled, preserving both removed and added paths. PRs compare
their merge base with the head; pushes compare before/after. Missing bases and
manual dispatch select everything. Unknown paths also select everything.

Changed files select full subsystem suites, not individual test files. Shared
TypeScript packages affect both clients; backend changes recheck OpenAPI and
client compatibility; root dependency and CI changes select every gate. Pure
documentation changes run documentation/security checks without application builds.

Separate jobs expose frontend, mobile, shared packages, backend, API contract,
dependency/secret security, migrations, and real-container integration results.
The aggregate gate verifies every selected job succeeded, rejecting failures,
cancellations, missing jobs, and unexpected skips. Its status name is the sole
required check in the checked-in branch policy. Applying that policy remains
subject to the repository's GitHub plan; a local policy file is not enforcement.

No schema exists yet. The migration gate explicitly reports this as not
applicable, and fails if schema artifacts are introduced without the real
snapshot/upgrade/RLS test harness. It must not fabricate an empty migration or
claim to test tenant isolation before persistence exists. Authentication,
billing, ingestion, browser critical journeys, production snapshots, and
full-stack deployment remain unimplemented product/release gates.

The existing deployment target remains Vercel web only. Deploy web-affecting
changes after successful push checks, never from untrusted PR execution. Backend
checks and image scans do not imply the backend was deployed. Production uses
the production environment; its required approval must be configured in GitHub.

References: [GitHub workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax),
[run diagnostics](https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs),
and [Trivy image scans](https://trivy.dev/docs/latest/target/container_image/).
