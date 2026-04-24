// Autofinish #923 — GET /api/autofinish-milestone/[id]
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća detalje jednog roadmap milestone-a po ID-u.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishMilestoneDetail } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-milestone/[id]
 *
 * @param params.id - Slug naziv milestone-a
 * @returns AutofinishMilestoneDetailResult | 404
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, `/api/autofinish-milestone/${params.id}`),
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

  const detail = getAutofinishMilestoneDetail(params.id);

  if (!detail) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        id: params.id,
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      {
        status: 404,
        headers: {
          'X-App-Version': APP_VERSION,
          'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
        },
      },
    );
  }

  return NextResponse.json(detail, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
