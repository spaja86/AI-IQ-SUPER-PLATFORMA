// SpajaUltraOmegaCore -∞Ω+∞ — EPEKM-D: Permanent Routing Engine
// Kompanija SPAJA — Digitalna Industrija
//
// Maps agent persona aliases to permanent canonical email addresses.
// Supports alias resolution (multiple aliases → one canonical address).

import type { EpekmRouteEntry } from './types';
import { getIdentityByAlias } from './identity-registry';

// Additional alias → canonical overrides (beyond identity registry)
const _aliasOverrides = new Map<string, string>();

/**
 * Resolves an alias to its canonical address.
 * First checks override map, then falls back to identity registry.
 * Returns null if the alias is not registered or the identity is not active.
 */
export function resolveAlias(alias: string): string | null {
  const normalized = alias.toLowerCase().trim();

  // Check explicit overrides first
  const override = _aliasOverrides.get(normalized);
  if (override) return override;

  // Fall back to identity registry
  const identity = getIdentityByAlias(normalized);
  if (!identity) return null;
  if (identity.status !== 'active') return null;
  return identity.canonicalAddress;
}

/**
 * Registers an alias override that maps to a canonical address.
 * Useful for multi-platform routing (SUPER-PLATFORMA ↔ IO-OPENUI-AO sync).
 */
export function registerAliasOverride(alias: string, canonicalAddress: string): void {
  if (!alias || alias.trim() === '') {
    throw new Error('alias must not be empty');
  }
  if (!canonicalAddress || canonicalAddress.trim() === '') {
    throw new Error('canonicalAddress must not be empty');
  }
  _aliasOverrides.set(alias.toLowerCase().trim(), canonicalAddress.trim());
}

/**
 * Removes an alias override.
 */
export function removeAliasOverride(alias: string): boolean {
  return _aliasOverrides.delete(alias.toLowerCase().trim());
}

/**
 * Returns a full route entry for an alias.
 */
export function getRouteEntry(alias: string): EpekmRouteEntry | null {
  const normalized = alias.toLowerCase().trim();
  const canonical = resolveAlias(normalized);
  if (!canonical) return null;

  const identity = getIdentityByAlias(normalized);
  return {
    alias: normalized,
    canonicalAddress: canonical,
    agentRef: identity?.agentRef ?? 'unknown',
    active: identity?.status === 'active',
  };
}

/**
 * Lists all resolvable route entries (from identity registry only).
 */
export function listRoutes(): EpekmRouteEntry[] {
  const routes: EpekmRouteEntry[] = [];
  const overrides = Array.from(_aliasOverrides.entries()).map(([alias, canonicalAddress]) => ({
    alias,
    canonicalAddress,
    agentRef: 'override',
    active: true,
  }));
  return [...routes, ...overrides];
}

/** Clears overrides — for testing only */
export function _clearRoutingOverridesForTest(): void {
  _aliasOverrides.clear();
}
