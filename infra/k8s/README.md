# Kubernetes Manifests

The Kubernetes deployment descriptors will live here. Each offering (self-hosted, SaaS, hybrid) can reuse the base manifests and overlay environment-specific configuration through Kustomize. Planned components include the API deployment, workers, ingress, and secrets for APNs credentials and database connections.
