'use client';

import { useEffect, useState } from 'react';

type DeviceRecord = {
  id: string;
  name: string;
  owner: string;
  status: string;
  lastSeen: string;
  platform: string;
  enrollmentMode?: string;
};

const fallbackDevices: DeviceRecord[] = [
  {
    id: 'seed-1',
    name: 'Pixel 7a',
    owner: 'Maya',
    status: 'Online',
    lastSeen: '30s ago',
    platform: 'Android 14',
    enrollmentMode: 'Android Enterprise (MDM)',
  },
  {
    id: 'seed-2',
    name: 'iPad (9th gen)',
    owner: 'Luca',
    status: 'Schedule active',
    lastSeen: '2m ago',
    platform: 'iPadOS 17',
    enrollmentMode: 'Apple DEP (MDM)',
  },
  {
    id: 'seed-3',
    name: 'Chromebook',
    owner: 'Kai',
    status: 'Browser extension connected',
    lastSeen: '10m ago',
    platform: 'ChromeOS',
    enrollmentMode: 'Demo (in-memory)',
  },
];

export default function DevicesPage() {
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/devices')
      .then((response) => response.json())
      .then((data: DeviceRecord[]) => {
        if (data.length === 0) {
          setDevices(fallbackDevices);
        } else {
          setDevices(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-brand-700">Devices</h1>
        <p className="text-sm text-brand-600">
          Sentinel AU devices exchange heartbeats every 60 seconds. Tamper
          events automatically generate alerts and send push notifications to
          guardians.
        </p>
      </div>
      {loading ? (
        <p className="text-sm text-brand-500">Loading devices...</p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {devices.map((device) => (
          <article
            key={device.id}
            className="rounded-lg border border-brand-100 bg-white p-4 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-brand-700">
              {device.name}
            </h2>
            <dl className="mt-2 space-y-1 text-sm text-brand-600">
              <div className="flex justify-between">
                <dt>Owner</dt>
                <dd>{device.owner}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Platform</dt>
                <dd>{device.platform}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Status</dt>
                <dd>{device.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Last seen</dt>
                <dd>{device.lastSeen}</dd>
              </div>
              {device.enrollmentMode ? (
                <div className="flex justify-between">
                  <dt>Enrollment</dt>
                  <dd>{device.enrollmentMode}</dd>
                </div>
              ) : null}
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
