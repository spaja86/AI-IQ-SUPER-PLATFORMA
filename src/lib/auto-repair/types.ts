// ============================================================================
// Auto-Popravka System — Tipovi
// AI IQ SUPER PLATFORMA — Automatski sistem za dijagnostiku, popravku i nadogradnju
// ============================================================================

/** Nivo ozbiljnosti problema */
export type Severity = 'critical' | 'warning' | 'info' | 'success';

/** Status provere */
export type CheckStatus = 'pass' | 'fail' | 'warning' | 'skipped';

/** Status popravke */
export type RepairStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';

/** Kategorija provere */
export type CheckCategory =
  | 'build'
  | 'lint'
  | 'types'
  | 'api'
  | 'pages'
  | 'security'
  | 'performance'
  | 'seo'
  | 'accessibility'
  | 'data-integrity'
  | 'deployment'
  | 'monitoring';

/** Rezultat pojedinačne dijagnostičke provere */
export interface DiagnosticCheck {
  id: string;
  name: string;
  nameSr: string;
  category: CheckCategory;
  status: CheckStatus;
  severity: Severity;
  message: string;
  messageSr: string;
  details?: string;
  fixAvailable: boolean;
  fixDescription?: string;
  fixDescriptionSr?: string;
  timestamp: string;
  duration?: number; // ms
}

/** Preporuka za unapređenje */
export interface UpgradeRecommendation {
  id: string;
  title: string;
  titleSr: string;
  description: string;
  descriptionSr: string;
  priority: 'high' | 'medium' | 'low';
  category: CheckCategory;
  effort: 'minimal' | 'moderate' | 'significant';
  impact: 'high' | 'medium' | 'low';
  autoFixable: boolean;
}

/** Rezultat popravke */
export interface RepairResult {
  id: string;
  checkId: string;
  name: string;
  nameSr: string;
  status: RepairStatus;
  action: string;
  actionSr: string;
  before?: string;
  after?: string;
  timestamp: string;
  duration?: number; // ms
}

/** Kompletan dijagnostički izveštaj */
export interface DiagnosticReport {
  id: string;
  timestamp: string;
  version: string;
  platform: string;
  overallStatus: 'healthy' | 'degraded' | 'critical';
  score: number; // 0-100
  checks: DiagnosticCheck[];
  recommendations: UpgradeRecommendation[];
  summary: ReportSummary;
}

/** Sažetak izveštaja */
export interface ReportSummary {
  total: number;
  passed: number;
  failed: number;
  warnings: number;
  skipped: number;
  criticalIssues: number;
  autoFixable: number;
}

/** Rezultat auto-popravke */
export interface RepairReport {
  id: string;
  timestamp: string;
  diagnosticReportId: string;
  repairs: RepairResult[];
  summary: {
    total: number;
    completed: number;
    failed: number;
    skipped: number;
  };
  newScore: number;
}

/** Istorija auto-popravke */
export interface RepairHistoryEntry {
  id: string;
  timestamp: string;
  type: 'diagnostic' | 'repair' | 'upgrade';
  scoreBefore: number;
  scoreAfter: number;
  checksRun: number;
  issuesFound: number;
  issuesFixed: number;
  status: 'completed' | 'partial' | 'failed';
}

/** Stanje celog auto-repair sistema */
export interface AutoRepairSystemState {
  enabled: boolean;
  lastDiagnostic: DiagnosticReport | null;
  lastRepair: RepairReport | null;
  history: RepairHistoryEntry[];
  nextScheduledRun?: string;
}
