import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';
import { getUkupnoAiPagePrompts, getUkupnoStranica } from '@/lib/ai-page-prompts';

export async function GET() {
  const procenat = (AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100;
  const ukupnoPromptova = getUkupnoAiPagePrompts();
  const ukupnoStranica = getUkupnoStranica();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Autofinish AI Asistent Pregled — Iteracija #324-325',
    opis: 'Pregled kompletnog AI asistent sistema sa svim preporukama po stranicama',
    verzija: APP_VERSION,

    iteracija: {
      broj: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      procenat: `${procenat.toFixed(20)}%`,
    },

    aiAsistentStatistika: {
      ukupnoStranica,
      ukupnoPromptova,
      prosecnoPoStranici: Math.round(ukupnoPromptova / ukupnoStranica * 10) / 10,
      kategorije: ['ai', 'spaja-pro-ai'],
      modovi: ['AI Preporuke', 'SpajaPro AI Preporuke'],
      widgetTip: 'Plutajuci AI asistent na svakoj stranici',
    },

    funkcionalnosti: [
      'Kontekstualni promptovi za svaku stranicu',
      'Dva moda: AI i SpajaPro AI preporuke',
      'Chat interfejs sa istorijom poruka',
      'Automatsko resetovanje pri promeni stranice',
      'Genericki promptovi za nekonfigurisane stranice',
      'SpajaPro Prompt Engine v15 integracija',
      'Pretraga ekosistema za relevantna pitanja',
      'Demo nalog za brzi pristup (demo@spaja.ai)',
    ],

    ekosistem: {
      rute: TOTAL_ROUTES,
      apiRute: TOTAL_API_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
    },

    timestamp: new Date().toISOString(),
  });
}
