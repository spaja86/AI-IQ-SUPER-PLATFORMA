// SpajaUltraOmegaCore -∞Ω+∞ — PROSPARITET Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { ProsparitetResult } from './types';
import { PROSPARITET_CONTRACT_VERSION, PROSPARITET_MODULE_VERSION } from './types';

export function setProsparitetHeaders(res: Response, result?: ProsparitetResult): void {
  res.headers.set('X-Prosparitet-Contract-Version', PROSPARITET_CONTRACT_VERSION);
  res.headers.set('X-Prosparitet-Module-Version', PROSPARITET_MODULE_VERSION);
  if (result) {
    if (result.objective) res.headers.set('X-Prosparitet-Objective', result.objective);
    if (result.horizon) res.headers.set('X-Prosparitet-Horizon', result.horizon);
    if (result.riskAppetite) res.headers.set('X-Prosparitet-Risk-Appetite', result.riskAppetite);
    res.headers.set('X-Prosparitet-Status', result.status);
    res.headers.set('X-Prosparitet-Action', result.recommendedAction);
    res.headers.set('X-Prosparitet-Valid', String(result.valid));
  }
}
