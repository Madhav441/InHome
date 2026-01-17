# Architecture review: efficiency + expandability

## Observations

- The repo is organised as a multi-service monorepo with clear separations (apps, services, packages, deploy).
- Shared UI + SDK packages reduce duplication across the web and mobile surfaces.
- The deployment tree already anticipates cloud, self-hosted, and hybrid deployments.

## Efficiency improvements

- **Service boot order**: document service dependencies so local Docker boot is deterministic.
- **Telemetry batching**: ensure ingestion services batch writes to ClickHouse for lower cost.
- **Policy caching**: use edge caching for frequently accessed policies to reduce API load.

## Expandability for multiple offerings

- **Feature flags**: provide tier-based capabilities (home/school/enterprise) without branching deployments.
- **RBAC extension points**: align permissions with tenant roles to support schools and carers.
- **Policy bundles**: use template-driven policy bundles per offering.

## Recommended next steps

1. Establish a feature-flag matrix per offering (home, school, enterprise).
2. Formalise the policy bundle schema for cross-platform parity.
3. Add a CLI to seed tenants and enable admin-assisted enrollment flows.
