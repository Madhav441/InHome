const weeklyHighlights = [
  { label: 'Most visited domain', value: 'abc.net.au/kidsnews' },
  { label: 'Top app by time', value: 'Google Classroom (4h 12m)' },
  { label: 'Flagged events', value: '2 (reviewed)' },
  { label: 'Overrides granted', value: '1 (expired)' }
];

export function ReportPreview() {
  return (
    <div className="rounded-lg border border-brand-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-brand-700">Weekly summary – 19 Aug 2024</h3>
          <p className="text-xs text-brand-500">Generated Sunday 7:00pm AEST • Retained for 365 days • Export available</p>
        </div>
        <div className="flex gap-2 text-sm">
          <button className="rounded-md border border-brand-200 bg-white px-3 py-1 text-brand-600 hover:border-brand-400">
            View HTML
          </button>
          <button className="rounded-md bg-brand-600 px-3 py-1 text-white hover:bg-brand-700">Download PDF</button>
        </div>
      </div>
      <dl className="mt-4 grid gap-4 md:grid-cols-2">
        {weeklyHighlights.map((highlight) => (
          <div key={highlight.label} className="rounded-md bg-brand-50 p-4">
            <dt className="text-xs uppercase tracking-wide text-brand-500">{highlight.label}</dt>
            <dd className="text-sm font-semibold text-brand-700">{highlight.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-brand-500">
        Methodology: Classifier thresholds calibrated against AU-locale validation set. Accuracy ±3% at 95% confidence.
        Sentinel AU does not guarantee complete blocking of harmful content.
      </p>
    </div>
  );
}
