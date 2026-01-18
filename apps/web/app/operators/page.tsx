const hyperscalers = [
  {
    title: 'AWS Control Plane',
    details: [
      'Link Organization ID, master account email, and delegated admin role.',
      'Provision Sentinel AU VPC endpoints, KMS keys, and CloudTrail sinks.',
      'Store tenant telemetry in region-specific S3 buckets with lifecycle policies.',
    ],
  },
  {
    title: 'Microsoft Azure',
    details: [
      'Register Azure AD app and capture tenant ID, client ID, and secret/certificate.',
      'Grant Reader + Security Reader on subscriptions for device attestation.',
      'Configure Event Hubs for real-time alert ingestion.',
    ],
  },
  {
    title: 'Google Cloud Platform',
    details: [
      'Create service account JSON with IAM roles for Cloud Logging exports.',
      'Enable Pub/Sub topics for policy enforcement events.',
      'Assign data residency by project and region labels.',
    ],
  },
];

const providerIntegrations = [
  {
    title: 'Apple Business Manager',
    details: [
      'Upload organisation email, D-U-N-S number, and MDM server public key.',
      'Generate server token (p7m) and record the Organisation ID.',
      'Map automated device enrollment profiles to Sentinel AU tenants.',
    ],
  },
  {
    title: 'Android Enterprise',
    details: [
      'Bind enterprise email to Google admin console and obtain Enterprise ID.',
      'Enable Managed Google Play and configure EMM token.',
      'Assign device policy sets for kiosk, work profile, or fully managed modes.',
    ],
  },
  {
    title: 'Browser & Extension Providers',
    details: [
      'Link Chrome Web Store and Microsoft Edge for extension distribution.',
      'Upload signed CRX packages and set force-install lists.',
      'Maintain allowlist/denylist of acceptable extension IDs.',
    ],
  },
];

const operatorFunctions = [
  {
    title: 'Enterprise Segmentation',
    description:
      'Create parent/guardian tenants, enterprise operators, and delegated schools. Assign data boundaries, residency, and billing entities per tenant.',
  },
  {
    title: 'Authentication & IAM',
    description:
      'Configure SSO (SAML/OIDC), MFA requirements, break-glass accounts, and operator session policies. Synchronise role groups from IdPs.',
  },
  {
    title: 'Backend Services',
    description:
      'Manage policy engines, content classifiers, and webhook delivery queues. Maintain failover routing and redundancy for ingestion pipelines.',
  },
  {
    title: 'Compliance & Audit',
    description:
      'Track consent logs, export data access trails, and report on APP/Privacy Act obligations. Schedule quarterly audit exports.',
  },
  {
    title: 'Incident Operations',
    description:
      'Run playbooks for high-risk alerts, coordinate with eSafety reports, and trigger human review workflows.',
  },
  {
    title: 'Billing & Entitlements',
    description:
      'Provision entitlements for device counts, data retention, and premium analytics. Manage invoices and enterprise cost centres.',
  },
];

export default function OperatorsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-brand-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-brand-700">
          Operator console
        </h1>
        <p className="mt-2 text-sm text-brand-600">
          This space is reserved for enterprise operators managing Sentinel AU
          infrastructure, identity, and provider integrations. The dashboard
          remains focused on guardians; operators should use the modules below
          to configure hyperscalers, MDM providers, and security controls.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {operatorFunctions.map((item) => (
          <article
            key={item.title}
            className="rounded-lg border border-brand-100 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-brand-700">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-brand-600">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-brand-700">
          Hyperscaler backends
        </h2>
        <p className="mt-2 text-sm text-brand-600">
          Link the control plane to approved cloud providers. Operator tokens
          and audit logs should be stored in the enterprise vault and rotated
          quarterly.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {hyperscalers.map((item) => (
            <div
              key={item.title}
              className="rounded-md border border-brand-100 bg-brand-50 p-4"
            >
              <h3 className="text-sm font-semibold text-brand-700">
                {item.title}
              </h3>
              <ul className="mt-2 space-y-2 text-sm text-brand-600">
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-brand-700">
          Provider integrations
        </h2>
        <p className="mt-2 text-sm text-brand-600">
          Configure device management providers and distribution channels. Keep
          tenant-specific credentials separated from operator credentials to
          maintain enterprise segmentation.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {providerIntegrations.map((item) => (
            <div
              key={item.title}
              className="rounded-md border border-brand-100 bg-white p-4"
            >
              <h3 className="text-sm font-semibold text-brand-700">
                {item.title}
              </h3>
              <ul className="mt-2 space-y-2 text-sm text-brand-600">
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-brand-700">
          Operator setup guide
        </h2>
        <p className="mt-2 text-sm text-brand-600">
          Use the operator setup guide to capture enterprise emails, provider
          identifiers, and escalation workflows for manual intervention. The
          guide outlines what to collect from customers before enabling
          production access.
        </p>
        <div className="mt-4 rounded-md border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-600">
          Reference:{' '}
          <span className="font-semibold text-brand-700">
            docs/OPERATOR_SETUP_GUIDE.md
          </span>
        </div>
      </section>
    </div>
  );
}
