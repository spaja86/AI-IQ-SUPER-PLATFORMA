import { NextResponse } from 'next/server';
import { getStatistike } from '@/lib/statistika';
import { runDiagnostics } from '@/lib/auto-repair';

export async function GET() {
  const stats = getStatistike();
  const diagnostics = runDiagnostics();
  return NextResponse.json({
    status: 'operational',
    platforma: 'AI IQ SUPER PLATFORMA',
    kompanija: 'SPAJA',
    verzija: '5.1.0',
    arhitektura: 'sekvence',
    timestamp: new Date().toISOString(),
    statistike: stats,
    zdravlje: diagnostics.zdravlje,
    stranice: 14,
    apiRute: 4,
    omegaAI: 21,
    autoPopravka: 'aktivan',
  });
}
