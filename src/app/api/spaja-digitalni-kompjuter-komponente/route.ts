import { NextResponse } from 'next/server';
import {
  getSveKomponente,
  getAktivneKomponente,
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
  const sve = getSveKomponente();
  const aktivne = getAktivneKomponente();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Digitalni Kompjuter — Komponente',
    opis: 'Detaljan pregled svih komponenti digitalnog kompjutera — maticna ploca, procesori, cipovi, BIOS, RAM, GPU, graficke, hard disk, tastatura i mis, monitoring',
    verzija: APP_VERSION,

    komponente: {
      ukupno: sve.length,
      aktivnih: aktivne.length,
      procenatAktivnih: Math.round((aktivne.length / sve.length) * 100),
      lista: sve.map((k) => ({
        id: k.id,
        naziv: k.naziv,
        ikona: k.ikona,
        status: k.status,
        opis: k.opis,
        mogucnosti: k.mogucnosti,
        link: k.link,
        generatorLink: k.generatorLink,
      })),
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
