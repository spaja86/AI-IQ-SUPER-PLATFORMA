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
  const moduli = [
    { naziv: 'Plazmeni Generator', tip: 'Plasma-Generator', status: 'aktivan' },
    { naziv: 'Kondenzatorski Reflektor', tip: 'Condenser-Reflector', status: 'aktivan' },
    { naziv: 'Plazma-Energetsko Jezgro', tip: 'Plasma-Energy-Core', status: 'aktivan' },
    { naziv: 'Termički Regulator', tip: 'Thermal-Regulator', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OMEGA Plazmeni Kondenzator — Plasma Condensation Engine',
    verzija: APP_VERSION,

    plazmeniKondenzator: {
      ukupnoModula: moduli.length,
      model: 'OMEGA-PCE v1.0',
      snaga: '10²⁹ plazma jedinica/s',
      domet: '-∞Ω+∞ plazmeni radijus',
      moduli,
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
