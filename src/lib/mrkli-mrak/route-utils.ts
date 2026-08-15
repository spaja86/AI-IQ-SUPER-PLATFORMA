// SpajaUltraOmegaCore -∞Ω+∞ — MRKLI MRAK Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { MrkliMrakResult } from './types';
import { MRKLI_MRAK_CONTRACT_VERSION, MRKLI_MRAK_MODULE_VERSION } from './types';

export function setMrkliMrakHeaders(res: Response, result?: MrkliMrakResult): void {
  res.headers.set('X-Mrkli-Mrak-Contract-Version', MRKLI_MRAK_CONTRACT_VERSION);
  res.headers.set('X-Mrkli-Mrak-Module-Version', MRKLI_MRAK_MODULE_VERSION);
  if (result) {
    res.headers.set('X-Mrkli-Mrak-Mode', result.mode);
    res.headers.set('X-Mrkli-Mrak-Status', result.status);
    res.headers.set('X-Mrkli-Mrak-Valid', String(result.valid));
  }
}
