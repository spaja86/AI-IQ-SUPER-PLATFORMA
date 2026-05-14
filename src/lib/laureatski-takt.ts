/**
 * 🥁 LAUREATSKI TAKT
 *
 * Taktička matrica laureatskog centra izvedena iz LAUREATSKOG RITMA i
 * LAUREATSKOG PULSA. Modul grupiše ritmičke faze u precizne segmente takta i
 * meri koherentnost metra kroz taktni indeks.
 *
 * Model:
 *   segment(t) = tempoBpm × (1 + akcenatMetra)
 *   metarStabilnost = 1 - standardnaDevijacija(normalizovanihSegmenata)
 *   taktniIndeks = (metarStabilnost + metronomskiIndeks + pulsniKoeficijent) / 3
 *
 * Autofinish #1237
 */

import { buildLaureatskiRitam } from './laureatski-ritam';
import { buildLaureatskiPuls } from './laureatski-puls';

export interface TaktSegment {
  t: number;
  sloj: number;
  harmonik: number;
  metar: number;
  segmentBpm: number;
  naglasak: number;
  normalizovano: number;
}

export interface LaureatskiTaktRezultat {
  taktniIndeks: number;
  metarStabilnost: number;
  prosecniTaktBpm: number;
  maksimalniTaktBpm: number;
  minimalniTaktBpm: number;
  taktOpsegBpm: number;
  segmenti: TaktSegment[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiTakt(userId: string): LaureatskiTaktRezultat {
  const ritam = buildLaureatskiRitam(userId);
  const puls = buildLaureatskiPuls(userId);
  const segmenti: TaktSegment[] = [];

  for (let i = 0; i < ritam.faze.length; i++) {
    const faza = ritam.faze[i];
    const otkucaj = puls.otkucaji[i] ?? puls.otkucaji[0];
    const metar = round4((faza.fazaRad % (2 * Math.PI)) / Math.PI);
    const naglasak = round4((faza.akcenat + otkucaj.intenzitet) / (1 + faza.akcenat));
    const segmentBpm = round4(faza.tempoBpm * (0.8 + naglasak * 0.4));

    segmenti.push({
      t: faza.t,
      sloj: faza.sloj,
      harmonik: faza.harmonik,
      metar,
      segmentBpm,
      naglasak,
      normalizovano: 0,
    });
  }

  const vrednosti = segmenti.map((s) => s.segmentBpm);
  const min = Math.min(...vrednosti);
  const max = Math.max(...vrednosti);
  const range = max - min;
  for (const s of segmenti) {
    s.normalizovano = range > 0 ? round4((s.segmentBpm - min) / range) : 1;
  }

  const avg = vrednosti.reduce((sum, v) => sum + v, 0) / vrednosti.length;
  const varijansa = segmenti.reduce((sum, s) => sum + Math.pow(s.normalizovano - 0.5, 2), 0) / segmenti.length;
  const std = Math.sqrt(varijansa);
  const metarStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const taktniIndeks = Math.max(
    0,
    Math.min(
      1,
      round4((metarStabilnost + ritam.metronomskiIndeks + puls.pulsniKoeficijent) / 3),
    ),
  );

  return {
    taktniIndeks,
    metarStabilnost,
    prosecniTaktBpm: round4(avg),
    maksimalniTaktBpm: round4(max),
    minimalniTaktBpm: round4(min),
    taktOpsegBpm: round4(range),
    segmenti,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
