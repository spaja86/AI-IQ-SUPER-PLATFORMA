import { NextResponse } from 'next/server';
import {
  mobilneCentrale,
  mobilniServisi,
  spajaMobilnaMreza,
  getAktivneCentrale,
  getSviPozivniBrojevi,
} from '@/lib/mobilna-mreza';
import { APP_VERSION, MOBILNE_CENTRALE, MOBILNI_POZIVNI } from '@/lib/constants';

export async function GET() {
  const aktivne = getAktivneCentrale();
  const pozivni = getSviPozivniBrojevi();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Mobilna Mreža Pregled — Kompletna Mobilna Infrastruktura',
    verzija: APP_VERSION,

    pregled: {
      ukupnoCentrala: MOBILNE_CENTRALE,
      aktivnih: aktivne.length,
      servisa: mobilniServisi.length,
      pozivnihBrojeva: pozivni.length,
    },

    mreza: {
      naziv: spajaMobilnaMreza.naziv,
      ukupniKapacitet: spajaMobilnaMreza.ukupniKapacitet,
      proksiIntegracija: spajaMobilnaMreza.proksiIntegracija,
    },

    centrale: mobilneCentrale.map((c) => ({
      id: c.id,
      naziv: c.naziv,
      ikona: c.ikona,
      zona: c.zona,
      pozivniBroj: c.pozivniBroj,
      status: c.status,
    })),

    pozivniBrojevi: MOBILNI_POZIVNI,

    servisiPoKategoriji: [...new Set(mobilniServisi.map((s) => s.kategorija))].map((kat) => ({
      kategorija: kat,
      broj: mobilniServisi.filter((s) => s.kategorija === kat).length,
    })),

    timestamp: new Date().toISOString(),
  });
}
