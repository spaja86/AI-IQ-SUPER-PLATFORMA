// Autofinish #871 — GET /api/autofinish-iteracija-opis
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća opis za konkretan broj autofinish iteracije.
// ?br=N — broj iteracije (pozitivan cijeli broj)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishIteracijaOpis } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-iteracija-opis?br=N
 *
 * @returns { verzija, autofinishIteracija, br, opis, timestamp }
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-iteracija-opis'), 120, 60);
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

  const brParam = req.nextUrl.searchParams.get('br');
  const br = parseInt(brParam ?? String(AUTOFINISH_COUNT), 10);
  const validBr = !isNaN(br) && br > 0 ? br : AUTOFINISH_COUNT;
  const opis = getAutofinishIteracijaOpis(validBr);

  return NextResponse.json(
    {
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      br: validBr,
      opis,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
    },
  );
}
