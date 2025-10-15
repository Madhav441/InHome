# Secrets and Credential Layout

Store environment-specific credentials outside of source control and mount them at runtime. The recommended structure is:

- `infra/secrets/apns/` – Apple Push Notification Service keys (`AuthKey_XXXX.p8`) and a `config.json` describing team ID, key ID, and topic per tenant.
- `infra/secrets/fcm/` – Firebase service account JSON for Android push, named `{tenant}.json`.
- `infra/secrets/windows/` – Certificates or enrollment packages required for Windows agent bootstrap (e.g., code-signing PFX, SCEP profiles).
- `infra/secrets/other/` – Placeholder for future vendor integrations.

Add a `.env` file per deployment mode under `infra/<mode>/.env` that references these paths, for example:

```
APNS_KEY_PATH=infra/secrets/apns/AuthKey_TEAMID.p8
FCM_CREDENTIALS_PATH=infra/secrets/fcm/tenant-acme.json
WINDOWS_CERT_PATH=infra/secrets/windows/inhome-code-signing.pfx
```

Do **not** commit the secrets directory. Provision it in your deployment pipelines or shared secrets manager (e.g., AWS Secrets Manager, GCP Secret Manager, Azure Key Vault) and mount the files during deployment according to the instructions in `docs/DEPLOYMENT_AND_TESTING.md`.
