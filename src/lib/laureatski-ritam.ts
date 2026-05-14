/**
 * 🥁 LAUREATSKI RITAM
 *
 * Ritmička matrica laureatskog centra izgrađena nad LAUREATSKIM PULSOM i
 * LAUCENTRICNIM SPEKTROM. Modul pretvara pulsne otkucaje u ritmičke faze i
 * meri koherentnost ritma kroz metronomski indeks.
 *
 * Model:
 *   faza = 2π × t / 8
 *   akcenat = frekvencija × (1 + intenzitet)
 *   metronomskiIndeks = (ritamStabilnost + pulsniKoeficijent + rezonancniKoeficijent) / 3
 *
 * Autofinish #1236
 */

import { buildLaureatskiPuls } from './laureatski-puls';
import { buildLaucentricniSpektar } from './laucentricni-spektar';

export interface RitamFaza {
  t: number;
  sloj: number;
  harmonik: number;
  fazaRad: number;
  akcenat: number;
  tempoBpm: number;
  normalizovano: number;
}

export interface LaureatskiRitamRezultat {
  metronomskiIndeks: number;
  ritamStabilnost: number;
  prosecniTempoBpm: number;
  maksimalniTempoBpm: number;
  minimalniTempoBpm: number;
  ritamOpsegBpm: number;
  faze: RitamFaza[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiRitam(userId: string): LaureatskiRitamRezultat {
  const puls = buildLaureatskiPuls(userId);
  const spektar = buildLaucentricniSpektar(userId);
  const faze: RitamFaza[] = [];

  const bazniTempo = puls.prosecanPulsHz * 60;

  for (const o of puls.otkucaji) {
    const sloj = spektar.spektralniSlojevi.find((s) => s.nivo === o.sloj);
    const rezonancniFaktor = sloj?.rezonancniIndeks ?? 0.5;
    const fazaRad = round4((2 * Math.PI * o.t) / 8);
    const akcenat = round4(o.frekvencija * (1 + o.intenzitet));
    const tempoBpm = round4(bazniTempo * (0.75 + o.normalizovano * 0.5) * (0.85 + rezonancniFaktor * 0.3));

    faze.push({
      t: o.t,
      sloj: o.sloj,
      harmonik: o.harmonik,
      fazaRad,
      akcenat,
      tempoBpm,
      normalizovano: 0,
    });
  }

  const tempi = faze.map((f) => f.tempoBpm);
  const min = Math.min(...tempi);
  const max = Math.max(...tempi);
  const range = max - min;
  for (const f of faze) {
    f.normalizovano = range > 0 ? round4((f.tempoBpm - min) / range) : 1;
  }

  const avg = tempi.reduce((s, t) => s + t, 0) / tempi.length;
  const varijansa = faze.reduce((s, f) => s + Math.pow(f.normalizovano - 0.5, 2), 0) / faze.length;
  const std = Math.sqrt(varijansa);
  const ritamStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const metronomskiIndeks = Math.max(
    0,
    Math.min(
      1,
      round4((ritamStabilnost + puls.pulsniKoeficijent + spektar.rezonancniKoeficijent) / 3),
    ),
  );

  return {
    metronomskiIndeks,
    ritamStabilnost,
    prosecniTempoBpm: round4(avg),
    maksimalniTempoBpm: round4(max),
    minimalniTempoBpm: round4(min),
    ritamOpsegBpm: round4(range),
    faze,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
