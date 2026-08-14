// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI
// Kompanija SPAJA — Digitalna Industrija

export { getZlatniHealthReport } from './engine';
export { setZlatniHeaders } from './route-utils';
export {
  getRacunById,
  getRacunByUserId,
  upsertRacun,
  updateRacun,
  getTotalAccounts,
  _resetRegistry,
} from './registry';
export { getTierForPoints, getTierByName, evaluateTierResult, validateTierCatalog } from './tier-engine';
export { applyPoints } from './points-engine';
export { appendTransaction, getTransactions, getTotalTransactions, _resetTransactionLedger } from './transaction-engine';
export { getActivePerksForTier, isPerkEligible, getAllPerks, _resetPerkCatalog } from './perk-engine';
export { createAuditEntry, _resetCounter } from './audit';

export type {
  ZlatniRacun,
  ZlatniTier,
  ZlatniTransakcija,
  ZlatniPerk,
  ZlatniTierName,
  ZlatniRacunStatus,
  ZlatniTransakcijaType,
  ZlatniSourceModule,
  ZlatniRacunCreateInput,
  ZlatniPointsInput,
  ZlatniTierResult,
  ZlatniHealthReport,
} from './types';

export {
  ZLATNI_CONTRACT_VERSION,
  ZLATNI_MODULE_VERSION,
  ZLATNI_PERSONA_ID,
  ZLATNI_PERFORMANCE_LOOKUP_MAX_MS,
  ZLATNI_PERFORMANCE_TIER_MAX_MS,
  ZLATNI_API_RESPONSE_MAX_MS,
  ZLATNI_TRANSACTION_APPEND_MAX_MS,
  ZLATNI_TIER_CATALOG,
  ZLATNI_POINTS_EARN_RATES,
} from './types';
