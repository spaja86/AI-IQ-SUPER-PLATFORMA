import { NextResponse } from 'next/server';
import {
  itProizvodi,
  getProizvodiVisokogUticaja,
  getBrojPoKategoriji,
} from '@/lib/it-proizvodi';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const visokUticaj = getProizvodiVisokogUticaja();
  const poKategoriji = getBrojPoKategoriji();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'IT Proizvodi Pregled — Kompletni Katalog',
    verzija: APP_VERSION,

    pregled: {
      ukupnoProizvoda: itProizvodi.length,
      visokogUticaja: visokUticaj.length,
      kategorija: Object.keys(poKategoriji).length,
    },

    poKategoriji: Object.entries(poKategoriji).map(([kategorija, broj]) => ({
      kategorija,
      broj,
    })),

    proizvodi: itProizvodi.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      ikona: p.ikona,
      kategorija: p.kategorija,
      uticaj: p.uticaj,
    })),

    timestamp: new Date().toISOString(),
  });
}
