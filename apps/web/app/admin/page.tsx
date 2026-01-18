'use client';

import { useState } from 'react';

const initialTenants = [
  {
    id: 'org-home-0001',
    name: 'Morgan Family',
    plan: 'Home Plus',
    region: 'ap-southeast-2',
    status: 'Active',
  },
  {
    id: 'org-school-1022',
    name: 'Northside College',
    plan: 'School',
    region: 'ap-southeast-2',
    status: 'Provisioning',
  },
];

const roles = ['Guardian Admin', 'School Admin', 'Operator'];

export default function AdminPage() {
  const [tenants, setTenants] = useState(initialTenants);
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('Home Plus');
  const [region, setRegion] = useState('ap-southeast-2');
  const [status, setStatus] = useState('Active');

  const handleCreateTenant = () => {
    if (!name.trim()) {
      return;
    }
    const newTenant = {
      id: `org-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name,
      plan,
      region,
      status,
    };
    setTenants((current) => [newTenant, ...current]);
    setName('');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-brand-700">
          SaaS operator console
        </h1>
        <p className="text-sm text-brand-600">
          This view represents the platform operator who owns the Apple and
          Android enterprise integrations. Guardians never need their own
          enterprise IDs.
        </p>
      </div>

      <section className="grid gap-6 rounded-lg border border-brand-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-brand-700">
            Enterprise integrations
          </h2>
          <p className="text-sm text-brand-600">
            Configure your Apple Business Manager/DEP and Android Enterprise
            bindings once at the operator level.
          </p>
          <div className="space-y-2 text-sm text-brand-600">
            <div>
              <p className="text-xs uppercase text-brand-500">
                Apple enterprise ID
              </p>
              <input
                className="mt-1 w-full rounded-md border border-brand-200 px-3 py-2"
                placeholder="ABM org ID"
                defaultValue="ABM-ORG-984221"
              />
            </div>
            <div>
              <p className="text-xs uppercase text-brand-500">
                Apple DEP server token
              </p>
              <input
                className="mt-1 w-full rounded-md border border-brand-200 px-3 py-2"
                placeholder="Upload DEP token"
                defaultValue="DEP-TOKEN-LOADED"
              />
            </div>
            <div>
              <p className="text-xs uppercase text-brand-500">
                Android enterprise ID
              </p>
              <input
                className="mt-1 w-full rounded-md border border-brand-200 px-3 py-2"
                placeholder="Google EMM enterprise ID"
                defaultValue="android-enterprise-55231"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4 rounded-lg border border-brand-100 bg-brand-50 p-4">
          <h3 className="text-sm font-semibold text-brand-700">
            Operator responsibilities
          </h3>
          <ul className="space-y-2 text-sm text-brand-600">
            <li>Maintain APNs certificates and DEP server tokens.</li>
            <li>Run Android Enterprise provisioning flows.</li>
            <li>Enforce tenant isolation at the API and data layers.</li>
            <li>Provide tiered features per tenant plan.</li>
          </ul>
        </div>
      </section>

      <section className="rounded-lg border border-brand-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-brand-700">
            Tenant provisioning
          </h2>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-600">
            Multi-tenant isolation enabled
          </span>
        </div>
        <p className="mt-2 text-sm text-brand-600">
          Guardians and schools are created as sub-tenants under the operator.
          They inherit enterprise integrations without needing their own IDs.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <input
            className="rounded-md border border-brand-200 px-3 py-2 text-sm"
            placeholder="Tenant name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            className="rounded-md border border-brand-200 px-3 py-2 text-sm"
            placeholder="Plan"
            value={plan}
            onChange={(event) => setPlan(event.target.value)}
          />
          <input
            className="rounded-md border border-brand-200 px-3 py-2 text-sm"
            placeholder="Region"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
          />
          <input
            className="rounded-md border border-brand-200 px-3 py-2 text-sm"
            placeholder="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          />
          <button
            className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700"
            type="button"
            onClick={handleCreateTenant}
          >
            Add tenant
          </button>
        </div>
        <div className="mt-6 overflow-hidden rounded-lg border border-brand-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-50 text-xs uppercase text-brand-500">
              <tr>
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Default roles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {tenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-brand-700">
                      {tenant.name}
                    </div>
                    <div className="text-xs text-brand-500">{tenant.id}</div>
                  </td>
                  <td className="px-4 py-3 text-brand-600">{tenant.plan}</td>
                  <td className="px-4 py-3 text-brand-600">{tenant.region}</td>
                  <td className="px-4 py-3 text-brand-600">{tenant.status}</td>
                  <td className="px-4 py-3 text-brand-600">
                    {roles.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-brand-100 bg-white p-6 text-sm text-brand-600 shadow-sm md:grid-cols-2">
        <div>
          <h3 className="text-base font-semibold text-brand-700">
            Tenant security boundary
          </h3>
          <ul className="mt-2 space-y-2">
            <li>Tenant-scoped device + policy IDs on every request.</li>
            <li>Per-tenant encryption for sensitive payloads.</li>
            <li>Audit trails captured for enrollment and policy changes.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-brand-700">
            Guardian experience
          </h3>
          <ul className="mt-2 space-y-2">
            <li>Single sign-on to create a home organisation.</li>
            <li>Pairing code / QR to enroll child devices.</li>
            <li>Policies, alerts, and reports scoped to their home.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
