import { NextResponse } from 'next/server';
import { runDiagnostics } from '@/lib/auto-repair/diagnostics';
import { APP_VERSION, TOTAL_DIAGNOSTIKA } from '@/lib/constants';

export async function GET() {
  const rezultat = runDiagnostics();

  const poStatusu = {
    ok: rezultat.provere.filter((p) => p.status === 'ok').length,
    warning: rezultat.provere.filter((p) => p.status === 'warning').length,
    error: rezultat.provere.filter((p) => p.status === 'error').length,
    critical: rezultat.provere.filter((p) => p.status === 'critical').length,
  };

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Full Dijagnostika Pregled — Kompletni Dijagnostički Izveštaj',
    verzija: APP_VERSION,

    pregled: {
      ukupnoProvera: TOTAL_DIAGNOSTIKA,
      stvarnoProvera: rezultat.ukupnoProvera,
      ocenaZdravlja: rezultat.zdravlje,
      poStatusu,
    },

    kategorije: rezultat.provere.reduce<Record<string, number>>((acc, p) => {
      const kat = p.id.split('-')[0];
      acc[kat] = (acc[kat] || 0) + 1;
      return acc;
    }, {}),

    poslednjihDeset: rezultat.provere.slice(-10).map((p) => ({
      id: p.id,
      naziv: p.naziv,
      status: p.status,
    })),

    timestamp: new Date().toISOString(),
  });
}
