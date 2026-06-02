export interface Procesuiranje3Snapshot {
  ukupanScore: number;
  queueDepth: number;
  throughputPerMin: number;
  latencyMsP95: number;
  errorRatePct: number;
  timestamp: string;
}

export const PROCESUIRANJE_3_MAX_SNAPSHOTS = 5;

let snapshots: Procesuiranje3Snapshot[] = [];

export function getProcesuiranje3Snapshots(): Procesuiranje3Snapshot[] {
  return [...snapshots];
}

export function getProcesuiranje3LastSnapshot(): Procesuiranje3Snapshot | null {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
}

export function addProcesuiranje3Snapshot(snapshot: Procesuiranje3Snapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > PROCESUIRANJE_3_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - PROCESUIRANJE_3_MAX_SNAPSHOTS);
  }
}
