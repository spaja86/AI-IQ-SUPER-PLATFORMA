export type ExtrimliReadinessStatus = 'READY' | 'WATCH' | 'BLOCKED';
export type ExtrimliReadinessSignal = {
  status: ExtrimliReadinessStatus;
  audioVisualSyncStatus: ExtrimliReadinessStatus;
  spatialEffectStatus: ExtrimliReadinessStatus;
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
