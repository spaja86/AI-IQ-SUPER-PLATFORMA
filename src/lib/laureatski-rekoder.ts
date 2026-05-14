/**
 * ♻️ LAUREATSKI REKODER
 *
 * Rekoderska matrica laureatskog centra izvedena iz LAUREATSKOG TRANSKODERA i
 * LAUREATSKOG ENKODERA. Modul mapira transkoderske impulse u rekoderske
 * impulse i meri koherentnost kroz rekoderski indeks.
 *
 * Model:
 *   rekoderHz = transkoderHz * (0.96 + normalizovano * 0.16)
 *   rekoderskaVeza = (transkoderskaVeza + enkoderskaVeza + normalizovano) / 3
 *   rekoderskaStabilnost = 1 - std(rekoderskaVeza)
 *   rekoderskiIndeks = (rekoderskaStabilnost + transkoderskiIndeks + enkoderskiIndeks) / 3
 *
 * Autofinish #1249
 */

import { buildLaureatskiTranskoder } from './laureatski-transkoder';
import { buildLaureatskiEnkoder } from './laureatski-enkoder';

export interface RekoderImpuls {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  amplituda: number;
  faza: number;
  rekoderHz: number;
  rekoderskaVeza: number;
  normalizovano: number;
}

export interface LaureatskiRekoderRezultat {
  rekoderskiIndeks: number;
  rekoderskaStabilnost: number;
  prosecniRekoderHz: number;
  maksimalniRekoderHz: number;
  minimalniRekoderHz: number;
  rekoderskiOpsegHz: number;
  impulsi: RekoderImpuls[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiRekoder(userId: string): LaureatskiRekoderRezultat {
  const transkoder = buildLaureatskiTranskoder(userId);
  const enkoder = buildLaureatskiEnkoder(userId);
  const impulsi: RekoderImpuls[] = [];

  for (let i = 0; i < transkoder.impulsi.length; i++) {
    const transkoderImpuls = transkoder.impulsi[i];
    const enkoderImpuls = enkoder.impulsi[i] ?? enkoder.impulsi[0];
    const rekoderHz = round4(
      transkoderImpuls.transkoderHz * (0.96 + transkoderImpuls.normalizovano * 0.16),
    );
    const rekoderskaVeza = Math.max(
      0,
      Math.min(
        1,
        round4(
          (transkoderImpuls.transkoderskaVeza +
            enkoderImpuls.enkoderskaVeza +
            transkoderImpuls.normalizovano) / 3,
        ),
      ),
    );

    impulsi.push({
      t: transkoderImpuls.t,
      sloj: transkoderImpuls.sloj,
      harmonik: transkoderImpuls.harmonik,
      metar: transkoderImpuls.metar,
      amplituda: transkoderImpuls.amplituda,
      faza: transkoderImpuls.faza,
      rekoderHz,
      rekoderskaVeza,
      normalizovano: 0,
    });
  }

  const vrednosti = impulsi.map((i) => i.rekoderHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const i of impulsi) {
    i.normalizovano = range > 0 ? round4((i.rekoderHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const srednjaVeza = impulsi.reduce((sum, i) => sum + i.rekoderskaVeza, 0) / impulsi.length;
  const varijansa =
    impulsi.reduce((sum, i) => sum + Math.pow(i.rekoderskaVeza - srednjaVeza, 2), 0) /
    impulsi.length;
  const std = Math.sqrt(varijansa);
  const rekoderskaStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const rekoderskiIndeks = Math.max(
    0,
    Math.min(
      1,
      round4(
        (rekoderskaStabilnost +
          transkoder.transkoderskiIndeks +
          enkoder.enkoderskiIndeks) / 3,
      ),
    ),
  );

  return {
    rekoderskiIndeks,
    rekoderskaStabilnost,
    prosecniRekoderHz: round4(avg),
    maksimalniRekoderHz: round4(max),
    minimalniRekoderHz: round4(min),
    rekoderskiOpsegHz: round4(range),
    impulsi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
