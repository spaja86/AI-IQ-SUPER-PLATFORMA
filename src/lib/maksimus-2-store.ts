export interface Maksimus2Snapshot {
  ukupanScore: number;
  domenScores: {
    analiza: number;
    potencijal: number;
    procesuiranje: number;
    orkestracija: number;
    ekstremnoProcesuiranje: number;
    operativnaSpremnost: number;
  };
  timestamp: string;
}

let lastSnapshot: Maksimus2Snapshot | null = null;

export function getMaksimus2LastSnapshot(): Maksimus2Snapshot | null {
  return lastSnapshot;
}

export function setMaksimus2LastSnapshot(snapshot: Maksimus2Snapshot): void {
  lastSnapshot = snapshot;
}
