# Telemetry ingestion

- Devices POST telemetry to `/v1/telemetry` with signed payloads.
- Events forwarded to ClickHouse with 90-day retention by default.
- High-risk events mirrored to alerting topic in Redpanda (TODO).
