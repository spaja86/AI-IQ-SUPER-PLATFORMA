/**
 * 🎯 FOKUS
 *
 * Operativni modul za precizno ciljanje, poravnanje ciljeva i fokusiranu
 * energiju izvršavanja.
 * Modeluje ciklus fokusa — identifikaciju, sužavanje, poravnanje i zaključavanje.
 */

export interface FokusCilj {
  id: string;
  naziv: string;
  preciznost: number;
  poravnanje: number;
  konvergencija: number;
  prioritet: number;
  status: 'zakljucan' | 'optimizacija' | 'rasprseno';
}

export interface FokusRezultat {
  status: 'aktivan';
  indeksFokusa: number;
  prosekPreciznosti: number;
  prosekPoravnanja: number;
  stabilnostFokusa: number;
  efikasnostCiljanja: number;
  ciljevi: FokusCilj[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildFokus(userId: string): FokusRezultat {
  const ciljevi: Omit<FokusCilj, 'status'>[] = [
    {
      id: 'fk-identifikacija',
      naziv: 'Identifikacija Cilja',
      preciznost: 0.94,
      poravnanje: 0.91,
      konvergencija: 0.88,
      prioritet: 1.0,
    },
    {
      id: 'fk-suzavanje',
      naziv: 'Sužavanje Fokusa',
      preciznost: 0.89,
      poravnanje: 0.87,
      konvergencija: 0.92,
      prioritet: 0.9,
    },
    {
      id: 'fk-poravnanje',
      naziv: 'Poravnanje Energije',
      preciznost: 0.91,
      poravnanje: 0.93,
      konvergencija: 0.85,
      prioritet: 0.85,
    },
    {
      id: 'fk-zakljucavanje',
      naziv: 'Zaključavanje Cilja',
      preciznost: 0.96,
      poravnanje: 0.95,
      konvergencija: 0.94,
      prioritet: 1.0,
    },
  ];

  const ciljeviSaStatusom: FokusCilj[] = ciljevi.map((cilj) => {
    const status: FokusCilj['status'] =
      cilj.preciznost < 0.65 || cilj.poravnanje < 0.65
        ? 'rasprseno'
        : cilj.preciznost < 0.82 || cilj.poravnanje < 0.82
          ? 'optimizacija'
          : 'zakljucan';
    return { ...cilj, status };
  });

  const prosekPreciznosti = round4(
    ciljeviSaStatusom.reduce((sum, c) => sum + c.preciznost, 0) / ciljeviSaStatusom.length,
  );
  const prosekPoravnanja = round4(
    ciljeviSaStatusom.reduce((sum, c) => sum + c.poravnanje, 0) / ciljeviSaStatusom.length,
  );
  const prosekKonvergencije = round4(
    ciljeviSaStatusom.reduce((sum, c) => sum + c.konvergencija, 0) / ciljeviSaStatusom.length,
  );

  const stabilnostFokusa = clamp01(
    round4(prosekPoravnanja * 0.45 + prosekPreciznosti * 0.35 + prosekKonvergencije * 0.2),
  );
  const efikasnostCiljanja = clamp01(round4(prosekPreciznosti * 0.55 + prosekPoravnanja * 0.45));
  const indeksFokusa = clamp01(
    round4(stabilnostFokusa * 0.45 + efikasnostCiljanja * 0.35 + prosekPreciznosti * 0.2),
  );

  return {
    status: 'aktivan',
    indeksFokusa,
    prosekPreciznosti,
    prosekPoravnanja,
    stabilnostFokusa,
    efikasnostCiljanja,
    ciljevi: ciljeviSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}
