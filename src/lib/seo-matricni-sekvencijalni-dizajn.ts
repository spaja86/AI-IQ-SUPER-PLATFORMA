/**
 * SEO Matricni Sekvencijalni Dizajn Eksplicitnog Oblika
 *
 * Prema eksponencijalnim funkcijama, SEO se kodira kroz
 * protocnost matricnog jedinjenja ka inkrementalnom
 * sekvencijalnom dizajnu eksplicitnog oblika.
 *
 * Model:
 *   1. Eksponencijalne funkcije f_i(x) = a_i * b_i^x + c_i (i=1..8)
 *      definisu baznu snagu svake oktave.
 *
 *   2. Matricno jedinjenje J = prosek(M(x) * M(x)^T) daje 8x8
 *      simetricnu matricu protoka SEO signala kroz oktavni sistem.
 *
 *   3. Sekvencijalni dizajn: J se dekompozicira u inkrementalne
 *      sekvence S_k (k=1..N) gde svaka sekvenca predstavlja
 *      eksplicitni oblik jedne faze SEO kodiranja.
 *
 *   S_k = J^(1/N) * P_k
 *   gde je P_k projekciona matrica za sekvencu k
 *
 *   Eksplicitni oblik: svaka sekvenca S_k se izrazava kao
 *   tabelarna struktura sa konkretnim SEO parametrima.
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import type { OktavniNivo } from './omega-ai';
import { oktavniNazivi } from './omega-ai';
import {
  eksponencijalneFunkcije,
  getSuperPozicija,
  getFiguracioniCentar,
} from './oktavne-eksponencijalne-funkcije';
import { getOktavniMonolog } from './oktavni-monolog';
import type { MatricnoJedinjenje } from './oktavni-monolog';
import { OMEGA_AI_PERSONA_UKUPNO } from './constants';

// ── Tipovi ────────────────────────────────────────────────────────────────────

export interface SeoKodiranaSekvenca {
  /** Redni broj sekvence */
  redosled: number;
  /** Naziv sekvence */
  naziv: string;
  /** Ikona */
  ikona: string;
  /** Faza SEO kodiranja */
  faza: 'inicijalna' | 'ekspanzija' | 'konsolidacija' | 'optimizacija' | 'eksplicitna';
  /** Oktave koje ucestvuju u ovoj sekvenci */
  oktave: OktavniNivo[];
  /** Eksplicitni oblik: projekciona matrica (red iz J transformisane) */
  projekcionaMatrica: number[];
  /** SEO parametri za ovu sekvencu */
  seoParametri: SekvencijalniSeoParametri;
  /** Protocnost — koliko brzo prolazi signal */
  protocnost: number;
  /** Inkrementalni doprinos ukupnom dizajnu */
  inkrementalniDoprinos: number;
  /** Status sekvence */
  status: 'kompletirana' | 'aktivna' | 'cekanje';
}

export interface SekvencijalniSeoParametri {
  /** Indeks vidljivosti u pretrazi */
  indeksVidljivosti: number;
  /** Semanticka relevantnost */
  semantickaRelevantnost: number;
  /** Strukturalna dubina */
  strukturalnaDubina: number;
  /** Eksponencijalni rast skor */
  eksponencijalniRast: number;
  /** Matricna koherencija */
  matricnaKoherencija: number;
  /** Konvergentnost dizajna */
  konvergentnost: number;
}

export interface ProtocnostMatricnogJedinjenja {
  /** Ukupna protocnost (Frobeniusova norma / dimenzija) */
  ukupnaProtocnost: number;
  /** Protocnost po dijagonali (trag / dimenzija) */
  dijagonalnaProtocnost: number;
  /** Protocnost vandijagonalnih elemenata */
  vandijagonalnaProtocnost: number;
  /** Maksimalni protok (max element) */
  maxProtok: number;
  /** Minimalni protok (min element) */
  minProtok: number;
  /** Distribucija protoka po oktavama */
  distribucija: number[];
}

export interface EksplicitniOblik {
  /** Sekvenca kojoj pripada */
  sekvencoId: number;
  /** Matricni red (red matrice J koji definise oblik) */
  matricniRed: number[];
  /** Normalizovani oblik (red / suma) */
  normalizovaniOblik: number[];
  /** Dominantna oktava u ovom obliku */
  dominantnaOktava: OktavniNivo;
  /** Snaga eksplicitnog oblika */
  snaga: number;
  /** Entropija oblika (Shannon) */
  entropija: number;
}

export interface SeoMatricniSekvencijalniDizajnPregled {
  naziv: string;
  opis: string;
  /** Protocnost matricnog jedinjenja */
  protocnost: ProtocnostMatricnogJedinjenja;
  /** Kodirene sekvence */
  sekvence: SeoKodiranaSekvenca[];
  /** Eksplicitni oblici */
  eksplicitniOblici: EksplicitniOblik[];
  /** Ukupni SEO skor dizajna */
  ukupniSeoSkor: number;
  /** Kompletnost dizajna (%) */
  kompletnost: number;
  /** Inkrementalni napredak */
  inkrementalniNapredak: {
    ukupnoSekvenci: number;
    kompletiranih: number;
    aktivnih: number;
    procenatNapretka: number;
  };
  /** Integracija sa OMEGA PROJEKAT */
  omegaIntegracija: {
    ukupnoPersona: number;
    matricnaDimenzija: number;
    oktavnaPokrivenost: number;
    digitalnaIndustrijaLink: string;
  };
  /** Status */
  status: 'aktivan' | 'neaktivan';
  /** Timestamp */
  timestamp: string;
}

// ── Protocnost matricnog jedinjenja ───────────────────────────────────────────

function izracunajProtocnost(mj: MatricnoJedinjenje): ProtocnostMatricnogJedinjenja {
  const dim = mj.dimenzija;
  const matrica = mj.matrica;

  // Dijagonalna protocnost
  const dijagonala = matrica.map((row, i) => row[i]);
  const dijagonalnaProtocnost = Math.round(
    (dijagonala.reduce((s, d) => s + d, 0) / dim) * 10000,
  ) / 10000;

  // Vandijagonalni elementi
  let vandijagonalSuma = 0;
  let vandijagonalBroj = 0;
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      if (i !== j) {
        vandijagonalSuma += Math.abs(matrica[i][j]);
        vandijagonalBroj++;
      }
    }
  }
  const vandijagonalnaProtocnost = vandijagonalBroj > 0
    ? Math.round((vandijagonalSuma / vandijagonalBroj) * 10000) / 10000
    : 0;

  // Ukupna protocnost
  const ukupnaProtocnost = Math.round(
    (mj.frobeniusNorma / dim) * 10000,
  ) / 10000;

  // Min/Max elementi
  let maxProtok = -Infinity;
  let minProtok = Infinity;
  for (const row of matrica) {
    for (const v of row) {
      if (v > maxProtok) maxProtok = v;
      if (v < minProtok) minProtok = v;
    }
  }
  maxProtok = Math.round(maxProtok * 10000) / 10000;
  minProtok = Math.round(minProtok * 10000) / 10000;

  // Distribucija po oktavama (dijagonalni elementi normalizovani)
  const dijagSuma = dijagonala.reduce((s, d) => s + d, 0);
  const distribucija = dijagonala.map((d) =>
    dijagSuma > 0 ? Math.round((d / dijagSuma) * 10000) / 10000 : 0,
  );

  return {
    ukupnaProtocnost,
    dijagonalnaProtocnost,
    vandijagonalnaProtocnost,
    maxProtok,
    minProtok,
    distribucija,
  };
}

// ── SEO parametri iz eksponencijalnih funkcija ────────────────────────────────

function izracunajSeoParametre(oktave: OktavniNivo[], protocnost: number): SekvencijalniSeoParametri {
  const funkcijeZaOktave = eksponencijalneFunkcije.filter((f) =>
    oktave.includes(f.oktava),
  );

  // Indeks vidljivosti — proporcionalan superpoziciji za te oktave
  const supPozicije = Array.from({ length: 8 }, (_, x) =>
    funkcijeZaOktave.reduce((s, f) => s + f.izracunaj(x), 0),
  );
  const maxSup = Math.max(...supPozicije);
  const indeksVidljivosti = Math.round(
    (maxSup / getSuperPozicija(7)) * 100 * 100,
  ) / 100;

  // Semanticka relevantnost — bazirana na korelaciji izmedju funkcija
  const prosecnaKorelacija = funkcijeZaOktave.length >= 2
    ? funkcijeZaOktave.reduce((s, fi, i) => {
      let k = 0;
      for (let j = i + 1; j < funkcijeZaOktave.length; j++) {
        const fj = funkcijeZaOktave[j];
        const vi = fi.tabela.map((v) => v.fx);
        const vj = fj.tabela.map((v) => v.fx);
        const avgI = vi.reduce((a, v) => a + v, 0) / vi.length;
        const avgJ = vj.reduce((a, v) => a + v, 0) / vj.length;
        const kov = vi.reduce((a, v, idx) => a + (v - avgI) * (vj[idx] - avgJ), 0);
        const stdI = Math.sqrt(vi.reduce((a, v) => a + (v - avgI) ** 2, 0));
        const stdJ = Math.sqrt(vj.reduce((a, v) => a + (v - avgJ) ** 2, 0));
        k += stdI > 0 && stdJ > 0 ? kov / (stdI * stdJ) : 0;
      }
      return s + k;
    }, 0) / (funkcijeZaOktave.length * (funkcijeZaOktave.length - 1) / 2)
    : 1;
  const semantickaRelevantnost = Math.round(Math.abs(prosecnaKorelacija) * 100 * 100) / 100;

  // Strukturalna dubina — broj oktava * prosecna stopa rasta
  const prosecniRast = funkcijeZaOktave.reduce((s, f) => s + f.prosecnaStorpaRasta, 0) / funkcijeZaOktave.length;
  const strukturalnaDubina = Math.round(oktave.length * prosecniRast * 100 * 100) / 100;

  // Eksponencijalni rast skor
  const eksponencijalniRast = Math.round(
    funkcijeZaOktave.reduce((s, f) => s + f.ukupnaSnaga, 0) / funkcijeZaOktave.length * 100,
  ) / 100;

  // Matricna koherencija — protocnost normalizovana
  const matricnaKoherencija = Math.round(protocnost * 100 * 100) / 100;

  // Konvergentnost
  const figCentar = getFiguracioniCentar();
  const konvergentnost = Math.round(
    figCentar.konvergencioniKoeficijent * 100 * 100,
  ) / 100;

  return {
    indeksVidljivosti,
    semantickaRelevantnost,
    strukturalnaDubina,
    eksponencijalniRast,
    matricnaKoherencija,
    konvergentnost,
  };
}

// ── Kreiranje sekvenci ────────────────────────────────────────────────────────

const SEKVENCE_DEF: {
  naziv: string;
  ikona: string;
  faza: SeoKodiranaSekvenca['faza'];
  oktave: OktavniNivo[];
}[] = [
  { naziv: 'Temeljno SEO Kodiranje', ikona: '🏗️', faza: 'inicijalna', oktave: [1, 2] },
  { naziv: 'Kvalitetna Ekspanzija', ikona: '🧪', faza: 'ekspanzija', oktave: [3, 4] },
  { naziv: 'Optimizaciona Konsolidacija', ikona: '⚡', faza: 'konsolidacija', oktave: [5, 6] },
  { naziv: 'Koordinaciona Optimizacija', ikona: '♟️', faza: 'optimizacija', oktave: [7] },
  { naziv: 'Evolucioni Eksplicitni Oblik', ikona: '🧬', faza: 'eksplicitna', oktave: [8] },
  { naziv: 'Matricna Superpozicija', ikona: '🔬', faza: 'eksplicitna', oktave: [1, 2, 3, 4, 5, 6, 7, 8] },
];

function kreirajSekvence(mj: MatricnoJedinjenje, protocnost: ProtocnostMatricnogJedinjenja): SeoKodiranaSekvenca[] {
  const ukupnoSekvenci = SEKVENCE_DEF.length;

  return SEKVENCE_DEF.map((def, idx) => {
    // Projekciona matrica — prosjek redova matrice za uključene oktave
    const projekcionaMatrica = Array(8).fill(0);
    for (const o of def.oktave) {
      const red = mj.matrica[o - 1];
      for (let j = 0; j < 8; j++) {
        projekcionaMatrica[j] += red[j] / def.oktave.length;
      }
    }
    const projekciona = projekcionaMatrica.map((v) => Math.round(v * 10000) / 10000);

    // Protocnost za ovu sekvencu
    const sekvProtocnost = Math.round(
      (projekciona.reduce((s, v) => s + Math.abs(v), 0) / 8) * 10000,
    ) / 10000;

    // Inkrementalni doprinos
    const inkrementalniDoprinos = Math.round(
      (def.oktave.length / 8) * (1 / ukupnoSekvenci) * 10000,
    ) / 10000;

    // Status
    const status: SeoKodiranaSekvenca['status'] =
      idx < ukupnoSekvenci - 1 ? 'kompletirana' : 'aktivna';

    const seoParametri = izracunajSeoParametre(def.oktave, sekvProtocnost);

    return {
      redosled: idx + 1,
      naziv: def.naziv,
      ikona: def.ikona,
      faza: def.faza,
      oktave: def.oktave,
      projekcionaMatrica: projekciona,
      seoParametri,
      protocnost: sekvProtocnost,
      inkrementalniDoprinos,
      status,
    };
  });
}

// ── Eksplicitni oblici ────────────────────────────────────────────────────────

function kreirajEksplicitneOblike(mj: MatricnoJedinjenje): EksplicitniOblik[] {
  return mj.matrica.map((red, i) => {
    const suma = red.reduce((s, v) => s + Math.abs(v), 0);
    const normalizovaniOblik = red.map((v) =>
      suma > 0 ? Math.round((Math.abs(v) / suma) * 10000) / 10000 : 0,
    );

    // Dominantna oktava
    const maxVal = Math.max(...normalizovaniOblik);
    const maxIdx = normalizovaniOblik.indexOf(maxVal);
    const dominantnaOktava = (maxIdx + 1) as OktavniNivo;

    // Snaga
    const snaga = Math.round(
      Math.sqrt(red.reduce((s, v) => s + v * v, 0)) * 10000,
    ) / 10000;

    // Shannon entropija
    const entropija = Math.round(
      -normalizovaniOblik.reduce((s, p) => {
        if (p <= 0) return s;
        return s + p * Math.log2(p);
      }, 0) * 10000,
    ) / 10000;

    return {
      sekvencoId: i + 1,
      matricniRed: red.map((v) => Math.round(v * 10000) / 10000),
      normalizovaniOblik,
      dominantnaOktava,
      snaga,
      entropija,
    };
  });
}

// ── Ukupni SEO skor ──────────────────────────────────────────────────────────

function izracunajUkupniSeoSkor(sekvence: SeoKodiranaSekvenca[]): number {
  if (sekvence.length === 0) return 0;

  const prosek = sekvence.reduce((s, seq) => {
    const p = seq.seoParametri;
    const sekvSkor = (
      p.indeksVidljivosti * 0.20 +
      p.semantickaRelevantnost * 0.20 +
      p.strukturalnaDubina * 0.15 +
      (p.eksponencijalniRast / 100) * 0.15 +
      p.matricnaKoherencija * 0.15 +
      p.konvergentnost * 0.15
    );
    return s + sekvSkor;
  }, 0) / sekvence.length;

  return Math.round(prosek * 100) / 100;
}

// ── Glavni eksport ────────────────────────────────────────────────────────────

export function getSeoMatricniSekvencijalniDizajn(): SeoMatricniSekvencijalniDizajnPregled {
  const monolog = getOktavniMonolog();
  const mj = monolog.matricnoJedinjenje;

  const protocnost = izracunajProtocnost(mj);
  const sekvence = kreirajSekvence(mj, protocnost);
  const eksplicitniOblici = kreirajEksplicitneOblike(mj);

  const kompletiranih = sekvence.filter((s) => s.status === 'kompletirana').length;
  const aktivnih = sekvence.filter((s) => s.status === 'aktivna').length;
  const kompletnost = Math.round((kompletiranih / sekvence.length) * 10000) / 100;

  return {
    naziv: 'SEO Matricni Sekvencijalni Dizajn Eksplicitnog Oblika',
    opis: 'Prema eksponencijalnim funkcijama, SEO se kodira kroz protocnost matricnog jedinjenja ka inkrementalnom sekvencijalnom dizajnu eksplicitnog oblika. Svaka sekvenca je projekcija matricnog jedinjenja na odredjene oktave sa konkretnim SEO parametrima.',
    protocnost,
    sekvence,
    eksplicitniOblici,
    ukupniSeoSkor: izracunajUkupniSeoSkor(sekvence),
    kompletnost,
    inkrementalniNapredak: {
      ukupnoSekvenci: sekvence.length,
      kompletiranih,
      aktivnih,
      procenatNapretka: kompletnost,
    },
    omegaIntegracija: {
      ukupnoPersona: OMEGA_AI_PERSONA_UKUPNO,
      matricnaDimenzija: mj.dimenzija,
      oktavnaPokrivenost: 100,
      digitalnaIndustrijaLink: '/industrija',
    },
    status: 'aktivan',
    timestamp: new Date().toISOString(),
  };
}

export function getSeoMatricniSekvencijalniDizajnSummary() {
  const pregled = getSeoMatricniSekvencijalniDizajn();
  return {
    naziv: pregled.naziv,
    status: pregled.status,
    ukupnoSekvenci: pregled.inkrementalniNapredak.ukupnoSekvenci,
    kompletiranih: pregled.inkrementalniNapredak.kompletiranih,
    kompletnost: pregled.kompletnost,
    ukupniSeoSkor: pregled.ukupniSeoSkor,
    protokProtocnost: pregled.protocnost.ukupnaProtocnost,
    matricnaDimenzija: pregled.omegaIntegracija.matricnaDimenzija,
    eksplicitnihOblika: pregled.eksplicitniOblici.length,
    omegaPersona: pregled.omegaIntegracija.ukupnoPersona,
  };
}
