// SpajaUltraOmegaCore -∞Ω+∞ — AUTO Store
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory circular buffer za AUTO snapshots.
// Namerno ephemeralan store za single-instance autonomnu refleksiju u runtime-u.

export interface AutoSnapshot {
  ukupanScore: number;
  ukupnaVelocity: number;
  domenScores: {
    autonomija: number;
    upravljanje: number;
    transformacija: number;
    orkestracija: number;
    optimizacija: number;
    automatizacija: number;
  };
  timestamp: string;
}

export const AUTO_MAX_SNAPSHOTS = 10;

// Store je ephemeralan: resetuje se na restart servera i nije deljen između
// više runtime instanci, pa istorija važi samo za trenutni proces.
let snapshots: AutoSnapshot[] = [];

export function getAutoSnapshots(): AutoSnapshot[] {
  return [...snapshots];
}

export function getAutoLastSnapshot(): AutoSnapshot | null {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
}

export function addAutoSnapshot(snapshot: AutoSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > AUTO_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - AUTO_MAX_SNAPSHOTS);
  }
}
