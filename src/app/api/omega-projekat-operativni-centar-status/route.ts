import { NextResponse } from 'next/server';
import { getOperativniCentarSummary } from '@/lib/omega-projekat-operativni-centar';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const summary = getOperativniCentarSummary();

  return NextResponse.json({
    status: summary.status,
    verzija: APP_VERSION,
    moduli: summary.moduli,
    zdravlje: summary.zdravlje,
    milestone: summary.milestone,

    brojevi: {
      rute: summary.rute,
      apiRute: summary.apiRute,
      stranice: summary.stranice,
      dijagnostike: summary.dijagnostike,
      omegaAi: summary.omegaAi,
      autofinish: summary.autofinish,
    },

    timestamp: new Date().toISOString(),
  });
}
