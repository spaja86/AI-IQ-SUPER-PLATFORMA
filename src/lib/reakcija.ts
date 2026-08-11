/**
 * ⚡ REAKCIJA
 *
 * Operativni modul za brzinu odziva, adaptivno rukovanje i reaktivnu
 * inteligenciju platforme.
 * Modeluje ciklus reakcije — detekciju, procenu, odgovor i adaptaciju.
 */

export interface ReakcijaSignal {
  id: string;
  naziv: string;
  brzina: number;
  tacnost: number;
  adaptacija: number;
  otpornost: number;
  status: 'brzo' | 'kalibracija' | 'sporo';
}

export interface ReakcijaRezultat {
  status: 'aktivan';
  indeksReakcije: number;
  prosekBrzine: number;
  prosekTacnosti: number;
  stabilnostReakcije: number;
  efikasnostOdziva: number;
  signali: ReakcijaSignal[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildReakcija(userId: string): ReakcijaRezultat {
  const signali: Omit<ReakcijaSignal, 'status'>[] = [
    {
      id: 'rk-detekcija',
      naziv: 'Detekcija Događaja',
      brzina: 0.96,
      tacnost: 0.93,
      adaptacija: 0.88,
      otpornost: 0.91,
    },
    {
      id: 'rk-procena',
      naziv: 'Procena Konteksta',
      brzina: 0.89,
      tacnost: 0.94,
      adaptacija: 0.90,
      otpornost: 0.87,
    },
    {
      id: 'rk-odgovor',
      naziv: 'Generisanje Odgovora',
      brzina: 0.92,
      tacnost: 0.91,
      adaptacija: 0.86,
      otpornost: 0.93,
    },
    {
      id: 'rk-adaptacija',
      naziv: 'Adaptivno Učenje',
      brzina: 0.85,
      tacnost: 0.88,
      adaptacija: 0.95,
      otpornost: 0.89,
    },
  ];

  const signaliSaStatusom: ReakcijaSignal[] = signali.map((s) => {
    const status: ReakcijaSignal['status'] =
      s.brzina < 0.65 || s.tacnost < 0.65
        ? 'sporo'
        : s.brzina < 0.82 || s.tacnost < 0.82
          ? 'kalibracija'
          : 'brzo';
    return { ...s, status };
  });

  const prosekBrzine = round4(
    signaliSaStatusom.reduce((sum, s) => sum + s.brzina, 0) / signaliSaStatusom.length,
  );
  const prosekTacnosti = round4(
    signaliSaStatusom.reduce((sum, s) => sum + s.tacnost, 0) / signaliSaStatusom.length,
  );
  const prosekAdaptacije = round4(
    signaliSaStatusom.reduce((sum, s) => sum + s.adaptacija, 0) / signaliSaStatusom.length,
  );

  const stabilnostReakcije = clamp01(
    round4(prosekTacnosti * 0.45 + prosekBrzine * 0.35 + prosekAdaptacije * 0.2),
  );
  const efikasnostOdziva = clamp01(round4(prosekBrzine * 0.55 + prosekTacnosti * 0.45));
  const indeksReakcije = clamp01(
    round4(stabilnostReakcije * 0.45 + efikasnostOdziva * 0.35 + prosekBrzine * 0.2),
  );

  return {
    status: 'aktivan',
    indeksReakcije,
    prosekBrzine,
    prosekTacnosti,
    stabilnostReakcije,
    efikasnostOdziva,
    signali: signaliSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}
