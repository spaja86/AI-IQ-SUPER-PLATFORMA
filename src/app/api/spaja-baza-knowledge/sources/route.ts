import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, verifyUserFromToken } from '@/lib/supabase/server';
import { canonicalizeUrl, isUrlAllowed } from '@/lib/spaja-baza-knowledge';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('knowledge_sources')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: 'Greška pri dohvatanju izvora.' }, { status: 500 });
  }

  return NextResponse.json({
    sistem: 'SPAJA BAZA Knowledge Sources',
    sources: data ?? [],
    ukupno: data?.length ?? 0,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
    url?: string;
    trustScore?: number;
    language?: string;
    category?: string;
  };

  const sourceUrl = body.url?.trim();
  if (!sourceUrl) {
    return NextResponse.json({ error: 'URL izvora je obavezan.' }, { status: 400 });
  }

  let canonical: string;
  try {
    canonical = canonicalizeUrl(sourceUrl);
  } catch {
    return NextResponse.json({ error: 'Neispravan URL.' }, { status: 400 });
  }

  if (!isUrlAllowed(canonical)) {
    return NextResponse.json(
      { error: 'URL nije dozvoljen po SPAJA BAZA ingest politici (allowlist/denylist).' },
      { status: 400 },
    );
  }

  const supabase = getSupabaseServerClient();
  const domain = new URL(canonical).hostname.toLowerCase();

  const { data, error } = await supabase
    .from('knowledge_sources')
    .upsert(
      {
        name: body.name?.trim() || domain,
        source_url: canonical,
        domain,
        category: body.category?.trim() || 'web',
        status: 'active',
        ingest_mode: 'manual',
        robots_policy_status: 'allowed',
        tos_policy_status: 'allowed',
        trust_score: Math.min(1, Math.max(0, body.trustScore ?? 0.7)),
        language: body.language?.trim() || 'sr',
        created_by: user.id,
      },
      { onConflict: 'source_url' },
    )
    .select('*')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Greška pri upisu izvora.' }, { status: 500 });
  }

  return NextResponse.json({
    status: 'uspesno',
    source: data,
    timestamp: new Date().toISOString(),
  });
}

