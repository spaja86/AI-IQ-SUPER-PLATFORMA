import { NextResponse } from 'next/server';
import {
  endzinNadIgricama,
  getGamingDomenSnapshot,
} from '@/lib/io-openui-ao-gaming-platforma';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const snapshot = getGamingDomenSnapshot();

  return NextResponse.json({
    sistem: 'IO/OPENUI/AO Gaming Platforma — SPAJA Univerzalni Endžin',
    appVerzija: APP_VERSION,
    ...snapshot,
    ukupnoPrevuceno: endzinNadIgricama.length,
    endzini: endzinNadIgricama.map((e) => ({
      endzinId: e.endzinId,
      endzinNaziv: e.endzinNaziv,
      endzinVerzija: e.endzinVerzija,
      endzinStatus: e.endzinStatus,
      igricaId: e.igricaId,
      igricaNaziv: e.igricaNaziv,
      prevucen: e.prevucen,
      optimizacija: e.optimizacija,
      mogucnosti: e.mogucnosti,
      datumPrevlacenja: e.datumPrevlacenja,
    })),
    timestamp: new Date().toISOString(),
  });
}
