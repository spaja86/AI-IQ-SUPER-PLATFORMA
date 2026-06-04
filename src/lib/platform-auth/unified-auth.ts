import { apiError } from '@/lib/api/response';
import {
  bindRefreshToken,
  createSession,
  getSessionById,
  getSessionByRefreshToken,
  revokeSession,
  revokeUserSessions,
} from './session-store';
import { mintAccessToken, mintRefreshToken, verifyToken } from './token-manager';

export const ALL_PLATFORM_SCOPES = [
  'io-openui-ao:read',
  'io-openui-ao:write',
  'menja-nica:read',
  'menja-nica:write',
  'world-bank:read',
  'world-bank:write',
  'platforms:sync',
  'platforms:health',
] as const;

export type PlatformScope = (typeof ALL_PLATFORM_SCOPES)[number];

export interface PlatformAuthBundle {
  accessToken: string;
  refreshToken: string;
  expiresInSec: number;
  sessionId: string;
  scopes: string[];
}

export function createPlatformScopedSession(userId: string, scopes: string[] = [...ALL_PLATFORM_SCOPES]): PlatformAuthBundle {
  const normalizedScopes = [...new Set(scopes)];
  const session = createSession(userId, normalizedScopes);
  const accessToken = mintAccessToken(userId, session.sessionId, normalizedScopes);
  const refreshToken = mintRefreshToken(userId, session.sessionId, normalizedScopes);
  bindRefreshToken(refreshToken, session.sessionId);

  return {
    accessToken,
    refreshToken,
    expiresInSec: 15 * 60,
    sessionId: session.sessionId,
    scopes: normalizedScopes,
  };
}

export function verifyPlatformBearer(
  authorizationHeader: string | null,
  requiredScope?: string,
):
  | { ok: true; userId: string; sessionId: string; scopes: string[] }
  | { ok: false; response: ReturnType<typeof apiError> } {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return { ok: false, response: apiError('UNAUTHORIZED', 'Autorizacioni token je obavezan.') };
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();
  const payload = verifyToken(token, 'access');
  if (!payload) {
    return { ok: false, response: apiError('AUTH_TOKEN_INVALID', 'Nevažeći ili istekli access token.') };
  }

  const session = getSessionById(payload.sid);
  if (!session || session.userId !== payload.sub) {
    return { ok: false, response: apiError('AUTH_TOKEN_INVALID', 'Sesija nije aktivna.') };
  }

  if (requiredScope && !session.scopes.includes(requiredScope)) {
    return { ok: false, response: apiError('FORBIDDEN', `Nedostaje scope: ${requiredScope}`) };
  }

  return { ok: true, userId: session.userId, sessionId: session.sessionId, scopes: session.scopes };
}

export function refreshPlatformSession(refreshToken: string): PlatformAuthBundle | null {
  const payload = verifyToken(refreshToken, 'refresh');
  if (!payload) return null;

  const session = getSessionByRefreshToken(refreshToken);
  if (!session || session.userId !== payload.sub) return null;

  const accessToken = mintAccessToken(session.userId, session.sessionId, session.scopes);
  const nextRefreshToken = mintRefreshToken(session.userId, session.sessionId, session.scopes);
  bindRefreshToken(nextRefreshToken, session.sessionId);

  return {
    accessToken,
    refreshToken: nextRefreshToken,
    expiresInSec: 15 * 60,
    sessionId: session.sessionId,
    scopes: session.scopes,
  };
}

export function logoutPlatformSession(sessionId: string): void {
  revokeSession(sessionId);
}

export function logoutFromAllPlatforms(userId: string): number {
  return revokeUserSessions(userId);
}
