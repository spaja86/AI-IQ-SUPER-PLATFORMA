/**
 * Eksponencijalne funkcije oktavnog sistema
 *
 * Svaka oktava (1-8) ima eksponencijalnu funkciju koja modeluje
 * rast kapaciteta, snage i kompleksnosti persona u toj oktavi.
 *
 * f(x) = a * b^x + c
 *
 * gde je:
 *   a — amplituda (skala oktave)
 *   b — baza eksponenta (faktor rasta)
 *   x — ulazna vrednost (vreme, iteracija, parametar)
 *   c — offset (bazni kapacitet)
 */

import type { OktavniNivo } from './omega-ai';
import { oktavniNazivi, getPersonePoOktavi, omegaPersone } from './omega-ai';

// ── Tipovi ────────────────────────────────────────────────────────────────────

export interface EksponencijalnaFunkcija {
  oktava: OktavniNivo;
  naziv: string;
  opis: string;
  ikona: string;
  amplituda: number;
  baza: number;
  offset: number;
  /** f(x) = amplituda * baza^x + offset */
  izracunaj: (x: number) => number;
  /** f'(x) = amplituda * ln(baza) * baza^x — izvod */
  izvod: (x: number) => number;
  /** integral F(x) = amplituda * baza^x / ln(baza) + offset*x — neodredeni integral */
  integral: (x: number) => number;
  /** Inverz: x = log_b((y - offset) / amplituda) */
  inverz: (y: number) => number | null;
  /** Vrednosti za x = 0..7 */
  tabela: EksponencijalnaVrednost[];
  /** Ukupna snaga (suma svih vrednosti tabele) */
  ukupnaSnaga: number;
  /** Prosečna stopa rasta */
  prosecnaStorpaRasta: number;
  /** Broj persona u oktavi */
  brojPersona: number;
}

export interface EksponencijalnaVrednost {
  x: number;
  fx: number;
  izvod: number;
  integral: number;
  rastojanjeOdPrethog: number;
}

export interface OktavniSistemPregled {
  ukupnoOktava: number;
  ukupnoFunkcija: number;
  ukupnoPersona: number;
  ukupnaSnaga: number;
  prosecnaSnaga: number;
  maksimalnaSnaga: { oktava: OktavniNivo; snaga: number };
  minimalnaSnaga: { oktava: OktavniNivo; snaga: number };
  globalniRastFaktor: number;
  superPozicija: number[];
  korelacionaMatrica: number[][];
}

// ── Parametri po oktavama ─────────────────────────────────────────────────────

const PARAMETRI: Record<OktavniNivo, { amplituda: number; baza: number; offset: number; ikona: string; opis: string }> = {
  1: { amplituda: 1.0, baza: 2.0, offset: 10, ikona: '🏗️', opis: 'Temeljni eksponencijalni rast — strukturalna osnova sistema' },
  2: { amplituda: 1.5, baza: 2.2, offset: 15, ikona: '🛡️', opis: 'Zastitni eksponencijalni rast — bezbednosni kapacitet raste strmo' },
  3: { amplituda: 1.2, baza: 2.5, offset: 12, ikona: '🧪', opis: 'Kvalitetni eksponencijalni rast — pokrivenost testova raste eksponencijalno' },
  4: { amplituda: 2.0, baza: 2.8, offset: 20, ikona: '🎨', opis: 'Kreativni eksponencijalni rast — kreativni kapacitet eksplodira' },
  5: { amplituda: 1.8, baza: 3.0, offset: 18, ikona: '⚡', opis: 'Optimizacioni eksponencijalni rast — performanse rastu ubrzano' },
  6: { amplituda: 2.5, baza: 3.2, offset: 25, ikona: '🔬', opis: 'Inteligentni eksponencijalni rast — analiticki kapacitet se udvostručava brzo' },
  7: { amplituda: 3.0, baza: 3.5, offset: 30, ikona: '♟️', opis: 'Koordinacioni eksponencijalni rast — upravljanje kompleksnošcu' },
  8: { amplituda: 4.0, baza: 4.0, offset: 40, ikona: '🧬', opis: 'Evolucioni eksponencijalni rast — najbrzi rast, vizija buducnosti' },
};

// ── Kreiranje funkcija ────────────────────────────────────────────────────────

function kreirajFunkciju(oktava: OktavniNivo): EksponencijalnaFunkcija {
  const p = PARAMETRI[oktava];
  const naziv = `Eksponencijalna f${oktava}(x) — ${oktavniNazivi[oktava]}`;
  const brojPersona = getPersonePoOktavi(oktava).length;

  const izracunaj = (x: number): number => p.amplituda * Math.pow(p.baza, x) + p.offset;
  const izvod = (x: number): number => p.amplituda * Math.log(p.baza) * Math.pow(p.baza, x);
  const integral = (x: number): number => p.amplituda * Math.pow(p.baza, x) / Math.log(p.baza) + p.offset * x;
  const inverz = (y: number): number | null => {
    const unutrasnji = (y - p.offset) / p.amplituda;
    if (unutrasnji <= 0) return null;
    return Math.log(unutrasnji) / Math.log(p.baza);
  };

  const tabela: EksponencijalnaVrednost[] = [];
  for (let x = 0; x <= 7; x++) {
    const fx = izracunaj(x);
    const prethodni = x > 0 ? izracunaj(x - 1) : fx;
    tabela.push({
      x,
      fx: Math.round(fx * 1000) / 1000,
      izvod: Math.round(izvod(x) * 1000) / 1000,
      integral: Math.round(integral(x) * 1000) / 1000,
      rastojanjeOdPrethog: Math.round((fx - prethodni) * 1000) / 1000,
    });
  }

  const ukupnaSnaga = tabela.reduce((sum, v) => sum + v.fx, 0);
  const stopeRasta = tabela.slice(1).map((v, i) => (v.fx - tabela[i].fx) / tabela[i].fx);
  const prosecnaStorpaRasta = stopeRasta.length > 0
    ? Math.round((stopeRasta.reduce((s, r) => s + r, 0) / stopeRasta.length) * 10000) / 10000
    : 0;

  return {
    oktava,
    naziv,
    opis: p.opis,
    ikona: p.ikona,
    amplituda: p.amplituda,
    baza: p.baza,
    offset: p.offset,
    izracunaj,
    izvod,
    integral,
    inverz,
    tabela,
    ukupnaSnaga: Math.round(ukupnaSnaga * 100) / 100,
    prosecnaStorpaRasta,
    brojPersona,
  };
}

// ── Eksportovane funkcije i podaci ────────────────────────────────────────────

export const eksponencijalneFunkcije: EksponencijalnaFunkcija[] = (
  [1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]
).map(kreirajFunkciju);

export function getFunkcijaZaOktavu(oktava: OktavniNivo): EksponencijalnaFunkcija {
  return eksponencijalneFunkcije[oktava - 1];
}

export function getSuperPozicija(x: number): number {
  return eksponencijalneFunkcije.reduce((sum, f) => sum + f.izracunaj(x), 0);
}

export function getSuperPozicijaNiz(): number[] {
  return Array.from({ length: 8 }, (_, i) => Math.round(getSuperPozicija(i) * 100) / 100);
}

export function getKorelacionaMatrica(): number[][] {
  return eksponencijalneFunkcije.map((fi) =>
    eksponencijalneFunkcije.map((fj) => {
      const vrednostiI = fi.tabela.map((v) => v.fx);
      const vrednostiJ = fj.tabela.map((v) => v.fx);
      const avgI = vrednostiI.reduce((s, v) => s + v, 0) / vrednostiI.length;
      const avgJ = vrednostiJ.reduce((s, v) => s + v, 0) / vrednostiJ.length;
      const kovNumer = vrednostiI.reduce((s, v, k) => s + (v - avgI) * (vrednostiJ[k] - avgJ), 0);
      const stdI = Math.sqrt(vrednostiI.reduce((s, v) => s + (v - avgI) ** 2, 0));
      const stdJ = Math.sqrt(vrednostiJ.reduce((s, v) => s + (v - avgJ) ** 2, 0));
      const korelacija = stdI > 0 && stdJ > 0 ? kovNumer / (stdI * stdJ) : 0;
      return Math.round(korelacija * 10000) / 10000;
    }),
  );
}

// ── Figuracioni Centar ─────────────────────────────────────────────────────────

/**
 * Figuracioni centar eksponencijalnog objekta u funkcionalnim oktavama.
 *
 * Centar je matematicka tacka konvergencije svih 8 eksponencijalnih
 * funkcija — centroid, fokalna snaga, figuracione ose i harmonicki
 * odnosi izmedju oktava.
 *
 * Eksponencialni objekat = unija svih f_i(x) za i=1..8
 * Figuracioni centar = (x_c, y_c) gde je x_c tezisni centar,
 * a y_c prosecna vrednost svih funkcija u tom centru.
 */

export interface FiguracionaOsa {
  oktavaIzvor: OktavniNivo;
  oktavaCilj: OktavniNivo;
  presecnaVrednostX: number;
  presecnaVrednostY: number;
  ugaoNagiba: number;
  harmonickiOdnos: number;
  tip: 'primarna' | 'sekundarna' | 'tercijarna';
}

export interface FiguracioniSloj {
  oktava: OktavniNivo;
  naziv: string;
  ikona: string;
  figuracionaSnaga: number;
  udaljenostOdCentra: number;
  fazniPomak: number;
  doprinos: number;
}

export interface FiguraciooniCentar {
  /** Centroid X — tezisna tacka svih funkcija po X osi */
  centroidX: number;
  /** Centroid Y — tezisna vrednost svih funkcija u centroidu */
  centroidY: number;
  /** Fokalna snaga — koncentrisana snaga centra */
  fokalnaSnaga: number;
  /** Harmonicki indeks — mera harmonije izmedju oktava */
  harmonickiIndeks: number;
  /** Konvergencioni koeficijent — mera konvergencije ka centru */
  konvergencioniKoeficijent: number;
  /** Figuracione ose — linije izmedju parova oktava kroz centar */
  figuracioneOse: FiguracionaOsa[];
  /** Slojevi — doprinos svake oktave figuracionom centru */
  slojevi: FiguracioniSloj[];
  /** Eksponencialni objekat — objedinjena metrika */
  eksponencijalniObjekat: {
    ukupnaDivergencija: number;
    ukupnaKonvergencija: number;
    rasponSnage: { min: number; max: number; raspon: number };
    funkcionalnaDubina: number;
    oktavnaGustina: number;
  };
  /** Status */
  status: 'aktivan' | 'neaktivan';
}

/**
 * Racuna centroid X — tezisni centar svih funkcija.
 * Koristi integralni pristup: x_c = sum(x_i * f(x_i)) / sum(f(x_i))
 */
function izracunajCentroidX(): number {
  let numerator = 0;
  let denominator = 0;
  for (let x = 0; x <= 7; x++) {
    const superpoz = eksponencijalneFunkcije.reduce((s, f) => s + f.izracunaj(x), 0);
    numerator += x * superpoz;
    denominator += superpoz;
  }
  return denominator > 0 ? Math.round((numerator / denominator) * 10000) / 10000 : 0;
}

/**
 * Racuna presecnu tacku dve eksponencijalne funkcije.
 * f1(x) = f2(x) => a1*b1^x + c1 = a2*b2^x + c2
 * Koristi numericku iteraciju (bisekcija) za nalazenje preseka.
 */
function nadjiPresek(f1: EksponencijalnaFunkcija, f2: EksponencijalnaFunkcija): { x: number; y: number } | null {
  let lo = -2, hi = 10;
  const razlika = (x: number) => f1.izracunaj(x) - f2.izracunaj(x);
  const r0 = razlika(lo);
  if (r0 === 0) return { x: lo, y: f1.izracunaj(lo) };

  // Bisekcija
  for (let iter = 0; iter < 60; iter++) {
    const mid = (lo + hi) / 2;
    const rMid = razlika(mid);
    if (Math.abs(rMid) < 0.001) {
      return { x: Math.round(mid * 10000) / 10000, y: Math.round(f1.izracunaj(mid) * 100) / 100 };
    }
    if (r0 * rMid < 0) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  // Ako nema preseka u opsegu, vrati najblizu tacku
  const mid = (lo + hi) / 2;
  return { x: Math.round(mid * 10000) / 10000, y: Math.round(f1.izracunaj(mid) * 100) / 100 };
}

export function getFiguracioniCentar(): FiguraciooniCentar {
  const centroidX = izracunajCentroidX();
  const centroidY = Math.round(
    eksponencijalneFunkcije.reduce((s, f) => s + f.izracunaj(centroidX), 0) / 8 * 100,
  ) / 100;

  // Fokalna snaga — suma svih funkcija u centroidu
  const fokalnaSnaga = Math.round(
    eksponencijalneFunkcije.reduce((s, f) => s + f.izracunaj(centroidX), 0) * 100,
  ) / 100;

  // Slojevi — doprinos svake oktave
  const vrednostiUCentroidu = eksponencijalneFunkcije.map((f) => f.izracunaj(centroidX));
  const slojevi: FiguracioniSloj[] = eksponencijalneFunkcije.map((f, i) => {
    const vrednost = vrednostiUCentroidu[i];
    const doprinos = Math.round((vrednost / fokalnaSnaga) * 10000) / 10000;
    const udaljenostOdCentra = Math.round(Math.abs(vrednost - centroidY) * 100) / 100;
    const fazniPomak = Math.round(((f.oktava - 1) / 7 * 2 * Math.PI) * 10000) / 10000;

    return {
      oktava: f.oktava,
      naziv: oktavniNazivi[f.oktava],
      ikona: f.ikona,
      figuracionaSnaga: Math.round(vrednost * 100) / 100,
      udaljenostOdCentra,
      fazniPomak,
      doprinos,
    };
  });

  // Figuracione ose — linije izmedju parova oktava
  const figuracioneOse: FiguracionaOsa[] = [];
  for (let i = 0; i < eksponencijalneFunkcije.length; i++) {
    for (let j = i + 1; j < eksponencijalneFunkcije.length; j++) {
      const fi = eksponencijalneFunkcije[i];
      const fj = eksponencijalneFunkcije[j];
      const presek = nadjiPresek(fi, fj);
      const razmak = Math.abs(fi.oktava - fj.oktava);
      const tip = razmak <= 2 ? 'primarna' : razmak <= 4 ? 'sekundarna' : 'tercijarna';
      const harmonickiOdnos = Math.round((fj.baza / fi.baza) * 10000) / 10000;
      const ugaoNagiba = presek
        ? Math.round(Math.atan2(presek.y - centroidY, presek.x - centroidX) * (180 / Math.PI) * 100) / 100
        : 0;

      figuracioneOse.push({
        oktavaIzvor: fi.oktava,
        oktavaCilj: fj.oktava,
        presecnaVrednostX: presek?.x ?? 0,
        presecnaVrednostY: presek?.y ?? 0,
        ugaoNagiba,
        harmonickiOdnos,
        tip,
      });
    }
  }

  // Harmonicki indeks — prosek svih harmonickih odnosa
  const harmonickiIndeks = figuracioneOse.length > 0
    ? Math.round(
      (figuracioneOse.reduce((s, o) => s + o.harmonickiOdnos, 0) / figuracioneOse.length) * 10000,
    ) / 10000
    : 0;

  // Konvergencioni koeficijent — koliko su funkcije blizu u centroidu
  const vUC = vrednostiUCentroidu;
  const avgUC = vUC.reduce((s, v) => s + v, 0) / vUC.length;
  const varijansa = vUC.reduce((s, v) => s + (v - avgUC) ** 2, 0) / vUC.length;
  const konvergencioniKoeficijent = avgUC > 0
    ? Math.round((1 - Math.sqrt(varijansa) / avgUC) * 10000) / 10000
    : 0;

  // Eksponencialni objekat
  const snage = eksponencijalneFunkcije.map((f) => f.ukupnaSnaga);
  const minSnaga = Math.min(...snage);
  const maxSnaga = Math.max(...snage);
  const ukupnaDivergencija = Math.round(
    eksponencijalneFunkcije.reduce((s, f, i) => {
      if (i === 0) return 0;
      return s + Math.abs(f.prosecnaStorpaRasta - eksponencijalneFunkcije[i - 1].prosecnaStorpaRasta);
    }, 0) * 10000,
  ) / 10000;
  const ukupnaKonvergencija = Math.round((1 - ukupnaDivergencija / 8) * 10000) / 10000;

  return {
    centroidX,
    centroidY,
    fokalnaSnaga,
    harmonickiIndeks,
    konvergencioniKoeficijent,
    figuracioneOse,
    slojevi,
    eksponencijalniObjekat: {
      ukupnaDivergencija,
      ukupnaKonvergencija,
      rasponSnage: { min: minSnaga, max: maxSnaga, raspon: Math.round((maxSnaga - minSnaga) * 100) / 100 },
      funkcionalnaDubina: 8,
      oktavnaGustina: Math.round((omegaPersone.length / 8) * 100) / 100,
    },
    status: 'aktivan',
  };
}

export function getOktavniSistemPregled(): OktavniSistemPregled {
  const snage = eksponencijalneFunkcije.map((f) => ({ oktava: f.oktava, snaga: f.ukupnaSnaga }));
  const ukupnaSnaga = snage.reduce((s, v) => s + v.snaga, 0);
  const maks = snage.reduce((m, v) => (v.snaga > m.snaga ? v : m));
  const min = snage.reduce((m, v) => (v.snaga < m.snaga ? v : m));

  return {
    ukupnoOktava: 8,
    ukupnoFunkcija: eksponencijalneFunkcije.length,
    ukupnoPersona: omegaPersone.length,
    ukupnaSnaga: Math.round(ukupnaSnaga * 100) / 100,
    prosecnaSnaga: Math.round((ukupnaSnaga / 8) * 100) / 100,
    maksimalnaSnaga: { oktava: maks.oktava, snaga: maks.snaga },
    minimalnaSnaga: { oktava: min.oktava, snaga: min.snaga },
    globalniRastFaktor: Math.round(
      eksponencijalneFunkcije.reduce((s, f) => s + f.prosecnaStorpaRasta, 0) / 8 * 10000,
    ) / 10000,
    superPozicija: getSuperPozicijaNiz(),
    korelacionaMatrica: getKorelacionaMatrica(),
  };
}
