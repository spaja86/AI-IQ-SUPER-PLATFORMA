// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI
// Kompanija SPAJA — Digitalna Industrija

export type RelationType =
  | 'hierarchical'
  | 'peer'
  | 'mentorship'
  | 'sponsorship'
  | 'collaboration'
  | 'contractual'
  | 'affiliation';

export type RelationStatus = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED' | 'TERMINATED';

export type RelationPartyRole = 'initiator' | 'recipient' | 'peer' | 'mentor' | 'mentee' | 'sponsor' | 'beneficiary';

export interface RelationParty {
  entityId: string;
  entityType: 'agent' | 'persona' | 'user' | 'organization' | 'system';
  role: RelationPartyRole;
  joinedAt: string;
}

export type RelationEventType =
  | 'created'
  | 'activated'
  | 'suspended'
  | 'archived'
  | 'terminated'
  | 'interaction'
  | 'status_changed'
  | 'note_added';

export interface RelationEvent {
  eventId: string;
  relationId: string;
  type: RelationEventType;
  actorId: string;
  payload?: Record<string, unknown>;
  timestamp: string;
}

export interface Relation {
  id: string;
  type: RelationType;
  status: RelationStatus;
  parties: [RelationParty, RelationParty];
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  events: RelationEvent[];
}

export interface CreateRelationInput {
  type: RelationType;
  initiatorId: string;
  initiatorEntityType: RelationParty['entityType'];
  recipientId: string;
  recipientEntityType: RelationParty['entityType'];
  description?: string;
  tags?: string[];
}

export interface StatusChangeInput {
  relationId: string;
  newStatus: RelationStatus;
  actorId: string;
  reason?: string;
}

export interface InteractionInput {
  relationId: string;
  actorId: string;
  payload?: Record<string, unknown>;
  note?: string;
}

export interface RelationListFilter {
  entityId?: string;
  type?: RelationType;
  status?: RelationStatus;
}

export interface RelationHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  totalRelations: number;
  activeRelations: number;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const KO_CONTRACT_VERSION = 'v1';
export const KO_MODULE_VERSION = '1.0.0';
export const KO_PERSONA_ID = 'konvenkcionalni-odnosi-core';
export const KO_PERFORMANCE_MAX_MS = 50;
export const KO_API_RESPONSE_MAX_MS = 200;

/** Valid status transitions */
export const KO_VALID_TRANSITIONS: Record<RelationStatus, RelationStatus[]> = {
  DRAFT: ['ACTIVE', 'TERMINATED'],
  ACTIVE: ['SUSPENDED', 'ARCHIVED', 'TERMINATED'],
  SUSPENDED: ['ACTIVE', 'TERMINATED'],
  ARCHIVED: [],
  TERMINATED: [],
};

export const KO_INITIATOR_ROLES: Record<RelationType, RelationPartyRole> = {
  hierarchical: 'initiator',
  peer: 'peer',
  mentorship: 'mentor',
  sponsorship: 'sponsor',
  collaboration: 'initiator',
  contractual: 'initiator',
  affiliation: 'initiator',
};

export const KO_RECIPIENT_ROLES: Record<RelationType, RelationPartyRole> = {
  hierarchical: 'recipient',
  peer: 'peer',
  mentorship: 'mentee',
  sponsorship: 'beneficiary',
  collaboration: 'recipient',
  contractual: 'recipient',
  affiliation: 'recipient',
};
