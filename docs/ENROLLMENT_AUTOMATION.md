# Enrollment automation (admin-provided data)

## Goal

Enable backend scripts to accelerate enrollment using pre-collected data (schools, MSPs, or administrators) while maintaining consent, auditability, and data minimisation.

## Data contract (minimum fields)

- **Guardian**: name, email, phone (optional), organisation.
- **Child profile**: display name, age band, school (optional).
- **Device**: platform, device identifier (optional), target policy bundle.
- **Consent**: timestamp, source (guardian or administrator), signed acknowledgement.

## Guardrails

- No device can be enrolled without recorded guardian consent.
- Enrollment records must be auditable (actor, time, payload hash).
- Data must be deleted or anonymised after enrollment if not needed.
- Scripts must enforce organisation scoping to prevent cross-tenant access.

## Suggested automation entry points

- **Bulk import endpoint**: accepts CSV/JSON, validates schema, creates pending enrollment records.
- **Scriptable CLI**: runs in CI or by admins to load data and generate pairing codes.
- **Webhook integrations**: optional for LMS/SIS systems to keep guardian data current.

## MVP implementation sketch

1. Create a `pending_enrollment` record per child profile.
2. Generate pairing codes scoped to those records.
3. Guardian completes enrollment through the web console.
4. Device enrollment consumes the pending record and locks it.

## Compliance notes

- Log consent events and make them visible to guardians.
- Provide data retention controls aligned to APP expectations.
