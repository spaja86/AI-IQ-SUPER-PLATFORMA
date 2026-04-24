// Autofinish #861 — GET /api/autofinish-status-extended
// Kompanija SPAJA — Digitalna Industrija
//
// Objedinjeni status endpoint: dijagnostika + changelog + middleware informacije.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getAutofinishHealthSummary,
  getLastNIterations,
} from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-status-extended
 *
 * @returns { verzija, autofinishIteracija, dijagnostika, changelog, middleware, timestamp }
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-status-extended'), 60, 60);
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

  const zdravlje = getAutofinishHealthSummary();
  const changelog = getLastNIterations(10);
  const requestId = req.headers.get('x-request-id') ?? req.headers.get('x-correlation-id') ?? null;

  return NextResponse.json(
    {
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      dijagnostika: {
        zdravlje: zdravlje.zdravlje,
        ukupnoProvera: zdravlje.ukupnoProvera,
        uspesnih: zdravlje.uspesnih,
        status: zdravlje.status,
      },
      changelog: {
        ukupno: changelog.length,
        stavke: changelog,
      },
      middleware: {
        xRequestIdPropagacija: requestId !== null,
        requestId,
        xAppVersion: APP_VERSION,
        xAutofinishIteracija: AUTOFINISH_COUNT,
      },
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
    },
  );
}
