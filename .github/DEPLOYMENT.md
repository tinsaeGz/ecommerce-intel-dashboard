# Deployment workflow

GitHub Actions is the deployment authority for the Vercel frontend project
`yohanis-axki-s-projects/ecommerce-intel-dashboard`:

- a successful push to `dev` creates a Vercel Preview deployment;
- a successful push to `main` creates a Vercel Production deployment;
- pull requests run quality and branch-policy checks without deploying; and
- other branches are excluded from both automatic deployment paths.

The CI workflow uses these encrypted repository secrets:

- `VERCEL_TOKEN` authenticates Vercel CLI;
- `VERCEL_ORG_ID` identifies the Vercel team; and
- `VERCEL_PROJECT_ID` identifies the frontend project.

Vercel hosts only the React/Vite frontend. The FastAPI and Celery services,
PostgreSQL, Redis, and MinIO retain the same-origin container deployment
architecture defined by `SDLC.md`; they are not silently moved to Vercel.

The Vercel GitHub App may replace the deployment job later. If it does, remove
the Action-based deployment in the same checkpoint to avoid duplicate builds.
