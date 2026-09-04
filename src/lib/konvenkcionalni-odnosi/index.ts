// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI
// Kompanija SPAJA — Digitalna Industrija

export {
  createRelation,
  changeRelationStatus,
  recordInteraction,
  queryRelations,
  getRelation,
  getKoHealthReport,
} from './relation-engine';

export type { KoResult, KoSuccess, KoError } from './relation-engine';

export {
  getInteractionsByRelation,
  getInteractionsByActor,
  getInteractionsByType,
  countInteractions,
  appendInteraction,
  _resetInteractionLog,
} from './interaction-tracker';

export { _resetRegistry } from './registry';

export type {
  Relation,
  RelationType,
  RelationStatus,
  RelationParty,
  RelationPartyRole,
  RelationEvent,
  RelationEventType,
  CreateRelationInput,
  StatusChangeInput,
  InteractionInput,
  RelationListFilter,
  RelationHealthReport,
} from './types';

export {
  KO_CONTRACT_VERSION,
  KO_MODULE_VERSION,
  KO_PERSONA_ID,
  KO_PERFORMANCE_MAX_MS,
  KO_API_RESPONSE_MAX_MS,
  KO_VALID_TRANSITIONS,
} from './types';

import { KO_CONTRACT_VERSION, KO_MODULE_VERSION } from './types';

export function setKoHeaders(res: Response): void {
  res.headers.set('X-KO-Contract-Version', KO_CONTRACT_VERSION);
  res.headers.set('X-KO-Module-Version', KO_MODULE_VERSION);
}
