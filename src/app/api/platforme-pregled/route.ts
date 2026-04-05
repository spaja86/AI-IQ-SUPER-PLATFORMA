import { NextResponse } from 'next/server';
import { platforme, getUkupniProgres, getBrojAktivnih } from '@/lib/platforme';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const aktivnih = getBrojAktivnih();
  const progres = getUkupniProgres();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Platforme Pregled — Detaljni Pregled Svih 14 Platformi',
    verzija: APP_VERSION,

    pregled: {
      ukupno: platforme.length,
      aktivnih,
      progres: `${progres.toFixed(1)}%`,
      spremnih: platforme.filter((p) => p.status === 'spremna').length,
      uRazvoju: platforme.filter((p) => p.status === 'razvoj').length,
    },

    platforme: platforme.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      status: p.status,
      progres: p.progres,
      kategorija: p.kategorija,
    })),

    kategorije: [...new Set(platforme.map((p) => p.kategorija))].map((kat) => ({
      kategorija: kat,
      broj: platforme.filter((p) => p.kategorija === kat).length,
    })),

    timestamp: new Date().toISOString(),
  });
}
