// SpajaUltraOmegaCore -∞Ω+∞ — Omega Session Management
// Kompanija SPAJA — Digitalna Industrija

import type { ΩSession, ΩIdentity } from '../auth/types';
import { MAX_SESSIONS, ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../auth/types';
import { ΩCryptoEngine } from '../auth/omega-crypto';

// In-memory store za sesije (u produkciji: Redis enkriptovano)
const sessionStore = new Map<string, ΩSession>();

// ΩSessionManager — upravljanje sesijama
export class ΩSessionManager {
  // createSession — kreira novu sesiju
  static createSession(params: {
    identity: ΩIdentity;
    accessToken: string;
    refreshToken: string;
    ip: string;
    userAgent: string;
  }): ΩSession {
    // Session fixation zaštita: uvek generiši novi ID
    const sessionId = ΩCryptoEngine.generateId();
    const now = Date.now();

    const session: ΩSession = {
      id: sessionId,
      userId: params.identity.id,
      accessToken: params.accessToken,
      refreshToken: params.refreshToken,
      createdAt: now,
      expiresAt: now + ACCESS_TOKEN_TTL * 1000,
      ip: params.ip,
      userAgent: params.userAgent,
      active: true,
    };

    // Concurrent session limit: max 5 aktivnih sesija
    this.enforceSessionLimit(params.identity.id);

    sessionStore.set(sessionId, session);
    return session;
  }

  // getSession — dohvata sesiju
  static getSession(sessionId: string): ΩSession | null {
    const session = sessionStore.get(sessionId);
    if (!session) return null;

    // Provjeri da li je sesija istekla
    if (Date.now() > session.expiresAt) {
      this.terminateSession(sessionId);
      return null;
    }

    return session;
  }

  // getSessionByToken — dohvata sesiju po access tokenu
  static getSessionByToken(accessToken: string): ΩSession | null {
    for (const session of sessionStore.values()) {
      if (session.accessToken === accessToken && session.active) {
        if (Date.now() > session.expiresAt) {
          this.terminateSession(session.id);
          return null;
        }
        return session;
      }
    }
    return null;
  }

  // getUserSessions — lista aktivnih sesija korisnika
  static getUserSessions(userId: string): ΩSession[] {
    const now = Date.now();
    return Array.from(sessionStore.values())
      .filter((s) => s.userId === userId && s.active && now <= s.expiresAt)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  // terminateSession — ukida sesiju
  static terminateSession(sessionId: string): void {
    const session = sessionStore.get(sessionId);
    if (session) {
      session.active = false;
      sessionStore.set(sessionId, session);
    }
  }

  // terminateAllUserSessions — ukida sve sesije korisnika
  static terminateAllUserSessions(userId: string): void {
    for (const [id, session] of sessionStore.entries()) {
      if (session.userId === userId) {
        session.active = false;
        sessionStore.set(id, session);
      }
    }
  }

  // refreshSession — obnavlja sesiju
  static refreshSession(
    sessionId: string,
    newAccessToken: string,
    newRefreshToken: string
  ): boolean {
    const session = sessionStore.get(sessionId);
    if (!session || !session.active) return false;

    session.accessToken = newAccessToken;
    session.refreshToken = newRefreshToken;
    session.expiresAt = Date.now() + ACCESS_TOKEN_TTL * 1000;
    sessionStore.set(sessionId, session);
    return true;
  }

  // getStats — statistike sesija
  static getStats(): {
    total: number;
    active: number;
    expired: number;
    uniqueUsers: number;
  } {
    const now = Date.now();
    const allSessions = Array.from(sessionStore.values());
    const active = allSessions.filter((s) => s.active && now <= s.expiresAt);
    const expired = allSessions.filter((s) => !s.active || now > s.expiresAt);
    const uniqueUsers = new Set(active.map((s) => s.userId)).size;

    return {
      total: allSessions.length,
      active: active.length,
      expired: expired.length,
      uniqueUsers,
    };
  }

  // cleanupExpiredSessions — briše istekle sesije
  static cleanupExpiredSessions(): number {
    const now = Date.now();
    let removed = 0;

    for (const [id, session] of sessionStore.entries()) {
      if (!session.active || now > session.expiresAt + REFRESH_TOKEN_TTL * 1000) {
        sessionStore.delete(id);
        removed++;
      }
    }

    return removed;
  }

  // enforceSessionLimit — primenjuje limit od MAX_SESSIONS
  private static enforceSessionLimit(userId: string): void {
    const userSessions = this.getUserSessions(userId);

    if (userSessions.length >= MAX_SESSIONS) {
      // Ukini najstarije sesije
      const toTerminate = userSessions.slice(MAX_SESSIONS - 1);
      for (const session of toTerminate) {
        this.terminateSession(session.id);
      }
    }
  }
}
