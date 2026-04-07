import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';

export async function GET() {
  const procesori = [
    { naziv: 'FP-Alpha', fotona: 10000000, talasna: '850nm', brzina: '300 THz', status: 'aktivan' },
    { naziv: 'FP-Beta', fotona: 50000000, talasna: '1550nm', brzina: '1 PHz', status: 'aktivan' },
    { naziv: 'FP-OMEGA', fotona: 1000000000, talasna: 'varijabilna', brzina: '∞', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Fotonski Procesor — Photonic Computing Engine',
    verzija: APP_VERSION,

    fotonskiProcesor: {
      ukupnoProcesora: procesori.length,
      ukupnoFotona: procesori.reduce((sum, p) => sum + p.fotona, 0),
      arhitektura: 'Mach-Zehnder interferometri + OMEGA-Photonic',
      prednost: 'Brzina svetlosti, 0 zagrevanja',
      procesori,
    },

    ekosistem: {
      apiEndpointi: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
    },

    timestamp: new Date().toISOString(),
  });
}
