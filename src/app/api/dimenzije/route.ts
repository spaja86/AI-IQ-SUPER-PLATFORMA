import { NextResponse } from 'next/server';
import { dimenzije } from '@/lib/dimenzije';

export async function GET() {
  return NextResponse.json({
    ukupno: dimenzije.length,
    nivoi: dimenzije.map((d) => d.nivo),
    dimenzije: dimenzije.map((d) => ({
      id: d.id,
      naziv: d.naziv,
      nivo: d.nivo,
      opis: d.opis,
      ikona: d.ikona,
    })),
    timestamp: new Date().toISOString(),
  });
}
