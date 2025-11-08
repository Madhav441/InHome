import Link from 'next/link';
import { ShieldCheck } from './shield-check';
import { SurfaceCard } from '@sentinel-au/ui-kit';

const categories = [
  { name: 'Adult content', status: 'Blocked', description: 'Utilises Australian filter lists + AI moderation' },
  { name: 'Social media', status: 'Managed', description: 'Allowed during 7am-8pm with 2h daily quota' },
  { name: 'Gaming', status: 'Warn', description: 'Requires guardian approval during school hours' },
  { name: 'Education', status: 'Allowed', description: 'Always on – includes education.gov.au quick allow-list' }
];

export function PolicySummary() {
  return (
    <SurfaceCard>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-brand-700">Policy snapshot</h3>
          <p className="mt-1 text-xs text-brand-500">
            Policies are signed server-side and refreshed on devices every 60 seconds. Short-lived override tokens are
            available for carers.
          </p>
        </div>
        <ShieldCheck />
      </div>
      <ul className="mt-4 space-y-3">
        {categories.map((category) => (
          <li key={category.name} className="rounded border border-brand-100 bg-brand-50 p-3">
            <p className="text-sm font-semibold text-brand-700">{category.name}</p>
            <p className="text-xs text-brand-500">{category.description}</p>
            <span className="mt-1 inline-flex rounded-full bg-brand-600 px-3 py-1 text-[11px] text-white">
              {category.status}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-right text-sm text-brand-600">
        <Link href="/policies" className="underline">
          Manage policies
        </Link>
      </div>
    </SurfaceCard>
  );
}
