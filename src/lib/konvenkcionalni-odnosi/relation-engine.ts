// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI Relation Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  CreateRelationInput,
  InteractionInput,
  Relation,
  RelationEvent,
  RelationHealthReport,
  RelationListFilter,
  StatusChangeInput,
} from './types';
import {
  KO_API_RESPONSE_MAX_MS,
  KO_CONTRACT_VERSION,
  KO_INITIATOR_ROLES,
  KO_MODULE_VERSION,
  KO_PERFORMANCE_MAX_MS,
  KO_PERSONA_ID,
  KO_RECIPIENT_ROLES,
  KO_VALID_TRANSITIONS,
} from './types';
import {
  countActiveRelations,
  countRelations,
  getRelationById,
  listRelations,
  saveRelation,
} from './registry';

// ─── ID helpers ───────────────────────────────────────────────────────────────

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

// ─── Result types ─────────────────────────────────────────────────────────────

export interface KoSuccess<T> {
  ok: true;
  data: T;
  durationMs: number;
}

export interface KoError {
  ok: false;
  error: string;
  durationMs: number;
}

export type KoResult<T> = KoSuccess<T> | KoError;

function ok<T>(data: T, start: number): KoSuccess<T> {
  return { ok: true, data, durationMs: Math.round((performance.now() - start) * 100) / 100 };
}

function err(error: string, start: number): KoError {
  return { ok: false, error, durationMs: Math.round((performance.now() - start) * 100) / 100 };
}

// ─── Validation helpers ───────────────────────────────────────────────────────

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function createRelation(input: CreateRelationInput): KoResult<Relation> {
  const start = performance.now();

  if (!isNonEmptyString(input?.initiatorId)) {
    return err('initiatorId must be a non-empty string', start);
  }
  if (!isNonEmptyString(input?.recipientId)) {
    return err('recipientId must be a non-empty string', start);
  }
  if (input.initiatorId.trim() === input.recipientId.trim()) {
    return err('self-relation is not allowed: initiatorId and recipientId must differ', start);
  }
  if (!input.type) {
    return err('type is required', start);
  }

  // Prevent duplicate active relations of the same type between the same pair
  const existing = listRelations({ type: input.type, status: 'ACTIVE' });
  const iid = input.initiatorId.trim();
  const rid = input.recipientId.trim();
  for (const rel of existing) {
    const ids = rel.parties.map((p) => p.entityId);
    if (ids.includes(iid) && ids.includes(rid)) {
      return err(
        `duplicate active ${input.type} relation already exists between these entities`,
        start,
      );
    }
  }

  const now = nowIso();
  const id = generateId('ko');

  const relation: Relation = {
    id,
    type: input.type,
    status: 'DRAFT',
    parties: [
      {
        entityId: iid,
        entityType: input.initiatorEntityType,
        role: KO_INITIATOR_ROLES[input.type],
        joinedAt: now,
      },
      {
        entityId: rid,
        entityType: input.recipientEntityType,
        role: KO_RECIPIENT_ROLES[input.type],
        joinedAt: now,
      },
    ],
    description: input.description,
    tags: input.tags,
    createdAt: now,
    updatedAt: now,
    events: [
      {
        eventId: generateId('ev'),
        relationId: id,
        type: 'created',
        actorId: iid,
        payload: { type: input.type },
        timestamp: now,
      },
    ],
  };

  saveRelation(relation);
  return ok(relation, start);
}

export function getRelation(id: string): KoResult<Relation> {
  const start = performance.now();
  if (!isNonEmptyString(id)) {
    return err('id must be a non-empty string', start);
  }
  const relation = getRelationById(id);
  if (!relation) {
    return err(`relation not found: ${id}`, start);
  }
  return ok(relation, start);
}

export function changeRelationStatus(input: StatusChangeInput): KoResult<Relation> {
  const start = performance.now();

  if (!isNonEmptyString(input?.relationId)) {
    return err('relationId must be a non-empty string', start);
  }
  if (!isNonEmptyString(input?.actorId)) {
    return err('actorId must be a non-empty string', start);
  }
  if (!input?.newStatus) {
    return err('newStatus is required', start);
  }

  const relation = getRelationById(input.relationId);
  if (!relation) {
    return err(`relation not found: ${input.relationId}`, start);
  }

  const allowed = KO_VALID_TRANSITIONS[relation.status];
  if (!allowed.includes(input.newStatus)) {
    return err(
      `invalid status transition: ${relation.status} → ${input.newStatus}`,
      start,
    );
  }

  const now = nowIso();
  const event: RelationEvent = {
    eventId: generateId('ev'),
    relationId: relation.id,
    type: 'status_changed',
    actorId: input.actorId.trim(),
    payload: { from: relation.status, to: input.newStatus, reason: input.reason },
    timestamp: now,
  };

  const updated: Relation = {
    ...relation,
    status: input.newStatus,
    updatedAt: now,
    events: [...relation.events, event],
  };

  saveRelation(updated);
  return ok(updated, start);
}

export function recordInteraction(input: InteractionInput): KoResult<Relation> {
  const start = performance.now();

  if (!isNonEmptyString(input?.relationId)) {
    return err('relationId must be a non-empty string', start);
  }
  if (!isNonEmptyString(input?.actorId)) {
    return err('actorId must be a non-empty string', start);
  }

  const relation = getRelationById(input.relationId);
  if (!relation) {
    return err(`relation not found: ${input.relationId}`, start);
  }

  if (relation.status === 'ARCHIVED' || relation.status === 'TERMINATED') {
    return err(
      `cannot record interaction on ${relation.status} relation`,
      start,
    );
  }

  const now = nowIso();
  const event: RelationEvent = {
    eventId: generateId('ev'),
    relationId: relation.id,
    type: input.note ? 'note_added' : 'interaction',
    actorId: input.actorId.trim(),
    payload: { ...(input.payload ?? {}), note: input.note },
    timestamp: now,
  };

  const updated: Relation = {
    ...relation,
    updatedAt: now,
    events: [...relation.events, event],
  };

  saveRelation(updated);
  return ok(updated, start);
}

export function queryRelations(filter?: RelationListFilter): KoResult<Relation[]> {
  const start = performance.now();
  const results = listRelations(filter);
  return ok(results, start);
}

export function getKoHealthReport(): RelationHealthReport {
  return {
    personaId: KO_PERSONA_ID,
    contractVersion: KO_CONTRACT_VERSION,
    moduleVersion: KO_MODULE_VERSION,
    totalRelations: countRelations(),
    activeRelations: countActiveRelations(),
    performanceMaxMs: KO_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: KO_API_RESPONSE_MAX_MS,
  };
}
