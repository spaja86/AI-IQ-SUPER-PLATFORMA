import { NextResponse } from 'next/server';
import {
  eksponencijalneFunkcije,
  getOktavniSistemPregled,
  getSuperPozicijaNiz,
  getKorelacionaMatrica,
} from '@/lib/oktavne-eksponencijalne-funkcije';
import { APP_VERSION } from '@/lib/constants';
import { oktavniNazivi } from '@/lib/omega-ai';

export async function GET() {
  const pregled = getOktavniSistemPregled();
  const superPozicija = getSuperPozicijaNiz();
  const korelacija = getKorelacionaMatrica();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Eksponencijalne Funkcije Oktavnog Sistema',
    opis: 'Matematicko modelovanje rasta kapaciteta OMEGA AI sistema — f(x) = a * b^x + c',
    verzija: APP_VERSION,

    pregled,

    funkcije: eksponencijalneFunkcije.map((f) => ({
      oktava: f.oktava,
      naziv: f.naziv,
      opis: f.opis,
      ikona: f.ikona,
      oktavaNaziv: oktavniNazivi[f.oktava],
      parametri: {
        amplituda: f.amplituda,
        baza: f.baza,
        offset: f.offset,
        formula: `${f.amplituda}*${f.baza}^x+${f.offset}`,
      },
      tabela: f.tabela,
      ukupnaSnaga: f.ukupnaSnaga,
      prosecnaStorpaRasta: f.prosecnaStorpaRasta,
      brojPersona: f.brojPersona,
    })),

    superPozicija,
    korelacionaMatrica: korelacija,

    timestamp: new Date().toISOString(),
  });
}
