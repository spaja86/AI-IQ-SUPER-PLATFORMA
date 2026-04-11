import { NextResponse } from 'next/server';
import { spajaPlatniSistem } from '@/lib/spaja-platni-sistem';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Platni Sistem — Status',
    verzija: APP_VERSION,
    status: spajaPlatniSistem.status,
    rezim: spajaPlatniSistem.konfiguracija.rezim,
    statistika: spajaPlatniSistem.statistika,
    ukupnoProizvoda: spajaPlatniSistem.stripeProizvodi.length,
    ukupnoMogucnosti: spajaPlatniSistem.mogucnosti.length,
    timestamp: new Date().toISOString(),
  });
}
