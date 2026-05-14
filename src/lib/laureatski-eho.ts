/**
 * 📣 LAUREATSKI EHO
 *
 * Eho matrica laureatskog centra izvedena iz LAUREATSKOG ODJEKA i
 * LAUREATSKOG TALASA. Modul mapira odječne impulse u eho impulse i meri
 * koherentnost kroz eho indeks.
 *
 * Model:
 *   ehoHz = odjekHz × (0.88 + normalizovano × 0.28)
 *   povratnaSprega = (rezonanca + normalizovano + amplituda) / 3
 *   ehoStabilnost = 1 - std(povratnaSprega)
 *   ehoIndeks = (ehoStabilnost + odjecniIndeks + talasniIndeks) / 3
 *
 * Autofinish #1241
 */

import { buildLaureatskiOdjek } from './laureatski-odjek';
import { buildLaureatskiTalas } from './laureatski-talas';

export interface EhoImpuls {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  amplituda: number;
  faza: number;
  ehoHz: number;
  povratnaSprega: number;
  normalizovano: number;
}

export interface LaureatskiEhoRezultat {
  ehoIndeks: number;
  ehoStabilnost: number;
  prosecniEhoHz: number;
  maksimalniEhoHz: number;
  minimalniEhoHz: number;
  ehoOpsegHz: number;
  impulsi: EhoImpuls[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiEho(userId: string): LaureatskiEhoRezultat {
  const odjek = buildLaureatskiOdjek(userId);
  const talas = buildLaureatskiTalas(userId);
  const impulsi: EhoImpuls[] = [];

  for (let i = 0; i < odjek.impulsi.length; i++) {
    const impuls = odjek.impulsi[i];
    const cvor = talas.cvorovi[i] ?? talas.cvorovi[0];
    const ehoHz = round4(impuls.odjekHz * (0.88 + impuls.normalizovano * 0.28));
    const povratnaSprega = Math.max(
      0,
      Math.min(1, round4((impuls.rezonanca + cvor.normalizovano + impuls.amplituda) / 3)),
    );

    impulsi.push({
      t: impuls.t,
      sloj: impuls.sloj,
      harmonik: impuls.harmonik,
      metar: impuls.metar,
      amplituda: impuls.amplituda,
      faza: impuls.faza,
      ehoHz,
      povratnaSprega,
      normalizovano: 0,
    });
  }

  const vrednosti = impulsi.map((i) => i.ehoHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const i of impulsi) {
    i.normalizovano = range > 0 ? round4((i.ehoHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const srednjaSprega = impulsi.reduce((sum, i) => sum + i.povratnaSprega, 0) / impulsi.length;
  const varijansa =
    impulsi.reduce((sum, i) => sum + Math.pow(i.povratnaSprega - srednjaSprega, 2), 0) /
    impulsi.length;
  const std = Math.sqrt(varijansa);
  const ehoStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const ehoIndeks = Math.max(
    0,
    Math.min(
      1,
      round4((ehoStabilnost + odjek.odjecniIndeks + talas.talasniIndeks) / 3),
    ),
  );

  return {
    ehoIndeks,
    ehoStabilnost,
    prosecniEhoHz: round4(avg),
    maksimalniEhoHz: round4(max),
    minimalniEhoHz: round4(min),
    ehoOpsegHz: round4(range),
    impulsi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
