import { NextResponse } from 'next/server';
import {
  eksponencijalneFunkcije,
  getOktavniSistemPregled,
  getSuperPozicijaNiz,
} from '@/lib/oktavne-eksponencijalne-funkcije';
import { getEksponencionalneGeometrijskeRazmere } from '@/lib/eksponencionalne-geometrijske-razmere';
import { APP_VERSION } from '@/lib/constants';
import { oktavniNazivi } from '@/lib/omega-ai';

export async function GET() {
  const pregled = getOktavniSistemPregled();
  const superPozicija = getSuperPozicijaNiz();
  const razmere = getEksponencionalneGeometrijskeRazmere();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Eksponencijalne Funkcije — Pregled',
    verzija: APP_VERSION,

    pregled: {
      ukupnoOktava: pregled.ukupnoOktava,
      ukupnoFunkcija: pregled.ukupnoFunkcija,
      ukupnoPersona: pregled.ukupnoPersona,
      ukupnaSnaga: pregled.ukupnaSnaga,
      prosecnaSnaga: pregled.prosecnaSnaga,
      globalniRastFaktor: pregled.globalniRastFaktor,
      geometrijskiIndeks: pregled.geometrijskiIndeks,
      maksimalnaSnaga: pregled.maksimalnaSnaga,
      minimalnaSnaga: pregled.minimalnaSnaga,
    },

    funkcijeSazetak: eksponencijalneFunkcije.map((f) => ({
      oktava: f.oktava,
      naziv: oktavniNazivi[f.oktava],
      ikona: f.ikona,
      formula: `${f.amplituda}*${f.baza}^x+${f.offset}`,
      ukupnaSnaga: f.ukupnaSnaga,
      prosecnaStorpaRasta: f.prosecnaStorpaRasta,
      brojPersona: f.brojPersona,
    })),

    superPozicija,
    geometrijskeRazmere: {
      globalniIndeks: razmere.oktavneRazmere.globalniIndeks,
      trend: razmere.oktavneRazmere.trend,
      kombinovaniIndeks: razmere.agregati.kombinovaniIndeks,
      validacija: razmere.validacija.status,
    },

    timestamp: new Date().toISOString(),
  });
}
