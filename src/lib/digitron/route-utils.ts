// SpajaUltraOmegaCore -∞Ω+∞ — DIGITRON Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { DigitronResult } from './types';
import {
  DIGITRON_CONTRACT_VERSION,
  DIGITRON_MODULE_VERSION,
  DIGITRON_SUCCESSOR_OF,
} from './types';

export function setDigitronHeaders(res: Response, result?: DigitronResult): void {
  res.headers.set('X-Digitron-Contract-Version', DIGITRON_CONTRACT_VERSION);
  res.headers.set('X-Digitron-Module-Version', DIGITRON_MODULE_VERSION);
  res.headers.set('X-Digitron-Successor-Of', DIGITRON_SUCCESSOR_OF);
  if (result) {
    if (result.mode) res.headers.set('X-Digitron-Mode', result.mode);
    res.headers.set('X-Digitron-Status', result.status);
    res.headers.set('X-Digitron-Action', result.recommendedAction);
    res.headers.set('X-Digitron-Valid', String(result.valid));
  }
}
