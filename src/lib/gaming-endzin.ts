/**
 * 🎮 SPAJA Gaming Endžin — Konfiguracija i pomoćne funkcije
 *
 * Centralni modul za gaming engine integrisan u SPAJA Digitalni Brouvzer.
 * Endžin pokreće igrice direktno u browser tabu (bez iframe).
 *
 * Dimenzionalni multiplier sistem:
 *   360D  — 2 geometrijska sloja, bazična fizika, 2D rendering
 *   720D  — 3 sloja, Rezonanca mehanika, povećana brzina
 *   1440D — 4 sloja, 3D perspektiva, novi zakoni
 *   2880D — 4 sloja + 5 zakona, kompleksne putanje, više entiteta
 *   5760D — puna reprodukcija: svi slojevi + 6 zakona, particle sistem
 */

import type { DimenzijaNivo, Dimenzija } from './dimenzije';
import type { Igrica, KategorijaIgrice } from './igrice';

// ─── Runner tipovi ─────────────────────────────────────────────────

export type RunnerTip = 'akcija' | 'logicka' | 'simulacija' | 'edu' | 'kreativna';

// ─── Dimenzionalni parametri ───────────────────────────────────────

export interface DimenzionalnParametri {
  nivo: DimenzijaNivo;
  /** Broj aktivnih geometrijskih slojeva */
  slojevi: number;
  /** Broj zakona manifestacije koji važe */
  zakoni: number;
  /** Multiplikator brzine entiteta (1 = osnova) */
  brzinaMultiplikator: number;
  /** Maksimalan broj entiteta na ekranu */
  maxEntiteta: number;
  /** Da li je aktivan 3D/perspektivni prikaz */
  tredni: boolean;
  /** Da li je aktivan particle sistem */
  particleSistem: boolean;
  /** Boja akcentа za ovu dimenziju (Tailwind klasa) */
  akcentBoja: string;
  /** Hex boja za canvas crtanje */
  akcentHex: string;
  /** Target FPS (60 za niže, može biti više za više dimenzije) */
  targetFps: number;
}

const DIMENZIONALNI_PARAMETRI: Record<DimenzijaNivo, DimenzionalnParametri> = {
  '360D': {
    nivo: '360D',
    slojevi: 2,
    zakoni: 2,
    brzinaMultiplikator: 1,
    maxEntiteta: 20,
    tredni: false,
    particleSistem: false,
    akcentBoja: 'text-blue-400',
    akcentHex: '#60a5fa',
    targetFps: 60,
  },
  '720D': {
    nivo: '720D',
    slojevi: 3,
    zakoni: 3,
    brzinaMultiplikator: 1.3,
    maxEntiteta: 35,
    tredni: false,
    particleSistem: false,
    akcentBoja: 'text-purple-400',
    akcentHex: '#c084fc',
    targetFps: 60,
  },
  '1440D': {
    nivo: '1440D',
    slojevi: 4,
    zakoni: 4,
    brzinaMultiplikator: 1.7,
    maxEntiteta: 50,
    tredni: true,
    particleSistem: false,
    akcentBoja: 'text-yellow-400',
    akcentHex: '#facc15',
    targetFps: 60,
  },
  '2880D': {
    nivo: '2880D',
    slojevi: 4,
    zakoni: 5,
    brzinaMultiplikator: 2.2,
    maxEntiteta: 75,
    tredni: true,
    particleSistem: true,
    akcentBoja: 'text-orange-400',
    akcentHex: '#fb923c',
    targetFps: 60,
  },
  '5760D': {
    nivo: '5760D',
    slojevi: 4,
    zakoni: 6,
    brzinaMultiplikator: 3.0,
    maxEntiteta: 120,
    tredni: true,
    particleSistem: true,
    akcentBoja: 'text-red-400',
    akcentHex: '#f87171',
    targetFps: 60,
  },
};

/** Vrati dimenzionalne parametre za zadati nivo */
export function dimenzijaNaParametre(nivo: DimenzijaNivo): DimenzionalnParametri {
  return DIMENZIONALNI_PARAMETRI[nivo];
}

// ─── Runner tip po kategoriji igrice ──────────────────────────────

const KATEGORIJA_NA_RUNNER: Record<KategorijaIgrice, RunnerTip> = {
  akcija: 'akcija',
  borbena: 'akcija',
  trka: 'akcija',
  logicka: 'logicka',
  arkadna: 'logicka',
  strategija: 'simulacija',
  simulacija: 'simulacija',
  edukativna: 'edu',
  rpg: 'edu',
  detektivska: 'edu',
  kreativna: 'kreativna',
  muzicka: 'kreativna',
  horor: 'akcija',
  sportska: 'akcija',
  mmo: 'simulacija',
  avantura: 'edu',
  'zivotna-simulacija': 'simulacija',
  retro: 'akcija',
};

/** Vrati tip runner-a za kategoriju igrice */
export function getRunnerTip(kategorija: KategorijaIgrice): RunnerTip {
  return KATEGORIJA_NA_RUNNER[kategorija] ?? 'akcija';
}

// ─── Konfiguracija endžina ─────────────────────────────────────────

export interface GamingEndzinKonfiguracija {
  igrica: Igrica;
  dimenzija: Dimenzija;
  parametri: DimenzionalnParametri;
  runnerTip: RunnerTip;
}

/** Kreira kompletnu konfiguraciju endžina za igricu i dimenziju */
export function kreirajEndzinKonfiguraciju(
  igrica: Igrica,
  dimenzija: Dimenzija,
): GamingEndzinKonfiguracija {
  return {
    igrica,
    dimenzija,
    parametri: dimenzijaNaParametre(dimenzija.nivo),
    runnerTip: getRunnerTip(igrica.kategorija),
  };
}

// ─── Game state tipovi (deljeni između runner-a) ────────────────────

export type GameFaza = 'cekanje' | 'igra' | 'pauza' | 'kraj';

export interface GameScore {
  bodovi: number;
  nivo: number;
  vreme: number;
  /** Bonus faktor od dimenzije */
  dimenzionalniBonus: number;
}

export function noviScore(dimenzijaNivo: DimenzijaNivo): GameScore {
  const params = dimenzijaNaParametre(dimenzijaNivo);
  return {
    bodovi: 0,
    nivo: 1,
    vreme: 0,
    dimenzionalniBonus: params.brzinaMultiplikator,
  };
}

// ─── Geometrijski oblici za crtanje na canvas-u ─────────────────────

/** Crta elipsoidni oblik na canvas kontekstu */
export function crtajElipsoid(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  boja: string,
): void {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = boja;
  ctx.fill();
}

/** Crta spiralni oblik na canvas kontekstu */
export function crtajSpiralu(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  maxR: number,
  okretaja: number,
  boja: string,
): void {
  ctx.beginPath();
  ctx.strokeStyle = boja;
  ctx.lineWidth = 2;
  const tacaka = 200;
  for (let i = 0; i <= tacaka; i++) {
    const ugao = (i / tacaka) * Math.PI * 2 * okretaja;
    const r = (i / tacaka) * maxR;
    const x = cx + r * Math.cos(ugao);
    const y = cy + r * Math.sin(ugao);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

/** Crta hiperbolični oblik (dva luka) */
export function crtajHiperbolu(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  a: number,
  boja: string,
): void {
  ctx.beginPath();
  ctx.strokeStyle = boja;
  ctx.lineWidth = 2;
  for (let t = -2; t <= 2; t += 0.05) {
    const x = cx + a * Math.cosh(t);
    const y = cy + a * Math.sinh(t);
    if (t === -2) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.beginPath();
  for (let t = -2; t <= 2; t += 0.05) {
    const x = cx - a * Math.cosh(t);
    const y = cy + a * Math.sinh(t);
    if (t === -2) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

/** Crta rezonantni prsten */
export function crtajRezonancu(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  amplituda: number,
  frekvencija: number,
  vreme: number,
  boja: string,
): void {
  ctx.beginPath();
  ctx.strokeStyle = boja;
  ctx.lineWidth = 2;
  const tacaka = 120;
  for (let i = 0; i <= tacaka; i++) {
    const ugao = (i / tacaka) * Math.PI * 2;
    const rezonanca = r + amplituda * Math.sin(frekvencija * ugao + vreme);
    const x = cx + rezonanca * Math.cos(ugao);
    const y = cy + rezonanca * Math.sin(ugao);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}
