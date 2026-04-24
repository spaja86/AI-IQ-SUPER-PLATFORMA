// Autofinish #869 — GET /api/autofinish-full-report
// Kompanija SPAJA — Digitalna Industrija
//
// Objedinjeni full report: status + ekosistem + zdravlje + changelog.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getAutofinishPetljaSummary,
  getAutofinishEkosistemSnapshot,
  getAutofinishHealthSummary,
  getLastNIterations,
} from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-full-report
 *
 * @returns { verzija, autofinishIteracija, status, ekosistem, zdravlje, changelog, timestamp }
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-full-report'), 30, 60);
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

  const statusSummary = getAutofinishPetljaSummary();
  const ekosistem = getAutofinishEkosistemSnapshot();
  const zdravlje = getAutofinishHealthSummary();
  const changelog = getLastNIterations(10);

  return NextResponse.json(
    {
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      status: statusSummary,
      ekosistem,
      zdravlje: {
        zdravlje: zdravlje.zdravlje,
        ukupnoProvera: zdravlje.ukupnoProvera,
        uspesnih: zdravlje.uspesnih,
        status: zdravlje.status,
        podsistemi: zdravlje.podsistemi,
      },
      changelog: {
        ukupno: changelog.length,
        stavke: changelog,
      },
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
    },
  );
}
