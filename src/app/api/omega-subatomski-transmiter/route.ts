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
    { naziv: 'Subatomsko Transmisiono Jezgro', tip: 'Subatomic-Transmission-Core', status: 'aktivan' },
    { naziv: 'Kvarkni Emiter', tip: 'Quark-Emitter', status: 'aktivan' },
    { naziv: 'Leptonski Modulator', tip: 'Lepton-Modulator', status: 'aktivan' },
    { naziv: 'Gluonski Fazni Analizator', tip: 'Gluon-Phase-Analyzer', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OMEGA Subatomski Transmiter — Subatomic Transmission Engine',
    verzija: APP_VERSION,

    subatomskiTransmiter: {
      ukupnoModula: moduli.length,
      model: 'OMEGA-STE v1.0',
      snaga: '10⁴³ subatomskih transmisija/s',
      domet: '-∞Ω+∞ subatomski radijus',
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
