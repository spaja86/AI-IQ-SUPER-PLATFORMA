// Autofinish #854 — GET /api/autofinish-changelog
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća poslednjih N autofinish iteracija sa opisima.
// Query parametar: ?n=10 (default 10, max 100)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLastNIterations } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const DEFAULT_N = 10;
const MAX_N = 100;

/**
 * GET /api/autofinish-changelog
 *
 * @query n — broj iteracija za prikaz (default 10, max 100)
 * @returns { verzija, autofinishIteracija, ukupno, stavke[] }
 */
export async function GET(req: NextRequest) {
  // Rate limit: 60 zahteva u 60 sekundi po IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-changelog'), 60, 60);
  if (!allowed) {
    return NextResponse.json(
      {
        error: 'TOO_MANY_REQUESTS',
        poruka: 'Previše zahteva. Pokušajte za 60 sekundi.',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const { searchParams } = new URL(req.url);
  const n = Math.min(
    Math.max(parseInt(searchParams.get('n') ?? String(DEFAULT_N), 10) || DEFAULT_N, 1),
    MAX_N,
  );

  const stavke = getLastNIterations(n);

  return NextResponse.json(
    {
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      ukupno: stavke.length,
      n,
      stavke,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
    },
  );
}
