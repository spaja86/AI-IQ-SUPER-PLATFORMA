// Panetracija 2 — GET /api/panetracija-2/status
// Kompanija SPAJA — Digitalna Industrija
//
// Brzi V2 status endpoint — prikazuje stanje platforme i poslednjeg skena.
// Zahteva: ΩClearanceLevel.ADMIN, scope: panetracija2:read

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPentestSummaryV2 } from '@/lib/panetracija-2';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/panetracija-2/status'), 60, 60);
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

  const summary = getPentestSummaryV2();
  return NextResponse.json(
    {
      status: 'ready' as const,
      ...summary,
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
    },
  );
}
