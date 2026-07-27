// SpajaUltraOmegaCore -∞Ω+∞ — SILJA Store
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory circular buffer za SILJA snapshots.
// Namerno ephemeralan store za single-instance automation refleksiju u runtime-u.

export interface SiljaSnapshot {
  ukupanScore: number;
  ukupnaVelocity: number;
  domenScores: {
    kristalizacija: number;
    harmonizacija: number;
    modulacija: number;
    perkolizonik: number;
    rezonancija: number;
    sintetizacija: number;
  };
  timestamp: string;
}

export const SILJA_MAX_SNAPSHOTS = 10;

// Store je ephemeralan: resetuje se na restart servera i nije deljen između
// više serverless/runtime instanci, pa istorija važi samo za trenutni proces.
let snapshots: SiljaSnapshot[] = [];

export function getSiljaSnapshots(): SiljaSnapshot[] {
  return [...snapshots];
}

export function getSiljaLastSnapshot(): SiljaSnapshot | null {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
}

export function addSiljaSnapshot(snapshot: SiljaSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > SILJA_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - SILJA_MAX_SNAPSHOTS);
  }
}
