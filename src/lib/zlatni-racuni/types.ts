// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI
// Kompanija SPAJA — Digitalna Industrija

export type ZlatniTierName = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type ZlatniRacunStatus = 'active' | 'frozen' | 'archived';
export type ZlatniTransakcijaType = 'credit' | 'debit' | 'bonus' | 'penalty';
export type ZlatniSourceModule =
  | 'gigatron'
  | 'discount-telecom'
  | 'madagaskar'
  | 'extrimli'
  | 'manual'
  | 'system';

// ─── Core entities ───────────────────────────────────────────────────────────

export interface ZlatniRacun {
  id: string;
  userId: string;
  tier: ZlatniTierName;
  balance: number;
  pointsAccrued: number;
  joinedAt: string;
  status: ZlatniRacunStatus;
}

export interface ZlatniTier {
  name: ZlatniTierName;
  minPoints: number;
  maxPoints: number;
  perks: string[];
  discountRate: number;
  priorityLevel: number;
}

export interface ZlatniTransakcija {
  id: string;
  racunId: string;
  type: ZlatniTransakcijaType;
  amount: number;
  timestamp: string;
  source: ZlatniSourceModule;
  metadata?: Record<string, unknown>;
}

export interface ZlatniPerk {
  id: string;
  name: string;
  description: string;
  eligibleTiers: ZlatniTierName[];
  validFrom: string;
  validTo: string;
}

// ─── Input / output shapes ───────────────────────────────────────────────────

export interface ZlatniRacunCreateInput {
  userId: string;
  idempotencyKey: string;
}

export interface ZlatniPointsInput {
  racunId: string;
  type: ZlatniTransakcijaType;
  amount: number;
  source: ZlatniSourceModule;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
}

export interface ZlatniTierResult {
  current: ZlatniTier;
  next: ZlatniTier | null;
  pointsToNextTier: number | null;
  progressPercent: number;
}

export interface ZlatniHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  totalAccounts: number;
  totalTransactions: number;
  performanceLookupMaxMs: number;
  performanceTierMaxMs: number;
  performanceApiMaxMs: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const ZLATNI_CONTRACT_VERSION = 'v1';
export const ZLATNI_MODULE_VERSION = '1.0.0';
export const ZLATNI_PERSONA_ID = 'zlatni-racuni-core';
export const ZLATNI_PERFORMANCE_LOOKUP_MAX_MS = 10;
export const ZLATNI_PERFORMANCE_TIER_MAX_MS = 50;
export const ZLATNI_API_RESPONSE_MAX_MS = 200;
export const ZLATNI_TRANSACTION_APPEND_MAX_MS = 100;

export const ZLATNI_TIER_CATALOG: ZlatniTier[] = [
  {
    name: 'BRONZE',
    minPoints: 0,
    maxPoints: 999,
    perks: ['bronze-welcome'],
    discountRate: 0.01,
    priorityLevel: 1,
  },
  {
    name: 'SILVER',
    minPoints: 1000,
    maxPoints: 4999,
    perks: ['silver-discount', 'silver-support'],
    discountRate: 0.03,
    priorityLevel: 2,
  },
  {
    name: 'GOLD',
    minPoints: 5000,
    maxPoints: 19999,
    perks: ['gold-discount', 'gold-support', 'gold-early-access'],
    discountRate: 0.07,
    priorityLevel: 3,
  },
  {
    name: 'PLATINUM',
    minPoints: 20000,
    maxPoints: Infinity,
    perks: ['platinum-discount', 'platinum-support', 'platinum-early-access', 'platinum-vip'],
    discountRate: 0.12,
    priorityLevel: 4,
  },
];

export const ZLATNI_POINTS_EARN_RATES: Record<ZlatniSourceModule, number> = {
  gigatron: 1.0,
  'discount-telecom': 1.5,
  madagaskar: 2.0,
  extrimli: 1.2,
  manual: 1.0,
  system: 1.0,
};
