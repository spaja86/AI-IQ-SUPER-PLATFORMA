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
    { naziv: 'Neutronsko Imploziono Jezgro', tip: 'Neutron-Implosion-Core', status: 'aktivan' },
    { naziv: 'Degenerativni Materijalni Kompresor', tip: 'Degenerate-Matter-Compressor', status: 'aktivan' },
    { naziv: 'Neutronski Gustinski Modulator', tip: 'Neutron-Density-Modulator', status: 'aktivan' },
    { naziv: 'Gravitacioni Kolapsni Regulator', tip: 'Gravitational-Collapse-Regulator', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'MEGA Neutronski Imploder — Neutron Implosion Engine',
    verzija: APP_VERSION,

    neutronskiImploder: {
      ukupnoModula: moduli.length,
      model: 'MEGA-NIE v1.0',
      snaga: '10⁵⁰ neutronskih implozija/s',
      domet: '-∞Ω+∞ neutronski radijus',
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
