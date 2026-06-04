import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { logApiCall } from '@/lib/logger';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { protokolManager } from '@/lib/protokoli/manager';
import type { ProtokolFilter, ProtokolKategorija, ProtokolStatus } from '@/lib/protokoli/types';
import { resolveRequestId } from '@/lib/request-id';

function getReqId(request: NextRequest): string {
  return resolveRequestId(request.headers);
}

const VALID_KATEGORIJE = new Set<ProtokolKategorija>([
  'komunikacioni',
  'bezbednosni',
  'poslovni',
  'operativni',
  'autentifikacioni',
  'transfer',
]);

const VALID_STATUSI = new Set<ProtokolStatus>(['aktivan', 'neaktivan', 'deprecated', 'u-testu', 'incident']);

function parseBoundedInt(rawValue: string | null, fallback: number, min: number, max: number): number {
  const parsed = Number.parseInt(rawValue ?? String(fallback), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  const reqId = getReqId(request);
  const route = '/api/protokoli';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  try {
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, route), 120, 60);
    if (!allowed) {
      logApiCall('PROTOKOLI', {
        reqId,
        route,
        method: 'GET',
        statusCode: 429,
        durationMs: Date.now() - startedAt,
      });
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte ponovo za 60 sekundi.');
    }

    const searchParams =
      'nextUrl' in request && request.nextUrl
        ? request.nextUrl.searchParams
        : new URL(request.url).searchParams;
    const page = parseBoundedInt(searchParams.get('page'), 1, 1, 10000);
    const limit = parseBoundedInt(searchParams.get('limit'), 50, 1, 200);
    const kategorijaRaw = searchParams.get('kategorija');
    const statusRaw = searchParams.get('status');
    const kategorija =
      kategorijaRaw && VALID_KATEGORIJE.has(kategorijaRaw as ProtokolKategorija)
        ? (kategorijaRaw as ProtokolKategorija)
        : null;
    const status =
      statusRaw && VALID_STATUSI.has(statusRaw as ProtokolStatus) ? (statusRaw as ProtokolStatus) : null;

    if (kategorijaRaw && !kategorija) {
      return apiError('BAD_REQUEST', `Nepoznata kategorija protokola: '${kategorijaRaw}'.`);
    }
    if (statusRaw && !status) {
      return apiError('BAD_REQUEST', `Nepoznat status protokola: '${statusRaw}'.`);
    }
    const offset = (page - 1) * limit;

    const filter: ProtokolFilter = {
      ...(kategorija ? { kategorija } : {}),
      ...(status ? { status } : {}),
    };

    const all = protokolManager.getAll(filter);
    const results = all.slice(offset, offset + limit);

    logApiCall('PROTOKOLI', {
      reqId,
      route,
      method: 'GET',
      statusCode: 200,
      durationMs: Date.now() - startedAt,
      extra: { ukupno: all.length, page, limit },
    });

    return apiSuccess({
      total: all.length,
      page,
      limit,
      results,
      meta: protokolManager.getMeta(),
    });
  } catch (error) {
    logApiCall('PROTOKOLI', {
      reqId,
      route,
      method: 'GET',
      statusCode: 500,
      durationMs: Date.now() - startedAt,
      extra: { error: error instanceof Error ? error.message : String(error) },
    });
    return apiInternalError('protokoli-list', error);
  }
}
