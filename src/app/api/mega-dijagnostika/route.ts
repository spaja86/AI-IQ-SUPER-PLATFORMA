import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  APP_NAME,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_PAGES,
  TOTAL_IGRICA,
  OMEGA_AI_PERSONA_COUNT,
  AUTOFINISH_COUNT,
} from '@/lib/constants';
import { runDiagnostics } from '@/lib/auto-repair/diagnostics';

export async function GET() {
  const rezultat = runDiagnostics();

  const poStatusu = {
    ok: rezultat.provere.filter((p) => p.status === 'ok').length,
    warning: rezultat.provere.filter((p) => p.status === 'warning').length,
    error: rezultat.provere.filter((p) => p.status === 'error').length,
    critical: rezultat.provere.filter((p) => p.status === 'critical').length,
  };

  const kategorije = rezultat.provere.reduce(
    (acc, p) => {
      const kat = p.id.split('-')[0];
      acc[kat] = (acc[kat] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Mega Dijagnostika — Agregirani Dashboard',
    verzija: APP_VERSION,
    platforma: APP_NAME,

    pregled: {
      ukupnoProvera: TOTAL_DIAGNOSTIKA,
      stvarnoProvera: rezultat.ukupnoProvera,
      ocenaZdravlja: rezultat.zdravlje,
      poStatusu,
    },

    kategorije,

    sistemInfo: {
      stranice: TOTAL_PAGES,
      apiEndpointa: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      igrice: TOTAL_IGRICA,
      omegaPersone: OMEGA_AI_PERSONA_COUNT,
      autofinish: AUTOFINISH_COUNT,
    },

    topProvere: rezultat.provere.slice(0, 10).map((p) => ({
      id: p.id,
      naziv: p.naziv,
      status: p.status,
    })),

    timestamp: new Date().toISOString(),
  });
}
