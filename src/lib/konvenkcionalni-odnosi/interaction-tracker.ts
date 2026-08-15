// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI Interaction Tracker
// Kompanija SPAJA — Digitalna Industrija

import type { RelationEvent, RelationEventType } from './types';

/** In-memory interaction log (per-session) */
const interactionLog: RelationEvent[] = [];

export function appendInteraction(event: RelationEvent): void {
  interactionLog.push({ ...event });
}

export function getInteractionsByRelation(relationId: string): RelationEvent[] {
  return interactionLog
    .filter((e) => e.relationId === relationId)
    .map((e) => ({ ...e }));
}

export function getInteractionsByActor(actorId: string): RelationEvent[] {
  return interactionLog
    .filter((e) => e.actorId === actorId)
    .map((e) => ({ ...e }));
}

export function getInteractionsByType(type: RelationEventType): RelationEvent[] {
  return interactionLog
    .filter((e) => e.type === type)
    .map((e) => ({ ...e }));
}

export function countInteractions(): number {
  return interactionLog.length;
}

/** For testing only */
export function _resetInteractionLog(): void {
  interactionLog.length = 0;
}
