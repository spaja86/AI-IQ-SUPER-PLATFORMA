// SpajaUltraOmegaCore -∞Ω+∞ — DIVEEZIJA EKSPESLA Store
// Kompanija SPAJA — Digitalna Industrija
//
// Ephemeral in-memory bounded snapshot istorija za DIVEEZIJA EKSPESLA ritam i trend.

export interface DivezijaEkspeslaSnapshot {
  ukupanScore: number;
  ukupnaVelocity: number;
  domenScores: {
    divergencija: number;
    iteracija: number;
    vektorizacija: number;
    ekspanzija: number;
    ekspresnaLogika: number;
    automatizacija: number;
  };
  timestamp: string;
}

export const DIVEEZIJA_EKSPESLA_MAX_SNAPSHOTS = 12;

let snapshots: DivezijaEkspeslaSnapshot[] = [];

export function getDivezijaEkspeslaSnapshots(): DivezijaEkspeslaSnapshot[] {
  return [...snapshots];
}

export function addDivezijaEkspeslaSnapshot(snapshot: DivezijaEkspeslaSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > DIVEEZIJA_EKSPESLA_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - DIVEEZIJA_EKSPESLA_MAX_SNAPSHOTS);
  }
}
