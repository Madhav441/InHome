# What you can do with InHome (Home MDM)

This page describes what a customer can control with InHome and what they need to do to get started, across deployment modes.

## Core capabilities (all modes)
- Device enrollment
  - Apple: manual profile enrollment (no ABM/DEP required).
  - Android: Android Management API (AMA) enterprise approval + QR/token enrollment.
  - Windows: native InHome agent install, enrolls and reports facts.
- Command execution
  - Queue and deliver device commands (e.g., lock, wipe, rotate key) with retries and acknowledgements.
- Policy management
  - Define policies in the unified DSL and project them to each platform (rendering to Apple profiles, Android managed configs, Windows actions).
- Inventory and facts
  - Track devices, owners, timestamps, and reported facts.
- Multi-tenant isolation (SaaS) / private tenancy (Self-host, Hybrid)
  - Your data and credentials are segregated per tenant or appliance.

## What the customer needs to do
- Apple (optional)
  - Generate an MDM Push Certificate using any Apple ID via https://identity.apple.com/pushcert (free).
  - Upload the .pem/.p8 to your InHome tenant/appliance.
- Android (optional)
  - Approve creation of an enterprise under InHome’s Google project via a Google sign-in flow (no billing required).
- Windows (optional)
  - Download and install the InHome agent from your portal/appliance.
- Define a baseline policy and enroll first device(s).

## What InHome provides
- Hosted SaaS control plane with tenant isolation (or) private appliance (Hybrid/Self-host) you own.
- Push brokering and AMA enterprise management (so you don’t need to run your own Apple/Google infra).
- Secure secret storage, rotation, and audit.
- Updates and CI-verified builds.

## Deployment modes

### SaaS (hosted by InHome)
- Best for: simplest onboarding, no hardware required.
- Customer does: upload APNs (optional), click "Connect Google" (optional), enroll devices, set policies.
- InHome does: run everything, hold service integrations, secure your tenant data.

### Hybrid Appliance (InHome-managed + local edge)
- Best for: privacy at home, but with optional cloud assists (push/AMA). Think plug-in appliance on your router.
- Customer does: plug in appliance, visit local portal, run first-run wizard, enroll devices.
- InHome does: provide appliance image/updates; optionally broker APNs/AMA; no customer enterprise IDs needed.

### Self-host (you run it)
- Best for: full control offline/air-gapped.
- Customer does: run the containers/VM, upload secrets locally, enroll devices.
- InHome does: provide images, docs, optional relay services; you can still rely on our push/AMA brokers if desired.

## First device in 10 minutes
- Pick a mode (SaaS/Hybrid/Self-host), follow the matching guide:
  - `docs/guides/enroll-apple-home.md`
  - `docs/guides/enroll-android-home.md`
  - `docs/guides/enroll-windows-home.md`
