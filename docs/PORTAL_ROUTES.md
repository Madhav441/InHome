# Portal Routes and UI Flows (Draft)

This document outlines the key navigation paths the portal should expose across SaaS, Hybrid, and Self-host. Use it to align UI and API wiring.

## Settings
- Apple MDM
  - Upload/Renew APNs Push Certificate
  - Show topic, expiry, and rotate action
- Android Management
  - Connect Google (create/attach AMA enterprise)
  - Show enterprise info and enrollment token defaults
- Windows
  - Upload code-signing PFX (optional)
  - Agent download link and enrollment URL patterns

## Devices
- Add Device
  - Apple → Manual Enrollment → Generate profile/URL/QR
  - Android → Create enrollment token → Show QR/AFW code
  - Windows → Download agent → Enrollment URL/token display
- Device Details
  - Facts, commands, policies, history, and actions (lock, wipe where applicable)

## Policies
- Create/Edit policy (DSL)
- Assign to devices/groups/targets per platform
- Preview rendered artifacts (Apple profile, Android managed config, Windows actions)

## Administration
- Tenant/appliance secrets overview (metadata only, never show secret values)
- Audit logs, backup/export, update channels
