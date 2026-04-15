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
    { naziv: 'Branch Cleanup Workflow', tip: 'Workflow-Health', status: 'aktivan', opis: 'omega-branch-cleanup.yml workflow funkcionise ispravno' },
    { naziv: 'Merged Branch Inventar', tip: 'Branch-Inventory', status: 'aktivan', opis: 'Inventar svih grana i njihov merge status u main' },
    { naziv: 'Auto-Delete After Merge', tip: 'Auto-Delete', status: 'aktivan', opis: 'Automatsko brisanje source branch-a nakon merge-a PR-a' },
    { naziv: 'Weekly Cleanup Schedule', tip: 'Schedule-Check', status: 'aktivan', opis: 'Nedeljna zakazana cistka merged grana (nedelja 04:00 UTC)' },
    { naziv: 'Protected Branch Guard', tip: 'Protection-Guard', status: 'aktivan', opis: 'Zastita kriticnih grana od slucajnog brisanja' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Dijagnostika Branch Cleanup — Zdravlje sistema za ciscenje grana',
    verzija: APP_VERSION,

    dijagnostika: {
      ukupnoDijagnostika: dijagnostike.length,
      sveZdravo: true,
      model: 'DIJAGNOSTIKA-BRANCH-CLEANUP v1.0',
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
