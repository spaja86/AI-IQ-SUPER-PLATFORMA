import { NextResponse } from 'next/server';
import { getRealCreateQvadersContract } from '@/lib/poker/real-create-qvaders';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    track: 'master-poker',
    contract: getRealCreateQvadersContract(),
    timestamp: new Date().toISOString(),
  });
}
