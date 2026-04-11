import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  brouvzerModuli,
  getAktivniModuli,
} from '@/lib/spaja-digitalni-brouvzer';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Digitalni Brouvzer — Moduli',
    verzija: APP_VERSION,
    ukupnoModula: brouvzerModuli.length,
    aktivnihModula: getAktivniModuli().length,
    moduli: brouvzerModuli.map((m) => ({
      id: m.id,
      naziv: m.naziv,
      opis: m.opis,
      ikona: m.ikona,
      status: m.status,
      verzija: m.verzija,
      mogucnosti: m.mogucnosti,
    })),
    timestamp: new Date().toISOString(),
  });
}
