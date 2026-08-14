// SpajaUltraOmegaCore -∞Ω+∞ — EPEKM-D: Eksoidnig Permanent Email Maksim Denter
// Kompanija SPAJA — Digitalna Industrija
//
// Shared TypeScript types za EPEKM-D — permanent email identity & delivery orchestration engine.
// Persona: epekm-denter-core (octave: 11, hipermreza node: 88)

// ─── Identity types ──────────────────────────────────────────────────────────

export type EpekmIdentityStatus = 'active' | 'archived' | 'dormant';

export interface EpekmIdentity {
  emailId: string;
  alias: string;
  canonicalAddress: string;
  agentRef: string;
  octave: number;
  nodeId: number;
  status: EpekmIdentityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EpekmRegistrationInput {
  alias: string;
  agentRef: string;
  octave: number;
  nodeId: number;
}

export interface EpekmRegistrationResult {
  emailId: string;
  alias: string;
  canonicalAddress: string;
  status: EpekmIdentityStatus;
  createdAt: string;
}

// ─── Message / delivery types ─────────────────────────────────────────────────

export type EpekmPayloadType = 'plain-text' | 'json' | 'agent-handoff';
export type EpekmDeliveryStatus = 'queued' | 'sent' | 'delivered' | 'bounced' | 'archived';

export interface EpekmMessage {
  messageId: string;
  fromAlias: string;
  toAlias: string;
  payloadType: EpekmPayloadType;
  payload: string;
  createdAt: string;
}

export interface EpekmSendInput {
  fromAlias: string;
  toAlias: string;
  payloadType: EpekmPayloadType;
  payload: string;
  /** Optional idempotency key — if omitted, a new messageId is generated */
  messageId?: string;
}

export interface EpekmSendResult {
  messageId: string;
  status: EpekmDeliveryStatus;
  fromAlias: string;
  toAlias: string;
  sentAt: string;
  retryCount: number;
}

export interface EpekmDeliveryRecord {
  messageId: string;
  status: EpekmDeliveryStatus;
  retryCount: number;
  lastAttemptAt: string;
  deliveredAt: string | null;
  error: string | null;
}

// ─── Routing types ────────────────────────────────────────────────────────────

export interface EpekmRouteEntry {
  alias: string;
  canonicalAddress: string;
  agentRef: string;
  active: boolean;
}

// ─── Orchestrator types ───────────────────────────────────────────────────────

export type EpekmDenterAction =
  | 'register'
  | 'resolve'
  | 'send'
  | 'status'
  | 'health';

export interface DenterRequest {
  action: EpekmDenterAction;
  payload: unknown;
  requestId: string;
  timestamp: string;
}

export interface DenterResponse<T = unknown> {
  requestId: string;
  action: EpekmDenterAction;
  success: boolean;
  data: T | null;
  error: string | null;
  durationMs: number;
  timestamp: string;
}

// ─── Health types ─────────────────────────────────────────────────────────────

export interface EpekmHealthReport {
  status: 'ok' | 'degraded';
  registeredIdentities: number;
  activeIdentities: number;
  totalMessages: number;
  pendingDeliveries: number;
  contractVersion: string;
  moduleVersion: string;
  persona: string;
  octave: number;
  hipermrezaNode: number;
  timestamp: string;
}
