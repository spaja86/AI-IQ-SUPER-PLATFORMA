// SpajaUltraOmegaCore -∞Ω+∞ — EKSPRES Store
// Kompanija SPAJA — Digitalna Industrija
//
// Ephemeral in-memory bounded snapshot istorija za EKSPRES ritam i trend.

export interface EkspresSnapshot {
  ukupanScore: number;
  ukupnaVelocity: number;
  domenScores: {
    brzina: number;
    pouzdanost: number;
    automatizacija: number;
    kvalitetIzlaza: number;
  };
  timestamp: string;
}

export const EKSPRES_MAX_SNAPSHOTS = 12;

let snapshots: EkspresSnapshot[] = [];

export function getEkspresSnapshots(): EkspresSnapshot[] {
  return [...snapshots];
}

export function addEkspresSnapshot(snapshot: EkspresSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > EKSPRES_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - EKSPRES_MAX_SNAPSHOTS);
  }
}

export function _resetEkspresSnapshots(): void {
  snapshots = [];
}
