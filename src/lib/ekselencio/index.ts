// SpajaUltraOmegaCore -∞Ω+∞ — EKSELENCIO
// Kompanija SPAJA — Digitalna Industrija

export { evaluateEkselencio, getEkselencioHealthReport, _resetEkselencioMetrics } from './engine';
export { setEkselencioHeaders } from './route-utils';
export {
  upsertEkselencioSession,
  getEkselencioSessionById,
  getTotalEkselencioSessions,
  _resetEkselencioRegistry,
} from './registry';
export { computeEvolutionSignal } from './evolution-signal';
export {
  clampPillarScore,
  geometricMeanTop4,
  computeEkselencioTier,
  buildPillarBreakdown,
  buildEkselencioRecommendation,
} from './ekuare-engine';

export type {
  EkuarePillar,
  EkselencioTier,
  EkselencioInput,
  PillarBreakdown,
  EkselencioResult,
  EkselencioHealthReport,
} from './types';

export {
  EKUARE_PILLARS,
  EKUARE_PILLAR_LABELS,
  EKSELENCIO_PERSONA_ID,
  EKSELENCIO_OCTAVE,
  EKSELENCIO_HIPERMREZA_NODE,
  EKSELENCIO_CONTRACT_VERSION,
  EKSELENCIO_MODULE_VERSION,
  EKSELENCIO_PERFORMANCE_MAX_MS,
  EKSELENCIO_API_RESPONSE_MAX_MS,
  EKSELENCIO_BLIND_SPOT_THRESHOLD,
  EKSELENCIO_MIN_SCORE,
  EKSELENCIO_MAX_SCORE,
  EKSELENCIO_MAX_EKUARE_SCORE,
  EKSELENCIO_DISCLAIMER,
} from './types';
