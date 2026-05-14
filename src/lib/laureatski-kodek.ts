/**
 * 🎞️ LAUREATSKI KODEK
 *
 * Kodek matrica laureatskog centra izvedena iz LAUREATSKOG KODERA i
 * LAUREATSKOG DEKODERA. Modul mapira koderske impulse u kodek impulse i meri
 * koherentnost kroz kodek indeks.
 *
 * Model:
 *   kodekHz = koderHz * (0.94 + normalizovano * 0.2)
 *   kodekVeza = (koderskaVeza + dekoderskaVeza + normalizovano) / 3
 *   kodekStabilnost = 1 - std(kodekVeza)
 *   kodekIndeks = (kodekStabilnost + koderskiIndeks + dekoderskiIndeks) / 3
 *
 * Autofinish #1251
 */

import { buildLaureatskiKoder } from './laureatski-koder';
import { buildLaureatskiDekoder } from './laureatski-dekoder';

export interface KodekImpuls {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  amplituda: number;
  faza: number;
  kodekHz: number;
  kodekVeza: number;
  normalizovano: number;
}

export interface LaureatskiKodekRezultat {
  kodekIndeks: number;
  kodekStabilnost: number;
  prosecniKodekHz: number;
  maksimalniKodekHz: number;
  minimalniKodekHz: number;
  kodekOpsegHz: number;
  impulsi: KodekImpuls[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiKodek(userId: string): LaureatskiKodekRezultat {
  const koder = buildLaureatskiKoder(userId);
  const dekoder = buildLaureatskiDekoder(userId);
  const impulsi: KodekImpuls[] = [];

  for (let i = 0; i < koder.impulsi.length; i++) {
    const koderImpuls = koder.impulsi[i];
    const dekoderImpuls = dekoder.impulsi[i] ?? dekoder.impulsi[0];
    const kodekHz = round4(
      koderImpuls.koderHz * (0.94 + koderImpuls.normalizovano * 0.2),
    );
    const kodekVeza = Math.max(
      0,
      Math.min(
        1,
        round4(
          (koderImpuls.koderskaVeza +
            dekoderImpuls.dekoderskaVeza +
            koderImpuls.normalizovano) / 3,
        ),
      ),
    );

    impulsi.push({
      t: koderImpuls.t,
      sloj: koderImpuls.sloj,
      harmonik: koderImpuls.harmonik,
      metar: koderImpuls.metar,
      amplituda: koderImpuls.amplituda,
      faza: koderImpuls.faza,
      kodekHz,
      kodekVeza,
      normalizovano: 0,
    });
  }

  const vrednosti = impulsi.map((i) => i.kodekHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const i of impulsi) {
    i.normalizovano = range > 0 ? round4((i.kodekHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const srednjaVeza = impulsi.reduce((sum, i) => sum + i.kodekVeza, 0) / impulsi.length;
  const varijansa =
    impulsi.reduce((sum, i) => sum + Math.pow(i.kodekVeza - srednjaVeza, 2), 0) /
    impulsi.length;
  const std = Math.sqrt(varijansa);
  const kodekStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const kodekIndeks = Math.max(
    0,
    Math.min(
      1,
      round4(
        (kodekStabilnost + koder.koderskiIndeks + dekoder.dekoderskiIndeks) / 3,
      ),
    ),
  );

  return {
    kodekIndeks,
    kodekStabilnost,
    prosecniKodekHz: round4(avg),
    maksimalniKodekHz: round4(max),
    minimalniKodekHz: round4(min),
    kodekOpsegHz: round4(range),
    impulsi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
