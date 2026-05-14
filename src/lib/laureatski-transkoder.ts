/**
 * 🔄 LAUREATSKI TRANSKODER
 *
 * Transkoderska matrica laureatskog centra izvedena iz LAUREATSKOG ENKODERA i
 * LAUREATSKOG DEKODERA. Modul mapira enkoderske impulse u transkoderske
 * impulse i meri koherentnost kroz transkoderski indeks.
 *
 * Model:
 *   transkoderHz = enkoderHz * (0.95 + normalizovano * 0.18)
 *   transkoderskaVeza = (enkoderskaVeza + dekoderskaVeza + normalizovano) / 3
 *   transkoderskaStabilnost = 1 - std(transkoderskaVeza)
 *   transkoderskiIndeks = (transkoderskaStabilnost + enkoderskiIndeks + dekoderskiIndeks) / 3
 *
 * Autofinish #1248
 */

import { buildLaureatskiEnkoder } from './laureatski-enkoder';
import { buildLaureatskiDekoder } from './laureatski-dekoder';

export interface TranskoderImpuls {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  amplituda: number;
  faza: number;
  transkoderHz: number;
  transkoderskaVeza: number;
  normalizovano: number;
}

export interface LaureatskiTranskoderRezultat {
  transkoderskiIndeks: number;
  transkoderskaStabilnost: number;
  prosecniTranskoderHz: number;
  maksimalniTranskoderHz: number;
  minimalniTranskoderHz: number;
  transkoderskiOpsegHz: number;
  impulsi: TranskoderImpuls[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiTranskoder(userId: string): LaureatskiTranskoderRezultat {
  const enkoder = buildLaureatskiEnkoder(userId);
  const dekoder = buildLaureatskiDekoder(userId);
  const impulsi: TranskoderImpuls[] = [];

  for (let i = 0; i < enkoder.impulsi.length; i++) {
    const enkoderImpuls = enkoder.impulsi[i];
    const dekoderImpuls = dekoder.impulsi[i] ?? dekoder.impulsi[0];
    const transkoderHz = round4(
      enkoderImpuls.enkoderskiHz * (0.95 + enkoderImpuls.normalizovano * 0.18),
    );
    const transkoderskaVeza = Math.max(
      0,
      Math.min(
        1,
        round4(
          (enkoderImpuls.enkoderskaVeza +
            dekoderImpuls.dekoderskaVeza +
            enkoderImpuls.normalizovano) / 3,
        ),
      ),
    );

    impulsi.push({
      t: enkoderImpuls.t,
      sloj: enkoderImpuls.sloj,
      harmonik: enkoderImpuls.harmonik,
      metar: enkoderImpuls.metar,
      amplituda: enkoderImpuls.amplituda,
      faza: enkoderImpuls.faza,
      transkoderHz,
      transkoderskaVeza,
      normalizovano: 0,
    });
  }

  const vrednosti = impulsi.map((i) => i.transkoderHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const i of impulsi) {
    i.normalizovano = range > 0 ? round4((i.transkoderHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const srednjaVeza =
    impulsi.reduce((sum, i) => sum + i.transkoderskaVeza, 0) / impulsi.length;
  const varijansa =
    impulsi.reduce((sum, i) => sum + Math.pow(i.transkoderskaVeza - srednjaVeza, 2), 0) /
    impulsi.length;
  const std = Math.sqrt(varijansa);
  const transkoderskaStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const transkoderskiIndeks = Math.max(
    0,
    Math.min(
      1,
      round4(
        (transkoderskaStabilnost +
          enkoder.enkoderskiIndeks +
          dekoder.dekoderskiIndeks) / 3,
      ),
    ),
  );

  return {
    transkoderskiIndeks,
    transkoderskaStabilnost,
    prosecniTranskoderHz: round4(avg),
    maksimalniTranskoderHz: round4(max),
    minimalniTranskoderHz: round4(min),
    transkoderskiOpsegHz: round4(range),
    impulsi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
