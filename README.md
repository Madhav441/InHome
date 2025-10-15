# InHome Unified MDM Platform

This repository bootstraps the InHome MDM control plane with a modular architecture that supports self-hosted, SaaS, and hybrid deployments while sharing a common core. The project is organized as a multi-package workspace so the same domain models and services can be reused across offerings.

## Structure

- `packages/core` – Shared domain models (devices, commands, policies, tenants) and service interfaces.
- `packages/adapters` – Swap-in integrations for Apple MDM, transports, persistence, auth/billing, and remote access.
- `features` – Policy DSL, command bus, and enrollment service implementations.
- `apps` – Composition roots for self-hosted, SaaS, and hybrid product modes.
- `ui/web-console` – View-model helpers for the unified admin console.
- `agents/desktop` – Go Windows agent skeleton used in the desktop-first MVP.
- `infra` – Deployment scaffolding for Docker Compose and Kubernetes.
- `docs` – Architecture notes and planning guides.

## Getting Started

Install dependencies and build the TypeScript packages:

```bash
npm install
npm run build
```

> **Note**
> The sandbox environment that powers this repository does not permit outbound access to the public npm registry. To keep
> install commands working we ship lightweight offline stubs for `typescript` and `@types/node` under `vendor/`. They satisfy
> tooling expectations during local development while you work on the architecture. If you plan to run the project outside
> the sandbox you can switch the devDependencies back to the official packages by editing `package.json`.

The Go Windows agent can be built independently:

```bash
cd agents/desktop
go build ./...
```

Refer to `docs/ARCHITECTURE.md` for the component overview and `docs/ROADMAP.md` for delivery milestones.

## Deployment & Testing

- See `docs/DEPLOYMENT_AND_TESTING.md` for detailed setup, deployment, and
  manual test procedures across the self-hosted, SaaS, and hybrid offerings.
- The guide also lists functional test scripts that can be executed with Node
  after building the workspace, as well as future automation targets.
