import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getKnowledgeHealth } from '@/lib/spaja-baza-knowledge';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = getSupabaseServerClient();
  const health = await getKnowledgeHealth();
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [retrievals, avgLatency, avgQuality, personalizationStats] = await Promise.all([
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
    // v2/v3 personalization adoption metrics from profiles
    supabase
      .from('profiles')
      .select('personalization_version, personalization_enabled, personalization_opt_out, personalization_confidence, personalization_v3_score'),
  ]);

  const rows = retrievals.data ?? [];
  const latencyRows = avgLatency.data ?? [];
  const qualityRows = avgQuality.data ?? [];
  const profileRows = personalizationStats.data ?? [];

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

  // ── Personalization v2/v3 metrics ────────────────────────────────────
  const totalProfiles = profileRows.length;
  const v2AdoptionCount = profileRows.filter((r) => r.personalization_version === 'v2').length;
  const v3AdoptionCount = profileRows.filter((r) => r.personalization_version === 'v3').length;
  const optOutCount = profileRows.filter((r) => r.personalization_opt_out === true).length;
  const disabledCount = profileRows.filter((r) => r.personalization_enabled === false).length;
  const avgConfidence =
    totalProfiles === 0
      ? 0
      : Number(
          (
            profileRows.reduce((sum, r) => sum + (r.personalization_confidence ?? 0), 0) /
            totalProfiles
          ).toFixed(3),
        );
  const avgV3Score =
    v3AdoptionCount === 0
      ? 0
      : Number(
          (
            profileRows
              .filter((r) => r.personalization_version === 'v3')
              .reduce((sum, r) => sum + ((r as { personalization_v3_score?: number }).personalization_v3_score ?? 0), 0) /
              v3AdoptionCount
          ).toFixed(3),
        );

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
    personalizacijaV2: {
      totalProfiles,
      v2AdoptionCount,
      v2AdoptionRate: totalProfiles === 0 ? 0 : Number((v2AdoptionCount / totalProfiles).toFixed(3)),
      v3AdoptionCount,
      v3AdoptionRate: totalProfiles === 0 ? 0 : Number((v3AdoptionCount / totalProfiles).toFixed(3)),
      optOutCount,
      disabledCount,
      averageConfidence: avgConfidence,
      averageV3Score: avgV3Score,
    },
    timestamp: new Date().toISOString(),
  });
}

