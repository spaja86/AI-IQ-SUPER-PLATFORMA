import { NextResponse } from 'next/server';
import {
  spajaKonzole,
  spajaDzojstici,
} from '@/lib/spaja-digitalni-kompjuter';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Digitalni Kompjuter — Konzole i Dzojstici',
    opis: 'Dva tipa konzola sa dzojsticima — Univerzalna Virtuelna Konzola i Univerzalna Digitalna Konzola, obe pokretane od SPAJA Generator za Endzine',
    verzija: APP_VERSION,

    konzole: {
      ukupno: spajaKonzole.length,
      tipovi: spajaKonzole.map((k) => ({
        id: k.id,
        naziv: k.naziv,
        tip: k.tip,
        ikona: k.ikona,
        status: k.status,
        opis: k.opis,
        mogucnosti: k.mogucnosti,
        link: k.link,
        generatorLink: k.generatorLink,
        dzojsticiLink: k.dzojsticiLink,
      })),
    },

    dzojstici: {
      id: spajaDzojstici.id,
      naziv: spajaDzojstici.naziv,
      ikona: spajaDzojstici.ikona,
      status: spajaDzojstici.status,
      opis: spajaDzojstici.opis,
      mogucnosti: spajaDzojstici.mogucnosti,
      link: spajaDzojstici.link,
      generatorLink: spajaDzojstici.generatorLink,
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
