import { NextResponse } from 'next/server';
import {
  spajaMobilnaMreza,
  mobilneCentrale,
  mobilniServisi,
  mobilniSignali,
  mreza1873G,
  getAktivneCentrale,
  getAktivniMobilniSignali,
  getServisiPoKategoriji,
} from '@/lib/mobilna-mreza';
import { APP_VERSION, MOBILNE_CENTRALE, MOBILNI_POZIVNI } from '@/lib/constants';

export async function GET() {
  const aktivne = getAktivneCentrale();
  const aktivniSignali = getAktivniMobilniSignali();
  const glas = getServisiPoKategoriji('glas');
  const podaci = getServisiPoKategoriji('podaci');

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Mobilna Statistika — SPAJA Mobilna Mreža',
    verzija: APP_VERSION,

    pregled: {
      ukupnoCentrala: MOBILNE_CENTRALE,
      aktivnihCentrala: aktivne.length,
      pozivniBrojevi: MOBILNI_POZIVNI,
      ukupnoServisa: mobilniServisi.length,
      glasServisa: glas.length,
      podaciServisa: podaci.length,
      generacija: '1873G',
      ukupnoSignala: mobilniSignali.length,
      aktivnihSignala: aktivniSignali.length,
      mreza1873GOpseg: mreza1873G.opseg,
    },

    mreza: {
      naziv: spajaMobilnaMreza.naziv,
      opis: spajaMobilnaMreza.opis,
    },

    signali: mobilniSignali.map((s) => ({
      id: s.id,
      naziv: s.naziv,
      tip: s.tip,
      generacija: s.generacija,
      frekvencija: s.frekvencija,
      status: s.status,
    })),

    centrale: mobilneCentrale.map((c) => ({
      id: c.id,
      naziv: c.naziv,
      pozivniBroj: c.pozivniBroj,
      status: c.status,
    })),

    timestamp: new Date().toISOString(),
  });
}
