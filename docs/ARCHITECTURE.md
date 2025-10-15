# InHome Unified MDM Architecture

This repository models the multi-offering MDM control plane described in the product brief. The codebase is split into reusable core packages, modular adapters, feature modules, and deployment-specific apps that wire the modules together.

## Directory Overview

- `packages/core` – Normalized device, command, policy, tenant, and service interfaces shared across the platform.
- `packages/adapters` – Transport, persistence, Apple MDM, auth/billing, and remote access adapters that plug into the core service interfaces.
- `features` – Implementation of cross-cutting services such as the policy DSL, command bus, and enrollment management.
- `apps` – Entry points for self-hosted, SaaS, and hybrid product offerings which compose core packages with adapters.
- `ui/web-console` – View-model utilities consumed by the future admin console.
- `agents/desktop` – Go-based desktop agent skeleton for the desktop MVP.
- `infra` – Deployment manifests (placeholders for Docker Compose, Kubernetes, and migrations).
- `docs` – Architecture documentation (this file) and future design specs.

## Modular Composition

The control plane is divided into services that work across all offerings:

- **Policy Service** – Defined by the policy DSL module and renderers (e.g., Apple profile renderer) that translate normalized rules into platform-specific artifacts.
- **Command Service** – Implemented via the command bus feature that coordinates per-device queues and retries.
- **Enrollment Service** – Handles invite flows and session management, used by Apple MDM check-in and desktop agents alike.
- **Inventory Service** – Backed by persistence adapters to store devices and their facts.

Adapters expose transport- or deployment-specific wiring without changing the domain logic. For example, the Apple adapter exposes `/mdm/checkin` and `/mdm/connect`, issues APNs pushes, and renders signed configuration profiles while reusing the shared command bus and policy renderer.

## Deployment Modes

- **Self-hosted** – Uses in-memory persistence defaults and assumes SQLite/Postgres parity, ready to swap adapters for production.
- **SaaS** – Adds multi-tenant safeguards and a pluggable auth/billing adapter.
- **Hybrid** – Composes the command bus with the remote access provider to support on-prem device control via relay links.

Each app exports helpers that will eventually back HTTP or gRPC frontends.

## Next Steps

1. Flesh out the policy DSL compiler to emit golden files for Apple configuration profiles and desktop/Android enforcement.
2. Implement persistent adapters (SQLite/Postgres) behind the `PersistenceAdapter` interface.
3. Build the actual HTTP services that consume the app bootstrap helpers.
4. Extend the desktop agent with command execution and a secure enrollment handshake.
5. Scaffold the web console UI and integrate it with API clients.
