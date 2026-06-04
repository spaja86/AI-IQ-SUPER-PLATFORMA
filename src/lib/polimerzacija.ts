/**
 * 🧬 POLIMERZACIJA
 *
 * Operativni modul za lančano vezivanje i koheziju procesnih jedinica.
 * Modeluje procese polimerizacije — inicijaciju, propagaciju, terminaciju i kroslink.
 */

export interface PolimerzacijaLanac {
  id: string;
  naziv: string;
  reakcionaStopa: number;
  iskoriscenost: number;
  stepen: number;
  temperaturaProcesa: number;
  status: 'aktivan' | 'optimizacija' | 'kritican';
}

export interface PolimerzacijaRezultat {
  status: 'aktivan';
  ukupnaStopa: number;
  prosekStepena: number;
  prosekIskoriscenosti: number;
  indeksKohezije: number;
  stabilnost: number;
  lanci: PolimerzacijaLanac[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildPolimerzacija(userId: string): PolimerzacijaRezultat {
  const lanci: Omit<PolimerzacijaLanac, 'status'>[] = [
    {
      id: 'pz-inicijacija',
      naziv: 'Inicijacija Lanac',
      reakcionaStopa: 0.82,
      iskoriscenost: 0.78,
      stepen: 3.2,
      temperaturaProcesa: 210,
    },
    {
      id: 'pz-propagacija',
      naziv: 'Propagacija Lanac',
      reakcionaStopa: 0.76,
      iskoriscenost: 0.85,
      stepen: 4.1,
      temperaturaProcesa: 195,
    },
    {
      id: 'pz-terminacija',
      naziv: 'Terminacija Lanac',
      reakcionaStopa: 0.91,
      iskoriscenost: 0.72,
      stepen: 2.8,
      temperaturaProcesa: 180,
    },
    {
      id: 'pz-kroslink',
      naziv: 'Kroslink Lanac',
      reakcionaStopa: 0.68,
      iskoriscenost: 0.81,
      stepen: 3.6,
      temperaturaProcesa: 225,
    },
  ];

  const lanciSaStatusom: PolimerzacijaLanac[] = lanci.map((lanac) => {
    const status: PolimerzacijaLanac['status'] =
      lanac.stepen < 2 || lanac.reakcionaStopa < 0.5
        ? 'kritican'
        : lanac.iskoriscenost < 0.75
          ? 'optimizacija'
          : 'aktivan';
    return { ...lanac, status };
  });

  const ukupnaStopa = round4(
    lanciSaStatusom.reduce((sum, l) => sum + l.reakcionaStopa, 0) / lanciSaStatusom.length,
  );
  const prosekStepena = round4(
    lanciSaStatusom.reduce((sum, l) => sum + l.stepen, 0) / lanciSaStatusom.length,
  );
  const prosekIskoriscenosti = round4(
    lanciSaStatusom.reduce((sum, l) => sum + l.iskoriscenost, 0) / lanciSaStatusom.length,
  );

  const stopaPenalizacija = clamp01(round4(1 - ukupnaStopa));
  const stepenScore = clamp01(round4(prosekStepena / 10));
  const stabilnost = clamp01(round4(1 - stopaPenalizacija * 0.5 - (1 - prosekIskoriscenosti) * 0.3));
  const indeksKohezije = clamp01(
    round4(stabilnost * 0.45 + prosekIskoriscenosti * 0.35 + stepenScore * 0.2),
  );

  return {
    status: 'aktivan',
    ukupnaStopa,
    prosekStepena,
    prosekIskoriscenosti,
    indeksKohezije,
    stabilnost,
    lanci: lanciSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}
