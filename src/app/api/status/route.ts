import { NextResponse } from 'next/server';
import { getStatistike } from '@/lib/statistika';
import { runDiagnostics } from '@/lib/auto-repair';
import { getDispatchSummary } from '@/lib/omega-ai-dispatch';

export async function GET() {
  const stats = getStatistike();
  const diagnostics = runDiagnostics();
  const dispatch = getDispatchSummary();
  return NextResponse.json({
    status: 'operational',
    platforma: 'AI IQ SUPER PLATFORMA',
    kompanija: 'SPAJA',
    verzija: '6.1.0',
    arhitektura: 'sekvence + omega-evolucija + proksi',
    timestamp: new Date().toISOString(),
    statistike: stats,
    zdravlje: diagnostics.zdravlje,
    stranice: 15,
    apiRute: 7,
    omegaAI: {
      persone: dispatch.ukupnoPersona,
      oktave: dispatch.ukupnoOktava,
      dispatchStatus: dispatch.status,
    },
    autoPopravka: 'aktivan',
    proksi: {
      status: 'aktivan',
      kapacitet: '10²²⁸ TB',
      topologija: 'hibridna',
    },
  });
}
