// SpajaUltraOmegaCore -∞Ω+∞ — Persona Bank
// Kompanija SPAJA — Digitalna Industrija

export { PersonaBankClient, createPersonaBankClient } from './client';
export {
  registerPersona,
  getPersona,
  updatePersona,
  archivePersona,
  listPersonas,
  getPersonaBankStats,
  bulkImportPersonas,
  autoArchiveStalePersonas,
  _resetPersonaBankStore,
  PersonaBankError,
  PersonaLockConflictError,
  PersonaNotFoundError,
  PersonaArchivedError,
  PersonaInvalidTransitionError,
} from './store';
export { SEED_PERSONAS, PERSONA_BANK_SEED_AGENT_ID } from './seed';
export type {
  Persona,
  PersonaType,
  PersonaStatus,
  PersonaChangeType,
  PersonaAttributes,
  PersonaAuditEntry,
  PersonaRegistrationInput,
  PersonaUpdateInput,
  PersonaBankStats,
  PersonaBankListFilter,
} from './types';

export const PERSONA_BANK_CONTRACT_VERSION = '1.0.0';
export const PERSONA_BANK_MAX_OCTAVE = 16;
export const PERSONA_BANK_MAX_HIPERMREZA_NODE = 256;
