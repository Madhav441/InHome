# Delivery Roadmap

This roadmap translates the unified architecture into actionable milestones across Apple, Android, and Windows platforms while leaving space for additional vendors. Each phase lists the expected inputs and which parts are complete today.

## Phase 0 – Cross-platform foundation ✅

- ✅ Normalised core domain models for devices, commands, policies, tenants, and events.
- ✅ In-memory command bus, enrollment manager, and policy DSL scaffolding.
- ✅ Windows agent skeleton compiled in Go with command queue integration.
- ✅ Apple and Android adapters wired to the shared command bus and policy renderer interfaces.
- ✅ Deployment playbook covering self-hosted, SaaS, and hybrid compositions.

## Phase 1 – Apple & Android GA 🟡

Focus: productionise Apple and Android enrollment, command delivery, and policy distribution.

- 🔄 Implement HTTP handlers for `/mdm/checkin`, `/mdm/connect`, and Android enrollment endpoints on top of the existing adapters.
- 🔄 Integrate APNs token signing and FCM send flows using credentials placed under `infra/secrets/`.
- 🔄 Generate golden files for Apple configuration profiles and Android managed configurations from the policy DSL.
- 🔄 Stand up persistence adapters (SQLite/Postgres) to back the command bus and enrollment stores across offerings.
- 🔜 Automate end-to-end smoke tests for Apple and Android in CI once transports are available.

## Phase 2 – Windows hardening 🟡

Focus: graduate the Windows agent from MVP to production readiness.

- 🔄 Implement secure enrollment (mutual TLS or token exchange) with certificate inputs from `infra/secrets/windows/`.
- 🔄 Execute PowerShell/Win32 command handlers and report acknowledgements via the command bus.
- 🔄 Package the agent as an MSI with code-signing sourced from the uploaded certificates.
- 🔜 Introduce Windows-specific policy renderers (e.g., registry operations, security baselines) with golden-file validation.

## Phase 3 – Extended device coverage 🔜

Focus: onboard additional vendor ecosystems beyond Apple/Android/Windows.

- 🔜 Prioritise next platforms (ChromeOS, Linux, IoT) and design corresponding adapters using the `other` platform placeholder.
- 🔜 Define enrollment and command transports per vendor and stub adapters for early contract tests.
- 🔜 Expand the policy DSL with new action types mapped to the adapters.

## Shared Deliverables

These items span multiple phases and should be tracked continuously:

- 🔄 Web console scaffolding that consumes the shared API schemas for device inventory, policy assignment, and command history.
- 🔄 Observability stack (metrics/log aggregation) for all deployment modes.
- 🔜 Billing and auth adapter integrations for the SaaS offering.

## Inputs needed from you

Provide or coordinate the following resources so we can deploy and test each phase:

- **Apple** – Upload APNs Auth Keys, Apple Business Manager tokens (when available), and optional SCEP/ACME credentials to `infra/secrets/apns/`.
- **Android** – Upload Firebase service account JSON with FCM send permissions to `infra/secrets/fcm/`.
- **Windows** – Upload code-signing certificates, SCEP enrollment profiles, and any relay credentials to `infra/secrets/windows/`.
- **Future vendors** – Share early API documentation or sandbox credentials so we can model the new adapter interfaces.

Once the credentials are in place, follow the deployment guide for smoke testing and report back with any gaps so we can iterate on the next milestone.
