import Link from 'next/link';
import { Suspense } from 'react';
import { ActivityHeatmap } from '../src/components/activity-heatmap';
import { PolicySummary } from '../src/components/policy-summary';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-brand-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-brand-700">Kaya, guardians!</h1>
        <p className="mt-2 text-sm text-brand-600">
          This dashboard summarises the recent activity for your Sentinel AU household. Data is retained for 90 days
          by default and can be exported or deleted from the privacy centre.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-brand-600">
          <div className="rounded-md border border-brand-200 bg-brand-50 px-4 py-3">
            <p className="font-semibold text-brand-700">Seeded demo org</p>
            <p>3 managed profiles • 5 devices • Data residency: Sydney (ap-southeast-2)</p>
          </div>
          <div className="rounded-md border border-brand-200 bg-white px-4 py-3">
            <p className="font-semibold text-brand-700">Parental consent</p>
            <p>All paired devices have logged consent statements.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<p>Loading policy summary…</p>}>
          <PolicySummary />
        </Suspense>
        <Suspense fallback={<p>Loading heatmap…</p>}>
          <ActivityHeatmap />
        </Suspense>
      </section>

      <section className="rounded-lg border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-brand-700">Getting started</h2>
        <ul className="mt-4 space-y-2 text-sm text-brand-600">
          <li>
            <Link href="/pairing" className="font-medium text-brand-600 underline">
              Pair a device
            </Link>{' '}
            to generate a short-lived QR code for Android, iOS, or the browser extension.
          </li>
          <li>
            <Link href="/policies" className="font-medium text-brand-600 underline">
              Update your policy bundle
            </Link>{' '}
            to apply category filters, SafeSearch enforcement, and schedules.
          </li>
          <li>
            <Link href="/privacy" className="font-medium text-brand-600 underline">
              Review the privacy centre
            </Link>{' '}
            for data export, correction, and deletion in line with APP 12/13.
          </li>
        </ul>
      </section>
    </div>
  );
}
