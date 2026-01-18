import { enrollDevice, EnrollmentMode } from '../../../lib/enrollmentStore';
import { NextResponse } from 'next/server';

type EnrollmentRequest = {
  code?: string;
  deviceName?: string;
  platform?: string;
  enrollmentMode?: EnrollmentMode;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as EnrollmentRequest;
  const code = body.code?.trim().toUpperCase() || '';
  const deviceName = body.deviceName?.trim() || 'Child device';
  const platform = body.platform?.trim() || 'Android';
  const enrollmentMode = body.enrollmentMode ?? 'Demo (in-memory)';
  const result = enrollDevice({
    code,
    deviceName,
    platform,
    enrollmentMode,
  });

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.device);
}
