// Autofinish #897 — GET /api/autofinish-meta
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća meta podaci platforme: naziv, kompanija, opis, baseUrl, techStack, endpoints.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishMetaInfo } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-meta
 *
 * @returns AutofinishMetaInfo — naziv, kompanija, opis, baseUrl, techStack, autofinishEndpoints
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-meta'), 60, 60);
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

  const meta = getAutofinishMetaInfo();

  return NextResponse.json(meta, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
