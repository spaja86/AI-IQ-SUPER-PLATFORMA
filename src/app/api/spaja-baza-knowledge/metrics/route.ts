import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getKnowledgeHealth } from '@/lib/spaja-baza-knowledge';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = getSupabaseServerClient();
  const health = await getKnowledgeHealth();
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [retrievals, avgLatency, avgQuality] = await Promise.all([
    supabase
      .from('knowledge_retrieval_metrics')
      .select('id, latency_ms, quality_score, citations_count')
      .gte('created_at', since24h),
    supabase
      .from('knowledge_retrieval_metrics')
      .select('latency_ms')
      .gte('created_at', since24h)
      .limit(500),
    supabase
      .from('knowledge_retrieval_metrics')
      .select('quality_score')
      .gte('created_at', since24h)
      .limit(500),
  ]);

  const rows = retrievals.data ?? [];
  const latencyRows = avgLatency.data ?? [];
  const qualityRows = avgQuality.data ?? [];
  const citationRate =
    rows.length === 0 ? 0 : rows.reduce((sum, row) => sum + (row.citations_count > 0 ? 1 : 0), 0) / rows.length;
  const averageLatency =
    latencyRows.length === 0
      ? 0
      : Math.round(latencyRows.reduce((sum, row) => sum + row.latency_ms, 0) / latencyRows.length);
  const averageQuality =
    qualityRows.length === 0
      ? 0
      : Number((qualityRows.reduce((sum, row) => sum + row.quality_score, 0) / qualityRows.length).toFixed(3));

  return NextResponse.json({
    sistem: 'SPAJA BAZA Knowledge Metrics',
    health,
    metrics24h: {
      retrievalCount: rows.length,
      citationRate: Number(citationRate.toFixed(3)),
      averageLatencyMs: averageLatency,
      averageQualityScore: averageQuality,
    },
    timestamp: new Date().toISOString(),
  });
}

