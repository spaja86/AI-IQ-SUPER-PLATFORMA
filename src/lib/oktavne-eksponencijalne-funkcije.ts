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
