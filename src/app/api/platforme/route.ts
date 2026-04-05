import { NextResponse } from 'next/server';
import { platforme, getUkupniProgres, getBrojAktivnih } from '@/lib/platforme';

export async function GET() {
  return NextResponse.json({
    ukupno: platforme.length,
    aktivnih: getBrojAktivnih(),
    ukupniProgres: getUkupniProgres(),
    platforme: platforme.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      opis: p.opis,
      kategorija: p.kategorija,
      status: p.status,
      progres: p.progres,
      ikona: p.ikona,
      tehnologije: p.tehnologije,
      deploy: p.deploy.status,
    })),
    timestamp: new Date().toISOString(),
  });
}
