// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG Types
// Kompanija SPAJA — Digitalna Industrija

export const CHATGPT_KATALOG_CONTRACT_VERSION = 'v1';
export const CHATGPT_KATALOG_MODULE_VERSION = '1.0.0';
export const CHATGPT_KATALOG_PERSONA_ID = 'chatgpt-katalog-core';
export const CHATGPT_KATALOG_DISPLAY_NAME = 'ChatGPT Katalog';
export const CHATGPT_KATALOG_SLUG = 'chatgpt-katalog';
export const CHATGPT_KATALOG_OCTAVE = 10;
export const CHATGPT_KATALOG_HIPERMREZA_NODE = 81;

// Performance KPIs
export const CHATGPT_KATALOG_SEARCH_MAX_MS = 50;
export const CHATGPT_KATALOG_COMPARE_MAX_MS = 100;
export const CHATGPT_KATALOG_API_RESPONSE_MAX_MS = 200;
export const CHATGPT_KATALOG_REGISTRY_LOOKUP_MAX_MS = 10;

export const CHATGPT_KATALOG_MAX_COMPARE_ENTRIES = 4;

export const CHATGPT_KATALOG_DISCLAIMER =
  'ChatGPT Katalog rezultati su automatski generisani. Informacije o modelima, cenama i performansama su referentne i mogu se razlikovati od aktuelnih OpenAI podataka.';

// ─── Entry Types ─────────────────────────────────────────────────────────────

export type EntryType = 'model' | 'tool' | 'use-case';

export type ModelStatus = 'active' | 'deprecated' | 'preview' | 'legacy';

export type SpeedTier = 'fast' | 'medium' | 'slow';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface GPTModelPricing {
  inputPer1kTokens: number;
  outputPer1kTokens: number;
  currency: string;
}

export interface GPTModel {
  type: 'model';
  id: string;
  name: string;
  version: string;
  contextWindow: number;
  capabilities: string[];
  pricing: GPTModelPricing;
  releaseDate: string;
  status: ModelStatus;
  speedTier: SpeedTier;
  description: string;
  tags: string[];
}

export interface GPTTool {
  type: 'tool';
  id: string;
  name: string;
  category: string;
  description: string;
  apiEndpoint?: string;
  integrationGuide: string;
  tags: string[];
}

export interface GPTUseCase {
  type: 'use-case';
  id: string;
  title: string;
  domain: string;
  prompt: string;
  expectedOutput: string;
  difficulty: Difficulty;
  tags: string[];
  recommendedModelId?: string;
}

export type KatalogEntry = GPTModel | GPTTool | GPTUseCase;

// ─── Search ───────────────────────────────────────────────────────────────────

export type SortBy = 'relevance' | 'price-asc' | 'price-desc' | 'context-window-desc' | 'name-asc';

export interface KatalogSearchQuery {
  query?: string;
  type?: EntryType;
  category?: string;
  domain?: string;
  tags?: string[];
  status?: ModelStatus;
  page?: number;
  pageSize?: number;
  sortBy?: SortBy;
}

export interface KatalogSearchResult {
  entries: KatalogEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  query: KatalogSearchQuery;
  disclaimer: string;
  contractVersion: string;
  evaluationMs: number;
}

// ─── Compare ─────────────────────────────────────────────────────────────────

export interface ModelCompareRow {
  modelId: string;
  name: string;
  contextWindow: number;
  inputPricePer1k: number;
  outputPricePer1k: number;
  speedTier: SpeedTier;
  capabilities: string[];
  status: ModelStatus;
  uniqueCapabilities: string[];
}

export interface KatalogCompareResult {
  models: ModelCompareRow[];
  capabilityUnion: string[];
  cheapestModelId: string | null;
  largestContextModelId: string | null;
  fastestModelId: string | null;
  disclaimer: string;
  contractVersion: string;
  evaluationMs: number;
}

// ─── Recommend ───────────────────────────────────────────────────────────────

export interface RecommendationRequest {
  domain: string;
  budget: number;
  requiredCapabilities?: string[];
  preferSpeed?: boolean;
}

export interface KatalogRecommendation {
  recommendedModel: GPTModel | null;
  alternativeModels: GPTModel[];
  recommendedTools: GPTTool[];
  relevantUseCases: GPTUseCase[];
  reasoning: string;
  disclaimer: string;
  contractVersion: string;
  evaluationMs: number;
}

// ─── Health ───────────────────────────────────────────────────────────────────

export interface KatalogHealth {
  status: 'ok';
  personaId: string;
  moduleVersion: string;
  contractVersion: string;
  octave: number;
  hipermrezaNode: number;
  modelCount: number;
  toolCount: number;
  useCaseCount: number;
  totalEntries: number;
  activeModelCount: number;
  lastUpdated: string;
  kpi: {
    searchMaxMs: number;
    compareMaxMs: number;
    apiResponseMaxMs: number;
    registryLookupMaxMs: number;
  };
}
