// Pentracija — POST /api/pentracija/sken
// Kompanija SPAJA — Digitalna Industrija
//
// Pokreće novi simulirani penetration sken.
// Rate limit: max 3 skeniranja/min po IP-u.
// Zahteva: ΩClearanceLevel.SUPER_ADMIN

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  // Stroži rate limit za pokretanje skena — max 3 po minuti
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/pentracija/sken'), 3, 60);
  if (!allowed) {
    return NextResponse.json(
      { error: 'TOO_MANY_REQUESTS', poruka: 'Maksimalno 3 skeniranja po minuti', verzija: APP_VERSION, autofinishIteracija: AUTOFINISH_COUNT, timestamp: new Date().toISOString() },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const scanId = randomUUID();
  const started = new Date().toISOString();

  return NextResponse.json(
    {
      status: 'started',
      scanId,
      started,
      estimatedDuration: 42,
      poruka: 'Penetration sken je pokrenut. Rezultati dostupni na GET /api/pentracija.',
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      timestamp: started,
    },
    {
      status: 202,
      headers: {
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
        'X-Scan-Id': scanId,
      },
    },
  );
}
