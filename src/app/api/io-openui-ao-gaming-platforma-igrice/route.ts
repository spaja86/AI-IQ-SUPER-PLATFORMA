import { NextResponse } from 'next/server';
import {
  endzinNadIgricama,
  gamingStatistika,
} from '@/lib/io-openui-ao-gaming-platforma';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'IO/OPENUI/AO Gaming Platforma — Igrice',
    appVerzija: APP_VERSION,
    ukupnoIgrica: endzinNadIgricama.length,
    poKategoriji: gamingStatistika.poKategoriji,
    igrice: endzinNadIgricama.map((e) => ({
      id: e.igricaId,
      naziv: e.igricaNaziv,
      ikona: e.igricaIkona,
      kategorija: e.igricaKategorija,
      status: e.igricaStatus,
      endzinStatus: e.endzinStatus,
      prevucen: e.prevucen,
      optimizacija: e.optimizacija,
    })),
    timestamp: new Date().toISOString(),
  });
}
