import { sentinelEnvSchema } from '@sentinel-au/config';
import { z } from 'zod';

const telemetryPayloadSchema = z.object({
  deviceId: z.string(),
  ts: z.string(),
  kind: z.string(),
  payload: z.record(z.any())
});

export type TelemetryPayload = z.infer<typeof telemetryPayloadSchema>;

export class SentinelWebClient {
  #baseUrl: string;
  #wsUrl: string;

  constructor(options?: Partial<{ apiBaseUrl: string; wsBaseUrl: string }>) {
    const env = sentinelEnvSchema.parse({
      API_BASE_URL: options?.apiBaseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000',
      WS_BASE_URL: options?.wsBaseUrl ?? process.env.NEXT_PUBLIC_WS_BASE_URL ?? 'ws://localhost:4000',
      NODE_ENV: process.env.NODE_ENV ?? 'development',
      CLICKHOUSE_URL: 'http://localhost',
      REDIS_URL: 'redis://localhost',
      POSTGRES_URL: 'postgres://localhost'
    });
    this.#baseUrl = env.API_BASE_URL;
    this.#wsUrl = env.WS_BASE_URL;
  }

  async fetchPolicy(deviceId: string) {
    const res = await fetch(`${this.#baseUrl}/v1/policy/${deviceId}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch policy: ${res.status}`);
    }
    return res.json();
  }

  async sendTelemetry(payload: TelemetryPayload) {
    const parsed = telemetryPayloadSchema.parse(payload);
    const res = await fetch(`${this.#baseUrl}/v1/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed)
    });
    if (!res.ok) {
      throw new Error(`Failed to send telemetry: ${res.status}`);
    }
    return res.json();
  }

  createAlertSocket(orgId: string) {
    const ws = new WebSocket(`${this.#wsUrl}/alerts?orgId=${encodeURIComponent(orgId)}`);
    return ws;
  }
}
