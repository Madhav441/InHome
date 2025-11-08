# Sentinel AU web SDK

Typed browser client for policy fetch and telemetry submission.

```ts
const client = new SentinelWebClient({ apiBaseUrl: 'http://localhost:4000/v1' });
await client.fetchPolicy('web-demo');
```
