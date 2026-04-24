// Autofinish #973 — GET /api/autofinish-verzija-iteracije
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća sve autofinish iteracije za zadanu app verziju.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishIteracijePoVerziji, getAutofinishVerzijeSummary } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-verzija-iteracije?verzija=X
 *
 * @query verzija - App verzija string, npr. "44.81.0" (obavezan)
 * @returns AutofinishIteracijePoVerzijiResult | 400 | 429
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/autofinish-verzija-iteracije'),
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
  const targetVerzija = searchParams.get('verzija') ?? '';

  if (!targetVerzija) {
    const summary = getAutofinishVerzijeSummary();
    const validneVerzije = summary.milestones.map((m) => m.verzija);
    return NextResponse.json(
      {
        error: 'INVALID_PARAMS',
        poruka: `Parametar 'verzija' je obavezan. Dostupne verzije: ${validneVerzije.slice(-5).join(', ')} ...`,
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

  const result = getAutofinishIteracijePoVerziji(targetVerzija);

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
