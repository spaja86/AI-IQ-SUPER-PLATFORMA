import { NextResponse } from 'next/server';
import { mobilneCentrale, mobilniServisi, mobilniSignali, mreza1873G, getAktivniMobilniSignali } from '@/lib/mobilna-mreza';
import { MOBILNE_CENTRALE, MOBILNI_POZIVNI } from '@/lib/constants';

export async function GET() {
  const aktivniSignali = getAktivniMobilniSignali();

  return NextResponse.json({
    status: 'aktivna',
    naziv: 'SPAJA Mobilna Mreža',
    centrale: {
      ukupno: mobilneCentrale.length,
      pozivniBrojevi: MOBILNI_POZIVNI,
      lista: mobilneCentrale.map((c) => ({
        id: c.id,
        naziv: c.naziv,
        pozivniBroj: c.pozivniBroj,
        ikona: c.ikona,
      })),
    },
    servisi: {
      ukupno: mobilniServisi.length,
      lista: mobilniServisi.map((s) => ({
        id: s.id,
        naziv: s.naziv,
        ikona: s.ikona,
      })),
    },
    mreza1873G: {
      naziv: mreza1873G.naziv,
      opseg: mreza1873G.opseg,
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
        status: s.status,
      })),
    },
    infrastruktura: {
      proksiIntegracija: 'potpuna',
      eklipticnaVez: true,
      kapacitet: MOBILNE_CENTRALE,
    },
    timestamp: new Date().toISOString(),
  });
}
