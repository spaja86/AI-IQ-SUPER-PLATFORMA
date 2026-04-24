// Autofinish #943 — GET /api/autofinish-top-iteracije
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća top N poznatih autofinish iteracija, sortirano opadajuće po broju.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishTopIteracije } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-top-iteracije?n=N
 *
 * @query n - Broj iteracija za vraćanje (integer 1–200, default 10)
 * @returns AutofinishTopIteracijeResult | 400
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/autofinish-top-iteracije'),
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
  const nRaw = searchParams.get('n') ?? '10';
  const n = parseInt(nRaw, 10);

  if (isNaN(n) || n < 1) {
    return NextResponse.json(
      {
        error: 'INVALID_PARAMS',
        poruka: 'Parametar n mora biti pozitivan celi broj (default: 10)',
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

  if (n > 200) {
    return NextResponse.json(
      {
        error: 'N_PREVELIK',
        poruka: 'Maksimalna vrednost parametra n je 200',
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

  const result = getAutofinishTopIteracije(n);

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
