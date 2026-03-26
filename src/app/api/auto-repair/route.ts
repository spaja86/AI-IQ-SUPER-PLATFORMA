import { NextResponse } from 'next/server';
import { runDiagnostics } from '@/lib/auto-repair/diagnostics';
import { runRepairs } from '@/lib/auto-repair/repair-engine';
import { generateUpgradePlan } from '@/lib/auto-repair/upgrade-engine';

/**
 * GET /api/auto-repair — Pokreni dijagnostiku i vrati izveštaj
 */
export async function GET() {
  const diagnostic = runDiagnostics();
  const upgradePlan = generateUpgradePlan(diagnostic);

  return NextResponse.json({
    status: 'ok',
    diagnostic,
    upgradePlan,
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST /api/auto-repair — Pokreni auto-popravku
 */
export async function POST() {
  const diagnostic = runDiagnostics();
  const repair = runRepairs(diagnostic);
  const upgradePlan = generateUpgradePlan(diagnostic);

  return NextResponse.json({
    status: 'repaired',
    diagnostic,
    repair,
    upgradePlan,
    scoreBefore: diagnostic.score,
    scoreAfter: repair.newScore,
    timestamp: new Date().toISOString(),
  });
}
