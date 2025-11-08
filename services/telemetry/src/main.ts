import express from 'express';
import { ClickHouse } from 'clickhouse';
import { loadEnv } from '@sentinel-au/config';

const app = express();
app.use(express.json());

const env = loadEnv();
const clickhouse = new ClickHouse({ url: env.CLICKHOUSE_URL });

app.post('/v1/telemetry', async (req, res) => {
  const event = { ...req.body, storedAt: new Date().toISOString() };
  console.log('Received telemetry', event);
  // TODO: persist to ClickHouse once available
  res.json({ status: 'accepted' });
});

app.get('/healthz', (_, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT ?? 4100;
app.listen(port, () => {
  console.log(`Telemetry service listening on ${port}`);
});
