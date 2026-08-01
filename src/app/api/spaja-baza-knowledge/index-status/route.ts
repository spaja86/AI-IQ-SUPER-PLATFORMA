import { NextResponse } from 'next/server';
import { getKnowledgeIndexStatus, getKnowledgeStageBreakdown } from '@/lib/spaja-baza-knowledge';

export const runtime = 'nodejs';

/**
 * GET /api/spaja-baza-knowledge/index-status
 *
 * INDEKSIRANJE 5 — Stage Distribution Dashboard.
 * Vraća breakdown chunk-ova po indexing stupnju (v1/v2/v3/v4),
 * completionPct do ciljne verzije (v4), i puni queue status.
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
    timestamp: new Date().toISOString(),
  });
}
