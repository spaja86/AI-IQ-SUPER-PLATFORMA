import { NextResponse } from 'next/server';
import {
  endzinNadIgricama,
  getGamingDomenSnapshot,
  getAktivneIgriceSaEndzinom,
} from '@/lib/io-openui-ao-gaming-platforma';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const aktivne = getAktivneIgriceSaEndzinom();
  const snapshot = getGamingDomenSnapshot();

  return NextResponse.json({
    sistem: 'IO/OPENUI/AO Gaming Platforma — Pregled',
    appVerzija: APP_VERSION,
    ...snapshot,
    aktivneIgrice: aktivne.length,
    sveIgrice: endzinNadIgricama,
    timestamp: new Date().toISOString(),
  });
}
