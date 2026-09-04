// SpajaUltraOmegaCore -∞Ω+∞ — EKZIST Registry
// Kompanija SPAJA — Digitalna Industrija

import type { EkzistResult } from './types';

// ─── In-memory session store ─────────────────────────────────────────────────

const sessionStore: Map<string, EkzistResult> = new Map();

export function upsertEkzistSession(result: EkzistResult): void {
  sessionStore.set(result.referenceId, result);
}

export function getSessionById(referenceId: string): EkzistResult | undefined {
  return sessionStore.get(referenceId);
}

export function getTotalSessions(): number {
  return sessionStore.size;
}

export function _resetRegistry(): void {
  sessionStore.clear();
}
