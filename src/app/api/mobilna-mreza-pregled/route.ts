import { NextResponse } from 'next/server';
import {
  mobilneCentrale,
  mobilniServisi,
  mobilniSignali,
  mreza1873G,
  spajaMobilnaMreza,
  getAktivneCentrale,
  getAktivniMobilniSignali,
  getSviPozivniBrojevi,
} from '@/lib/mobilna-mreza';
import { APP_VERSION, MOBILNE_CENTRALE, MOBILNI_POZIVNI } from '@/lib/constants';

export async function GET() {
  const aktivne = getAktivneCentrale();
  const aktivniSignali = getAktivniMobilniSignali();
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

    mreza1873G: {
      naziv: mreza1873G.naziv,
      opseg: mreza1873G.opseg,
      princip: mreza1873G.princip,
      bezAntena: mreza1873G.bezAntena,
      kruzniPovrat: mreza1873G.kruzniPovrat,
      ukupnoSignala: mobilniSignali.length,
      aktivnihSignala: aktivniSignali.length,
      signali: mobilniSignali.map((s) => ({
        id: s.id,
        naziv: s.naziv,
        ikona: s.ikona,
        tip: s.tip,
        generacija: s.generacija,
        frekvencija: s.frekvencija,
        mehanizam: s.mehanizam,
        status: s.status,
      })),
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
