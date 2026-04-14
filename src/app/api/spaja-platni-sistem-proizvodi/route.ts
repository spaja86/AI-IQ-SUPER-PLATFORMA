import { NextResponse } from 'next/server';
import { stripeProizvodi } from '@/lib/spaja-platni-sistem';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Platni Sistem — Proizvodi',
    verzija: APP_VERSION,
    ukupnoProizvoda: stripeProizvodi.length,
    proizvodi: stripeProizvodi,
    timestamp: new Date().toISOString(),
  });
}
