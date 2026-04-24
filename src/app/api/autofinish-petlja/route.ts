import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { pokreniAutofinishPetlju } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  // #826 — Rate limiting: 60 zahteva u 60 sekundi po IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-petlja'), 60, 60);
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

  const izvestaj = pokreniAutofinishPetlju();

  return NextResponse.json({
    ...izvestaj,
    napomena: izvestaj.status === 'zavrsena'
      ? 'Svi podsistemi OMEGA PROJEKTA su na 100%. Autofinish petlja zavrsena.'
      : 'Autofinish petlja ce nastaviti ponavljanje dok svi podsistemi ne budu na 100%.',
  });
}
