import { NextResponse } from 'next/server';
import { dimenzije, getTVKanaliKrozDimenzije, getTVKrozDimenzijePregled } from '@/lib/dimenzije';

export async function GET() {
  const tvKrozDimenzije = getTVKanaliKrozDimenzije();
  const tvPregled = getTVKrozDimenzijePregled();
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
    tvKrozDimenzije: {
      pregled: tvPregled,
      kanali: tvKrozDimenzije,
    },
    timestamp: new Date().toISOString(),
  });
}
