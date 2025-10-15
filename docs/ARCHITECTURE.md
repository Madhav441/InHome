# InHome Unified MDM Architecture

This repository models the multi-offering MDM control plane described in the product brief. The codebase is split into reusable core packages, modular adapters, feature modules, and deployment-specific apps that wire the modules together.

## Directory Overview

- `packages/core` – Normalized device, command, policy, tenant, and service interfaces shared across the platform.
- `packages/adapters` – Transport, persistence, Apple MDM, auth/billing, and remote access adapters that plug into the core service interfaces.
- `features` – Implementation of cross-cutting services such as the policy DSL, command bus, and enrollment management.
- `apps` – Entry points for self-hosted, SaaS, and hybrid product offerings which compose core packages with adapters.
- `ui/web-console` – View-model utilities consumed by the future admin console.
- `agents/desktop` – Go-based Windows agent skeleton for the desktop-first MVP.
- `infra` – Deployment manifests (placeholders for Docker Compose, Kubernetes, and migrations).
- `docs` – Architecture documentation (this file) and future design specs.

## Modular Composition

The control plane is divided into services that work across all offerings:

- **Policy Service** – Defined by the policy DSL module and renderers (e.g., Apple profile renderer) that translate normalized rules into platform-specific artifacts.
- **Command Service** – Implemented via the command bus feature that coordinates per-device queues and retries.
- **Enrollment Service** – Handles invite flows and session management, used by Apple MDM check-in, Android agents, and Windows agents alike.
- **Inventory Service** – Backed by persistence adapters to store devices and their facts.

Adapters expose transport- or deployment-specific wiring without changing the domain logic. For example, the Apple adapter exposes `/mdm/checkin` and `/mdm/connect`, issues APNs pushes, and renders signed configuration profiles while reusing the shared command bus and policy renderer. The Android adapter performs the same orchestration through FCM pushes and managed configuration payloads, and the Windows agent binds directly to the command bus while reuse remains identical.

## Platform Coverage

- **Apple** – `/mdm/checkin` and `/mdm/connect` endpoints, APNs token authentication, profile rendering and signing via the policy renderer.
- **Android** – Enrollment hand-off that issues managed configuration commands over FCM plus an Android-focused policy renderer for Device Policy Manager rules.
- **Windows** – Go-based agent that reuses the shared command bus for command retrieval and acknowledgement, intended for Windows 10/11 via Win32 service packaging.
- **Other vendors** – Represented in the domain model through the `other` platform type so additional adapters can plug into the same orchestration without structural changes.

## Deployment Modes

- **Self-hosted** – Uses in-memory persistence defaults and assumes SQLite/Postgres parity, ready to swap adapters for production.
- **SaaS** – Adds multi-tenant safeguards and a pluggable auth/billing adapter.
- **Hybrid** – Composes the command bus with the remote access provider to support on-prem device control via relay links.

Each app exports helpers that will eventually back HTTP or gRPC frontends.

Refer to `docs/ROADMAP.md` for a detailed delivery plan with timelines and dependencies.

## Next Steps

1. Finalise the policy DSL compiler to emit golden files for Apple profiles, Android managed configurations, and Windows configuration scripts.
2. Implement persistent adapters (SQLite/Postgres) behind the `PersistenceAdapter` interface.
3. Build the actual HTTP services that consume the app bootstrap helpers and expose platform check-in APIs.
4. Extend the Windows agent with command execution, secure enrollment, and FCM/Relay bridges for hybrid deployments.
5. Scaffold the web console UI and integrate it with API clients.
