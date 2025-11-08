import { loadEnv } from '@sentinel-au/config';
import fetch from 'node-fetch';
import WebSocket from 'ws';
import { z } from 'zod';

const deviceRegistrationSchema = z.object({
  deviceId: z.string(),
  profileId: z.string(),
  orgId: z.string(),
  platform: z.string(),
  metadata: z.record(z.unknown()).default({})
});

export type DeviceRegistration = z.infer<typeof deviceRegistrationSchema>;

export class SentinelNodeClient {
  #env = loadEnv();

  async registerDevice(registration: DeviceRegistration) {
    const payload = deviceRegistrationSchema.parse(registration);
    const res = await fetch(`${this.#env.API_BASE_URL}/v1/devices/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Device registration failed: ${res.status}`);
    }
    return res.json();
  }

  subscribeToAlerts(orgId: string) {
    return new WebSocket(`${this.#env.WS_BASE_URL}/alerts?orgId=${encodeURIComponent(orgId)}`);
  }
}
