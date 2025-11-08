# Sentinel AU

Sentinel AU is an open-source family safety platform designed for Australian families and carers. The project ships a multi-tenant SaaS stack that can also be self-hosted. It focuses on transparency, parental consent, and alignment with the Australian Privacy Principles (APPs) and eSafety guidance.

## Prerequisites

- **Node.js** ≥ 18.17 (recommended LTS 20 or 22). On Windows you can install via `winget install OpenJS.NodeJS.LTS`.
- **pnpm** 9 (`npm i -g pnpm` if Corepack is unavailable).
- **Go** ≥ 1.20 for the Windows desktop agent.
- **Docker** (optional) for the Compose demo.
- Optional platform SDKs: Android Studio (SDK 35), Xcode 15 for native agents.

## Quick start

Bootstrap the monorepo with Turborepo + pnpm:

```bash
pnpm install
pnpm run build
pnpm run smoke
```

To develop against the in-memory control plane:

```bash
pnpm --filter apps/self_host run dev   # API + policy + telemetry bundle
pnpm --filter apps/web dev             # Next.js web console (http://localhost:3000)
```

If you prefer using Docker Compose for an all-in-one demo:

```bash
cd deploy/docker
cp .env.example .env
pnpm run compose:up
```

The web dashboard will be available at <http://localhost:3000> using the seeded account `demo@example.com` / `demo123`. The compose stack is intentionally lightweight so it runs on a developer laptop while still demonstrating policy sync, telemetry ingestion, and alert fan-out.

## Secrets and environment configuration

- Template env files live under `infra/*/example.env`. Copy to `.env` in the same folder and adjust values per deployment mode.
- Secret material used during development (APNs keys, FCM credentials, Windows PFX) should live under `infra/secrets/`—the tree is already gitignored.
- CI secrets map to the same names (`INHOME_APNS_KEY_PEM`, `INHOME_FCM_SERVICE_ACCOUNT_JSON`, etc.) and drive the `pnpm run smoke:secrets` workflow step.

## Additional workflows

- **Run smoke scenarios**: `pnpm run smoke`
- **Secret-backed validation (requires env vars)**: `pnpm run smoke:secrets`
- **Rebuild the Windows desktop agent** (requires restored Go sources in `agents/desktop`):

  ```bash
  cd agents/desktop
  go build ./...
  ```

- **Format & lint**: `pnpm run format && pnpm run lint`
- **Type checks**: `pnpm run typecheck`

## Repository structure

```
apps/
  web/                – Next.js dashboard for parents and carers
  parent-mobile/      – Expo mobile app for alerts and overrides
  android-agent/      – Kotlin VPN/telemetry agent
  ios-agent/          – Swift app leveraging FamilyControls + ManagedSettings
  extension/          – Chromium/Firefox extension enforcing SafeSearch
  desktop-scanner/    – Electron shell for LAN-based iOS backups
  gateway/            – AdGuard Home orchestration UI + Rust policy sync
services/
  api/                – NestJS API, RBAC, policy distribution, pairing
  policy-engine/      – Deterministic policy evaluation library + signer
  telemetry/          – Event ingestion service with ClickHouse client
  classifier/         – ONNX Runtime wrapper for text/image analysis
  alerting/           – Rule evaluation + email/push digests
  reporting/          – Scheduled reporting service producing PDF/HTML
packages/
  config/             – Shared configuration helpers
  sdk-*/              – Typed client SDKs for different platforms
  ui-kit/             – Shared shadcn/ui primitives
  content-models/     – Model manifests and AU locale packs
deploy/
  docker/             – Docker Compose profile
  helm/               – Helm charts for Kubernetes clusters
  terraform/          – Example AWS ap-southeast-2 modules
  github-actions/     – CI workflows
```

Each sub-project includes its own README with build/run instructions and compliance notes.

## Compliance and ethics

Sentinel AU emphasises privacy-by-design:

- **Verifiable parental authority** – guardians create organisations and invite additional custodians before pairing child profiles.
- **Transparent data usage** – the dashboard includes an APP 1-compliant privacy summary and retention controls (defaults: telemetry 90 days, alerts 365 days).
- **Consent for adults** – pairing a managed profile on a shared device requires explicit acknowledgement and logged consent.
- **Data residency** – default cloud deployment targets `ap-southeast-2` with Terraform modules; self-hosted deployments are fully supported.
- **OAIC contact** – the privacy policy template references OAIC complaint pathways and breach response expectations.
- **Truth-in-advertising** – marketing copy avoids absolute safety claims and includes methodology for classifier accuracy testing.

## License

All code in the repository is licensed under the Apache 2.0 License. Individual third-party dependencies maintain their own licenses as noted in component READMEs.

## Contributing

We welcome community contributions that improve transparency or extend regional support. Please review `docs/CONTRIBUTING.md` (to be completed) and follow the conventional commits format enforced by commitlint.
