// Autofinish #939 — GET /api/autofinish-podsistemi-zdravlje
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća zdravlje per-podsistem JSON.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishPodsistemiZdravlje } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-podsistemi-zdravlje
 *
 * @returns AutofinishPodsistemiZdravljeResult — per-podsistem zdravlje
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/autofinish-podsistemi-zdravlje'),
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

  const result = getAutofinishPodsistemiZdravlje();

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
