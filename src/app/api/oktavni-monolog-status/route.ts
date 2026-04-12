import { NextResponse } from 'next/server';
import { getOktavniMonologSummary } from '@/lib/oktavni-monolog';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const summary = getOktavniMonologSummary();

  return NextResponse.json({
    status: summary.status,
    naziv: summary.naziv,
    verzija: APP_VERSION,

    zdravlje: {
      ekvivalentiBroj: summary.ekvivalentiBroj,
      matricnaDimenzija: summary.matricnaDimenzija,
      matricniTrag: summary.matricniTrag,
      matricniRang: summary.matricniRang,
      egzocentricnost: summary.egzocentricnost,
      jezgroSnaga: summary.jezgroSnaga,
      sirenaRezonanca: summary.sirenaRezonanca,
      laucentricniSlojevi: summary.laucentricniSlojevi,
      laucentricnaSnaga: summary.laucentricnaSnaga,
    },

    omegaProjekat: summary.omegaProjekat,

    timestamp: new Date().toISOString(),
  });
}
