import { NextResponse } from 'next/server';
import { spajaBaza } from '@/lib/spaja-baza';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA BAZA',
    verzija: APP_VERSION,
    baza: spajaBaza,
    kolekcije: spajaBaza.kolekcije,
    statistika: spajaBaza.statistika,
    mogucnosti: spajaBaza.mogucnosti,
    timestamp: new Date().toISOString(),
  });
}
