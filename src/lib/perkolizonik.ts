/**
 * ⚙️ PERKOLIZONIK
 *
 * Operativni modul za stabilizaciju i propusnost procesnih tokova.
 * Vraća kanonski rezultat za prikaz u sekvencama i API odgovorima.
 */

export interface PerkolizonikTok {
  id: string;
  naziv: string;
  kapacitetPoSatu: number;
  iskoriscenost: number;
  latencijaMs: number;
  greskePo1000: number;
  status: 'stabilan' | 'optimizacija' | 'kritican';
}

export interface PerkolizonikRezultat {
  status: 'aktivan';
  operativniIndeks: number;
  stabilnost: number;
  prosekIskoriscenosti: number;
  prosekLatencijeMs: number;
  ukupniKapacitetPoSatu: number;
  procenjeniOutputPoSatu: number;
  tokovi: PerkolizonikTok[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildPerkolizonik(userId: string): PerkolizonikRezultat {
  const tokovi: Omit<PerkolizonikTok, 'status'>[] = [
    {
      id: 'pk-ingest',
      naziv: 'Ingest Tok',
      kapacitetPoSatu: 4200,
      iskoriscenost: 0.83,
      latencijaMs: 118,
      greskePo1000: 1.9,
    },
    {
      id: 'pk-obrada',
      naziv: 'Obrada Tok',
      kapacitetPoSatu: 3600,
      iskoriscenost: 0.79,
      latencijaMs: 146,
      greskePo1000: 2.6,
    },
    {
      id: 'pk-validacija',
      naziv: 'Validacija Tok',
      kapacitetPoSatu: 3100,
      iskoriscenost: 0.88,
      latencijaMs: 101,
      greskePo1000: 1.4,
    },
    {
      id: 'pk-distribucija',
      naziv: 'Distribucija Tok',
      kapacitetPoSatu: 3900,
      iskoriscenost: 0.76,
      latencijaMs: 132,
      greskePo1000: 3.1,
    },
  ];

  const tokoviSaStatusom: PerkolizonikTok[] = tokovi.map((tok) => {
    const status: PerkolizonikTok['status'] =
      tok.greskePo1000 > 3 || tok.latencijaMs > 180
        ? 'kritican'
        : tok.greskePo1000 > 2 || tok.iskoriscenost < 0.75
          ? 'optimizacija'
          : 'stabilan';
    return { ...tok, status };
  });

  const ukupniKapacitetPoSatu = tokoviSaStatusom.reduce((sum, t) => sum + t.kapacitetPoSatu, 0);
  const procenjeniOutputPoSatu = Math.round(
    tokoviSaStatusom.reduce((sum, t) => sum + t.kapacitetPoSatu * t.iskoriscenost, 0),
  );
  const prosekIskoriscenosti =
    tokoviSaStatusom.reduce((sum, t) => sum + t.iskoriscenost, 0) / tokoviSaStatusom.length;
  const prosekLatencijeMs =
    tokoviSaStatusom.reduce((sum, t) => sum + t.latencijaMs, 0) / tokoviSaStatusom.length;
  const prosecnaOcenaGreske =
    tokoviSaStatusom.reduce((sum, t) => sum + t.greskePo1000, 0) / tokoviSaStatusom.length;

  const stabilnost = clamp01(
    round4(1 - (prosecnaGreskaPenalizacija(prosecnaOcenaGreske) + prosecnaLatencijskaPenalizacija(prosekLatencijeMs))),
  );
  const operativniIndeks = clamp01(
    round4(stabilnost * 0.45 + prosekIskoriscenosti * 0.4 + throughputScore(procenjeniOutputPoSatu, ukupniKapacitetPoSatu) * 0.15),
  );

  return {
    status: 'aktivan',
    operativniIndeks,
    stabilnost,
    prosekIskoriscenosti: round4(prosekIskoriscenosti),
    prosekLatencijeMs: round4(prosekLatencijeMs),
    ukupniKapacitetPoSatu,
    procenjeniOutputPoSatu,
    tokovi: tokoviSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}

function throughputScore(output: number, capacity: number): number {
  if (capacity <= 0) return 0;
  return clamp01(round4(output / capacity));
}

function prosecnaGreskaPenalizacija(v: number): number {
  return clamp01(round4(v / 20));
}

function prosecnaLatencijskaPenalizacija(v: number): number {
  return clamp01(round4(v / 500));
}
