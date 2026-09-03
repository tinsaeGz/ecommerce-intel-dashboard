# Claude Code Project Instructions

@AGENTS.md

## Claude Code

- The exclusive-session rule applies before any repository work.
- Do not create subagents or run tasks concurrently.
- Treat `AGENTS.md` and `SDLC.md` as authoritative.
- Use `UI-UX-CONCEPT.md` as the detailed landing-page and product UI/UX implementation reference; defer to `SDLC.md` if they conflict.
- Implement web styling in `apps/web` with plain vanilla CSS under the structure and constraints in `AGENTS.md`. React Native code in `apps/mobile` uses native styles backed by the shared design tokens; do not introduce Tailwind, preprocessors, CSS-in-JS, or CSS Modules.
- When `UI-UX-CONCEPT.md` changes materially, regenerate `SUQ-INSIGHTS-UI-UX-CONCEPT.pdf` in the same checkpoint.
