// Autofinish #933 — GET /api/autofinish-iteracija-raspon
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća listu poznatih iteracija u zadatom rasponu (?od=N&do=M).

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishIteracijaRaspon } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-iteracija-raspon?od=N&do=M
 *
 * @query od - Početak raspona (integer, required)
 * @query do - Kraj raspona (integer, required, >= od)
 * @returns AutofinishIteracijaRasponResult | 400
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/autofinish-iteracija-raspon'),
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
  const odRaw = searchParams.get('od');
  const doRaw = searchParams.get('do');

  if (!odRaw || !doRaw) {
    return NextResponse.json(
      {
        error: 'INVALID_PARAMS',
        poruka: 'Obavezni query parametri: od (integer) i do (integer)',
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

  const od = parseInt(odRaw, 10);
  const do_ = parseInt(doRaw, 10);

  if (isNaN(od) || isNaN(do_) || od < 1 || do_ < 1) {
    return NextResponse.json(
      {
        error: 'INVALID_PARAMS',
        poruka: 'Parametri od i do moraju biti pozitivni celi brojevi',
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

  if (do_ - od > 200) {
    return NextResponse.json(
      {
        error: 'RASPON_PREŠIROK',
        poruka: 'Maksimalni raspon je 200 iteracija',
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

  const result = getAutofinishIteracijaRaspon(od, do_);

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
