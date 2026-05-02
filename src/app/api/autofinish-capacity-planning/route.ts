// Autofinish #1109 — GET /api/autofinish-capacity-planning
// Kompanija SPAJA — Digitalna Industrija

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishCapacityPlanning } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-capacity-planning'), 60, 60);
  if (!allowed) {
    return NextResponse.json(
      { error: 'TOO_MANY_REQUESTS', verzija: APP_VERSION, autofinishIteracija: AUTOFINISH_COUNT, timestamp: new Date().toISOString() },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }
  const result = getAutofinishCapacityPlanning();
  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
