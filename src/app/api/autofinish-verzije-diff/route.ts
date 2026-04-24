// Autofinish #949 — GET /api/autofinish-verzije-diff
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća listu autofinish iteracija između dvije verzije platforme.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishVerzijeDiff } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-verzije-diff?v1=X&v2=Y
 *
 * @query v1 - Polazna verzija (npr. "44.51.0")
 * @query v2 - Krajnja verzija (npr. "44.61.0")
 * @returns AutofinishVerzijeDiffResult | 400
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/autofinish-verzije-diff'),
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
  const v1 = searchParams.get('v1');
  const v2 = searchParams.get('v2');

  if (!v1 || !v2) {
    return NextResponse.json(
      {
        error: 'INVALID_PARAMS',
        poruka: 'Obavezni query parametri: v1 i v2 (verzija u formatu X.Y.Z)',
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

  // Basic semver pattern validation
  const semverRe = /^\d+\.\d+\.\d+$/;
  if (!semverRe.test(v1) || !semverRe.test(v2)) {
    return NextResponse.json(
      {
        error: 'INVALID_PARAMS',
        poruka: 'Parametri v1 i v2 moraju biti u formatu X.Y.Z (npr. 44.61.0)',
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

  const result = getAutofinishVerzijeDiff(v1, v2);

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
