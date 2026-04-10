import { NextResponse } from 'next/server';
import { getPlasiranjeSummary } from '@/lib/omega-projekat-plasiranje';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const summary = getPlasiranjeSummary();

  return NextResponse.json({
    status: summary.status,
    verzija: APP_VERSION,
    projekat: summary.projekat,
    industrija: summary.industrija,
    saglasnost: summary.saglasnost,
    fazaProgres: summary.fazaProgres,
    sistemiProgres: summary.sistemiProgres,

    brojevi: {
      rute: summary.rute,
      apiRute: summary.apiRute,
      stranice: summary.stranice,
      dijagnostike: summary.dijagnostike,
      omegaAi: summary.omegaAi,
      persone: summary.persone,
      oktave: summary.oktave,
    },

    timestamp: new Date().toISOString(),
  });
}
