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
  const procenat = (AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100;

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Autofinish Registracija Potvrda Lozinke - Iteracija #322',
    opis: 'Autofinish iteracija za dodavanje informativnog teksta za potvrdu lozinke na registraciji frontenda',
    verzija: APP_VERSION,

    iteracija: {
      broj: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      procenat: `${procenat.toFixed(20)}%`,
      opis: 'Registracija forma - potvrda lozinke informacija',
    },

    promene: {
      komponenta: 'RegistracijaForma.tsx',
      tip: 'UX poboljsanje',
      detalji: [
        'Dodat informativni tekst ispod polja za potvrdu lozinke',
        'Zeleni tekst kada se lozinke poklapaju',
        'Crveni tekst kada se lozinke ne poklapaju',
        'Sivi hint pre unosa potvrde',
      ],
    },

    ekosistem: {
      rute: TOTAL_ROUTES,
      apiRute: TOTAL_API_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
    },

    timestamp: new Date().toISOString(),
  });
}
