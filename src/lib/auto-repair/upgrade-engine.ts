// ============================================================================
// Auto-Popravka System — Upgrade Engine
// Automatsko unapređenje i nadogradnja platforme
// ============================================================================

import type {
  DiagnosticReport,
  UpgradeRecommendation,
  RepairHistoryEntry,
} from './types';

/** Status jednog upgrade-a */
export interface UpgradeAction {
  id: string;
  recommendationId: string;
  title: string;
  titleSr: string;
  status: 'queued' | 'in-progress' | 'completed' | 'failed' | 'manual-required';
  description: string;
  descriptionSr: string;
  timestamp: string;
}

/** Plan nadogradnje */
export interface UpgradePlan {
  id: string;
  timestamp: string;
  currentScore: number;
  projectedScore: number;
  actions: UpgradeAction[];
  totalAutoFixable: number;
  totalManualRequired: number;
  estimatedImprovement: number;
}

// ---------------------------------------------------------------------------
// Upgrade planner
// ---------------------------------------------------------------------------

/** Generiši plan nadogradnje na osnovu dijagnostičkog izveštaja */
export function generateUpgradePlan(report: DiagnosticReport): UpgradePlan {
  const actions: UpgradeAction[] = report.recommendations.map((rec) => ({
    id: `upgrade-${rec.id}-${Date.now()}`,
    recommendationId: rec.id,
    title: rec.title,
    titleSr: rec.titleSr,
    status: rec.autoFixable ? 'queued' : 'manual-required',
    description: rec.description,
    descriptionSr: rec.descriptionSr,
    timestamp: new Date().toISOString(),
  }));

  const totalAutoFixable = actions.filter(a => a.status === 'queued').length;
  const totalManualRequired = actions.filter(a => a.status === 'manual-required').length;

  // Estimate improvement from auto-fixable items
  const estimatedImprovement = Math.min(
    100 - report.score,
    totalAutoFixable * 5 // Each auto-fix adds ~5 points
  );

  return {
    id: `plan-${Date.now()}`,
    timestamp: new Date().toISOString(),
    currentScore: report.score,
    projectedScore: Math.min(100, report.score + estimatedImprovement),
    actions,
    totalAutoFixable,
    totalManualRequired,
    estimatedImprovement,
  };
}

/** Proceni kolike su šanse za unapređenje */
export function assessUpgradeOpportunities(recommendations: UpgradeRecommendation[]): {
  highPriority: UpgradeRecommendation[];
  mediumPriority: UpgradeRecommendation[];
  lowPriority: UpgradeRecommendation[];
  quickWins: UpgradeRecommendation[];
} {
  return {
    highPriority: recommendations.filter(r => r.priority === 'high'),
    mediumPriority: recommendations.filter(r => r.priority === 'medium'),
    lowPriority: recommendations.filter(r => r.priority === 'low'),
    quickWins: recommendations.filter(r => r.effort === 'minimal' && r.impact === 'high'),
  };
}

/** Kreiraj istorijski unos na osnovu dijagnostike i popravke */
export function createHistoryEntry(
  type: 'diagnostic' | 'repair' | 'upgrade',
  scoreBefore: number,
  scoreAfter: number,
  checksRun: number,
  issuesFound: number,
  issuesFixed: number,
): RepairHistoryEntry {
  return {
    id: `history-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type,
    scoreBefore,
    scoreAfter,
    checksRun,
    issuesFound,
    issuesFixed,
    status: issuesFixed >= issuesFound ? 'completed' : issuesFixed > 0 ? 'partial' : 'failed',
  };
}
