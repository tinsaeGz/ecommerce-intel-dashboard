# ADR 0003: CI service image remediation

## Status

Accepted

## Context

The Phase 0 compose smoke gate builds the web and API containers, starts real backing services, and scans every resulting service image with Trivy before the aggregate `ci-gate` can pass. Current upstream Caddy, MinIO, PostgreSQL Bookworm, Redis Bookworm, and pinned Mailpit images surfaced CRITICAL findings in CI. Several findings were in upstream Go binaries or base operating-system packages and could not be fixed by changing application code.

The architecture keeps the object-storage boundary S3-compatible and already allows either Caddy or nginx at the edge. The CI gate must continue to block deployment on CRITICAL image findings rather than suppressing them.

## Decision

Use scan-clean runtime images for the Phase 0 development stack:

- serve the web build and same-origin API routes with `nginx:alpine`;
- run the API from `python:3.12-alpine`;
- use a thin `postgres:16-alpine` derivative that removes the vulnerable `gosu` helper and runs as the `postgres` user;
- use `redis:7-alpine`;
- use an in-repository Python S3 health stub for Phase 0 object-storage readiness until upload behavior is implemented;
- use the current `axllent/mailpit:latest` image.

The production architecture still targets an S3-compatible object store and a compose-managed edge proxy. The Phase 0 stub only proves network wiring and readiness. The ingestion phase must replace it with MinIO or another S3-compatible service before upload behavior lands.

## Consequences

The CI/CD gate preserves full image coverage while avoiding known vulnerable upstream images. Development object-storage behavior is limited to readiness in Phase 0, so MinIO-specific behavior is not exercised until the ingestion phase replaces the stub with a scan-clean S3-compatible service.
