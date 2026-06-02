// Pentracija — GET /api/pentracija/nalazi
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća filtrirani niz PentestFinding po severity nivou.
// Query param: ?severity=critical|high|medium|low|info
// Zahteva: ΩClearanceLevel.ADMIN

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPentestFindings } from '@/lib/pentracija';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/pentracija/nalazi'), 60, 60);
  if (!allowed) {
    return NextResponse.json(
      { error: 'TOO_MANY_REQUESTS', verzija: APP_VERSION, autofinishIteracija: AUTOFINISH_COUNT, timestamp: new Date().toISOString() },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const { searchParams } = new URL(req.url);
  const severity = searchParams.get('severity') ?? undefined;

  const VALID_SEVERITIES = ['info', 'low', 'medium', 'high', 'critical'];
  if (severity !== undefined && !VALID_SEVERITIES.includes(severity)) {
    return NextResponse.json(
      { error: 'INVALID_SEVERITY', dozvoljeni: VALID_SEVERITIES, verzija: APP_VERSION, timestamp: new Date().toISOString() },
      { status: 400, headers: { 'X-App-Version': APP_VERSION } },
    );
  }

  const nalazi = getPentestFindings(severity);

  return NextResponse.json(
    {
      status: 'ok',
      severity: severity ?? 'all',
      ukupno: nalazi.length,
      nalazi,
      verzija: APP_VERSION,
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
