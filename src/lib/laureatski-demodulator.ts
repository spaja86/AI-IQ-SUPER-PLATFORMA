/**
 * 📻 LAUREATSKI DEMODULATOR
 *
 * Demodulatorska matrica laureatskog centra izvedena iz LAUREATSKOG MODULATORA i
 * LAUREATSKOG OSCILATORA. Modul mapira modulatorske impulse u demodulatorske
 * impulse i meri koherentnost kroz demodulatorski indeks.
 *
 * Model:
 *   demodulatorHz = modulatorHz * (0.9 + normalizovano * 0.24)
 *   demodulatorskaVeza = (modulatorskaVeza + oscilatorskaVeza + normalizovano) / 3
 *   demodulatorskaStabilnost = 1 - std(demodulatorskaVeza)
 *   demodulatorskiIndeks = (demodulatorskaStabilnost + modulatorskiIndeks + oscilatorskiIndeks) / 3
 *
 * Autofinish #1245
 */

import { buildLaureatskiModulator } from './laureatski-modulator';
import { buildLaureatskiOscilator } from './laureatski-oscilator';

export interface DemodulatorImpuls {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  amplituda: number;
  faza: number;
  demodulatorHz: number;
  demodulatorskaVeza: number;
  normalizovano: number;
}

export interface LaureatskiDemodulatorRezultat {
  demodulatorskiIndeks: number;
  demodulatorskaStabilnost: number;
  prosecniDemodulatorHz: number;
  maksimalniDemodulatorHz: number;
  minimalniDemodulatorHz: number;
  demodulatorskiOpsegHz: number;
  impulsi: DemodulatorImpuls[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiDemodulator(
  userId: string,
): LaureatskiDemodulatorRezultat {
  const modulator = buildLaureatskiModulator(userId);
  const oscilator = buildLaureatskiOscilator(userId);
  const impulsi: DemodulatorImpuls[] = [];

  for (let i = 0; i < modulator.impulsi.length; i++) {
    const modulatorImpuls = modulator.impulsi[i];
    const oscilatorImpuls = oscilator.impulsi[i] ?? oscilator.impulsi[0];
    const demodulatorHz = round4(
      modulatorImpuls.modulatorHz * (0.9 + modulatorImpuls.normalizovano * 0.24),
    );
    const demodulatorskaVeza = Math.max(
      0,
      Math.min(
        1,
        round4(
          (modulatorImpuls.modulatorskaVeza +
            oscilatorImpuls.oscilatorskaVeza +
            modulatorImpuls.normalizovano) / 3,
        ),
      ),
    );

    impulsi.push({
      t: modulatorImpuls.t,
      sloj: modulatorImpuls.sloj,
      harmonik: modulatorImpuls.harmonik,
      metar: modulatorImpuls.metar,
      amplituda: modulatorImpuls.amplituda,
      faza: modulatorImpuls.faza,
      demodulatorHz,
      demodulatorskaVeza,
      normalizovano: 0,
    });
  }

  const vrednosti = impulsi.map((i) => i.demodulatorHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const i of impulsi) {
    i.normalizovano = range > 0 ? round4((i.demodulatorHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const srednjaVeza =
    impulsi.reduce((sum, i) => sum + i.demodulatorskaVeza, 0) / impulsi.length;
  const varijansa =
    impulsi.reduce((sum, i) => sum + Math.pow(i.demodulatorskaVeza - srednjaVeza, 2), 0) /
    impulsi.length;
  const std = Math.sqrt(varijansa);
  const demodulatorskaStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const demodulatorskiIndeks = Math.max(
    0,
    Math.min(
      1,
      round4(
        (demodulatorskaStabilnost +
          modulator.modulatorskiIndeks +
          oscilator.oscilatorskiIndeks) / 3,
      ),
    ),
  );

  return {
    demodulatorskiIndeks,
    demodulatorskaStabilnost,
    prosecniDemodulatorHz: round4(avg),
    maksimalniDemodulatorHz: round4(max),
    minimalniDemodulatorHz: round4(min),
    demodulatorskiOpsegHz: round4(range),
    impulsi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
