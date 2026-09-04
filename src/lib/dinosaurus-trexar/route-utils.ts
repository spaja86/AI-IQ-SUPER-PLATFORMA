// SpajaUltraOmegaCore -∞Ω+∞ — DINOSAURUS-Trexar
// Kompanija SPAJA — Digitalna Industrija

import {
  DINOSAURUS_TREXAR_CONTRACT_VERSION,
  DINOSAURUS_TREXAR_MODULE_VERSION,
} from './types';

export function setDinosaurusTrexarHeaders(res: Response): void {
  res.headers.set('X-Dinosaurus-Trexar-Contract-Version', DINOSAURUS_TREXAR_CONTRACT_VERSION);
  res.headers.set('X-Dinosaurus-Trexar-Module-Version', DINOSAURUS_TREXAR_MODULE_VERSION);
}
