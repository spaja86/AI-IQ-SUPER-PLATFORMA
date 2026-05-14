/**
 * 🌀 LAUREATSKI OSCILATOR
 *
 * Oscilatorska matrica laureatskog centra izvedena iz LAUREATSKOG REZONATORA i
 * LAUREATSKOG EHA. Modul mapira rezonatorske impulse u oscilatorske impulse i
 * meri koherentnost kroz oscilatorski indeks.
 *
 * Model:
 *   oscilatorHz = rezonatorHz * (0.92 + normalizovano * 0.22)
 *   oscilatorskaVeza = (rezonatorskaVeza + povratnaSprega + normalizovano) / 3
 *   oscilatorskaStabilnost = 1 - std(oscilatorskaVeza)
 *   oscilatorskiIndeks = (oscilatorskaStabilnost + rezonatorskiIndeks + ehoIndeks) / 3
 *
 * Autofinish #1243
 */

import { buildLaureatskiRezonator } from './laureatski-rezonator';
import { buildLaureatskiEho } from './laureatski-eho';

export interface OscilatorImpuls {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  amplituda: number;
  faza: number;
  oscilatorHz: number;
  oscilatorskaVeza: number;
  normalizovano: number;
}

export interface LaureatskiOscilatorRezultat {
  oscilatorskiIndeks: number;
  oscilatorskaStabilnost: number;
  prosecniOscilatorHz: number;
  maksimalniOscilatorHz: number;
  minimalniOscilatorHz: number;
  oscilatorskiOpsegHz: number;
  impulsi: OscilatorImpuls[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiOscilator(userId: string): LaureatskiOscilatorRezultat {
  const rezonator = buildLaureatskiRezonator(userId);
  const eho = buildLaureatskiEho(userId);
  const impulsi: OscilatorImpuls[] = [];

  for (let i = 0; i < rezonator.impulsi.length; i++) {
    const rezonatorImpuls = rezonator.impulsi[i];
    const ehoImpuls = eho.impulsi[i] ?? eho.impulsi[0];
    const oscilatorHz = round4(
      rezonatorImpuls.rezonatorHz * (0.92 + rezonatorImpuls.normalizovano * 0.22),
    );
    const oscilatorskaVeza = Math.max(
      0,
      Math.min(
        1,
        round4(
          (rezonatorImpuls.rezonatorskaVeza +
            ehoImpuls.povratnaSprega +
            rezonatorImpuls.normalizovano) / 3,
        ),
      ),
    );

    impulsi.push({
      t: rezonatorImpuls.t,
      sloj: rezonatorImpuls.sloj,
      harmonik: rezonatorImpuls.harmonik,
      metar: rezonatorImpuls.metar,
      amplituda: rezonatorImpuls.amplituda,
      faza: rezonatorImpuls.faza,
      oscilatorHz,
      oscilatorskaVeza,
      normalizovano: 0,
    });
  }

  const vrednosti = impulsi.map((i) => i.oscilatorHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const i of impulsi) {
    i.normalizovano = range > 0 ? round4((i.oscilatorHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const srednjaVeza =
    impulsi.reduce((sum, i) => sum + i.oscilatorskaVeza, 0) / impulsi.length;
  const varijansa =
    impulsi.reduce((sum, i) => sum + Math.pow(i.oscilatorskaVeza - srednjaVeza, 2), 0) /
    impulsi.length;
  const std = Math.sqrt(varijansa);
  const oscilatorskaStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const oscilatorskiIndeks = Math.max(
    0,
    Math.min(
      1,
      round4(
        (oscilatorskaStabilnost + rezonator.rezonatorskiIndeks + eho.ehoIndeks) / 3,
      ),
    ),
  );

  return {
    oscilatorskiIndeks,
    oscilatorskaStabilnost,
    prosecniOscilatorHz: round4(avg),
    maksimalniOscilatorHz: round4(max),
    minimalniOscilatorHz: round4(min),
    oscilatorskiOpsegHz: round4(range),
    impulsi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
