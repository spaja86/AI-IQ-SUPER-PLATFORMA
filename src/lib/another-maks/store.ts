// SpajaUltraOmegaCore -∞Ω+∞ — ANOTHER MAKS Store
// Kompanija SPAJA — Digitalna Industrija

import type { AnotherMaksSnapshot } from './types';

let lastSnapshot: AnotherMaksSnapshot | null = null;

export function getAnotherMaksLastSnapshot(): AnotherMaksSnapshot | null {
  return lastSnapshot;
}

export function setAnotherMaksLastSnapshot(snapshot: AnotherMaksSnapshot): void {
  lastSnapshot = snapshot;
}
