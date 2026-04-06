import { NextResponse } from 'next/server';
import { runDiagnostics } from '@/lib/auto-repair';
import { getStatistike } from '@/lib/statistika';
import { companies } from '@/lib/companies';
import { organizations } from '@/lib/organizations';
import { products } from '@/lib/products';
import { sajtovi } from '@/lib/sajtovi';
import { spajaProVerzije } from '@/lib/spaja-pro';
import { proksiSignali, proksiCvorovi } from '@/lib/proksi';
import {
  APP_VERSION,
  APP_NAME,
  KOMPANIJA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_PAGES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_IGRICA,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
  SPAJA_PRO_VERZIJA_COUNT,
  PROKSI_KAPACITET,
  MOBILNE_CENTRALE,
} from '@/lib/constants';

export async function GET() {
  const dijagnostika = runDiagnostics();
  const stats = getStatistike();

  return NextResponse.json({
    status: 'aktivan',
    naziv: `${APP_NAME} — Full Ecosystem v11.0.0`,
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,

    zdravlje: {
      procenat: dijagnostika.zdravlje,
      ukupnoProvera: dijagnostika.ukupnoProvera,
      uspesnih: dijagnostika.uspesnih,
    },

    ekosistem: {
      stranice: TOTAL_PAGES,
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
      igrice: TOTAL_IGRICA,
      platforme: stats.ukupnoPlatformi,
      omegaAI: OMEGA_AI_PERSONA_COUNT,
      oktave: OMEGA_AI_OKTAVA_COUNT,
      spajaProVerzije: SPAJA_PRO_VERZIJA_COUNT,
      proksiKapacitet: PROKSI_KAPACITET,
      mobilneCentrale: MOBILNE_CENTRALE,
    },

    entiteti: {
      kompanije: companies.length,
      organizacije: organizations.length,
      proizvodi: products.length,
      sajtovi: sajtovi.length,
      spajaProVerzije: spajaProVerzije.length,
      proksiSignali: proksiSignali.length,
      proksiCvorovi: proksiCvorovi.length,
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
    },

    moduli: [
      { naziv: 'Platforme', broj: stats.ukupnoPlatformi, status: 'aktivan' },
      { naziv: 'Igrice', broj: TOTAL_IGRICA, status: 'aktivan' },
      { naziv: 'OMEGA AI', broj: OMEGA_AI_PERSONA_COUNT, status: 'aktivan' },
      { naziv: 'SpajaPro', broj: SPAJA_PRO_VERZIJA_COUNT, status: 'aktivan' },
      { naziv: 'Proksi', broj: proksiSignali.length, status: 'aktivan' },
      { naziv: 'Kompanije', broj: companies.length, status: 'aktivan' },
      { naziv: 'Organizacije', broj: organizations.length, status: 'aktivan' },
      { naziv: 'Proizvodi', broj: products.length, status: 'aktivan' },
      { naziv: 'Sajtovi', broj: sajtovi.length, status: 'aktivan' },
      { naziv: 'Dijagnostike', broj: TOTAL_DIAGNOSTIKA, status: 'aktivan' },
      { naziv: 'API Rute', broj: TOTAL_API_ROUTES, status: 'aktivan' },
      { naziv: 'Stranice', broj: TOTAL_PAGES, status: 'aktivan' },
      { naziv: 'Mobilna Mreža', broj: MOBILNE_CENTRALE, status: 'aktivan' },
      { naziv: 'Autofinish', broj: AUTOFINISH_COUNT, status: 'aktivan' },
    ],

    timestamp: new Date().toISOString(),
  });
}
