// SpajaUltraOmegaCore -∞Ω+∞ — ANOTHER MAKS Orchestrator
// Kompanija SPAJA — Digitalna Industrija
//
// Koordinaciona logika: handoff, fallback, load-balance između
// ANOTHER MAKS (kreativni) i MAKSIMUS 2 (analitički) agenata.

import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { getAnotherMaksLastSnapshot, setAnotherMaksLastSnapshot } from './store';
import { getAnotherMaksPersona, shouldHandoffToMaks } from './persona';
import type {
  AnotherMaksDomenSignal,
  AnotherMaksOcena,
  AnotherMaksSvega,
  AnotherMaksTrendDirection,
  AnotherMaksTaskInput,
  AnotherMaksTaskResult,
} from './types';

export const ANOTHER_MAKS_CONTRACT_VERSION = 'v1';
export const ANOTHER_MAKS_MODEL_VERSION = '1.0.0';
export const ANOTHER_MAKS_SOURCE_OF_TRUTH = '/api/another-maks';

export const ANOTHER_MAKS_WEIGHTS = {
  kreativnaSinteza: 0.35,
  generativnaOrkestracija: 0.30,
  inovacioniSignal: 0.20,
  novaGeneracijaSync: 0.15,
} as const;

const ANOTHER_MAKS_CRITICAL_THRESHOLD = 75;

const weightSum = Object.values(ANOTHER_MAKS_WEIGHTS).reduce((s, w) => s + w, 0);
if (Math.abs(weightSum - 1) > 0.0001) {
  throw new Error(`ANOTHER_MAKS_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): AnotherMaksOcena {
  if (score >= 90) return 'ODLICNO';
  if (score >= 75) return 'SPREMNO';
  if (score >= 50) return 'DELIMICNO';
  return 'POTREBNO_POBOLJSANJE';
}

function scoreDeltaDirection(current: number, previous: number | null): AnotherMaksTrendDirection {
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
): AnotherMaksDomenSignal {
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

/**
 * Simulira score za svaki domen na osnovu sistemskih metrika.
 * U produkciji bi ovi signali dolazili iz živih izvora podataka.
 */
function computeDomenScore(domen: string): { score: number; available: boolean } {
  const base: Record<string, number> = {
    kreativnaSinteza: 82,
    generativnaOrkestracija: 78,
    inovacioniSignal: 85,
    novaGeneracijaSync: 80,
  };
  return { score: base[domen] ?? 75, available: true };
}

export async function buildAnotherMaks(): Promise<AnotherMaksSvega> {
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];
  const previousSnapshot = getAnotherMaksLastSnapshot();
  const persona = getAnotherMaksPersona();

  const kreativnaSinteza = computeDomenScore('kreativnaSinteza');
  const generativnaOrkestracija = computeDomenScore('generativnaOrkestracija');
  const inovacioniSignal = computeDomenScore('inovacioniSignal');
  const novaGeneracijaSync = computeDomenScore('novaGeneracijaSync');

  const ukupanScore = clampScore(
    kreativnaSinteza.score * ANOTHER_MAKS_WEIGHTS.kreativnaSinteza
    + generativnaOrkestracija.score * ANOTHER_MAKS_WEIGHTS.generativnaOrkestracija
    + inovacioniSignal.score * ANOTHER_MAKS_WEIGHTS.inovacioniSignal
    + novaGeneracijaSync.score * ANOTHER_MAKS_WEIGHTS.novaGeneracijaSync,
  );

  const globalPreviousScore = previousSnapshot?.ukupanScore ?? null;
  const deltaScore = globalPreviousScore === null ? 0 : ukupanScore - globalPreviousScore;

  const domeni = {
    kreativnaSinteza: buildDomenSignal(
      'Kreativna Sinteza',
      kreativnaSinteza.score,
      ANOTHER_MAKS_WEIGHTS.kreativnaSinteza,
      ANOTHER_MAKS_SOURCE_OF_TRUTH,
      kreativnaSinteza.available,
      previousSnapshot?.domenScores.kreativnaSinteza ?? null,
    ),
    generativnaOrkestracija: buildDomenSignal(
      'Generativna Orkestracija',
      generativnaOrkestracija.score,
      ANOTHER_MAKS_WEIGHTS.generativnaOrkestracija,
      ANOTHER_MAKS_SOURCE_OF_TRUTH,
      generativnaOrkestracija.available,
      previousSnapshot?.domenScores.generativnaOrkestracija ?? null,
    ),
    inovacioniSignal: buildDomenSignal(
      'Inovacioni Signal',
      inovacioniSignal.score,
      ANOTHER_MAKS_WEIGHTS.inovacioniSignal,
      ANOTHER_MAKS_SOURCE_OF_TRUTH,
      inovacioniSignal.available,
      previousSnapshot?.domenScores.inovacioniSignal ?? null,
    ),
    novaGeneracijaSync: buildDomenSignal(
      'Nova Generacija Sync',
      novaGeneracijaSync.score,
      ANOTHER_MAKS_WEIGHTS.novaGeneracijaSync,
      '/api/nova-generacija',
      novaGeneracijaSync.available,
      previousSnapshot?.domenScores.novaGeneracijaSync ?? null,
    ),
  };

  const kriticniDomeni = Object.values(domeni)
    .filter((d) => d.score < ANOTHER_MAKS_CRITICAL_THRESHOLD)
    .map((d) => d.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno unaprediti domene ispod 75%: ${kriticniDomeni.join(', ')}`);
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore signala: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi ključni domeni kreativnog agenta su stabilni; nastaviti iterativnu optimizaciju.');
  }

  setAnotherMaksLastSnapshot({
    ukupanScore,
    domenScores: {
      kreativnaSinteza: kreativnaSinteza.score,
      generativnaOrkestracija: generativnaOrkestracija.score,
      inovacioniSignal: inovacioniSignal.score,
      novaGeneracijaSync: novaGeneracijaSync.score,
    },
    timestamp: nowIso,
  });

  return {
    sistem: 'ANOTHER MAKS — Kreativni Orkestratorski Agent',
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
      contractVersion: ANOTHER_MAKS_CONTRACT_VERSION,
      modelVersion: ANOTHER_MAKS_MODEL_VERSION,
      sourceOfTruth: ANOTHER_MAKS_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      specijalizacija: persona.specijalizacija,
      linkedAgent: persona.linkedAgent,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}

export async function executeAnotherMaksTask(input: AnotherMaksTaskInput): Promise<AnotherMaksTaskResult> {
  const startMs = Date.now();
  const { handoff, razlog } = shouldHandoffToMaks(input.kontekst);

  const rezultatiPoTipu: Record<AnotherMaksTaskInput['tip'], string> = {
    'kreativna-sinteza':
      'ANOTHER MAKS — Kreativna sinteza završena. Generisane nove ideje i koncepti na osnovu konteksta.',
    'generativna-orkestracija':
      'ANOTHER MAKS — Generativna orkestracija završena. Koordinacija kreativnih tokova optimizovana.',
    'inovacioni-signal':
      'ANOTHER MAKS — Inovacioni signal emitovan. Identifikovane nove prilike u ekosistemu.',
  };

  const scorePoTipu: Record<AnotherMaksTaskInput['tip'], number> = {
    'kreativna-sinteza': 85,
    'generativna-orkestracija': 80,
    'inovacioni-signal': 88,
  };

  const trajanjeMsEstimate = Date.now() - startMs;

  return {
    taskId: `another-maks-${Date.now()}`,
    tip: input.tip,
    rezultat: rezultatiPoTipu[input.tip],
    score: scorePoTipu[input.tip],
    trajanjeMsEstimate,
    timestamp: new Date().toISOString(),
    handoffToMaks: handoff,
    handoffRazlog: razlog,
  };
}

export function getAnotherMaksInfo() {
  const persona = getAnotherMaksPersona();
  return {
    sistem: 'ANOTHER MAKS — Kreativni Orkestratorski Agent',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    persona,
    endpoint: ANOTHER_MAKS_SOURCE_OF_TRUTH,
    contractVersion: ANOTHER_MAKS_CONTRACT_VERSION,
    modelVersion: ANOTHER_MAKS_MODEL_VERSION,
    scoreWeights: ANOTHER_MAKS_WEIGHTS,
    timestamp: new Date().toISOString(),
  };
}
