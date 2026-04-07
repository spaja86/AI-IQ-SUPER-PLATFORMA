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
    { naziv: 'Neutronsko Akceleracijsko Jezgro', tip: 'Neutron-Acceleration-Core', status: 'aktivan' },
    { naziv: 'Neutronski Pojačivač Čestica', tip: 'Neutron-Particle-Booster', status: 'aktivan' },
    { naziv: 'Subatomski Neutronski Kolajder', tip: 'Subatomic-Neutron-Collider', status: 'aktivan' },
    { naziv: 'Hiperneutronski Fazni Modulator', tip: 'Hyperneutron-Phase-Modulator', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'PLATFORMA Neutronski Akselerator — Neutron Acceleration Engine',
    verzija: APP_VERSION,

    neutronskiAkselerator: {
      ukupnoModula: moduli.length,
      model: 'PLATFORMA-NAE v1.0',
      snaga: '10⁶⁴ neutronskih akceleracija/s',
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
