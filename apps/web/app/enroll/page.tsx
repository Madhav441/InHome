'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const platformOptions = ['Android', 'Android Enterprise', 'iPadOS', 'iOS'];
const enrollmentModes = [
  'Demo (in-memory)',
  'Android Enterprise (MDM)',
  'Apple DEP (MDM)',
] as const;

type EnrollmentMode = (typeof enrollmentModes)[number];

type EnrollmentResponse = {
  error?: string;
  name?: string;
};

const parsePlatform = (value: string | null) => {
  if (!value) {
    return 'Android';
  }
  const match = platformOptions.find(
    (option) => option.toLowerCase() === value.toLowerCase()
  );
  return match ?? 'Android';
};

const parseEnrollmentMode = (value: string | null) => {
  if (!value) {
    return 'Demo (in-memory)';
  }
  const match = enrollmentModes.find(
    (option) => option.toLowerCase() === value.toLowerCase()
  );
  return match ?? 'Demo (in-memory)';
};

export default function EnrollPage() {
  const [code, setCode] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [platform, setPlatform] = useState('Android');
  const [enrollmentMode, setEnrollmentMode] =
    useState<EnrollmentMode>('Demo (in-memory)');
  const [status, setStatus] = useState('');
  const [autoEnroll, setAutoEnroll] = useState(false);
  const autoSubmitted = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    const deviceParam = params.get('deviceName');
    const platformParam = params.get('platform');
    const modeParam = params.get('enrollmentMode');
    const autoParam = params.get('auto');
    if (codeParam) {
      setCode(codeParam.toUpperCase());
    }
    if (deviceParam) {
      setDeviceName(deviceParam);
    }
    setPlatform(parsePlatform(platformParam));
    setEnrollmentMode(parseEnrollmentMode(modeParam));
    setAutoEnroll(autoParam === '1');
  }, []);

  const submit = async () => {
    setStatus('Submitting enrollment...');
    const response = await fetch('/api/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, deviceName, platform, enrollmentMode }),
    });
    const data = (await response.json()) as EnrollmentResponse;
    if (!response.ok) {
      setStatus(data.error ?? 'Enrollment failed.');
      return;
    }
    setStatus(`Enrollment complete for ${data.name ?? deviceName}.`);
  };

  useEffect(() => {
    if (!autoEnroll || autoSubmitted.current) {
      return;
    }
    if (!code || !deviceName || !platform) {
      return;
    }
    autoSubmitted.current = true;
    void submit();
  }, [autoEnroll, code, deviceName, platform]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-brand-700">
          Enroll a child device
        </h1>
        <p className="text-sm text-brand-600">
          Use the pairing code from your guardian dashboard to finish enrollment
          on this device.
        </p>
      </div>

      <div className="rounded-lg border border-brand-100 bg-white p-6 shadow-sm">
        <div className="grid gap-4">
          <label
            className="text-sm font-semibold text-brand-600"
            htmlFor="pairing-code"
          >
            Pairing code
          </label>
          <input
            id="pairing-code"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            className="rounded-md border border-brand-200 px-3 py-2 text-sm text-brand-700"
            placeholder="Enter code"
          />
          <label
            className="text-sm font-semibold text-brand-600"
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
            className="text-sm font-semibold text-brand-600"
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
            className="text-sm font-semibold text-brand-600"
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
          <button
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            onClick={submit}
            type="button"
          >
            Enroll device
          </button>
          {status ? <p className="text-sm text-brand-500">{status}</p> : null}
        </div>
      </div>

      <div className="rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm text-brand-600">
        <p className="font-semibold text-brand-700">One-tap enrollment</p>
        <p>
          If the guardian shared a QR code with pre-filled details, this page
          can auto-submit once you open it.
        </p>
        <p className="mt-2">
          Auto-submit is {autoEnroll ? 'enabled' : 'disabled'}.
        </p>
      </div>

      <div className="rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm text-brand-600">
        After enrollment, return to the guardian dashboard to manage policies
        and view device status.
        <div className="mt-2">
          <Link
            className="font-semibold text-brand-700 underline"
            href="/devices"
          >
            Go to Devices
          </Link>
        </div>
      </div>
    </div>
  );
}
