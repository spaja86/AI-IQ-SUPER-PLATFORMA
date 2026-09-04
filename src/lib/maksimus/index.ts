// SpajaUltraOmegaCore -∞Ω+∞ — MAKSIMUS
// Kompanija SPAJA — Digitalna Industrija

export {
  buildMaksimus,
  executeMaksimусTask,
  getMaksimусInfo,
  MAKSIMUS_CONTRACT_VERSION,
  MAKSIMUS_MODEL_VERSION,
  MAKSIMUS_SOURCE_OF_TRUTH,
  MAKSIMUS_WEIGHTS,
} from './orchestrator';
export { getMaksimусPersona, shouldHandoffToAnotherMaks, MAKSIMUS_PERSONA } from './identity';
export { getMaksimусLastSnapshot, setMaksimусLastSnapshot } from './store';
export { initiateMaksimусHandoff, MAKSIMUS_HANDOFF_TARGETS } from './handoff';
export type {
  MaksimусOcena,
  MaksimуsTrendDirection,
  MaksimусSpecijalizacija,
  MaksimусPersonaInfo,
  MaksimуsDomenSignal,
  MaksimуsTrend,
  MaksimуsMeta,
  MaksimусExtrimliIntegracija,
  MaksimуsSvega,
  MaksimусSnapshot,
  MaksimусTaskInput,
  MaksimусTaskResult,
  MaksimусHandoffRequest,
  MaksimусHandoffResult,
} from './types';
