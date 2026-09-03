// SpajaUltraOmegaCore -∞Ω+∞ — DINOSAURUS-Trexar
// Kompanija SPAJA — Digitalna Industrija

import type { TrexarAgeCategory } from './types';

export const VALID_AGE_CATEGORIES: TrexarAgeCategory[] = ['JUVENILE', 'ADULT', 'ELDER'];

export const AGE_CATEGORY_LABELS: Record<TrexarAgeCategory, string> = {
  JUVENILE: 'Juvenile Growth Phase',
  ADULT: 'Adult Prime Phase',
  ELDER: 'Elder Conservation Phase',
};
