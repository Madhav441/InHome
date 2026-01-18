# Operator Setup Guide

## Purpose

This guide outlines how enterprise operators configure Sentinel AU for hyperscaler backends, identity providers, and device management platforms. It also captures the exact data that must be collected from customers before onboarding is approved.

## 1) Enterprise intake checklist

Collect the following details from the enterprise customer before enabling production access:

| Category          | Required details                                                         | Where it is used                           |
| ----------------- | ------------------------------------------------------------------------ | ------------------------------------------ |
| Primary contact   | Enterprise email, operator name, phone number, escalation contact        | Operator onboarding and break-glass access |
| Tenant identity   | Tenant name, billing entity, country of operation, data residency region | Segmentation and data residency rules      |
| Security controls | SSO method (SAML/OIDC), MFA requirement, IP allowlist, security contact  | Authentication and access policies         |
| Compliance        | Regulatory obligations (APP, GDPR, COPPA), retention period              | Audit and compliance modules               |

## 2) Operator authentication setup

1. **Create operator account** in the internal IAM portal using the enterprise email.
2. **Assign role group** (Operator Admin, Security Analyst, Support). Ensure least privilege is enforced.
3. **Enable MFA** and confirm device enrollment for hardware keys or authenticator apps.
4. **Configure SSO**
   - **SAML/OIDC metadata**: collect IdP URL, entity ID, and certificate.
   - **Claims mapping**: map `email`, `given_name`, `family_name`, and `groups`.
5. **Test break-glass access** using a separate account stored in the enterprise password vault.

## 3) Hyperscaler backends

### AWS

- **Required inputs**
  - AWS Organization ID
  - Management account email
  - Delegated admin role ARN
  - Preferred regions for data residency
- **Setup steps**
  1. Create the delegated admin role with `AWSControlTowerExecution` equivalent permissions.
  2. Enable CloudTrail and configure cross-account delivery to Sentinel AU logging bucket.
  3. Provide the S3 bucket ARN and KMS key ARN to the operator console.

### Microsoft Azure

- **Required inputs**
  - Azure tenant ID
  - Subscription IDs
  - App registration client ID and secret/certificate
- **Setup steps**
  1. Register the Sentinel AU application in Azure AD and grant API permissions.
  2. Assign Reader and Security Reader roles at the subscription scope.
  3. Configure Event Hubs for alert ingestion and provide the namespace connection string.

### Google Cloud Platform

- **Required inputs**
  - GCP project IDs
  - Service account JSON key
  - Pub/Sub topic names
- **Setup steps**
  1. Create a service account with `Logging Viewer` and `Pub/Sub Publisher` roles.
  2. Enable Cloud Logging exports to the designated Pub/Sub topics.
  3. Share the service account JSON and topic names with the operator console.

## 4) Device management providers

### Apple Business Manager

- **Required inputs**
  - Organisation email address
  - D-U-N-S number
  - Apple Business Manager organisation ID
  - MDM server token (p7m)
- **Setup links**
  - https://business.apple.com/
- **Setup steps**
  1. Log in to Apple Business Manager and add Sentinel AU as the MDM server.
  2. Download the server token (p7m) and upload it to the operator console.
  3. Assign automated device enrollment profiles to the Sentinel AU MDM server.

### Android Enterprise

- **Required inputs**
  - Enterprise admin email
  - Enterprise ID
  - EMM token
- **Setup links**
  - https://enterprise.google.com/android
  - https://play.google.com/work
- **Setup steps**
  1. Bind the enterprise email in the Google admin console.
  2. Generate the Android Enterprise binding and capture the Enterprise ID.
  3. Upload the EMM token to the operator console and verify device policy sync.

### Browser extension distribution

- **Required inputs**
  - Chrome Web Store app ID
  - Edge Add-ons app ID
  - CRX/ZIP signing certificate reference
- **Setup steps**
  1. Configure force-install policy in Google Admin or Microsoft Intune.
  2. Add the Sentinel AU extension IDs to the allowlist.
  3. Confirm the extension reports in within 10 minutes after install.

## 5) Manual intervention playbook

If automation cannot complete the setup, operators must follow these steps:

1. **Open a secure support ticket** in the internal service desk and attach all relevant IDs, tokens, and contact details.
2. **Request vendor assistance** via the provider portals (Apple Business Manager support, Google Enterprise support, or hyperscaler support).
3. **Document the change** in the audit log, including timestamps and operator IDs.
4. **Validate configuration** by running a test policy sync and verifying device telemetry within 30 minutes.
5. **Escalate** to the security lead if credentials are blocked, expired, or require legal approval.

## 6) Operational readiness checklist

- [ ] Operator accounts provisioned and MFA enforced.
- [ ] Hyperscaler integrations validated in the target region.
- [ ] Apple Business Manager token uploaded and devices assigned.
- [ ] Android Enterprise token verified and Managed Google Play enabled.
- [ ] Browser extension distribution confirmed.
- [ ] Audit log export configured.
