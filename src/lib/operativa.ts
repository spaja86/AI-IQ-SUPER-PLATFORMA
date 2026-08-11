/**
 * ⚙️ OPERATIVA (FORCE)
 *
 * Operativni modul za izvršni motor, propusnost zadataka i operativnu
 * efikasnost platforme.
 * Modeluje operativni ciklus — inicijalizaciju, procesiranje, optimizaciju
 * i konsolidaciju.
 */

export interface OperativaZadatak {
  id: string;
  naziv: string;
  propusnost: number;
  latencija: number;
  pouzdanost: number;
  kapacitet: number;
  status: 'aktivan' | 'optimizacija' | 'degradiran';
}

export interface OperativaRezultat {
  status: 'aktivan';
  indeksOperative: number;
  prosekPropusnosti: number;
  prosekPouzdanosti: number;
  stabilnostOperative: number;
  efikasnostIzvrsavanja: number;
  zadaci: OperativaZadatak[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildOperativa(userId: string): OperativaRezultat {
  const zadaci: Omit<OperativaZadatak, 'status'>[] = [
    {
      id: 'op-inicijalizacija',
      naziv: 'Inicijalizacija Motora',
      propusnost: 0.93,
      latencija: 0.12,
      pouzdanost: 0.95,
      kapacitet: 0.88,
    },
    {
      id: 'op-procesiranje',
      naziv: 'Procesiranje Zadataka',
      propusnost: 0.87,
      latencija: 0.15,
      pouzdanost: 0.91,
      kapacitet: 0.92,
    },
    {
      id: 'op-optimizacija',
      naziv: 'Optimizacija Toka',
      propusnost: 0.90,
      latencija: 0.10,
      pouzdanost: 0.88,
      kapacitet: 0.85,
    },
    {
      id: 'op-konsolidacija',
      naziv: 'Konsolidacija Resursa',
      propusnost: 0.94,
      latencija: 0.08,
      pouzdanost: 0.96,
      kapacitet: 0.90,
    },
  ];

  const zadaciSaStatusom: OperativaZadatak[] = zadaci.map((z) => {
    const status: OperativaZadatak['status'] =
      z.pouzdanost < 0.65 || z.propusnost < 0.65
        ? 'degradiran'
        : z.pouzdanost < 0.82 || z.propusnost < 0.82
          ? 'optimizacija'
          : 'aktivan';
    return { ...z, status };
  });

  const prosekPropusnosti = round4(
    zadaciSaStatusom.reduce((sum, z) => sum + z.propusnost, 0) / zadaciSaStatusom.length,
  );
  const prosekPouzdanosti = round4(
    zadaciSaStatusom.reduce((sum, z) => sum + z.pouzdanost, 0) / zadaciSaStatusom.length,
  );
  const prosekKapaciteta = round4(
    zadaciSaStatusom.reduce((sum, z) => sum + z.kapacitet, 0) / zadaciSaStatusom.length,
  );

  const stabilnostOperative = clamp01(
    round4(prosekPouzdanosti * 0.45 + prosekPropusnosti * 0.35 + prosekKapaciteta * 0.2),
  );
  const efikasnostIzvrsavanja = clamp01(
    round4(prosekPropusnosti * 0.55 + prosekPouzdanosti * 0.45),
  );
  const indeksOperative = clamp01(
    round4(stabilnostOperative * 0.45 + efikasnostIzvrsavanja * 0.35 + prosekPropusnosti * 0.2),
  );

  return {
    status: 'aktivan',
    indeksOperative,
    prosekPropusnosti,
    prosekPouzdanosti,
    stabilnostOperative,
    efikasnostIzvrsavanja,
    zadaci: zadaciSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}
