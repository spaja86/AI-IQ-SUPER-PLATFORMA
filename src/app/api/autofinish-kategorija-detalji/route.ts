// Autofinish #963 — GET /api/autofinish-kategorija-detalji
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća detaljnu analizu jedne autofinish kategorije.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishKategorijaDetalji } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const VALIDNE_KATEGORIJE = [
  'helper',
  'unit-test',
  'api-route',
  'integration-test',
  'dashboard-widget',
  'widget-unit-test',
  'e2e',
  'ostalo',
] as const;

/**
 * GET /api/autofinish-kategorija-detalji?kategorija=X
 *
 * @query kategorija - AutofinishKategorija string ključ (obavezan)
 * @returns AutofinishKategorijaDetaljiResult | 400 | 404 | 429
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/autofinish-kategorija-detalji'),
    60,
    60,
  );
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

  const { searchParams } = new URL(req.url);
  const kategorija = searchParams.get('kategorija') ?? '';

  if (!kategorija) {
    return NextResponse.json(
      {
        error: 'INVALID_PARAMS',
        poruka: `Parametar 'kategorija' je obavezan. Validne vrednosti: ${VALIDNE_KATEGORIJE.join(', ')}`,
        validneKategorije: VALIDNE_KATEGORIJE,
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      {
        status: 400,
        headers: {
          'X-App-Version': APP_VERSION,
          'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
        },
      },
    );
  }

  if (!(VALIDNE_KATEGORIJE as readonly string[]).includes(kategorija)) {
    return NextResponse.json(
      {
        error: 'INVALID_PARAMS',
        poruka: `Nepoznata kategorija: "${kategorija}". Validne vrednosti: ${VALIDNE_KATEGORIJE.join(', ')}`,
        validneKategorije: VALIDNE_KATEGORIJE,
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      {
        status: 400,
        headers: {
          'X-App-Version': APP_VERSION,
          'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
        },
      },
    );
  }

  const result = getAutofinishKategorijaDetalji(kategorija);

  if (!result) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        poruka: `Kategorija "${kategorija}" ne sadrži iteracije.`,
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      {
        status: 404,
        headers: {
          'X-App-Version': APP_VERSION,
          'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
        },
      },
    );
  }

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
