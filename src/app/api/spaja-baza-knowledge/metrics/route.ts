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
      .select('id, latency_ms, quality_score, citations_count, retrieval_index_version, semantic_retrieval_used')
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
  const citationCoverageRate =
    rows.length === 0 ? 0 : rows.reduce((sum, row) => sum + (row.citations_count > 0 ? 1 : 0), 0) / rows.length;
  const averageLatency =
    latencyRows.length === 0
      ? 0
      : Math.round(latencyRows.reduce((sum, row) => sum + row.latency_ms, 0) / latencyRows.length);
  const averageQuality =
    qualityRows.length === 0
      ? 0
      : Number((qualityRows.reduce((sum, row) => sum + row.quality_score, 0) / qualityRows.length).toFixed(3));
  const retrievalByVersion = rows.reduce((acc, row) => {
    const version = row.retrieval_index_version ?? 'v1';
    acc[version] = (acc[version] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const semanticUsageRate =
    rows.length === 0
      ? 0
      : Number((rows.reduce((sum, row) => sum + (row.semantic_retrieval_used ? 1 : 0), 0) / rows.length).toFixed(3));

  return NextResponse.json({
    sistem: 'SPAJA BAZA Knowledge Metrics',
    health,
    metrics24h: {
      retrievalCount: rows.length,
      citationRate: Number(citationCoverageRate.toFixed(3)),
      averageLatencyMs: averageLatency,
      averageQualityScore: averageQuality,
      retrievalByVersion,
      semanticUsageRate,
    },
    timestamp: new Date().toISOString(),
  });
}
