// SpajaUltraOmegaCore -∞Ω+∞ — ANOTHER MAKS
// Kompanija SPAJA — Digitalna Industrija
//
// Shared TypeScript types za ANOTHER MAKS — kreativan/generativni agent
// paralelno uz MAKSIMUS 2/3 (analitički/razvojni agent).

export type AnotherMaksOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type AnotherMaksTrendDirection = 'up' | 'down' | 'flat';
export type AnotherMaksSpecijalizacija = 'kreativna-sinteza' | 'generativna-orkestracija' | 'inovacioni-signal' | 'neaktivan';

export interface AnotherMaksPersonaInfo {
  id: string;
  naziv: string;
  specijalizacija: AnotherMaksSpecijalizacija;
  opis: string;
  verzija: string;
  linkedAgent: string;
  performanceKpi: {
    evaluacijaMaxMs: number;
    buildMaxMin: number;
    uptimeSla: string;
  };
}

export interface AnotherMaksDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
  trendDirection: AnotherMaksTrendDirection;
}

export interface AnotherMaksTrend {
  direction: AnotherMaksTrendDirection;
  deltaScore: number;
  previousScore: number | null;
  currentScore: number;
  reliable: boolean;
}

export interface AnotherMaksMeta {
  contractVersion: string;
  modelVersion: string;
  sourceOfTruth: string;
  generatedAt: string;
  specijalizacija: AnotherMaksSpecijalizacija;
  linkedAgent: string;
  degraded: boolean;
  degradedSources: string[];
}

export interface AnotherMaksSvega {
  sistem: string;
  kompanija: string;
  verzija: string;
  persona: AnotherMaksPersonaInfo;
  ukupanScore: number;
  konacnaOcena: AnotherMaksOcena;
  procenatSpremnosti: number;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  domeni: {
    kreativnaSinteza: AnotherMaksDomenSignal;
    generativnaOrkestracija: AnotherMaksDomenSignal;
    inovacioniSignal: AnotherMaksDomenSignal;
    novaGeneracijaSync: AnotherMaksDomenSignal;
  };
  trend: AnotherMaksTrend;
  handoff: {
    aktivanHandoff: boolean;
    linkedAgent: string;
    handoffRazlog: string | null;
  };
  meta: AnotherMaksMeta;
  timestamp: string;
}

export interface AnotherMaksSnapshot {
  ukupanScore: number;
  domenScores: {
    kreativnaSinteza: number;
    generativnaOrkestracija: number;
    inovacioniSignal: number;
    novaGeneracijaSync: number;
  };
  timestamp: string;
}

export interface AnotherMaksTaskInput {
  tip: 'kreativna-sinteza' | 'generativna-orkestracija' | 'inovacioni-signal';
  kontekst?: string;
  prioritet?: 'visok' | 'srednji' | 'nizak';
}

export interface AnotherMaksTaskResult {
  taskId: string;
  tip: AnotherMaksTaskInput['tip'];
  rezultat: string;
  score: number;
  trajanjeMsEstimate: number;
  timestamp: string;
  handoffToMaks: boolean;
  handoffRazlog: string | null;
}
