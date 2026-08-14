// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI Registry
// Kompanija SPAJA — Digitalna Industrija

import type { ZlatniRacun, ZlatniRacunCreateInput } from './types';
import { ZLATNI_TIER_CATALOG } from './types';
import { generateId } from './audit';

// ─── In-memory store ─────────────────────────────────────────────────────────

const racuniById = new Map<string, ZlatniRacun>();
const racuniByUserId = new Map<string, ZlatniRacun>();
const idempotencyKeys = new Set<string>();

// ─── Public API ──────────────────────────────────────────────────────────────

export function getRacunById(id: string): ZlatniRacun | undefined {
  return racuniById.get(id);
}

export function getRacunByUserId(userId: string): ZlatniRacun | undefined {
  return racuniByUserId.get(userId);
}

export function upsertRacun(input: ZlatniRacunCreateInput): ZlatniRacun {
  if (idempotencyKeys.has(input.idempotencyKey)) {
    const existing = racuniByUserId.get(input.userId);
    if (existing) return existing;
  }

  const existing = racuniByUserId.get(input.userId);
  if (existing) {
    idempotencyKeys.add(input.idempotencyKey);
    return existing;
  }

  const startTier = ZLATNI_TIER_CATALOG[0];
  const racun: ZlatniRacun = {
    id: generateId('zr'),
    userId: input.userId,
    tier: startTier.name,
    balance: 0,
    pointsAccrued: 0,
    joinedAt: new Date().toISOString(),
    status: 'active',
  };

  racuniById.set(racun.id, racun);
  racuniByUserId.set(racun.userId, racun);
  idempotencyKeys.add(input.idempotencyKey);
  return racun;
}

export function updateRacun(racun: ZlatniRacun): ZlatniRacun {
  racuniById.set(racun.id, racun);
  racuniByUserId.set(racun.userId, racun);
  return racun;
}

export function getTotalAccounts(): number {
  return racuniById.size;
}

export function _resetRegistry(): void {
  racuniById.clear();
  racuniByUserId.clear();
  idempotencyKeys.clear();
}
