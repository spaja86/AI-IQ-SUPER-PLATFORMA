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
    sistem: 'IO/OPENUI/AO Gaming Platforma — Pregled',
    verzija: ioOpenUIAOGamingPlatforma.verzija,
    appVerzija: APP_VERSION,
    platforma: {
      naziv: ioOpenUIAOGamingPlatforma.naziv,
      opis: ioOpenUIAOGamingPlatforma.opis,
      link: ioOpenUIAOGamingPlatforma.link,
      generatorLink: ioOpenUIAOGamingPlatforma.generatorLink,
    },
    konfiguracija: gamingKonfiguracija,
    statistika: gamingStatistika,
    aktivneIgrice: aktivne.length,
    sveIgrice: endzinNadIgricama,
    timestamp: new Date().toISOString(),
  });
}
