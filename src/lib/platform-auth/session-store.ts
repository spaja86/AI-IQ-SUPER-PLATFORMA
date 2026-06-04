import { randomUUID } from 'node:crypto';

export interface PlatformSession {
  sessionId: string;
  userId: string;
  scopes: string[];
  createdAt: number;
  expiresAt: number;
  revoked: boolean;
}

const sessionStore = new Map<string, PlatformSession>();
const refreshToSession = new Map<string, string>();
const userSessions = new Map<string, Set<string>>();

export function createSession(userId: string, scopes: string[], ttlSec = 60 * 60 * 24 * 30): PlatformSession {
  const now = Date.now();
  const session: PlatformSession = {
    sessionId: randomUUID(),
    userId,
    scopes: [...new Set(scopes)],
    createdAt: now,
    expiresAt: now + ttlSec * 1000,
    revoked: false,
  };

  sessionStore.set(session.sessionId, session);
  const ids = userSessions.get(userId) ?? new Set<string>();
  ids.add(session.sessionId);
  userSessions.set(userId, ids);
  return session;
}

export function bindRefreshToken(refreshToken: string, sessionId: string): void {
  refreshToSession.set(refreshToken, sessionId);
}

export function getSessionById(sessionId: string): PlatformSession | null {
  const session = sessionStore.get(sessionId) ?? null;
  if (!session) return null;
  if (session.revoked || Date.now() > session.expiresAt) {
    revokeSession(sessionId);
    return null;
  }
  return session;
}

export function getSessionByRefreshToken(refreshToken: string): PlatformSession | null {
  const sessionId = refreshToSession.get(refreshToken);
  if (!sessionId) return null;
  return getSessionById(sessionId);
}

export function revokeSession(sessionId: string): void {
  const session = sessionStore.get(sessionId);
  if (!session) return;
  session.revoked = true;
  sessionStore.set(sessionId, session);

  for (const [refreshToken, boundSessionId] of refreshToSession.entries()) {
    if (boundSessionId === sessionId) {
      refreshToSession.delete(refreshToken);
    }
  }

  const ids = userSessions.get(session.userId);
  if (ids) {
    ids.delete(sessionId);
    if (ids.size === 0) userSessions.delete(session.userId);
  }
}

export function revokeUserSessions(userId: string): number {
  const ids = userSessions.get(userId);
  if (!ids) return 0;

  let revoked = 0;
  for (const id of ids) {
    revokeSession(id);
    revoked++;
  }
  userSessions.delete(userId);
  return revoked;
}

export function cleanupExpiredSessions(): number {
  let removed = 0;
  for (const [sessionId, session] of sessionStore.entries()) {
    if (session.revoked || Date.now() > session.expiresAt) {
      revokeSession(sessionId);
      removed++;
    }
  }
  return removed;
}
