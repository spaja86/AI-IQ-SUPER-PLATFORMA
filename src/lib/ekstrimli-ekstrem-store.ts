export interface EktrimliEkstremSnapshot {
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
    proksi: number;
    omegaAI: number;
  };
  timestamp: string;
}

export const EKSTRIMLI_EKSTREM_MAX_SNAPSHOTS = 3;

let snapshots: EktrimliEkstremSnapshot[] = [];

export function getEktrimliEkstremSnapshots(): EktrimliEkstremSnapshot[] {
  return [...snapshots];
}

export function getEktrimliEkstremLastSnapshot(): EktrimliEkstremSnapshot | null {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
}

export function addEktrimliEkstremSnapshot(snapshot: EktrimliEkstremSnapshot): void {
  snapshots.push(snapshot);
  if (snapshots.length > EKSTRIMLI_EKSTREM_MAX_SNAPSHOTS) {
    snapshots = snapshots.slice(snapshots.length - EKSTRIMLI_EKSTREM_MAX_SNAPSHOTS);
  }
}
