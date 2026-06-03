// Panetracija 2 — GET /api/panetracija-2
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća kompletan V2 pentest izveštaj sa proširenim nalazima, istorijom i trendom.
// Zahteva: ΩClearanceLevel.ADMIN, scope: panetracija2:read

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildPentestReportV2 } from '@/lib/panetracija-2';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/panetracija-2'), 60, 60);
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

  const report = buildPentestReportV2();
  return NextResponse.json(report, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
