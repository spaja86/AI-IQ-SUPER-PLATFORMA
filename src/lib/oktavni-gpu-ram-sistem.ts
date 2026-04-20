/**
 * 🎮 Oktavni GPU/RAM Sistem — Ekvalaturni Galaksipozni Sektor u Matričnom Jedinjenju
 *
 * Oktavni sistem u rasponu ekvalaturnog galaksipoznog sektora u matričnom
 * jedinjenju izražen kroz grafičnu jedinicu GPU i RAM.
 *
 * Digitalni Kompjuter koristi veliki GPU (8.700.000 jezgara) i RAM (276.000 GB)
 * da bi igrice postigle što veći GPU učinak. Ovaj modul definiše kako se
 * svaka oktava (1-8) mapira na GPU/RAM raspodelu kroz galaksipozni sektor.
 *
 * Formule:
 *   GPU_oktava(n) = bazniGPU × galaksipozniFaktor(n) × matričniKoeficijent(n)
 *   RAM_oktava(n) = bazniRAM × ekvalaturniRaspon(n) × sektorskiMnožilac(n)
 *
 * Galaksipozni faktor: eksponencijalni rast kroz oktave
 * Matričini koeficijent: 8×8 matrično jedinjenje preslikano na GPU jezgra
 * Ekvalaturni raspon: ravnomerna temperacija raspodeljena po oktavama
 */

import type { OktavniNivo } from './omega-ai';
import { oktavniNazivi } from './omega-ai';

// ─── Konstante Digitalnog Kompjutera ─────────────────────────────────

/** SPAJA GPU — ukupno jezgara */
export const UKUPNO_GPU_JEZGARA = 8_700_000;

/** SPAJA RAM — ukupno GB */
export const UKUPNO_RAM_GB = 276_000;

/** Broj oktava u sistemu */
const BROJ_OKTAVA = 8;

// ─── Tipovi ──────────────────────────────────────────────────────────

export interface GalaksipozniSektor {
  oktava: OktavniNivo;
  naziv: string;
  ikona: string;
  /** Galaksipozni faktor — eksponencijalni rast kapaciteta po oktavi */
  galaksipozniFaktor: number;
  /** Matričini koeficijent — preslikavanje 8×8 matrice na GPU jezgra */
  matricniKoeficijent: number;
  /** Ekvalaturni raspon — ravnomerna temperacija za RAM raspodelu */
  ekvalaturniRaspon: number;
  /** Sektorski množilac — pojačanje unutar galaksipoznog sektora */
  sektorskiMnozilac: number;
}

export interface OktavnaGPURaspodela {
  oktava: OktavniNivo;
  naziv: string;
  ikona: string;
  /** Broj GPU jezgara dodeljenih ovoj oktavi */
  gpuJezgara: number;
  /** Procenat ukupnog GPU-a */
  gpuProcenat: number;
  /** RAM memorija dodeljena ovoj oktavi u GB */
  ramGB: number;
  /** Procenat ukupnog RAM-a */
  ramProcenat: number;
  /** Galaksipozni sektor parametri */
  sektor: GalaksipozniSektor;
  /** Matrično jedinjenje — proizvod GPU i RAM snage za igricu */
  matricnoJedinjenje: number;
  /** Opis uloge oktave u GPU/RAM sistemu */
  opis: string;
}

export interface MatricnoJedinjenje8x8 {
  /** 8×8 matrica interakcija između oktava (GPU × RAM sinergija) */
  matrica: number[][];
  /** Ukupna snaga matričnog jedinjenja */
  ukupnaSnaga: number;
  /** Dijagonalni elementi — samoodrživa snaga svake oktave */
  dijagonala: number[];
  /** Tragovi matrice — suma dijagonale */
  trag: number;
}

export interface OktavniGPURAMSistem {
  naziv: string;
  opis: string;
  /** Raspodela po oktavama */
  raspodele: OktavnaGPURaspodela[];
  /** 8×8 matrično jedinjenje */
  matricnoJedinjenje: MatricnoJedinjenje8x8;
  /** Statistika sistema */
  statistika: {
    ukupnoGPUJezgara: number;
    ukupnoRAMGB: number;
    raspodeljenoGPU: number;
    raspodeljenoRAM: number;
    brojOktava: number;
    maksimalnaMatricnaSnaga: number;
    prosecnaMatricnaSnaga: number;
  };
}

// ─── Parametri galaksipoznog sektora po oktavama ─────────────────────

const SEKTORSKI_PARAMETRI: Record<OktavniNivo, {
  galaksipozniFaktor: number;
  matricniKoeficijent: number;
  ekvalaturniRaspon: number;
  sektorskiMnozilac: number;
  ikona: string;
  opis: string;
}> = {
  1: {
    galaksipozniFaktor: 1.0,
    matricniKoeficijent: 1.0,
    ekvalaturniRaspon: 1.0,
    sektorskiMnozilac: 1.0,
    ikona: '🏗️',
    opis: 'Temeljni GPU/RAM sloj — bazna alokacija za strukturalni rendering i osnovne operacije igrica',
  },
  2: {
    galaksipozniFaktor: 1.3,
    matricniKoeficijent: 1.2,
    ekvalaturniRaspon: 1.15,
    sektorskiMnozilac: 1.1,
    ikona: '🛡️',
    opis: 'Zaštitni GPU/RAM sloj — bezbednosno procesiranje, anti-cheat GPU obrada i integritet RAM memorije',
  },
  3: {
    galaksipozniFaktor: 1.6,
    matricniKoeficijent: 1.4,
    ekvalaturniRaspon: 1.3,
    sektorskiMnozilac: 1.2,
    ikona: '🧪',
    opis: 'Kvalitetni GPU/RAM sloj — testiranje performansi, GPU benchmark, RAM stress-test za igrice',
  },
  4: {
    galaksipozniFaktor: 2.0,
    matricniKoeficijent: 1.7,
    ekvalaturniRaspon: 1.5,
    sektorskiMnozilac: 1.35,
    ikona: '🎨',
    opis: 'Kreativni GPU/RAM sloj — vizuelni efekti, shader procesiranje, teksturna memorija za igrice',
  },
  5: {
    galaksipozniFaktor: 2.5,
    matricniKoeficijent: 2.0,
    ekvalaturniRaspon: 1.75,
    sektorskiMnozilac: 1.5,
    ikona: '⚡',
    opis: 'Optimizacioni GPU/RAM sloj — FPS optimizacija, GPU compute shader, RAM pre-fetch za igrice',
  },
  6: {
    galaksipozniFaktor: 3.2,
    matricniKoeficijent: 2.5,
    ekvalaturniRaspon: 2.0,
    sektorskiMnozilac: 1.7,
    ikona: '🔬',
    opis: 'Inteligentni GPU/RAM sloj — AI-accelerated rendering, DLSS/FSR procesiranje, ML model u VRAM-u',
  },
  7: {
    galaksipozniFaktor: 4.0,
    matricniKoeficijent: 3.0,
    ekvalaturniRaspon: 2.5,
    sektorskiMnozilac: 2.0,
    ikona: '♟️',
    opis: 'Koordinacioni GPU/RAM sloj — multi-GPU raspodela, RAM balansiranje, paralelni rendering pipeline',
  },
  8: {
    galaksipozniFaktor: 5.0,
    matricniKoeficijent: 4.0,
    ekvalaturniRaspon: 3.0,
    sektorskiMnozilac: 2.5,
    ikona: '🧬',
    opis: 'Evolucioni GPU/RAM sloj — ray tracing evolucija, adaptivni VRAM, prediktivna GPU alokacija za igrice',
  },
};

// ─── Izračunavanje raspodele ─────────────────────────────────────────

function izracunajGPURaspodelu(oktava: OktavniNivo): number {
  const p = SEKTORSKI_PARAMETRI[oktava];
  return p.galaksipozniFaktor * p.matricniKoeficijent;
}

function izracunajRAMRaspodelu(oktava: OktavniNivo): number {
  const p = SEKTORSKI_PARAMETRI[oktava];
  return p.ekvalaturniRaspon * p.sektorskiMnozilac;
}

/** Suma svih težinskih faktora za normalizaciju */
function getSumuTezina(izracunajFn: (o: OktavniNivo) => number): number {
  const oktave: OktavniNivo[] = [1, 2, 3, 4, 5, 6, 7, 8];
  return oktave.reduce((sum, o) => sum + izracunajFn(o), 0);
}

function kreirajSektor(oktava: OktavniNivo): GalaksipozniSektor {
  const p = SEKTORSKI_PARAMETRI[oktava];
  return {
    oktava,
    naziv: `Galaksipozni Sektor Oktave ${oktava} — ${oktavniNazivi[oktava]}`,
    ikona: p.ikona,
    galaksipozniFaktor: p.galaksipozniFaktor,
    matricniKoeficijent: p.matricniKoeficijent,
    ekvalaturniRaspon: p.ekvalaturniRaspon,
    sektorskiMnozilac: p.sektorskiMnozilac,
  };
}

function kreirajRaspodelu(oktava: OktavniNivo): OktavnaGPURaspodela {
  const p = SEKTORSKI_PARAMETRI[oktava];
  const gpuTezina = izracunajGPURaspodelu(oktava);
  const ramTezina = izracunajRAMRaspodelu(oktava);
  const gpuSuma = getSumuTezina(izracunajGPURaspodelu);
  const ramSuma = getSumuTezina(izracunajRAMRaspodelu);

  const gpuJezgara = Math.round((gpuTezina / gpuSuma) * UKUPNO_GPU_JEZGARA);
  const ramGB = Math.round((ramTezina / ramSuma) * UKUPNO_RAM_GB);
  const gpuProcenat = Math.round((gpuJezgara / UKUPNO_GPU_JEZGARA) * 10000) / 100;
  const ramProcenat = Math.round((ramGB / UKUPNO_RAM_GB) * 10000) / 100;

  const matricnoJedinjenje = Math.round(gpuJezgara * ramGB / 1_000_000);

  return {
    oktava,
    naziv: `Oktava ${oktava} — ${oktavniNazivi[oktava]}`,
    ikona: p.ikona,
    gpuJezgara,
    gpuProcenat,
    ramGB,
    ramProcenat,
    sektor: kreirajSektor(oktava),
    matricnoJedinjenje,
    opis: p.opis,
  };
}

// ─── 8×8 Matrično jedinjenje ─────────────────────────────────────────

function kreirajMatricnoJedinjenje(raspodele: OktavnaGPURaspodela[]): MatricnoJedinjenje8x8 {
  const matrica: number[][] = [];

  for (let i = 0; i < BROJ_OKTAVA; i++) {
    const red: number[] = [];
    for (let j = 0; j < BROJ_OKTAVA; j++) {
      if (i === j) {
        // Dijagonala: samoodrživa snaga (GPU × RAM unutar iste oktave)
        red.push(raspodele[i].matricnoJedinjenje);
      } else {
        // Van-dijagonalni: sinergija između oktava
        const sinergija = Math.round(
          Math.sqrt(raspodele[i].gpuJezgara * raspodele[j].ramGB) / 1000,
        );
        red.push(sinergija);
      }
    }
    matrica.push(red);
  }

  const dijagonala = matrica.map((red, i) => red[i]);
  const trag = dijagonala.reduce((s, v) => s + v, 0);
  const ukupnaSnaga = matrica.reduce(
    (sum, red) => sum + red.reduce((s, v) => s + v, 0),
    0,
  );

  return { matrica, ukupnaSnaga, dijagonala, trag };
}

// ─── Eksportovani sistem ─────────────────────────────────────────────

const oktave: OktavniNivo[] = [1, 2, 3, 4, 5, 6, 7, 8];
const raspodele = oktave.map(kreirajRaspodelu);
const matricnoJedinjenje = kreirajMatricnoJedinjenje(raspodele);

const raspodeljenoGPU = raspodele.reduce((s, r) => s + r.gpuJezgara, 0);
const raspodeljenoRAM = raspodele.reduce((s, r) => s + r.ramGB, 0);
const matricneSnage = raspodele.map((r) => r.matricnoJedinjenje);
const maksimalnaMatricnaSnaga = Math.max(...matricneSnage);
const prosecnaMatricnaSnaga = Math.round(
  matricneSnage.reduce((s, v) => s + v, 0) / matricneSnage.length,
);

export const oktavniGPURAMSistem: OktavniGPURAMSistem = {
  naziv: 'Oktavni GPU/RAM Sistem — Ekvalaturni Galaksipozni Sektor',
  opis: 'Oktavni sistem u rasponu ekvalaturnog galaksipoznog sektora u matričnom jedinjenju izražen kroz grafičnu jedinicu GPU i RAM — za maksimalne performanse igrica na Digitalnom Kompjuteru',
  raspodele,
  matricnoJedinjenje,
  statistika: {
    ukupnoGPUJezgara: UKUPNO_GPU_JEZGARA,
    ukupnoRAMGB: UKUPNO_RAM_GB,
    raspodeljenoGPU,
    raspodeljenoRAM,
    brojOktava: BROJ_OKTAVA,
    maksimalnaMatricnaSnaga,
    prosecnaMatricnaSnaga,
  },
};

// ─── Helper funkcije ─────────────────────────────────────────────────

export function getRaspodelaZaOktavu(oktava: OktavniNivo): OktavnaGPURaspodela {
  return raspodele[oktava - 1];
}

export function getGPUJezgaraZaOktavu(oktava: OktavniNivo): number {
  return raspodele[oktava - 1].gpuJezgara;
}

export function getRAMGBZaOktavu(oktava: OktavniNivo): number {
  return raspodele[oktava - 1].ramGB;
}

export function getMatricnoJedinjenjeZaOktavu(oktava: OktavniNivo): number {
  return raspodele[oktava - 1].matricnoJedinjenje;
}

export function getSinergijuIzmedjuOktava(o1: OktavniNivo, o2: OktavniNivo): number {
  return matricnoJedinjenje.matrica[o1 - 1][o2 - 1];
}

export function getUkupnuGPUSnagu(): number {
  return raspodeljenoGPU;
}

export function getUkupnuRAMSnagu(): number {
  return raspodeljenoRAM;
}
