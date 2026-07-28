// SpajaUltraOmegaCore -∞Ω+∞ — VUKOBAT Store
// Kompanija SPAJA — Digitalna Industrija
//
// Ephemeral in-memory bounded snapshot istorija za VUKOBAT ritam i trend.

export interface VukobatSnapshot {
  ukupanScore: number;
  ukupnaVelocity: number;
  domenScores: {
    vizija: number;
    upravljanje: number;
    koordinacija: number;
    operativa: number;
    bezbednost: number;
    automatizacija: number;
  };
  timestamp: string;
}

export const VUKOBAT_MAX_SNAPSHOTS = 12;

let snapshots: VukobatSnapshot[] = [];

export function getVukobatSnapshots(): VukobatSnapshot[] {
  return [...snapshots];
}

export function addVukobatSnapshot(snapshot: VukobatSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > VUKOBAT_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - VUKOBAT_MAX_SNAPSHOTS);
  }
}
