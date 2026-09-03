# Generated API client

The checked-in OpenAPI document is exported from `apps/api`; TypeScript schema
types are then generated with `openapi-typescript`. Web and mobile must consume
this package instead of writing separate request contracts.

Run `npm run generate` at the repository root after changing an API route or
response model. CI fails when the generated schema is stale.
