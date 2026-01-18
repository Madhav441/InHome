'use client';

import { useEffect, useMemo, useState } from 'react';

const assistedSteps = [
  'Open the enrollment link on the helper Android device.',
  'Sign in as the guardian and confirm consent details.',
  'Configure Wi-Fi and verify the child profile details.',
  'Start the managed setup on the child device using the pairing code.',
];

const managedSteps = [
  'Factory reset the child device (if required by your MDM policy).',
  'On first boot, scan the pairing QR code.',
  'Install the Sentinel AU Android agent when prompted.',
  'Confirm the policy bundle and device name.',
];

const platformOptions = ['Android', 'Android Enterprise', 'iPadOS', 'iOS'];
const enrollmentModes = [
  'Demo (in-memory)',
  'Android Enterprise (MDM)',
  'Apple DEP (MDM)',
] as const;

type EnrollmentMode = (typeof enrollmentModes)[number];

type PairingSession = {
  code: string;
  expiresAt: number;
  childName: string;
  enrollmentMode: EnrollmentMode;
};

const formatExpiry = (expiresAt: number) => {
  const remainingMs = Math.max(expiresAt - Date.now(), 0);
  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

const buildEnrollmentLink = (payload: {
  code: string;
  deviceName: string;
  platform: string;
  oneTap: boolean;
  enrollmentMode: EnrollmentMode;
}) => {
  const params = new URLSearchParams();
  params.set('code', payload.code);
  if (payload.deviceName) {
    params.set('deviceName', payload.deviceName);
  }
  if (payload.platform) {
    params.set('platform', payload.platform);
  }
  if (payload.enrollmentMode) {
    params.set('enrollmentMode', payload.enrollmentMode);
  }
  if (payload.oneTap) {
    params.set('auto', '1');
  }
  return `/enroll?${params.toString()}`;
};

export default function PairingPage() {
  const [session, setSession] = useState<PairingSession | null>(null);
  const [childName, setChildName] = useState('Maya');
  const [deviceName, setDeviceName] = useState("Ava's Pixel");
  const [platform, setPlatform] = useState('Android');
  const [enrollmentMode, setEnrollmentMode] =
    useState<EnrollmentMode>('Demo (in-memory)');
  const [oneTap, setOneTap] = useState(true);
  const [status, setStatus] = useState('');
  const [parentStatus, setParentStatus] = useState('');

  const enrollmentLink = useMemo(() => {
    if (!session || typeof window === 'undefined') {
      return '';
    }
    const path = buildEnrollmentLink({
      code: session.code,
      deviceName,
      platform,
      oneTap,
      enrollmentMode,
    });
    return `${window.location.origin}${path}`;
  }, [session, deviceName, platform, oneTap, enrollmentMode]);

  const parentLink = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    return `${window.location.origin}/pairing`;
  }, []);

  const parentInstruction = useMemo(() => {
    if (!parentLink) {
      return '';
    }
    return `Open ${parentLink} to access the guardian pairing page.`;
  }, [parentLink]);

  const qrCodeUrl = useMemo(() => {
    if (!enrollmentLink) {
      return '';
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      enrollmentLink
    )}`;
  }, [enrollmentLink]);

  const parentQrCodeUrl = useMemo(() => {
    if (!parentLink) {
      return '';
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      parentLink
    )}`;
  }, [parentLink]);

  const refreshSession = async (nameOverride?: string) => {
    const response = await fetch('/api/pairing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        childName: nameOverride ?? childName,
        enrollmentMode,
      }),
    });
    const data = (await response.json()) as PairingSession;
    setSession(data);
    setStatus('');
  };

  useEffect(() => {
    fetch('/api/pairing')
      .then((response) => response.json())
      .then((data: PairingSession) => {
        setSession(data);
        setEnrollmentMode(data.enrollmentMode ?? 'Demo (in-memory)');
        setChildName(data.childName ?? 'Maya');
      });
  }, []);

  useEffect(() => {
    if (!session) {
      return undefined;
    }
    const timer = setInterval(
      () => setSession((current) => (current ? { ...current } : current)),
      1000
    );
    return () => clearInterval(timer);
  }, [session]);

  const handleCopy = async () => {
    if (!enrollmentLink) {
      return;
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(enrollmentLink);
      setStatus('Enrollment link copied.');
      return;
    }
    setStatus('Copy the link manually.');
  };

  const handleParentCopy = async () => {
    if (!parentLink) {
      return;
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(parentLink);
      setParentStatus('Parent link copied.');
      return;
    }
    setParentStatus('Copy the link manually.');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-brand-700">
            Pair a device
          </h1>
          <p className="text-sm text-brand-600">
            Generate a short-lived QR code that links a device to your
            organisation. Pairing requires guardian authentication and explicit
            consent from the device owner for adults.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-lg border border-brand-100 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-brand-500">
              Assisted Android setup
            </p>
            <h2 className="mt-2 text-base font-semibold text-brand-700">
              Use a helper device to prep Wi-Fi
            </h2>
            <ol className="mt-3 space-y-2 text-sm text-brand-600">
              {assistedSteps.map((step) => (
                <li key={step} className="flex gap-2">
                  <span
                    className="mt-0.5 h-2 w-2 rounded-full bg-brand-500"
                    aria-hidden="true"
                  />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 rounded-md bg-brand-50 p-3 text-xs text-brand-600">
              For assisted enrollment, the helper device never becomes managed.
              It only launches the pairing flow.
            </div>
          </section>

          <section className="rounded-lg border border-brand-100 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-brand-500">
              Fully managed Android
            </p>
            <h2 className="mt-2 text-base font-semibold text-brand-700">
              Enroll the child device
            </h2>
            <ol className="mt-3 space-y-2 text-sm text-brand-600">
              {managedSteps.map((step) => (
                <li key={step} className="flex gap-2">
                  <span
                    className="mt-0.5 h-2 w-2 rounded-full bg-brand-500"
                    aria-hidden="true"
                  />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 rounded-md bg-brand-50 p-3 text-xs text-brand-600">
              Managed enrollment applies the policy bundle, schedules, and
              monitoring settings to the child profile.
            </div>
          </section>
        </div>

        <div className="rounded-lg border border-brand-100 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-500">
                Pairing token
              </p>
              <p className="text-lg font-semibold text-brand-700">
                {session?.code ?? 'Generating...'}
              </p>
              <p className="text-xs text-brand-500">
                Expires in {session ? formatExpiry(session.expiresAt) : '00:00'}
              </p>
            </div>
            <div className="grid gap-3 text-sm">
              <label
                className="text-xs font-semibold text-brand-600"
                htmlFor="child-name"
              >
                Child profile
              </label>
              <input
                id="child-name"
                value={childName}
                onChange={(event) => setChildName(event.target.value)}
                className="rounded-md border border-brand-200 px-3 py-2 text-sm text-brand-700"
                placeholder="Child name"
              />
              <label
                className="text-xs font-semibold text-brand-600"
                htmlFor="device-name"
              >
                Device name
              </label>
              <input
                id="device-name"
                value={deviceName}
                onChange={(event) => setDeviceName(event.target.value)}
                className="rounded-md border border-brand-200 px-3 py-2 text-sm text-brand-700"
                placeholder="e.g. Ava's Pixel"
              />
              <label
                className="text-xs font-semibold text-brand-600"
                htmlFor="platform"
              >
                Platform
              </label>
              <select
                id="platform"
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                className="rounded-md border border-brand-200 px-3 py-2 text-sm text-brand-700"
              >
                {platformOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <label
                className="text-xs font-semibold text-brand-600"
                htmlFor="enrollment-mode"
              >
                Enrollment mode
              </label>
              <select
                id="enrollment-mode"
                value={enrollmentMode}
                onChange={(event) =>
                  setEnrollmentMode(event.target.value as EnrollmentMode)
                }
                className="rounded-md border border-brand-200 px-3 py-2 text-sm text-brand-700"
              >
                {enrollmentModes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-xs text-brand-600">
                <input
                  type="checkbox"
                  checked={oneTap}
                  onChange={(event) => setOneTap(event.target.checked)}
                  className="h-4 w-4"
                />
                One-tap enrollment (auto-submit)
              </label>
              <button
                className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700"
                onClick={() => refreshSession()}
                type="button"
              >
                Regenerate
              </button>
            </div>
          </div>
          <div className="mt-4 grid gap-3 text-xs text-brand-600 md:grid-cols-2">
            <div className="rounded-md border border-brand-100 bg-brand-50 p-3">
              <p className="font-semibold text-brand-700">
                Pre-collected data ready
              </p>
              <p>
                School and guardian details are pre-filled. Confirm accuracy
                before continuing.
              </p>
            </div>
            <div className="rounded-md border border-brand-100 bg-brand-50 p-3">
              <p className="font-semibold text-brand-700">Consent tracking</p>
              <p>
                Guardian consent is recorded during enrollment and stored in the
                audit log.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-md border border-dashed border-brand-200 bg-white p-3 text-xs text-brand-600">
            <p className="font-semibold text-brand-700">Enrollment link</p>
            <p className="break-all">{enrollmentLink || 'Loading link...'}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className="rounded-md border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-700"
                onClick={handleCopy}
                type="button"
              >
                Copy link
              </button>
              <button
                className="rounded-md border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-700"
                onClick={() => refreshSession('Maya')}
                type="button"
              >
                New for another child
              </button>
            </div>
            {status ? (
              <p className="mt-2 text-xs text-brand-500">{status}</p>
            ) : null}
          </div>
          <div className="mt-4 rounded-md border border-dashed border-brand-200 bg-white p-3 text-xs text-brand-600">
            <p className="font-semibold text-brand-700">
              Guardian quick access
            </p>
            <p className="break-all">
              {parentInstruction || 'Loading parent link...'}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className="rounded-md border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-700"
                onClick={handleParentCopy}
                type="button"
              >
                Copy guardian link
              </button>
            </div>
            {parentStatus ? (
              <p className="mt-2 text-xs text-brand-500">{parentStatus}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="w-full rounded-lg border border-brand-100 bg-white p-6 text-center shadow-sm">
          <p className="text-xs uppercase tracking-wide text-brand-500">
            Parent quick access QR
          </p>
          {parentQrCodeUrl ? (
            <img
              src={parentQrCodeUrl}
              alt="Parent pairing QR"
              className="mx-auto mt-4 h-[220px] w-[220px]"
            />
          ) : (
            <div className="mt-4 flex h-[220px] w-[220px] items-center justify-center rounded-md border border-dashed border-brand-200 text-xs text-brand-500">
              Generating QR...
            </div>
          )}
          <p className="mt-3 text-xs text-brand-500">
            Scan to open the parent pairing dashboard.
          </p>
        </div>
        <div className="w-full rounded-lg border border-brand-100 bg-white p-6 text-center shadow-sm">
          <p className="text-xs uppercase tracking-wide text-brand-500">
            Child enrollment QR
          </p>
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="Enrollment QR"
              className="mx-auto mt-4 h-[220px] w-[220px]"
            />
          ) : (
            <div className="mt-4 flex h-[220px] w-[220px] items-center justify-center rounded-md border border-dashed border-brand-200 text-xs text-brand-500">
              Generating QR...
            </div>
          )}
          <p className="mt-3 text-xs text-brand-500">
            QR codes include the pairing link and any pre-filled fields.
          </p>
        </div>
        <div className="w-full rounded-lg border border-brand-100 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-brand-500">
            Enrollment checklist
          </p>
          <ul className="mt-3 space-y-2 text-sm text-brand-600">
            <li>Guardian account verified</li>
            <li>Child profile created</li>
            <li>Policy bundle assigned</li>
            <li>Wi-Fi credentials ready</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
