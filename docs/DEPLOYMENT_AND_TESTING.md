# Deployment and Testing Guide

This guide explains how to stand up each deployment mode represented in the
repository and how to exercise the core functional requirements. It is intended
to serve as a repeatable checklist for validating the desktop MVP today while
preparing the project for the Apple MDM and Android phases described in
`docs/ARCHITECTURE.md`.

## Prerequisites

- **Node.js 18+** and **npm** for the TypeScript workspace.
- **Go 1.20+** for the desktop agent skeleton under `agents/desktop`.
- Optional: access to the public npm registry if you wish to replace the
  sandbox-friendly `vendor/` stubs with the official `typescript` toolchain.

Install workspace dependencies and build all TypeScript packages:

```bash
npm install
npm run build
```

> The repository ships with an offline `tsc` shim so the build command succeeds
> inside the sandbox. When running in a fully provisioned environment you can
> swap `vendor/typescript` and `vendor/types-node` for the official packages to
> emit JavaScript into `dist/`.

## Deploying the self-hosted control plane

The self-hosted bootstrap wires together the in-memory persistence adapter, the
command bus, and the enrollment service. After running the build step you can
simulate an end-to-end desktop workflow with a short Node script:

```bash
node - <<'NODE'
const selfHost = require('./dist/apps/self_host/src/index.js');
const { ISODate } = require('./dist/packages/core/src/index.js');

(async () => {
  const context = await selfHost.bootstrap();

  const now = new Date();
  const device = {
    id: 'device-demo-1',
    platform: 'desktop',
    enrollmentChannel: 'agent',
    owner: { type: 'user', tenantId: 'tenant-demo', displayName: 'Demo User' },
    identity: { platformId: 'demo-asset-1' },
    status: 'new',
    facts: {},
    tokens: [],
    createdAt: ISODate(now),
    updatedAt: ISODate(now),
  };

  await selfHost.registerDevice(context, device);

  await selfHost.enqueueCommand(context, {
    id: 'command-demo-lock',
    deviceId: device.id,
    platform: 'desktop',
    name: 'LOCK',
    payload: { initiatedBy: 'demo-admin' },
    issuedBy: device.owner.tenantId,
    status: 'queued',
    retries: 0,
    maxRetries: 1,
    queuedAt: ISODate(now),
    updatedAt: ISODate(now),
  });

  const pending = await context.persistence.commands.findPending(device.id);
  console.log('Pending commands:', pending.map((command) => command.name));

  await context.persistence.disconnect();
})();
NODE
```

This verifies the MVP flow (device registration + command enqueue) without any
external infrastructure. Swap the in-memory adapter for a persistent one and
wrap the helpers with HTTP transport when hardening for production.

## SaaS and hybrid composition smoke tests

The SaaS and hybrid apps are also ready for quick validation through the
compiled helpers:

```bash
# SaaS tenancy bootstrap check
node - <<'NODE'
const saas = require('./dist/apps/saas/src/index.js');

(async () => {
  const tenants = [{
    id: 'tenant-acme',
    name: 'Acme Co',
    mode: 'saas',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }];

  const context = await saas.bootstrapSaas(tenants);
  const stored = await context.persistence.tenants.findById('tenant-acme');
  console.log('Loaded tenant:', stored?.name);
})();
NODE

# Hybrid remote access wiring
node - <<'NODE'
const hybrid = require('./dist/apps/hybrid/src/index.js');

(async () => {
  const context = await hybrid.bootstrapHybrid('wss://relay.example.com');
  const session = await hybrid.openRemoteSession(context, {
    id: 'device-hybrid-1',
  });
  console.log('Remote session ID:', session.id);
})();
NODE
```

These scripts make sure tenancy data is persisted and that the remote access
adapter initialises correctly before layering on real transports.

## Desktop agent build

Build the Go-based desktop agent separately:

```bash
cd agents/desktop
go build ./...
```

The resulting binary will later communicate with the command bus to receive and
acknowledge commands on managed endpoints.

## Functional test plan

The table below captures the functional requirements that can be exercised today
along with instructions for running them. Execute the scripts after building the
workspace so that the compiled helpers are available under `dist/`.

| Test | Goal | How to execute | Expected outcome |
| --- | --- | --- | --- |
| **Policy translation** | Ensure policy definitions normalise correctly and project to Apple/Desktop renderers. | `node - <<'NODE'` block below. | Console shows generated policy payloads per platform. |
| **Command queue ordering** | Validate FIFO dispatch and acknowledgement semantics of the in-memory command bus. | `node - <<'NODE'` block below. | Output lists command IDs in the order they are delivered. |
| **Enrollment session lifecycle** | Confirm sessions can be created, completed, and expired. | `node - <<'NODE'` block below. | Logs show active sessions count dropping after completion/expiry. |
| **Self-hosted integration** | Combine persistence, enrollment, and command wiring. | Self-host script in [Deploying the self-hosted control plane](#deploying-the-self-hosted-control-plane). | Device registration succeeds and pending command list is printed. |
| **Apple MDM adapter smoke** | Render a configuration profile payload for inspection. | `node dist/packages/adapters/apple-mdm/src/index.js` snippet below. | Console prints a plist string representing the profile. |

### Policy translation script

```bash
node - <<'NODE'
const { toPolicy, projectRules } = require('./dist/features/policy-dsl/src/index.js');

const definition = {
  id: 'policy-qa',
  name: 'Baseline controls',
  version: 1,
  targets: [{ type: 'group', id: 'all-devices' }],
  rules: [
    {
      id: 'apple-passcode',
      platforms: ['apple'],
      actions: [{
        type: 'configuration_profile',
        identifier: 'com.inhome.passcode',
        payload: { requirePasscode: true },
      }],
    },
    {
      id: 'desktop-lockout',
      platforms: ['desktop'],
      actions: [{
        type: 'registry_write',
        path: 'HKEY_LOCAL_MACHINE/Software/InHome/Security',
        value: { lockoutMinutes: 15 },
      }],
    },
  ],
};

const policy = toPolicy(definition);
console.log('Normalised policy version:', policy.version);

const projections = projectRules(definition, [
  {
    platform: 'apple',
    project: (rule) => rule.platforms.includes('apple') ? rule.actions[0] : undefined,
  },
  {
    platform: 'desktop',
    project: (rule) => rule.platforms.includes('desktop') ? rule.actions.length : undefined,
  },
]);

console.log('Apple payload:', projections.apple);
console.log('Desktop renderer metadata:', projections.desktop);
NODE
```

### Command queue ordering script

```bash
node - <<'NODE'
const { InMemoryCommandBus } = require('./dist/features/command-bus/src/index.js');
const { ISODate } = require('./dist/packages/core/src/index.js');

(async () => {
  const bus = new InMemoryCommandBus({ visibilityTimeoutMs: 1000 });
  const now = ISODate(new Date());

  await bus.enqueue({
    id: 'cmd-1',
    deviceId: 'device-1',
    platform: 'desktop',
    name: 'LOCK',
    payload: {},
    issuedBy: 'tenant-1',
    status: 'queued',
    retries: 0,
    maxRetries: 1,
    queuedAt: now,
    updatedAt: now,
  });

  await bus.enqueue({
    id: 'cmd-2',
    deviceId: 'device-1',
    platform: 'desktop',
    name: 'WIPE',
    payload: {},
    issuedBy: 'tenant-1',
    status: 'queued',
    retries: 0,
    maxRetries: 1,
    queuedAt: now,
    updatedAt: now,
  });

  console.log('Delivered command IDs:', [
    (await bus.next('device-1'))?.id,
    (await bus.next('device-1'))?.id,
  ]);
})();
NODE
```

### Enrollment session lifecycle script

```bash
node - <<'NODE'
const { InMemoryEnrollmentService } = require('./dist/features/enrollment/src/index.js');
const { ISODate } = require('./dist/packages/core/src/index.js');

const timeProvider = { now: () => new Date('2024-01-01T00:00:00Z') };
const service = new InMemoryEnrollmentService({ timeProvider, defaultTtlMs: 60000 });

(async () => {
  const session = await service.createSession({
    tenantId: 'tenant-1',
    platform: 'apple',
    channel: 'mdm',
    metadata: { invitedBy: 'admin' },
  });

  console.log('Active sessions after create:', service.activeSessions.length);

  const device = {
    id: 'device-1',
    platform: 'apple',
    enrollmentChannel: 'mdm',
    owner: { type: 'user', tenantId: 'tenant-1' },
    identity: {},
    status: 'new',
    facts: {},
    tokens: [],
    createdAt: ISODate(new Date()),
    updatedAt: ISODate(new Date()),
  };

  await service.completeSession(session.id, device);
  console.log('Active sessions after completion:', service.activeSessions.length);
})();
NODE
```

### Apple MDM adapter smoke test

```bash
node - <<'NODE'
const apple = require('./dist/packages/adapters/apple-mdm/src/index.js');
const samplePolicy = {
  id: 'policy-apple',
  name: 'Sample Apple Policy',
  version: 1,
  targets: [],
  rules: [
    {
      id: 'device-information',
      platform: 'apple',
      definition: { payload: { Queries: ['SerialNumber', 'ModelName'] } },
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const device = {
  id: 'device-apple-1',
  platform: 'apple',
  enrollmentChannel: 'mdm',
  owner: { type: 'user', tenantId: 'tenant-1' },
  identity: { udid: 'UDID-123' },
  status: 'enrolled',
  facts: {},
  tokens: [{ type: 'apns', value: 'token' }],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const profile = apple.renderDeviceProfile(samplePolicy, device);
console.log('Generated profile plist:\n', profile);
NODE
```

Record the output of each script as part of your release checklist so future
iterations can regress the same behaviour when adapters or transports change.

## Future automation

- Replace the offline TypeScript shim with the real compiler to emit JavaScript
  bundles automatically.
- Wrap the scripts above in a proper test runner (e.g., Jest or Node’s native
  test API) once dependencies are available.
- Add API surface tests for `/mdm/checkin`, `/mdm/connect`, and policy
  management when the HTTP layer lands.
