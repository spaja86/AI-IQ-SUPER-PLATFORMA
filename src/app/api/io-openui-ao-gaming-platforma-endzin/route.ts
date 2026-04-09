import { NextResponse } from 'next/server';
import { endzinNadIgricama } from '@/lib/io-openui-ao-gaming-platforma';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'IO/OPENUI/AO Gaming Platforma — SPAJA Univerzalni Endžin',
    appVerzija: APP_VERSION,
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
