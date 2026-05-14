/**
 * 🔐 LAUREATSKI ENKODER
 *
 * Enkoderska matrica laureatskog centra izvedena iz LAUREATSKOG DEKODERA i
 * LAUREATSKOG MODULATORA. Modul mapira dekoderske impulse u enkoderske
 * impulse i meri koherentnost kroz enkoderski indeks.
 *
 * Model:
 *   enkoderskiHz = dekoderHz * (0.94 + normalizovano * 0.20)
 *   enkoderskaVeza = (dekoderskaVeza + modulatorskaVeza + normalizovano) / 3
 *   enkoderskaStabilnost = 1 - std(enkoderskaVeza)
 *   enkoderskiIndeks = (enkoderskaStabilnost + dekoderskiIndeks + modulatorskiIndeks) / 3
 *
 * Autofinish #1247
 */

import { buildLaureatskiDekoder } from './laureatski-dekoder';
import { buildLaureatskiModulator } from './laureatski-modulator';

export interface EnkoderImpuls {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  amplituda: number;
  faza: number;
  enkoderskiHz: number;
  enkoderskaVeza: number;
  normalizovano: number;
}

export interface LaureatskiEnkoderRezultat {
  enkoderskiIndeks: number;
  enkoderskaStabilnost: number;
  prosecniEnkoderskiHz: number;
  maksimalniEnkoderskiHz: number;
  minimalniEnkoderskiHz: number;
  enkoderskiOpsegHz: number;
  impulsi: EnkoderImpuls[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiEnkoder(userId: string): LaureatskiEnkoderRezultat {
  const dekoder = buildLaureatskiDekoder(userId);
  const modulator = buildLaureatskiModulator(userId);
  const impulsi: EnkoderImpuls[] = [];

  for (let i = 0; i < dekoder.impulsi.length; i++) {
    const dekoderImpuls = dekoder.impulsi[i];
    const modulatorImpuls = modulator.impulsi[i] ?? modulator.impulsi[0];
    const enkoderskiHz = round4(
      dekoderImpuls.dekoderHz * (0.94 + dekoderImpuls.normalizovano * 0.20),
    );
    const enkoderskaVeza = Math.max(
      0,
      Math.min(
        1,
        round4(
          (dekoderImpuls.dekoderskaVeza +
            modulatorImpuls.modulatorskaVeza +
            dekoderImpuls.normalizovano) / 3,
        ),
      ),
    );

    impulsi.push({
      t: dekoderImpuls.t,
      sloj: dekoderImpuls.sloj,
      harmonik: dekoderImpuls.harmonik,
      metar: dekoderImpuls.metar,
      amplituda: dekoderImpuls.amplituda,
      faza: dekoderImpuls.faza,
      enkoderskiHz,
      enkoderskaVeza,
      normalizovano: 0,
    });
  }

  const vrednosti = impulsi.map((i) => i.enkoderskiHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const i of impulsi) {
    i.normalizovano = range > 0 ? round4((i.enkoderskiHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const srednja = impulsi.reduce((sum, i) => sum + i.enkoderskaVeza, 0) / impulsi.length;
  const varijansa =
    impulsi.reduce((sum, i) => sum + Math.pow(i.enkoderskaVeza - srednja, 2), 0) /
    impulsi.length;
  const std = Math.sqrt(varijansa);
  const enkoderskaStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const enkoderskiIndeks = Math.max(
    0,
    Math.min(
      1,
      round4(
        (enkoderskaStabilnost +
          dekoder.dekoderskiIndeks +
          modulator.modulatorskiIndeks) / 3,
      ),
    ),
  );

  return {
    enkoderskiIndeks,
    enkoderskaStabilnost,
    prosecniEnkoderskiHz: round4(avg),
    maksimalniEnkoderskiHz: round4(max),
    minimalniEnkoderskiHz: round4(min),
    enkoderskiOpsegHz: round4(range),
    impulsi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
