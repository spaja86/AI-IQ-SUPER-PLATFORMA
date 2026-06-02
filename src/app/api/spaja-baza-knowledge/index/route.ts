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
  };

  const result = await runKnowledgeIndexing({
    batchSize: body.batchSize,
    maxBatches: body.maxBatches,
    sourceId: body.sourceId?.trim() || null,
    documentId: body.documentId?.trim() || null,
    forceReindex: Boolean(body.forceReindex),
    triggerType: body.forceReindex ? 'reindex' : 'manual',
    requestedBy: user.id,
  });

  return NextResponse.json({
    status: 'uspesno',
    result,
    timestamp: new Date().toISOString(),
  });
}
