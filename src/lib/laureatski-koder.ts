/**
 * 🧬 LAUREATSKI KODER
 *
 * Koderska matrica laureatskog centra izvedena iz LAUREATSKOG REKODERA i
 * LAUREATSKOG DEKODERA. Modul mapira rekoderske impulse u koderske impulse i
 * meri koherentnost kroz koderski indeks.
 *
 * Model:
 *   koderHz = rekoderHz * (0.95 + normalizovano * 0.18)
 *   koderskaVeza = (rekoderskaVeza + dekoderskaVeza + normalizovano) / 3
 *   koderskaStabilnost = 1 - std(koderskaVeza)
 *   koderskiIndeks = (koderskaStabilnost + rekoderskiIndeks + dekoderskiIndeks) / 3
 *
 * Autofinish #1250
 */

import { buildLaureatskiRekoder } from './laureatski-rekoder';
import { buildLaureatskiDekoder } from './laureatski-dekoder';

export interface KoderImpuls {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  amplituda: number;
  faza: number;
  koderHz: number;
  koderskaVeza: number;
  normalizovano: number;
}

export interface LaureatskiKoderRezultat {
  koderskiIndeks: number;
  koderskaStabilnost: number;
  prosecniKoderHz: number;
  maksimalniKoderHz: number;
  minimalniKoderHz: number;
  koderskiOpsegHz: number;
  impulsi: KoderImpuls[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiKoder(userId: string): LaureatskiKoderRezultat {
  const rekoder = buildLaureatskiRekoder(userId);
  const dekoder = buildLaureatskiDekoder(userId);
  const impulsi: KoderImpuls[] = [];

  for (let i = 0; i < rekoder.impulsi.length; i++) {
    const rekoderImpuls = rekoder.impulsi[i];
    const dekoderImpuls = dekoder.impulsi[i] ?? dekoder.impulsi[0];
    const koderHz = round4(rekoderImpuls.rekoderHz * (0.95 + rekoderImpuls.normalizovano * 0.18));
    const koderskaVeza = Math.max(
      0,
      Math.min(
        1,
        round4(
          (rekoderImpuls.rekoderskaVeza +
            dekoderImpuls.dekoderskaVeza +
            rekoderImpuls.normalizovano) / 3,
        ),
      ),
    );

    impulsi.push({
      t: rekoderImpuls.t,
      sloj: rekoderImpuls.sloj,
      harmonik: rekoderImpuls.harmonik,
      metar: rekoderImpuls.metar,
      amplituda: rekoderImpuls.amplituda,
      faza: rekoderImpuls.faza,
      koderHz,
      koderskaVeza,
      normalizovano: 0,
    });
  }

  const vrednosti = impulsi.map((i) => i.koderHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const i of impulsi) {
    i.normalizovano = range > 0 ? round4((i.koderHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const srednjaVeza = impulsi.reduce((sum, i) => sum + i.koderskaVeza, 0) / impulsi.length;
  const varijansa =
    impulsi.reduce((sum, i) => sum + Math.pow(i.koderskaVeza - srednjaVeza, 2), 0) / impulsi.length;
  const std = Math.sqrt(varijansa);
  const koderskaStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const koderskiIndeks = Math.max(
    0,
    Math.min(
      1,
      round4((koderskaStabilnost + rekoder.rekoderskiIndeks + dekoder.dekoderskiIndeks) / 3),
    ),
  );

  return {
    koderskiIndeks,
    koderskaStabilnost,
    prosecniKoderHz: round4(avg),
    maksimalniKoderHz: round4(max),
    minimalniKoderHz: round4(min),
    koderskiOpsegHz: round4(range),
    impulsi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
