// Pentracija — GET /api/pentracija/status
// Kompanija SPAJA — Digitalna Industrija
//
// Brzi status endpoint — prikazuje stanje poslednjeg skena.
// Zahteva: ΩClearanceLevel.ADMIN

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPentestSummary } from '@/lib/pentracija';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/pentracija/status'), 60, 60);
  if (!allowed) {
    return NextResponse.json(
      { error: 'TOO_MANY_REQUESTS', verzija: APP_VERSION, autofinishIteracija: AUTOFINISH_COUNT, timestamp: new Date().toISOString() },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const summary = getPentestSummary();

  return NextResponse.json(
    {
      status: 'ready' as const,
      lastScan: summary.timestamp,
      overallScore: summary.overallScore,
      ukupnoNalaza: summary.ukupnoNalaza,
      kritičnih: summary.kritičnih,
      verzija: APP_VERSION,
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
