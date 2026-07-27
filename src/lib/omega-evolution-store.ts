import type { OmegaEvolutionStatus, SpajaNikOpenBrand } from '@/lib/omega-evolution';
import { getOmegaEvolutionPregled } from '@/lib/omega-evolution';

export interface OmegaEvolutionSnapshot {
  evolucijskiStatus: OmegaEvolutionStatus;
  brandContent: SpajaNikOpenBrand;
  timestamp: string;
}

export const OMEGA_EVOLUTION_MAX_SNAPSHOTS = 12;

let snapshots: OmegaEvolutionSnapshot[] = [];

export function getOmegaEvolutionSnapshots(): OmegaEvolutionSnapshot[] {
  return [...snapshots];
}

export function getOmegaEvolutionLastSnapshot(): OmegaEvolutionSnapshot | null {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
}

export function addOmegaEvolutionSnapshot(snapshot: OmegaEvolutionSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > OMEGA_EVOLUTION_MAX_SNAPSHOTS) {
    snapshots.shift();
  }
}

export function fetchStatus(): OmegaEvolutionSnapshot {
  const pregled = getOmegaEvolutionPregled();
  const snapshot: OmegaEvolutionSnapshot = {
    evolucijskiStatus: pregled.status,
    brandContent: pregled.brand,
    timestamp: new Date().toISOString(),
  };
  addOmegaEvolutionSnapshot(snapshot);
  return snapshot;
}
