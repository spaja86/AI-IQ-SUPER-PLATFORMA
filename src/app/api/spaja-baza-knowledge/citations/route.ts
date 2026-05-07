import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, verifyUserFromToken } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
  }

  const body = (await request.json()) as { citationIds?: string[] };
  const citationIds = Array.isArray(body.citationIds) ? body.citationIds.filter(Boolean) : [];

  if (citationIds.length === 0) {
    return NextResponse.json({ error: 'Prosledite citationIds niz.' }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('knowledge_citations')
    .select('id, query, source_url, title, score, used_in_response, created_at')
    .in('id', citationIds)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Greška pri dohvatanju citata.' }, { status: 500 });
  }

  return NextResponse.json({
    sistem: 'SPAJA BAZA Citations',
    citations: data ?? [],
    total: data?.length ?? 0,
    timestamp: new Date().toISOString(),
  });
}

