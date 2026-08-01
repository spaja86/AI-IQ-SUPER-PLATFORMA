import { NextResponse } from 'next/server';
import { getKnowledgeIndexStatus, getKnowledgeStageBreakdown } from '@/lib/spaja-baza-knowledge';

export const runtime = 'nodejs';

/**
 * GET /api/spaja-baza-knowledge/index-status
 *
 * INDEKSIRANJE 5 — Stage Distribution Dashboard.
 * Vraća breakdown chunk-ova po indexing stupnju (v1/v2/v3/v4),
 * completionPct do ciljne verzije (v4), puni queue status
 * i INDEKSIRANJE 750 KPI signal.
 */
export async function GET() {
  const [status, stageBreakdown] = await Promise.all([
    getKnowledgeIndexStatus(),
    getKnowledgeStageBreakdown(),
  ]);

  return NextResponse.json({
    sistem: 'SPAJA BAZA Knowledge Index — Stage Distribution',
    stageBreakdown,
    queue: status.queue,
    jobs24h: status.jobs24h,
    indexing750: status.indexing750,
    timestamp: new Date().toISOString(),
  });
}
