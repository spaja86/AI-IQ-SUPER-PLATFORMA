/**
 * 🎛️ LAUREATSKI REZONATOR
 *
 * Rezonatorska matrica laureatskog centra izvedena iz LAUREATSKOG EHA i
 * LAUREATSKOG ODJEKA. Modul mapira eho impulse u rezonatorske impulse i meri
 * koherentnost kroz rezonatorski indeks.
 *
 * Model:
 *   rezonatorHz = ehoHz × (0.9 + normalizovano × 0.24)
 *   rezonatorskaVeza = (povratnaSprega + rezonanca + normalizovano) / 3
 *   rezonatorskaStabilnost = 1 - std(rezonatorskaVeza)
 *   rezonatorskiIndeks = (rezonatorskaStabilnost + ehoIndeks + odjecniIndeks) / 3
 *
 * Autofinish #1242
 */

import { buildLaureatskiEho } from './laureatski-eho';
import { buildLaureatskiOdjek } from './laureatski-odjek';

export interface RezonatorImpuls {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  amplituda: number;
  faza: number;
  rezonatorHz: number;
  rezonatorskaVeza: number;
  normalizovano: number;
}

export interface LaureatskiRezonatorRezultat {
  rezonatorskiIndeks: number;
  rezonatorskaStabilnost: number;
  prosecniRezonatorHz: number;
  maksimalniRezonatorHz: number;
  minimalniRezonatorHz: number;
  rezonatorskiOpsegHz: number;
  impulsi: RezonatorImpuls[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiRezonator(userId: string): LaureatskiRezonatorRezultat {
  const eho = buildLaureatskiEho(userId);
  const odjek = buildLaureatskiOdjek(userId);
  const impulsi: RezonatorImpuls[] = [];

  for (let i = 0; i < eho.impulsi.length; i++) {
    const ehoImpuls = eho.impulsi[i];
    const odjekImpuls = odjek.impulsi[i] ?? odjek.impulsi[0];
    const rezonatorHz = round4(ehoImpuls.ehoHz * (0.9 + ehoImpuls.normalizovano * 0.24));
    const rezonatorskaVeza = Math.max(
      0,
      Math.min(
        1,
        round4((ehoImpuls.povratnaSprega + odjekImpuls.rezonanca + ehoImpuls.normalizovano) / 3),
      ),
    );

    impulsi.push({
      t: ehoImpuls.t,
      sloj: ehoImpuls.sloj,
      harmonik: ehoImpuls.harmonik,
      metar: ehoImpuls.metar,
      amplituda: ehoImpuls.amplituda,
      faza: ehoImpuls.faza,
      rezonatorHz,
      rezonatorskaVeza,
      normalizovano: 0,
    });
  }

  const vrednosti = impulsi.map((i) => i.rezonatorHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const i of impulsi) {
    i.normalizovano = range > 0 ? round4((i.rezonatorHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const srednjaVeza =
    impulsi.reduce((sum, i) => sum + i.rezonatorskaVeza, 0) / impulsi.length;
  const varijansa =
    impulsi.reduce((sum, i) => sum + Math.pow(i.rezonatorskaVeza - srednjaVeza, 2), 0) /
    impulsi.length;
  const std = Math.sqrt(varijansa);
  const rezonatorskaStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const rezonatorskiIndeks = Math.max(
    0,
    Math.min(
      1,
      round4(
        (rezonatorskaStabilnost + eho.ehoIndeks + odjek.odjecniIndeks) / 3,
      ),
    ),
  );

  return {
    rezonatorskiIndeks,
    rezonatorskaStabilnost,
    prosecniRezonatorHz: round4(avg),
    maksimalniRezonatorHz: round4(max),
    minimalniRezonatorHz: round4(min),
    rezonatorskiOpsegHz: round4(range),
    impulsi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
