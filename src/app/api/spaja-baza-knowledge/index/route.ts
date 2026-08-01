import { NextRequest, NextResponse } from 'next/server';
import { getKnowledgeIndexStatus, runKnowledgeIndexing } from '@/lib/spaja-baza-knowledge';
import { verifyUserFromToken } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
  const status = await getKnowledgeIndexStatus();
  return NextResponse.json({
    sistem: 'SPAJA BAZA Knowledge Index',
    status,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    batchSize?: number;
    maxBatches?: number;
    sourceId?: string;
    documentId?: string;
    forceReindex?: boolean;
    indexVersion?: 'v1' | 'v2' | 'v3' | 'v4';
    upgradeToV2?: boolean;
    upgradeToV3?: boolean;
    upgradeToV4?: boolean;
    /**
     * INDEKSIRANJE 5: Kada true, pokreće staged auto-promotion svakog stupnja
     * (v1→v2→v3→v4) redom, uz quality gates i cooldown između stupnjeva.
     */
    promoteAll?: boolean;
    /** Cooldown u ms između stupnjeva pri promoteAll (default: 500ms). */
    promoteCooldownMs?: number;
    /** INDEKSIRANJE 750 režim sa KPI evaluacijom i audit logom. */
    indeksiranje750?: boolean;
    /** KPI cilj completionPct za 750 režim (default: 75). */
    targetCompletionPct?: number;
    /** Prag degradacije completion delta u pp (default: 7.5). */
    degradationThresholdPct?: number;
    /** Bezbedno zaustavljanje 750 režima bez pokretanja promocije. */
    safeStop750?: boolean;
  };

  const result = await runKnowledgeIndexing({
    batchSize: body.batchSize,
    maxBatches: body.maxBatches,
    sourceId: body.sourceId?.trim() || null,
    documentId: body.documentId?.trim() || null,
    forceReindex: Boolean(body.forceReindex),
    triggerType: body.forceReindex ? 'reindex' : 'manual',
    requestedBy: user.id,
    indexVersion: body.indexVersion ?? 'v1',
    upgradeToV2: Boolean(body.upgradeToV2),
    upgradeToV3: Boolean(body.upgradeToV3),
    upgradeToV4: Boolean(body.upgradeToV4),
    promoteAll: Boolean(body.promoteAll),
    promoteCooldownMs: body.promoteCooldownMs,
    indeksiranje750: Boolean(body.indeksiranje750),
    targetCompletionPct: body.targetCompletionPct,
    degradationThresholdPct: body.degradationThresholdPct,
    safeStop: Boolean(body.safeStop750),
  });

  return NextResponse.json({
    status: 'uspesno',
    result,
    timestamp: new Date().toISOString(),
  });
}
