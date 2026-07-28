// SpajaUltraOmegaCore -∞Ω+∞ — INDUKCIJA Store
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory circular buffer za INDUKCIJA snapshots.
// Namerno ephemeralan store za single-instance refleksiju u runtime-u.

export interface IndukcijaSnapshot {
  ukupanScore: number;
  ukupnaVelocity: number;
  domenScores: {
    indukcija: number;
    koherencija: number;
    amplifikacija: number;
    rezonancija: number;
    polarizacija: number;
    konvergencija: number;
  };
  timestamp: string;
}

export const INDUKCIJA_MAX_SNAPSHOTS = 10;

// Store je ephemeralan: resetuje se na restart servera i nije deljen između
// više runtime instanci, pa istorija važi samo za trenutni proces.
let snapshots: IndukcijaSnapshot[] = [];

export function getIndukcijaSnapshots(): IndukcijaSnapshot[] {
  return [...snapshots];
}

export function getIndukcijaLastSnapshot(): IndukcijaSnapshot | null {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
}

export function addIndukcijaSnapshot(snapshot: IndukcijaSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > INDUKCIJA_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - INDUKCIJA_MAX_SNAPSHOTS);
  }
}
