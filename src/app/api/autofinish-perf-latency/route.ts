// Autofinish #1051 — GET /api/autofinish-perf-latency
// Kompanija SPAJA — Digitalna Industrija

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishPerfLatency } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-perf-latency'), 60, 60);
  if (!allowed) {
    return NextResponse.json({ error: 'TOO_MANY_REQUESTS', verzija: APP_VERSION, autofinishIteracija: AUTOFINISH_COUNT, timestamp: new Date().toISOString() }, { status: 429, headers: { 'Retry-After': '60' } });
  }
  const result = getAutofinishPerfLatency();
  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
