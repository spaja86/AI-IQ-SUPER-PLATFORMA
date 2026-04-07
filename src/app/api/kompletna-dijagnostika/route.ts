import { NextResponse } from 'next/server';
import { runDiagnostics } from '@/lib/auto-repair/diagnostics';
import { APP_VERSION, TOTAL_DIAGNOSTIKA } from '@/lib/constants';

export async function GET() {
  const rezultat = runDiagnostics();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Kompletna Dijagnostika — Puni Dashboard',
    verzija: APP_VERSION,

    pregled: {
      ocekivano: TOTAL_DIAGNOSTIKA,
      ukupnoProvera: rezultat.ukupnoProvera,
      uspesnih: rezultat.uspesnih,
      upozorenja: rezultat.upozorenja,
      gresaka: rezultat.gresaka,
      kriticnih: rezultat.kriticnih,
      zdravlje: rezultat.zdravlje,
    },

    provere: rezultat.provere.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      status: p.status,
    })),

    timestamp: rezultat.timestamp,
  });
}
