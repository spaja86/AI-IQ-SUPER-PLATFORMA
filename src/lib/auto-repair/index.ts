// ============================================================================
// Auto-Popravka System — Glavni modul
// Izvoz svih funkcija i tipova za auto-repair sistem
// ============================================================================

// Tipovi
export type {
  Severity,
  CheckStatus,
  RepairStatus,
  CheckCategory,
  DiagnosticCheck,
  UpgradeRecommendation,
  RepairResult,
  DiagnosticReport,
  ReportSummary,
  RepairReport,
  RepairHistoryEntry,
  AutoRepairSystemState,
} from './types';

// Dijagnostika
export { runDiagnostics, runQuickDiagnostics } from './diagnostics';

// Popravke
export { runRepairs, runFullAutoRepair } from './repair-engine';

// Nadogradnje
export {
  generateUpgradePlan,
  assessUpgradeOpportunities,
  createHistoryEntry,
} from './upgrade-engine';
export type { UpgradeAction, UpgradePlan } from './upgrade-engine';
