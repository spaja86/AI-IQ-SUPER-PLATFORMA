// Autofinish #883 — GET /api/autofinish-audit-report
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća sveobuhvatni audit izvještaj autofinish platforme.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishAuditReport } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-audit-report
 *
 * @returns AutofinishAuditReport — petljaStatus, ekosistem, zdravlje, progress, podsistemi
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-audit-report'), 30, 60);
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

  const report = getAutofinishAuditReport();

  return NextResponse.json(report, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
