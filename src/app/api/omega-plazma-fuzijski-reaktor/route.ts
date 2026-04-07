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
  const komore = [
    { naziv: 'Tokamak-OMEGA', tip: 'Magnetno zatvaranje', temperatura: '10⁸ K', status: 'aktivan' },
    { naziv: 'Stellarator-SPAJA', tip: 'Helikoidno polje', temperatura: '2×10⁸ K', status: 'aktivan' },
    { naziv: 'Inerticijalni-Core', tip: 'Laserska kompresija', temperatura: '5×10⁸ K', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OMEGA Plazma Fuzijski Reaktor — Fusion Energy Core',
    verzija: APP_VERSION,

    plazmaFuzija: {
      ukupnoKomora: komore.length,
      model: 'OMEGA-PFR v1.0',
      energetskiIzlaz: '10²⁴ W — neograničena energija',
      efikasnost: '99.97% — gotovo savršena konverzija',
      komore,
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
