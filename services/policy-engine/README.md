# Sentinel AU policy engine

Pure TypeScript policy evaluation core that outputs deterministic allow/block/warn decisions. The WASM build pipeline (TODO) enables embedding within mobile and gateway agents.

## Usage

```ts
import { evaluatePolicy } from '@sentinel-au/policy-engine';

const result = evaluatePolicy(policy, { category: 'Social', timestamp: new Date() });
```

## Roadmap

- [ ] Compile to WebAssembly for lightweight distribution.
- [ ] Support profile-specific overrides and time-limited tokens.
- [ ] Integrate with Redpanda for policy update streaming.
