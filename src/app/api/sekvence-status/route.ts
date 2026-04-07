import { NextResponse } from 'next/server';
import * as sekvence from '@/lib/sekvence';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const sviExporti = Object.keys(sekvence);
  const tipovi = [...new Set(sviExporti.map((k) => k.replace('Sekvence', '')))];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Sekvence Status',
    verzija: APP_VERSION,

    pregled: {
      ukupnoSekvenci: sviExporti.length,
      tipovi: tipovi.length,
      fajlova: 27,
    },

    sekvence: sviExporti.map((naziv) => ({
      naziv,
      tip: naziv.replace('Sekvence', ''),
      status: 'aktivan',
    })),

    kategorije: {
      stranice: sviExporti.filter((s) => s.includes('page') || s.includes('Page')).length,
      sistemi: sviExporti.filter((s) => s.includes('proksi') || s.includes('omega') || s.includes('mobilna')).length,
      ostalo: sviExporti.filter((s) => !s.includes('page') && !s.includes('Page') && !s.includes('proksi') && !s.includes('omega') && !s.includes('mobilna')).length,
    },

    timestamp: new Date().toISOString(),
  });
}
