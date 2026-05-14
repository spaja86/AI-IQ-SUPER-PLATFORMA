/**
 * 🎚️ LAUREATSKI MODULATOR
 *
 * Modulatorska matrica laureatskog centra izvedena iz LAUREATSKOG OSCILATORA i
 * LAUREATSKOG REZONATORA. Modul mapira oscilatorske impulse u modulatorske
 * impulse i meri koherentnost kroz modulatorski indeks.
 *
 * Model:
 *   modulatorHz = oscilatorHz * (0.94 + normalizovano * 0.2)
 *   modulatorskaVeza = (oscilatorskaVeza + rezonatorskaVeza + normalizovano) / 3
 *   modulatorskaStabilnost = 1 - std(modulatorskaVeza)
 *   modulatorskiIndeks = (modulatorskaStabilnost + oscilatorskiIndeks + rezonatorskiIndeks) / 3
 *
 * Autofinish #1244
 */

import { buildLaureatskiOscilator } from './laureatski-oscilator';
import { buildLaureatskiRezonator } from './laureatski-rezonator';

export interface ModulatorImpuls {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  amplituda: number;
  faza: number;
  modulatorHz: number;
  modulatorskaVeza: number;
  normalizovano: number;
}

export interface LaureatskiModulatorRezultat {
  modulatorskiIndeks: number;
  modulatorskaStabilnost: number;
  prosecniModulatorHz: number;
  maksimalniModulatorHz: number;
  minimalniModulatorHz: number;
  modulatorskiOpsegHz: number;
  impulsi: ModulatorImpuls[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiModulator(userId: string): LaureatskiModulatorRezultat {
  const oscilator = buildLaureatskiOscilator(userId);
  const rezonator = buildLaureatskiRezonator(userId);
  const impulsi: ModulatorImpuls[] = [];

  for (let i = 0; i < oscilator.impulsi.length; i++) {
    const oscilatorImpuls = oscilator.impulsi[i];
    const rezonatorImpuls = rezonator.impulsi[i] ?? rezonator.impulsi[0];
    const modulatorHz = round4(
      oscilatorImpuls.oscilatorHz * (0.94 + oscilatorImpuls.normalizovano * 0.2),
    );
    const modulatorskaVeza = Math.max(
      0,
      Math.min(
        1,
        round4(
          (oscilatorImpuls.oscilatorskaVeza +
            rezonatorImpuls.rezonatorskaVeza +
            oscilatorImpuls.normalizovano) / 3,
        ),
      ),
    );

    impulsi.push({
      t: oscilatorImpuls.t,
      sloj: oscilatorImpuls.sloj,
      harmonik: oscilatorImpuls.harmonik,
      metar: oscilatorImpuls.metar,
      amplituda: oscilatorImpuls.amplituda,
      faza: oscilatorImpuls.faza,
      modulatorHz,
      modulatorskaVeza,
      normalizovano: 0,
    });
  }

  const vrednosti = impulsi.map((i) => i.modulatorHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const i of impulsi) {
    i.normalizovano = range > 0 ? round4((i.modulatorHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const srednjaVeza =
    impulsi.reduce((sum, i) => sum + i.modulatorskaVeza, 0) / impulsi.length;
  const varijansa =
    impulsi.reduce((sum, i) => sum + Math.pow(i.modulatorskaVeza - srednjaVeza, 2), 0) /
    impulsi.length;
  const std = Math.sqrt(varijansa);
  const modulatorskaStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const modulatorskiIndeks = Math.max(
    0,
    Math.min(
      1,
      round4(
        (modulatorskaStabilnost +
          oscilator.oscilatorskiIndeks +
          rezonator.rezonatorskiIndeks) / 3,
      ),
    ),
  );

  return {
    modulatorskiIndeks,
    modulatorskaStabilnost,
    prosecniModulatorHz: round4(avg),
    maksimalniModulatorHz: round4(max),
    minimalniModulatorHz: round4(min),
    modulatorskiOpsegHz: round4(range),
    impulsi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
