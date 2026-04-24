// Autofinish #887 — GET /api/autofinish-verzije
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća summary svih verzija platforme sa aktuelnom verzijom.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishVerzijeSummary } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-verzije
 *
 * @returns AutofinishVerzijeSummaryResult — aktuelnaVerzija, lista verzija
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-verzije'), 60, 60);
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

  const summary = getAutofinishVerzijeSummary();

  return NextResponse.json(summary, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
