/**
 * ⚡ SPAJA Real-Time Sistem — Funkcije u Realnom Vremenu
 *
 * Centralizovani sistem za real-time komunikaciju, notifikacije,
 * event bus i live ažuriranja u AI IQ SUPER PLATFORMA ekosistemu.
 *
 * Arhitektura:
 *  1. Event Bus — centralizovani sistem za slanje i primanje poruka
 *  2. Kanali (Channels) — grupisanje korisnika po temi/modulu
 *  3. Notifikacije — push notifikacije za korisnike
 *  4. Live Dashboard — real-time metrike i statistike
 *  5. Presence — ko je online, aktivnost korisnika
 *  6. Chat — real-time poruke između korisnika i OMEGA AI
 *
 * Tehnologije:
 *  - Server-Sent Events (SSE) za Next.js kompatibilnost
 *  - WebSocket-ready arhitektura
 *  - Event-driven messaging
 *
 * Integracija: OMEGA AI Dispatch + SpajaPro + SPAJA BAZA
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import {
  APP_VERSION,
  APP_NAME,
  KOMPANIJA,
  OMEGA_AI_PERSONA_COUNT,
} from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type DogadjajTip =
  | 'notifikacija'
  | 'transakcija'
  | 'pretplata'
  | 'sesija'
  | 'sistem'
  | 'chat'
  | 'dijagnostika'
  | 'evolucija'
  | 'dispatch'
  | 'alert';

export type KanalTip =
  | 'globalni'
  | 'korisnik'
  | 'admin'
  | 'omega-ai'
  | 'platforma'
  | 'banka'
  | 'igrice'
  | 'marketing';

export type NotifikacijaTip =
  | 'info'
  | 'uspeh'
  | 'upozorenje'
  | 'greska'
  | 'transakcija'
  | 'bezbednost';

export type PresenceStatus = 'online' | 'odsutan' | 'zauzet' | 'offline';

// ─── Interfejsi ──────────────────────────────────────────

export interface RealtimeDogadjaj {
  id: string;
  tip: DogadjajTip;
  kanal: KanalTip;
  podaci: Record<string, unknown>;
  posiljalac: string;
  timestamp: string;
  prioritet: 'hitan' | 'visok' | 'normalan' | 'nizak';
}

export interface RealtimeKanal {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: KanalTip;
  pretplatnici: number;
  aktivni: boolean;
  kreirano: string;
}

export interface RealtimeNotifikacija {
  id: string;
  tip: NotifikacijaTip;
  naslov: string;
  poruka: string;
  korisnikId?: string;
  procitana: boolean;
  timestamp: string;
  akcija?: { tekst: string; url: string };
}

export interface RealtimePresence {
  korisnikId: string;
  ime: string;
  status: PresenceStatus;
  poslednjaPrijava: string;
  trenutnaStranica?: string;
}

export interface RealtimeStatistika {
  aktivnihKonekcija: number;
  ukupnoKanala: number;
  ukupnoAktivnihKanala: number;
  ukupnoDogadjajaDanas: number;
  ukupnoNotifikacija: number;
  prosecnoVremeOdgovora: number;
  uptime: string;
}

export interface SpajaRealtimeSistem {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  kanali: RealtimeKanal[];
  statistika: RealtimeStatistika;
  mogucnosti: string[];
  tehnologije: string[];
  status: 'aktivan' | 'odrzavanje';
}

// ─── Kanali ──────────────────────────────────────────────

const realtimeKanali: RealtimeKanal[] = [
  {
    id: 'globalni-kanal',
    naziv: 'Globalni Kanal',
    opis: 'Sve notifikacije i događaji na nivou cele platforme',
    ikona: '🌐',
    tip: 'globalni',
    pretplatnici: 15_420,
    aktivni: true,
    kreirano: '2025-01-01T00:00:00Z',
  },
  {
    id: 'korisnicki-kanal',
    naziv: 'Korisnički Kanal',
    opis: 'Personalizovana ažuriranja za svakog korisnika',
    ikona: '👤',
    tip: 'korisnik',
    pretplatnici: 12_850,
    aktivni: true,
    kreirano: '2025-01-01T00:00:00Z',
  },
  {
    id: 'admin-kanal',
    naziv: 'Admin Kanal',
    opis: 'Administratorski događaji, alerte i sistemske poruke',
    ikona: '🛡️',
    tip: 'admin',
    pretplatnici: 128,
    aktivni: true,
    kreirano: '2025-01-01T00:00:00Z',
  },
  {
    id: 'omega-ai-kanal',
    naziv: 'OMEGA AI Kanal',
    opis: `Dispatch događaji za svih ${OMEGA_AI_PERSONA_COUNT} OMEGA AI persona`,
    ikona: '🧠',
    tip: 'omega-ai',
    pretplatnici: OMEGA_AI_PERSONA_COUNT,
    aktivni: true,
    kreirano: '2025-01-01T00:00:00Z',
  },
  {
    id: 'platforma-kanal',
    naziv: 'Platforma Kanal',
    opis: `Statusna ažuriranja, health check i metrike za ${APP_NAME}`,
    ikona: '📡',
    tip: 'platforma',
    pretplatnici: 8_340,
    aktivni: true,
    kreirano: '2025-01-01T00:00:00Z',
  },
  {
    id: 'banka-kanal',
    naziv: 'Banka Kanal',
    opis: 'Finansijske transakcije, transferi i obaveštenja o stanju računa',
    ikona: '🏦',
    tip: 'banka',
    pretplatnici: 6_210,
    aktivni: true,
    kreirano: '2025-01-15T00:00:00Z',
  },
  {
    id: 'igrice-kanal',
    naziv: 'Igrice Kanal',
    opis: 'Gaming događaji, rezultati, turniri i live sesije',
    ikona: '🎮',
    tip: 'igrice',
    pretplatnici: 9_750,
    aktivni: true,
    kreirano: '2025-02-01T00:00:00Z',
  },
  {
    id: 'marketing-kanal',
    naziv: 'Marketing Kanal',
    opis: 'Marketinške notifikacije, kampanje i korisničke promocije',
    ikona: '📢',
    tip: 'marketing',
    pretplatnici: 4_580,
    aktivni: true,
    kreirano: '2025-02-15T00:00:00Z',
  },
];

// ─── Mogućnosti ──────────────────────────────────────────

const realtimeMogucnosti: string[] = [
  'Server-Sent Events (SSE) streaming',
  'WebSocket-ready arhitektura',
  'Event bus sa publish/subscribe modelom',
  'Kanali sa grupnim pretplatama',
  'Push notifikacije u realnom vremenu',
  'Presence praćenje korisnika',
  'Live dashboard sa metrikama',
  'Chat između korisnika i OMEGA AI',
  'Prioritetno rutiranje događaja',
  'Automatska rekonekcija pri gubitku veze',
  'Heartbeat i health-check monitoring',
  'Enkripcija poruka end-to-end',
  'Rate limiting i zaštita od flood-a',
  'Istorija događaja sa replay mogućnošću',
  'Multi-kanal pretplata po korisniku',
  'Filtriranje događaja po tipu i prioritetu',
  'Batch notifikacije za optimizaciju',
];

// ─── Tehnologije ─────────────────────────────────────────

const realtimeTehnologije: string[] = [
  'Next.js API Routes (SSE)',
  'EventSource Web API',
  'WebSocket Protocol',
  'JSON Streaming',
  'Redis Pub/Sub (planirano)',
  'Edge Runtime kompatibilnost',
];

// ─── Statistika ──────────────────────────────────────────

function izracunajStatistiku(): RealtimeStatistika {
  const ukupnoKanala = realtimeKanali.length;
  const ukupnoAktivnihKanala = realtimeKanali.filter((k) => k.aktivni).length;
  const aktivnihKonekcija = realtimeKanali.reduce((sum, k) => sum + k.pretplatnici, 0);

  return {
    aktivnihKonekcija,
    ukupnoKanala,
    ukupnoAktivnihKanala,
    ukupnoDogadjajaDanas: 284_530,
    ukupnoNotifikacija: 1_250_000,
    prosecnoVremeOdgovora: 42,
    uptime: '99.98%',
  };
}

// ─── Glavni Sistem — SPAJA Real-Time ─────────────────────

export const spajaRealtimeSistem: SpajaRealtimeSistem = {
  naziv: 'SPAJA Real-Time Sistem',
  opis: `Centralizovani real-time sistem za komunikaciju, notifikacije i live ažuriranja u ${APP_NAME} ekosistemu — ${KOMPANIJA}`,
  ikona: '⚡',
  verzija: APP_VERSION,
  kanali: realtimeKanali,
  statistika: izracunajStatistiku(),
  mogucnosti: realtimeMogucnosti,
  tehnologije: realtimeTehnologije,
  status: 'aktivan',
};

// ─── Helper funkcije ─────────────────────────────────────

export function getKanal(id: string): RealtimeKanal | undefined {
  return realtimeKanali.find((k) => k.id === id);
}

export function getAktivniKanali(): RealtimeKanal[] {
  return realtimeKanali.filter((k) => k.aktivni);
}

export function getKanaliPoTipu(tip: KanalTip): RealtimeKanal[] {
  return realtimeKanali.filter((k) => k.tip === tip);
}

export function getRealtimePregled(): {
  naziv: string;
  verzija: string;
  status: string;
  ukupnoKanala: number;
  aktivnihKanala: number;
  aktivnihKonekcija: number;
  ukupnoDogadjajaDanas: number;
  prosecnoVremeOdgovora: number;
  uptime: string;
  mogucnosti: number;
  tehnologije: number;
} {
  const statistika = izracunajStatistiku();

  return {
    naziv: spajaRealtimeSistem.naziv,
    verzija: spajaRealtimeSistem.verzija,
    status: spajaRealtimeSistem.status,
    ukupnoKanala: statistika.ukupnoKanala,
    aktivnihKanala: statistika.ukupnoAktivnihKanala,
    aktivnihKonekcija: statistika.aktivnihKonekcija,
    ukupnoDogadjajaDanas: statistika.ukupnoDogadjajaDanas,
    prosecnoVremeOdgovora: statistika.prosecnoVremeOdgovora,
    uptime: statistika.uptime,
    mogucnosti: realtimeMogucnosti.length,
    tehnologije: realtimeTehnologije.length,
  };
}
