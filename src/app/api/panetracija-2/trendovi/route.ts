// Panetracija 2 — GET /api/panetracija-2/trendovi
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća trend pentest skora poslednjih N skenova (default: 5).
// Query param: ?n=1..10
// Zahteva: ΩClearanceLevel.ADMIN, scope: panetracija2:read

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPentestTrend } from '@/lib/panetracija-2';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/panetracija-2/trendovi'), 60, 60);
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

  const { searchParams } = new URL(req.url);
  const nRaw = searchParams.get('n');
  let n = 5;
  if (nRaw !== null) {
    const parsed = parseInt(nRaw, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) {
      n = parsed;
    } else {
      return NextResponse.json(
        {
          error: 'INVALID_N',
          poruka: 'Parametar n mora biti ceo broj od 1 do 10',
          verzija: APP_VERSION,
          timestamp: new Date().toISOString(),
        },
        { status: 400, headers: { 'X-App-Version': APP_VERSION } },
      );
    }
  }

  const trendovi = getPentestTrend(n);

  return NextResponse.json(
    {
      status: 'ok',
      n,
      trendovi,
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
    },
  );
}
