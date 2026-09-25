export type ExtrimliReadinessStatus = 'READY' | 'WATCH' | 'BLOCKED';
export type ExtrimliReadinessSignal = {
  status: ExtrimliReadinessStatus;
  audioVisualSyncStatus: ExtrimliReadinessStatus;
  spatialEffectStatus: ExtrimliReadinessStatus;
};

export const EXTRIMLI_READINESS_STATUS_SCORES: Record<ExtrimliReadinessStatus, number> = {
  READY: 100,
  WATCH: 70,
  BLOCKED: 40,
};

export function aggregateReadinessStatus(statuses: readonly ExtrimliReadinessStatus[]): ExtrimliReadinessStatus {
  if (statuses.length === 0) {
    throw new Error('aggregateReadinessStatus requires at least one readiness status');
  }
  if (statuses.includes('BLOCKED')) return 'BLOCKED';
  if (statuses.includes('WATCH')) return 'WATCH';
  return 'READY';
}

export function aggregateSignalReadinessStatus(signal: ExtrimliReadinessSignal): ExtrimliReadinessStatus {
  return aggregateReadinessStatus([signal.status, signal.audioVisualSyncStatus, signal.spatialEffectStatus]);
}

export function readinessStatusScore(status: ExtrimliReadinessStatus): number {
  return EXTRIMLI_READINESS_STATUS_SCORES[status];
}
