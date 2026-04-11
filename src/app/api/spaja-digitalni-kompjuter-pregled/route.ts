import { NextResponse } from 'next/server';
import {
  spajaDigitalniKompjuterSistem,
  getSveKomponente,
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
  const sistem = spajaDigitalniKompjuterSistem;
  const sveKomponente = getSveKomponente();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Digitalni Kompjuter — Pregled',
    verzija: APP_VERSION,

    pregled: {
      ukupnoKomponenti: sistem.statistika.ukupnoKomponenti,
      aktivnihKomponenti: sistem.statistika.aktivnihKomponenti,
      ukupnoKompjutera: sistem.statistika.ukupnoKompjutera,
      ukupnoKonzola: sistem.statistika.ukupnoKonzola,

      komponente: sveKomponente.map((k) => ({
        id: k.id,
        naziv: k.naziv,
        ikona: k.ikona,
        status: k.status,
        mogucnosti: k.mogucnosti,
        link: k.link,
        generatorLink: k.generatorLink,
      })),

      konzole: spajaKonzole.map((k) => ({
        id: k.id,
        naziv: k.naziv,
        tip: k.tip,
        ikona: k.ikona,
        status: k.status,
        mogucnosti: k.mogucnosti,
        link: k.link,
        dzojsticiLink: k.dzojsticiLink,
      })),

      dzojstici: {
        id: spajaDzojstici.id,
        naziv: spajaDzojstici.naziv,
        ikona: spajaDzojstici.ikona,
        status: spajaDzojstici.status,
        mogucnosti: spajaDzojstici.mogucnosti,
        link: spajaDzojstici.link,
      },
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
