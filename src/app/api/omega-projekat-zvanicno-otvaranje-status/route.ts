import { NextResponse } from 'next/server';
import { getZvanicnoOtvaranjeSummary } from '@/lib/omega-projekat-zvanicno-otvaranje';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const summary = getZvanicnoOtvaranjeSummary();

  return NextResponse.json({
    status: summary.status,
    verzija: APP_VERSION,
    projekat: summary.projekat,
    otvaranje: summary.otvaranje,
    saglasnost: summary.saglasnost,
    monologStatus: summary.monologStatus,
    matricniRang: summary.matricniRang,
    egzocentricnost: summary.egzocentricnost,
    sirenaRezonanca: summary.sirenaRezonanca,
    integritet: summary.integritet,
    potvrde: summary.potvrde,

    brojevi: {
      rute: summary.rute,
      apiRute: summary.apiRute,
      stranice: summary.stranice,
      dijagnostike: summary.dijagnostike,
      omegaAi: summary.omegaAi,
    },

    timestamp: new Date().toISOString(),
  });
}
