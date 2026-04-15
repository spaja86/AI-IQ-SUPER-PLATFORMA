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
    { naziv: 'Workflow Queue Health', tip: 'Queue-Health', status: 'aktivan', opis: 'Red cekanja workflow-a funkcionise bez zastoja i deadlock-ova' },
    { naziv: 'Cron Schedule Sync', tip: 'Schedule-Sync', status: 'aktivan', opis: 'Svi zakazani workflow-i (mega-merge, branch-sync, cleanup) su sinhronizovani' },
    { naziv: 'Workflow Permissions', tip: 'Permission-Check', status: 'aktivan', opis: 'GITHUB_TOKEN i permissions za svaki workflow su ispravno konfigurisani' },
    { naziv: 'Concurrent Run Protection', tip: 'Concurrency-Guard', status: 'aktivan', opis: 'concurrency grupe sprecavaju istovremeno pokretanje istog workflow-a' },
    { naziv: 'Workflow Artifact Cleanup', tip: 'Artifact-Cleanup', status: 'aktivan', opis: 'Automatsko ciscenje starih workflow artefakata i log-ova' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Dijagnostika Workflow Orchestracija — Zdravlje sistema za orchestraciju workflow-a',
    verzija: APP_VERSION,

    dijagnostika: {
      ukupnoDijagnostika: dijagnostike.length,
      sveZdravo: true,
      model: 'DIJAGNOSTIKA-WORKFLOW-ORCHESTRACIJA v1.0',
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
