import { NextResponse } from 'next/server';
import { getSeoMatricniSekvencijalniDizajnSummary } from '@/lib/seo-matricni-sekvencijalni-dizajn';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const summary = getSeoMatricniSekvencijalniDizajnSummary();

  return NextResponse.json({
    status: summary.status,
    naziv: 'SEO Matricni Sekvencijalni Dizajn — Status',
    verzija: APP_VERSION,

    zdravlje: {
      ukupnoSekvenci: summary.ukupnoSekvenci,
      kompletiranih: summary.kompletiranih,
      kompletnost: summary.kompletnost,
      ukupniSeoSkor: summary.ukupniSeoSkor,
      protokProtocnost: summary.protokProtocnost,
      matricnaDimenzija: summary.matricnaDimenzija,
      eksplicitnihOblika: summary.eksplicitnihOblika,
    },

    omegaPersona: summary.omegaPersona,

    timestamp: new Date().toISOString(),
  });
}
