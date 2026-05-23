import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { logApiCall } from '@/lib/logger';
import { protokolManager } from '@/lib/protokoli/manager';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

type RouteContext = { params: Promise<{ id: string }> };

function getReqId(request: NextRequest): string {
  return request.headers.get('x-request-id') ?? `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const startedAt = Date.now();
  const reqId = getReqId(request);
  const route = '/api/protokoli/[id]/log';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  try {
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, route), 120, 60);
    if (!allowed) {
      logApiCall('PROTOKOLI', { reqId, route, method: 'GET', statusCode: 429, durationMs: Date.now() - startedAt });
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte ponovo za 60 sekundi.');
    }

    const { id } = await context.params;
    const protokol = protokolManager.getById(id);
    if (!protokol) {
      logApiCall('PROTOKOLI', { reqId, route, method: 'GET', statusCode: 404, durationMs: Date.now() - startedAt });
      return apiError('NOT_FOUND', `Protokol '${id}' nije pronađen.`);
    }

    const searchParams =
      'nextUrl' in request && request.nextUrl
        ? request.nextUrl.searchParams
        : new URL(request.url).searchParams;
    const limit = Math.min(200, Math.max(1, Number.parseInt(searchParams.get('limit') ?? '50', 10)));
    const events = protokolManager.getLog(id, limit);

    logApiCall('PROTOKOLI', {
      reqId,
      route,
      method: 'GET',
      statusCode: 200,
      durationMs: Date.now() - startedAt,
      extra: { id, limit, total: events.length },
    });

    return apiSuccess({ protokolId: id, total: events.length, events });
  } catch (error) {
    logApiCall('PROTOKOLI', {
      reqId,
      route,
      method: 'GET',
      statusCode: 500,
      durationMs: Date.now() - startedAt,
      extra: { error: error instanceof Error ? error.message : String(error) },
    });
    return apiInternalError('protokol-log', error);
  }
}
