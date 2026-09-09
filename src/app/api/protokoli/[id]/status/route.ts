import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { logApiCall } from '@/lib/logger';
import { protokolManager } from '@/lib/protokoli/manager';
import type { ProtokolStatus } from '@/lib/protokoli/types';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { resolveRequestId } from '@/lib/request-id';
import { verifyUserFromToken } from '@/lib/supabase/server';

type RouteContext = { params: Promise<{ id: string }> };
type StatusAction = 'predlozi' | 'odobri' | 'rollback' | 'incident';

const VALID_STATUSI: readonly ProtokolStatus[] = ['aktivan', 'neaktivan', 'deprecated', 'u-testu', 'incident'];
const VALID_ACTIONS: readonly StatusAction[] = ['predlozi', 'odobri', 'rollback', 'incident'];

function getReqId(request: NextRequest): string {
  return resolveRequestId(request.headers);
}

function isAdminUser(user: { user_metadata?: Record<string, unknown> } | null): boolean {
  if (!user) return false;
  const roles = user.user_metadata?.['roles'];
  return Array.isArray(roles) && (roles.includes('admin') || roles.includes('superadmin'));
}

function isValidStatus(value: string): value is ProtokolStatus {
  return (VALID_STATUSI as readonly string[]).includes(value);
}

function isValidAction(value: string): value is StatusAction {
  return (VALID_ACTIONS as readonly string[]).includes(value);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const startedAt = Date.now();
  const reqId = getReqId(request);
  const route = '/api/protokoli/[id]/status';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  try {
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, route), 30, 60);
    if (!allowed) {
      logApiCall('PROTOKOLI', { reqId, route, method: 'POST', statusCode: 429, durationMs: Date.now() - startedAt });
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte ponovo za 60 sekundi.');
    }

    const params = await context.params;
    const id = params?.id;
    if (!id) {
      return apiError('BAD_REQUEST', 'Parametar id je obavezan.');
    }
    const body = (await request.json().catch(() => ({}))) as {
      action?: string;
      status?: string;
      reason?: string;
      requestId?: string;
    };
    const actionRaw = body.action ?? 'predlozi';
    const statusRaw = body.status;
    const reason = body.reason?.trim();

    if (!isValidAction(actionRaw)) {
      return apiError('BAD_REQUEST', `Nepoznata status akcija. Dozvoljeno: ${VALID_ACTIONS.join(', ')}.`);
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    const isAdmin = isAdminUser(user as { user_metadata?: Record<string, unknown> } | null);

    if (actionRaw === 'predlozi') {
      if (!statusRaw || !isValidStatus(statusRaw)) {
        return apiError('BAD_REQUEST', `Polje status je obavezno. Dozvoljeno: ${VALID_STATUSI.join(', ')}.`);
      }
      if (!reason) {
        return apiError('BAD_REQUEST', 'Polje reason je obavezno za predlog statusa.');
      }
      const promena = await protokolManager.predloziPromenuStatusa(id, statusRaw, {
        reason,
        userId: user?.id,
      });
      return apiSuccess({ promena, protokol: protokolManager.getById(id) });
    }

    if (!user || !isAdmin) {
      logApiCall('PROTOKOLI', { reqId, route, method: 'POST', statusCode: 403, durationMs: Date.now() - startedAt });
      return apiError('FORBIDDEN', 'Administratorske dozvole su obavezne za ovu operaciju.');
    }

    if (actionRaw === 'odobri') {
      if (!body.requestId) {
        return apiError('BAD_REQUEST', 'Polje requestId je obavezno za odobravanje.');
      }
      const result = await protokolManager.odobriPromenuStatusa(id, body.requestId, {
        approvedBy: user.id,
        reqId,
      });
      return apiSuccess(result);
    }

    if (actionRaw === 'rollback') {
      const result = await protokolManager.rollbackPromenuStatusa(id, {
        approvedBy: user.id,
        reqId,
        reason: reason ?? 'admin-rollback',
      });
      return apiSuccess(result);
    }

    const result = await protokolManager.updateStatus(id, 'incident', {
      userId: user.id,
      reqId,
      reason: reason ?? 'manual-incident',
    });
    return apiSuccess({ protokol: result, latestVerification: result.runtime?.poslednjaVerifikacija ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('nije pronađen')) {
      return apiError('NOT_FOUND', message);
    }
    if (message.includes('Promena statusa')) {
      return apiError('BAD_REQUEST', message);
    }
    logApiCall('PROTOKOLI', {
      reqId,
      route,
      method: 'POST',
      statusCode: 500,
      durationMs: Date.now() - startedAt,
      extra: { error: message },
    });
    return apiInternalError('protokol-status-admin', error);
  }
}
