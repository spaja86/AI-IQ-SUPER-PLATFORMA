// SpajaUltraOmegaCore -∞Ω+∞ — EPEKM-D: Identity Registry
// Kompanija SPAJA — Digitalna Industrija
//
// Registers and stores permanent email identities per agent/persona.
// Generates unique canonical addresses and supports alias lookup.

import type {
  EpekmIdentity,
  EpekmIdentityStatus,
  EpekmRegistrationInput,
  EpekmRegistrationResult,
} from './types';

// In-memory registry (keyed by alias)
const _registry = new Map<string, EpekmIdentity>();

/**
 * Generates a canonical permanent email address from alias.
 * Format: <alias>@epekm.spaja.platform
 */
export function generateCanonicalAddress(alias: string): string {
  const sanitized = alias.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `${sanitized}@epekm.spaja.platform`;
}

/**
 * Generates a unique emailId.
 */
export function generateEmailId(alias: string): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 7);
  return `epekm-${alias.toLowerCase().replace(/[^a-z0-9]/g, '')}-${ts}-${rand}`;
}

/**
 * Registers a new permanent email identity.
 * Returns existing identity if alias is already registered (idempotent).
 */
export function registerIdentity(input: EpekmRegistrationInput): EpekmRegistrationResult {
  if (!input.alias || input.alias.trim() === '') {
    throw new Error('alias must not be empty');
  }
  if (!input.agentRef || input.agentRef.trim() === '') {
    throw new Error('agentRef must not be empty');
  }
  if (!Number.isFinite(input.octave) || input.octave < 0) {
    throw new Error('octave must be a non-negative finite number');
  }
  if (!Number.isFinite(input.nodeId) || input.nodeId < 0) {
    throw new Error('nodeId must be a non-negative finite number');
  }

  const normalizedAlias = input.alias.toLowerCase().trim();

  // Idempotent: return existing registration
  const existing = _registry.get(normalizedAlias);
  if (existing) {
    return {
      emailId: existing.emailId,
      alias: existing.alias,
      canonicalAddress: existing.canonicalAddress,
      status: existing.status,
      createdAt: existing.createdAt,
    };
  }

  const now = new Date().toISOString();
  const identity: EpekmIdentity = {
    emailId: generateEmailId(normalizedAlias),
    alias: normalizedAlias,
    canonicalAddress: generateCanonicalAddress(normalizedAlias),
    agentRef: input.agentRef,
    octave: input.octave,
    nodeId: input.nodeId,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };

  _registry.set(normalizedAlias, identity);

  return {
    emailId: identity.emailId,
    alias: identity.alias,
    canonicalAddress: identity.canonicalAddress,
    status: identity.status,
    createdAt: identity.createdAt,
  };
}

/**
 * Looks up an identity by alias.
 */
export function getIdentityByAlias(alias: string): EpekmIdentity | undefined {
  return _registry.get(alias.toLowerCase().trim());
}

/**
 * Updates the status of an identity.
 */
export function updateIdentityStatus(alias: string, status: EpekmIdentityStatus): boolean {
  const identity = _registry.get(alias.toLowerCase().trim());
  if (!identity) return false;
  identity.status = status;
  identity.updatedAt = new Date().toISOString();
  return true;
}

/**
 * Returns all registered identities.
 */
export function listIdentities(): EpekmIdentity[] {
  return Array.from(_registry.values());
}

/**
 * Returns the total count of registered identities.
 */
export function getIdentityCount(): number {
  return _registry.size;
}

/**
 * Returns the count of active identities.
 */
export function getActiveIdentityCount(): number {
  let count = 0;
  for (const identity of _registry.values()) {
    if (identity.status === 'active') count++;
  }
  return count;
}

/** Clears the registry — for testing only */
export function _clearRegistryForTest(): void {
  _registry.clear();
}
