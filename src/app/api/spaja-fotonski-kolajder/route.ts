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
    { naziv: 'Fotonsko Kolajdersko Jezgro', tip: 'Photon-Collider-Core', status: 'aktivan' },
    { naziv: 'Svetlosni Akcelerator', tip: 'Light-Accelerator', status: 'aktivan' },
    { naziv: 'Fotonski Spektralni Deflektor', tip: 'Photon-Spectral-Deflector', status: 'aktivan' },
    { naziv: 'Laserski Rekombinator', tip: 'Laser-Recombinator', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Fotonski Kolajder — Photon Collider Engine',
    verzija: APP_VERSION,

    fotonskiKolajder: {
      ukupnoModula: moduli.length,
      model: 'SPAJA-PCE v1.0',
      snaga: '10⁵² fotonskih kolizija/s',
      domet: '-∞Ω+∞ fotonski radijus',
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
