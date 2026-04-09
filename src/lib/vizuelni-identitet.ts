/**
 * 🎨 Vizuelni Identitet — Logo, Slike Osnivača, Brend Resursi
 *
 * Centralni registar vizuelnog identiteta Kompanije SPAJA i Digitalne Industrije.
 * Sadrži logo, fotografije osnivača Nikole Spajića, i sve brend resurse.
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { APP_VERSION, KOMPANIJA } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type SlikaTip = 'logo' | 'osnivac' | 'brend' | 'ikona' | 'pozadina';
export type SlikaFormat = 'png' | 'jpg' | 'svg' | 'webp';

export interface VizuelniResurs {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: SlikaTip;
  url: string;
  alt: string;
  sirina?: number;
  visina?: number;
  format: SlikaFormat;
  prioritet: 'primarni' | 'sekundarni' | 'tercijarni';
}

export interface OsnivacProfil {
  ime: string;
  prezime: string;
  punoIme: string;
  titula: string;
  kompanija: string;
  email: string;
  opis: string;
  fotografije: VizuelniResurs[];
}

export interface BrendSmernice {
  naziv: string;
  opis: string;
  ikona: string;
  boje: BrendBoja[];
  fontovi: string[];
  principi: string[];
}

export interface BrendBoja {
  naziv: string;
  hex: string;
  rgb: string;
  upotreba: string;
}

export interface VizuelniIdentitetSistem {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  kompanija: string;
  resursi: VizuelniResurs[];
  osnivac: OsnivacProfil;
  brendSmernice: BrendSmernice;
  ukupnoResursa: number;
  status: 'aktivan' | 'konfiguracija';
}

// ─── Vizuelni Resursi ────────────────────────────────────

export const vizuelniResursi: VizuelniResurs[] = [
  {
    id: 'logo-digitalna-industrija',
    naziv: 'Digitalna Industrija — Glavni Logo',
    opis: 'Glavni logo Digitalne Industrije — kosmička spirala sa natpisom DIGITALNA INDUSTRIJA',
    ikona: '🌀',
    tip: 'logo',
    url: 'https://github.com/user-attachments/assets/157afec1-4d04-4282-8303-e6a736a89dd3',
    alt: 'Digitalna Industrija logo — kosmička spirala u neon bojama sa natpisom Digitalna Industrija',
    sirina: 1024,
    visina: 1536,
    format: 'png',
    prioritet: 'primarni',
  },
  {
    id: 'nikola-spajic-foto-1',
    naziv: 'Nikola Spajić — Fotografija 1',
    opis: 'Fotografija osnivača Nikole Spajića — Kompanija SPAJA',
    ikona: '👤',
    tip: 'osnivac',
    url: 'https://github.com/user-attachments/assets/4a83047c-2a53-4328-905f-8d5bfcafedc4',
    alt: 'Nikola Spajić — osnivač i CEO Kompanije SPAJA',
    format: 'jpg',
    prioritet: 'primarni',
  },
  {
    id: 'nikola-spajic-foto-2',
    naziv: 'Nikola Spajić — Fotografija 2',
    opis: 'Druga fotografija osnivača Nikole Spajića — Kompanija SPAJA',
    ikona: '👤',
    tip: 'osnivac',
    url: 'https://github.com/user-attachments/assets/a5401e3b-397c-4b35-9157-ae8c9ac7a73c',
    alt: 'Nikola Spajić — osnivač i CEO Kompanije SPAJA',
    format: 'jpg',
    prioritet: 'sekundarni',
  },
];

// ─── Profil Osnivača ─────────────────────────────────────

export const osnivacProfil: OsnivacProfil = {
  ime: 'Nikola',
  prezime: 'Spajić',
  punoIme: 'Nikola Spajić',
  titula: 'Osnivač & CEO',
  kompanija: KOMPANIJA,
  email: 'spajicn@yahoo.com',
  opis: 'Nikola Spajić je osnivač i CEO Kompanije SPAJA — Digitalne Industrije koja upravlja sa AI IQ SUPER PLATFORMA, IO OPENUI AO, SpajaPro Engine-om, OMEGA AI sistemom sa 21 personom, i celokupnim digitalnim ekosistemom.',
  fotografije: vizuelniResursi.filter((r) => r.tip === 'osnivac'),
};

// ─── Brend Smernice ──────────────────────────────────────

export const brendSmernice: BrendSmernice = {
  naziv: 'Kompanija SPAJA — Brend Smernice',
  opis: 'Vizuelne smernice za brend Kompanije SPAJA i Digitalne Industrije',
  ikona: '🎨',
  boje: [
    { naziv: 'SPAJA Plava', hex: '#2563eb', rgb: 'rgb(37, 99, 235)', upotreba: 'Primarna boja — dugmad, linkovi, akcenti' },
    { naziv: 'SPAJA Ljubičasta', hex: '#7c3aed', rgb: 'rgb(124, 58, 237)', upotreba: 'Gradijenti, hero sekcije, OMEGA AI' },
    { naziv: 'SPAJA Indigo', hex: '#4f46e5', rgb: 'rgb(79, 70, 229)', upotreba: 'Sekundarna boja, navigacija' },
    { naziv: 'Tamna Pozadina', hex: '#0a0a1a', rgb: 'rgb(10, 10, 26)', upotreba: 'Osnovna pozadina platforme' },
    { naziv: 'Tekst Bela', hex: '#ffffff', rgb: 'rgb(255, 255, 255)', upotreba: 'Primarni tekst, naslovi' },
    { naziv: 'Tekst Siva', hex: '#9ca3af', rgb: 'rgb(156, 163, 175)', upotreba: 'Sekundarni tekst, opisi' },
    { naziv: 'Uspeh Zelena', hex: '#22c55e', rgb: 'rgb(34, 197, 94)', upotreba: 'Status aktivan, zdravlje, uspeh' },
    { naziv: 'Upozorenje Žuta', hex: '#eab308', rgb: 'rgb(234, 179, 8)', upotreba: 'Upozorenja, u razvoju' },
  ],
  fontovi: ['System UI', 'Inter', 'SF Pro', 'Segoe UI'],
  principi: [
    'Tamna tema — profesionalan, moderan izgled',
    'Gradijenti — plava→ljubičasta→indigo za hero sekcije',
    'Emoji ikone — ARIA pristupačnost (role="img")',
    'Minimalistički dizajn — čist, bez prenatrpanosti',
    'Responsivnost — mobile-first pristup',
    'Kosmička estetika — logo sa spiralom i neonskim efektima',
  ],
};

// ─── Kompletni Sistem ────────────────────────────────────

export const vizuelniIdentitetSistem: VizuelniIdentitetSistem = {
  naziv: 'Vizuelni Identitet — Kompanija SPAJA',
  opis: `Centralni registar vizuelnog identiteta sa ${vizuelniResursi.length} resursa. Logo Digitalne Industrije, fotografije osnivača Nikole Spajića, brend smernice. Verzija: ${APP_VERSION}`,
  ikona: '🎨',
  verzija: APP_VERSION,
  kompanija: KOMPANIJA,
  resursi: vizuelniResursi,
  osnivac: osnivacProfil,
  brendSmernice,
  ukupnoResursa: vizuelniResursi.length,
  status: 'aktivan',
};

// ─── Helper Funkcije ─────────────────────────────────────

export function getResursPoId(id: string): VizuelniResurs | undefined {
  return vizuelniResursi.find((r) => r.id === id);
}

export function getResursiPoTipu(tip: SlikaTip): VizuelniResurs[] {
  return vizuelniResursi.filter((r) => r.tip === tip);
}

export function getLogo(): VizuelniResurs | undefined {
  return vizuelniResursi.find((r) => r.tip === 'logo' && r.prioritet === 'primarni');
}

export function getOsnivacFotografije(): VizuelniResurs[] {
  return vizuelniResursi.filter((r) => r.tip === 'osnivac');
}

export function getPrimarniResursi(): VizuelniResurs[] {
  return vizuelniResursi.filter((r) => r.prioritet === 'primarni');
}
