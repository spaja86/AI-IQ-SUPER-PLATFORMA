/**
 * 🧩 LAUREATSKI DEKODER
 *
 * Dekoderska matrica laureatskog centra izvedena iz LAUREATSKOG DEMODULATORA i
 * LAUREATSKOG SIGNALA. Modul mapira demodulatorske impulse u dekoderske
 * impulse i meri koherentnost kroz dekoderski indeks.
 *
 * Model:
 *   dekoderHz = demodulatorHz * (0.92 + normalizovano * 0.22)
 *   dekoderskaVeza = (demodulatorskaVeza + amplitudaSignala + normalizovano) / 3
 *   dekoderskaStabilnost = 1 - std(dekoderskaVeza)
 *   dekoderskiIndeks = (dekoderskaStabilnost + demodulatorskiIndeks + signalniIndeks) / 3
 *
 * Autofinish #1246
 */

import { buildLaureatskiDemodulator } from './laureatski-demodulator';
import { buildLaureatskiSignal } from './laureatski-signal';

export interface DekoderImpuls {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  amplituda: number;
  faza: number;
  dekoderHz: number;
  dekoderskaVeza: number;
  normalizovano: number;
}

export interface LaureatskiDekoderRezultat {
  dekoderskiIndeks: number;
  dekoderskaStabilnost: number;
  prosecniDekoderHz: number;
  maksimalniDekoderHz: number;
  minimalniDekoderHz: number;
  dekoderskiOpsegHz: number;
  impulsi: DekoderImpuls[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiDekoder(userId: string): LaureatskiDekoderRezultat {
  const demodulator = buildLaureatskiDemodulator(userId);
  const signal = buildLaureatskiSignal(userId);
  const impulsi: DekoderImpuls[] = [];

  for (let i = 0; i < demodulator.impulsi.length; i++) {
    const demodulatorImpuls = demodulator.impulsi[i];
    const signalImpuls = signal.impulsi[i] ?? signal.impulsi[0];
    const dekoderHz = round4(
      demodulatorImpuls.demodulatorHz * (0.92 + demodulatorImpuls.normalizovano * 0.22),
    );
    const dekoderskaVeza = Math.max(
      0,
      Math.min(
        1,
        round4(
          (demodulatorImpuls.demodulatorskaVeza +
            signalImpuls.amplituda +
            demodulatorImpuls.normalizovano) / 3,
        ),
      ),
    );

    impulsi.push({
      t: demodulatorImpuls.t,
      sloj: demodulatorImpuls.sloj,
      harmonik: demodulatorImpuls.harmonik,
      metar: demodulatorImpuls.metar,
      amplituda: demodulatorImpuls.amplituda,
      faza: demodulatorImpuls.faza,
      dekoderHz,
      dekoderskaVeza,
      normalizovano: 0,
    });
  }

  const vrednosti = impulsi.map((i) => i.dekoderHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const i of impulsi) {
    i.normalizovano = range > 0 ? round4((i.dekoderHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const srednjaVeza =
    impulsi.reduce((sum, i) => sum + i.dekoderskaVeza, 0) / impulsi.length;
  const varijansa =
    impulsi.reduce((sum, i) => sum + Math.pow(i.dekoderskaVeza - srednjaVeza, 2), 0) /
    impulsi.length;
  const std = Math.sqrt(varijansa);
  const dekoderskaStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const dekoderskiIndeks = Math.max(
    0,
    Math.min(
      1,
      round4(
        (dekoderskaStabilnost +
          demodulator.demodulatorskiIndeks +
          signal.signalniIndeks) / 3,
      ),
    ),
  );

  return {
    dekoderskiIndeks,
    dekoderskaStabilnost,
    prosecniDekoderHz: round4(avg),
    maksimalniDekoderHz: round4(max),
    minimalniDekoderHz: round4(min),
    dekoderskiOpsegHz: round4(range),
    impulsi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
