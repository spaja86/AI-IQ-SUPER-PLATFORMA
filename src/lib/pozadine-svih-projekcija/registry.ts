// SpajaUltraOmegaCore -∞Ω+∞ — POZADINE SVIH PROJEKCIJA Registry
// Kompanija SPAJA — Digitalna Industrija

import type { PozadineSvihProjekcijaAction } from './types';

export const OFFICIAL_PROJECTION_SEQUENCE = [
  'DUKER',
  'NIKOS',
  'ZINGO',
  'NJUKER',
  'ZINGAN',
  'DISPO',
  'DJAMA',
  'FRIKO',
  'DJAPRE',
  'NIKOS',
  'JAKRE',
  'GIMBA',
] as const;

export const OFFICIAL_PROJECTION_UNIQUE_LAYERS = [
  ...new Set<string>(OFFICIAL_PROJECTION_SEQUENCE),
] as const;

export const OFFICIAL_SEQUENCE_LENGTH = OFFICIAL_PROJECTION_SEQUENCE.length;
export const STRICT_ORDER_DEFAULT = true;

export const ACTION_BY_STATUS: Record<'INVALID' | 'NEPOZNATO' | 'ODSTUPANJE' | 'EKVIVALENTNA', PozadineSvihProjekcijaAction> = {
  INVALID: 'ISPRAVI_FORMAT',
  NEPOZNATO: 'VALIDIRAJ_POZNATE_SLOJEVE',
  ODSTUPANJE: 'USKLADI_REDOSLED_I_DUPLIKATE',
  EKVIVALENTNA: 'POTVRDI_PROJEKCIJU',
};
