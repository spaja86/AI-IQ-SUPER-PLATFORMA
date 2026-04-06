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
  const energetskiIzvori = [
    { izvor: 'Solar Array', kapacitet: '500 MW', efikasnost: '98%', tip: 'obnovljivi', status: 'aktivan' },
    { izvor: 'Fusion Reactor', kapacitet: '10 GW', efikasnost: '99.5%', tip: 'fuzija', status: 'aktivan' },
    { izvor: 'SPAJA-Grid', kapacitet: '1 TW', efikasnost: '99.99%', tip: 'SPAJA-hibrid', status: 'aktivan' },
    { izvor: 'OMEGA-ZPE', kapacitet: '∞ PW', efikasnost: '100%', tip: 'zero-point', status: 'aktivan' },
  ];

  const metrike = {
    ukupnoIzvora: energetskiIzvori.length,
    aktivnihIzvora: energetskiIzvori.filter((i) => i.status === 'aktivan').length,
    ukupniKapacitet: '∞+ PW',
    potrosnja: '0.001% kapaciteta',
    ugljicniOtisak: '0 g CO₂',
    energetskaKlasa: 'OMEGA-A+++',
  };

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Platforma Energetski Pregled — Energy Overview',
    verzija: APP_VERSION,

    energija: {
      ...metrike,
      izvori: energetskiIzvori,
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
