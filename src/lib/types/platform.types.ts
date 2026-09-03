// SpajaUltraOmegaCore -∞Ω+∞ — Platform Shared Types
// Kompanija SPAJA — Digitalna Industrija
//
// Canonical shared TypeScript contracts for all platform modules and agents.
// Every agent, module, and API route should import from here for type safety.

// ─── Agent Contract ───────────────────────────────────────────────────────────

export interface AgentCapability {
  name: string;
  version: string;
  endpoint?: string;
}

export interface AgentContract {
  id: string;
  name: string;
  version: string;
  octave: number; // 1–16
  hipermrezaNode: number; // 1–256
  capabilities: AgentCapability[];
  linkedAgents: string[];
  performanceKpi: {
    evaluationMaxMs: number;
    apiResponseMaxMs: number;
    buildMaxMs?: number;
  };
  status: 'active' | 'dormant' | 'planned' | 'archived';
  scope: string;
  owner: string;
}

// ─── Persona Contract ─────────────────────────────────────────────────────────

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
  changeType: 'register' | 'update' | 'archive' | 'restore';
  diff: Record<string, unknown>;
}

export interface PersonaContract {
  id: string;
  name: string;
  type: string;
  octave: number; // 1–16
  hipermrezaNode: number; // 1–256
  attributes: PersonaAttributes;
  status: 'active' | 'dormant' | 'archived';
  linkedAgents: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
  crossRepoRef?: string;
  auditLog: PersonaAuditEntry[];
}

// ─── Platform Config ──────────────────────────────────────────────────────────

export interface ModuleConfig {
  enabled: boolean;
  version: string;
  apiBasePath: string;
  performanceKpi: {
    evaluationMaxMs: number;
    apiResponseMaxMs: number;
  };
}

export interface PlatformConfig {
  version: string;
  modules: {
    gigatron: ModuleConfig;
    decibil: ModuleConfig;
    trenazer: ModuleConfig;
    pilotrelax: ModuleConfig;
    discountTelecom: ModuleConfig;
    greatSumbion: ModuleConfig;
    madagaskar: ModuleConfig;
    extrimli: ModuleConfig;
    extrimliCuz: ModuleConfig;
    digitEngine: ModuleConfig;
    maksimus: ModuleConfig;
    anotherMaks: ModuleConfig;
    them: ModuleConfig; // tarken-hingil-ekolan-maksimus
    novaGeneracija: ModuleConfig;
    force: ModuleConfig;
  };
}

// ─── Standard API Response ────────────────────────────────────────────────────

export interface PlatformApiMeta {
  module: string;
  version: string;
  timestamp: string;
  nodeId?: number;
}

export interface PlatformApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta: PlatformApiMeta;
}

// ─── Module Health ────────────────────────────────────────────────────────────

export type ModuleHealthStatus = 'healthy' | 'degraded' | 'unavailable';

export interface ModuleHealth {
  module: string;
  status: ModuleHealthStatus;
  version: string;
  lastCheckedAt: string;
  kpi?: {
    evaluationMs?: number;
    apiResponseMs?: number;
  };
}

export interface PlatformHealthReport {
  overall: ModuleHealthStatus;
  modules: ModuleHealth[];
  personaBankCoverage: {
    totalPersonas: number;
    activePersonas: number;
    octaveCoverage: number[]; // 1–16
    nodeCoverage: number[]; // 1–256
  };
  timestamp: string;
}
