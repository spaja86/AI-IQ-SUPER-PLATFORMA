// SpajaUltraOmegaCore -∞Ω+∞ — MAKSIMUS Store
// Kompanija SPAJA — Digitalna Industrija

import type { MaksimусSnapshot } from './types';

let lastSnapshot: MaksimусSnapshot | null = null;

export function getMaksimусLastSnapshot(): MaksimусSnapshot | null {
  return lastSnapshot;
}

export function setMaksimусLastSnapshot(snapshot: MaksimусSnapshot): void {
  lastSnapshot = snapshot;
}
