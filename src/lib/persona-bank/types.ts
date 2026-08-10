// SpajaUltraOmegaCore -∞Ω+∞ — Persona Bank
// Kompanija SPAJA — Digitalna Industrija
//
// Canonical TypeScript types za unified Persona Banking sistem.
// Svaki agent (MAKSIMUS 2/3, ANOTHER MAKS, Nova Generacija, GIGATRON, itd.)
// registruje, čita i ažurira persone kroz ovaj modul.

export type PersonaType =
  | 'creative'
  | 'analytical'
  | 'gaming'
  | 'gigatron'
  | 'nova-generacija'
  | 'another-maks'
  | 'maksimus'
  | 'tarken-hingil-ekolan-maksimus'
  | 'discount-telecom'
  | 'generic';

export type PersonaStatus = 'active' | 'dormant' | 'archived';

export type PersonaChangeType = 'register' | 'update' | 'archive' | 'restore';

export interface PersonaAttributes {
  traits: string[];
  skills: string[];
  tone: string;
  domain: string;
  [key: string]: unknown;
}

export interface PersonaAuditEntry {
  agentId: string;
  timestamp: string;
  changeType: PersonaChangeType;
  diff: Partial<Omit<Persona, 'auditLog'>>;
}

export interface Persona {
  id: string;
  name: string;
  type: PersonaType;
  octave: number; // 1–16
  hipermrezaNode: number; // 1–256
  attributes: PersonaAttributes;
  status: PersonaStatus;
  linkedAgents: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
  crossRepoRef?: string; // reference to IO-OPENUI-AO persona id
  auditLog: PersonaAuditEntry[];
}

export interface PersonaRegistrationInput {
  id?: string;
  name: string;
  type: PersonaType;
  octave: number;
  hipermrezaNode: number;
  attributes: PersonaAttributes;
  linkedAgents?: string[];
  crossRepoRef?: string;
}

export interface PersonaUpdateInput {
  name?: string;
  attributes?: Partial<PersonaAttributes>;
  linkedAgents?: string[];
  octave?: number;
  hipermrezaNode?: number;
  crossRepoRef?: string;
}

export interface PersonaBankStats {
  total: number;
  byStatus: Record<PersonaStatus, number>;
  byType: Record<PersonaType, number>;
  byOctave: Record<number, number>;
  byAgent: Record<string, number>;
  staleCount: number; // dormant > 30 days
  octaveCoverage: number; // number of distinct octaves with at least one active persona
  generatedAt: string;
}

export interface PersonaBankListFilter {
  type?: PersonaType;
  status?: PersonaStatus;
  octave?: number;
  agent?: string;
}
