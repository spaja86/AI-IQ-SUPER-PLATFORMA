// SpajaUltraOmegaCore -∞Ω+∞ — EKVIVALENT NETWORK
// Kompanija SPAJA — Digitalna Industrija

export { evaluateEkvivalentNetwork, getEkvivalentHealthReport, _resetEkvivalentMetrics } from './engine';
export { setEkvivalentHeaders } from './route-utils';
export {
  getNodeById,
  listAllNodes,
  upsertNode,
  removeNode,
  getEdgesByNode,
  addEdge,
  listAllEdges,
  getTotalNodes,
  getTotalEdges,
  _resetRegistry,
} from './registry';

export type {
  EkvivalentCluster,
  EkvivalentDomain,
  EkvivalentEdge,
  EkvivalentHealthReport,
  EkvivalentInput,
  EkvivalentMatch,
  EkvivalentNode,
  EkvivalentRelationType,
  EkvivalentResult,
} from './types';

export {
  EKVIVALENT_API_RESPONSE_MAX_MS,
  EKVIVALENT_CLUSTER_THRESHOLD,
  EKVIVALENT_CONTRACT_VERSION,
  EKVIVALENT_DISCLAIMER,
  EKVIVALENT_HIPERMREZA_NODE,
  EKVIVALENT_MAX_SCORE,
  EKVIVALENT_MIN_SCORE,
  EKVIVALENT_MODULE_VERSION,
  EKVIVALENT_OCTAVE,
  EKVIVALENT_PERFORMANCE_MAX_MS,
  EKVIVALENT_PERSONA_ID,
  EKVIVALENT_VALID_DOMAINS,
  EKVIVALENT_VALID_RELATION_TYPES,
} from './types';
