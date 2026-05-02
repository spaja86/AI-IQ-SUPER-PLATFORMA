// Autofinish #1121 — GET /api/autofinish-infrastruktura
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća pregled infrastrukturnih čvorova: CPU, RAM, disk, mreža, uptime po hostu.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishInfrastruktura } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-infrastruktura
 *
 * @returns AutofinishInfrastrukturaResult — pregled infrastrukturnih čvorova
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/autofinish-infrastruktura'),
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

  const infrastruktura = getAutofinishInfrastruktura();

  return NextResponse.json(infrastruktura, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
