# CI performance

The workflow selects full affected subsystem suites, then requires each selected suite to pass through `ci-gate`. This implements SDLC §8 and §9.2 without weakening the merge gate.

## Findings on 2026-09-05

[PR 6's run](https://github.com/tinsaeGz/ecommerce-intel-dashboard/actions/runs/33984833931) queued its first job for 6 minutes 57 seconds. The repository had one online, busy runner (`suq-ci-personal-local`), shared with a concurrent `dev` run.

The [previous successful run](https://github.com/tinsaeGz/ecommerce-intel-dashboard/actions/runs/33982592193) lasted about 23 minutes. Its frontend suite took 53 seconds, while individual job setup steps commonly took 26–54 seconds. Five separate jobs repeated full monorepo npm installs of roughly 21–27 seconds each. These are observations from those runs, not future duration guarantees.

Documentation screenshots were unknown paths in the conservative selector, so a landing-page PR with PNG evidence selected every subsystem. Known documentation image/diagram extensions under `docs/` now select documentation and security checks. Runtime images retain their application's checks; unknown documentation files, workflow changes, lockfile changes, and manual runs still select all suites.

For PR 6's actual changed-file list, the corrected selector enables web, docs, security, containers and post-merge web deployment eligibility. Backend, mobile, shared-package, contract and migration jobs are no longer selected solely because the PR contains screenshots. Workflow policy and the aggregate gate remain mandatory. PR events still do not deploy.

## Dependency installation

All existing npm CI installs prefer cached downloads while retaining lockfile-based clean installs. Documentation uses `npm ci --prefer-offline --workspaces=false`, installing the root markdown tooling without app dependencies. It still lints the full documentation set. Dependency/secret scans remain enabled and scan the repository independently of that reduced install.

See npm's [clean-install and workspace behavior](https://docs.npmjs.com/cli/v11/commands/npm-ci/) and [prefer-offline configuration](https://docs.npmjs.com/cli/v11/using-npm/config/#prefer-offline). Cache preference permits network downloads for missing packages; it does not reuse a prior `node_modules` tree.

## Validation and limits

- All 17 CI policy tests passed, including regression cases for screenshot-plus-web changes, runtime images, unknown docs and mandatory selected checks.
- Ruff format/lint, actionlint 1.7.12 and Git whitespace checks passed.
- A clean temporary fixture using the committed manifests and lockfile installed 86 packages in 1.6 seconds with the docs command, omitted Vite and React Native, and passed all 38 tracked Markdown files available at the time of that check.
- Full repository documentation lint passed after adding this note.
- The application and container suites were not rerun locally for this workflow-only change. The optimization PR selects every suite in GitHub because it changes workflow/policy files; its results are separate from local policy validation.

This does not change a run already queued on an older commit. Once merged into `dev`, feature branches need the updated workflow before benefiting. Merge `dev` into any open dependent branch when needed.

The remaining queue bottleneck needs capacity or fewer concurrent runs. Before adding runners on the same Docker host, isolate the fixed `suq-ci` Compose project, published ports and temporary report paths: the existing integration job is designed for one runner at a time. Separate machines are another option. Do not cancel a deployment in progress merely to prioritize a PR. Measure queue, setup, install and test durations separately on subsequent runs before claiming an end-to-end improvement.
