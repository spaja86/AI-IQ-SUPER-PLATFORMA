// SpajaUltraOmegaCore -∞Ω+∞ — MAKSIMUS
// Kompanija SPAJA — Digitalna Industrija
//
// Shared TypeScript types za MAKSIMUS — analitički/razvojni agent,
// apex platforma koordinacioni agent, komplementaran ANOTHER MAKS-u (kreativni).

export type MaksimусOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type MaksimуsTrendDirection = 'up' | 'down' | 'flat';
export type MaksimусSpecijalizacija =
  | 'analiticka-orkestracija'
  | 'razvojna-strategija'
  | 'platforma-koordinacija'
  | 'neaktivan';

export interface MaksimусPersonaInfo {
  id: string;
  naziv: string;
  specijalizacija: MaksimусSpecijalizacija;
  opis: string;
  verzija: string;
  linkedAgent: string;
  octave: number;
  hipermrezaNode: number;
  performanceKpi: {
    evaluacijaMaxMs: number;
    buildMaxMin: number;
    uptimeSla: string;
  };
}

export interface MaksimуsDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
  trendDirection: MaksimуsTrendDirection;
}

export interface MaksimуsTrend {
  direction: MaksimуsTrendDirection;
  deltaScore: number;
  previousScore: number | null;
  currentScore: number;
  reliable: boolean;
}

export interface MaksimуsMeta {
  contractVersion: string;
  modelVersion: string;
  sourceOfTruth: string;
  generatedAt: string;
  specijalizacija: MaksimусSpecijalizacija;
  linkedAgent: string;
  octave: number;
  hipermrezaNode: number;
  degraded: boolean;
  degradedSources: string[];
}

export interface MaksimуsSvega {
  sistem: string;
  kompanija: string;
  verzija: string;
  persona: MaksimусPersonaInfo;
  ukupanScore: number;
  konacnaOcena: MaksimусOcena;
  procenatSpremnosti: number;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  domeni: {
    analitickaOrkestracija: MaksimуsDomenSignal;
    razvojnaStrategija: MaksimуsDomenSignal;
    platformaKoordinacija: MaksimуsDomenSignal;
    novaGeneracijaSync: MaksimуsDomenSignal;
  };
  trend: MaksimуsTrend;
  handoff: {
    aktivanHandoff: boolean;
    linkedAgent: string;
    handoffRazlog: string | null;
  };
  meta: MaksimуsMeta;
  timestamp: string;
}

export interface MaksimусSnapshot {
  ukupanScore: number;
  domenScores: {
    analitickaOrkestracija: number;
    razvojnaStrategija: number;
    platformaKoordinacija: number;
    novaGeneracijaSync: number;
  };
  timestamp: string;
}

export interface MaksimусTaskInput {
  tip: 'analiticka-orkestracija' | 'razvojna-strategija' | 'platforma-koordinacija';
  kontekst?: string;
  prioritet?: 'visok' | 'srednji' | 'nizak';
}

export interface MaksimусTaskResult {
  taskId: string;
  tip: MaksimусTaskInput['tip'];
  rezultat: string;
  score: number;
  trajanjeMsEstimate: number;
  timestamp: string;
  handoffToAnotherMaks: boolean;
  handoffRazlog: string | null;
}

export interface MaksimусHandoffRequest {
  sourceAgent: string;
  targetAgent: string;
  kontekst: string;
  prioritet: 'visok' | 'srednji' | 'nizak';
  timestamp: string;
}

export interface MaksimусHandoffResult {
  handoffId: string;
  accepted: boolean;
  targetAgent: string;
  razlog: string;
  timestamp: string;
}
