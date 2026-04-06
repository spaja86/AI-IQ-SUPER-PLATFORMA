import { NextResponse } from 'next/server';
import { runRepair } from '@/lib/auto-repair/repair-engine';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const akcije = runRepair();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Repair Pregled — Auto-Repair Engine',
    verzija: APP_VERSION,

    pregled: {
      ukupnoAkcija: akcije.length,
      zavrsenih: akcije.filter((a) => a.status === 'uspesno').length,
    },

    akcije: akcije.map((a) => ({
      id: a.id,
      naziv: a.naziv,
      status: a.status,
      opis: a.opis,
    })),

    timestamp: new Date().toISOString(),
  });
}
