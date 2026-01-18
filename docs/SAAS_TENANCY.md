# SaaS tenancy separation (Jamf/Bark-inspired)

## Goal

Provide a clear separation between the SaaS operator (enterprise org) and guardian/parent tenants so end users do not need their own Apple/Google enterprise IDs while still getting strict tenant isolation and device security.

## Tenant model

### SaaS operator (you)

- **Enterprise tenant** that owns platform integrations:
  - Apple Push Notification service (APNs) certificates.
  - Apple Business Manager (ABM) / DEP server tokens.
  - Android Enterprise EMM binding / service account.
- Hosts shared infrastructure and global policies.
- Provides a multi-tenant control plane with strict tenant isolation.

### Guardian/parent tenant (customer)

- **Sub-tenant** under the SaaS operator.
- No enterprise ID required.
- Receives dedicated organisation scope, RBAC, and data segmentation.
- Can manage their own children/devices only.

## Enterprise ID usage (what you need vs. what parents need)

| Platform           | Who supplies enterprise ID | Why                                           | Parent requirement             |
| ------------------ | -------------------------- | --------------------------------------------- | ------------------------------ |
| Apple (iOS/macOS)  | SaaS operator              | ABM/DEP token + APNs enable MDM profile push  | None (parents use app account) |
| Android Enterprise | SaaS operator              | EMM binding enables device owner provisioning | None (parents use app account) |

## Separation approach (Jamf-style)

- **Single EMM/MDM server identity** owned by the SaaS operator.
- **Tenant isolation** enforced by:
  - Tenant IDs in every device, policy, and audit record.
  - Scoped API keys and RBAC to prevent cross-tenant access.
  - Per-tenant policy bundles and report data.
- **Delegated admin** model:
  - Guardians act as tenant admins for their own home org only.
  - SaaS operator staff have separate platform admin roles.

## Separation approach (Bark-style)

- **Parent-first onboarding** without enterprise identifiers.
- **Child device enrollment** tied to a parent account and home org.
- **Feature tiering** via flags and policy bundles.
- **Compliance + consent logging** recorded per tenant.

## Practical enrollment flow

1. **SaaS operator** configures ABM/DEP + APNs + Android Enterprise binding once.
2. **Guardian** signs up and creates a home organisation.
3. **Guardian** enrolls a child device via pairing QR.
4. **System** provisions MDM/agent using the operator enterprise credentials under the guardian’s tenant scope.

## Security and access segregation

- **Data isolation**: every record keyed by tenant ID.
- **Encryption**: per-tenant envelope keys for sensitive data.
- **Audit trails**: immutable logs for enrollment and policy changes.
- **Device scoping**: device-to-tenant mapping enforced at API and policy layers.

## Implementation notes

- Maintain one enterprise integration per region to meet data residency requirements.
- Provide a “tenant boundary test” in CI to assert zero cross-tenant leakage.
- Offer a migration path for schools or enterprises that want their own ABM/Android Enterprise bindings.
