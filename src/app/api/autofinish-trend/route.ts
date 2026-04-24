// Autofinish #959 — GET /api/autofinish-trend
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća rolling window trend za autofinish iteracije.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishIteracijeTrend } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-trend?window=N
 *
 * @query window - Veličina prozora (integer ≥ 1, default 10)
 * @returns AutofinishIteracijeTrendResult | 400 | 429
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/autofinish-trend'),
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

  const { searchParams } = new URL(req.url);
  const windowRaw = searchParams.get('window') ?? '10';
  const windowN = parseInt(windowRaw, 10);

  if (isNaN(windowN) || windowN < 1) {
    return NextResponse.json(
      {
        error: 'INVALID_PARAMS',
        poruka: 'Parametar window mora biti pozitivan celi broj (default: 10)',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      {
        status: 400,
        headers: {
          'X-App-Version': APP_VERSION,
          'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
        },
      },
    );
  }

  const result = getAutofinishIteracijeTrend(windowN);

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
