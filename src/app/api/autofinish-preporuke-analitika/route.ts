import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_PAGES,
  TOTAL_IGRICA,
} from '@/lib/constants';
import { getUkupnoAiPagePrompts, getUkupnoStranica } from '@/lib/ai-page-prompts';

export async function GET() {
  const procenat = (AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100;
  const ukupnoPromptova = getUkupnoAiPagePrompts();
  const ukupnoStranica = getUkupnoStranica();

  const analitika = {
    poKategoriji: {
      ai: Math.ceil(ukupnoPromptova / 2),
      'spaja-pro-ai': Math.floor(ukupnoPromptova / 2),
    },
    poTipu: {
      pitanja: ukupnoPromptova,
      kontekstualna: ukupnoStranica,
      genericka: 4,
    },
    poStranici: {
      minimum: 4,
      maksimum: 6,
      prosek: Math.round(ukupnoPromptova / ukupnoStranica * 10) / 10,
    },
  };

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Autofinish Preporuke Analitika — Iteracija #325',
    opis: 'Analitika svih AI i SpajaPro AI preporuka sa statistikom i pokrivenoscu',
    verzija: APP_VERSION,

    iteracija: {
      broj: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      procenat: `${procenat.toFixed(20)}%`,
    },

    analitika,

    pokrivenost: {
      ukupnoStranicaPlatforme: TOTAL_PAGES,
      stranicaSaPromptovima: ukupnoStranica,
      pokrivenostProcenat: `${((ukupnoStranica / TOTAL_PAGES) * 100).toFixed(1)}%`,
      ukupnoIgrica: TOTAL_IGRICA,
    },

    preporuke: [
      'Dodati vise promptova za gaming stranice',
      'Implementirati personalizovane preporuke po korisniku',
      'Dodati preporuke na osnovu istorije koristenja',
      'Kreirati AI preporuke za mobilnu mrezu stranicu',
      'Prosiriti preporuke za bezbednosne stranice',
      'Dodati SpajaPro AI preporuke za deployment',
      'Implementirati pametno rangiranje promptova',
      'Dodati preporuke za OMEGA AI stranice',
    ],

    ekosistem: {
      rute: TOTAL_ROUTES,
      apiRute: TOTAL_API_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
    },

    timestamp: new Date().toISOString(),
  });
}
