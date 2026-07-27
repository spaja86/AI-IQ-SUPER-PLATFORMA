// SpajaUltraOmegaCore -∞Ω+∞ — SNUPI Store
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory circular buffer za SNUPI snapshots.
// Namerno ephemeralan store za single-instance unifikacionu refleksiju u runtime-u.

export interface SnupiSnapshot {
  ukupanScore: number;
  ukupnaVelocity: number;
  domenScores: {
    sinhronizacija: number;
    normalizacija: number;
    unifikacija: number;
    procesuiranje: number;
    integracija: number;
    inovacija: number;
  };
  timestamp: string;
}

export const SNUPI_MAX_SNAPSHOTS = 10;

// Store je ephemeralan: resetuje se na restart servera i nije deljen između
// više runtime instanci, pa istorija važi samo za trenutni proces.
let snapshots: SnupiSnapshot[] = [];

export function getSnupiSnapshots(): SnupiSnapshot[] {
  return [...snapshots];
}

export function getSnupiLastSnapshot(): SnupiSnapshot | null {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
}

export function addSnupiSnapshot(snapshot: SnupiSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > SNUPI_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - SNUPI_MAX_SNAPSHOTS);
  }
}
