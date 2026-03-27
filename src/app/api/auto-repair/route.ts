import { NextResponse } from 'next/server';
import { runDiagnostics, runRepair } from '@/lib/auto-repair';

export async function GET() {
  const report = runDiagnostics();
  return NextResponse.json(report);
}

export async function POST() {
  const repairs = runRepair();
  return NextResponse.json({
    status: 'completed',
    popravke: repairs,
    timestamp: new Date().toISOString(),
  });
}
