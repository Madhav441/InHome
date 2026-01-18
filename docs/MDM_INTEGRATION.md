# MDM integration plan (Jamf-style)

## Goal

Transition the demo enrollment flow into true device management that mirrors Jamf-style workflows for business or organisation-owned devices.

## Android Enterprise (Device Owner)

1. **Android Enterprise signup**
   - Register the organisation with Google Android Enterprise.
   - Enable zero-touch or QR provisioning as required.

2. **Provisioning flow**
   - Use device owner provisioning (QR or NFC) to install the Sentinel AU agent during setup.
   - Capture the device ID and bind it to the tenant and child profile.

3. **Policy delivery**
   - Issue managed configurations (managed Google Play, restrictions, Wi-Fi, VPN).
   - Enforce compliance signals and report to the API.

## Apple DEP + MDM

1. **Apple Business Manager (ABM) / DEP**
   - Enroll devices into ABM and assign them to the MDM server.

2. **MDM profile delivery**
   - Host MDM profiles and deliver via APNs.
   - Bind device identifiers to the tenant and child profile.

3. **Device commands**
   - Support profile updates, restrictions, Wi-Fi profiles, and compliance queries.

## Backend requirements

- **Enrollment service** to track device owner and DEP enrollment sessions.
- **MDM command queue** for profile install, lock, wipe, and configuration updates.
- **Certificate management** for APNs, Android Enterprise keys, and signing certificates.

## UI integration points

- Add a true provisioning status view (pending, device owner, managed, compliant).
- Surface the enrollment mode (demo vs MDM) and any provisioning errors.
- Provide admin controls for remote lock, wipe, and policy re-sync.

## Next steps to implement

1. Add MDM enrollment session records to the API.
2. Integrate Android Enterprise provisioning flow in the Android agent.
3. Integrate Apple MDM profile hosting + command queue.
4. Expand the devices dashboard to show MDM compliance and command history.
