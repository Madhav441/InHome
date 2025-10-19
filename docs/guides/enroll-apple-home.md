# Enroll Apple devices for home deployments (no ABM required)

You can support parents who only have personal Apple IDs while staying inside Apple’s rules. Pick the track that fits the family’s comfort level, then follow the steps. Every track works in SaaS, hybrid appliance, and self-host modes.

## Choose your track

| Track | Best for | Apple requirements | Capabilities | What you need |
| --- | --- | --- | --- | --- |
| **A. Parental Controls App** | Parents who want Screen Time-style controls with zero device wipe | Family Sharing approval flow only | App limits, downtime, filters, activity reporting | Ship our iOS app using Family Controls + ManagedSettings; parent authorises with Apple ID |
| **B. Manual MDM enrollment (user-approved)** | Quick wins with light device management | Standard profile install (no supervision) | Inventory, basic restrictions, push commands Apple permits on unsupervised devices | MDM push certificate from any Apple ID; child approves profile |
| **C. Supervised MDM via Apple Configurator** | Full control (single-app mode, app install, supervised restrictions) without ABM | Mac with Apple Configurator; device wipe required | Supervised-only payloads and enterprise-grade controls | Configurator “Prepare” workflow + our auto-enroll profile helper |

> **Apple policy reminder:** Supervised control on customer-owned devices is only allowed via Apple Configurator (with a wipe) or ADE/ABM. There is no supported path to bypass consent or supervision requirements.

---

## Track A — Parental Controls App

This path bypasses MDM entirely and uses Apple’s Family Controls + DeviceActivity APIs.

1. **Parent onboarding**
   - Parent downloads the InHome Guardian app (App Store).
   - Parent signs in with the guardian account for your tenant (or registers).
   - App presents the Family Sharing consent sheet to authorise Screen Time access.
2. **Child device pairing**
   - Child installs the companion app from the App Store.
   - Parent approves the relationship inside the Guardian app.
3. **Configure rules**
   - In the parent portal, create downtime windows, app category limits, and content filters.
   - Rules sync to the apps via our cloud; no APNs push cert required.
4. **Monitor & adjust**
   - Activity reports show in the portal and Guardian app.
   - Parents can pause internet access or adjust timers in real time.

> **Limitations:** No VPN/cert/profile install, cannot silently add apps, and restrictions are confined to what the Screen Time APIs provide.

---

## Track B — Manual MDM enrollment (user-approved)

Use this when the family can accept the Settings prompts but does not want to wipe the device. Everything runs through our hosted MDM backend.

### Prerequisites
- Any Apple ID to obtain the MDM push certificate (https://identity.apple.com/pushcert).
- Access to the InHome portal for your tenant/appliance.

### Steps
1. **Upload push certificate (one-time)**
   - Portal → Settings → Apple MDM → Upload certificate and key.
2. **Generate enrollment profile**
   - Portal → Devices → Add device → Apple → Manual enrollment.
   - Provide display name and contact email (shown to the user).
   - Download the `.mobileconfig` file or copy the hosted enrollment URL/QR.
3. **Install on the child’s device**
   - Open the URL or AirDrop the profile.
   - Tap “Allow” and approve the management prompts in Settings → Profile Downloaded.
4. **Verify**
   - Device appears under Devices with status `enrolled`.
   - Send a non-supervised command (e.g., `DeviceInformation`) to confirm push connectivity.

> **Capabilities:** Inventory, passcode policy, app removal restrictions, limited web content filter, push commands allowed on unsupervised devices.

> **Limitations:** Cannot silently install apps, configure supervised-only payloads, or enable Lost Mode without supervision.

---

## Track C — Supervised MDM via Apple Configurator

Families willing to wipe the device can reach supervised parity without ABM.

### What you need
- A Mac running Apple Configurator 2.
- USB/USB-C cable for the child’s device.
- Time to erase and set up the device (back up first!).

### Prepare the helper package
1. Ensure the tenant has an up-to-date push certificate (same as Track B).
2. Run the Configurator helper script on the Mac:
   ```bash
   ./scripts/apple/configurator-helper.sh \
     --portal https://tenant.example.com \
     --output ~/Desktop/inhome-supervised.mobileconfig
   ```
   The script downloads a fresh auto-enroll profile and prints the exact Configurator settings.

### Use Apple Configurator
1. Connect the device and launch Apple Configurator.
2. Choose **Prepare** (not *Add to Apple School/Business Manager*).
3. Options to select:
   - **Manual Configuration**
   - Check **Supervise devices** and **Allow devices to pair with other computers**.
   - Add the profile generated above under **Profiles**.
4. Complete the wizard. The device erases, reboots, and auto-enrolls on first boot.

### After setup
- The device enrolls in supervised mode and shows `supervised: true` in the portal.
- All supervised-only commands become available (Lost Mode, app install, single-app mode, etc.).

> **Communicate clearly:** This process erases the device. Get explicit parent approval and remind them to back up with iCloud or Finder first.

---

## Backend checklist
- Upload the Apple MDM push certificate for the tenant.
- Enable the `scripts/apple/configurator-helper.sh` script on trusted Macs.
- Confirm `/apple/enroll/profile.mobileconfig`, `/apple/scep`, `/mdm/checkin`, and `/mdm/connect` endpoints are reachable (see `packages/api/src/apple.ts`).

## Troubleshooting
- **Profile install fails**: Verify the certificate topic matches the tenant topic shown in the portal.
- **Device never checks in**: Confirm Wi-Fi connectivity and that the push certificate hasn’t expired.
- **Configurator failure**: Use “Erase All Content and Settings” on the device, then re-run the Prepare workflow.

You can migrate to Automated Device Enrollment later if the family qualifies for ABM. The same backend endpoints and certificates carry forward.
