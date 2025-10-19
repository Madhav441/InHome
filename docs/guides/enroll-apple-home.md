# Enroll your first Apple device (no ABM required)

Works for SaaS, Hybrid appliance, and Self-host deployments. This uses manual profile enrollment with an APNs MDM Push Certificate.

## Prereqs
- Any Apple ID (free) to obtain an MDM Push Certificate.
- Access to your InHome tenant (SaaS) or local appliance portal (Hybrid/Self-host).

## Step 1: Get the push certificate (one-time)
1. Go to https://identity.apple.com/pushcert/ and sign in.
2. Create or renew an MDM Push Certificate for your organization/home.
3. Download the key (PEM or P8 depending on your workflow).

## Step 2: Upload to InHome
- SaaS: Portal → Settings → Apple MDM → Upload Push Certificate.
- Hybrid/Self-host: Local portal → Settings → Apple MDM → Upload.
- InHome stores the certificate under your tenant/appliance secrets.

## Step 3: Generate enrollment profile
1. Portal → Devices → Add device → Apple → Manual enrollment.
2. Set tenant/appliance name and topic; download the configuration profile (.mobileconfig).
3. Optionally generate a QR/URL that hosts the profile from your portal.

## Step 4: Install on the device
1. Open the enrollment URL on the iPhone/iPad/Mac or AirDrop the .mobileconfig.
2. Install the profile (approve prompts). The device checks in and subscribes to push.

## Verify
- In portal → Devices, you should see the new device with facts.
- Send a simple command (e.g., Device Information). Wait for ack.

## Notes
- Without ABM/DEP, devices are user-enrolled and not automatically supervised. Some supervised-only commands won’t apply.
- You can later migrate to ABM/DEP; InHome supports both paths.
