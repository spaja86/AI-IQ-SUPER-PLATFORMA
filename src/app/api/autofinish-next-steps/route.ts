// Autofinish #917 — GET /api/autofinish-next-steps
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća narednih 5 planiranih koraka platforme.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishNextSteps } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-next-steps
 *
 * @returns AutofinishNextStepsResult — 5 koraka sa prioritetom, kategorijom, autofinishTarget
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-next-steps'), 60, 60);
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

  const nextSteps = getAutofinishNextSteps();

  return NextResponse.json(nextSteps, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
