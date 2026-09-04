/**
 * Deploy History — AI IQ SUPER PLATFORMA
 *
 * In-memory store za poslednje N deploymenta po platformi.
 * Za produkcijsko korišćenje, ove podatke treba čuvati u Supabase
 * (vidi migraciju 020_deploy_audit_log.sql).
 *
 * Ovaj modul služi kao lokalni cache i fallback kad Supabase nije dostupan.
 */

import type { DeployEnvironment } from './deploy-registry';
import type { DeployTriggerResult } from './deploy-trigger';

export interface DeployHistoryEntry {
  id: string;
  platformId: string;
  environment: DeployEnvironment;
  triggeredBy: string;
  status: 'success' | 'failure' | 'pending';
  deploymentId: string | null;
  message: string;
  triggeredAt: string;
}

const MAX_HISTORY_PER_PLATFORM = 20;

/** In-memory history store: platformId → entries[] */
const historyStore = new Map<string, DeployHistoryEntry[]>();

let entryCounter = 0;

function generateEntryId(): string {
  entryCounter++;
  return `dh-${Date.now()}-${entryCounter}`;
}

/**
 * Dodaje deploy result u history za datu platformu.
 */
export function recordDeployHistory(
  result: DeployTriggerResult,
  triggeredBy: string,
  environment: DeployEnvironment,
): DeployHistoryEntry {
  const entry: DeployHistoryEntry = {
    id: generateEntryId(),
    platformId: result.platformId,
    environment,
    triggeredBy,
    status: result.success ? 'success' : 'failure',
    deploymentId: result.deploymentId,
    message: result.message,
    triggeredAt: result.triggeredAt,
  };

  const existing = historyStore.get(result.platformId) ?? [];
  const updated = [entry, ...existing].slice(0, MAX_HISTORY_PER_PLATFORM);
  historyStore.set(result.platformId, updated);

  return entry;
}

/**
 * Vraća istoriju deploymenta za datu platformu (najnovije prvo).
 */
export function getDeployHistory(platformId: string): DeployHistoryEntry[] {
  return historyStore.get(platformId) ?? [];
}

/**
 * Vraća celokupnu istoriju svih platformi (najnovije prvo).
 */
export function getAllDeployHistory(): DeployHistoryEntry[] {
  const all: DeployHistoryEntry[] = [];
  for (const entries of historyStore.values()) {
    all.push(...entries);
  }
  return all.sort(
    (a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime(),
  );
}

/**
 * Briše istoriju za datu platformu (za testove).
 */
export function clearDeployHistory(platformId: string): void {
  historyStore.delete(platformId);
}
