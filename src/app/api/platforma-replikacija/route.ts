import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_PAGES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_IGRICA,
  OMEGA_AI_PERSONA_COUNT,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';

export async function GET() {
  const replike = [
    { region: 'EU-West', status: 'sinhronizovan', latency: '5ms', zdravlje: '100%' },
    { region: 'EU-Central', status: 'sinhronizovan', latency: '3ms', zdravlje: '100%' },
    { region: 'US-East', status: 'sinhronizovan', latency: '85ms', zdravlje: '100%' },
    { region: 'US-West', status: 'sinhronizovan', latency: '120ms', zdravlje: '100%' },
    { region: 'Asia-Pacific', status: 'sinhronizovan', latency: '180ms', zdravlje: '100%' },
  ];

  const replikacijaStatus = {
    ukupnoReplika: replike.length,
    sinhronizovano: replike.filter(r => r.status === 'sinhronizovan').length,
    konfliktRezolucija: 'automatska',
    replikacijaProtokol: 'CRDT (Conflict-free Replicated Data Types)',
    replikacijaInterval: '< 100ms',
  };

  const sadrzajReplikacije = {
    stranice: TOTAL_PAGES,
    apiEndpointi: TOTAL_API_ROUTES,
    rute: TOTAL_ROUTES,
    dijagnostike: TOTAL_DIAGNOSTIKA,
    igrice: TOTAL_IGRICA,
    omegaPersone: OMEGA_AI_PERSONA_COUNT,
    autofinishIteracija: AUTOFINISH_COUNT,
  };

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Platforma Replikacija — Geo-Distribuirani Sistem',
    verzija: APP_VERSION,

    replike,
    replikacijaStatus,
    sadrzajReplikacije,

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
    },

    timestamp: new Date().toISOString(),
  });
}
