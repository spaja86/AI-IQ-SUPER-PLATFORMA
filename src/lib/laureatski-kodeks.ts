/**
 * 📜 LAUREATSKI KODEKS
 *
 * Kodeks matrica laureatskog centra izvedena iz LAUREATSKOG KODEKA i
 * LAUREATSKOG KODERA. Modul mapira kodek impulse u kodeks impulse i meri
 * koherentnost kroz kodeks indeks.
 *
 * Model:
 *   kodeksHz = kodekHz * (0.93 + normalizovano * 0.22)
 *   kodeksVeza = (kodekVeza + koderskaVeza + normalizovano) / 3
 *   kodeksStabilnost = 1 - std(kodeksVeza)
 *   kodeksIndeks = (kodeksStabilnost + kodekIndeks + koderskiIndeks) / 3
 *
 * Autofinish #1252
 */

import { buildLaureatskiKodek } from './laureatski-kodek';
import { buildLaureatskiKoder } from './laureatski-koder';

export interface KodeksImpuls {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  amplituda: number;
  faza: number;
  kodeksHz: number;
  kodeksVeza: number;
  normalizovano: number;
}

export interface LaureatskiKodeksRezultat {
  kodeksIndeks: number;
  kodeksStabilnost: number;
  prosecniKodeksHz: number;
  maksimalniKodeksHz: number;
  minimalniKodeksHz: number;
  kodeksOpsegHz: number;
  impulsi: KodeksImpuls[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiKodeks(userId: string): LaureatskiKodeksRezultat {
  const kodek = buildLaureatskiKodek(userId);
  const koder = buildLaureatskiKoder(userId);
  const impulsi: KodeksImpuls[] = [];

  for (let i = 0; i < kodek.impulsi.length; i++) {
    const kodekImpuls = kodek.impulsi[i];
    const koderImpuls = koder.impulsi[i] ?? koder.impulsi[0];
    const kodeksHz = round4(kodekImpuls.kodekHz * (0.93 + kodekImpuls.normalizovano * 0.22));
    const kodeksVeza = Math.max(
      0,
      Math.min(
        1,
        round4((kodekImpuls.kodekVeza + koderImpuls.koderskaVeza + kodekImpuls.normalizovano) / 3),
      ),
    );

    impulsi.push({
      t: kodekImpuls.t,
      sloj: kodekImpuls.sloj,
      harmonik: kodekImpuls.harmonik,
      metar: kodekImpuls.metar,
      amplituda: kodekImpuls.amplituda,
      faza: kodekImpuls.faza,
      kodeksHz,
      kodeksVeza,
      normalizovano: 0,
    });
  }

  const vrednosti = impulsi.map((i) => i.kodeksHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const i of impulsi) {
    i.normalizovano = range > 0 ? round4((i.kodeksHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const srednjaVeza = impulsi.reduce((sum, i) => sum + i.kodeksVeza, 0) / impulsi.length;
  const varijansa =
    impulsi.reduce((sum, i) => sum + Math.pow(i.kodeksVeza - srednjaVeza, 2), 0) /
    impulsi.length;
  const std = Math.sqrt(varijansa);
  const kodeksStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const kodeksIndeks = Math.max(
    0,
    Math.min(
      1,
      round4((kodeksStabilnost + kodek.kodekIndeks + koder.koderskiIndeks) / 3),
    ),
  );

  return {
    kodeksIndeks,
    kodeksStabilnost,
    prosecniKodeksHz: round4(avg),
    maksimalniKodeksHz: round4(max),
    minimalniKodeksHz: round4(min),
    kodeksOpsegHz: round4(range),
    impulsi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
