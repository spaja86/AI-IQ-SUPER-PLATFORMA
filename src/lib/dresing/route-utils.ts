// SpajaUltraOmegaCore -∞Ω+∞ — DRESING
// Kompanija SPAJA — Digitalna Industrija

import {
  DRESING_CONTRACT_VERSION,
  DRESING_MODULE_VERSION,
} from './types';

export function setDresingHeaders(res: Response): void {
  res.headers.set('X-Dresing-Contract-Version', DRESING_CONTRACT_VERSION);
  res.headers.set('X-Dresing-Module-Version', DRESING_MODULE_VERSION);
}
