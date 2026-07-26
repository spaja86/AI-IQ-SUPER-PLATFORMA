import { NextResponse } from 'next/server';
import { runDiagnostics, runRepair } from '@/lib/auto-repair';

export async function GET() {
  const report = runDiagnostics();
  return NextResponse.json(report);
}

export async function POST() {
  const report = runDiagnostics();
  const repairs = runRepair(report.provere);
  return NextResponse.json({
    status: 'completed',
    zdravlje: report.zdravlje,
    popravke: repairs,
    timestamp: new Date().toISOString(),
  });
}
