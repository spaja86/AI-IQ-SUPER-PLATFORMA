import { NextResponse } from 'next/server';
import { mobilneCentrale, mobilniServisi } from '@/lib/mobilna-mreza';
import { MOBILNE_CENTRALE, MOBILNI_POZIVNI } from '@/lib/constants';

export async function GET() {
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
    infrastruktura: {
      proksiIntegracija: 'potpuna',
      eklipticnaVez: true,
      kapacitet: MOBILNE_CENTRALE,
    },
    timestamp: new Date().toISOString(),
  });
}
