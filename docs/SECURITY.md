# Security baseline

- API tokens limited to one hour; refresh tokens pending implementation.
- Adopt OpenTelemetry for audit logs and route to Grafana Tempo/Loki.
- Enable TLS for all services in production with AWS ACM certificates.
- Threat modelling includes tamper attempts, consent spoofing, and classifier drift.
