// SpajaUltraOmegaCore -∞Ω+∞ — AI IQ PROGRAMSKI JEZIK Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { AiiqLanguageCompileResult, AiiqLanguageEvaluateResult } from './types';
import { AIIQ_LANG_CONTRACT_VERSION, AIIQ_LANG_MODULE_VERSION } from './types';

export function setAiiqLanguageHeaders(
  res: Response,
  result?: AiiqLanguageEvaluateResult | AiiqLanguageCompileResult,
): void {
  res.headers.set('X-AIIQ-Lang-Contract-Version', AIIQ_LANG_CONTRACT_VERSION);
  res.headers.set('X-AIIQ-Lang-Module-Version', AIIQ_LANG_MODULE_VERSION);
  if (result) {
    res.headers.set('X-AIIQ-Lang-Status', result.status);
    res.headers.set('X-AIIQ-Lang-Action', result.recommendedAction);
    res.headers.set('X-AIIQ-Lang-Valid', String(result.valid));
  }
}
