// SpajaUltraOmegaCore -∞Ω+∞ — POZADINE SVIH PROJEKCIJA Types
// Kompanija SPAJA — Digitalna Industrija

export const POZADINE_SVIH_PROJEKCIJA_CONTRACT_VERSION = 'v1';
export const POZADINE_SVIH_PROJEKCIJA_MODULE_VERSION = '1.0.0';
export const POZADINE_SVIH_PROJEKCIJA_PERSONA_ID = 'pozadine-svih-projekcija-core';
export const POZADINE_SVIH_PROJEKCIJA_DISPLAY_NAME = 'POZADINE SVIH PROJEKCIJA';
export const POZADINE_SVIH_PROJEKCIJA_SLUG = 'pozadine-svih-projekcija';
export const POZADINE_SVIH_PROJEKCIJA_OCTAVE = 10;
export const POZADINE_SVIH_PROJEKCIJA_HIPERMREZA_NODE = 84;
export const POZADINE_SVIH_PROJEKCIJA_PERFORMANCE_MAX_MS = 50;
export const POZADINE_SVIH_PROJEKCIJA_API_RESPONSE_MAX_MS = 200;
export const POZADINE_SVIH_PROJEKCIJA_LINKED_REPO_IMPACT = 'none';
export const POZADINE_SVIH_PROJEKCIJA_MIN_SIGNAL_STRENGTH = 0;
export const POZADINE_SVIH_PROJEKCIJA_MAX_SIGNAL_STRENGTH = 100;
export const POZADINE_SVIH_PROJEKCIJA_DISCLAIMER =
  'POZADINE SVIH PROJEKCIJA daje determinističku procenu ekvivalentnosti signala i ne predstavlja pravni, medicinski, finansijski niti bezbednosni savet.';

export type PozadineSvihProjekcijaStatus = 'INVALID' | 'NEPOZNATO' | 'ODSTUPANJE' | 'EKVIVALENTNA';

export type PozadineSvihProjekcijaAction =
  | 'ISPRAVI_FORMAT'
  | 'VALIDIRAJ_POZNATE_SLOJEVE'
  | 'USKLADI_REDOSLED_I_DUPLIKATE'
  | 'POTVRDI_PROJEKCIJU';

export interface PozadineSvihProjekcijaInput {
  referenceId?: string;
  projectionExpression?: string;
  layers?: string[];
  signalStrength?: number;
  strictOrder?: boolean;
}

export interface PozadineSvihProjekcijaDuplicateDelta {
  token: string;
  expectedCount: number;
  actualCount: number;
}

export interface PozadineSvihProjekcijaResult {
  referenceId: string;
  projectionExpression: string | null;
  normalizedLayers: string[];
  equivalent: boolean;
  status: PozadineSvihProjekcijaStatus;
  recommendedAction: PozadineSvihProjekcijaAction;
  strictOrderApplied: boolean;
  orderMatch: boolean;
  signalStrength: number;
  matchRatio: number;
  missingLayers: string[];
  extraLayers: string[];
  unknownLayers: string[];
  duplicateDelta: PozadineSvihProjekcijaDuplicateDelta[];
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface PozadineSvihProjekcijaHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: PozadineSvihProjekcijaStatus | null;
  lastEvaluatedAt: string | null;
  officialLayerCount: number;
  officialUniqueLayerCount: number;
  strictOrderDefault: boolean;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
