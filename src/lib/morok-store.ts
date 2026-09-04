// SpajaUltraOmegaCore -∞Ω+∞ — MOROK Store
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory circular buffer za MOROK snapshots.

export interface MorokSnapshot {
  ukupanScore: number;
  ukupnaVelocity: number;
  domenScores: {
    mobilnaMreza: number;
    operativnaSpremnost: number;
    procesuiranje: number;
    ekstremnoProcesuiranje: number;
    orkestracija: number;
    spajaPro: number;
  };
  timestamp: string;
}

export const MOROK_MAX_SNAPSHOTS = 10;

let snapshots: MorokSnapshot[] = [];

export function getMorokSnapshots(): MorokSnapshot[] {
  return [...snapshots];
}

export function getMorokLastSnapshot(): MorokSnapshot | null {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
}

export function addMorokSnapshot(snapshot: MorokSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > MOROK_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - MOROK_MAX_SNAPSHOTS);
  }
}
