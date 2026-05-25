// Autofinish #1394 — GET + POST /api/autofinish-svega
// Kompanija SPAJA — Digitalna Industrija
//
// GET  — Metapodaci o AUTOFINISH SVEGA sistemu (bez auth, bez pokretanja pipeline-ova).
// POST — Orkestrira sve "svega" pipeline-ove (zahteva AUTOFINISH_TRIGGER_TOKEN).
//
// Sigurnost:  Bearer token guard identičan /api/autofinish-trigger (#825).
// Rate limit: 60 GET / 10 POST po IP u 60 sekundi.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishSvegaInfo, buildAutofinishSvega } from '@/lib/autofinish-svega';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import type { AutofinishSvegaStageId } from '@/lib/autofinish-svega';

export const dynamic = 'force-dynamic';

const TRIGGER_TOKEN = process.env.AUTOFINISH_TRIGGER_TOKEN;

if (!TRIGGER_TOKEN) {
  if (process.env.NODE_ENV === 'production') {
    console.error('[autofinish-svega] AUTOFINISH_TRIGGER_TOKEN nije konfigurisan u produkciji!');
  }
}

const VALID_STAGE_IDS = new Set<AutofinishSvegaStageId>([
  'analiza-svega',
  'procesuiranje-svega',
  'ekstremno-procesuiranje-svega',
  'autofinish-petlja',
]);

function parseStages(value: string | null): AutofinishSvegaStageId[] | undefined {
  if (!value) return undefined;
  const ids = value
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is AutofinishSvegaStageId => VALID_STAGE_IDS.has(s as AutofinishSvegaStageId));
  return ids.length > 0 ? [...new Set(ids)] : undefined;
}

/**
 * GET /api/autofinish-svega
 *
 * Vraća metapodatke o AUTOFINISH SVEGA sistemu — dostupni step-ovi,
 * endpoint-i, verzija, ekosistem metrike.
 * Ne zahteva autentifikaciju; ne pokreće pipeline-ove.
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-svega'), 60, 60);
  if (!allowed) {
    return NextResponse.json(
      {
        error: 'TOO_MANY_REQUESTS',
        poruka: 'Previše zahteva. Pokušajte ponovo za 60 sekundi.',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const info = getAutofinishSvegaInfo();

  return NextResponse.json(info, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}

/**
 * POST /api/autofinish-svega
 *
 * Pokreće sve (ili odabrane) "svega" pipeline-ove sekvencijalno.
 * Zahteva validan Bearer token (AUTOFINISH_TRIGGER_TOKEN).
 *
 * Body (JSON, opciono):
 *   { dryRun?: boolean, stages?: string[] }
 */
export async function POST(req: NextRequest) {
  if (!TRIGGER_TOKEN) {
    return NextResponse.json(
      {
        error: 'SERVICE_UNAVAILABLE',
        poruka: 'Autofinish SVEGA trigger nije konfigurisan. Podesite AUTOFINISH_TRIGGER_TOKEN.',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }

  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token || token !== TRIGGER_TOKEN) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        poruka: 'Validan Bearer token je obavezan za pokretanje AUTOFINISH SVEGA.',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      { status: 401 },
    );
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-svega'), 10, 60);
  if (!allowed) {
    return NextResponse.json(
      {
        error: 'TOO_MANY_REQUESTS',
        poruka: 'Previše zahteva. Pokušajte ponovo za 60 sekundi.',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  let dryRun = false;
  let stages: AutofinishSvegaStageId[] | undefined;

  const contentType = req.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    let body: unknown = null;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: 'BAD_REQUEST',
          poruka: 'Neispravan JSON payload.',
          verzija: APP_VERSION,
          autofinishIteracija: AUTOFINISH_COUNT,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    if (typeof body === 'object' && body !== null) {
      const b = body as Record<string, unknown>;
      if (typeof b['dryRun'] === 'boolean') dryRun = b['dryRun'];
      if (typeof b['stages'] === 'string') stages = parseStages(b['stages']);
      if (Array.isArray(b['stages'])) {
        stages = parseStages((b['stages'] as unknown[]).filter((s) => typeof s === 'string').join(','));
      }
    }
  }

  const rezultat = await buildAutofinishSvega({ dryRun, stages });

  return NextResponse.json(
    {
      status: 'ok',
      naziv: 'Autofinish SVEGA Trigger',
      poruka: dryRun
        ? 'Dry-run: svi stage-ovi preskočeni bez izvršavanja.'
        : 'Autofinish SVEGA orkestracija uspešno pokrenuta.',
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      rezultat,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
    },
  );
}
