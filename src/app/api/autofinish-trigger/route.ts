// Autofinish #814 — POST /api/autofinish-trigger
// Autofinish #825 — Auth zaštita Bearer token
// Kompanija SPAJA — Digitalna Industrija
//
// Autorizovani pozivalac može ručno pokrenuti jednu iteraciju autofinish
// petlje i dobiti ažurirani izveštaj. Zahteva validan Bearer token.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { pokreniAutofinishPetlju } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

const TRIGGER_TOKEN = process.env.AUTOFINISH_TRIGGER_TOKEN ?? 'dev-trigger-token';

export async function POST(req: NextRequest) {
  // #825 — Auth guard: Bearer token validacija
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token || token !== TRIGGER_TOKEN) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        poruka: 'Validan Bearer token je obavezan za pokretanje autofinish iteracije.',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      { status: 401 },
    );
  }

  // #826 — Rate limiting: max 10 trigera u 60 sekundi po IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-trigger'), 10, 60);
  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        poruka: 'Previše zahteva. Pokušajte ponovo za 60 sekundi.',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  // Pokreni jednu iteraciju petlje
  const izvestaj = pokreniAutofinishPetlju(1);

  return NextResponse.json({
    status: 'ok',
    naziv: 'Autofinish Trigger — Ručno pokrenuta iteracija',
    poruka: 'Autofinish iteracija uspešno pokrenuta.',
    verzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,
    izvestaj,
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json(
    {
      error: 'Method Not Allowed',
      poruka: 'POST metoda je obavezna za pokretanje autofinish iteracije.',
      dozvoljeniMetodi: ['POST'],
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      timestamp: new Date().toISOString(),
    },
    { status: 405 },
  );
}
