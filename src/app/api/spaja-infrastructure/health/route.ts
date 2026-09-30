import { NextResponse } from 'next/server';
import { getSpajaInfrastructureHealth } from '@/lib/spaja-infrastructure';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ...getSpajaInfrastructureHealth(),
    timestamp: new Date().toISOString(),
  });
}
