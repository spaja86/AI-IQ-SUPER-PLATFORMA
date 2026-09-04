// SpajaUltraOmegaCore -∞Ω+∞ — ANOTHER MAKS
// Kompanija SPAJA — Digitalna Industrija

export { buildAnotherMaks, executeAnotherMaksTask, getAnotherMaksInfo, ANOTHER_MAKS_CONTRACT_VERSION, ANOTHER_MAKS_MODEL_VERSION, ANOTHER_MAKS_SOURCE_OF_TRUTH, ANOTHER_MAKS_WEIGHTS } from './orchestrator';
export { getAnotherMaksPersona, shouldHandoffToMaks, ANOTHER_MAKS_PERSONA } from './persona';
export { getAnotherMaksLastSnapshot, setAnotherMaksLastSnapshot } from './store';
export type {
  AnotherMaksOcena,
  AnotherMaksTrendDirection,
  AnotherMaksSpecijalizacija,
  AnotherMaksPersonaInfo,
  AnotherMaksDomenSignal,
  AnotherMaksTrend,
  AnotherMaksMeta,
  AnotherMaksSvega,
  AnotherMaksSnapshot,
  AnotherMaksTaskInput,
  AnotherMaksTaskResult,
} from './types';
