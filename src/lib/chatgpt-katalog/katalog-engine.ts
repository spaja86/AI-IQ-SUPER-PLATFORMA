// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG Engine (Orchestrator)
// Kompanija SPAJA — Digitalna Industrija

import type { KatalogHealth } from './types';
import {
  CHATGPT_KATALOG_API_RESPONSE_MAX_MS,
  CHATGPT_KATALOG_COMPARE_MAX_MS,
  CHATGPT_KATALOG_CONTRACT_VERSION,
  CHATGPT_KATALOG_DISPLAY_NAME,
  CHATGPT_KATALOG_HIPERMREZA_NODE,
  CHATGPT_KATALOG_MODULE_VERSION,
  CHATGPT_KATALOG_OCTAVE,
  CHATGPT_KATALOG_PERSONA_ID,
  CHATGPT_KATALOG_REGISTRY_LOOKUP_MAX_MS,
  CHATGPT_KATALOG_SEARCH_MAX_MS,
  CHATGPT_KATALOG_SLUG,
} from './types';
import { GPT_MODELS, GPT_TOOLS, GPT_USE_CASES } from './registry';

const MODULE_STARTED_AT = new Date().toISOString();

export function getKatalogHealth(): KatalogHealth {
  const activeModelCount = GPT_MODELS.filter((m) => m.status === 'active').length;
  return {
    status: 'ok',
    personaId: CHATGPT_KATALOG_PERSONA_ID,
    moduleVersion: CHATGPT_KATALOG_MODULE_VERSION,
    contractVersion: CHATGPT_KATALOG_CONTRACT_VERSION,
    octave: CHATGPT_KATALOG_OCTAVE,
    hipermrezaNode: CHATGPT_KATALOG_HIPERMREZA_NODE,
    modelCount: GPT_MODELS.length,
    toolCount: GPT_TOOLS.length,
    useCaseCount: GPT_USE_CASES.length,
    totalEntries: GPT_MODELS.length + GPT_TOOLS.length + GPT_USE_CASES.length,
    activeModelCount,
    lastUpdated: MODULE_STARTED_AT,
    kpi: {
      searchMaxMs: CHATGPT_KATALOG_SEARCH_MAX_MS,
      compareMaxMs: CHATGPT_KATALOG_COMPARE_MAX_MS,
      apiResponseMaxMs: CHATGPT_KATALOG_API_RESPONSE_MAX_MS,
      registryLookupMaxMs: CHATGPT_KATALOG_REGISTRY_LOOKUP_MAX_MS,
    },
  };
}

export function setKatalogHeaders(response: Response, contractVersion?: string): void {
  response.headers.set('X-ChatGPT-Katalog-Contract-Version', contractVersion ?? CHATGPT_KATALOG_CONTRACT_VERSION);
  response.headers.set('X-ChatGPT-Katalog-Module-Version', CHATGPT_KATALOG_MODULE_VERSION);
  response.headers.set('X-ChatGPT-Katalog-Persona-Id', CHATGPT_KATALOG_PERSONA_ID);
  response.headers.set('X-ChatGPT-Katalog-Slug', CHATGPT_KATALOG_SLUG);
  response.headers.set('X-ChatGPT-Katalog-Display-Name', CHATGPT_KATALOG_DISPLAY_NAME);
}
