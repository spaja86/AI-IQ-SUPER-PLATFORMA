// SpajaUltraOmegaCore -∞Ω+∞ — TARKEN HINGIL EKOLAN MAKSIMUS Store
// Kompanija SPAJA — Digitalna Industrija

import type { ThemSnapshot } from './types';

let lastSnapshot: ThemSnapshot | null = null;

export function getThemLastSnapshot(): ThemSnapshot | null {
  return lastSnapshot;
}

export function setThemLastSnapshot(snapshot: ThemSnapshot): void {
  lastSnapshot = snapshot;
}
