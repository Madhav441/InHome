# Infra quickstart and secrets guide

This repo provides templates and guardrails to configure environments safely across self-host, SaaS, hybrid, Docker Compose, and Kubernetes modes.

## Env templates
Copy the example templates to `.env` per mode and fill required values:
- `infra/self_host/example.env` -> `infra/self_host/.env`
- `infra/saas/example.env` -> `infra/saas/.env`
- `infra/hybrid/example.env` -> `infra/hybrid/.env`
- `infra/docker-compose/example.env` -> `infra/docker-compose/.env`
- `infra/k8s/example.env` -> `infra/k8s/.env`

Secrets referenced by these envs live under `infra/secrets/` (ignored by Git). See `infra/secrets/README.md` for layout.

## CI secrets (optional)
The CI workflow will run an extra secret-backed smoke test when these GitHub Action secrets are defined:
- `INHOME_APNS_KEY_PEM`
- `INHOME_FCM_SERVICE_ACCOUNT_JSON`
- `INHOME_WINDOWS_CERT_PFX_BASE64`
- `INHOME_WINDOWS_CERT_PASSWORD`

The job materialises ephemeral files under `infra/secrets/**` during CI only. No secret contents are printed to logs.

## Pre-commit secret scanning
Install and enable pre-commit to run gitleaks on each commit:

```bash
pip install pre-commit
pre-commit install
```

Policy is configured via `.pre-commit-config.yaml` and `gitleaks.toml` (defaults + allowlist for `dist/`, `node_modules/`, `infra/secrets/`, `vendor/`).

## Apple Configurator helper
For supervised home enrollments without ABM, run the helper on a Mac:

```bash
./scripts/apple/configurator-helper.sh --portal https://tenant.example.com --output ~/Desktop/inhome-supervised.mobileconfig
```

The script downloads the latest auto-enroll profile (or writes a placeholder) and prints the Configurator options to select.

## Notes
- Never commit `.env` files or anything under `infra/secrets/**`.
- Prefer GitHub Actions secrets for CI rather than committing files.
- Rotate credentials regularly and use least-privilege service accounts.
