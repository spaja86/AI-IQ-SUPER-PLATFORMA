/**
 * 🔋 ENERGIJA (FORCE)
 *
 * Operativni modul za mobilizaciju resursa, kapacitet sistema i upravljanje
 * energetskim tokovima platforme.
 * Modeluje energetski ciklus — punjenje, distribuciju, optimizaciju i obnovu.
 */

export interface EnergijaIzvor {
  id: string;
  naziv: string;
  kapacitet: number;
  efikasnost: number;
  stabilnost: number;
  dostupnost: number;
  status: 'pun' | 'optimizacija' | 'kriticno';
}

export interface EnergijaRezultat {
  status: 'aktivan';
  indeksEnergije: number;
  prosekKapaciteta: number;
  prosekEfikasnosti: number;
  stabilnostEnergije: number;
  efikasnostDistribucije: number;
  izvori: EnergijaIzvor[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildEnergijaForce(userId: string): EnergijaRezultat {
  const izvori: Omit<EnergijaIzvor, 'status'>[] = [
    {
      id: 'en-punjenje',
      naziv: 'Punjenje Kapaciteta',
      kapacitet: 0.95,
      efikasnost: 0.92,
      stabilnost: 0.90,
      dostupnost: 0.98,
    },
    {
      id: 'en-distribucija',
      naziv: 'Distribucija Energije',
      kapacitet: 0.88,
      efikasnost: 0.90,
      stabilnost: 0.87,
      dostupnost: 0.95,
    },
    {
      id: 'en-optimizacija',
      naziv: 'Optimizacija Potrošnje',
      kapacitet: 0.84,
      efikasnost: 0.94,
      stabilnost: 0.91,
      dostupnost: 0.92,
    },
    {
      id: 'en-obnova',
      naziv: 'Obnova Resursa',
      kapacitet: 0.91,
      efikasnost: 0.89,
      stabilnost: 0.93,
      dostupnost: 0.97,
    },
  ];

  const izvoriSaStatusom: EnergijaIzvor[] = izvori.map((izvor) => {
    const status: EnergijaIzvor['status'] =
      izvor.kapacitet < 0.65 || izvor.efikasnost < 0.65
        ? 'kriticno'
        : izvor.kapacitet < 0.82 || izvor.efikasnost < 0.82
          ? 'optimizacija'
          : 'pun';
    return { ...izvor, status };
  });

  const prosekKapaciteta = round4(
    izvoriSaStatusom.reduce((sum, i) => sum + i.kapacitet, 0) / izvoriSaStatusom.length,
  );
  const prosekEfikasnosti = round4(
    izvoriSaStatusom.reduce((sum, i) => sum + i.efikasnost, 0) / izvoriSaStatusom.length,
  );
  const prosekStabilnosti = round4(
    izvoriSaStatusom.reduce((sum, i) => sum + i.stabilnost, 0) / izvoriSaStatusom.length,
  );

  const stabilnostEnergije = clamp01(
    round4(prosekStabilnosti * 0.45 + prosekEfikasnosti * 0.35 + prosekKapaciteta * 0.2),
  );
  const efikasnostDistribucije = clamp01(
    round4(prosekEfikasnosti * 0.55 + prosekStabilnosti * 0.45),
  );
  const indeksEnergije = clamp01(
    round4(stabilnostEnergije * 0.45 + efikasnostDistribucije * 0.35 + prosekKapaciteta * 0.2),
  );

  return {
    status: 'aktivan',
    indeksEnergije,
    prosekKapaciteta,
    prosekEfikasnosti,
    stabilnostEnergije,
    efikasnostDistribucije,
    izvori: izvoriSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}
