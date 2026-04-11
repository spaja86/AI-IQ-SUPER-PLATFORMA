import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';
import { EKOSISTEM_URLS, ekosistemPlatforme } from '@/lib/ekosistem-urls';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Ekosistem URL Registar — Centralni registar svih ekosistem URL-ova',
    verzija: APP_VERSION,

    ekosistemUrlovi: {
      ukupnoPlatformi: ekosistemPlatforme.length,
      platforme: ekosistemPlatforme.map((p) => ({
        naziv: p.naziv,
        url: p.url,
        ikona: p.ikona,
        opis: p.opis,
      })),
      registar: EKOSISTEM_URLS,
    },

    ekosistem: {
      apiEndpointi: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3x10^17',
    },

    timestamp: new Date().toISOString(),
  });
}
