import { NextResponse } from 'next/server';
import { bazaKolekcije, getAktivneKolekcije, getUkupnoDokumenata } from '@/lib/spaja-baza';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA BAZA — Kolekcije',
    verzija: APP_VERSION,
    ukupnoKolekcija: bazaKolekcije.length,
    aktivnihKolekcija: getAktivneKolekcije().length,
    ukupnoDokumenata: getUkupnoDokumenata(),
    kolekcije: bazaKolekcije,
    timestamp: new Date().toISOString(),
  });
}
