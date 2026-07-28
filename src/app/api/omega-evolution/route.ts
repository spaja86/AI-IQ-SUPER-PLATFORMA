import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { getOmegaEvolutionPregled } from '@/lib/omega-evolution';
import { fetchStatus, getOmegaEvolutionSnapshots } from '@/lib/omega-evolution-store';

export async function GET() {
  const pregled = getOmegaEvolutionPregled();
  const snapshot = fetchStatus();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OMEGA Evolution Hub',
    verzija: APP_VERSION,
    autofinish: AUTOFINISH_COUNT,
    pregled,
    snapshot,
    snapshotCount: getOmegaEvolutionSnapshots().length,
    timestamp: new Date().toISOString(),
  });
}
