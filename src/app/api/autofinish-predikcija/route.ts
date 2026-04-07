import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
} from '@/lib/constants';

export async function GET() {
  const brzina = AUTOFINISH_COUNT / 90; // normalizovano po realnom broju sesija
  const preostalo = AUTOFINISH_TARGET - AUTOFINISH_COUNT;

  const predikcije = [
    { iteracija: 100, procenaRuta: 140, procenaAPI: 108, procenaDijag: 109, verzija: '~v15.0.0' },
    { iteracija: 200, procenaRuta: 240, procenaAPI: 190, procenaDijag: 200, verzija: '~v24.0.0' },
    { iteracija: 500, procenaRuta: 540, procenaAPI: 430, procenaDijag: 500, verzija: '~v54.0.0' },
    { iteracija: 1000, procenaRuta: 1040, procenaAPI: 850, procenaDijag: 1000, verzija: '~v104.0.0' },
    { iteracija: 10000, procenaRuta: 10100, procenaAPI: 8400, procenaDijag: 10000, verzija: '~v1004.0.0' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Autofinish Predikcija — Projekcija Rasta',
    verzija: APP_VERSION,

    trenutno: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
      preostalo,
      preostaloFormatiran: `${preostalo.toExponential(2)}`,
      procenat: ((AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100).toExponential(2),
    },

    brzina: {
      rutaPoIteraciji: (TOTAL_ROUTES / AUTOFINISH_COUNT).toFixed(2),
      apiPoIteraciji: (TOTAL_API_ROUTES / AUTOFINISH_COUNT).toFixed(2),
      dijagnostikaPoIteraciji: (TOTAL_DIAGNOSTIKA / AUTOFINISH_COUNT).toFixed(2),
      normalizovanaBrzina: brzina.toFixed(2),
    },

    predikcije,

    timestamp: new Date().toISOString(),
  });
}
