const alerts = [
  {
    id: 'alert-1',
    ts: '2024-08-25T08:32:00+10:00',
    profile: 'Maya',
    severity: 'High',
    summary: 'Detected self-harm phrase in social app notification title',
    actioned: false
  },
  {
    id: 'alert-2',
    ts: '2024-08-24T21:10:00+10:00',
    profile: 'Kai',
    severity: 'Medium',
    summary: 'Attempted access to blocked gambling site via Chrome',
    actioned: true
  }
];

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-700">Alerts</h1>
        <p className="text-sm text-brand-600">
          Alerts are generated when high-risk classifiers fire or when tamper signals are detected. Each alert contains
          remediation guidance aligned to eSafety principles.
        </p>
      </div>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <article key={alert.id} className="rounded-lg border border-brand-100 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-brand-700">
                  {alert.severity} • {alert.profile}
                </p>
                <p className="text-xs text-brand-500">{new Date(alert.ts).toLocaleString('en-AU')}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  alert.actioned ? 'bg-brand-100 text-brand-700' : 'bg-brand-600 text-white'
                }`}
              >
                {alert.actioned ? 'Actioned' : 'Awaiting review'}
              </span>
            </div>
            <p className="mt-2 text-sm text-brand-600">{alert.summary}</p>
            <p className="mt-2 text-xs text-brand-500">
              Suggested action: Discuss online wellbeing with Maya and review support resources. Provide helpline details
              from ReachOut and Kids Helpline.
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
