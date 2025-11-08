import { z } from 'zod';

export const sentinelEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_BASE_URL: z.string().url().default('http://localhost:4000'),
  WS_BASE_URL: z.string().url().default('ws://localhost:4000'),
  CLICKHOUSE_URL: z.string().url().default('http://clickhouse:8123'),
  REDIS_URL: z.string().url().default('redis://redis:6379'),
  POSTGRES_URL: z.string().default('postgres://postgres:postgres@postgres:5432/sentinel')
});

export type SentinelEnv = z.infer<typeof sentinelEnvSchema>;

export function loadEnv(overrides: Partial<Record<string, string>> = {}) {
  const merged = { ...process.env, ...overrides } as Record<string, string>;
  const result = sentinelEnvSchema.safeParse(merged);
  if (!result.success) {
    throw new Error(`Invalid Sentinel AU environment: ${result.error.message}`);
  }
  return result.data;
}
