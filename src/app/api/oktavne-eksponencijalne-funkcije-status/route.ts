import { NextResponse } from 'next/server';
import {
  eksponencijalneFunkcije,
  getOktavniSistemPregled,
} from '@/lib/oktavne-eksponencijalne-funkcije';
import { APP_VERSION } from '@/lib/constants';
import { getEksponencionalneGeometrijskeRazmere } from '@/lib/eksponencionalne-geometrijske-razmere';

export async function GET() {
  const pregled = getOktavniSistemPregled();
  const razmere = getEksponencionalneGeometrijskeRazmere();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Eksponencijalne Funkcije — Status',
    verzija: APP_VERSION,

    zdravlje: {
      ukupnoFunkcija: eksponencijalneFunkcije.length,
      sveAktivne: eksponencijalneFunkcije.length === pregled.ukupnoOktava,
      ukupnaSnaga: pregled.ukupnaSnaga,
      globalniRastFaktor: pregled.globalniRastFaktor,
      geometrijskiIndeks: pregled.geometrijskiIndeks,
      validacijaRazmera: razmere.validacija.status,
      kombinovaniIndeks: razmere.agregati.kombinovaniIndeks,
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
