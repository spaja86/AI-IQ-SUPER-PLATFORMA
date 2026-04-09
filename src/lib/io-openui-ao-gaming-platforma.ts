/**
 * 🎮 IO/OPENUI/AO Gaming Platforma — SPAJA Univerzalni Endžin nad svim igricama
 *
 * Platforma IO/OPENUI/AO sa svim 95 igrica puštenim u opticaj.
 * SPAJA Univerzalni Endžin je prevučen preko svake igrice posebno,
 * čime se obezbeđuje da sve igrice rade na IO/OPENUI/AO platformi.
 *
 * Standardni URL: www.ioopenuiao.ac
 * Vercel fallback: io-openui-ao.vercel.app
 *
 * Link: https://chatgpt.com/c/688e73aa-ecf8-8006-a7bd-b7d796498ae7
 */

import type { Igrica, KategorijaIgrice, StatusIgrice } from './igrice';
import { igrice, igriceSistem, OBAVEZNI_ZAHTEVI } from './igrice';
import type { GenerisaniEngine } from './spaja-generator-engine';

// ─── Tipovi ──────────────────────────────────────────────────

export type EndzinStatus = 'aktivan' | 'inicijalizacija' | 'optimizacija' | 'greska';

export interface SpajaUniverzalniEndzinPoIgrici {
  igricaId: string;
  igricaNaziv: string;
  igricaIkona: string;
  igricaKategorija: KategorijaIgrice;
  igricaStatus: StatusIgrice;
  endzinId: string;
  endzinNaziv: string;
  endzinVerzija: string;
  endzinStatus: EndzinStatus;
  prevucen: boolean;
  mogucnosti: string[];
  optimizacija: number;
  datumPrevlacenja: string;
}

export interface IOOpenUIAOGamingKonfiguracija {
  platformaId: string;
  platformaNaziv: string;
  domen: string;
  vercelFallback: string;
  protokol: string;
  standardniUrl: string;
  aktivan: boolean;
}

export interface IOOpenUIAOGamingStatistika {
  ukupnoIgrica: number;
  prevucenoEndžinom: number;
  aktivnihIgrica: number;
  prosecnaOptimizacija: number;
  ukupnoKategorija: number;
  poKategoriji: Record<string, number>;
  platformaDomen: string;
  platformaUrl: string;
}

export interface IOOpenUIAOGamingPlatforma {
  naziv: string;
  opis: string;
  verzija: string;
  link: string;
  generatorLink: string;
  konfiguracija: IOOpenUIAOGamingKonfiguracija;
  endzinNadIgricama: SpajaUniverzalniEndzinPoIgrici[];
  statistika: IOOpenUIAOGamingStatistika;
}

// ─── Konfiguracija platforme ─────────────────────────────────

export const IOOPENUIAO_DOMEN = 'www.ioopenuiao.ac';
export const IOOPENUIAO_VERCEL = 'io-openui-ao.vercel.app';
export const IOOPENUIAO_URL = `https://${IOOPENUIAO_DOMEN}`;

export const gamingKonfiguracija: IOOpenUIAOGamingKonfiguracija = {
  platformaId: 'io-openui-ao-gaming',
  platformaNaziv: 'IO/OPENUI/AO Gaming Platforma',
  domen: IOOPENUIAO_DOMEN,
  vercelFallback: IOOPENUIAO_VERCEL,
  protokol: 'https',
  standardniUrl: IOOPENUIAO_URL,
  aktivan: true,
};

// ─── SPAJA Univerzalni Endžin — prevlačenje preko svake igrice ─

function prevuciEndzinPrekoIgrice(igrica: Igrica, indeks: number): SpajaUniverzalniEndzinPoIgrici {
  return {
    igricaId: igrica.id,
    igricaNaziv: igrica.naziv,
    igricaIkona: igrica.ikona,
    igricaKategorija: igrica.kategorija,
    igricaStatus: igrica.status,
    endzinId: `spaja-univerzalni-endzin-${igrica.id}`,
    endzinNaziv: `SPAJA Univerzalni Endžin → ${igrica.naziv}`,
    endzinVerzija: '1.0.0',
    endzinStatus: 'aktivan',
    prevucen: true,
    mogucnosti: [
      `Dimenzionalno renderovanje ${igrica.podrzaneDimenzije.join('/')}`,
      'SPAJA Generator za Endžine integracija',
      'SpajaPro 6-15 prompt podrška',
      'OMEGA AI persona integracija',
      `${igrica.dimenzionalniRezimi.length} dimenzionalnih režima`,
      `${igrica.funkcije.length} igričnih funkcija`,
      'Proksi mrežna optimizacija',
      'Digitalni Kompjuter + Digitalni Brauzer podrška',
      `IO/OPENUI/AO platforma (${IOOPENUIAO_DOMEN})`,
    ],
    optimizacija: Math.min(95, 75 + Math.floor(indeks / 5)),
    datumPrevlacenja: '2026-04-08',
  };
}

/** Sve igrice sa SPAJA Univerzalnim Endžinom prevučenim preko svake */
export const endzinNadIgricama: SpajaUniverzalniEndzinPoIgrici[] = igrice.map(
  (igrica, i) => prevuciEndzinPrekoIgrice(igrica, i)
);

// ─── Statistika ──────────────────────────────────────────────

function izracunajStatistiku(): IOOpenUIAOGamingStatistika {
  const aktivnih = endzinNadIgricama.filter((e) => e.igricaStatus === 'aktivna').length;
  const prevuceno = endzinNadIgricama.filter((e) => e.prevucen).length;
  const prosek = endzinNadIgricama.length > 0
    ? Math.round(endzinNadIgricama.reduce((a, e) => a + e.optimizacija, 0) / endzinNadIgricama.length)
    : 0;

  const poKategoriji: Record<string, number> = {};
  for (const e of endzinNadIgricama) {
    poKategoriji[e.igricaKategorija] = (poKategoriji[e.igricaKategorija] ?? 0) + 1;
  }

  return {
    ukupnoIgrica: endzinNadIgricama.length,
    prevucenoEndžinom: prevuceno,
    aktivnihIgrica: aktivnih,
    prosecnaOptimizacija: prosek,
    ukupnoKategorija: Object.keys(poKategoriji).length,
    poKategoriji,
    platformaDomen: IOOPENUIAO_DOMEN,
    platformaUrl: IOOPENUIAO_URL,
  };
}

export const gamingStatistika = izracunajStatistiku();

// ─── Glavna platforma ────────────────────────────────────────

export const ioOpenUIAOGamingPlatforma: IOOpenUIAOGamingPlatforma = {
  naziv: 'IO/OPENUI/AO Gaming Platforma — SPAJA Univerzalni Endžin',
  opis:
    'Platforma IO/OPENUI/AO sa svim 95 igrica puštenim u opticaj. ' +
    'SPAJA Univerzalni Endžin je prevučen preko svake igrice posebno, ' +
    'čime se obezbeđuje dimenzionalno renderovanje (360D–5760D), ' +
    'SpajaPro 6-15 integracija, OMEGA AI podrška i Proksi mrežna optimizacija. ' +
    `Standardni URL: ${IOOPENUIAO_URL}. Vercel fallback: https://${IOOPENUIAO_VERCEL}.`,
  verzija: '1.0.0',
  link: 'https://chatgpt.com/c/688e73aa-ecf8-8006-a7bd-b7d796498ae7',
  generatorLink: 'https://chatgpt.com/c/697aae0b-4984-8385-a9b6-1e762b39d7de',
  konfiguracija: gamingKonfiguracija,
  endzinNadIgricama,
  statistika: gamingStatistika,
};

// ─── Helper funkcije ─────────────────────────────────────────

/** Dohvati endžin za konkretnu igricu */
export function getEndzinZaIgricu(igricaId: string): SpajaUniverzalniEndzinPoIgrici | undefined {
  return endzinNadIgricama.find((e) => e.igricaId === igricaId);
}

/** Dohvati sve igrice po kategoriji sa endžinom */
export function getIgriceSaEndzinomPoKategoriji(kategorija: KategorijaIgrice): SpajaUniverzalniEndzinPoIgrici[] {
  return endzinNadIgricama.filter((e) => e.igricaKategorija === kategorija);
}

/** Dohvati sve aktivne igrice sa prevučenim endžinom */
export function getAktivneIgriceSaEndzinom(): SpajaUniverzalniEndzinPoIgrici[] {
  return endzinNadIgricama.filter((e) => e.prevucen && e.endzinStatus === 'aktivan');
}

/** Dohvati prosečnu optimizaciju endžina */
export function getProsecnaOptimizacija(): number {
  return gamingStatistika.prosecnaOptimizacija;
}

/** Dohvati ukupan broj kategorija */
export function getUkupnoKategorija(): number {
  return gamingStatistika.ukupnoKategorija;
}

/** Dohvati platformu URL */
export function getPlatformaUrl(): string {
  return IOOPENUIAO_URL;
}
