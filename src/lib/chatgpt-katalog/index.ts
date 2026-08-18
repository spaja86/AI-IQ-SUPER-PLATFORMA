// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG
// Kompanija SPAJA — Digitalna Industrija

export { searchKatalog } from './search-engine';
export { compareModels } from './compare-engine';
export { recommend } from './recommendation-engine';
export { getKatalogHealth, setKatalogHeaders } from './katalog-engine';
export { getEntryById, getModelById, getToolById, getUseCaseById, getAllEntries, GPT_MODELS, GPT_TOOLS, GPT_USE_CASES } from './registry';

export type {
  Difficulty,
  EntryType,
  GPTModel,
  GPTModelPricing,
  GPTTool,
  GPTUseCase,
  KatalogCompareResult,
  KatalogEntry,
  KatalogHealth,
  KatalogRecommendation,
  KatalogSearchQuery,
  KatalogSearchResult,
  ModelCompareRow,
  ModelStatus,
  RecommendationRequest,
  SortBy,
  SpeedTier,
} from './types';

export {
  CHATGPT_KATALOG_API_RESPONSE_MAX_MS,
  CHATGPT_KATALOG_COMPARE_MAX_MS,
  CHATGPT_KATALOG_CONTRACT_VERSION,
  CHATGPT_KATALOG_DISCLAIMER,
  CHATGPT_KATALOG_DISPLAY_NAME,
  CHATGPT_KATALOG_HIPERMREZA_NODE,
  CHATGPT_KATALOG_MAX_COMPARE_ENTRIES,
  CHATGPT_KATALOG_MODULE_VERSION,
  CHATGPT_KATALOG_OCTAVE,
  CHATGPT_KATALOG_PERSONA_ID,
  CHATGPT_KATALOG_REGISTRY_LOOKUP_MAX_MS,
  CHATGPT_KATALOG_SEARCH_MAX_MS,
  CHATGPT_KATALOG_SLUG,
} from './types';
