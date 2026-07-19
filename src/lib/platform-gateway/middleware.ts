import type { NextRequest } from 'next/server';
import { apiRateLimited } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyPlatformBearer } from '@/lib/platform-auth/unified-auth';

export interface PlatformGatewayContext {
  userId: string;
  sessionId: string;
  scopes: string[];
  ip: string;
}

type PlatformGatewayErrorResponse =
  | ReturnType<typeof apiRateLimited>
  | (ReturnType<typeof verifyPlatformBearer> extends { ok: false; response: infer R } ? R : never);

export async function enforceGatewayMiddleware(
  request: NextRequest,
  platformId: string,
  requiredScope: string,
): Promise<{ ok: true; context: PlatformGatewayContext } | { ok: false; response: PlatformGatewayErrorResponse }> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';

  const globalAllowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/platforms/global'), 100, 1);
  if (!globalAllowed) {
    return { ok: false, response: apiRateLimited(1) };
  }

  const platformAllowed = await checkRateLimitGlobal(rateLimitKey(ip, `/api/platforms/${platformId}`), 10, 1);
  if (!platformAllowed) {
    return { ok: false, response: apiRateLimited(1) };
  }

  const auth = verifyPlatformBearer(request.headers.get('authorization'), requiredScope);
  if (!auth.ok) return { ok: false, response: auth.response };

  return {
    ok: true,
    context: {
      userId: auth.userId,
      sessionId: auth.sessionId,
      scopes: auth.scopes,
      ip,
    },
  };
}
