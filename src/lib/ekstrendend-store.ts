// SpajaUltraOmegaCore -∞Ω+∞ — EKSTRENDEND Store
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory circular buffer za EKSTRENDEND snapshots.

export interface EkstrendendSnapshot {
  ukupanScore: number;
  ukupnaVelocity: number;
  domenScores: {
    analiza: number;
    potencijal: number;
    procesuiranje: number;
    orkestracija: number;
    ekstremnoProcesuiranje: number;
    operativnaSpremnost: number;
    spajaPro: number;
    gejmingIndustrija: number;
  };
  timestamp: string;
}

export const EKSTRENDEND_MAX_SNAPSHOTS = 10;

let snapshots: EkstrendendSnapshot[] = [];

export function getEkstrendendSnapshots(): EkstrendendSnapshot[] {
  return [...snapshots];
}

export function getEkstrendendLastSnapshot(): EkstrendendSnapshot | null {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
}

export function addEkstrendendSnapshot(snapshot: EkstrendendSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > EKSTRENDEND_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - EKSTRENDEND_MAX_SNAPSHOTS);
  }
}
