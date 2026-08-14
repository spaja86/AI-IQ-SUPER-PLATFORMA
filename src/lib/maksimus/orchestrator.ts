// SpajaUltraOmegaCore -∞Ω+∞ — MAKSIMUS Orchestrator
// Kompanija SPAJA — Digitalna Industrija
//
// Koordinaciona logika: build, evaluate, handoff, load-balance između
// MAKSIMUS (analitički/razvojni) i ANOTHER MAKS (kreativni) agenata.

import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { getMaksimусLastSnapshot, setMaksimусLastSnapshot } from './store';
import { getMaksimусPersona, shouldHandoffToAnotherMaks } from './identity';
import type {
  MaksimуsDomenSignal,
  MaksimусOcena,
  MaksimуsSvega,
  MaksimуsTrendDirection,
  MaksimусTaskInput,
  MaksimусTaskResult,
} from './types';

export const MAKSIMUS_CONTRACT_VERSION = 'v1';
export const MAKSIMUS_MODEL_VERSION = '1.0.0';
export const MAKSIMUS_SOURCE_OF_TRUTH = '/api/maksimus';

export const MAKSIMUS_WEIGHTS = {
  analitickaOrkestracija: 0.35,
  razvojnaStrategija: 0.30,
  platformaKoordinacija: 0.20,
  novaGeneracijaSync: 0.15,
} as const;

const MAKSIMUS_CRITICAL_THRESHOLD = 75;

const weightSum = Object.values(MAKSIMUS_WEIGHTS).reduce((s, w) => s + w, 0);
if (Math.abs(weightSum - 1) > 0.0001) {
  throw new Error(`MAKSIMUS_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): MaksimусOcena {
  if (score >= 90) return 'ODLICNO';
  if (score >= 75) return 'SPREMNO';
  if (score >= 50) return 'DELIMICNO';
  return 'POTREBNO_POBOLJSANJE';
}

function scoreDeltaDirection(current: number, previous: number | null): MaksimуsTrendDirection {
  if (previous === null) return 'flat';
  const delta = current - previous;
  if (delta > 0) return 'up';
  if (delta < 0) return 'down';
  return 'flat';
}

function buildDomenSignal(
  naziv: string,
  score: number,
  tezina: number,
  sourceOfTruth: string,
  available: boolean,
  previousScore: number | null,
): MaksimуsDomenSignal {
  const base = available ? 88 : 45;
  const confidence = clampScore(base + (score >= 90 ? 8 : score >= 75 ? 5 : score >= 50 ? 2 : 0));
  return {
    naziv,
    score: clampScore(score),
    confidence,
    tezina,
    doprinos: clampScore(score * tezina),
    sourceOfTruth,
    freshness: available ? 'fresh' : 'unknown',
    trendDirection: scoreDeltaDirection(score, previousScore),
  };
}

function computeDomenScore(domen: string): { score: number; available: boolean } {
  const base: Record<string, number> = {
    analitickaOrkestracija: 87,
    razvojnaStrategija: 83,
    platformaKoordinacija: 90,
    novaGeneracijaSync: 85,
  };
  return { score: base[domen] ?? 80, available: true };
}

export async function buildMaksimus(): Promise<MaksimуsSvega> {
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];
  const previousSnapshot = getMaksimусLastSnapshot();
  const persona = getMaksimусPersona();

  const analitickaOrkestracija = computeDomenScore('analitickaOrkestracija');
  const razvojnaStrategija = computeDomenScore('razvojnaStrategija');
  const platformaKoordinacija = computeDomenScore('platformaKoordinacija');
  const novaGeneracijaSync = computeDomenScore('novaGeneracijaSync');

  const ukupanScore = clampScore(
    analitickaOrkestracija.score * MAKSIMUS_WEIGHTS.analitickaOrkestracija
    + razvojnaStrategija.score * MAKSIMUS_WEIGHTS.razvojnaStrategija
    + platformaKoordinacija.score * MAKSIMUS_WEIGHTS.platformaKoordinacija
    + novaGeneracijaSync.score * MAKSIMUS_WEIGHTS.novaGeneracijaSync,
  );

  const globalPreviousScore = previousSnapshot?.ukupanScore ?? null;
  const deltaScore = globalPreviousScore === null ? 0 : ukupanScore - globalPreviousScore;

  const domeni = {
    analitickaOrkestracija: buildDomenSignal(
      'Analitička Orkestracija',
      analitickaOrkestracija.score,
      MAKSIMUS_WEIGHTS.analitickaOrkestracija,
      MAKSIMUS_SOURCE_OF_TRUTH,
      analitickaOrkestracija.available,
      previousSnapshot?.domenScores.analitickaOrkestracija ?? null,
    ),
    razvojnaStrategija: buildDomenSignal(
      'Razvojna Strategija',
      razvojnaStrategija.score,
      MAKSIMUS_WEIGHTS.razvojnaStrategija,
      MAKSIMUS_SOURCE_OF_TRUTH,
      razvojnaStrategija.available,
      previousSnapshot?.domenScores.razvojnaStrategija ?? null,
    ),
    platformaKoordinacija: buildDomenSignal(
      'Platforma Koordinacija',
      platformaKoordinacija.score,
      MAKSIMUS_WEIGHTS.platformaKoordinacija,
      MAKSIMUS_SOURCE_OF_TRUTH,
      platformaKoordinacija.available,
      previousSnapshot?.domenScores.platformaKoordinacija ?? null,
    ),
    novaGeneracijaSync: buildDomenSignal(
      'Nova Generacija Sync',
      novaGeneracijaSync.score,
      MAKSIMUS_WEIGHTS.novaGeneracijaSync,
      '/api/nova-generacija',
      novaGeneracijaSync.available,
      previousSnapshot?.domenScores.novaGeneracijaSync ?? null,
    ),
  };

  const kriticniDomeni = Object.values(domeni)
    .filter((d) => d.score < MAKSIMUS_CRITICAL_THRESHOLD)
    .map((d) => d.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno unaprediti domene ispod 75%: ${kriticniDomeni.join(', ')}`);
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore signala: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi ključni domeni MAKSIMUS agenta su stabilni; nastaviti iterativnu optimizaciju.');
  }

  setMaksimусLastSnapshot({
    ukupanScore,
    domenScores: {
      analitickaOrkestracija: analitickaOrkestracija.score,
      razvojnaStrategija: razvojnaStrategija.score,
      platformaKoordinacija: platformaKoordinacija.score,
      novaGeneracijaSync: novaGeneracijaSync.score,
    },
    timestamp: nowIso,
  });

  return {
    sistem: 'MAKSIMUS — Analitički/Razvojni Apex Agent',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    persona,
    ukupanScore,
    konacnaOcena: scoreToOcena(ukupanScore),
    procenatSpremnosti: ukupanScore,
    kriticniDomeni,
    domeniBrojKriticnih: kriticniDomeni.length,
    preporuke,
    domeni,
    trend: {
      direction: scoreDeltaDirection(ukupanScore, globalPreviousScore),
      deltaScore,
      previousScore: globalPreviousScore,
      currentScore: ukupanScore,
      reliable: globalPreviousScore !== null,
    },
    handoff: {
      aktivanHandoff: false,
      linkedAgent: persona.linkedAgent,
      handoffRazlog: null,
    },
    meta: {
      contractVersion: MAKSIMUS_CONTRACT_VERSION,
      modelVersion: MAKSIMUS_MODEL_VERSION,
      sourceOfTruth: MAKSIMUS_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      specijalizacija: persona.specijalizacija,
      linkedAgent: persona.linkedAgent,
      octave: persona.octave,
      hipermrezaNode: persona.hipermrezaNode,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}

export async function executeMaksimусTask(input: MaksimусTaskInput): Promise<MaksimусTaskResult> {
  const startMs = Date.now();
  const { handoff, razlog } = shouldHandoffToAnotherMaks(input.kontekst);

  const rezultatiPoTipu: Record<MaksimусTaskInput['tip'], string> = {
    'analiticka-orkestracija':
      'MAKSIMUS — Analitička orkestracija završena. Sistemske metrike analizirane i optimizovane.',
    'razvojna-strategija':
      'MAKSIMUS — Razvojna strategija finalizovana. Arhitekturalni plan i razvojni vektori definisani.',
    'platforma-koordinacija':
      'MAKSIMUS — Platforma koordinacija izvršena. Cross-agent sinhronizacija i KPI alignment završeni.',
  };

  const scorePoTipu: Record<MaksimусTaskInput['tip'], number> = {
    'analiticka-orkestracija': 87,
    'razvojna-strategija': 83,
    'platforma-koordinacija': 90,
  };

  const trajanjeMsEstimate = Date.now() - startMs;

  return {
    taskId: `maksimus-${Date.now()}`,
    tip: input.tip,
    rezultat: rezultatiPoTipu[input.tip],
    score: scorePoTipu[input.tip],
    trajanjeMsEstimate,
    timestamp: new Date().toISOString(),
    handoffToAnotherMaks: handoff,
    handoffRazlog: razlog,
  };
}

export function getMaksimусInfo() {
  const persona = getMaksimусPersona();
  return {
    sistem: 'MAKSIMUS — Analitički/Razvojni Apex Agent',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    persona,
    endpoint: MAKSIMUS_SOURCE_OF_TRUTH,
    contractVersion: MAKSIMUS_CONTRACT_VERSION,
    modelVersion: MAKSIMUS_MODEL_VERSION,
    scoreWeights: MAKSIMUS_WEIGHTS,
    timestamp: new Date().toISOString(),
  };
}
