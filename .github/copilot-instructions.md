# Copilot Instructions for InHome Unified MDM Platform

## Overview
The InHome Unified MDM Platform is a modular, multi-package workspace designed to support self-hosted, SaaS, and hybrid deployments. It shares a common core while allowing flexibility in deployment modes. The project is structured to maximize code reuse across offerings.

### Key Components
- **`packages/core`**: Shared domain models (e.g., devices, commands, policies, tenants) and service interfaces.
- **`packages/adapters`**: Integrations for Apple MDM, transports, persistence, auth/billing, and remote access.
- **`features`**: Implementations for the policy DSL, command bus, and enrollment services.
- **`apps`**: Composition roots for self-hosted, SaaS, and hybrid product modes.
- **`ui/web-console`**: View-model helpers for the unified admin console.
- **`agents/desktop`**: Go-based Windows agent skeleton for the desktop-first MVP.
- **`infra`**: Deployment scaffolding for Docker Compose and Kubernetes.
- **`docs`**: Architecture notes, deployment guides, and planning documents.

## Developer Workflows

### Building the Project
1. Install dependencies and build TypeScript packages:
   ```bash
   npm install
   npm run build
   ```
   > Note: The repository includes offline stubs for `typescript` and `@types/node` under `vendor/` to support sandboxed environments. Edit `package.json` to switch to official packages if needed.

2. Build the Go Windows agent:
   ```bash
   cd agents/desktop
   go build ./...
   ```

### Deployment and Testing
- Refer to `docs/DEPLOYMENT_AND_TESTING.md` for setup, deployment, and manual testing procedures.
- Functional test scripts can be executed with Node after building the workspace.

### Secrets Management
- Store environment-specific credentials outside source control in `infra/secrets/`.
- Use `.env` files under `infra/<mode>/` to reference secret paths. Example:
  ```
  APNS_KEY_PATH=infra/secrets/apns/AuthKey_TEAMID.p8
  FCM_CREDENTIALS_PATH=infra/secrets/fcm/tenant-acme.json
  WINDOWS_CERT_PATH=infra/secrets/windows/inhome-code-signing.pfx
  ```
- Provision secrets via deployment pipelines or shared secrets managers (e.g., AWS Secrets Manager).

## Project-Specific Conventions
- **Multi-Package Workspace**: The project uses a modular structure to share domain models and services across deployment modes.
- **Offline Development**: Vendor stubs in `vendor/` enable offline development in sandboxed environments.
- **Kubernetes Overlays**: Use Kustomize to overlay environment-specific configurations on base Kubernetes manifests.

## Integration Points
- **Apple MDM**: APNs credentials stored in `infra/secrets/apns/`.
- **Android Push**: Firebase credentials stored in `infra/secrets/fcm/`.
- **Windows Agent**: Certificates and enrollment packages stored in `infra/secrets/windows/`.

## References
- `docs/ARCHITECTURE.md`: Component overview.
- `docs/ROADMAP.md`: Delivery milestones.
- `docs/DEPLOYMENT_AND_TESTING.md`: Deployment and testing guide.
- `infra/secrets/README.md`: Secrets management details.
- `infra/k8s/README.md`: Kubernetes deployment notes.
- `infra/docker-compose/README.md`: Docker Compose setup.