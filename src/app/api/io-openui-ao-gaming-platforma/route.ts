import { NextResponse } from 'next/server';
import {
  ioOpenUIAOGamingPlatforma,
  endzinNadIgricama,
  gamingStatistika,
  gamingKonfiguracija,
  getAktivneIgriceSaEndzinom,
} from '@/lib/io-openui-ao-gaming-platforma';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const aktivne = getAktivneIgriceSaEndzinom();

  return NextResponse.json({
    sistem: 'IO/OPENUI/AO Gaming Platforma — SPAJA Univerzalni Endžin',
    verzija: ioOpenUIAOGamingPlatforma.verzija,
    appVerzija: APP_VERSION,
    opis: ioOpenUIAOGamingPlatforma.opis,
    link: ioOpenUIAOGamingPlatforma.link,
    generatorLink: ioOpenUIAOGamingPlatforma.generatorLink,
    konfiguracija: gamingKonfiguracija,
    ukupnoIgrica: endzinNadIgricama.length,
    aktivnihIgrica: aktivne.length,
    prevucenoEndžinom: gamingStatistika.prevucenoEndžinom,
    prosecnaOptimizacija: gamingStatistika.prosecnaOptimizacija,
    ukupnoKategorija: gamingStatistika.ukupnoKategorija,
    platformaUrl: gamingStatistika.platformaUrl,
    platformaDomen: gamingStatistika.platformaDomen,
    statistika: gamingStatistika,
    timestamp: new Date().toISOString(),
  });
}
