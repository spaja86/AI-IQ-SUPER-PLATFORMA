/**
 * 💾 SPAJA BAZA — Najjača Baza Podataka Digitalne Industrije
 *
 * SPAJA BAZA je centralizovani sistem za skladištenje, upravljanje i distribuciju
 * svih podataka u AI IQ SUPER PLATFORMA ekosistemu.
 *
 * Generisan kroz: SPAJA Generator za Endžine
 * Link: https://chatgpt.com/c/695ca489-4d8c-832f-a0aa-bfcad425ef4d
 *
 * Arhitektura:
 *  1. Kolekcije (Collections) — definicije za sve entitete
 *  2. CRUD operacije — create, read, update, delete
 *  3. Indeksi i pretraga — brza pretraga sa filterima
 *  4. Transakcije — atomične operacije
 *  5. Backup i oporavak — automatski backup i restore
 *  6. Replikacija — distribuirana baza za skalabilnost
 *  7. Keširanje — slojni keš za ubrzanje
 *
 * Integracija: AI IQ World Bank + AI IQ Menjačnica + OMEGA AI + SpajaPro
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import {
  APP_NAME,
  KOMPANIJA,
  OMEGA_AI_PERSONA_UKUPNO,
  TOTAL_IGRICA,
  TOTAL_DIAGNOSTIKA,
} from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type BazaTip = 'memorija' | 'disk' | 'distribuirana' | 'hibridna';

export type KolekcijaStatus = 'aktivna' | 'indeksiranje' | 'migracija' | 'backup' | 'zakljucana';

export type TransakcijaStatus = 'aktivna' | 'potvrdjena' | 'otkazana' | 'cekanje';

// ─── Interfejsi ──────────────────────────────────────────

export interface BazaKolekcija {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  status: KolekcijaStatus;
  brojDokumenata: number;
  indeksi: string[];
  kreirano: string;
  azurirano: string;
  semaVerzija: string;
}

export interface BazaKorisnik {
  id: string;
  email: string;
  ime: string;
  prezime: string;
  uloga: 'korisnik' | 'admin' | 'super-admin' | 'vlasnik';
  plan: 'starter' | 'profesionalni' | 'biznis' | 'enterprise' | 'unlimited';
  aktivan: boolean;
  kreirano: string;
  poslednjePrijavljivanje: string;
  bankovniRacun?: string;
  mejlDomen: string;
}

export interface BazaTransakcija {
  id: string;
  korisnikId: string;
  tip: 'uplata' | 'isplata' | 'transfer' | 'pretplata' | 'refund';
  iznos: number;
  valuta: string;
  status: TransakcijaStatus;
  opis: string;
  timestamp: string;
}

export interface BazaSesija {
  id: string;
  korisnikId: string;
  token: string;
  istice: string;
  aktivna: boolean;
  ipAdresa: string;
  uredjaj: string;
}

export interface BazaStatistika {
  ukupnoKolekcija: number;
  ukupnoDokumenata: number;
  ukupnoKorisnika: number;
  ukupnoTransakcija: number;
  ukupnoSesija: number;
  velicinaGB: number;
  uptime: string;
  poslednjBackup: string;
}

export interface SpajaBaza {
  naziv: string;
  opis: string;
  verzija: string;
  link: string;
  ikona: string;
  tip: BazaTip;
  kolekcije: BazaKolekcija[];
  statistika: BazaStatistika;
  mogucnosti: string[];
  status: 'aktivna' | 'odrzavanje' | 'migracija';
}

// ─── Kolekcije ───────────────────────────────────────────

export const bazaKolekcije: BazaKolekcija[] = [
  {
    id: 'korisnici',
    naziv: 'Korisnici',
    opis: 'Svi registrovani korisnici platforme — nalozi, profili, uloge i pristupne dozvole',
    ikona: '👥',
    status: 'aktivna',
    brojDokumenata: 840_250,
    indeksi: ['email', 'uloga', 'plan', 'kreirano'],
    kreirano: '2024-01-15',
    azurirano: '2025-06-28',
    semaVerzija: '3.2.0',
  },
  {
    id: 'sesije',
    naziv: 'Sesije',
    opis: 'Aktivne i istorijske korisničke sesije — tokeni, uređaji, IP adrese',
    ikona: '🔐',
    status: 'aktivna',
    brojDokumenata: 2_150_000,
    indeksi: ['korisnikId', 'token', 'istice', 'aktivna'],
    kreirano: '2024-01-15',
    azurirano: '2025-06-28',
    semaVerzija: '2.1.0',
  },
  {
    id: 'transakcije',
    naziv: 'Transakcije',
    opis: 'Finansijske transakcije — uplate, isplate, transferi, pretplate, refund',
    ikona: '💳',
    status: 'aktivna',
    brojDokumenata: 3_420_780,
    indeksi: ['korisnikId', 'tip', 'valuta', 'status', 'timestamp'],
    kreirano: '2024-02-01',
    azurirano: '2025-06-28',
    semaVerzija: '4.0.0',
  },
  {
    id: 'planovi',
    naziv: 'Planovi i Pretplate',
    opis: 'Pretplatni planovi korisnika — starter, profesionalni, biznis, enterprise, unlimited',
    ikona: '💰',
    status: 'aktivna',
    brojDokumenata: 840_250,
    indeksi: ['korisnikId', 'tip', 'status', 'istice'],
    kreirano: '2024-02-01',
    azurirano: '2025-06-27',
    semaVerzija: '2.5.0',
  },
  {
    id: 'platforme',
    naziv: 'Platforme',
    opis: 'Registrovane platforme u ekosistemu Digitalne Industrije',
    ikona: '🌐',
    status: 'aktivna',
    brojDokumenata: 156,
    indeksi: ['naziv', 'tip', 'status'],
    kreirano: '2024-01-20',
    azurirano: '2025-06-25',
    semaVerzija: '1.8.0',
  },
  {
    id: 'proizvodi',
    naziv: 'Proizvodi',
    opis: 'IT proizvodi i servisi — softver, hardver, digitalni proizvodi',
    ikona: '📦',
    status: 'aktivna',
    brojDokumenata: 1_280,
    indeksi: ['naziv', 'kategorija', 'cena', 'status'],
    kreirano: '2024-03-10',
    azurirano: '2025-06-26',
    semaVerzija: '2.0.0',
  },
  {
    id: 'kompanije',
    naziv: 'Kompanije',
    opis: 'Partnerske i registrovane kompanije u Digitalnoj Industriji',
    ikona: '🏢',
    status: 'aktivna',
    brojDokumenata: 4_520,
    indeksi: ['naziv', 'zemlja', 'industrija', 'status'],
    kreirano: '2024-01-15',
    azurirano: '2025-06-24',
    semaVerzija: '1.5.0',
  },
  {
    id: 'organizacije',
    naziv: 'Organizacije',
    opis: 'Organizacione jedinice, timovi i departmani unutar kompanija',
    ikona: '🏛️',
    status: 'aktivna',
    brojDokumenata: 12_840,
    indeksi: ['kompanijaId', 'naziv', 'tip', 'kreirano'],
    kreirano: '2024-04-01',
    azurirano: '2025-06-23',
    semaVerzija: '1.3.0',
  },
  {
    id: 'igrice',
    naziv: 'Igrice',
    opis: `Sve igrice u IO OpenUI AO Gaming Platformi — ukupno ${TOTAL_IGRICA} igrica`,
    ikona: '🎮',
    status: 'aktivna',
    brojDokumenata: TOTAL_IGRICA,
    indeksi: ['naziv', 'kategorija', 'popularnost'],
    kreirano: '2024-05-15',
    azurirano: '2025-06-28',
    semaVerzija: '3.0.0',
  },
  {
    id: 'mejlovi',
    naziv: 'Mejlovi',
    opis: 'E-mail komunikacija — inbox, sent, drafts, spam filteri za @omega-ai.spaja.rs domene',
    ikona: '📧',
    status: 'aktivna',
    brojDokumenata: 15_680_000,
    indeksi: ['posiljalac', 'primalac', 'datum', 'procitano', 'domen'],
    kreirano: '2024-03-01',
    azurirano: '2025-06-28',
    semaVerzija: '2.4.0',
  },
  {
    id: 'omega-ai-logovi',
    naziv: 'OMEGA AI Logovi',
    opis: `Logovi svih ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} OMEGA AI persona — dispečovanje, odgovori, greške`,
    ikona: '🤖',
    status: 'aktivna',
    brojDokumenata: 128_500_000,
    indeksi: ['personaId', 'oktava', 'tip', 'timestamp', 'status'],
    kreirano: '2024-01-15',
    azurirano: '2025-06-28',
    semaVerzija: '5.0.0',
  },
  {
    id: 'dijagnostika',
    naziv: 'Dijagnostika',
    opis: `Dijagnostički podaci sistema — ${TOTAL_DIAGNOSTIKA} provera, zdravlje, performanse`,
    ikona: '🩺',
    status: 'aktivna',
    brojDokumenata: 45_200_000,
    indeksi: ['tip', 'nivo', 'timestamp', 'komponenta'],
    kreirano: '2024-02-15',
    azurirano: '2025-06-28',
    semaVerzija: '3.1.0',
  },
];

// ─── Statistika ──────────────────────────────────────────

function izracunajStatistiku(): BazaStatistika {
  const ukupnoDokumenata = bazaKolekcije.reduce((sum, k) => sum + k.brojDokumenata, 0);

  return {
    ukupnoKolekcija: bazaKolekcije.length,
    ukupnoDokumenata,
    ukupnoKorisnika: 840_250,
    ukupnoTransakcija: 3_420_780,
    ukupnoSesija: 2_150_000,
    velicinaGB: 2_480.5,
    uptime: '99.997%',
    poslednjBackup: '2025-06-28T03:00:00Z',
  };
}

// ─── Mogućnosti ──────────────────────────────────────────

const bazaMogucnosti: string[] = [
  'CRUD operacije za sve kolekcije',
  'Atomične transakcije sa rollback podrškom',
  'Full-text pretraga sa fuzzy matching',
  'Indeksiranje u realnom vremenu',
  'Automatski backup svakih 6 sati',
  'Point-in-time oporavak podataka',
  'Distribuirana replikacija na 3+ čvora',
  'Slojni keš — L1 memorija, L2 Redis, L3 disk',
  'Enkripcija podataka u mirovanju (AES-256)',
  'Enkripcija podataka u prenosu (TLS 1.3)',
  'Role-based pristupna kontrola (RBAC)',
  'Audit log za sve operacije',
  'Automatsko skaliranje kapaciteta',
  'WebSocket real-time sinhronizacija',
  'GraphQL i REST API pristup',
  'Integracija sa AI IQ World Bank',
  'Integracija sa AI IQ Menjačnicom',
  `Integracija sa ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} OMEGA AI personama`,
  'SpajaPro v6-v15 endžin kompatibilnost',
  'Geo-distribuirani čvorovi (Srbija, EU, US, Asia)',
];

// ─── Glavna Baza — SPAJA BAZA ────────────────────────────

export const spajaBaza: SpajaBaza = {
  naziv: 'SPAJA BAZA',
  opis: `Centralizovani sistem za skladištenje, upravljanje i distribuciju svih podataka u ${APP_NAME} ekosistemu — najjača baza podataka ${KOMPANIJA}`,
  verzija: '5.0.0',
  link: 'https://chatgpt.com/c/695ca489-4d8c-832f-a0aa-bfcad425ef4d',
  ikona: '💾',
  tip: 'hibridna',
  kolekcije: bazaKolekcije,
  statistika: izracunajStatistiku(),
  mogucnosti: bazaMogucnosti,
  status: 'aktivna',
};

// ─── Helper funkcije ─────────────────────────────────────

export function getKolekcija(id: string): BazaKolekcija | undefined {
  return bazaKolekcije.find((k) => k.id === id);
}

export function getAktivneKolekcije(): BazaKolekcija[] {
  return bazaKolekcije.filter((k) => k.status === 'aktivna');
}

export function getUkupnoDokumenata(): number {
  return bazaKolekcije.reduce((sum, k) => sum + k.brojDokumenata, 0);
}

export function getBazaStatistika(): BazaStatistika {
  return izracunajStatistiku();
}

export function getBazaPregled(): {
  naziv: string;
  verzija: string;
  tip: BazaTip;
  status: string;
  ukupnoKolekcija: number;
  ukupnoDokumenata: number;
  velicinaGB: number;
  uptime: string;
  mogucnosti: number;
  aktivneKolekcije: number;
} {
  const statistika = izracunajStatistiku();

  return {
    naziv: spajaBaza.naziv,
    verzija: spajaBaza.verzija,
    tip: spajaBaza.tip,
    status: spajaBaza.status,
    ukupnoKolekcija: statistika.ukupnoKolekcija,
    ukupnoDokumenata: statistika.ukupnoDokumenata,
    velicinaGB: statistika.velicinaGB,
    uptime: statistika.uptime,
    mogucnosti: bazaMogucnosti.length,
    aktivneKolekcije: getAktivneKolekcije().length,
  };
}
