import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { logApiCall } from '@/lib/logger';
import { protokolManager } from '@/lib/protokoli/manager';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { resolveRequestId } from '@/lib/request-id';
import { verifyUserFromToken } from '@/lib/supabase/server';

function getReqId(request: NextRequest): string {
  return resolveRequestId(request.headers);
}

function isAdminUser(user: { user_metadata?: Record<string, unknown> } | null): boolean {
  if (!user) return false;
  const roles = user.user_metadata?.['roles'];
  return Array.isArray(roles) && (roles.includes('admin') || roles.includes('superadmin'));
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const reqId = getReqId(request);
  const route = '/api/protokoli/verifikacija-sve';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  try {
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, route), 30, 60);
    if (!allowed) {
      logApiCall('PROTOKOLI', { reqId, route, method: 'POST', statusCode: 429, durationMs: Date.now() - startedAt });
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte ponovo za 60 sekundi.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      logApiCall('PROTOKOLI', { reqId, route, method: 'POST', statusCode: 401, durationMs: Date.now() - startedAt });
      return apiError('UNAUTHORIZED', 'Niste prijavljeni.');
    }
    if (!isAdminUser(user as { user_metadata?: Record<string, unknown> })) {
      logApiCall('PROTOKOLI', {
        reqId,
        route,
        method: 'POST',
        statusCode: 403,
        durationMs: Date.now() - startedAt,
        userId: user.id,
      });
      return apiError('FORBIDDEN', 'Nedostaju administratorske dozvole.');
    }

    const results = await protokolManager.verifikujSveAktivne(user.id);
    const neuspesni = results.filter((result) => !result.uspesno);

    logApiCall('PROTOKOLI', {
      reqId,
      route,
      method: 'POST',
      statusCode: 200,
      durationMs: Date.now() - startedAt,
      userId: user.id,
      extra: { ukupno: results.length, neuspesni: neuspesni.length },
    });

    return apiSuccess({
      ukupno: results.length,
      uspesni: results.length - neuspesni.length,
      neuspesni: neuspesni.length,
      rezultati: results,
    });
  } catch (error) {
    logApiCall('PROTOKOLI', {
      reqId,
      route,
      method: 'POST',
      statusCode: 500,
      durationMs: Date.now() - startedAt,
      extra: { error: error instanceof Error ? error.message : String(error) },
    });
    return apiInternalError('protokoli-verifikacija-sve', error);
  }
}
