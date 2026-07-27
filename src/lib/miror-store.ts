// SpajaUltraOmegaCore -∞Ω+∞ — MIROR Store
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory circular buffer za MIROR snapshots.

export interface MirorSnapshot {
  ukupanScore: number;
  ukupnaVelocity: number;
  domenScores: {
    rezonancija: number;
    sintetizacija: number;
    distribucija: number;
    barKod: number;
    observatorija: number;
    vektorizacija: number;
  };
  timestamp: string;
}

export const MIROR_MAX_SNAPSHOTS = 10;

let snapshots: MirorSnapshot[] = [];

export function getMirorSnapshots(): MirorSnapshot[] {
  return [...snapshots];
}

export function getMirorLastSnapshot(): MirorSnapshot | null {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
}

export function addMirorSnapshot(snapshot: MirorSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > MIROR_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - MIROR_MAX_SNAPSHOTS);
  }
}
