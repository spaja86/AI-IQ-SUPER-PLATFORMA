// SpajaUltraOmegaCore -∞Ω+∞ — TARKEN HINGIL EKOLAN MAKSIMUS
// Kompanija SPAJA — Digitalna Industrija
//
// Shared TypeScript types za TARKEN HINGIL EKOLAN MAKSIMUS —
// apex strateški orkestratorski agent (THEM).

export type ThemOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type ThemTrendDirection = 'up' | 'down' | 'flat';
export type ThemSpecijalizacija =
  | 'strateska-orkestracija'
  | 'adaptivni-signal'
  | 'ekoloski-monitoring'
  | 'industrijska-konvergencija'
  | 'neaktivan';

export interface ThemPersonaInfo {
  id: string;
  naziv: string;
  specijalizacija: ThemSpecijalizacija;
  opis: string;
  verzija: string;
  linkedAgents: string[];
  octave: number;
  hipermrezaNode: number;
  performanceKpi: {
    evaluacijaMaxMs: number;
    handoffMaxMs: number;
    buildMaxMin: number;
    hipermrezaKonvergencija: number; // >= 0.95
    uptimeSla: string;
  };
}

export interface ThemDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
  trendDirection: ThemTrendDirection;
}

export interface ThemTrend {
  direction: ThemTrendDirection;
  deltaScore: number;
  previousScore: number | null;
  currentScore: number;
  reliable: boolean;
}

export interface ThemMeta {
  contractVersion: string;
  modelVersion: string;
  sourceOfTruth: string;
  generatedAt: string;
  specijalizacija: ThemSpecijalizacija;
  linkedAgents: string[];
  degraded: boolean;
  degradedSources: string[];
}

export interface ThemSvega {
  sistem: string;
  kompanija: string;
  verzija: string;
  persona: ThemPersonaInfo;
  ukupanScore: number;
  konacnaOcena: ThemOcena;
  procenatSpremnosti: number;
  hipermrezaKonvergencija: number;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  domeni: {
    straskaOrkestracija: ThemDomenSignal;
    adaptivniSignal: ThemDomenSignal;
    ekoskoMonitoring: ThemDomenSignal;
    industrijskaKonvergencija: ThemDomenSignal;
  };
  trend: ThemTrend;
  handoff: {
    aktivanHandoff: boolean;
    linkedAgents: string[];
    handoffRazlog: string | null;
    targetAgent: string | null;
  };
  selfHealing: {
    anomalijaDetektovana: boolean;
    fallbackAktivan: boolean;
    fallbackAgent: string | null;
    dijagnostikaLog: string[];
  };
  meta: ThemMeta;
  timestamp: string;
}

export interface ThemSnapshot {
  ukupanScore: number;
  domenScores: {
    straskaOrkestracija: number;
    adaptivniSignal: number;
    ekoskoMonitoring: number;
    industrijskaKonvergencija: number;
  };
  timestamp: string;
}

export interface ThemTaskInput {
  tip: 'strateska-orkestracija' | 'adaptivni-signal' | 'ekoloski-monitoring' | 'industrijska-konvergencija';
  kontekst?: string;
  prioritet?: 'apex' | 'visok' | 'srednji' | 'nizak';
  targetAgent?: string;
}

export interface ThemTaskResult {
  taskId: string;
  tip: ThemTaskInput['tip'];
  rezultat: string;
  score: number;
  hipermrezaKonvergencija: number;
  trajanjeMsEstimate: number;
  timestamp: string;
  handoffToAgent: string | null;
  handoffRazlog: string | null;
  selfHealingTriggered: boolean;
}

export interface ThemEvaluateRequest {
  task: ThemTaskInput;
  sessionId?: string;
}

export interface ThemHandoffRequest {
  targetAgent: 'maksimus-2' | 'another-maks';
  razlog: string;
  kontekst?: string;
}

export interface ThemHandoffResult {
  targetAgent: string;
  handoffId: string;
  status: 'initiated' | 'failed';
  razlog: string;
  timestamp: string;
}

export interface ThemMetrics {
  agentId: string;
  evaluateLatencyMs: number;
  handoffLatencyMs: number;
  hipermrezaKonvergencija: number;
  throughput: number;
  anomalijaCount: number;
  uptime: string;
  timestamp: string;
}
