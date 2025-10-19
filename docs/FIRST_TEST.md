# First-time Test Guide

Use this minute-by-minute guide to validate the repository locally and in CI without external devices.

## Prerequisites (Windows)
- Node.js LTS (>=18) and npm
- Go 1.20+
- Git

## Local quick pass (no secrets)
1. Install and build
   - `npm ci`
   - `npm run build`
2. Run functional smoke checks
   - `npm run smoke`
3. Build Windows agent
   - `cd agents/desktop && go build ./... && cd ../..`

Expected: Smoke prints success; Go build produces `agents/desktop/desktop.exe` (ignored by Git).

## Optional: CI secret-backed smoke
1. Add repo secrets (GitHub > Settings > Secrets and variables > Actions):
   - `INHOME_APNS_KEY_PEM`
   - `INHOME_FCM_SERVICE_ACCOUNT_JSON`
   - `INHOME_WINDOWS_CERT_PFX_BASE64`
   - `INHOME_WINDOWS_CERT_PASSWORD`
2. Trigger a CI run
   - Push any commit or go to Actions > CI > Run workflow.
3. Observe “Run secret-backed smoke tests” step
   - Skipped when secrets are missing; runs when all four are present.

## Environment templates (local only)
Copy and fill the templates as needed (do not commit):
- `infra/self_host/example.env` → `infra/self_host/.env`
- `infra/saas/example.env` → `infra/saas/.env`
- `infra/hybrid/example.env` → `infra/hybrid/.env`
- `infra/docker-compose/example.env` → `infra/docker-compose/.env`
- `infra/k8s/example.env` → `infra/k8s/.env`

Secrets should live under `infra/secrets/**` (already gitignored).

## Secret safety checklist
- Use GitHub Actions secrets in CI; never echo values.
- Keep local secrets in `infra/secrets/**` and `.env` files; never commit them.
- Enable pre-commit scanning:
  - `pip install pre-commit`
  - `pre-commit install`

## Troubleshooting
- Workflow error "Unrecognized named-value: 'secrets'": ensure condition is wrapped as `${{ ... }}`.
- Linux Go build failures: agent builds on `windows-latest` runner using Go 1.20.x.
- TypeScript build errors: run `npm ci` and ensure `vendor/` shims aren’t overridden unless online.
