# Sentinel AU API service

This NestJS service exposes the REST and WebSocket APIs consumed by Sentinel AU clients. It includes seeded demo data and is designed to run locally via Docker Compose.

## Features

- Email/password authentication with demo credentials (`demo@example.com` / `demo123`).
- Org/profile listing to illustrate RBAC.
- Policy snapshot endpoint returning signed (mock) bundles.
- Telemetry ingestion buffer for dashboards.
- Swagger documentation at `/docs`.

## Running locally

```bash
pnpm install
pnpm --filter @sentinel-au/api start:dev
```

Environment variables are validated via `@sentinel-au/config`. In production, configure PostgreSQL, Redis, and ClickHouse credentials before deployment.

## Compliance notes

- Token lifetimes default to one hour and should be shortened for high-risk organisations.
- Audit logs and consent statements must be persisted to a write-ahead store when replacing the demo in-memory implementations.
