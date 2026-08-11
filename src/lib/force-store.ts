// SpajaUltraOmegaCore -∞Ω+∞ — FORCE Store
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory circular buffer za FORCE snapshots.
// Namerno ephemeralan store za single-instance automation refleksiju u runtime-u.

export interface ForceSnapshot {
  ukupanScore: number;
  ukupnaVelocity: number;
  domenScores: {
    fokus: number;
    operativa: number;
    reakcija: number;
    cilj: number;
    energija: number;
    snaga: number;
  };
  timestamp: string;
}

export const FORCE_MAX_SNAPSHOTS = 100;

// Store je ephemeralan: resetuje se na restart servera i nije deljen između
// više serverless/runtime instanci, pa istorija važi samo za trenutni proces.
// TODO: Ako FORCE istorija treba da bude pouzdana u produkciji, prebaciti
// snapshots u deljeni persistentni storage (npr. baza ili cache).
let snapshots: ForceSnapshot[] = [];

export function getForceSnapshots(): ForceSnapshot[] {
  return [...snapshots];
}

export function getForceLastSnapshot(): ForceSnapshot | null {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
}

export function addForceSnapshot(snapshot: ForceSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > FORCE_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - FORCE_MAX_SNAPSHOTS);
  }
}
