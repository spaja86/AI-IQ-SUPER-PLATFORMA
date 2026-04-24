// Autofinish #879 — GET /api/autofinish-podsistemi
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća listu svih podsistema autofinish platforme sa detaljima.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishPodsistemiDetails } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-podsistemi
 *
 * @returns AutofinishPodsistemiDetailsResult — lista podsistema sa detaljima
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-podsistemi'), 60, 60);
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

  const detalji = getAutofinishPodsistemiDetails();

  return NextResponse.json(detalji, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
