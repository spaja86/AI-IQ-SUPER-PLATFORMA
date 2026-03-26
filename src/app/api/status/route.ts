import { NextResponse } from 'next/server';
import { getEcosystemStats } from '@/lib/stats';
import { runQuickDiagnostics } from '@/lib/auto-repair/diagnostics';

export async function GET() {
  const stats = getEcosystemStats();
  const quickDiag = runQuickDiagnostics();

  return NextResponse.json({
    status: 'operational',
    version: '4.2.0',
    platform: 'AI IQ SUPER PLATFORMA',
    owner: 'Kompanija SPAJA',
    stats,
    autoRepair: {
      enabled: true,
      healthScore: quickDiag.score,
      overallStatus: quickDiag.overallStatus,
    },
    timestamp: new Date().toISOString(),
  });
}
