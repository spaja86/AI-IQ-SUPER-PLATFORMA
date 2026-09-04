import { NextResponse } from 'next/server';
import { getMekartorSnapshot } from '@/lib/mekartor';

export const dynamic = 'force-dynamic';

export async function GET() {
  const snapshot = getMekartorSnapshot();

  return NextResponse.json({
    ok: true,
    status: 'healthy',
    mekartor: snapshot,
    timestamp: new Date().toISOString(),
  });
}
