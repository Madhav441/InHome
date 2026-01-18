import { listDevices } from '../../../lib/enrollmentStore';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(listDevices());
}
