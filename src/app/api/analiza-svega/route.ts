// Autofinish #1360 — GET /api/analiza-svega
// Kompanija SPAJA — Digitalna Industrija
//
// Kanonski endpoint za celokupnu analizu ekosistema:
// ekosistem, infrastruktura, finansije, bezbednost, operativa, autofinish, protokoli.

import { NextResponse, type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { buildAnalizaSvega, type AnalizaSvega } from '@/lib/analiza-svega';
import { dispatchAnalizaSvegaAlert } from '@/lib/analiza-svega-alert';
import { serializeAnalizaSvegaCSV } from '@/lib/analiza-svega-export';
import { getCachedAnalizaSvega, setCachedAnalizaSvega } from '@/lib/analiza-svega-store';

export const dynamic = 'force-dynamic';
/** Maksimalan broj zahteva po IP ključu za /api/analiza-svega u jednom prozoru. */
export const ANALIZA_SVEGA_RATE_LIMIT = 60;
/** Dužina rate-limit prozora u sekundama za /api/analiza-svega. */
export const ANALIZA_SVEGA_RATE_WINDOW_SECONDS = 60;
/** TTL u sekundama za cache /api/analiza-svega rezultata. */
export const ANALIZA_SVEGA_CACHE_TTL_SECONDS = 15 * 60;

const VALID_DOMAIN_KEYS = new Set([
  'ekosistem',
  'infrastruktura',
  'finansije',
  'bezbednost',
  'operativa',
  'autofinish',
  'protokoli',
] as const);

type ValidDomainKey = keyof AnalizaSvega['domeni'];

function parseDomainFilter(value: string | null): ValidDomainKey[] {
  if (!value) return [];
  const domains = value
    .split(',')
    .map((d) => d.trim())
    .filter((d): d is ValidDomainKey => VALID_DOMAIN_KEYS.has(d as ValidDomainKey));
  return Array.from(new Set(domains));
}

function filterAnalizaDomains(analiza: AnalizaSvega, domains: ValidDomainKey[]): AnalizaSvega {
  if (domains.length === 0) return analiza;
  const filteredEntries = Object.entries(analiza.domeni)
    .filter(([key]) => domains.includes(key as ValidDomainKey));
  return {
    ...analiza,
    domeni: Object.fromEntries(filteredEntries) as AnalizaSvega['domeni'],
  };
}

/**
 * GET /api/analiza-svega
 *
 * @returns AnalizaSvega | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/analiza-svega'),
    ANALIZA_SVEGA_RATE_LIMIT,
    ANALIZA_SVEGA_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(ANALIZA_SVEGA_RATE_WINDOW_SECONDS);
  }

  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');
    const raw = searchParams.get('raw') === '1';
    const forceRefresh = searchParams.get('refresh') === '1';
    const domainFilter = parseDomainFilter(searchParams.get('domen'));

    const cached = forceRefresh ? null : await getCachedAnalizaSvega();
    const analiza = cached ?? await buildAnalizaSvega();
    if (!cached) {
      await setCachedAnalizaSvega(analiza, ANALIZA_SVEGA_CACHE_TTL_SECONDS);
    }

    // Fire-and-forget: alert ne sme da blokira API odgovor.
    void dispatchAnalizaSvegaAlert(analiza).then((result) => {
      if (!result.sent && result.reason !== 'threshold-not-breached' && result.reason !== 'webhook-not-configured') {
        console.warn('[analiza-svega] alert dispatch skipped/failure', { reason: result.reason });
      }
    }).catch((error) => {
      console.warn('[analiza-svega] alert dispatch promise rejected', error);
    });

    const filtered = filterAnalizaDomains(analiza, domainFilter);

    if (format === 'csv') {
      const csv = serializeAnalizaSvegaCSV(filtered);
      const response = new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="analiza-svega.csv"',
        },
      });
      response.headers.set('X-Analiza-Contract-Version', filtered.meta.contractVersion);
      response.headers.set('X-Analiza-Model-Version', filtered.meta.modelVersion);
      return response;
    }

    const response = format === 'json' || raw
      ? NextResponse.json(filtered, { status: 200 })
      : apiSuccess(filtered, 200);
    response.headers.set('X-Analiza-Contract-Version', filtered.meta.contractVersion);
    response.headers.set('X-Analiza-Model-Version', filtered.meta.modelVersion);
    response.headers.set('X-Analiza-Cache', cached ? 'HIT' : 'MISS');
    return response;
  } catch (error) {
    return apiInternalError('analiza-svega', error);
  }
}
