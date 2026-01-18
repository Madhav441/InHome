# Enrollment flows

## Assisted Android setup -> Fully managed Android

This flow covers the case where a semi-managed Android device helps bootstrap Wi-Fi and account setup, then enrolls a fully managed child device.

### Actors

- **Guardian**: parent/carer in the web console.
- **Assisted Android device**: not fully managed, used to complete Wi-Fi and account setup.
- **Child Android device**: fully managed Android device enrolled under the child profile.

### Steps

1. Guardian creates a child profile in the web console.
2. The web console generates a pairing code/QR.
3. The assisted Android device opens the enrollment link and signs in.
4. The assisted device completes Wi-Fi setup and guardian authentication.
5. The assisted device starts the managed enrollment workflow on the child device.
6. The child device installs the Android agent and receives policy sync.
7. Guardian sees device status and policy compliance in the console.

### Success criteria

- The child device is fully managed and policy sync is active.
- The assisted device never receives managed policy; it only bootstraps enrollment.

## Cross-platform parity (Android <-> iOS)

The full platform must allow any guardian device (Android or iOS) to enroll a managed device on either platform. The backend contract stays consistent across platforms:

- **Pairing code**: single-use, short TTL, scoped to a child profile.
- **Enrollment session**: records device type, OS version, and consent.
- **Policy sync contract**: platform-agnostic policy representation.

## Admin-assisted enrollment (school or reseller)

When a school or reseller provides pre-collected data, the admin workflow can:

1. Create guardian accounts in bulk.
2. Pre-assign child profiles and device identifiers.
3. Generate pairing codes for the guardian to complete enrollment.

See `docs/ENROLLMENT_AUTOMATION.md` for the data contract and guardrails.
