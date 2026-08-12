// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ
// Kompanija SPAJA — Digitalna Industrija

import type { Crew, CrewMembership, CrewJoinResult } from './types';
import { generateId, isNonEmptyString } from './utils';

const CREW_STORE: Map<string, Crew> = new Map();
const MEMBERSHIP_STORE: Map<string, CrewMembership[]> = new Map(); // keyed by crewId

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMemberships(crewId: string): CrewMembership[] {
  return MEMBERSHIP_STORE.get(crewId) ?? [];
}

function saveMembership(membership: CrewMembership): void {
  const list = getMemberships(membership.crewId);
  const idx = list.findIndex((m) => m.athleteId === membership.athleteId);
  if (idx >= 0) {
    list[idx] = membership;
  } else {
    list.push(membership);
  }
  MEMBERSHIP_STORE.set(membership.crewId, list);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function createCrew(data: {
  name: string;
  captainId: string;
  sportIds: string[];
  region: string;
  isPublic?: boolean;
}): Crew {
  if (!isNonEmptyString(data.name)) throw new Error('name is required');
  if (!isNonEmptyString(data.captainId)) throw new Error('captainId is required');
  if (!Array.isArray(data.sportIds) || data.sportIds.length === 0) throw new Error('sportIds must be a non-empty array');
  if (!isNonEmptyString(data.region)) throw new Error('region is required');

  const crew: Crew = {
    id: generateId('crew'),
    name: data.name.trim(),
    captainId: data.captainId,
    sportIds: data.sportIds,
    memberIds: [data.captainId],
    region: data.region.trim(),
    isPublic: data.isPublic ?? true,
    createdAt: Date.now(),
  };

  CREW_STORE.set(crew.id, crew);
  return { ...crew };
}

export function getCrew(id: string): Crew | undefined {
  const crew = CREW_STORE.get(id);
  return crew ? { ...crew } : undefined;
}

export function listCrews(filter?: { sportId?: string; region?: string; isPublic?: boolean }): Crew[] {
  return Array.from(CREW_STORE.values())
    .filter((c) => {
      if (filter?.sportId  !== undefined && !c.sportIds.includes(filter.sportId)) return false;
      if (filter?.region   !== undefined && c.region !== filter.region) return false;
      if (filter?.isPublic !== undefined && c.isPublic !== filter.isPublic) return false;
      return true;
    })
    .map((c) => ({ ...c }));
}

export function joinCrew(crewId: string, athleteId: string): CrewJoinResult {
  const crew = CREW_STORE.get(crewId);
  if (!crew) {
    return { crewId, athleteId, success: false, message: 'crew not found' };
  }
  if (!isNonEmptyString(athleteId)) {
    return { crewId, athleteId, success: false, message: 'athleteId is required' };
  }
  if (crew.memberIds.includes(athleteId)) {
    return { crewId, athleteId, success: false, message: 'already a member' };
  }

  const existing = getMemberships(crewId).find((m) => m.athleteId === athleteId);
  if (existing?.state === 'pending') {
    return { crewId, athleteId, success: false, message: 'join request already pending' };
  }

  if (crew.isPublic) {
    crew.memberIds.push(athleteId);
    CREW_STORE.set(crewId, crew);
    saveMembership({ crewId, athleteId, state: 'accepted', requestedAt: Date.now(), resolvedAt: Date.now() });
    return { crewId, athleteId, success: true, message: 'joined crew' };
  }

  saveMembership({ crewId, athleteId, state: 'pending', requestedAt: Date.now() });
  return { crewId, athleteId, success: true, message: 'join request submitted — awaiting captain approval' };
}

export function acceptMember(crewId: string, captainId: string, athleteId: string): CrewJoinResult {
  const crew = CREW_STORE.get(crewId);
  if (!crew) return { crewId, athleteId, success: false, message: 'crew not found' };
  if (crew.captainId !== captainId) return { crewId, athleteId, success: false, message: 'only the captain can accept members' };

  const membership = getMemberships(crewId).find((m) => m.athleteId === athleteId && m.state === 'pending');
  if (!membership) return { crewId, athleteId, success: false, message: 'no pending request from this athlete' };

  membership.state = 'accepted';
  membership.resolvedAt = Date.now();
  saveMembership(membership);

  crew.memberIds.push(athleteId);
  CREW_STORE.set(crewId, crew);
  return { crewId, athleteId, success: true, message: 'member accepted' };
}

export function leaveCrew(crewId: string, athleteId: string): CrewJoinResult {
  const crew = CREW_STORE.get(crewId);
  if (!crew) return { crewId, athleteId, success: false, message: 'crew not found' };
  if (!crew.memberIds.includes(athleteId)) return { crewId, athleteId, success: false, message: 'not a member' };
  if (crew.captainId === athleteId) return { crewId, athleteId, success: false, message: 'captain cannot leave — transfer captaincy first' };

  crew.memberIds = crew.memberIds.filter((id) => id !== athleteId);
  CREW_STORE.set(crewId, crew);

  const membership = getMemberships(crewId).find((m) => m.athleteId === athleteId);
  if (membership) {
    membership.state = 'left';
    membership.resolvedAt = Date.now();
    saveMembership(membership);
  }

  return { crewId, athleteId, success: true, message: 'left crew' };
}

export function transferCaptaincy(crewId: string, currentCaptainId: string, newCaptainId: string): Crew {
  const crew = CREW_STORE.get(crewId);
  if (!crew) throw new Error('crew not found');
  if (crew.captainId !== currentCaptainId) throw new Error('only the current captain can transfer captaincy');
  if (!crew.memberIds.includes(newCaptainId)) throw new Error('new captain must already be a member');

  crew.captainId = newCaptainId;
  CREW_STORE.set(crewId, crew);
  return { ...crew };
}

export function getCrewMemberships(crewId: string): CrewMembership[] {
  return getMemberships(crewId).map((m) => ({ ...m }));
}

export function _resetCrewStore(): void {
  CREW_STORE.clear();
  MEMBERSHIP_STORE.clear();
}
