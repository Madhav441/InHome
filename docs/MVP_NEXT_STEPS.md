# MVP next steps and functional spec

## Next steps (do these first)

1. **Confirm the MVP scope and target launch persona**
   - Validate the first shipped cohort (parents/carers + Android child devices) while keeping the platform ready for iOS parity.
   - Approve the acceptance criteria in the MVP checklist below.

2. **Stand up the local Docker demo and validate the end-to-end flow**
   - Follow the Docker steps in `docs/DEPLOYMENT.md` to bring up the web console and API services.
   - Use the seeded demo account to walkthrough the flows described in `docs/ENROLLMENT_FLOWS.md`.

3. **Lock the enrollment automation contract**
   - Decide the minimal admin-provided data set required to pre-fill enrollment (school, organisation, or reseller-driven).
   - Adopt the data contract and processing guardrails in `docs/ENROLLMENT_AUTOMATION.md`.

4. **Operational readiness**
   - Choose deployment mode (self-hosted, managed cloud, or hybrid).
   - Configure secrets, telemetry retention, and regional compliance settings.

## MVP functional specification

### Platform goals

- A parent/carer can create an organisation, add a child profile, and pair a device.
- Policies sync to child devices via the Android agent; alerts and usage summaries surface in the web console.
- The web console is the primary admin surface for policy, alerts, and reporting.
- Enrollment supports a semi-managed Android device to bootstrap Wi-Fi and account setup, then enroll a fully managed Android device.
- The architecture remains cross-platform (Android + iOS) with parity-ready service contracts.

### Required MVP capabilities

#### Identity and access

- Email/password login for guardians.
- Organisation creation, membership invites, and role-based access.
- Child profile creation with configurable policies per profile.

#### Enrollment and device lifecycle

- Guided enrollment flow for:
  - **Assisted Android setup** (semi-managed device to complete Wi-Fi/account setup).
  - **Managed Android enrollment** for the child device.
- Pairing codes and QR codes for devices.
- Device inventory view in the web console.

#### Policy and safety

- Default policy bundle (web filtering, app allow/deny list, schedule windows).
- Policy sync pipeline with audit trail.

#### Telemetry and alerts

- Activity summaries, high-level app usage, and policy violations.
- Alerting rules for disallowed content or time-limit violations.

#### Reporting

- Weekly summary report (email + dashboard).

### Non-goals for MVP

- Full app store classification or advanced on-device ML.
- Automated enforcement for desktop agents.
- Multi-region data residency (single region for MVP).

### MVP acceptance checklist

- [ ] Docker-based demo brings up web + API + telemetry services.
- [ ] Guardian account can be created and authenticated.
- [ ] Child profile can be created.
- [ ] A device can be enrolled using pairing code.
- [ ] Policies sync and show status in UI.
- [ ] Basic telemetry appears in dashboard.
- [ ] A weekly report is generated.

### Post-MVP expansion

- iOS agent parity (FamilyControls, ManagedSettings).
- Extension deployment for browser-based safe search.
- Desktop LAN-based scanning for iOS backups.
- Tiered offerings (home, school, enterprise) using feature flags + RBAC.
