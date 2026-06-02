// Pentracija — GET /api/pentracija
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća kompletan pentest izveštaj sa OWASP Top 10 nalazima i CVSS skorovima.
// Zahteva: ΩClearanceLevel.ADMIN

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildPentestReport } from '@/lib/pentracija';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/pentracija'), 60, 60);
  if (!allowed) {
    return NextResponse.json(
      { error: 'TOO_MANY_REQUESTS', verzija: APP_VERSION, autofinishIteracija: AUTOFINISH_COUNT, timestamp: new Date().toISOString() },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const report = buildPentestReport();
  return NextResponse.json(report, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
