import { NextResponse } from 'next/server';
import {
  spajaDigitalniKompjuterSistem,
  getSveKomponente,
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
    naziv: 'SPAJA Digitalni Kompjuter — Kompletni digitalni kompjuter sa svim komponentama',
    verzija: APP_VERSION,

    kompjuter: {
      ukupnoKomponenti: sistem.statistika.ukupnoKomponenti,
      aktivnihKomponenti: sistem.statistika.aktivnihKomponenti,
      ukupnoKompjutera: sistem.statistika.ukupnoKompjutera,
      ukupnoKonzola: sistem.statistika.ukupnoKonzola,
      generatorLink: sistem.generatorLink,

      kompjuteri: sistem.kompjuteri.map((k) => ({
        naziv: k.naziv,
        tip: k.tip,
        opis: k.opis,
        ukupnoKomponenti: k.komponente.length + 1,
        monitoring: k.monitoringKomponenta.naziv,
      })),

      komponente: sveKomponente.map((k) => ({
        id: k.id,
        naziv: k.naziv,
        ikona: k.ikona,
        status: k.status,
        link: k.link,
      })),

      konzole: sistem.konzole.map((k) => ({
        id: k.id,
        naziv: k.naziv,
        tip: k.tip,
        ikona: k.ikona,
        status: k.status,
        link: k.link,
        dzojsticiLink: k.dzojsticiLink,
      })),

      dzojstici: {
        id: sistem.dzojstici.id,
        naziv: sistem.dzojstici.naziv,
        ikona: sistem.dzojstici.ikona,
        status: sistem.dzojstici.status,
        link: sistem.dzojstici.link,
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
