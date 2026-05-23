import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { logApiCall } from '@/lib/logger';
import { protokolManager } from '@/lib/protokoli/manager';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

function getReqId(request: NextRequest): string {
  return request.headers.get('x-request-id') ?? `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  const reqId = getReqId(request);
  const route = '/api/protokoli/export';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  try {
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, route), 30, 60);
    if (!allowed) {
      logApiCall('PROTOKOLI', { reqId, route, method: 'GET', statusCode: 429, durationMs: Date.now() - startedAt });
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte ponovo za 60 sekundi.');
    }

    const protokoli = protokolManager.getAll();
    const logs = protokolManager.getLog(undefined, 500);

    logApiCall('PROTOKOLI', {
      reqId,
      route,
      method: 'GET',
      statusCode: 200,
      durationMs: Date.now() - startedAt,
      extra: { ukupnoProtokola: protokoli.length, ukupnoLogova: logs.length },
    });

    return apiSuccess({
      registry: protokoli,
      logs,
      meta: protokolManager.getMeta(),
      exportedAt: new Date().toISOString(),
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
    return apiInternalError('protokoli-export', error);
  }
}
