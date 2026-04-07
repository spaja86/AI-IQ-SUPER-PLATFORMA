import { NextResponse } from 'next/server';
import { promptovi, getPromptKategorije } from '@/lib/prompt';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const kategorije = getPromptKategorije();
  const poKategoriji = kategorije.map((kat) => ({
    kategorija: kat,
    brojPromptova: promptovi.filter((p) => p.kategorija === kat).length,
  }));

  const poPrioritetu = {
    kritican: promptovi.filter((p) => p.prioritet === 'kritican').length,
    visok: promptovi.filter((p) => p.prioritet === 'visok').length,
    srednji: promptovi.filter((p) => p.prioritet === 'srednji').length,
    nizak: promptovi.filter((p) => p.prioritet === 'nizak').length,
  };

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Prompt Status',
    verzija: APP_VERSION,

    pregled: {
      ukupnoPromptova: promptovi.length,
      kategorija: kategorije.length,
      poPrioritetu,
    },

    poKategoriji,

    promptovi: promptovi.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      kategorija: p.kategorija,
      prioritet: p.prioritet,
      spajaProVerzija: p.spajaProVerzija,
      tagovi: p.tagovi,
    })),

    timestamp: new Date().toISOString(),
  });
}
