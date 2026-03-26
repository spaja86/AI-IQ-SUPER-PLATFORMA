import { NextResponse } from 'next/server';
import { runQuickDiagnostics } from '@/lib/auto-repair/diagnostics';

export async function GET() {
  const quickDiag = runQuickDiagnostics();

  return NextResponse.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      bank: 'operational',
      exchange: 'operational',
      ai: 'operational',
      company: 'operational',
      omega: 'operational',
      autoRepair: 'operational',
    },
    autoRepair: {
      score: quickDiag.score,
      overallStatus: quickDiag.overallStatus,
      checksRun: quickDiag.summary.total,
      passed: quickDiag.summary.passed,
      failed: quickDiag.summary.failed,
    },
  });
}
