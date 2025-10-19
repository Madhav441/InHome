# InHome Appliance Quickstart (Hybrid/Self-host)

Plug it in and manage your home devices privately.

## What you need
- Power and Ethernet (recommended) to your router.
- A phone or PC to access the local portal.

## First boot
1. Plug in the appliance and connect Ethernet.
2. Wait ~2–3 minutes; the local portal is served at http://inhome.local or via the IP shown on the device display.
3. Create an admin account and set a passphrase.

## First-run wizard
1. Choose mode: Hybrid (uses InHome cloud assists) or Self-host (local only).
2. (Optional) Connect Android (AMA): click Connect Google and approve.
3. (Optional) Apple push: upload APNs MDM Push Certificate (.pem/.p8).
4. (Optional) Windows: upload code-signing PFX or skip for dev.
5. Confirm time zone and backup options.

## Enroll devices
- Apple: Devices → Add → Apple → Manual Enrollment → download profile/URL.
- Android: Devices → Add → Android → Create QR → scan during setup.
- Windows: Devices → Add → Windows → Download agent → install and enroll.

## Verify
- Dashboard shows devices and compliance summary.

## Maintenance
- Updates delivered via web portal or signed USB image.
- Your data and secrets remain on the appliance; cloud assists are opt-in.
