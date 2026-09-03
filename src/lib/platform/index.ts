// SpajaUltraOmegaCore -∞Ω+∞ — Platform Unified Entry Point
// Kompanija SPAJA — Digitalna Industrija
//
// Centralni index koji eksportuje sve module platforme.
// Koristi lazy-loading pattern za optimalne performanse.
// Importuj odavde umesto direktno iz individualnih modula.

export type {
  AgentContract,
  AgentCapability,
  PersonaContract,
  PersonaAttributes,
  PersonaAuditEntry,
  PlatformConfig,
  ModuleConfig,
  PlatformApiResponse,
  PlatformApiMeta,
  ModuleHealth,
  ModuleHealthStatus,
  PlatformHealthReport,
} from '../types/platform.types';

// ─── Persona Bank ──────────────────────────────────────────────────────────────
export {
  registerPersona,
  getPersona,
  updatePersona,
  archivePersona,
  listPersonas,
  getPersonaBankStats,
  bulkImportPersonas,
  autoArchiveStalePersonas,
  PERSONA_BANK_CONTRACT_VERSION,
} from '../persona-bank';

// ─── Logger ────────────────────────────────────────────────────────────────────
export { logger } from '../logger';

// ─── Lazy module loaders ──────────────────────────────────────────────────────
// Use these to avoid loading all modules upfront. Each returns the module
// only when first called, keeping cold-start times minimal.

export const loadGigatron = () => import('../gigatron/gigatron-catalog');
export const loadDecibil = () => import('../decibil');
export const loadTrenazer = () => import('../trenazer');
export const loadPilotrelax = () => import('../pilotrelax');
export const loadDiscountTelecom = () => import('../discount-telecom');
export const loadGreatSumbion = () => import('../great-sumbion');
export const loadMadagaskar = () => import('../madagaskar');
export const loadMadagaskar2 = () => import('../madagaskar-2');
export const loadExtrimli = () => import('../extrimli');
export const loadExtrimliExtendol = () => import('../extrimli-extendol');
export const loadExtrimliKoron = () => import('../extrimli-koron');
export const loadExtrimliExtrondend = () => import('../extrimli-extrondend');
export const loadExtrimliExtrondol = () => import('../extrimli-extrondol');
export const loadExtrimliCuz = () => import('../extrimli-cuz');
export const loadDigitEngine = () => import('../digit-engine');
export const loadMaksimus = () => import('../maksimus');
export const loadAnotherMaks = () => import('../another-maks');
export const loadThem = () => import('../tarken-hingil-ekolan-maksimus');
export const loadForce = () => import('../force');

// ─── Platform default config ───────────────────────────────────────────────────
import type { PlatformConfig } from '../types/platform.types';

export const PLATFORM_VERSION = '1.0.0';

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  version: PLATFORM_VERSION,
  modules: {
    gigatron: { enabled: true, version: '1.0.0', apiBasePath: '/api/gigatron', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    decibil: { enabled: true, version: '1.0.0', apiBasePath: '/api/decibil', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    trenazer: { enabled: true, version: '1.0.0', apiBasePath: '/api/trenazer', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    pilotrelax: { enabled: true, version: '1.0.0', apiBasePath: '/api/pilotrelax', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    discountTelecom: { enabled: true, version: '1.0.0', apiBasePath: '/api/discount-telecom', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    greatSumbion: { enabled: true, version: '1.0.0', apiBasePath: '/api/great-sumbion', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    madagaskar: { enabled: true, version: '1.0.0', apiBasePath: '/api/madagaskar', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    extrimli: { enabled: true, version: '1.0.0', apiBasePath: '/api/extrimli', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    extrimliCuz: { enabled: true, version: '1.0.0', apiBasePath: '/api/extrimli-cuz', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    extrimliExtrondend: { enabled: true, version: '1.0.0', apiBasePath: '/api/extrimli/extrondend', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    extrimliExtrondol: { enabled: true, version: '1.0.0', apiBasePath: '/api/extrimli/extrondol', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    digitEngine: { enabled: true, version: '1.0.0', apiBasePath: '/api/digit-engine', performanceKpi: { evaluationMaxMs: 10, apiResponseMaxMs: 200 } },
    maksimus: { enabled: true, version: '1.0.0', apiBasePath: '/api/maksimus', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    anotherMaks: { enabled: true, version: '1.0.0', apiBasePath: '/api/another-maks', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    them: { enabled: true, version: '1.0.0', apiBasePath: '/api/tarken-hingil-ekolan-maksimus', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    novaGeneracija: { enabled: true, version: '1.0.0', apiBasePath: '/api/nova-generacija', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
    force: { enabled: true, version: '1.0.0', apiBasePath: '/api/force', performanceKpi: { evaluationMaxMs: 50, apiResponseMaxMs: 200 } },
  },
};
