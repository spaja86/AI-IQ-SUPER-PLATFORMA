/**
 * 🏹 CILJ
 *
 * Operativni modul za praćenje ciljeva, validaciju ishoda i upravljanje
 * ishodima platforme.
 * Modeluje ciklus cilja — definisanje, praćenje, merenje i validaciju.
 */

export interface CiljMetrika {
  id: string;
  naziv: string;
  napredak: number;
  uskladenost: number;
  validacija: number;
  prioritet: number;
  status: 'postignut' | 'u_toku' | 'kriticno';
}

export interface CiljRezultat {
  status: 'aktivan';
  indeksCilja: number;
  prosekNapretka: number;
  prosekUskladenosti: number;
  stabilnostCilja: number;
  efikasnostValidacije: number;
  metrike: CiljMetrika[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildCilj(userId: string): CiljRezultat {
  const metrike: Omit<CiljMetrika, 'status'>[] = [
    {
      id: 'cj-definisanje',
      naziv: 'Definisanje Cilja',
      napredak: 1.0,
      uskladenost: 0.95,
      validacija: 0.98,
      prioritet: 1.0,
    },
    {
      id: 'cj-pracenje',
      naziv: 'Praćenje Napretka',
      napredak: 0.87,
      uskladenost: 0.90,
      validacija: 0.88,
      prioritet: 0.9,
    },
    {
      id: 'cj-merenje',
      naziv: 'Merenje Ishoda',
      napredak: 0.82,
      uskladenost: 0.85,
      validacija: 0.91,
      prioritet: 0.85,
    },
    {
      id: 'cj-validacija',
      naziv: 'Validacija Rezultata',
      napredak: 0.90,
      uskladenost: 0.92,
      validacija: 0.94,
      prioritet: 1.0,
    },
  ];

  const metrikeSaStatusom: CiljMetrika[] = metrike.map((m) => {
    const status: CiljMetrika['status'] =
      m.napredak < 0.65 || m.validacija < 0.65
        ? 'kriticno'
        : m.napredak < 0.82 || m.validacija < 0.82
          ? 'u_toku'
          : 'postignut';
    return { ...m, status };
  });

  const prosekNapretka = round4(
    metrikeSaStatusom.reduce((sum, m) => sum + m.napredak, 0) / metrikeSaStatusom.length,
  );
  const prosekUskladenosti = round4(
    metrikeSaStatusom.reduce((sum, m) => sum + m.uskladenost, 0) / metrikeSaStatusom.length,
  );
  const prosekValidacije = round4(
    metrikeSaStatusom.reduce((sum, m) => sum + m.validacija, 0) / metrikeSaStatusom.length,
  );

  const stabilnostCilja = clamp01(
    round4(prosekUskladenosti * 0.45 + prosekNapretka * 0.35 + prosekValidacije * 0.2),
  );
  const efikasnostValidacije = clamp01(round4(prosekValidacije * 0.55 + prosekUskladenosti * 0.45));
  const indeksCilja = clamp01(
    round4(stabilnostCilja * 0.45 + efikasnostValidacije * 0.35 + prosekNapretka * 0.2),
  );

  return {
    status: 'aktivan',
    indeksCilja,
    prosekNapretka,
    prosekUskladenosti,
    stabilnostCilja,
    efikasnostValidacije,
    metrike: metrikeSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}
