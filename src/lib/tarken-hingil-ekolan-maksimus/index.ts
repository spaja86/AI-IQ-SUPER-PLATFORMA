// SpajaUltraOmegaCore -∞Ω+∞ — TARKEN HINGIL EKOLAN MAKSIMUS
// Kompanija SPAJA — Digitalna Industrija

export {
  buildThem,
  executeThemTask,
  getThemInfo,
  THEM_CONTRACT_VERSION,
  THEM_MODEL_VERSION,
  THEM_SOURCE_OF_TRUTH,
  THEM_WEIGHTS,
  THEM_PERSONA,
} from './orchestrator';
export { getThemPersona, resolveHandoffTarget } from './identity';
export { getThemLastSnapshot, setThemLastSnapshot } from './store';
export { evaluateSystemState, computeEkolanScore } from './ekolan-engine';
export { normalizeSignal, computeHingilScore } from './hingil-signal';
export { modelScenario, computeKonvergencijaScore, buildStrategyResult } from './tarken-strategy';
export { executeHandoff, resolveFallbackAgent } from './handoff';
export type {
  ThemOcena,
  ThemTrendDirection,
  ThemSpecijalizacija,
  ThemPersonaInfo,
  ThemDomenSignal,
  ThemTrend,
  ThemMeta,
  ThemSvega,
  ThemSnapshot,
  ThemTaskInput,
  ThemTaskResult,
  ThemEvaluateRequest,
  ThemHandoffRequest,
  ThemHandoffResult,
  ThemMetrics,
} from './types';
