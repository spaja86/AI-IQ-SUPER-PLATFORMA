export type ExtrimliReadinessStatus = 'READY' | 'WATCH' | 'BLOCKED';

export function aggregateReadinessStatus(statuses: readonly ExtrimliReadinessStatus[]): ExtrimliReadinessStatus {
  if (statuses.includes('BLOCKED')) return 'BLOCKED';
  if (statuses.includes('WATCH')) return 'WATCH';
  return 'READY';
}
