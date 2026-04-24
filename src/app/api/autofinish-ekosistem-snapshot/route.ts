// Autofinish #865 — GET /api/autofinish-ekosistem-snapshot
// Kompanija SPAJA — Digitalna Industrija
//
// JSON snapshot svih ekosistem metrika (rute, API, igrice, OMEGA AI, itd.)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishEkosistemSnapshot } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-ekosistem-snapshot
 *
 * @returns AutofinishEkosistemSnapshot — sve ekosistem metrike
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-ekosistem-snapshot'), 60, 60);
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

  const snapshot = getAutofinishEkosistemSnapshot();

  return NextResponse.json(snapshot, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
