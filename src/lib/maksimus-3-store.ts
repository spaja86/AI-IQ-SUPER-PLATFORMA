export interface Maksimus3Snapshot {
  ukupanScore: number;
  domenScores: {
    analiza: number;
    potencijal: number;
    procesuiranje: number;
    orkestracija: number;
    ekstremnoProcesuiranje: number;
    operativnaSpremnost: number;
    spajaPro: number;
    gejmingIndustrija: number;
  };
  timestamp: string;
}

export const MAKSIMUS_3_MAX_SNAPSHOTS = 3;

let snapshots: Maksimus3Snapshot[] = [];

export function getMaksimus3Snapshots(): Maksimus3Snapshot[] {
  return [...snapshots];
}

export function getMaksimus3LastSnapshot(): Maksimus3Snapshot | null {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
}

export function addMaksimus3Snapshot(snapshot: Maksimus3Snapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > MAKSIMUS_3_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - MAKSIMUS_3_MAX_SNAPSHOTS);
  }
}
