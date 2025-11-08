const rights = [
  {
    title: 'Access & correction (APP 12/13)',
    description:
      'Request a copy of stored telemetry and alerts for each managed profile. Submit corrections for inaccurate guardian details.'
  },
  {
    title: 'Deletion & retention',
    description: 'Default retention is 90 days for telemetry and 365 days for alerts. You can shorten these windows at any time.'
  },
  {
    title: 'Consent records',
    description: 'Signed guardian consent statements for minors and explicit consent for monitored adults are logged here.'
  },
  {
    title: 'Complaints & OAIC contact',
    description:
      'Escalate privacy complaints at privacy@sentinel.au or lodge with the Office of the Australian Information Commissioner.'
  }
];

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-brand-700">Privacy centre</h1>
      <p className="text-sm text-brand-600">
        Sentinel AU embraces privacy by design. Use the tools below to export data, submit corrections, and manage
        consent preferences.
      </p>
      <div className="space-y-4">
        {rights.map((right) => (
          <section key={right.title} className="rounded-lg border border-brand-100 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-brand-700">{right.title}</h2>
            <p className="text-sm text-brand-600">{right.description}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
