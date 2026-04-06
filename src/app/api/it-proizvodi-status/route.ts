import { NextResponse } from 'next/server';
import { itProizvodi, getProizvodiVisokogUticaja } from '@/lib/it-proizvodi';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const visokUticaj = getProizvodiVisokogUticaja();

  const kategorije = [...new Set(itProizvodi.map((p) => p.kategorija))];
  const poKategoriji = kategorije.map((kat) => ({
    kategorija: kat,
    brojProizvoda: itProizvodi.filter((p) => p.kategorija === kat).length,
  }));

  const poUticaju = {
    visok: itProizvodi.filter((p) => p.uticaj === 'visok').length,
    srednji: itProizvodi.filter((p) => p.uticaj === 'srednji').length,
    nizak: itProizvodi.filter((p) => p.uticaj === 'nizak').length,
  };

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'IT Proizvodi Status',
    verzija: APP_VERSION,

    pregled: {
      ukupnoProizvoda: itProizvodi.length,
      visokogUticaja: visokUticaj.length,
      kategorija: kategorije.length,
      poUticaju,
    },

    poKategoriji,

    proizvodi: itProizvodi.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      kategorija: p.kategorija,
      uticaj: p.uticaj,
      funkcija: p.funkcije.length,
    })),

    timestamp: new Date().toISOString(),
  });
}
