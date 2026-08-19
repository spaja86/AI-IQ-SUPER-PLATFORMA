// SpajaUltraOmegaCore -∞Ω+∞ — EKSELENCIO Registry
// Kompanija SPAJA — Digitalna Industrija

import type { EkselencioResult } from './types';

// ─── In-memory session store ─────────────────────────────────────────────────

const sessionStore: Map<string, EkselencioResult> = new Map();

export function upsertEkselencioSession(result: EkselencioResult): void {
  sessionStore.set(result.agentId, result);
}

export function getEkselencioSessionById(agentId: string): EkselencioResult | undefined {
  return sessionStore.get(agentId);
}

export function getTotalEkselencioSessions(): number {
  return sessionStore.size;
}

export function _resetEkselencioRegistry(): void {
  sessionStore.clear();
}
