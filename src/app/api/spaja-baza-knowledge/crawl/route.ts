import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { ingestKnowledgeUrls } from '@/lib/spaja-baza-knowledge';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('knowledge_crawl_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: 'Greška pri dohvatanju crawl job-ova.' }, { status: 500 });
  }

  return NextResponse.json({
    sistem: 'SPAJA BAZA Crawl Jobs',
    jobs: data ?? [],
    ukupno: data?.length ?? 0,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
  }

  const body = (await request.json()) as { urls?: string[] };
  const urls = Array.isArray(body.urls) ? body.urls.filter((u) => typeof u === 'string' && u.trim()) : [];

  if (urls.length === 0) {
    return NextResponse.json({ error: 'Morate proslediti bar jedan URL.' }, { status: 400 });
  }

  try {
    const result = await ingestKnowledgeUrls(urls, { userId: user.id });
    return NextResponse.json({
      status: 'uspesno',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Greška pri crawl procesu.' },
      { status: 500 },
    );
  }
}

