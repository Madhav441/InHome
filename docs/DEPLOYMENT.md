# Deployment guidance

## Local Docker demo (laptop)

Use this when you want the full web console and API stack running on a single machine.

1. Install Docker and pnpm.
2. From the repo root:

```bash
cd deploy/docker
cp .env.example .env
pnpm run compose:up
```

3. Open the web console at <http://localhost:3000>.
4. Sign in with the seeded demo account: `demo@example.com` / `demo123`.

To stop the stack:

```bash
pnpm run compose:down
```

## Cloud (AWS ap-southeast-2)

Use this when you need managed infrastructure with Australian data residency.

- **Terraform** (`deploy/terraform`) provisions VPC, EKS, RDS, and ClickHouse in Sydney.
- **Helm charts** (`deploy/helm`) deploy all services with region-specific storage classes.
- **Secrets** should be provided via your CI/CD secrets store (e.g., GitHub Actions or Vault).

Recommended steps:

1. Provision networking + databases with Terraform.
2. Deploy core services via Helm.
3. Seed the demo tenant or create the first admin via the CLI.
4. Configure email/SMS providers for alerts.

## Self-hosted (single node)

Use this for on-prem NAS or mini-PC deployments.

- Docker Compose provides a lightweight single-node profile.
- The AdGuard Home integration runs in a sidecar container for DNS enforcement.

Recommended steps:

1. Bring up the Docker stack.
2. Point the AdGuard sidecar to the local API endpoint.
3. Set retention policies to match local storage capacity.

## Hybrid (edge + cloud)

Use this when you want on-prem policy enforcement with cloud-hosted analytics.

- Run the gateway and DNS enforcement locally.
- Forward telemetry to the cloud ingestion endpoint.
- Keep policy and identity in the cloud, with local caching for offline operation.

## Managed SaaS

Use this for multi-tenant deployments with tiered offerings.

- Central control plane for tenants.
- Feature flags for tier differentiation (home/school/enterprise).
- Enforced compliance controls (consent logging, retention, audit trails).
