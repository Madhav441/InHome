export type EnrollmentMode =
  | 'Demo (in-memory)'
  | 'Android Enterprise (MDM)'
  | 'Apple DEP (MDM)';

export type DeviceRecord = {
  id: string;
  name: string;
  owner: string;
  platform: string;
  status: string;
  lastSeen: string;
  enrollmentMode: EnrollmentMode;
};

export type PairingSession = {
  code: string;
  expiresAt: number;
  childName: string;
  enrollmentMode: EnrollmentMode;
};

type EnrollmentStore = {
  devices: DeviceRecord[];
  sessions: PairingSession[];
};

const store: EnrollmentStore = {
  devices: [],
  sessions: [],
};

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const randomCode = () =>
  Array.from(
    { length: 8 },
    () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ).join('');

const now = () => Date.now();

export const createPairingSession = (payload: {
  childName: string;
  enrollmentMode: EnrollmentMode;
}) => {
  const session: PairingSession = {
    code: randomCode(),
    expiresAt: now() + 10 * 60 * 1000,
    childName: payload.childName,
    enrollmentMode: payload.enrollmentMode,
  };
  store.sessions.unshift(session);
  return session;
};

export const getActiveSession = () => {
  const current = store.sessions.find((session) => session.expiresAt > now());
  if (current) {
    return current;
  }
  return createPairingSession({
    childName: 'Child',
    enrollmentMode: 'Demo (in-memory)',
  });
};

export const redeemPairingSession = (code: string) => {
  const session = store.sessions.find(
    (item) => item.code === code && item.expiresAt > now()
  );
  if (!session) {
    return null;
  }
  return session;
};

export const enrollDevice = (payload: {
  code: string;
  deviceName: string;
  platform: string;
  enrollmentMode: EnrollmentMode;
}) => {
  const session = redeemPairingSession(payload.code);
  if (!session) {
    return { error: 'Pairing code is invalid or expired.' } as const;
  }
  const device: DeviceRecord = {
    id: `${payload.code}-${payload.deviceName}`,
    name: payload.deviceName,
    owner: session.childName,
    platform: payload.platform,
    status: 'Managed',
    lastSeen: 'Just now',
    enrollmentMode: payload.enrollmentMode,
  };
  store.devices.unshift(device);
  return { device } as const;
};

export const listDevices = () => store.devices;
