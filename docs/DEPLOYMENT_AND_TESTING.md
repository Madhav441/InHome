# Deployment and Testing Guide

This playbook explains how to stand up every deployment mode in the repository and how to verify the cross-platform MDM flows. It now covers Apple MDM, Android managed configurations, and the Windows agent so you can validate enrollment and command execution ahead of adding additional vendors.

## Prerequisites

- **Node.js 18+** and **npm** for the TypeScript workspace.
- **Go 1.20+** for the Windows agent skeleton under `agents/desktop`.
- Optional: a modern browser for future web-console testing.

Install workspace dependencies and build the TypeScript packages:

```bash
npm install
npm run build
```

> The repository ships with an offline `tsc` shim so the build command succeeds inside the sandbox. When running in a fully provisioned environment you can swap `vendor/typescript` and `vendor/types-node` for the official packages to emit JavaScript into `dist/`.

## Credential and Subscription Inputs

Upload and manage secrets outside of source control. The repository expects you to mount credentials into `infra/secrets` according to the structure documented in `infra/secrets/README.md`.

| Integration | Required artefacts | Where to upload | Notes |
| --- | --- | --- | --- |
| **Apple MDM** | APNs Auth Key (`AuthKey_XXXX.p8`), Apple Team ID, Key ID, MDM Topic | `infra/secrets/apns/` | Each tenant can have a JSON descriptor mapping to the `.p8` file. Used by the Apple adapter when signing tokens and configuration profiles. |
| **Android** | Firebase service account JSON with FCM send scope | `infra/secrets/fcm/` | Name the JSON file `{tenant}.json` and reference it through environment variables. |
| **Windows** | Code-signing certificate (PFX) or SCEP enrolment profile, optional Windows push credentials | `infra/secrets/windows/` | The Windows agent consumes these for secure channel bootstrap. |
| **Other vendors** | TBD per integration | `infra/secrets/other/` | Placeholder directory for later device families. |

Create an `.env` file per deployment mode under `infra/<mode>/.env` that points to the uploaded artefacts:

```
APNS_KEY_PATH=infra/secrets/apns/AuthKey_TEAMID.p8
APNS_KEY_ID=ABC1234567
APNS_TEAM_ID=TEAMID1234
FCM_CREDENTIALS_PATH=infra/secrets/fcm/tenant-acme.json
WINDOWS_CERT_PATH=infra/secrets/windows/inhome-code-signing.pfx
```

Load these environment variables before starting any application entry point.

## Deployment Modes

Each application under `apps/` composes the shared services differently. The sections below document how to bootstrap, configure, and smoke test each instance.

### Self-hosted control plane

1. **Environment** – Copy `infra/self_host/example.env` to `infra/self_host/.env` (create the folder if it does not exist) and populate it with the credential paths listed above.
2. **Bootstrap** – After running `npm run build`, execute the helper to wire the in-memory persistence adapter:

   ```bash
   node - <<'NODE'
   const selfHost = require('./dist/apps/self_host/src/index.js');
   const { ISODate } = require('./dist/packages/core/src/index.js');

   (async () => {
     const context = await selfHost.bootstrap();

     const now = new Date();
     const device = {
       id: 'device-win-demo-1',
       platform: 'windows',
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
       platform: 'windows',
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

3. **Windows agent build** – Build the Go agent and point it at the local command bus once transport wiring is added:

   ```bash
   cd agents/desktop
   go build ./...
   ```

4. **Validation** – The command output confirms Windows enrolment plus queuing works end-to-end without external infrastructure.

### SaaS tenancy composition

1. **Environment** – Populate `infra/saas/.env` with the credential paths for APNs, FCM, and Windows certificates. Add billing or auth provider secrets as needed.
2. **Bootstrap** – Run the helper after building:

   ```bash
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
   ```

3. **Validation** – Confirms the tenancy-aware persistence adapter initialises correctly. Once HTTP endpoints exist you can expose `/mdm/checkin`, `/mdm/connect`, and Android enrollment APIs under a multi-tenant router.

### Hybrid deployment

1. **Environment** – Populate `infra/hybrid/.env` with credential paths plus relay settings (for example `HYBRID_RELAY_URL=wss://relay.example.com`).
2. **Bootstrap** – Run the helper:

   ```bash
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

3. **Validation** – Ensures the remote access adapter initialises correctly before attaching actual relay or WebRTC transports.

## Platform-specific Smoke Tests

### Apple MDM adapter

1. Place the APNs `.p8` key and descriptor JSON under `infra/secrets/apns/` and export the environment variables defined earlier.
2. After building the workspace, run the profile rendering script:

   ```bash
   node - <<'NODE'
   const { AppleProfileRenderer, buildConfigurationProfile } = require('./dist/packages/adapters/apple-mdm/src/index.js');
   const { toPolicy } = require('./dist/features/policy-dsl/src/index.js');

   const policyDefinition = {
     id: 'macos-baseline',
     name: 'macOS Baseline',
     version: 1,
     targets: [{ type: 'group', id: 'all-macos' }],
     rules: [
       {
         id: 'screenlock',
         description: 'Require screen lock',
         platforms: ['apple'],
         actions: [
           {
             type: 'configuration_profile',
             identifier: 'com.inhome.security.screenlock',
             payload: { idleTime: 300 },
           },
         ],
       },
     ],
   };

   const policy = toPolicy(policyDefinition);
   const profile = buildConfigurationProfile(policy);
   console.log('Generated profile:', profile.substring(0, 120), '...');
   NODE
   ```

3. The output should include a plist payload preview, confirming policies render for Apple devices.

### Android adapter

1. Place the Firebase service account JSON under `infra/secrets/fcm/` and export `FCM_CREDENTIALS_PATH`.
2. Use the new adapter helpers to simulate enrollment, command delivery, and policy rendering:

   ```bash
   node - <<'NODE'
   const { AndroidMDMAdapter, AndroidPolicyRenderer } = require('./dist/packages/adapters/android-mdm/src/index.js');
   const { InMemoryCommandBus } = require('./dist/features/command-bus/src/index.js');
   const { InMemoryEnrollmentService } = require('./dist/features/enrollment/src/index.js');
   const { toPolicy } = require('./dist/features/policy-dsl/src/index.js');

   const commandBus = new InMemoryCommandBus();
   const enrollment = new InMemoryEnrollmentService();
   const adapter = new AndroidMDMAdapter({ orchestrator: commandBus, enrollmentService: enrollment });

   (async () => {
     const session = await enrollment.createSession({
       tenantId: 'tenant-android',
       platform: 'android',
       channel: 'mdm',
     });

     const device = await adapter.completeEnrollment({
       androidId: 'android-demo-1',
       enrollmentId: session.id,
       tenantId: session.tenantId,
       fcmToken: 'mock-token',
     });

     const policy = toPolicy({
         id: 'android-baseline',
         name: 'Android Baseline',
         version: 1,
         targets: [{ type: 'group', id: 'all-android' }],
         rules: [
           {
             id: 'password-policy',
             platforms: ['android'],
             actions: [
               {
                 type: 'android_dpm',
                 policy: 'PASSWORD_QUALITY_COMPLEX',
                 arguments: { minLength: 8 },
               },
             ],
           },
         ],
     });

     await adapter.queuePolicyInstall(policy, device);

     const command = await adapter.deliverNextCommand(device);
     console.log('Queued command:', command?.name);

     const renderer = new AndroidPolicyRenderer();
     const androidPayload = await renderer.render(policy);
     console.log('Policy renderer payload size:', androidPayload.length);
   })();
   NODE
   ```

3. The console should show a queued `APPLY_MANAGED_CONFIG` command and the policy renderer output count.

### Windows agent

1. Build the agent (`go build ./...`).
2. Configure environment variables for certificate paths and any relay endpoints as described earlier.
3. Use the self-hosted bootstrap script to enqueue commands and then extend the agent to poll the command bus. As the agent evolves, add integration tests that execute commands locally and report acknowledgements via the `acknowledgeCommand` API.

## Functional Test Matrix

| Test | Goal | How to execute | Expected outcome |
| --- | --- | --- | --- |
| **Policy translation** | Ensure policy definitions normalise correctly and project to Apple/Android/Windows renderers. | Run the Node script in [Android adapter](#android-adapter) and the Apple profile rendering script. | Console shows generated payloads for each platform. |
| **Command queue ordering** | Validate FIFO dispatch and acknowledgement semantics of the in-memory command bus. | Script in [Command queue ordering script](#command-queue-ordering-script). | Output lists command IDs in the order they are delivered. |
| **Enrollment lifecycle** | Confirm sessions can be created, completed, and expired for each platform. | Use the Android adapter script and augment it with Windows agent registration via the self-hosted helper. | Logs show active sessions count dropping after completion/expiry. |
| **Self-hosted integration** | Combine persistence, enrollment, and command wiring for Windows devices. | Script in [Self-hosted control plane](#self-hosted-control-plane). | Device registration succeeds and pending command list is printed. |
| **Apple MDM adapter smoke** | Render a configuration profile payload for inspection. | Script in [Apple MDM adapter](#apple-mdm-adapter). | Console prints a plist string representing the profile. |
| **Android managed config smoke** | Verify FCM command payloads and managed configuration projection. | Script in [Android adapter](#android-adapter). | Console prints queued command name and payload size. |

## Automation Backlog

- Add golden-file tests for Apple profiles, Android managed configurations, and Windows PowerShell scripts generated from the policy DSL.
- Stand up contract tests for each adapter (APNs, FCM, Windows relay) using mocked transports.
- Integrate the deployment scripts into CI pipelines so that self-hosted, SaaS, and hybrid smoke checks run automatically after each change.
- Extend the functional tests into end-to-end scenarios once HTTP transport layers are implemented.

### Command queue ordering script

```bash
node - <<'NODE'
const { InMemoryCommandBus } = require('./dist/features/command-bus/src/index.js');
const { ISODate } = require('./dist/packages/core/src/index.js');

(async () => {
  const bus = new InMemoryCommandBus();
  const now = ISODate(new Date());

  await bus.enqueue({
    id: 'cmd-1',
    deviceId: 'device-win-demo-1',
    platform: 'windows',
    name: 'LOCK',
    payload: {},
    issuedBy: 'tenant-demo',
    status: 'queued',
    retries: 0,
    maxRetries: 1,
    queuedAt: now,
    updatedAt: now,
  });

  await bus.enqueue({
    id: 'cmd-2',
    deviceId: 'device-win-demo-1',
    platform: 'windows',
    name: 'WALLPAPER',
    payload: { image: 'https://example.com/wallpaper.png' },
    issuedBy: 'tenant-demo',
    status: 'queued',
    retries: 0,
    maxRetries: 1,
    queuedAt: now,
    updatedAt: now,
  });

  console.log('First command:', (await bus.next('device-win-demo-1'))?.id);
  console.log('Second command:', (await bus.next('device-win-demo-1'))?.id);
})();
NODE
```
