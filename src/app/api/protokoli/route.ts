import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { logApiCall } from '@/lib/logger';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { protokolManager } from '@/lib/protokoli/manager';
import type { ProtokolFilter, ProtokolKategorija, ProtokolStatus } from '@/lib/protokoli/types';

function getReqId(request: NextRequest): string {
  return request.headers.get('x-request-id') ?? `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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
    const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(200, Math.max(1, Number.parseInt(searchParams.get('limit') ?? '50', 10)));
    const kategorija = searchParams.get('kategorija') as ProtokolKategorija | null;
    const status = searchParams.get('status') as ProtokolStatus | null;
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
