import { getOperativnaSpremnost } from './kompanija-spaja-operativa';
import { getDeployStatistike } from './proksi-github-deploy';
import {
  buildEkstremnoProcesuiranjeSvegaFallback,
  buildProcesuiranjeSvega,
  PROCESUIRANJE_SVEGA_CONTRACT_VERSION,
  PROCESUIRANJE_SVEGA_MODEL_VERSION,
  type ProcesuiranjeDomen,
  type ProcesuiranjePrioritet,
  type ProcesuiranjeStavka,
  type ProcesuiranjeSvegaRezultat,
} from './procesuiranje-svega';
import {
  addProcesuiranje3Snapshot,
  getProcesuiranje3LastSnapshot,
  getProcesuiranje3Snapshots,
} from './procesuiranje-3-store';
import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA } from './constants';

export const PROCESUIRANJE_3_CONTRACT_VERSION = 'v3';
export const PROCESUIRANJE_3_MODEL_VERSION = '3.0.0';
export const PROCESUIRANJE_3_SOURCE_OF_TRUTH = '/api/procesuiranje-3';

export type Procesuiranje3TrendDirection = 'up' | 'down' | 'flat';

export interface Procesuiranje3Trend {
  direction: Procesuiranje3TrendDirection;
  deltaScore: number;
  previousScore: number | null;
  currentScore: number;
  reliable: boolean;
}

export interface Procesuiranje3SLA {
  pragovi: {
    throughputPerMin: number;
    latencyMsP95: number;
    maxErrorRatePct: number;
    maxQueueDepth: number;
    runtimeReady: true;
    opsReady: true;
  };
  prolaz: {
    throughput: boolean;
    latency: boolean;
    errorRate: boolean;
    queueDepth: boolean;
    runtimeReady: boolean;
    opsReady: boolean;
    ukupno: boolean;
  };
}

export interface Procesuiranje3Meta {
  contractVersion: typeof PROCESUIRANJE_3_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof PROCESUIRANJE_3_SOURCE_OF_TRUTH;
  generatedAt: string;
  compatibilityMode: 'dual-run-v2-v3';
  v2ContractVersion: typeof PROCESUIRANJE_SVEGA_CONTRACT_VERSION;
  v2ModelVersion: typeof PROCESUIRANJE_SVEGA_MODEL_VERSION;
  v2SourceOfTruth: '/api/procesuiranje-svega';
  degraded: boolean;
  degradedSources: string[];
}

export interface Procesuiranje3Rezultat extends Omit<ProcesuiranjeSvegaRezultat, 'ukupanProcenat' | 'domeni' | 'meta'> {
  ukupanScore: number;
  domeni: ProcesuiranjeSvegaRezultat['domeni'] & {
    platformski: ProcesuiranjeDomen;
  };
  trend: Procesuiranje3Trend;
  history: Array<{
    score: number;
    timestamp: string;
  }>;
  priorityBuckets: Record<ProcesuiranjePrioritet, number>;
  sla: Procesuiranje3SLA;
  meta: Procesuiranje3Meta;
}

const SLA_PRAGOVI: Procesuiranje3SLA['pragovi'] = {
  throughputPerMin: 1200,
  latencyMsP95: 300,
  maxErrorRatePct: 2,
  maxQueueDepth: 80,
  runtimeReady: true,
  opsReady: true,
};

const AKTIVNA_STAVKA_WEIGHT = 0.6;
const PROCESUIRANJE_3_SNAPSHOT_MIN_INTERVAL_MS = 30_000;

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreDeltaDirection(current: number, previous: number | null): Procesuiranje3TrendDirection {
  if (previous === null) return 'flat';
  const delta = current - previous;
  if (delta > 0) return 'up';
  if (delta < 0) return 'down';
  return 'flat';
}

function safeCall<T>(sourceName: string, degradedSources: string[], fn: () => T): T | null {
  try {
    return fn();
  } catch (error) {
    degradedSources.push(sourceName);
    console.error('[procesuiranje-3] source failure:', sourceName, error);
    return null;
  }
}

function classifyPrioritet(status: ProcesuiranjeStavka['status']): ProcesuiranjePrioritet {
  if (status === 'greska') return 'kriticno';
  if (status === 'aktivno') return 'visoko';
  if (status === 'cekanje') return 'srednje';
  return 'nisko';
}

function buildPlatformskiDomen(
  now: string,
  runtimeReady: boolean,
  opsReady: boolean,
  deployUToku: number,
  cekajuMerge: number,
): ProcesuiranjeDomen {
  const stavke: ProcesuiranjeStavka[] = [
    {
      id: 'plat-001',
      opis: `Runtime readiness: ${runtimeReady ? 'runtime-ready' : 'nije-spremno'}`,
      status: runtimeReady ? 'zavrseno' : 'cekanje',
      tip: 'runtime',
      prioritet: runtimeReady ? 'nisko' : 'kriticno',
    },
    {
      id: 'plat-002',
      opis: `Ops readiness: ${opsReady ? 'ops-ready' : 'nije-spremno'}`,
      status: opsReady ? 'zavrseno' : 'cekanje',
      tip: 'ops',
      prioritet: opsReady ? 'nisko' : 'visoko',
    },
    {
      id: 'plat-003',
      opis: `Deploy pipeline: u toku ${deployUToku}, cekaju merge ${cekajuMerge}`,
      status: cekajuMerge > 0 || deployUToku > 0 ? 'aktivno' : 'zavrseno',
      tip: 'deploy',
      prioritet: cekajuMerge > 0 ? 'visoko' : 'srednje',
    },
  ];

  const zavrsenih = stavke.filter((s) => s.status === 'zavrseno').length;
  const aktivnih = stavke.filter((s) => s.status === 'aktivno').length;
  const gresaka = stavke.filter((s) => s.status === 'greska').length;
  const procenat = clampScore(((zavrsenih + aktivnih * AKTIVNA_STAVKA_WEIGHT) / Math.max(1, stavke.length)) * 100);
  const status = gresaka > 0
    ? 'greska'
    : aktivnih > 0
      ? 'aktivno'
      : zavrsenih === stavke.length
        ? 'zavrseno'
        : 'cekanje';

  return {
    naziv: 'Platformski Procesi',
    ikona: '🛰️',
    status,
    procenat,
    stavke,
    vreme: now,
    freshness: 'fresh',
  };
}

function buildFallbackProcesuiranje3(reason: string): Procesuiranje3Rezultat {
  const now = new Date().toISOString();
  const fallbackV2 = buildEkstremnoProcesuiranjeSvegaFallback(`procesuiranje-3:${reason}`);
  const platformski = buildPlatformskiDomen(now, false, false, 0, 0);
  const ukupanScore = clampScore((fallbackV2.ukupanProcenat + platformski.procenat) / 2);

  return {
    ...fallbackV2,
    ukupanScore,
    domeni: {
      ...fallbackV2.domeni,
      platformski,
    },
    trend: {
      direction: 'flat',
      deltaScore: 0,
      previousScore: null,
      currentScore: ukupanScore,
      reliable: false,
    },
    history: [],
    priorityBuckets: {
      kriticno: 0,
      visoko: 0,
      srednje: 0,
      nisko: 0,
    },
    sla: {
      pragovi: SLA_PRAGOVI,
      prolaz: {
        throughput: false,
        latency: false,
        errorRate: false,
        queueDepth: false,
        runtimeReady: false,
        opsReady: false,
        ukupno: false,
      },
    },
    meta: {
      contractVersion: PROCESUIRANJE_3_CONTRACT_VERSION,
      modelVersion: PROCESUIRANJE_3_MODEL_VERSION,
      sourceOfTruth: PROCESUIRANJE_3_SOURCE_OF_TRUTH,
      generatedAt: now,
      compatibilityMode: 'dual-run-v2-v3',
      v2ContractVersion: PROCESUIRANJE_SVEGA_CONTRACT_VERSION,
      v2ModelVersion: PROCESUIRANJE_SVEGA_MODEL_VERSION,
      v2SourceOfTruth: '/api/procesuiranje-svega',
      degraded: true,
      degradedSources: [reason],
    },
  };
}

export function buildProcesuiranje3(): Procesuiranje3Rezultat {
  const now = new Date().toISOString();
  const degradedSources: string[] = [];

  const rezultatV2 = safeCall('procesuiranje-svega(v2)', degradedSources, () => buildProcesuiranjeSvega());
  if (!rezultatV2) {
    return buildFallbackProcesuiranje3('critical:procesuiranje-svega(v2)');
  }

  const operativa = safeCall('kompanija-spaja-operativa', degradedSources, () => getOperativnaSpremnost());
  const deployStats = safeCall('proksi-github-deploy', degradedSources, () => getDeployStatistike());

  const runtimeReady = operativa?.spremnost.modelStanja.runtime === 'runtime-ready';
  const opsReady = operativa?.spremnost.modelStanja.ops === 'ops-ready';
  const deployUToku = deployStats?.deployUToku ?? 0;
  const cekajuMerge = deployStats?.cekajuMerge ?? 0;

  const platformski = buildPlatformskiDomen(now, runtimeReady, opsReady, deployUToku, cekajuMerge);
  const domeni = {
    ...rezultatV2.domeni,
    platformski,
  };

  const sveStavke = Object.values(domeni).flatMap((domen) => domen.stavke);
  const aktivnihProcesa = sveStavke.filter((s) => s.status === 'aktivno').length;
  const cekajucihProcesa = sveStavke.filter((s) => s.status === 'cekanje').length;
  const gresakaUkupno = sveStavke.filter((s) => s.status === 'greska').length;
  const zavrsenihProcesa = sveStavke.filter((s) => s.status === 'zavrseno').length;
  const ukupanScore = clampScore(
    Object.values(domeni).reduce((sum, d) => sum + d.procenat, 0) / Object.values(domeni).length,
  );

  const previousSnapshot = getProcesuiranje3LastSnapshot();
  const history = getProcesuiranje3Snapshots().map((s) => ({ score: s.ukupanScore, timestamp: s.timestamp }));
  const deltaScore = previousSnapshot ? ukupanScore - previousSnapshot.ukupanScore : 0;
  const trendDirection = scoreDeltaDirection(ukupanScore, previousSnapshot?.ukupanScore ?? null);

  const shouldPersistSnapshot = (() => {
    if (!previousSnapshot) return true;
    const previousTs = Date.parse(previousSnapshot.timestamp);
    if (Number.isNaN(previousTs)) return true;
    const elapsedMs = Date.now() - previousTs;
    const scoreChanged = previousSnapshot.ukupanScore !== ukupanScore;
    return scoreChanged || elapsedMs >= PROCESUIRANJE_3_SNAPSHOT_MIN_INTERVAL_MS;
  })();

  if (shouldPersistSnapshot) {
    addProcesuiranje3Snapshot({
      ukupanScore,
      queueDepth: rezultatV2.scheduler.queueDepth + platformski.stavke.length,
      throughputPerMin: rezultatV2.score.throughputPerMin,
      latencyMsP95: rezultatV2.score.latencyMsP95,
      errorRatePct: rezultatV2.score.errorRatePct,
      timestamp: now,
    });
  }

  const priorityBuckets = sveStavke.reduce<Record<ProcesuiranjePrioritet, number>>((acc, stavka) => {
    const p = stavka.prioritet ?? classifyPrioritet(stavka.status);
    acc[p] += 1;
    return acc;
  }, {
    kriticno: 0,
    visoko: 0,
    srednje: 0,
    nisko: 0,
  });

  const throughputPass = rezultatV2.score.throughputPerMin >= SLA_PRAGOVI.throughputPerMin;
  const latencyPass = rezultatV2.score.latencyMsP95 <= SLA_PRAGOVI.latencyMsP95;
  const errorRatePass = rezultatV2.score.errorRatePct <= SLA_PRAGOVI.maxErrorRatePct;
  const queueDepthPass = rezultatV2.scheduler.queueDepth <= SLA_PRAGOVI.maxQueueDepth;
  const runtimeReadyPass = runtimeReady;
  const opsReadyPass = opsReady;

  const uskaGrla = [...rezultatV2.uskaGrla];
  if (!runtimeReadyPass) uskaGrla.push('Runtime readiness nije na runtime-ready.');
  if (!opsReadyPass) uskaGrla.push('Ops readiness nije na ops-ready.');

  const preporuke = [...rezultatV2.preporuke];
  if (!throughputPass) preporuke.push(`Povećati throughput na najmanje ${SLA_PRAGOVI.throughputPerMin}/min.`);
  if (!latencyPass) preporuke.push(`Smanjiti p95 latenciju ispod ${SLA_PRAGOVI.latencyMsP95}ms.`);
  if (!errorRatePass) preporuke.push(`Spustiti error-rate ispod ${SLA_PRAGOVI.maxErrorRatePct}%.`);
  if (!queueDepthPass) preporuke.push(`Rasteretiti queue depth ispod ${SLA_PRAGOVI.maxQueueDepth}.`);

  return {
    sistem: 'PROCESUIRANJE 3 — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    ukupanScore,
    aktivnihProcesa,
    cekajucihProcesa,
    gresakaUkupno,
    zavrsenihProcesa,
    domeni,
    aktivneStavke: sveStavke.filter((s) => s.status === 'aktivno'),
    scheduler: {
      ...rezultatV2.scheduler,
      queueDepth: rezultatV2.scheduler.queueDepth + platformski.stavke.length,
    },
    score: rezultatV2.score,
    kriticniProcesi: sveStavke.filter((s) => (s.prioritet ?? classifyPrioritet(s.status)) === 'kriticno'),
    uskaGrla,
    preporuke,
    trend: {
      direction: trendDirection,
      deltaScore,
      previousScore: previousSnapshot?.ukupanScore ?? null,
      currentScore: ukupanScore,
      reliable: previousSnapshot !== null,
    },
    history,
    priorityBuckets,
    sla: {
      pragovi: SLA_PRAGOVI,
      prolaz: {
        throughput: throughputPass,
        latency: latencyPass,
        errorRate: errorRatePass,
        queueDepth: queueDepthPass,
        runtimeReady: runtimeReadyPass,
        opsReady: opsReadyPass,
        ukupno: throughputPass && latencyPass && errorRatePass && queueDepthPass && runtimeReadyPass && opsReadyPass,
      },
    },
    meta: {
      contractVersion: PROCESUIRANJE_3_CONTRACT_VERSION,
      modelVersion: PROCESUIRANJE_3_MODEL_VERSION,
      sourceOfTruth: PROCESUIRANJE_3_SOURCE_OF_TRUTH,
      generatedAt: now,
      compatibilityMode: 'dual-run-v2-v3',
      v2ContractVersion: PROCESUIRANJE_SVEGA_CONTRACT_VERSION,
      v2ModelVersion: PROCESUIRANJE_SVEGA_MODEL_VERSION,
      v2SourceOfTruth: '/api/procesuiranje-svega',
      degraded: rezultatV2.meta.degraded || degradedSources.length > 0,
      degradedSources: [
        ...new Set([
          ...rezultatV2.meta.degradedSources,
          ...degradedSources,
        ]),
      ],
    },
    timestamp: now,
  };
}
