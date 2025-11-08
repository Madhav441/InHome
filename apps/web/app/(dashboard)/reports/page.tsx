import { ReportPreview } from '../../../src/components/report-preview';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-brand-700">Reports</h1>
      <p className="text-sm text-brand-600">
        Weekly PDF and HTML reports summarise activity, top categories, and any alerts. Reports can be exported or sent
        to additional guardians with consent.
      </p>
      <ReportPreview />
    </div>
  );
}
