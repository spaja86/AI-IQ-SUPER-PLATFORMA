import { APP_VERSION } from '@/lib/constants';
import type { PolimerzacijaLanac } from '@/lib/polimerzacija';

export type PolimerizacijaFazaProcesa =
  | 'inicijacija'
  | 'propagacija'
  | 'terminacija'
  | 'kroslink'
  | 'umrezavanje'
  | 'purifikacija';

export type PolimerizacijaScanStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface PolimerzacijaLanacV2 extends PolimerzacijaLanac {
  molekularnaTezina: number;
  viskoznost: number;
  gustina: number;
  pritisak: number;
  ciklusiBroj: number;
  fazaProcesa: PolimerizacijaFazaProcesa;
}

export interface PolimerizacijaScanSession {
  scanId: string;
  startedAt: string;
  completedAt?: string;
  status: PolimerizacijaScanStatus;
  triggeredBy: string;
  durationMs?: number;
  indeksKohezije?: number;
  ukupnoLanaca?: number;
}

export interface PolimerizacijaScanSummary {
  scanId: string;
  startedAt: string;
  completedAt?: string;
  status: PolimerizacijaScanStatus;
  durationMs?: number;
  indeksKohezije?: number;
  ukupnoLanaca?: number;
}

export interface PolimerizacijaTrend {
  scanId: string;
  timestamp: string;
  indeksKohezije: number;
  delta: number;
}

export interface PolimerizacijaReportV2 {
  verzija: string;
  status: 'aktivan';
  scanId: string;
  indeksKohezije: number;
  stabilnost: number;
  ukupnaStopa: number;
  prosekStepena: number;
  prosekIskoriscenosti: number;
  aktivnih: number;
  optimizacija: number;
  kriticnih: number;
  lanci: PolimerzacijaLanacV2[];
  history: PolimerizacijaScanSummary[];
  trendovi: PolimerizacijaTrend[];
  userId: string;
  timestamp: string;
}

export interface PolimerizacijaSummaryV2 {
  verzija: string;
  indeksKohezije: number;
  stabilnost: number;
  ukupnoLanaca: number;
  kriticnih: number;
  trendDelta: number;
  lastScanId?: string;
  timestamp: string;
}

export interface PolimerizacijaStatusV2 {
  status: 'aktivan';
  indeksKohezije: number;
  stabilnost: number;
  kriticnih: number;
  trendDelta: number;
  lastScanId?: string;
  timestamp: string;
}

const MAX_HISTORY = 10;
const BASE_LANCI: Array<Omit<PolimerzacijaLanacV2, 'status'>> = [
  {
    id: 'pz2-inicijacija',
    naziv: 'Inicijacija Lanac V2',
    reakcionaStopa: 0.84,
    iskoriscenost: 0.79,
    stepen: 3.4,
    temperaturaProcesa: 208,
    molekularnaTezina: 1320,
    viskoznost: 0.43,
    gustina: 0.93,
    pritisak: 1.2,
    ciklusiBroj: 12,
    fazaProcesa: 'inicijacija',
  },
  {
    id: 'pz2-propagacija',
    naziv: 'Propagacija Lanac V2',
    reakcionaStopa: 0.79,
    iskoriscenost: 0.86,
    stepen: 4.3,
    temperaturaProcesa: 196,
    molekularnaTezina: 1580,
    viskoznost: 0.52,
    gustina: 0.97,
    pritisak: 1.35,
    ciklusiBroj: 16,
    fazaProcesa: 'propagacija',
  },
  {
    id: 'pz2-terminacija',
    naziv: 'Terminacija Lanac V2',
    reakcionaStopa: 0.9,
    iskoriscenost: 0.74,
    stepen: 2.9,
    temperaturaProcesa: 182,
    molekularnaTezina: 1210,
    viskoznost: 0.38,
    gustina: 0.9,
    pritisak: 1.08,
    ciklusiBroj: 10,
    fazaProcesa: 'terminacija',
  },
  {
    id: 'pz2-kroslink',
    naziv: 'Kroslink Lanac V2',
    reakcionaStopa: 0.69,
    iskoriscenost: 0.82,
    stepen: 3.7,
    temperaturaProcesa: 224,
    molekularnaTezina: 1690,
    viskoznost: 0.6,
    gustina: 1.01,
    pritisak: 1.42,
    ciklusiBroj: 14,
    fazaProcesa: 'kroslink',
  },
  {
    id: 'pz2-umrezavanje',
    naziv: 'Umrežavanje Lanac V2',
    reakcionaStopa: 0.73,
    iskoriscenost: 0.77,
    stepen: 4.0,
    temperaturaProcesa: 214,
    molekularnaTezina: 1775,
    viskoznost: 0.56,
    gustina: 1.04,
    pritisak: 1.5,
    ciklusiBroj: 18,
    fazaProcesa: 'umrezavanje',
  },
  {
    id: 'pz2-purifikacija',
    naziv: 'Purifikacija Lanac V2',
    reakcionaStopa: 0.87,
    iskoriscenost: 0.9,
    stepen: 4.5,
    temperaturaProcesa: 188,
    molekularnaTezina: 1495,
    viskoznost: 0.41,
    gustina: 0.95,
    pritisak: 1.16,
    ciklusiBroj: 9,
    fazaProcesa: 'purifikacija',
  },
];

const scanHistory: PolimerizacijaScanSession[] = [];
let scanCounter = 0;

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function nowIso(): string {
  return new Date().toISOString();
}

function buildScanId(): string {
  scanCounter += 1;
  return `pz2-${Date.now().toString(36)}-${scanCounter.toString(36)}`;
}

function classifyStatus(reakcionaStopa: number, iskoriscenost: number, stepen: number): PolimerzacijaLanac['status'] {
  if (stepen < 2.5 || reakcionaStopa < 0.55 || iskoriscenost < 0.7) return 'kritican';
  if (stepen < 3.3 || reakcionaStopa < 0.72 || iskoriscenost < 0.8) return 'optimizacija';
  return 'aktivan';
}

function normalizeHistory(): void {
  if (scanHistory.length > MAX_HISTORY) {
    scanHistory.splice(0, scanHistory.length - MAX_HISTORY);
  }
}

function mapHistory(): PolimerizacijaScanSummary[] {
  return scanHistory.map((s) => ({
    scanId: s.scanId,
    startedAt: s.startedAt,
    completedAt: s.completedAt,
    status: s.status,
    durationMs: s.durationMs,
    indeksKohezije: s.indeksKohezije,
    ukupnoLanaca: s.ukupnoLanaca,
  }));
}

function buildTrend(history: PolimerizacijaScanSummary[]): PolimerizacijaTrend[] {
  let prev = 0;
  return history
    .filter((h): h is PolimerizacijaScanSummary & { indeksKohezije: number } => typeof h.indeksKohezije === 'number')
    .map((h, index) => {
      const current = round4(h.indeksKohezije);
      const delta = index === 0 ? 0 : round4(current - prev);
      prev = current;
      return {
        scanId: h.scanId,
        timestamp: h.completedAt ?? h.startedAt,
        indeksKohezije: current,
        delta,
      };
    });
}

function buildLanci(seedOffset: number): PolimerzacijaLanacV2[] {
  const drift = (seedOffset % 7) * 0.003;
  return BASE_LANCI.map((lanac, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    const reakcionaStopa = clamp01(round4(lanac.reakcionaStopa + direction * drift));
    const iskoriscenost = clamp01(round4(lanac.iskoriscenost + direction * drift * 0.9));
    const stepen = round4(Math.max(1, lanac.stepen + direction * drift * 4));
    return {
      ...lanac,
      reakcionaStopa,
      iskoriscenost,
      stepen,
      status: classifyStatus(reakcionaStopa, iskoriscenost, stepen),
    };
  });
}

function computeKpi(lanci: PolimerzacijaLanacV2[]) {
  const ukupnaStopa = round4(lanci.reduce((sum, l) => sum + l.reakcionaStopa, 0) / lanci.length);
  const prosekStepena = round4(lanci.reduce((sum, l) => sum + l.stepen, 0) / lanci.length);
  const prosekIskoriscenosti = round4(lanci.reduce((sum, l) => sum + l.iskoriscenost, 0) / lanci.length);
  const stepenScore = clamp01(round4(prosekStepena / 10));
  const stabilnost = clamp01(
    round4(1 - (1 - ukupnaStopa) * 0.52 - (1 - prosekIskoriscenosti) * 0.28 - (1 - stepenScore) * 0.2),
  );
  const indeksKohezije = clamp01(round4(stabilnost * 0.46 + prosekIskoriscenosti * 0.34 + stepenScore * 0.2));
  return { ukupnaStopa, prosekStepena, prosekIskoriscenosti, stabilnost, indeksKohezije };
}

function ensureSeedHistory(): void {
  if (scanHistory.length > 0) return;
  const seedScores = [0.7412, 0.7689, 0.7921];
  const now = Date.now();
  for (let i = 0; i < seedScores.length; i += 1) {
    const startedAt = new Date(now - (seedScores.length - i) * 10 * 60 * 1000).toISOString();
    const completedAt = new Date(now - (seedScores.length - i) * 9 * 60 * 1000).toISOString();
    scanHistory.push({
      scanId: `pz2-seed-${i + 1}`,
      startedAt,
      completedAt,
      status: 'completed',
      triggeredBy: 'seed',
      durationMs: 35_000 + i * 2_500,
      indeksKohezije: seedScores[i],
      ukupnoLanaca: BASE_LANCI.length,
    });
  }
  scanCounter = seedScores.length;
}

export function startPolimerizacija2Scan(triggeredBy = 'system'): PolimerizacijaScanSession {
  ensureSeedHistory();
  const session: PolimerizacijaScanSession = {
    scanId: buildScanId(),
    startedAt: nowIso(),
    status: 'running',
    triggeredBy,
  };
  scanHistory.push(session);
  normalizeHistory();
  return session;
}

export function completePolimerizacija2Scan(
  scanId: string,
  payload?: { indeksKohezije?: number; ukupnoLanaca?: number },
): PolimerizacijaScanSession {
  const session = scanHistory.find((entry) => entry.scanId === scanId);
  if (!session) {
    throw new Error(`Nepostojeći scanId: ${scanId}`);
  }
  const completedAt = nowIso();
  session.completedAt = completedAt;
  session.status = 'completed';
  session.durationMs = Math.max(1, Date.parse(completedAt) - Date.parse(session.startedAt));
  if (payload?.indeksKohezije !== undefined) session.indeksKohezije = round4(payload.indeksKohezije);
  if (payload?.ukupnoLanaca !== undefined) session.ukupnoLanaca = payload.ukupnoLanaca;
  return session;
}

export function filterLanci(
  lanci: PolimerzacijaLanacV2[],
  faza?: PolimerizacijaFazaProcesa,
  minKohezija?: number,
  status?: PolimerzacijaLanac['status'],
): PolimerzacijaLanacV2[] {
  return lanci.filter((lanac) => {
    if (faza && lanac.fazaProcesa !== faza) return false;
    if (status && lanac.status !== status) return false;
    if (minKohezija !== undefined && lanac.iskoriscenost < minKohezija) return false;
    return true;
  });
}

export function getPolimerizacija2History(): PolimerizacijaScanSummary[] {
  ensureSeedHistory();
  return mapHistory();
}

export function getPolimerizacija2Trend(n = 5): PolimerizacijaTrend[] {
  ensureSeedHistory();
  const history = mapHistory();
  const trend = buildTrend(history);
  if (n <= 0) return [];
  return trend.slice(Math.max(0, trend.length - n));
}

export function buildPolimerizacija2Report(userId = 'system'): PolimerizacijaReportV2 {
  ensureSeedHistory();
  const session = startPolimerizacija2Scan(userId);
  const lanci = buildLanci(scanCounter);
  const metrics = computeKpi(lanci);
  const completed = completePolimerizacija2Scan(session.scanId, {
    indeksKohezije: metrics.indeksKohezije,
    ukupnoLanaca: lanci.length,
  });

  const history = mapHistory();
  const trendovi = buildTrend(history);
  const aktivnih = lanci.filter((l) => l.status === 'aktivan').length;
  const optimizacija = lanci.filter((l) => l.status === 'optimizacija').length;
  const kriticnih = lanci.filter((l) => l.status === 'kritican').length;

  return {
    verzija: APP_VERSION,
    status: 'aktivan',
    scanId: completed.scanId,
    indeksKohezije: metrics.indeksKohezije,
    stabilnost: metrics.stabilnost,
    ukupnaStopa: metrics.ukupnaStopa,
    prosekStepena: metrics.prosekStepena,
    prosekIskoriscenosti: metrics.prosekIskoriscenosti,
    aktivnih,
    optimizacija,
    kriticnih,
    lanci,
    history,
    trendovi,
    userId,
    timestamp: nowIso(),
  };
}

export function buildPolimerizacija2Summary(userId = 'system'): PolimerizacijaSummaryV2 {
  const report = buildPolimerizacija2Report(userId);
  const trendDelta = report.trendovi.length > 0 ? report.trendovi[report.trendovi.length - 1].delta : 0;
  return {
    verzija: APP_VERSION,
    indeksKohezije: report.indeksKohezije,
    stabilnost: report.stabilnost,
    ukupnoLanaca: report.lanci.length,
    kriticnih: report.kriticnih,
    trendDelta,
    lastScanId: report.scanId,
    timestamp: report.timestamp,
  };
}

export function getPolimerizacija2Status(): PolimerizacijaStatusV2 {
  const summary = buildPolimerizacija2Summary('status');
  return {
    status: 'aktivan',
    indeksKohezije: summary.indeksKohezije,
    stabilnost: summary.stabilnost,
    kriticnih: summary.kriticnih,
    trendDelta: summary.trendDelta,
    lastScanId: summary.lastScanId,
    timestamp: summary.timestamp,
  };
}
