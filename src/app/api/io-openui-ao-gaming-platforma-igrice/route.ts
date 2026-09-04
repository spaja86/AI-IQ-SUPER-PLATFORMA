import { NextResponse } from 'next/server';
import {
  endzinNadIgricama,
  getGamingDomenSnapshot,
} from '@/lib/io-openui-ao-gaming-platforma';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const snapshot = getGamingDomenSnapshot();

  return NextResponse.json({
    sistem: 'IO/OPENUI/AO Gaming Platforma — Igrice',
    appVerzija: APP_VERSION,
    ...snapshot,
    ukupnoIgrica: endzinNadIgricama.length,
    poKategoriji: snapshot.statistika.poKategoriji,
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
