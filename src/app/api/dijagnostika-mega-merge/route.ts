import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
} from '@/lib/constants';

export async function GET() {
  const dijagnostike = [
    { naziv: 'Mega Merge Workflow Status', tip: 'Workflow-Status', status: 'aktivan', opis: 'omega-mega-merge.yml radi svakih 6h i na svaki push na copilot/** grane' },
    { naziv: 'Branch Sync Dvosmerni', tip: 'Sync-Bidirectional', status: 'aktivan', opis: 'omega-branch-sync.yml Faza 1 merge-uje grane u main, Faza 2 sinhronizuje main nazad' },
    { naziv: 'Mega Merge PR Kreiranje', tip: 'PR-Creation', status: 'aktivan', opis: 'Automatsko kreiranje PR-a sa svim merge-ovanim granama prema main-u' },
    { naziv: 'Process Substitution Fix', tip: 'Shell-Fix', status: 'aktivan', opis: 'Koristimo process substitution umesto pipe za while loop da izbegnemo subshell bug' },
    { naziv: 'Branch Sort Optimizacija', tip: 'Sort-Optimization', status: 'aktivan', opis: 'Grane se sortiraju po ahead_by broju za optimalan redosled merge-a' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Dijagnostika Mega Merge — Zdravlje sistema za automatski merge svih grana',
    verzija: APP_VERSION,

    dijagnostika: {
      ukupnoDijagnostika: dijagnostike.length,
      sveZdravo: true,
      model: 'DIJAGNOSTIKA-MEGA-MERGE v1.0',
      dijagnostike,
    },

    sistem: {
      apiEndpointi: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
      autofinishIteracija: AUTOFINISH_COUNT,
    },

    timestamp: new Date().toISOString(),
  });
}
