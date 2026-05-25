import type { AnalizaSvega } from './analiza-svega';

export interface AnalizaTrendSnapshot {
  ukupanScore: number;
  timestamp: string;
}

const LAST_SNAPSHOT_KEY = 'analiza-svega:last-snapshot';
const HISTORY_KEY = 'analiza-svega:history';
const CACHE_KEY = 'analiza-svega:cache';

const HISTORY_LIMIT_DEFAULT = 30;
const CACHE_TTL_SECONDS_DEFAULT = 15 * 60;

let memoryLastSnapshot: AnalizaTrendSnapshot | null = null;
let memoryHistory: AnalizaTrendSnapshot[] = [];
let memoryCache: AnalizaSvega | null = null;

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
  } catch {
    return null;
  }
}

async function kvSet<T>(key: string, value: T, ttlSec?: number): Promise<void> {
  const kvUrl = process.env.VERCEL_KV_REST_API_URL;
  const kvToken = process.env.VERCEL_KV_REST_API_TOKEN;
  if (!kvUrl || !kvToken) return;

  try {
    const body = ttlSec === undefined
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
  } catch {
    // silent fallback to in-memory
  }
}

export async function getAnalizaLastSnapshot(): Promise<AnalizaTrendSnapshot | null> {
  const fromKv = await kvGet<AnalizaTrendSnapshot>(LAST_SNAPSHOT_KEY);
  if (fromKv) return fromKv;
  return memoryLastSnapshot;
}

export async function setAnalizaLastSnapshot(snapshot: AnalizaTrendSnapshot): Promise<void> {
  memoryLastSnapshot = snapshot;
  await kvSet(LAST_SNAPSHOT_KEY, snapshot);
}

export async function getAnalizaTrendHistory(limit = HISTORY_LIMIT_DEFAULT): Promise<AnalizaTrendSnapshot[]> {
  const fromKv = await kvGet<AnalizaTrendSnapshot[]>(HISTORY_KEY);
  const history = fromKv ?? memoryHistory;
  return history.slice(-limit);
}

export async function appendAnalizaTrendSnapshot(
  snapshot: AnalizaTrendSnapshot,
  limit = HISTORY_LIMIT_DEFAULT,
): Promise<AnalizaTrendSnapshot[]> {
  const current = await getAnalizaTrendHistory(limit);
  const nextHistory = [...current, snapshot].slice(-limit);
  memoryHistory = nextHistory;
  await kvSet(HISTORY_KEY, nextHistory);
  return nextHistory;
}

export async function getCachedAnalizaSvega(): Promise<AnalizaSvega | null> {
  const fromKv = await kvGet<AnalizaSvega>(CACHE_KEY);
  if (fromKv) return fromKv;
  return memoryCache;
}

export async function setCachedAnalizaSvega(
  analiza: AnalizaSvega,
  ttlSec = CACHE_TTL_SECONDS_DEFAULT,
): Promise<void> {
  memoryCache = analiza;
  await kvSet(CACHE_KEY, analiza, ttlSec);
}
