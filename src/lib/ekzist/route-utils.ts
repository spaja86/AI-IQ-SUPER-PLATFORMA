// SpajaUltraOmegaCore -∞Ω+∞ — EKZIST Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { EkzistResult } from './types';
import {
  EKZIST_API_RESPONSE_MAX_MS,
  EKZIST_CANONICAL_SLUG,
  EKZIST_CONTRACT_VERSION,
  EKZIST_DISPLAY_NAME,
  EKZIST_HEADERS,
  EKZIST_MODULE_VERSION,
  EKZIST_PERFORMANCE_MAX_MS,
  EKZIST_PERSONA_ID,
} from './types';

export function setEkzistHeaders(res: Response, result?: EkzistResult): void {
  res.headers.set(EKZIST_HEADERS.CONTRACT_VERSION, EKZIST_CONTRACT_VERSION);
  res.headers.set(EKZIST_HEADERS.MODULE_VERSION, EKZIST_MODULE_VERSION);
  res.headers.set(EKZIST_HEADERS.DISPLAY_NAME, EKZIST_DISPLAY_NAME);
  res.headers.set(EKZIST_HEADERS.CANONICAL_SLUG, EKZIST_CANONICAL_SLUG);
  res.headers.set(EKZIST_HEADERS.PERSONA_ID, EKZIST_PERSONA_ID);
  res.headers.set(EKZIST_HEADERS.EVAL_KPI_MS, String(EKZIST_PERFORMANCE_MAX_MS));
  res.headers.set(EKZIST_HEADERS.API_KPI_MS, String(EKZIST_API_RESPONSE_MAX_MS));
  if (result) {
    res.headers.set(EKZIST_HEADERS.TIER, result.tier);
    res.headers.set(EKZIST_HEADERS.DOMAIN, result.dominantVector);
    res.headers.set(EKZIST_HEADERS.VALID, String(result.valid));
  }
}
