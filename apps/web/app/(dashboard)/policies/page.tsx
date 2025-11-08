import { PolicyMatrix } from '../../../src/components/policy-matrix';

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-brand-700">Policies</h1>
      <p className="text-sm text-brand-600">
        Manage allow, warn, and block categories for each managed profile. All changes are auditable and distributed via signed
        policy bundles.
      </p>
      <PolicyMatrix />
    </div>
  );
}
