import {
  createPairingSession,
  getActiveSession,
  EnrollmentMode,
} from '../../../lib/enrollmentStore';
import { NextResponse } from 'next/server';

type PairingRequest = {
  childName?: string;
  enrollmentMode?: EnrollmentMode;
};

export async function GET() {
  return NextResponse.json(getActiveSession());
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as PairingRequest;
  const childName = body.childName?.trim() || 'Child';
  const enrollmentMode = body.enrollmentMode ?? 'Demo (in-memory)';
  return NextResponse.json(
    createPairingSession({
      childName,
      enrollmentMode,
    })
  );
}
