// SpajaUltraOmegaCore -∞Ω+∞ — EPEKM-D: Eksoidnig Permanent Email Maksim Denter
// Kompanija SPAJA — Digitalna Industrija
//
// Public module exports for EPEKM-D.

export {
  EPEKM_CONTRACT_VERSION,
  EPEKM_MODULE_VERSION,
  EPEKM_PERSONA_ID,
  EPEKM_OCTAVE,
  EPEKM_HIPERMREZA_NODE,
  EPEKM_PERFORMANCE_MAX_MS,
  EPEKM_API_RESPONSE_MAX_MS,
  EPEKM_DELIVERY_ACK_MAX_MS,
  EPEKM_DEGRADED_PENDING_THRESHOLD,
  executeDenterRequest,
  buildHealthReport,
  registerEmailIdentity,
  resolveEmailAlias,
  sendEmailMessage,
  getEmailDeliveryStatus,
} from './denter-orchestrator';

export {
  registerIdentity,
  getIdentityByAlias,
  updateIdentityStatus,
  listIdentities,
  getIdentityCount,
  getActiveIdentityCount,
  generateCanonicalAddress,
  generateEmailId,
} from './identity-registry';

export {
  resolveAlias,
  registerAliasOverride,
  removeAliasOverride,
  getRouteEntry,
  listRoutes,
} from './routing-engine';

export {
  sendMessage,
  getMessageById,
  getMessageCount,
  generateMessageId,
} from './email-engine';

export {
  EPEKM_MAX_RETRIES,
  EPEKM_DELIVERY_MAX_MS,
  initDelivery,
  markSent,
  markDelivered,
  markFailed,
  archiveDelivery,
  getDeliveryStatus,
  countByStatus,
  getTotalMessageCount,
  getPendingDeliveryCount,
  calcBackoffDelay,
} from './delivery-tracker';

export type {
  EpekmIdentity,
  EpekmIdentityStatus,
  EpekmRegistrationInput,
  EpekmRegistrationResult,
  EpekmPayloadType,
  EpekmDeliveryStatus,
  EpekmMessage,
  EpekmSendInput,
  EpekmSendResult,
  EpekmDeliveryRecord,
  EpekmRouteEntry,
  EpekmDenterAction,
  DenterRequest,
  DenterResponse,
  EpekmHealthReport,
} from './types';
