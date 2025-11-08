# Sentinel AU Node SDK

Server-side helper for device registration and alert subscriptions.

```ts
import { SentinelNodeClient } from '@sentinel-au/sdk-node';

const client = new SentinelNodeClient();
await client.registerDevice({
  deviceId: 'gateway-demo',
  profileId: 'profile-maya',
  orgId: 'org-demo',
  platform: 'gateway'
});
```
