import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';
import { protokolManager } from '@/lib/protokoli/manager';

export async function GET() {
  const protokolProvere = protokolManager
    .getAll()
    .filter((protokol) => protokol.izvor === 'autofinish-protokol-verifikacija')
    .map((protokol) => ({
      naziv: protokol.naziv,
      tip: protokol.id,
      status: protokol.status,
      opis: protokol.opis,
    }));
  const sveUspesne = protokolProvere.every((protokol) => protokol.status === 'aktivan');

  const procenat = (AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100;

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Autofinish Protokol Verifikacija — Verifikacija komunikacionih protokola',
    verzija: APP_VERSION,

    protokolVerifikacija: {
      ukupnoProvera: protokolProvere.length,
      sveUspesne,
      model: 'AUTOFINISH-PROTOKOL-VERIFIKACIJA v1.0',
      provere: protokolProvere,
    },

    progres: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3x10^17',
      procenat: procenat.toExponential(2),
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
