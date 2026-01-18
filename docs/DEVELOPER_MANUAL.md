# Sentinel AU developer manual

## Audience

This manual is for developers and operators who build, run, or extend Sentinel AU.

## Repo overview

- `apps/` contains user-facing clients (web, mobile, agents).
- `services/` contains backend services (API, telemetry, alerting, reporting).
- `packages/` contains shared UI, SDKs, and configuration.
- `deploy/` contains Docker, Helm, and Terraform deployment assets.

## Local development

### Prerequisites

- Node.js 18.17+ (recommended 20+).
- pnpm 9.
- Docker for the Compose demo.

### Bootstrap

```bash
pnpm install
pnpm run build
pnpm run smoke
```

### Run the web console + API locally

```bash
pnpm --filter apps/self_host run dev
pnpm --filter apps/web dev
```

## Docker demo

```bash
cd deploy/docker
cp .env.example .env
pnpm run compose:up
```

Stop the stack:

```bash
pnpm run compose:down
```

## Enrollment automation hooks

- Use a bulk import or CLI to create pending enrollment records.
- Enforce consent logging and org scoping.
- Generate pairing codes scoped to the child profile.

See `docs/ENROLLMENT_AUTOMATION.md` for the data contract and guardrails.

## Deployment modes

- **Self-hosted**: single-node Docker profile.
- **Cloud**: Terraform + Helm on AWS ap-southeast-2.
- **Hybrid**: gateway + DNS on-prem, telemetry in cloud.

See `docs/DEPLOYMENT.md` for detailed guidance.

## Extending offerings

- Add feature flags for tiered offerings (home/school/enterprise).
- Expand RBAC roles for schools, carers, and administrators.
- Maintain a platform-agnostic policy schema for Android and iOS.
