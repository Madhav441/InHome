# Deployment guidance

## Cloud (AWS ap-southeast-2)

- Use the Terraform modules under `deploy/terraform` (TODO) to provision VPC, EKS, RDS, and ClickHouse clusters in Sydney.
- Helm charts (`deploy/helm`, TODO) will deploy services with Australian data residency enforced via region-specific storage classes.

## Self-hosted

- Docker Compose profile provides a single-node installation suitable for on-prem NAS or mini-PC hardware.
- Configure AdGuard Home integration by pointing the sidecar to the local API endpoint.
