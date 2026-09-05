# Claude Code Project Instructions

@AGENTS.md

## Claude Code

- The exclusive-session rule applies before any repository work.
- Use `ghost` as the Claude identity within the typed branch convention from `AGENTS.md`, for example `feat/ghost/<requirement-or-area>-<slug>`. Never use `agent` as the branch prefix or put `claude`, its provider, or a model name in a branch name.
- Do not create subagents or run tasks concurrently.
- Treat `AGENTS.md` and `SDLC.md` as authoritative.
- Use `UI-UX-CONCEPT.md` as the detailed landing-page and product UI/UX implementation reference; defer to `SDLC.md` if they conflict.
- For dropdowns, follow the shared component policy in `AGENTS.md` and the visual, interaction, and validation contract in `UI-UX-CONCEPT.md` §12.13; apply it consistently from the landing page through future product screens.
- Implement web styling in `apps/web` with plain vanilla CSS under the structure and constraints in `AGENTS.md`. React Native code in `apps/mobile` uses native styles backed by the shared design tokens; do not introduce Tailwind, preprocessors, CSS-in-JS, or CSS Modules.
- When `UI-UX-CONCEPT.md` changes materially, regenerate `SUQ-INSIGHTS-UI-UX-CONCEPT.pdf` in the same checkpoint.
