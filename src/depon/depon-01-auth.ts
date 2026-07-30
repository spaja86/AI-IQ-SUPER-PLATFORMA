/**
 * 🔐 DEPON-01 — User Identity & Auth
 *
 * Authentication, authorization, SSO, MFA, and session management
 * for all 50 US states. Serves 120M users.
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';

export const DEPON_ID: DeponId = 'DEPON-01';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AuthProvider = 'email' | 'google' | 'apple' | 'github' | 'saml' | 'oidc';

export type MfaMethod = 'totp' | 'sms' | 'email' | 'hardware-key';

export type UserRole = 'user' | 'admin' | 'state-admin' | 'compliance-officer' | 'super-admin';

export type SessionStatus = 'active' | 'expired' | 'revoked' | 'suspicious';

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  stateCode: string;
  mfaEnabled: boolean;
  provider: AuthProvider;
  createdAt: Date;
  lastLoginAt: Date | null;
};

export type AuthSession = {
  sessionId: string;
  userId: string;
  status: SessionStatus;
  stateCode: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: Date;
  createdAt: Date;
};

export type AuthResult =
  | { success: true; user: AuthUser; session: AuthSession }
  | { success: false; error: string; code: AuthErrorCode };

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'MFA_REQUIRED'
  | 'ACCOUNT_LOCKED'
  | 'SESSION_EXPIRED'
  | 'UNAUTHORIZED_STATE'
  | 'RATE_LIMITED';

// ─── Constants ────────────────────────────────────────────────────────────────

export const AUTH_CONFIG = {
  sessionTtlMs: 8 * 60 * 60 * 1000,       // 8 hours
  refreshTtlMs: 30 * 24 * 60 * 60 * 1000, // 30 days
  maxFailedAttempts: 5,
  lockoutDurationMs: 15 * 60 * 1000,       // 15 minutes
  mfaWindowSeconds: 30,
  bcryptRounds: 12,
} as const;

// ─── Service Functions ────────────────────────────────────────────────────────

export function buildAuthUser(params: {
  id: string;
  email: string;
  role?: UserRole;
  stateCode: string;
  provider: AuthProvider;
  mfaEnabled?: boolean;
}): AuthUser {
  return {
    id: params.id,
    email: params.email,
    role: params.role ?? 'user',
    stateCode: params.stateCode,
    mfaEnabled: params.mfaEnabled ?? false,
    provider: params.provider,
    createdAt: new Date(),
    lastLoginAt: null,
  };
}

export function buildAuthSession(params: {
  userId: string;
  stateCode: string;
  ipAddress: string;
  userAgent: string;
}): AuthSession {
  const now = new Date();
  return {
    sessionId: `sess_${params.stateCode}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    userId: params.userId,
    status: 'active',
    stateCode: params.stateCode,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    expiresAt: new Date(now.getTime() + AUTH_CONFIG.sessionTtlMs),
    createdAt: now,
  };
}

export function isSessionValid(session: AuthSession): boolean {
  return session.status === 'active' && session.expiresAt > new Date();
}

export function requiresStateAccess(user: AuthUser, targetStateCode: string): boolean {
  if (user.role === 'super-admin') return true;
  if (user.role === 'admin') return true;
  return user.stateCode === targetStateCode;
}

export function getHealthStatus(): { depon: string; status: 'ok'; version: string } {
  return { depon: DEPON_ID, status: 'ok', version: '1.0.0' };
}
