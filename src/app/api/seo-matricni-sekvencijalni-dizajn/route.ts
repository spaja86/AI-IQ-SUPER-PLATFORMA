import { NextResponse } from 'next/server';
import { getSeoMatricniSekvencijalniDizajn } from '@/lib/seo-matricni-sekvencijalni-dizajn';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';

export async function GET() {
  const pregled = getSeoMatricniSekvencijalniDizajn();

  return NextResponse.json({
    status: pregled.status,
    naziv: pregled.naziv,
    opis: pregled.opis,
    verzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,

    protocnost: pregled.protocnost,

    sekvence: pregled.sekvence.map((s) => ({
      redosled: s.redosled,
      naziv: s.naziv,
      ikona: s.ikona,
      faza: s.faza,
      oktave: s.oktave,
      projekcionaMatrica: s.projekcionaMatrica,
      seoParametri: s.seoParametri,
      protocnost: s.protocnost,
      inkrementalniDoprinos: s.inkrementalniDoprinos,
      status: s.status,
    })),

    eksplicitniOblici: pregled.eksplicitniOblici,

    metrke: {
      ukupniSeoSkor: pregled.ukupniSeoSkor,
      kompletnost: pregled.kompletnost,
    },

    inkrementalniNapredak: pregled.inkrementalniNapredak,
    omegaIntegracija: pregled.omegaIntegracija,

    timestamp: pregled.timestamp,
  });
}
