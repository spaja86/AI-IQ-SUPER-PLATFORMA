// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2: FX Engine
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory FX rate registry with direct + inverse lookup and cent conversion.

import type { FxRate } from './types';

// ─── Seed rates ───────────────────────────────────────────────────────────────

const SEED_RATES: FxRate[] = [
  { from: 'EUR', to: 'USD', rate: 1.08,   asOf: '2026-08-01T00:00:00Z' },
  { from: 'EUR', to: 'NZD', rate: 1.78,   asOf: '2026-08-01T00:00:00Z' },
  { from: 'EUR', to: 'AUD', rate: 1.65,   asOf: '2026-08-01T00:00:00Z' },
  { from: 'EUR', to: 'GBP', rate: 0.86,   asOf: '2026-08-01T00:00:00Z' },
  { from: 'EUR', to: 'CHF', rate: 0.97,   asOf: '2026-08-01T00:00:00Z' },
  { from: 'USD', to: 'NZD', rate: 1.65,   asOf: '2026-08-01T00:00:00Z' },
  { from: 'USD', to: 'AUD', rate: 1.53,   asOf: '2026-08-01T00:00:00Z' },
  { from: 'USD', to: 'GBP', rate: 0.80,   asOf: '2026-08-01T00:00:00Z' },
  { from: 'NZD', to: 'AUD', rate: 0.93,   asOf: '2026-08-01T00:00:00Z' },
  { from: 'EUR', to: 'JPY', rate: 162.50, asOf: '2026-08-01T00:00:00Z' },
  { from: 'USD', to: 'JPY', rate: 150.46, asOf: '2026-08-01T00:00:00Z' },
];

// ─── Registry ─────────────────────────────────────────────────────────────────

/** Key: "FROM:TO" */
let _rates: Map<string, FxRate> = new Map(SEED_RATES.map((r) => [`${r.from}:${r.to}`, r]));

function rateKey(from: string, to: string): string {
  return `${from}:${to}`;
}

/** @internal — reset to seed state (for tests). */
export function _resetFxRates(): void {
  _rates = new Map(SEED_RATES.map((r) => [`${r.from}:${r.to}`, r]));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the direct FxRate for the pair, or attempts an inverse lookup.
 * Returns undefined if no pair (direct or inverse) is available.
 */
export function getFxRate(from: string, to: string): FxRate | undefined {
  if (from === to) {
    return { from, to, rate: 1, asOf: new Date().toISOString() };
  }
  const direct = _rates.get(rateKey(from, to));
  if (direct) return direct;

  // Inverse lookup
  const inverse = _rates.get(rateKey(to, from));
  if (inverse) {
    return {
      from,
      to,
      rate: 1 / inverse.rate,
      asOf: inverse.asOf,
    };
  }

  return undefined;
}

/**
 * Converts an amount in minor currency units (cents) from one currency to another.
 * Returns 0 for invalid inputs or unknown pairs.
 */
export function convertCents(cents: number, from: string, to: string): number {
  if (!Number.isFinite(cents) || cents < 0) return 0;
  if (from === to) return cents;

  const rate = getFxRate(from, to);
  if (!rate) return 0;

  return Math.round(cents * rate.rate);
}

/** Returns all registered FX rates (direct pairs only). */
export function listFxRates(): FxRate[] {
  return Array.from(_rates.values());
}

/** Inserts or updates a FX rate. */
export function upsertFxRate(rate: FxRate): void {
  _rates.set(rateKey(rate.from, rate.to), rate);
}

/** Returns the count of registered FX rate pairs. */
export function getFxRateCount(): number {
  return _rates.size;
}
