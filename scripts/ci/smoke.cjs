const path = require('node:path');
const Module = require('node:module');

const distRoot = path.resolve(__dirname, '..', '..', 'dist');

const aliasMap = {
  '@inhome/core': path.join(distRoot, 'packages', 'core', 'src'),
  '@inhome/command-bus': path.join(distRoot, 'features', 'command-bus', 'src'),
  '@inhome/enrollment': path.join(distRoot, 'features', 'enrollment', 'src'),
  '@inhome/persistence-adapter': path.join(distRoot, 'packages', 'adapters', 'persistence', 'src'),
  '@inhome/policy-dsl': path.join(distRoot, 'features', 'policy-dsl', 'src'),
};

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function patchedResolve(request, parent, isMain, options) {
  const match = aliasMap[request];
  if (match) {
    return originalResolveFilename.call(this, match, parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

const {
  bootstrap,
  registerDevice,
  enqueueCommand,
  syncPolicy,
} = require(path.join(distRoot, 'apps', 'self_host', 'src'));
const { InMemoryCommandBus } = require('@inhome/command-bus');
const { InMemoryEnrollmentService } = require('@inhome/enrollment');
const { ISODate } = require('@inhome/core');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeDevice = () => {
  const timestamp = new Date();
  return {
    id: 'device-ci-001',
    platform: 'windows',
    enrollmentChannel: 'agent',
    owner: { type: 'user', tenantId: 'tenant-ci', displayName: 'CI Robot' },
    identity: { platformId: 'ci-platform-id' },
    status: 'new',
    facts: { hostname: 'ci-runner' },
    tokens: [],
    createdAt: ISODate(timestamp),
    updatedAt: ISODate(timestamp),
  };
};

const makeCommand = (deviceId) => {
  const timestamp = new Date();
  return {
    id: 'command-ci-lock',
    deviceId,
    platform: 'windows',
    name: 'LOCK',
    payload: { reason: 'ci smoke check' },
    issuedBy: 'tenant-ci',
    status: 'queued',
    retries: 0,
    maxRetries: 1,
    queuedAt: ISODate(timestamp),
    updatedAt: ISODate(timestamp),
  };
};

const makePolicy = () => {
  const timestamp = ISODate(new Date());
  return {
    id: 'policy-ci-baseline',
    name: 'CI Baseline',
    version: 1,
    targets: [{ type: 'group', id: 'all-devices' }],
    rules: [
      {
        id: 'rule-windows-wallpaper',
        platform: 'windows',
        description: 'Ensure wallpaper policy projects correctly.',
        definition: {
          actions: [
            {
              type: 'registry_write',
              path: 'HKCU\\Control Panel\\Desktop\\Wallpaper',
              value: 'C:\\\\Wallpapers\\\\ci.jpg',
            },
          ],
          conditions: [],
        },
      },
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const verifySelfHostScenario = async () => {
  const context = await bootstrap();
  context.commandBus = new InMemoryCommandBus({ visibilityTimeoutMs: 5 });
  const device = makeDevice();
  await registerDevice(context, device);

  const storedDevice = await context.persistence.devices.findById(device.id);
  if (!storedDevice) {
    throw new Error('Device was not stored during registration.');
  }

  if (!context.enrollment.activeSessions.find((item) => item.tenantId === device.owner.tenantId)) {
    throw new Error('Enrollment session was not created for registered device.');
  }

  const command = makeCommand(device.id);
  await enqueueCommand(context, command);

  const pendingCommands = await context.persistence.commands.findPending(device.id);
  if (!pendingCommands.some((item) => item.id === command.id)) {
    throw new Error('Command persistence queue did not retain enqueued command.');
  }

  const busCommand = await context.commandBus.next(device.id);
  if (!busCommand || busCommand.id !== command.id) {
    throw new Error('Command bus failed to deliver queued command.');
  }

  await context.commandBus.ack({
    commandId: busCommand.id,
    deviceId: device.id,
    status: 'acked',
    occurredAt: ISODate(new Date()),
  });

  const policy = makePolicy();
  await syncPolicy(context, policy);
  const storedPolicies = await context.persistence.policies.list();
  if (!storedPolicies.some((item) => item.id === policy.id)) {
    throw new Error('Policy repository did not store synced policy.');
  }

  await context.persistence.disconnect();
};

const verifyCommandBusRetry = async () => {
  const bus = new InMemoryCommandBus({ visibilityTimeoutMs: 10 });
  const command = makeCommand('device-ci-retry');
  await bus.enqueue(command);

  const firstDelivery = await bus.next(command.deviceId);
  if (!firstDelivery || firstDelivery.status !== 'sent') {
    throw new Error('Command bus did not mark first delivery as sent.');
  }

  await delay(30);

  const retryDelivery = await bus.next(command.deviceId);
  if (!retryDelivery) {
    throw new Error('Command bus did not re-queue command after visibility timeout.');
  }
  if (retryDelivery.retries !== 1) {
    throw new Error('Command bus did not increment retry counter after re-delivery.');
  }

  await bus.ack({
    commandId: retryDelivery.id,
    deviceId: retryDelivery.deviceId,
    status: 'acked',
    occurredAt: ISODate(new Date()),
  });
};

const verifyEnrollmentService = async () => {
  const enrollment = new InMemoryEnrollmentService({ defaultTtlMs: 100 });
  const session = await enrollment.createSession({
    tenantId: 'tenant-ci',
    platform: 'windows',
    channel: 'agent',
  });

  if (!enrollment.activeSessions.find((item) => item.id === session.id)) {
    throw new Error('Enrollment service did not expose active session.');
  }

  await delay(150);

  if (enrollment.activeSessions.find((item) => item.id === session.id)) {
    throw new Error('Enrollment service did not expire session after TTL.');
  }
};

const run = async () => {
  await verifyCommandBusRetry();
  await verifyEnrollmentService();
  await verifySelfHostScenario();
};

run()
  .then(() => {
    console.log('CI smoke checks completed successfully.');
  })
  .catch((error) => {
    console.error('[ci-smoke] failure:', error);
    process.exit(1);
  });
