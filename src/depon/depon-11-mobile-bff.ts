/**
 * 📱 DEPON-11 — Mobile Backend (BFF)
 *
 * Backend-For-Frontend API layer optimized for iOS and Android
 * React Native mobile clients. Aggregates data from other DEPONs.
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';

export const DEPON_ID: DeponId = 'DEPON-11';

// ─── Types ───────────────────────────────────────────────────────────────────

export type MobileOS = 'ios' | 'android' | 'web';

export type AppVersion = {
  major: number;
  minor: number;
  patch: number;
  build: string;
};

export type DeviceInfo = {
  deviceId: string;
  os: MobileOS;
  osVersion: string;
  appVersion: AppVersion;
  pushToken: string | null;
  locale: string;
  timezone: string;
};

export type MobileSession = {
  sessionId: string;
  userId: string;
  device: DeviceInfo;
  stateCode: string;
  startedAt: Date;
  lastActiveAt: Date;
  isActive: boolean;
};

export type MobileHomePayload = {
  userId: string;
  stateCode: string;
  unreadNotifications: number;
  dashboardSummary: Record<string, unknown>;
  recentActivity: MobileActivityItem[];
  appConfig: MobileAppConfig;
};

export type MobileActivityItem = {
  type: string;
  title: string;
  subtitle: string;
  timestamp: Date;
  actionUrl: string | null;
};

export type MobileAppConfig = {
  minSupportedVersion: AppVersion;
  forceUpdate: boolean;
  maintenanceMode: boolean;
  featureFlags: Record<string, boolean>;
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const MIN_SUPPORTED_VERSION: AppVersion = { major: 2, minor: 0, patch: 0, build: '2000' };

export const DEFAULT_APP_CONFIG: MobileAppConfig = {
  minSupportedVersion: MIN_SUPPORTED_VERSION,
  forceUpdate: false,
  maintenanceMode: false,
  featureFlags: {
    offlineMode: true,
    biometricAuth: true,
    pushNotifications: true,
    darkMode: true,
    analyticsOptIn: false,
  },
};

// ─── Service Functions ────────────────────────────────────────────────────────

export function buildMobileSession(params: {
  userId: string;
  device: DeviceInfo;
  stateCode: string;
}): MobileSession {
  const now = new Date();
  return {
    sessionId: `mob_${params.device.os}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    userId: params.userId,
    device: params.device,
    stateCode: params.stateCode,
    startedAt: now,
    lastActiveAt: now,
    isActive: true,
  };
}

export function isVersionSupported(version: AppVersion): boolean {
  const min = MIN_SUPPORTED_VERSION;
  if (version.major > min.major) return true;
  if (version.major < min.major) return false;
  if (version.minor > min.minor) return true;
  if (version.minor < min.minor) return false;
  return version.patch >= min.patch;
}

export function buildHomePayload(params: {
  userId: string;
  stateCode: string;
  unreadNotifications?: number;
  recentActivity?: MobileActivityItem[];
}): MobileHomePayload {
  return {
    userId: params.userId,
    stateCode: params.stateCode,
    unreadNotifications: params.unreadNotifications ?? 0,
    dashboardSummary: {},
    recentActivity: params.recentActivity ?? [],
    appConfig: DEFAULT_APP_CONFIG,
  };
}

export function getHealthStatus(): {
  depon: string;
  status: 'ok';
  version: string;
  minAppVersion: string;
} {
  const v = MIN_SUPPORTED_VERSION;
  return {
    depon: DEPON_ID,
    status: 'ok',
    version: '1.0.0',
    minAppVersion: `${v.major}.${v.minor}.${v.patch}`,
  };
}
