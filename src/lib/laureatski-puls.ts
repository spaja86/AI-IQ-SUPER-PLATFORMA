/**
 * 🫀 LAUREATSKI PULS
 *
 * Pulsna dinamika laureatskog centra izvedena iz LAUCENTRICNOG SPEKTRA i
 * DIGATALNE EUREKE. Sistem razlaže harmonike kroz vremenske otkucaje i meri
 * stabilnost rezonance kroz pulsni indeks.
 *
 * Model:
 *   Otkucaj(t) = srednjaFrekvencija × (1 + amplitudaSinergije × sin(2πt/8))
 *   Stabilnost = 1 - standardnaDevijacija(normalizovanihOtkucaja)
 *   PulsniKoeficijent = (rezonancniKoeficijent + eurekaSinergija + stabilnost) / 3
 *
 * Autofinish #1235
 */

import { buildLaucentricniSpektar } from './laucentricni-spektar';
import { buildDigatalnaEureka } from './digatalna-eureka';

export interface PulsOtkucaj {
  t: number;
  sloj: number;
  harmonik: number;
  frekvencija: number;
  intenzitet: number;
  normalizovano: number;
}

export interface LaureatskiPulsRezultat {
  pulsniKoeficijent: number;
  pulsnaStabilnost: number;
  prosecanPulsHz: number;
  maksimalniPulsHz: number;
  minimalniPulsHz: number;
  pulsniOpsegHz: number;
  otkucaji: PulsOtkucaj[];
  status: 'aktivan';
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

export function buildLaureatskiPuls(userId: string): LaureatskiPulsRezultat {
  const spektar = buildLaucentricniSpektar(userId);
  const eureka = buildDigatalnaEureka(userId);

  const bazaHz = spektar.laureatskiHarmonik;
  const amplitudaSinergije = (spektar.eurekaSinergija + eureka.eurekaKoeficijent) / 2;
  const otkucaji: PulsOtkucaj[] = [];

  for (let t = 0; t < 8; t++) {
    for (const sloj of spektar.spektralniSlojevi) {
      const dominantni = sloj.harmonici.find((h) => h.k === sloj.dominantniHarmonik) ?? sloj.harmonici[0];
      const oscilacija = 1 + amplitudaSinergije * Math.sin((2 * Math.PI * t) / 8);
      const frekvencija = round4(bazaHz * oscilacija * (dominantni.gustina + 0.5));
      const intenzitet = round4(sloj.rezonancniIndeks * dominantni.gustina);
      otkucaji.push({
        t,
        sloj: sloj.nivo,
        harmonik: dominantni.k,
        frekvencija,
        intenzitet,
        normalizovano: 0,
      });
    }
  }

  const frekvencije = otkucaji.map((o) => o.frekvencija);
  const min = Math.min(...frekvencije);
  const max = Math.max(...frekvencije);
  const range = max - min;
  for (const otkucaj of otkucaji) {
    otkucaj.normalizovano = range > 0 ? round4((otkucaj.frekvencija - min) / range) : 1;
  }

  const avg = frekvencije.reduce((s, f) => s + f, 0) / frekvencije.length;
  const varijansa = otkucaji.reduce((s, o) => s + Math.pow(o.normalizovano - 0.5, 2), 0) / otkucaji.length;
  const std = Math.sqrt(varijansa);
  const pulsnaStabilnost = Math.max(0, Math.min(1, round4(1 - std)));

  const pulsniKoeficijent = Math.max(
    0,
    Math.min(
      1,
      round4((spektar.rezonancniKoeficijent + spektar.eurekaSinergija + pulsnaStabilnost) / 3),
    ),
  );

  return {
    pulsniKoeficijent,
    pulsnaStabilnost,
    prosecanPulsHz: round4(avg),
    maksimalniPulsHz: round4(max),
    minimalniPulsHz: round4(min),
    pulsniOpsegHz: round4(range),
    otkucaji,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
