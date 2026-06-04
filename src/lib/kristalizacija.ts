/**
 * 💎 KRISTALIZACIJA
 *
 * Operativni modul za kristalizaciju procesnih tokova, stabilizaciju
 * jezgra sistema i konsolidaciju izlaznih signala.
 * Modeluje ciklus kristalizacije — nukleaciju, rast, stabilizaciju i
 * završnu purifikaciju.
 */

export interface KristalizacijaJezgro {
  id: string;
  naziv: string;
  temperatura: number;
  pritisak: number;
  cistoca: number;
  kohezija: number;
  status: 'stabilno' | 'optimizacija' | 'nestabilno';
}

export interface KristalizacijaRezultat {
  status: 'aktivan';
  indeksKristalizacije: number;
  prosekCistoce: number;
  prosekKohezije: number;
  stabilnostJezgra: number;
  efikasnostProcesa: number;
  jezgra: KristalizacijaJezgro[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildKristalizacija(userId: string): KristalizacijaRezultat {
  const jezgra: Omit<KristalizacijaJezgro, 'status'>[] = [
    {
      id: 'kr-nukleacija',
      naziv: 'Nukleacija Jezgro',
      temperatura: 412,
      pritisak: 1.8,
      cistoca: 0.91,
      kohezija: 0.88,
    },
    {
      id: 'kr-rast',
      naziv: 'Rast Kristala',
      temperatura: 436,
      pritisak: 2.1,
      cistoca: 0.86,
      kohezija: 0.91,
    },
    {
      id: 'kr-stabilizacija',
      naziv: 'Stabilizacija Jezgra',
      temperatura: 398,
      pritisak: 1.7,
      cistoca: 0.94,
      kohezija: 0.9,
    },
    {
      id: 'kr-purifikacija',
      naziv: 'Purifikacija Izlaza',
      temperatura: 384,
      pritisak: 1.5,
      cistoca: 0.97,
      kohezija: 0.84,
    },
  ];

  const jezgraSaStatusom: KristalizacijaJezgro[] = jezgra.map((jezgro) => {
    const status: KristalizacijaJezgro['status'] =
      jezgro.cistoca < 0.65 || jezgro.kohezija < 0.65
        ? 'nestabilno'
        : jezgro.cistoca < 0.82 || jezgro.kohezija < 0.82
          ? 'optimizacija'
          : 'stabilno';

    return { ...jezgro, status };
  });

  const prosekCistoce = round4(
    jezgraSaStatusom.reduce((sum, jezgro) => sum + jezgro.cistoca, 0) / jezgraSaStatusom.length,
  );
  const prosekKohezije = round4(
    jezgraSaStatusom.reduce((sum, jezgro) => sum + jezgro.kohezija, 0) / jezgraSaStatusom.length,
  );
  const temperaturniScore = clamp01(
    round4(
      jezgraSaStatusom.reduce((sum, jezgro) => sum + jezgro.temperatura, 0) /
        jezgraSaStatusom.length /
        500,
    ),
  );

  const stabilnostJezgra = clamp01(
    round4(prosekKohezije * 0.5 + prosekCistoce * 0.35 + temperaturniScore * 0.15),
  );
  const efikasnostProcesa = clamp01(round4(prosekCistoce * 0.55 + prosekKohezije * 0.45));
  const indeksKristalizacije = clamp01(
    round4(stabilnostJezgra * 0.45 + efikasnostProcesa * 0.35 + prosekCistoce * 0.2),
  );

  return {
    status: 'aktivan',
    indeksKristalizacije,
    prosekCistoce,
    prosekKohezije,
    stabilnostJezgra,
    efikasnostProcesa,
    jezgra: jezgraSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}
