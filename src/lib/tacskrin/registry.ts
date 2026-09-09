// SpajaUltraOmegaCore -∞Ω+∞ — TACSKRIN Registry
// Kompanija SPAJA — Digitalna Industrija

import type { TacskrinAction } from './types';

export const OFFICIAL_TACSKRIN_SEQUENCE = [
  'REAL',
  'NIKOS',
  'DIKOS',
  'FRANKEN',
  'DEMBA',
  'GAKU',
  'REKO',
  'NAKUS',
  'GOMBLE',
  'GEPI',
  'NAU',
  'JUN',
  'GOKON',
  'APAR',
  'DJUNDRE',
] as const;

export const OFFICIAL_TACSKRIN_UNIQUE_LAYERS = [...new Set<string>(OFFICIAL_TACSKRIN_SEQUENCE)] as const;

export const OFFICIAL_TACSKRIN_SEQUENCE_LENGTH = OFFICIAL_TACSKRIN_SEQUENCE.length;
export const TACSKRIN_STRICT_ORDER_DEFAULT = true;

export const ACTION_BY_STATUS: Record<'INVALID' | 'NEPOZNATO' | 'ODSTUPANJE' | 'EKVIVALENTNA', TacskrinAction> = {
  INVALID: 'ISPRAVI_FORMAT',
  NEPOZNATO: 'VALIDIRAJ_POZNATE_SLOJEVE',
  ODSTUPANJE: 'USKLADI_REDOSLED',
  EKVIVALENTNA: 'POTVRDI_PROJEKCIJU',
};
