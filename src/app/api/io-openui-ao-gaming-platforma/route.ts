import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  endzinNadIgricama,
  getAktivneIgriceSaEndzinom,
  getGamingDomenSnapshot,
} from '@/lib/io-openui-ao-gaming-platforma';

export async function GET() {
  const aktivne = getAktivneIgriceSaEndzinom();
  const snapshot = getGamingDomenSnapshot();

  return NextResponse.json({
    sistem: 'IO/OPENUI/AO Gaming Platforma — SPAJA Univerzalni Endžin',
    appVerzija: APP_VERSION,
    ...snapshot,
    ukupnoIgrica: endzinNadIgricama.length,
    aktivnihIgrica: aktivne.length,
    sveIgrice: endzinNadIgricama,
    timestamp: new Date().toISOString(),
  });
}
