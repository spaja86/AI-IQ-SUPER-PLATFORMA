/**
 * 🌊 LAUREATSKI TALAS
 *
 * Talasna matrica laureatskog centra izvedena iz LAUREATSKOG SIGNALA i
 * LAUREATSKOG TAKTA. Modul transformiše signalne impulse u talasne čvorove i
 * meri koherentnost kroz talasni indeks.
 *
 * Model:
 *   frekvencija(t) = impulsHz × (0.85 + faza × 0.3)
 *   faza = (metar + amplituda) mod 2
 *   talasnaStabilnost = 1 - standardnaDevijacija(normalizovanihFrekvencija)
 *   talasniIndeks = (talasnaStabilnost + signalniIndeks + taktniIndeks) / 3
 *
 * Autofinish #1239
 */

import { buildLaureatskiSignal } from './laureatski-signal';
import { buildLaureatskiTakt } from './laureatski-takt';

export interface TalasniCvor {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  amplituda: number;
  faza: number;
  frekvencijaHz: number;
  normalizovano: number;
}

export interface LaureatskiTalasRezultat {
  talasniIndeks: number;
  talasnaStabilnost: number;
  prosecnaFrekvencijaHz: number;
  maksimalnaFrekvencijaHz: number;
  minimalnaFrekvencijaHz: number;
  talasniOpsegHz: number;
  cvorovi: TalasniCvor[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiTalas(userId: string): LaureatskiTalasRezultat {
  const signal = buildLaureatskiSignal(userId);
  const takt = buildLaureatskiTakt(userId);
  const cvorovi: TalasniCvor[] = [];

  for (let i = 0; i < signal.impulsi.length; i++) {
    const impuls = signal.impulsi[i];
    const segment = takt.segmenti[i] ?? takt.segmenti[0];
    const amplituda = round4((impuls.amplituda + segment.naglasak) / (1 + segment.naglasak));
    const faza = round4((segment.metar + amplituda) % 2);
    const frekvencijaHz = round4(impuls.impulsHz * (0.85 + faza * 0.3));

    cvorovi.push({
      t: impuls.t,
      sloj: impuls.sloj,
      harmonik: impuls.harmonik,
      metar: impuls.metar,
      amplituda,
      faza,
      frekvencijaHz,
      normalizovano: 0,
    });
  }

  const vrednosti = cvorovi.map((c) => c.frekvencijaHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const c of cvorovi) {
    c.normalizovano = range > 0 ? round4((c.frekvencijaHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const varijansa = cvorovi.reduce((sum, c) => sum + Math.pow(c.normalizovano - 0.5, 2), 0) / cvorovi.length;
  const std = Math.sqrt(varijansa);
  const talasnaStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const talasniIndeks = Math.max(
    0,
    Math.min(
      1,
      round4((talasnaStabilnost + signal.signalniIndeks + takt.taktniIndeks) / 3),
    ),
  );

  return {
    talasniIndeks,
    talasnaStabilnost,
    prosecnaFrekvencijaHz: round4(avg),
    maksimalnaFrekvencijaHz: round4(max),
    minimalnaFrekvencijaHz: round4(min),
    talasniOpsegHz: round4(range),
    cvorovi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
