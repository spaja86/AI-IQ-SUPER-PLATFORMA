export type ExtrimliReadinessStatus = 'READY' | 'WATCH' | 'BLOCKED';

export function aggregateReadinessStatus(statuses: readonly ExtrimliReadinessStatus[]): ExtrimliReadinessStatus {
  if (statuses.length === 0) {
    throw new Error('aggregateReadinessStatus requires at least one readiness status');
  }
  if (statuses.includes('BLOCKED')) return 'BLOCKED';
  if (statuses.includes('WATCH')) return 'WATCH';
  return 'READY';
}
