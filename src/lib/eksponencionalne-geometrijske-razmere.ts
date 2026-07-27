import type { DimenzijaNivo } from './dimenzije';
import { dimenzije } from './dimenzije';
import {
  eksponencijalneFunkcije,
  getOktavneRazmereParovi,
  type OktavnaRazmeraPar,
  getSuperPozicijaNiz,
} from './oktavne-eksponencijalne-funkcije';

const RAZMERA_DECIMALA = 6;
const MIN_DELILAC = 1e-9;
const MAX_RATIO = 1e12;

const SUPERSCRIPT_MAP: Record<string, string> = {
  '⁻': '-',
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
};

export type RazmeraStatusSignal = 'stabilno' | 'upozorenje' | 'kriticno';

export interface RazmeraPragovi {
  upozorenjeMin: number;
  upozorenjeMax: number;
  kriticnoMin: number;
  kriticnoMax: number;
}

export interface GeometrijskaOktavnaRazmeraPar extends OktavnaRazmeraPar {
  status: RazmeraStatusSignal;
}

export interface DimenzionalnaRazmeraPrelaz {
  od: DimenzijaNivo;
  ka: DimenzijaNivo;
  stepeniRazmera: number;
  deltaStepeni: number;
  snagaRazmera: number;
  status: RazmeraStatusSignal;
}

export interface RazmeraTrend {
  smer: 'rast' | 'pad' | 'stabilno';
  prosecanKorak: number;
}

export interface RazmeraValidacija {
  status: 'validno' | 'upozorenje' | 'nevalidno';
  invalidInputCount: number;
  clampedCount: number;
  finite: boolean;
}

export interface EksponencionalneGeometrijskeRazmere {
  scope: 'kombinovano';
  oktavniModel: '12-oktava';
  obavezniIzlazi: Array<'ratio-matrica' | 'globalni-indeks' | 'pragovi' | 'status-signali'>;
  oktavneRazmere: {
    brojOktava: number;
    ratioMatrica: number[][];
    parovi: GeometrijskaOktavnaRazmeraPar[];
    globalniIndeks: number;
    trend: RazmeraTrend;
    pragovi: RazmeraPragovi;
    statusSignali: RazmeraStatusSignal[];
  };
  dimenzionalneRazmere: {
    brojNivoa: number;
    prelazi: DimenzionalnaRazmeraPrelaz[];
    globalniIndeks: number;
    trend: RazmeraTrend;
    pragovi: RazmeraPragovi;
    statusSignali: RazmeraStatusSignal[];
  };
  agregati: {
    kombinovaniIndeks: number;
    dominantniDomen: 'oktave' | 'dimenzije' | 'izjednaceno';
  };
  validacija: RazmeraValidacija;
}

function round(n: number, d = RAZMERA_DECIMALA): number {
  const p = 10 ** d;
  return Math.round(n * p) / p;
}

interface ValidationDelta {
  value: number;
  invalid: number;
  /** Broj primenjenih clamp koraka (near-zero delilac i/ili max-ratio cap). */
  clamped: number;
}

function safeRatio(a: number, b: number): ValidationDelta {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return { value: 0, invalid: 1, clamped: 0 };
  }
  const bAbs = Math.abs(b);
  const bIsNearZero = bAbs < MIN_DELILAC;
  let clamped = bIsNearZero ? 1 : 0;
  const divisor = bIsNearZero ? MIN_DELILAC : bAbs;
  const ratio = a / divisor;
  if (!Number.isFinite(ratio)) {
    return { value: 0, invalid: 1, clamped };
  }
  if (Math.abs(ratio) > MAX_RATIO) {
    clamped += 1;
    return { value: round(Math.sign(ratio) * MAX_RATIO), invalid: 0, clamped };
  }
  return { value: round(ratio), invalid: 0, clamped };
}

function getRazmeraStatus(v: number, pragovi: RazmeraPragovi): RazmeraStatusSignal {
  if (v < pragovi.kriticnoMin || v > pragovi.kriticnoMax) return 'kriticno';
  if (v < pragovi.upozorenjeMin || v > pragovi.upozorenjeMax) return 'upozorenje';
  return 'stabilno';
}

function calcTrend(values: number[]): RazmeraTrend {
  if (values.length < 2) return { smer: 'stabilno', prosecanKorak: 0 };
  const deltas = values.slice(1).map((v, i) => v - values[i]);
  const avg = deltas.reduce((s, v) => s + v, 0) / deltas.length;
  const rounded = round(avg);
  return {
    smer: rounded > 0 ? 'rast' : rounded < 0 ? 'pad' : 'stabilno',
    prosecanKorak: rounded,
  };
}

function parseSnagaExponent(snaga: string): number {
  const baseMatch = snaga.match(/^10/);
  if (!baseMatch) {
    const direct = Number.parseFloat(snaga.replace(/[^\d.-]/g, ''));
    return Number.isFinite(direct) ? direct : 0;
  }

  const supers = snaga.match(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/);
  if (!supers) return 0;
  const expText = supers[0].split('').map((c) => SUPERSCRIPT_MAP[c] ?? '').join('');
  const exponent = Number.parseInt(expText, 10);
  if (!Number.isFinite(exponent)) return 0;
  const value = 10 ** exponent;
  return Number.isFinite(value) ? value : 0;
}

function calcOktavnaRatioMatrica(validation: { invalid: number; clamped: number }) {
  return eksponencijalneFunkcije.map((izvor, i) =>
    eksponencijalneFunkcije.map((cilj, j) => {
      if (i === j) return 1;
      const ratio = safeRatio(cilj.ukupnaSnaga, izvor.ukupnaSnaga);
      validation.invalid += ratio.invalid;
      validation.clamped += ratio.clamped;
      return ratio.value;
    }),
  );
}

export function getEksponencionalneGeometrijskeRazmere(): EksponencionalneGeometrijskeRazmere {
  const validation = { invalid: 0, clamped: 0 };
  const oktavniPragovi: RazmeraPragovi = {
    upozorenjeMin: 0.7,
    upozorenjeMax: 1.8,
    kriticnoMin: 0.4,
    kriticnoMax: 2.4,
  };
  const dimPragovi: RazmeraPragovi = {
    upozorenjeMin: 1.5,
    upozorenjeMax: 3.5,
    kriticnoMin: 1.1,
    kriticnoMax: 6.5,
  };

  const ratioMatrica = calcOktavnaRatioMatrica(validation);
  const paroviRaw = getOktavneRazmereParovi();
  const oktavniParovi: GeometrijskaOktavnaRazmeraPar[] = paroviRaw.map((par) => ({
    izvor: par.izvor,
    cilj: par.cilj,
    razmera: par.razmera,
    deltaRasta: par.deltaRasta,
    sloj: par.sloj,
    status: getRazmeraStatus(par.razmera, oktavniPragovi),
  }));

  const oktavniIndeks = round(
    oktavniParovi.length > 0
      ? oktavniParovi.reduce((s, p) => s + p.razmera, 0) / oktavniParovi.length
      : 0,
  );

  const stepValues = getSuperPozicijaNiz();
  const oktavniTrend = calcTrend(stepValues);

  const dimPrelazi: DimenzionalnaRazmeraPrelaz[] = [];
  const exponentCache = new Map<DimenzijaNivo, number>();
  for (const d of dimenzije) {
    exponentCache.set(d.nivo, parseSnagaExponent(d.snaga));
  }
  for (let i = 1; i < dimenzije.length; i++) {
    const od = dimenzije[i - 1];
    const ka = dimenzije[i];
    const stepeniRatio = safeRatio(ka.stepeniBaze, od.stepeniBaze);
    validation.invalid += stepeniRatio.invalid;
    validation.clamped += stepeniRatio.clamped;
    const deltaStepeni = ka.stepeniBaze - od.stepeniBaze;
    const snagaRatio = safeRatio(
      exponentCache.get(ka.nivo) ?? 0,
      exponentCache.get(od.nivo) ?? 0,
    );
    validation.invalid += snagaRatio.invalid;
    validation.clamped += snagaRatio.clamped;
    const stepeniRazmera = stepeniRatio.value;
    const snagaRazmera = snagaRatio.value;

    dimPrelazi.push({
      od: od.nivo,
      ka: ka.nivo,
      stepeniRazmera,
      deltaStepeni,
      snagaRazmera,
      status: getRazmeraStatus(stepeniRazmera, dimPragovi),
    });
  }

  const dimIndeks = round(
    dimPrelazi.length > 0
      ? dimPrelazi.reduce((s, p) => s + p.stepeniRazmera, 0) / dimPrelazi.length
      : 0,
  );
  const dimTrend = calcTrend(dimPrelazi.map((p) => p.stepeniRazmera));

  const kombinovaniIndeks = round((oktavniIndeks + dimIndeks) / 2);
  const dominantniDomen = oktavniIndeks === dimIndeks
    ? 'izjednaceno'
    : oktavniIndeks > dimIndeks
      ? 'oktave'
      : 'dimenzije';

  const oktavniStatusSignali = oktavniParovi.map((p) => p.status);
  const dimStatusSignali = dimPrelazi.map((p) => p.status);
  const finite = Number.isFinite(oktavniIndeks) && Number.isFinite(dimIndeks) && Number.isFinite(kombinovaniIndeks);

  const validacija: RazmeraValidacija = {
    status: !finite || validation.invalid > 0 ? 'nevalidno' : validation.clamped > 0 ? 'upozorenje' : 'validno',
    invalidInputCount: validation.invalid,
    clampedCount: validation.clamped,
    finite,
  };

  return {
    scope: 'kombinovano',
    oktavniModel: '12-oktava',
    obavezniIzlazi: ['ratio-matrica', 'globalni-indeks', 'pragovi', 'status-signali'],
    oktavneRazmere: {
      brojOktava: eksponencijalneFunkcije.length,
      ratioMatrica,
      parovi: oktavniParovi,
      globalniIndeks: oktavniIndeks,
      trend: oktavniTrend,
      pragovi: oktavniPragovi,
      statusSignali: oktavniStatusSignali,
    },
    dimenzionalneRazmere: {
      brojNivoa: dimenzije.length,
      prelazi: dimPrelazi,
      globalniIndeks: dimIndeks,
      trend: dimTrend,
      pragovi: dimPragovi,
      statusSignali: dimStatusSignali,
    },
    agregati: {
      kombinovaniIndeks,
      dominantniDomen,
    },
    validacija,
  };
}
