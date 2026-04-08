import { NextResponse } from 'next/server';
import {
  ioOpenUIAOGamingPlatforma,
  gamingStatistika,
  gamingKonfiguracija,
  getAktivneIgriceSaEndzinom,
} from '@/lib/io-openui-ao-gaming-platforma';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const aktivne = getAktivneIgriceSaEndzinom();

  return NextResponse.json({
    sistem: 'IO/OPENUI/AO Gaming Platforma Status',
    verzija: ioOpenUIAOGamingPlatforma.verzija,
    appVerzija: APP_VERSION,
    status: gamingKonfiguracija.aktivan ? 'aktivan' : 'neaktivan',
    platformaUrl: gamingStatistika.platformaUrl,
    platformaDomen: gamingStatistika.platformaDomen,
    ukupnoIgrica: gamingStatistika.ukupnoIgrica,
    aktivnihIgrica: aktivne.length,
    prevucenoEndžinom: gamingStatistika.prevucenoEndžinom,
    prosecnaOptimizacija: gamingStatistika.prosecnaOptimizacija,
    ukupnoKategorija: gamingStatistika.ukupnoKategorija,
    timestamp: new Date().toISOString(),
  });
}
