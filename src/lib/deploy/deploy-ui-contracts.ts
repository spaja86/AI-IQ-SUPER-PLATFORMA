import type { PlatformDeployStatus, VercelDeployState } from './deploy-status';

interface StatusApiPlatformCounters {
  ukupno?: unknown;
  aktivan?: unknown;
  grade?: unknown;
  greska?: unknown;
  nepoznato?: unknown;
}

interface StatusApiResponse {
  status?: unknown;
  lista?: unknown;
  platforme?: StatusApiPlatformCounters;
  timestamp?: unknown;
}

const KNOWN_STATES: VercelDeployState[] = [
  'READY',
  'BUILDING',
  'ERROR',
  'CANCELED',
  'QUEUED',
  'INITIALIZING',
  'UNKNOWN',
];

function toNonNegativeInt(value: unknown): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Math.max(0, Math.floor(value));
}

function normalizeState(value: unknown): VercelDeployState {
  if (typeof value !== 'string') return 'UNKNOWN';
  const upper = value.toUpperCase();
  return KNOWN_STATES.includes(upper as VercelDeployState)
    ? (upper as VercelDeployState)
    : 'UNKNOWN';
}

function normalizePlatformStatus(item: unknown): PlatformDeployStatus | null {
  if (!item || typeof item !== 'object') return null;
  const raw = item as Record<string, unknown>;

  const platformId = typeof raw.platformId === 'string' && raw.platformId.trim().length > 0
    ? raw.platformId.trim()
    : null;

  if (!platformId) return null;

  const naziv = typeof raw.naziv === 'string' && raw.naziv.trim().length > 0
    ? raw.naziv.trim()
    : platformId;

  return {
    platformId,
    naziv,
    ikona: typeof raw.ikona === 'string' && raw.ikona.trim() ? raw.ikona : '🌐',
    vercelProjectId: typeof raw.vercelProjectId === 'string' ? raw.vercelProjectId : 'unknown-project',
    state: normalizeState(raw.state),
    url: typeof raw.url === 'string' && raw.url.trim().length > 0 ? raw.url : null,
    deploymentId: typeof raw.deploymentId === 'string' && raw.deploymentId.trim().length > 0 ? raw.deploymentId : null,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : null,
    error: typeof raw.error === 'string' && raw.error.trim().length > 0 ? raw.error : null,
    checkedAt: typeof raw.checkedAt === 'string' ? raw.checkedAt : new Date().toISOString(),
  };
}

export interface DeployOverviewStats {
  ukupno: number;
  aktivan: number;
  grade: number;
  greska: number;
  nepoznato: number;
}

export interface NormalizedStatusPayload {
  status: 'ok' | 'error';
  lista: PlatformDeployStatus[];
  platforme: DeployOverviewStats;
  timestamp: string;
}

export function normalizeStatusApiPayload(payload: unknown): NormalizedStatusPayload {
  const raw = (payload && typeof payload === 'object' ? payload : {}) as StatusApiResponse;

  const listaRaw = Array.isArray(raw.lista) ? raw.lista : [];
  const lista = listaRaw
    .map(normalizePlatformStatus)
    .filter((item): item is PlatformDeployStatus => item !== null);

  const counters = raw.platforme ?? {};
  const fromServer: DeployOverviewStats = {
    ukupno: toNonNegativeInt(counters.ukupno),
    aktivan: toNonNegativeInt(counters.aktivan),
    grade: toNonNegativeInt(counters.grade),
    greska: toNonNegativeInt(counters.greska),
    nepoznato: toNonNegativeInt(counters.nepoznato),
  };

  const fromList = buildOverviewFromList(lista);

  const platforme: DeployOverviewStats = {
    ukupno: fromServer.ukupno > 0 ? fromServer.ukupno : fromList.ukupno,
    aktivan: fromServer.aktivan > 0 ? fromServer.aktivan : fromList.aktivan,
    grade: fromServer.grade > 0 ? fromServer.grade : fromList.grade,
    greska: fromServer.greska > 0 ? fromServer.greska : fromList.greska,
    nepoznato: fromServer.nepoznato > 0 || (fromServer.ukupno > 0 && fromServer.nepoznato === 0)
      ? fromServer.nepoznato
      : fromList.nepoznato,
  };

  return {
    status: raw.status === 'ok' ? 'ok' : 'error',
    lista,
    platforme,
    timestamp: typeof raw.timestamp === 'string' ? raw.timestamp : new Date().toISOString(),
  };
}

export function buildOverviewFromList(list: PlatformDeployStatus[]): DeployOverviewStats {
  const aktivan = list.filter((item) => item.state === 'READY').length;
  const grade = list.filter((item) => item.state === 'BUILDING' || item.state === 'QUEUED' || item.state === 'INITIALIZING').length;
  const greska = list.filter((item) => item.state === 'ERROR').length;
  const ukupno = list.length;
  const nepoznato = Math.max(0, ukupno - aktivan - grade - greska);

  return {
    ukupno,
    aktivan,
    grade,
    greska,
    nepoznato,
  };
}

export function stateToLabel(state: VercelDeployState | null): string {
  const safe = state ?? 'UNKNOWN';
  switch (safe) {
    case 'READY':
      return 'Aktivan';
    case 'BUILDING':
      return 'Gradi se';
    case 'QUEUED':
      return 'U redu';
    case 'INITIALIZING':
      return 'Inicijalizacija';
    case 'ERROR':
      return 'Greška';
    case 'CANCELED':
      return 'Otkazano';
    default:
      return 'Nepoznato';
  }
}
