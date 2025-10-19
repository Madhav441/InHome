# Enroll your first Android device (AMA approval + QR)

This uses Android Management API (AMA) hosted by InHome so you don’t need your own Google Workspace/EMM.

## Prereqs
- A Google account to approve creation of an AMA enterprise under InHome’s project.
- Access to your InHome tenant (SaaS) or local appliance portal (Hybrid/Self-host).

## Step 1: Approve the enterprise (one-time)
1. Portal → Settings → Android Management → Connect Google.
2. Sign in with your Google account and approve.
3. InHome creates/configures your AMA enterprise.

## Step 2: Create enrollment token/QR
1. Portal → Devices → Add device → Android → Create enrollment token.
2. Choose QR or AFW (work profile) code.

## Step 3: Enroll the device
- Factory-reset device: scan QR at setup.
- Work profile: use AFW code in Play and follow prompts.

## Verify
- Portal → Devices displays the new device with facts.
- Send a command and expect ack (policy install, lock, etc.).

## Notes
- You can bring your own Google project later if desired. For home users, using InHome’s project is simplest.
