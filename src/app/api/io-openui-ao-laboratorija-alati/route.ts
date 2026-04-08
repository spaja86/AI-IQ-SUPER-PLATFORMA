import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { laboratorijskiAlati, getAlati } from '@/lib/io-openui-ao-laboratorija-simulacije';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    sistem: 'IOOpenUIAO Laboratorija — Alati',
    verzija: APP_VERSION,
    ukupnoAlata: laboratorijskiAlati.length,
    alati: getAlati().map((a) => ({
      id: a.id,
      naziv: a.naziv,
      opis: a.opis,
      ikona: a.ikona,
      tip: a.tip,
      mogucnosti: a.mogucnosti,
    })),
    timestamp: new Date().toISOString(),
  });
}
