import { NextResponse } from 'next/server';
import {
  getGamingDomenSnapshot,
  getAktivneIgriceSaEndzinom,
} from '@/lib/io-openui-ao-gaming-platforma';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const aktivne = getAktivneIgriceSaEndzinom();
  const snapshot = getGamingDomenSnapshot();

  return NextResponse.json({
    sistem: 'IO/OPENUI/AO Gaming Platforma Status',
    appVerzija: APP_VERSION,
    ...snapshot,
    platformaUrl: snapshot.statistika.platformaUrl,
    platformaDomen: snapshot.statistika.platformaDomen,
    ukupnoIgrica: snapshot.statistika.ukupnoIgrica,
    aktivnihIgrica: aktivne.length,
    prevucenoEndžinom: snapshot.statistika.prevucenoEndžinom,
    prosecnaOptimizacija: snapshot.statistika.prosecnaOptimizacija,
    ukupnoKategorija: snapshot.statistika.ukupnoKategorija,
    timestamp: new Date().toISOString(),
  });
}
