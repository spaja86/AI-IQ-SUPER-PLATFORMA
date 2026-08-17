// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI Engine (health report)
// Kompanija SPAJA — Digitalna Industrija

import type { ZlatniHealthReport } from './types';
import {
  ZLATNI_API_RESPONSE_MAX_MS,
  ZLATNI_CONTRACT_VERSION,
  ZLATNI_MODULE_VERSION,
  ZLATNI_PERFORMANCE_LOOKUP_MAX_MS,
  ZLATNI_PERFORMANCE_TIER_MAX_MS,
  ZLATNI_PERSONA_ID,
} from './types';
import { getTotalAccounts } from './registry';
import { getTotalTransactions } from './transaction-engine';

export function getZlatniHealthReport(): ZlatniHealthReport {
  return {
    personaId: ZLATNI_PERSONA_ID,
    contractVersion: ZLATNI_CONTRACT_VERSION,
    moduleVersion: ZLATNI_MODULE_VERSION,
    totalAccounts: getTotalAccounts(),
    totalTransactions: getTotalTransactions(),
    performanceLookupMaxMs: ZLATNI_PERFORMANCE_LOOKUP_MAX_MS,
    performanceTierMaxMs: ZLATNI_PERFORMANCE_TIER_MAX_MS,
    performanceApiMaxMs: ZLATNI_API_RESPONSE_MAX_MS,
  };
}
