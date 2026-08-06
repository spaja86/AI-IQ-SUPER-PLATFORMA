// SpajaUltraOmegaCore -∞Ω+∞ — Persona Bank Store
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory persona store sa verzioniranjem, audit logom i soft-delete.
// Svaka mutacija kreira novi version snapshot.

import { randomUUID } from 'crypto';
import type {
  Persona,
  PersonaRegistrationInput,
  PersonaUpdateInput,
  PersonaBankListFilter,
  PersonaBankStats,
  PersonaStatus,
  PersonaType,
} from './types';

const STALE_DAYS = 30;

// ─── In-memory store ─────────────────────────────────────────────────────────

const personas = new Map<string, Persona>();
const locks = new Set<string>();

// ─── Lock helpers ─────────────────────────────────────────────────────────────

function acquireLock(id: string): boolean {
  if (locks.has(id)) return false;
  locks.add(id);
  return true;
}

function releaseLock(id: string): void {
  locks.delete(id);
}

// ─── Core operations ─────────────────────────────────────────────────────────

/**
 * Registers a new persona into the bank. If a persona with the same id already
 * exists it is upserted (version bumped).
 */
export function registerPersona(input: PersonaRegistrationInput, agentId: string): Persona {
  const id = input.id ?? randomUUID();

  if (!acquireLock(id)) {
    throw new Error(`Persona lock conflict: ${id} is being modified by another operation`);
  }

  try {
    const now = new Date().toISOString();
    const existing = personas.get(id);

    if (existing) {
      // Upsert — treat as update
      const updated: Persona = {
        ...existing,
        name: input.name,
        type: input.type,
        octave: input.octave,
        hipermrezaNode: input.hipermrezaNode,
        attributes: input.attributes,
        linkedAgents: input.linkedAgents ?? existing.linkedAgents,
        crossRepoRef: input.crossRepoRef ?? existing.crossRepoRef,
        status: existing.status === 'archived' ? 'active' : existing.status,
        version: existing.version + 1,
        updatedAt: now,
        auditLog: [
          ...existing.auditLog,
          {
            agentId,
            timestamp: now,
            changeType: 'register',
            diff: { name: input.name, type: input.type, octave: input.octave, hipermrezaNode: input.hipermrezaNode },
          },
        ],
      };
      personas.set(id, updated);
      return updated;
    }

    const persona: Persona = {
      id,
      name: input.name,
      type: input.type,
      octave: input.octave,
      hipermrezaNode: input.hipermrezaNode,
      attributes: input.attributes,
      status: 'active',
      linkedAgents: input.linkedAgents ?? [],
      crossRepoRef: input.crossRepoRef,
      version: 1,
      createdAt: now,
      updatedAt: now,
      auditLog: [
        {
          agentId,
          timestamp: now,
          changeType: 'register',
          diff: { name: input.name, type: input.type, octave: input.octave },
        },
      ],
    };
    personas.set(id, persona);
    return persona;
  } finally {
    releaseLock(id);
  }
}

/**
 * Returns a single persona by id or null if not found.
 */
export function getPersona(id: string): Persona | null {
  return personas.get(id) ?? null;
}

/**
 * Updates mutable fields of a persona (non-destructive, bumps version).
 */
export function updatePersona(id: string, input: PersonaUpdateInput, agentId: string): Persona {
  if (!acquireLock(id)) {
    throw new Error(`Persona lock conflict: ${id} is being modified by another operation`);
  }

  try {
    const existing = personas.get(id);
    if (!existing) throw new Error(`Persona not found: ${id}`);
    if (existing.status === 'archived') throw new Error(`Cannot update archived persona: ${id}`);

    const now = new Date().toISOString();
    const updated: Persona = {
      ...existing,
      name: input.name ?? existing.name,
      attributes: input.attributes ? { ...existing.attributes, ...input.attributes } : existing.attributes,
      linkedAgents: input.linkedAgents ?? existing.linkedAgents,
      octave: input.octave ?? existing.octave,
      hipermrezaNode: input.hipermrezaNode ?? existing.hipermrezaNode,
      crossRepoRef: input.crossRepoRef ?? existing.crossRepoRef,
      version: existing.version + 1,
      updatedAt: now,
      auditLog: [
        ...existing.auditLog,
        {
          agentId,
          timestamp: now,
          changeType: 'update',
          diff: input as Partial<Persona>,
        },
      ],
    };
    personas.set(id, updated);
    return updated;
  } finally {
    releaseLock(id);
  }
}

/**
 * Soft-deletes a persona (sets status to 'archived').
 */
export function archivePersona(id: string, agentId: string): Persona {
  if (!acquireLock(id)) {
    throw new Error(`Persona lock conflict: ${id} is being modified by another operation`);
  }

  try {
    const existing = personas.get(id);
    if (!existing) throw new Error(`Persona not found: ${id}`);

    const now = new Date().toISOString();
    const archived: Persona = {
      ...existing,
      status: 'archived',
      version: existing.version + 1,
      updatedAt: now,
      auditLog: [
        ...existing.auditLog,
        {
          agentId,
          timestamp: now,
          changeType: 'archive',
          diff: { status: 'archived' },
        },
      ],
    };
    personas.set(id, archived);
    return archived;
  } finally {
    releaseLock(id);
  }
}

/**
 * Returns all personas, optionally filtered.
 */
export function listPersonas(filter?: PersonaBankListFilter): Persona[] {
  let result = Array.from(personas.values());

  if (filter?.type) result = result.filter((p) => p.type === filter.type);
  if (filter?.status) result = result.filter((p) => p.status === filter.status);
  if (filter?.octave !== undefined) result = result.filter((p) => p.octave === filter.octave);
  if (filter?.agent) result = result.filter((p) => p.linkedAgents.includes(filter.agent!));

  return result;
}

/**
 * Returns aggregate statistics about the persona bank.
 */
export function getPersonaBankStats(): PersonaBankStats {
  const all = Array.from(personas.values());
  const now = Date.now();

  const byStatus: Record<PersonaStatus, number> = { active: 0, dormant: 0, archived: 0 };
  const byType: Record<PersonaType, number> = {
    creative: 0,
    analytical: 0,
    gaming: 0,
    gigatron: 0,
    'nova-generacija': 0,
    'another-maks': 0,
    maksimus: 0,
    'tarken-hingil-ekolan-maksimus': 0,
    generic: 0,
  };
  const byOctave: Record<number, number> = {};
  const byAgent: Record<string, number> = {};
  let staleCount = 0;
  const activeOctaves = new Set<number>();

  for (const p of all) {
    byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;
    byType[p.type] = (byType[p.type] ?? 0) + 1;
    byOctave[p.octave] = (byOctave[p.octave] ?? 0) + 1;
    for (const agent of p.linkedAgents) {
      byAgent[agent] = (byAgent[agent] ?? 0) + 1;
    }
    if (p.status === 'active') activeOctaves.add(p.octave);

    const daysSinceUpdate = (now - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (p.status === 'dormant' && daysSinceUpdate > STALE_DAYS) staleCount++;
  }

  return {
    total: all.length,
    byStatus,
    byType,
    byOctave,
    byAgent,
    staleCount,
    octaveCoverage: activeOctaves.size,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Bulk import: registers multiple personas, returns results.
 */
export function bulkImportPersonas(
  inputs: PersonaRegistrationInput[],
  agentId: string,
): { imported: number; errors: string[] } {
  let imported = 0;
  const errors: string[] = [];

  for (const input of inputs) {
    try {
      registerPersona(input, agentId);
      imported++;
    } catch (e) {
      errors.push(`${input.name ?? input.id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return { imported, errors };
}

/**
 * Marks dormant personas stale (> STALE_DAYS) as archived. Returns count.
 * Used by the nightly lifecycle agent.
 */
export function autoArchiveStalePersonas(agentId: string): number {
  const now = Date.now();
  let count = 0;

  for (const p of Array.from(personas.values())) {
    if (p.status !== 'dormant') continue;
    const daysSinceUpdate = (now - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > STALE_DAYS) {
      try {
        archivePersona(p.id, agentId);
        count++;
      } catch {
        // ignore lock conflicts during batch
      }
    }
  }

  return count;
}

/**
 * Resets the store (test use only).
 */
export function _resetPersonaBankStore(): void {
  personas.clear();
  locks.clear();
}
