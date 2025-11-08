import { SurfaceCard } from '@sentinel-au/ui-kit';

const profiles = ['Luca', 'Maya', 'Kai'];
const categories = ['Adult', 'Violence', 'Gambling', 'Social', 'Education'];
const assignments: Record<string, Record<string, 'Allow' | 'Warn' | 'Block'>> = {
  Luca: { Adult: 'Block', Violence: 'Warn', Gambling: 'Block', Social: 'Allow', Education: 'Allow' },
  Maya: { Adult: 'Block', Violence: 'Block', Gambling: 'Block', Social: 'Warn', Education: 'Allow' },
  Kai: { Adult: 'Block', Violence: 'Warn', Gambling: 'Warn', Social: 'Warn', Education: 'Allow' }
};

const badgeColour: Record<'Allow' | 'Warn' | 'Block', string> = {
  Allow: 'bg-brand-100 text-brand-700',
  Warn: 'bg-yellow-100 text-yellow-700',
  Block: 'bg-rose-100 text-rose-700'
};

export function PolicyMatrix() {
  return (
    <SurfaceCard className="overflow-x-auto" padded={false}>
      <table className="min-w-full divide-y divide-brand-100">
        <thead className="bg-brand-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-brand-500">
              Profile
            </th>
            {categories.map((category) => (
              <th
                scope="col"
                key={category}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-brand-500"
              >
                {category}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-50">
          {profiles.map((profile) => (
            <tr key={profile}>
              <th scope="row" className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-brand-700">
                {profile}
              </th>
              {categories.map((category) => {
                const state = assignments[profile][category];
                return (
                  <td key={category} className="px-4 py-3 text-sm">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeColour[state]}`}>
                      {state}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </SurfaceCard>
  );
}
