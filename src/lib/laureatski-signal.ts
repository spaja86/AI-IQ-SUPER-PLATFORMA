/**
 * 📡 LAUREATSKI SIGNAL
 *
 * Signalna matrica laureatskog centra izvedena iz LAUREATSKOG TAKTA i
 * LAUREATSKOG RITMA. Modul pretvara taktne segmente u signalne impulse i
 * meri koherentnost signala kroz signalni indeks.
 *
 * Model:
 *   impuls(t) = segmentBpm × (1 + naglasak) × sin(metar × π)
 *   signalStabilnost = 1 - standardnaDevijacija(normalizovanihImpulsa)
 *   signalniIndeks = (signalStabilnost + taktniIndeks + metronomskiIndeks) / 3
 *
 * Autofinish #1238
 */

import { buildLaureatskiTakt } from './laureatski-takt';
import { buildLaureatskiRitam } from './laureatski-ritam';

export interface SignalImpuls {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  impulsHz: number;
  amplituda: number;
  normalizovano: number;
}

export interface LaureatskiSignalRezultat {
  signalniIndeks: number;
  signalStabilnost: number;
  prosecniImpulsHz: number;
  maksimalniImpulsHz: number;
  minimalniImpulsHz: number;
  signalOpsegHz: number;
  impulsi: SignalImpuls[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiSignal(userId: string): LaureatskiSignalRezultat {
  const takt = buildLaureatskiTakt(userId);
  const ritam = buildLaureatskiRitam(userId);
  const impulsi: SignalImpuls[] = [];

  for (let i = 0; i < takt.segmenti.length; i++) {
    const seg = takt.segmenti[i];
    const faza = ritam.faze[i] ?? ritam.faze[0];
    const sinFaktor = Math.abs(Math.sin(seg.metar * Math.PI));
    const impulsHz = round4(seg.segmentBpm * (1 + seg.naglasak) * (0.7 + sinFaktor * 0.3) / 60);
    const amplituda = round4((faza.akcenat + seg.naglasak) / (1 + faza.akcenat));

    impulsi.push({
      t: seg.t,
      sloj: seg.sloj,
      harmonik: seg.harmonik,
      metar: seg.metar,
      impulsHz,
      amplituda,
      normalizovano: 0,
    });
  }

  const vrednosti = impulsi.map((s) => s.impulsHz);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const s of impulsi) {
    s.normalizovano = range > 0 ? round4((s.impulsHz - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const varijansa = impulsi.reduce((sum, s) => sum + Math.pow(s.normalizovano - 0.5, 2), 0) / impulsi.length;
  const std = Math.sqrt(varijansa);
  const signalStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const signalniIndeks = Math.max(
    0,
    Math.min(
      1,
      round4((signalStabilnost + takt.taktniIndeks + ritam.metronomskiIndeks) / 3),
    ),
  );

  return {
    signalniIndeks,
    signalStabilnost,
    prosecniImpulsHz: round4(avg),
    maksimalniImpulsHz: round4(max),
    minimalniImpulsHz: round4(min),
    signalOpsegHz: round4(range),
    impulsi,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
