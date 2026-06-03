// Panetracija 2 — POST /api/panetracija-2/sken
// Kompanija SPAJA — Digitalna Industrija
//
// Pokreće novi V2 scan session.
// Rate limit: max 3 skeniranja/min po IP-u.
// Zahteva: ΩClearanceLevel.SUPER_ADMIN, scope: panetracija2:execute

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { startScanSession } from '@/lib/panetracija-2';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  // Stroži rate limit za pokretanje skena — max 3 po minuti
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/panetracija-2/sken'), 3, 60);
  if (!allowed) {
    return NextResponse.json(
      {
        error: 'TOO_MANY_REQUESTS',
        poruka: 'Maksimalno 3 skeniranja po minuti',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const session = startScanSession('api');

  return NextResponse.json(
    {
      status: 'started',
      scanId: session.scanId,
      started: session.startedAt,
      estimatedDuration: 42,
      poruka: 'Panetracija 2 sken je pokrenut. Rezultati dostupni na GET /api/panetracija-2.',
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      timestamp: session.startedAt,
    },
    {
      status: 202,
      headers: {
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
        'X-Scan-Id': session.scanId,
      },
    },
  );
}
