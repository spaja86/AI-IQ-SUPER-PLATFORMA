import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import {
  reklame,
  partnerstva,
  monetizacijaKanali,
  getReklameMetrike,
  getPartnerstvaPoBransi,
} from '@/lib/reklame-i-partnerstva';

export async function GET() {
  const metrike = getReklameMetrike();
  const branse = getPartnerstvaPoBransi();

  const bransePregled = Array.from(branse.entries()).map(([bransa, lista]) => ({
    bransa,
    ukupno: lista.length,
    potpisano: lista.filter((p) => p.status === 'potpisano').length,
    uPregovorima: lista.filter((p) => p.status === 'u_pregovorima').length,
    planirano: lista.filter((p) => p.status === 'planirano').length,
    partneri: lista.map((p) => ({ naziv: p.naziv, ikona: p.ikona, status: p.status })),
  }));

  const reklameTipovi = Array.from(new Set(reklame.map((r) => r.tip)));
  const reklamePoTipu = reklameTipovi.map((tip) => ({
    tip,
    ukupno: reklame.filter((r) => r.tip === tip).length,
    aktivne: reklame.filter((r) => r.tip === tip && r.status === 'aktivna').length,
    kampanje: reklame.filter((r) => r.tip === tip).map((r) => ({
      naziv: r.naziv,
      ikona: r.ikona,
      status: r.status,
      doseg: r.ocekivaniDoseg,
    })),
  }));

  const monetizacijaPregled = monetizacijaKanali.map((m) => ({
    kanal: m.kanal,
    naziv: m.naziv,
    ikona: m.ikona,
    mesecniPrihod: m.mesecniPrihod,
    status: m.status,
  }));

  return NextResponse.json({
    naziv: 'Reklame & Partnerstva — Kompletni Pregled',
    verzija: APP_VERSION,
    status: 'aktivan',
    autofinishIteracija: AUTOFINISH_COUNT,

    pregled: {
      ukupnoReklama: metrike.ukupnoReklama,
      ukupnoPartnerstava: metrike.ukupnoPartnerstava,
      ukupnoKanala: metrike.monetizacijaKanala,
      ukupnoBransi: bransePregled.length,
      ukupnoTipovaReklama: reklameTipovi.length,
    },

    reklamePoTipu,
    partnerstvaPoTransi: bransePregled,
    monetizacijaPregled,

    dijagnostika: {
      reklamaIntegritet: metrike.ukupnoReklama >= 12 ? 'ok' : 'warning',
      partnerstvaIntegritet: metrike.ukupnoPartnerstava >= 15 ? 'ok' : 'warning',
      monetizacijaIntegritet: metrike.monetizacijaKanala >= 8 ? 'ok' : 'warning',
      aktivneKampanje: metrike.aktivnihReklama >= 7 ? 'ok' : 'warning',
      potpisanaPartnerstva: metrike.aktivnihPartnerstava >= 2 ? 'ok' : 'warning',
    },

    timestamp: new Date().toISOString(),
  });
}
