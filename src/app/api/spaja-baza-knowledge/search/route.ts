import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledge } from '@/lib/spaja-baza-knowledge';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').trim();
  const limit = Number(searchParams.get('limit') ?? 5);

  if (!q) {
    return NextResponse.json({ error: 'Query parametar q je obavezan.' }, { status: 400 });
  }

  const results = await searchKnowledge(q, { limit: Number.isFinite(limit) ? limit : 5 });
  return NextResponse.json({
    sistem: 'SPAJA BAZA Search',
    query: q,
    total: results.length,
    results,
    timestamp: new Date().toISOString(),
  });
}

