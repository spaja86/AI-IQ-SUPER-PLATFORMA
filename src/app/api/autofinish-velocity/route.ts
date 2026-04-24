// Autofinish #983 — GET /api/autofinish-velocity
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća prosječnu brzinu autofinish iteracija po danu/satu/sedmici.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishIterationsPerDay } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-velocity
 *
 * @returns AutofinishVelocityResult | 429
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/autofinish-velocity'),
    60,
    60,
  );
  if (!allowed) {
    return NextResponse.json(
      {
        error: 'TOO_MANY_REQUESTS',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const result = getAutofinishIterationsPerDay();

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
