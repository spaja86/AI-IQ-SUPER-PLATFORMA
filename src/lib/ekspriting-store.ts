// SpajaUltraOmegaCore -∞Ω+∞ — EKSPRITING Store
// Kompanija SPAJA — Digitalna Industrija
//
// Ephemeral in-memory bounded snapshot istorija za EKSPRITING ritam i trend.

export interface EkspritingSnapshot {
  ukupanScore: number;
  ukupnaVelocity: number;
  domenScores: {
    ekspresaSinteza: number;
    skriptingLogika: number;
    pisanjeToka: number;
    iterativnoUredjivanje: number;
    tokenizacijaSadrzaja: number;
  };
  timestamp: string;
}

export const EKSPRITING_MAX_SNAPSHOTS = 12;

let snapshots: EkspritingSnapshot[] = [];

export function getEkspritingSnapshots(): EkspritingSnapshot[] {
  return [...snapshots];
}

export function addEkspritingSnapshot(snapshot: EkspritingSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > EKSPRITING_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - EKSPRITING_MAX_SNAPSHOTS);
  }
}
