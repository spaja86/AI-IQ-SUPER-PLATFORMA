import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { logApiCall } from '@/lib/logger';
import { protokolManager } from '@/lib/protokoli/manager';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { resolveRequestId } from '@/lib/request-id';
import { verifyUserFromToken } from '@/lib/supabase/server';

type RouteContext = { params: Promise<{ id: string }> };

function getReqId(request: NextRequest): string {
  return resolveRequestId(request.headers);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const startedAt = Date.now();
  const reqId = getReqId(request);
  const route = '/api/protokoli/[id]/verifikuj';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  try {
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, route), 60, 60);
    if (!allowed) {
      logApiCall('PROTOKOLI', { reqId, route, method: 'POST', statusCode: 429, durationMs: Date.now() - startedAt });
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte ponovo za 60 sekundi.');
    }

    const { id } = await context.params;
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    const result = await protokolManager.verifikuj(id, user?.id);

    logApiCall('PROTOKOLI', {
      reqId,
      route,
      method: 'POST',
      statusCode: 200,
      durationMs: Date.now() - startedAt,
      extra: { id, uspesno: result.uspesno },
      ...(user?.id ? { userId: user.id } : {}),
    });

    return apiSuccess({ verifikacija: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('nije pronađen')) {
      logApiCall('PROTOKOLI', { reqId, route, method: 'POST', statusCode: 404, durationMs: Date.now() - startedAt });
      return apiError('NOT_FOUND', message);
    }
    logApiCall('PROTOKOLI', {
      reqId,
      route,
      method: 'POST',
      statusCode: 500,
      durationMs: Date.now() - startedAt,
      extra: { error: message },
    });
    return apiInternalError('protokol-verifikacija', error);
  }
}
