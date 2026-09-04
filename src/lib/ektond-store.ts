// SpajaUltraOmegaCore -∞Ω+∞ — EKTOND Store
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory circular buffer za EKTOND snapshots.

export interface EktondSnapshot {
  ukupanScore: number;
  ukupnaVelocity: number;
  domenScores: {
    analiza: number;
    potencijal: number;
    worldBank: number;
    callCentar: number;
    proksi: number;
    gejming: number;
  };
  timestamp: string;
}

export const EKTOND_MAX_SNAPSHOTS = 10;

let snapshots: EktondSnapshot[] = [];

export function getEktondSnapshots(): EktondSnapshot[] {
  return [...snapshots];
}

export function getEktondLastSnapshot(): EktondSnapshot | null {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
}

export function addEktondSnapshot(snapshot: EktondSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > EKTOND_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - EKTOND_MAX_SNAPSHOTS);
  }
}
