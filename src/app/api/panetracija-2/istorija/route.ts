// Panetracija 2 — GET /api/panetracija-2/istorija
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća istoriju poslednjih 10 scan sesija iz in-memory ring-buffer-a.
// Zahteva: ΩClearanceLevel.ADMIN, scope: panetracija2:read

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getScanHistory } from '@/lib/panetracija-2';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/panetracija-2/istorija'), 60, 60);
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

  const istorija = getScanHistory();

  return NextResponse.json(
    {
      status: 'ok',
      ukupno: istorija.length,
      istorija,
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
    },
  );
}
