# Docker Compose profile

Spin up the core Sentinel AU services locally.

```bash
pnpm install
cd deploy/docker
cp .env.example .env
docker compose up --build
```

Services exposed:

- API: http://localhost:4000
- Web dashboard: http://localhost:3000
- Telemetry ingress: http://localhost:4100
- Classifier stub: http://localhost:4300
