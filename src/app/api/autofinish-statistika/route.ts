// Autofinish #893 — GET /api/autofinish-statistika
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća ukupne statistike platforme.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishStatistikaSummary } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-statistika
 *
 * @returns AutofinishStatistikaSummary — rute, apiRute, dijagnostike, igrice, omegaAi, spajaProVerzija
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-statistika'), 60, 60);
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

  const statistika = getAutofinishStatistikaSummary();

  return NextResponse.json(statistika, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
