import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { demoSlucajevi, izracunajSlaIzvestaj, SLA_CILJEVI_SATI } from '@/lib/poslovni-tok';

export async function GET() {
  const izvestaji = demoSlucajevi.map((s) => izracunajSlaIzvestaj(s));

  const kriticni = izvestaji.filter((i) => i.eskalacioniNivo === 3);
  const upozorenje = izvestaji.filter((i) => i.eskalacioniNivo === 2);
  const ok = izvestaji.filter((i) => i.eskalacioniNivo === 1);

  const eskalacioniKanali = {
    nivo1: { kontakt: 'sales@spaja.rs', rok: '4h', opis: 'Standardni operativni alarm' },
    nivo2: { kontakt: 'business@spaja.rs', rok: '1h', opis: 'Eskalacija na poslovnog kontakta' },
    nivo3: { kontakt: 'billing@spaja.rs', rok: '30min', opis: 'Kritična eskalacija — billing + vlasnik' },
  };

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SLA Monitor — Poslovni Tok',
    verzija: APP_VERSION,
    slaTargetiSati: SLA_CILJEVI_SATI,
    eskalacioniKanali,
    summary: {
      ukupno: izvestaji.length,
      kriticnih: kriticni.length,
      upozorenja: upozorenje.length,
      ok: ok.length,
    },
    kriticni,
    upozorenja: upozorenje,
    bezPrekoracenja: ok,
    timestamp: new Date().toISOString(),
  });
}
