# Sentinel AU gateway orchestrator

Manages AdGuard Home configurations and synchronises policy bundles to on-prem gateways.

- `sidecar/` contains a Rust service that pulls policies from the API and updates AdGuard Home.
- `config/` (TODO) will provide declarative YAML templates for household deployments.
