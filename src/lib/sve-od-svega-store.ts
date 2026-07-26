// SpajaUltraOmegaCore — SVE OD SVEGA STORE
// Kompanija SPAJA — Digitalna Industrija
//
// KV store + in-memory fallback za SVE OD SVEGA snapshots i historijat.
// Arhitektura je identicna analiza-svega-store.ts.

import type { SveOdSvega, SveOcena } from './sve-od-svega';

const LAST_SNAPSHOT_KEY = 'sve-od-svega:last-snapshot';
const HISTORY_KEY = 'sve-od-svega:history';
const CACHE_KEY = 'sve-od-svega:cache';

const HISTORY_LIMIT_DEFAULT = 24;
const CACHE_TTL_SECONDS_DEFAULT = 15 * 60;

export interface SveOdSvegaHistoryEntry {
  timestamp: string;
  ukupanScore: number;
  konacnaOcena: SveOcena;
  kriticniDomeniCount: number;
  degraded: boolean;
}

let memoryLastSnapshot: SveOdSvegaHistoryEntry | null = null;
let memoryHistory: SveOdSvegaHistoryEntry[] = [];
let memoryCache: SveOdSvega | null = null;

// --- KV helpers ---------------------------------------------------------------

async function kvGet<T>(key: string): Promise<T | null> {
  const kvUrl = process.env.VERCEL_KV_REST_API_URL;
  const kvToken = process.env.VERCEL_KV_REST_API_TOKEN;
  if (!kvUrl || !kvToken) return null;

  try {
    const resp = await fetch(`${kvUrl}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${kvToken}` },
    });
    if (!resp.ok) return null;
    const { result } = (await resp.json()) as { result: string | null };
    if (!result) return null;
    return JSON.parse(result) as T;
  } catch (error) {
    console.warn('[sve-od-svega-store] kvGet fallback to memory', { key, error });
    return null;
  }
}

async function kvSet<T>(key: string, value: T, ttlSec?: number): Promise<void> {
  const kvUrl = process.env.VERCEL_KV_REST_API_URL;
  const kvToken = process.env.VERCEL_KV_REST_API_TOKEN;
  if (!kvUrl || !kvToken) return;

  try {
    const body =
      ttlSec === undefined
        ? { value: JSON.stringify(value) }
        : { value: JSON.stringify(value), ex: ttlSec };
    await fetch(`${kvUrl}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.warn('[sve-od-svega-store] kvSet fallback to memory', { key, error });
  }
}

// --- Public API ---------------------------------------------------------------

/** Vraca poslednji sacuvani snapshot (history entry). */
export async function getSveOdSvegaLastSnapshot(): Promise<SveOdSvegaHistoryEntry | null> {
  const fromKv = await kvGet<SveOdSvegaHistoryEntry>(LAST_SNAPSHOT_KEY);
  if (fromKv) return fromKv;
  return memoryLastSnapshot;
}

/** Vraca historijat poslednjih N snapshots. */
export async function getSveOdSvegaHistory(
  limit = HISTORY_LIMIT_DEFAULT,
): Promise<SveOdSvegaHistoryEntry[]> {
  const fromKv = await kvGet<SveOdSvegaHistoryEntry[]>(HISTORY_KEY);
  const history = fromKv ?? memoryHistory;
  return history.slice(-limit);
}

/**
 * Dodaje novi snapshot u historijat i azurira last-snapshot.
 * Cita pun rezultat buildSveOdSvega(), kompresuje u entry i cuva.
 */
export async function appendSveOdSvegaSnapshot(
  rezultat: SveOdSvega,
  limit = HISTORY_LIMIT_DEFAULT,
): Promise<SveOdSvegaHistoryEntry[]> {
  const entry: SveOdSvegaHistoryEntry = {
    timestamp: rezultat.timestamp,
    ukupanScore: rezultat.ukupanScore,
    konacnaOcena: rezultat.konacnaOcena,
    kriticniDomeniCount: rezultat.kriticniDomeni.length,
    degraded: rezultat.meta.degraded,
  };

  memoryLastSnapshot = entry;
  await kvSet(LAST_SNAPSHOT_KEY, entry);

  const current = await getSveOdSvegaHistory(limit);
  const nextHistory = [...current, entry].slice(-limit);
  memoryHistory = nextHistory;
  await kvSet(HISTORY_KEY, nextHistory);

  return nextHistory;
}

/** Vraca kesirani pun SveOdSvega rezultat (moze biti null ako jos nije kesiran). */
export async function getCachedSveOdSvega(): Promise<SveOdSvega | null> {
  const fromKv = await kvGet<SveOdSvega>(CACHE_KEY);
  if (fromKv) return fromKv;
  return memoryCache;
}

/** Kesira pun SveOdSvega rezultat sa TTL-om. */
export async function setCachedSveOdSvega(
  rezultat: SveOdSvega,
  ttlSec = CACHE_TTL_SECONDS_DEFAULT,
): Promise<void> {
  memoryCache = rezultat;
  await kvSet(CACHE_KEY, rezultat, ttlSec);
}
