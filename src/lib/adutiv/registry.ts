// SpajaUltraOmegaCore -∞Ω+∞ — ADUTIV Registry
// Kompanija SPAJA — Digitalna Industrija

import type { AdutivResult } from './types';

// ─── In-memory session store ─────────────────────────────────────────────────

const sessionStore: Map<string, AdutivResult> = new Map();

export function upsertAdutivSession(result: AdutivResult): void {
  sessionStore.set(result.referenceId, result);
}

export function getSessionById(referenceId: string): AdutivResult | undefined {
  return sessionStore.get(referenceId);
}

export function getTotalSessions(): number {
  return sessionStore.size;
}

export function _resetRegistry(): void {
  sessionStore.clear();
}
