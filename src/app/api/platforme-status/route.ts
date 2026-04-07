import { NextResponse } from 'next/server';
import { platforme, getUkupniProgres, getBrojAktivnih } from '@/lib/platforme';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const aktivne = getBrojAktivnih();
  const spremne = platforme.filter((p) => p.status === 'spremna').length;
  const uRazvoju = platforme.filter((p) => p.status === 'razvoj').length;

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Platforme Status',
    verzija: APP_VERSION,

    pregled: {
      ukupnoPlatformi: platforme.length,
      aktivnih: aktivne,
      spremnih: spremne,
      uRazvoju,
      ukupniProgres: getUkupniProgres(),
    },

    platforme: platforme.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      opis: p.opis,
      status: p.status,
      progres: p.progres,
      repo: p.repo,
    })),

    timestamp: new Date().toISOString(),
  });
}
