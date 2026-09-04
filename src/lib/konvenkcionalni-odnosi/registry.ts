// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI Registry
// Kompanija SPAJA — Digitalna Industrija

import type { Relation, RelationListFilter } from './types';

// ─── In-memory store ──────────────────────────────────────────────────────────

const store = new Map<string, Relation>();

// ─── Public API ───────────────────────────────────────────────────────────────

export function saveRelation(relation: Relation): void {
  store.set(relation.id, { ...relation });
}

export function getRelationById(id: string): Relation | undefined {
  const r = store.get(id);
  return r ? { ...r, events: [...r.events] } : undefined;
}

export function listRelations(filter?: RelationListFilter): Relation[] {
  let results = Array.from(store.values());

  if (filter?.entityId) {
    const eid = filter.entityId;
    results = results.filter((r) => r.parties.some((p) => p.entityId === eid));
  }
  if (filter?.type) {
    results = results.filter((r) => r.type === filter.type);
  }
  if (filter?.status) {
    results = results.filter((r) => r.status === filter.status);
  }

  return results.map((r) => ({ ...r, events: [...r.events] }));
}

export function deleteRelation(id: string): boolean {
  return store.delete(id);
}

export function countRelations(): number {
  return store.size;
}

export function countActiveRelations(): number {
  let count = 0;
  for (const r of store.values()) {
    if (r.status === 'ACTIVE') count++;
  }
  return count;
}

/** For testing only */
export function _resetRegistry(): void {
  store.clear();
}
