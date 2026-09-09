import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { logApiCall } from '@/lib/logger';
import { protokolManager } from '@/lib/protokoli/manager';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { resolveRequestId } from '@/lib/request-id';

type RouteContext = { params: Promise<{ id: string }> };

function getReqId(request: NextRequest): string {
  return resolveRequestId(request.headers);
}

export async function GET(request: NextRequest, context: RouteContext) {
  const startedAt = Date.now();
  const reqId = getReqId(request);
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const route = '/api/protokoli/[id]';

  try {
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, route), 120, 60);
    if (!allowed) {
      logApiCall('PROTOKOLI', { reqId, route, method: 'GET', statusCode: 429, durationMs: Date.now() - startedAt });
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte ponovo za 60 sekundi.');
    }

    const params = await context.params;
    const id = params?.id;
    if (!id) {
      return apiError('BAD_REQUEST', 'Parametar id je obavezan.');
    }
    const protokol = protokolManager.getById(id);
    if (!protokol) {
      logApiCall('PROTOKOLI', { reqId, route, method: 'GET', statusCode: 404, durationMs: Date.now() - startedAt });
      return apiError('NOT_FOUND', `Protokol '${id}' nije pronađen.`);
    }

    const dependencies = protokol.zavisnosti.map((dependencyId) => {
      const dependency = protokolManager.getById(dependencyId);
      return {
        id: dependencyId,
        naziv: dependency?.naziv ?? dependencyId,
        status: dependency?.status ?? 'nepoznat',
        found: Boolean(dependency),
      };
    });

    const verificationHistory = protokolManager.getVerificationHistory(id, 20);
    const lifecycle = protokolManager.getLifecycleHistory(id, 20);
    const audit = protokolManager.getLog(id, 20);

    logApiCall('PROTOKOLI', {
      reqId,
      route,
      method: 'GET',
      statusCode: 200,
      durationMs: Date.now() - startedAt,
      extra: { id, verificationHistory: verificationHistory.length, lifecycle: lifecycle.length },
    });
    return apiSuccess({
      protokol,
      latestVerification: protokol.runtime?.poslednjaVerifikacija ?? null,
      verificationHistory,
      lifecycle,
      audit,
      dependencies,
      summary: {
        pendingPromene: protokol.runtime?.pendingPromene ?? 0,
        poslednjaUspesnaVerifikacijaAt: protokol.runtime?.poslednjaUspesnaVerifikacijaAt ?? null,
        poslednjaNeuspesnaVerifikacijaAt: protokol.runtime?.poslednjaNeuspesnaVerifikacijaAt ?? null,
      },
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
    return apiInternalError('protokol-detail', error);
  }
}
