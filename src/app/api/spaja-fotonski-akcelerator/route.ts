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
    { naziv: 'Fotonski Emiter', tip: 'Photon-Emitter', status: 'aktivan' },
    { naziv: 'Akceleratorska Komora', tip: 'Accelerator-Chamber', status: 'aktivan' },
    { naziv: 'Svetlosni Kompresioni Jezgro', tip: 'Light-Compression-Core', status: 'aktivan' },
    { naziv: 'Energetski Reflektor', tip: 'Energy-Reflector', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Fotonski Akcelerator — Photonic Acceleration Engine',
    verzija: APP_VERSION,

    fotonskiAkcelerator: {
      ukupnoModula: moduli.length,
      model: 'SPAJA-PAE v1.0',
      brzina: '10²⁴ fotona/s',
      energija: '-∞Ω+∞ fotonska snaga',
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
