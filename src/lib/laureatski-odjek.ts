/**
 * 🔊 LAUREATSKI ODJEK
 *
 * Odječna matrica laureatskog centra izvedena iz LAUREATSKOG TALASA i
 * LAUREATSKOG SIGNALA. Modul mapira talasne čvorove u odjeke i meri
 * koherentnost kroz odjecni indeks.
 *
 * Model:
 *   odjekHz = frekvencijaHz × (0.9 + normalizovano × 0.25)
 *   rezonanca = (faza + amplituda + normalizovano) / 3
 *   odjecnaStabilnost = 1 - std(rezonanca)
 *   odjecniIndeks = (odjecnaStabilnost + talasniIndeks + signalniIndeks) / 3
 *
 * Autofinish #1240
 */

import { buildLaureatskiTalas } from './laureatski-talas';
import { buildLaureatskiSignal } from './laureatski-signal';

export interface OdjecniImpuls {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  amplituda: number;
  faza: number;
  odjekHz: number;
  rezonanca: number;
  normalizovano: number;
}

export interface LaureatskiOdjekRezultat {
  odjecniIndeks: number;
  odjecnaStabilnost: number;
  prosecniOdjekHz: number;
  maksimalniOdjekHz: number;
  minimalniOdjekHz: number;
  odjecniOpsegHz: number;
  impulsi: OdjecniImpuls[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiOdjek(userId: string): LaureatskiOdjekRezultat {
  const talas = buildLaureatskiTalas(userId);
  const signal = buildLaureatskiSignal(userId);
  const impulsi: OdjecniImpuls[] = [];

  for (let i = 0; i < talas.cvorovi.length; i++) {
    const cvor = talas.cvorovi[i];
    const signalImpuls = signal.impulsi[i] ?? signal.impulsi[0];
    const odjekHz = round4(cvor.frekvencijaHz * (0.9 + cvor.normalizovano * 0.25));
    const rezonanca = Math.max(
      0,
      Math.min(1, round4((cvor.faza + signalImpuls.amplituda + cvor.normalizovano) / 3)),
    );

    impulsi.push({
      t: cvor.t,
      sloj: cvor.sloj,
      harmonik: cvor.harmonik,
      metar: cvor.metar,
      amplituda: cvor.amplituda,
      faza: cvor.faza,
      odjekHz,
      rezonanca,
      normalizovano: 0,
    });
  }

  const vrednosti = impulsi.map((i) => i.odjekHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const i of impulsi) {
    i.normalizovano = range > 0 ? round4((i.odjekHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const srednjaRezonanca =
    impulsi.reduce((sum, i) => sum + i.rezonanca, 0) / impulsi.length;
  const varijansa =
    impulsi.reduce((sum, i) => sum + Math.pow(i.rezonanca - srednjaRezonanca, 2), 0) /
    impulsi.length;
  const std = Math.sqrt(varijansa);
  const odjecnaStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const odjecniIndeks = Math.max(
    0,
    Math.min(
      1,
      round4((odjecnaStabilnost + talas.talasniIndeks + signal.signalniIndeks) / 3),
    ),
  );

  return {
    odjecniIndeks,
    odjecnaStabilnost,
    prosecniOdjekHz: round4(avg),
    maksimalniOdjekHz: round4(max),
    minimalniOdjekHz: round4(min),
    odjecniOpsegHz: round4(range),
    impulsi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
