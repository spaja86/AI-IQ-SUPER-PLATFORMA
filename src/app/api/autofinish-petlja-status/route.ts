// Autofinish #835 — Cache-Control Headers
// stale-while-revalidate: klijent može koristiti keširani odgovor do 5s dok čeka osveženi

import { NextResponse } from 'next/server';
import { getAutofinishPetljaStatus } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';

export async function GET() {
  const status = getAutofinishPetljaStatus();

  const response = NextResponse.json({
    ...status,
    napomena: status.status === 'zavrsena'
      ? 'Svi podsistemi OMEGA PROJEKTA su na 100%. Petlja zavrsena uspesno.'
      : 'Autofinish petlja nastavlja ponavljanje dok svi podsistemi ne budu na 100%.',
    verzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,
    timestamp: new Date().toISOString(),
  });

  // #835 — Cache-Control: kratko keširanje sa stale-while-revalidate
  response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=60');
  response.headers.set('X-App-Version', APP_VERSION);
  response.headers.set('X-Autofinish-Iteracija', String(AUTOFINISH_COUNT));

  return response;
}
