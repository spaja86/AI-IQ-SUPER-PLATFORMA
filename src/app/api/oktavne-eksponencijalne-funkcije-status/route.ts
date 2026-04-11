import { NextResponse } from 'next/server';
import {
  eksponencijalneFunkcije,
  getOktavniSistemPregled,
} from '@/lib/oktavne-eksponencijalne-funkcije';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const pregled = getOktavniSistemPregled();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Eksponencijalne Funkcije — Status',
    verzija: APP_VERSION,

    zdravlje: {
      ukupnoFunkcija: eksponencijalneFunkcije.length,
      sveAktivne: eksponencijalneFunkcije.length === 8,
      ukupnaSnaga: pregled.ukupnaSnaga,
      globalniRastFaktor: pregled.globalniRastFaktor,
    },

    oktave: eksponencijalneFunkcije.map((f) => ({
      oktava: f.oktava,
      ikona: f.ikona,
      status: 'aktivan',
      snaga: f.ukupnaSnaga,
      baza: f.baza,
      brojPersona: f.brojPersona,
    })),

    timestamp: new Date().toISOString(),
  });
}
