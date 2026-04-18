import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  reklame,
  partnerstva,
  monetizacijaKanali,
  getReklameMetrike,
  getReklameSummary,
} from '@/lib/reklame-i-partnerstva';

export async function GET() {
  const metrike = getReklameMetrike();
  const summary = getReklameSummary();

  return NextResponse.json({
    naziv: 'Reklame & Partnerstva — Monetizacija Digitalne Industrije',
    verzija: APP_VERSION,
    status: 'aktivan',
    opis: 'Reklamni sistem za skaliranje i monetizaciju Digitalne Industrije sa partnerstvima iz svih branši.',

    metrike: {
      ukupnoReklama: metrike.ukupnoReklama,
      aktivnihReklama: metrike.aktivnihReklama,
      uPripremiReklama: metrike.uPripremiReklama,
      planiranihReklama: metrike.planiranihReklama,
      ukupnoPartnerstava: metrike.ukupnoPartnerstava,
      aktivnihPartnerstava: metrike.aktivnihPartnerstava,
      uPregovorima: metrike.uPregovorima,
      planiranihPartnerstava: metrike.planiranihPartnerstava,
      monetizacijaKanala: metrike.monetizacijaKanala,
      aktivnihKanala: metrike.aktivnihKanala,
    },

    summary: {
      reklamniStatus: summary.status,
      partnerstvaStatus: summary.partnerstvaStatus,
      monetizacijaStatus: summary.monetizacijaStatus,
    },

    reklame: reklame.map((r) => ({
      id: r.id,
      naziv: r.naziv,
      tip: r.tip,
      status: r.status,
      ciljnaPublika: r.ciljnaPublika,
      platforma: r.platforma,
      poruka: r.poruka,
      cta: r.cta,
      ocekivaniDoseg: r.ocekivaniDoseg,
    })),

    partnerstva: partnerstva.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      bransa: p.bransa,
      status: p.status,
      benefiti: p.benefiti,
      kontakt: p.kontakt,
    })),

    monetizacija: monetizacijaKanali.map((m) => ({
      id: m.id,
      naziv: m.naziv,
      kanal: m.kanal,
      mesecniPrihod: m.mesecniPrihod,
      status: m.status,
    })),

    timestamp: new Date().toISOString(),
  });
}
