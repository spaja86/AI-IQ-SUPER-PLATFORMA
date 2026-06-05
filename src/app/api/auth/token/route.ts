import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { refreshPlatformSession } from '@/lib/platform-auth/unified-auth';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/auth/token'), 30, 60);
    if (!allowed) return apiRateLimited(60);

    const body = (await request.json()) as Record<string, unknown>;
    const refreshToken = typeof body['refreshToken'] === 'string' ? body['refreshToken'] : '';
    if (!refreshToken) return apiError('BAD_REQUEST', "Polje 'refreshToken' je obavezno.");

    const refreshed = refreshPlatformSession(refreshToken);
    if (!refreshed) return apiError('AUTH_TOKEN_INVALID', 'Refresh token nije validan ili je istekao.');

    return apiSuccess({
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
      expiresInSec: refreshed.expiresInSec,
      sessionId: refreshed.sessionId,
      scopes: refreshed.scopes,
    });
  } catch (error) {
    return apiInternalError('auth/token', error);
  }
}
