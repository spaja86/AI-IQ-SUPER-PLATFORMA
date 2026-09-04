// SpajaUltraOmegaCore -∞Ω+∞ — SWIMING
// Kompanija SPAJA — Digitalna Industrija

import {
  SWIMING_CONTRACT_VERSION,
  SWIMING_MODULE_VERSION,
} from './types';

export function setSwimingHeaders(res: Response): void {
  res.headers.set('X-Swiming-Contract-Version', SWIMING_CONTRACT_VERSION);
  res.headers.set('X-Swiming-Module-Version', SWIMING_MODULE_VERSION);
}
