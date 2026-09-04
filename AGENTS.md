# Repository Instructions

## Mission and authority

- Complete Suq Insights as a production SaaS governed by `SDLC.md` version 3.0.
- Treat `SDLC.md` as the canonical product, architecture, delivery, and operations specification. It overrides conflicting material in `docs/`, especially the older fixed-schema ingestion and fixed-dashboard designs.
- Use the requirement IDs and phase gates in `SDLC.md` to define acceptance criteria and trace implementation work.
- Do not silently weaken, replace, or invent product requirements. Record material decisions that cross module boundaries, add tables, or affect money or entitlements in an accepted design note or ADR before implementation.

## Architecture

- Maintain one monorepo with deployable applications in `apps/web`, `apps/mobile`, and `apps/api`; reusable TypeScript boundaries in `packages/api-client`, `packages/design-tokens`, and `packages/shared-types`; and operational material in `deploy/` and `docs/`.
- Build `apps/web` with React, React Router, TypeScript, Vite, standards-based vanilla CSS, TanStack Query, react-i18next, and ECharts. Serve marketing pages and the application from the same origin, with the authenticated product under `/app` and the versioned API under `/v1`.
- Build `apps/mobile` with Expo and React Native. Native delivery remains demand-triggered as specified by the SDLC, but mobile architecture must stay compatible with token authentication, offline entry, camera ingestion, push notifications, and the shared versioned API.
- Build `apps/api` with Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2 async, Alembic, PostgreSQL 16, Redis 7, Celery 5, MinIO, Polars, DuckDB, and the SDLC document-extraction stack.
- Keep the domain package pure: metrics, forecasting, fingerprints, billing math, entitlement rules, and auction scoring must not depend on HTTP, persistence, workers, or provider adapters.
- Generate `packages/api-client` from the FastAPI OpenAPI contract. Both client applications consume that package; commit a contract change and its regenerated client in the same checkpoint.
- Keep cross-client sharing deliberate: `packages/design-tokens` owns platform-neutral values, while web CSS and React Native styles remain platform-specific. `packages/shared-types` may contain client-safe primitives only; backend domain models and secrets never move into TypeScript merely for reuse.
- Keep API and worker processes stateless. Heavy work belongs in isolated Celery queues, never in the request path.
- Read all configuration from the environment, validate it at startup, and refuse to start when required configuration is invalid.

## UI/UX and vanilla CSS

- Treat `UI-UX-CONCEPT.md` as the implementation reference for the landing-page narrative, product information architecture, visual tokens, responsive behavior, component states, accessibility, localization, and interaction details. `SDLC.md` remains authoritative when the documents conflict. `SUQ-INSIGHTS-UI-UX-CONCEPT.pdf` is a reading artifact; update it whenever its Markdown source materially changes.
- Author web styling as plain `.css` files imported explicitly by the owning entry point or component. Do not add Tailwind, Sass/Less, CSS-in-JS, CSS Modules, a runtime styling library, or a second design system without an approved architecture decision. React Native uses its native `StyleSheet` API rather than CSS.
- Keep global web CSS deliberate: generate shared token custom properties from `packages/design-tokens/tokens.json`, define normalization in `apps/web/src/styles/reset.css`, element defaults in `apps/web/src/styles/base.css`, and ordered cascade layers `reset`, `base`, `components`, `utilities`, and `overrides`. Co-locate feature and component CSS with the code it styles once those directories exist.
- Use CSS custom properties for color, typography, spacing, radius, elevation, motion, breakpoints where usable, and component-level theming. Reuse a semantic token when one exists; do not scatter raw brand values through feature styles.
- Keep selectors low-specificity and locally namespaced with a consistent component/feature convention. Prefer classes and `data-*` state attributes; avoid IDs, deep descendant chains, `!important`, and markup-dependent selectors.
- Reserve inline styles for genuinely runtime-calculated geometry or values that cannot be expressed through a class or custom property. State, variants, responsive behavior, focus, reduced motion, and print styling belong in CSS.
- Implement mobile-first, content-driven layouts from the breakpoints and behavior in `UI-UX-CONCEPT.md`. Every changed component must cover loading, empty, error, disabled/permission, localization expansion, keyboard focus, reduced motion, and touch targets as applicable.

## Product invariants

- Enforce tenant isolation twice: scope every tenant-owned query by `merchant_id` and apply PostgreSQL row-level security. Return not-found for cross-tenant resource identifiers.
- Resolve authentication, tenant scope, entitlements, rate limits, idempotency, and conditional requests in the shared middleware and service layers rather than ad hoc endpoint checks.
- Channel intent is declared by the merchant and is never inferred from values. Reconciliation is always a proposal requiring merchant confirmation unless a previously confirmed structural signature applies.
- Preserve raw uploads and typed unmapped attributes. Model revisions are versioned, auditable, previewable, reversible, and capable of re-deriving existing history without re-upload.
- Treat a load as the unit of undo. Derived state must recompute correctly for late events, amendments, and reversals.
- Use decimal values plus explicit currency for merchant money and integer micro-units with an append-only ledger for advertising balances. Never use binary floating point for money.
- Enforce plan entitlements centrally in both upgrade and downgrade directions. Webhooks, retries, sync operations, and billable events must be idempotent.
- Localize all user-facing content in English, Spanish, and French. Do not hardcode user-facing strings. Meet WCAG 2.1 AA, keyboard navigation, and reduced-motion requirements.
- Emit structured logs, metrics, traces, and actionable errors for new behavior without exposing credentials, customer data, or raw uploaded values.
- Preserve the SDLC service objectives: dashboard reads below 300 ms p95, 10 MB ingestion below 60 seconds, verification delivery below 15 seconds, and no dashboard degradation during ingestion load.

## Exclusive LLM session

Only one LLM may perform repository work at a time. This includes implementation, inspection, research against repository contents, testing, review, and documentation.

1. Before repository work, resolve the shared Git directory with `git rev-parse --path-format=absolute --git-common-dir` and atomically create `<git-common-dir>/llm-active.lock`. The commands needed to locate and acquire the lock are the only repository commands permitted before acquisition.
2. After acquisition, create `<git-common-dir>/llm-active.lock/OWNER` containing the LLM name, task, current branch, and UTC start time.
3. If atomic creation fails because the lock exists, stop immediately and tell the user which owner is recorded. Do not inspect the repository, wait in the background, or begin a different task.
4. Never start subagents, parallel agents, background LLM sessions, or concurrent reviews. Do not run Codex and Claude against this repository at the same time, even for read-only work.
5. Never override or remove another session's lock. A stale lock may be cleared only after the user explicitly authorizes it and the previous session is confirmed stopped.
6. Work sequentially in one working tree. A successor starts only after the previous owner has released the lock and provided a handoff.
7. Release the lock as the final repository action after validation, checkpointing, and handoff preparation. Remove only the exact `OWNER` file and `llm-active.lock` directory resolved from the Git common directory.

## Starting and scoping work

- After acquiring the lock, inspect `git status`, the current branch, recent commits, and the relevant SDLC sections before editing.
- State the active requirement IDs, acceptance criteria, branch, and intended paths. Ask for clarification only when a material product decision cannot be derived from the repository.
- Use short-lived implementation branches named `<type>/<identity>/<requirement-or-area>-<slug>`, normally lasting no more than three days. Use the smallest accurate Conventional Commit type, such as `feat`, `fix`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`, or `chore`; do not use `agent` as a branch prefix or type.
- Use `tensu` as the branch identity for Codex and `ghost` as the branch identity for Claude. For example, use `feat/tensu/landing-daily-value` or `fix/ghost/auth-cookie-rotation`. Branch names must use these stable identities rather than an LLM, provider, product, or model name. A successor may continue an existing branch only when the user explicitly hands it over.
- Keep changes within the active requirement. Preserve all unrelated user changes and avoid unrelated formatting, dependency, generated-file, or lockfile churn.
- Do not create parallel worktrees for LLM collaboration. Human-created worktrees are allowed, but the repository-wide LLM lock still applies across them.

## Checkpoints and Git safety

- Commit every coherent, usable implementation checkpoint locally after its relevant quality gates pass. Do not commit broken, speculative, placeholder, or WIP behavior.
- Use path-scoped staging. Do not use `git add -A`, stage another contributor's changes, or include unrelated files.
- Use Conventional Commits with a concise completed-capability subject and this body format:

```text
type(scope): concise completed capability

Requirements: <SDLC requirement IDs or section>
Tests: <commands and results>
Checkpoint: <completed and usable behavior>
```

- Keep each migration with the model, repository behavior, and tests it enables. Keep API contracts with generated clients, locale keys with their feature, and observability with the behavior being observed.
- Never amend or rewrite shared history. Never discard changes with destructive Git commands.
- Never push, merge, rebase, cherry-pick, tag, or change remote configuration without explicit user direction. The designated integration owner performs reviewed squash merges into an always-releasable `main` and preserves requirement and test evidence in the squash commit.

## Quality gates and definition of done

- Run the narrowest relevant checks during development, then all affected subsystem gates before committing. Use the commands defined by the repository's manifests and CI configuration once those files exist.
- Backend work requires formatting/lint, strict type checks where configured, unit tests, and relevant integration tests against real PostgreSQL, Redis, and MinIO. Domain logic must remain property-testable.
- Web and mobile work requires formatting/lint, TypeScript checks, component tests in all three locales, and accessibility checks for changed flows. Web changes additionally require a production build within its performance budget; native release work requires the relevant Expo platform build and device-level offline, camera, notification, and accessibility checks.
- Schema work requires hand-reviewed Alembic migrations, upgrade validation against a realistic snapshot, tenant/RLS tests, and zero-downtime expand-migrate-contract discipline.
- Contract, security, billing, ingestion, or critical-journey changes require the corresponding contract, negative, fixture-corpus, idempotency, and end-to-end coverage from SDLC chapter 8.
- Maintain at least 95% coverage for the pure domain package and 85% overall. Do not hide coverage regressions by excluding meaningful code.
- If a required tool or environment is unavailable, report the exact unrun gate. Never claim a check passed when it was skipped or unavailable.
- A feature is done only when code, tests, documentation, all three locales, security and tenancy review, observability, and requirement traceability are complete. Do not declare the SaaS complete until every SDLC phase and release gate has passed.

## Sequential handoff

Before releasing the session lock, report:

- current branch and working tree;
- commit SHA and checkpoint summary;
- SDLC requirements addressed;
- tests and validation executed, including anything unavailable;
- modified but uncommitted files, if any;
- remaining risks, dependencies, and the exact next action.

Commit completed work when it forms a valid checkpoint. If it does not, leave it uncommitted and enumerate every changed file so the next explicitly authorized LLM can resume safely.

## Nested instructions

Keep this root file concise and authoritative for the whole repository. Add a nested `AGENTS.md` only when an implemented subsystem needs genuinely different commands or constraints; nested instructions may specialize but must not weaken the exclusive-session rule, SDLC authority, security invariants, or Git safety policy.
