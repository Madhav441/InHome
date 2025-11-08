# Sentinel AU telemetry service

Express service that receives telemetry events and forwards them to ClickHouse. The demo implementation logs events to stdout.

## Development

```bash
pnpm --filter @sentinel-au/telemetry-service dev
```

Expose the service to other components via `http://localhost:4100`.
