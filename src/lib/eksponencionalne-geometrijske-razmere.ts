import type { DimenzijaNivo } from './dimenzije';
import { dimenzije } from './dimenzije';
import {
  eksponencijalneFunkcije,
  getOktavneRazmereParovi,
  getSuperPozicijaNiz,
} from './oktavne-eksponencijalne-funkcije';
import type { OktavniNivo } from './omega-ai';

const RAZMERA_DECIMALA = 6;
const MIN_DELILAC = 1e-9;
const MAX_RATIO = 1e12;

const SUPERSCRIPT_MAP: Record<string, string> = {
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

export interface OktavnaRazmeraPar {
  izvor: OktavniNivo;
  cilj: OktavniNivo;
  razmera: number;
  deltaRasta: number;
  sloj: 'primarna' | 'sekundarna' | 'tercijarna';
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
    parovi: OktavnaRazmeraPar[];
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

function safeRatio(a: number, b: number, validation: { invalid: number; clamped: number }): number {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    validation.invalid += 1;
    return 0;
  }
  const divisor = Math.abs(b) < MIN_DELILAC ? MIN_DELILAC : Math.abs(b);
  if (Math.abs(b) < MIN_DELILAC) validation.clamped += 1;
  const ratio = a / divisor;
  if (!Number.isFinite(ratio)) {
    validation.invalid += 1;
    return 0;
  }
  if (Math.abs(ratio) > MAX_RATIO) {
    validation.clamped += 1;
    return round(Math.sign(ratio) * MAX_RATIO);
  }
  return round(ratio);
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

function parseSnaga(snaga: string): number {
  const baseMatch = snaga.match(/10/);
  if (!baseMatch) {
    const direct = Number.parseFloat(snaga.replace(/[^\d.-]/g, ''));
    return Number.isFinite(direct) ? direct : 0;
  }

  const supers = snaga.match(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/);
  if (!supers) return 0;
  const expText = supers[0].split('').map((c) => SUPERSCRIPT_MAP[c] ?? '').join('');
  const exponent = Number.parseInt(expText, 10);
  if (!Number.isFinite(exponent)) return 0;
  return exponent;
}

function calcOktavnaRatioMatrica(validation: { invalid: number; clamped: number }) {
  return eksponencijalneFunkcije.map((izvor) =>
    eksponencijalneFunkcije.map((cilj) => safeRatio(cilj.ukupnaSnaga, izvor.ukupnaSnaga, validation)),
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
  const oktavniParovi: OktavnaRazmeraPar[] = paroviRaw.map((par) => ({
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
  for (let i = 1; i < dimenzije.length; i++) {
    const od = dimenzije[i - 1];
    const ka = dimenzije[i];
    const stepeniRazmera = safeRatio(ka.stepeniBaze, od.stepeniBaze, validation);
    const deltaStepeni = ka.stepeniBaze - od.stepeniBaze;
    const snagaRazmera = safeRatio(parseSnaga(ka.snaga), parseSnaga(od.snaga), validation);

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
