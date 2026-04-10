/**
 * 🔐 Autentifikacija — Login & Sigurnosni Sistem
 *
 * Sistem za autentifikaciju, autorizaciju i upravljanje korisničkim sesijama
 * u AI IQ SUPER PLATFORMA ekosistemu.
 *
 * Generisan kroz: SPAJA Generator za Endžine + AI IQ World Bank
 * Link: https://chatgpt.com/c/68981608-32dc-832e-831e-9ff1a0ff485c
 *
 * Funkcije:
 *  1. Registracija korisnika — email + lozinka sa validacijom
 *  2. Prijavljivanje (Login) — JWT token generisanje
 *  3. Sesije — upravljanje aktivnim sesijama
 *  4. Uloge i dozvole — role-based access control (RBAC)
 *  5. Dvofaktorska autentifikacija (2FA)
 *  6. OAuth integracija — Google, GitHub
 *  7. Vlasnički VIP pristup — spajicn@yahoo.com
 *
 * Integracija: AI IQ World Bank + SPAJA BAZA + OMEGA AI
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { APP_VERSION, APP_NAME, KOMPANIJA, OMEGA_AI_PERSONA_COUNT } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type KorisnickaUloga = 'korisnik' | 'moderator' | 'admin' | 'super-admin' | 'vlasnik';

export type AuthStatus = 'aktivan' | 'neaktivan' | 'suspendovan' | 'cekanje-verifikacije';

export type OAuthProvajder = 'google' | 'github' | 'email';

export type TokenTip = 'pristup' | 'osvezavanje' | 'verifikacija' | 'reset-lozinke';

// ─── Interfejsi ──────────────────────────────────────────

export interface AuthKorisnik {
  id: string;
  email: string;
  ime: string;
  prezime: string;
  uloga: KorisnickaUloga;
  plan: string;
  status: AuthStatus;
  dvofaktor: boolean;
  oauthProvajder?: OAuthProvajder;
  kreirano: string;
  azurirano: string;
  avatar?: string;
  bankovniRacun?: string;
}

export interface AuthSesija {
  id: string;
  korisnikId: string;
  token: string;
  refreshToken: string;
  istice: string;
  kreirana: string;
  aktivna: boolean;
  ipAdresa: string;
  uredjaj: string;
  lokacija: string;
}

export interface AuthToken {
  token: string;
  tip: TokenTip;
  istice: string;
  korisnikId: string;
}

export interface AuthDozvola {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  uloge: KorisnickaUloga[];
}

export interface AuthKonfiguracija {
  jwtTajna: string;
  jwtIsticanje: string;
  refreshIsticanje: string;
  maxSesija: number;
  dvofaktorObavezan: boolean;
  oauthProvajderi: OAuthProvajder[];
  dozvoljeneDomene: string[];
}

export interface AutentifikacijaSistem {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  konfiguracija: AuthKonfiguracija;
  dozvole: AuthDozvola[];
  mogucnosti: string[];
  status: 'aktivan' | 'odrzavanje';
}

// ─── Dozvole ─────────────────────────────────────────────

export const dozvole: AuthDozvola[] = [
  {
    id: 'pregled-platformi',
    naziv: 'Pregled platformi',
    opis: 'Pristup i pregled svih platformi u ekosistemu',
    ikona: '🌐',
    uloge: ['korisnik', 'moderator', 'admin', 'super-admin', 'vlasnik'],
  },
  {
    id: 'upravljanje-korisnicima',
    naziv: 'Upravljanje korisnicima',
    opis: 'Kreiranje, izmena i brisanje korisničkih naloga',
    ikona: '👥',
    uloge: ['admin', 'super-admin', 'vlasnik'],
  },
  {
    id: 'upravljanje-placanjima',
    naziv: 'Upravljanje plaćanjima',
    opis: 'Pregled transakcija, refundiranje i finansijsko upravljanje',
    ikona: '💳',
    uloge: ['admin', 'super-admin', 'vlasnik'],
  },
  {
    id: 'admin-panel',
    naziv: 'Admin panel',
    opis: 'Pristup administratorskom panelu za upravljanje sistemom',
    ikona: '⚙️',
    uloge: ['admin', 'super-admin', 'vlasnik'],
  },
  {
    id: 'api-pristup',
    naziv: 'API pristup',
    opis: 'Korišćenje REST i GraphQL API endpointa',
    ikona: '🔌',
    uloge: ['korisnik', 'moderator', 'admin', 'super-admin', 'vlasnik'],
  },
  {
    id: 'omega-ai-pristup',
    naziv: 'OMEGA AI pristup',
    opis: `Interakcija sa ${OMEGA_AI_PERSONA_COUNT} OMEGA AI persona`,
    ikona: '🤖',
    uloge: ['moderator', 'admin', 'super-admin', 'vlasnik'],
  },
  {
    id: 'spaja-pro-koriscenje',
    naziv: 'SpajaPro korišćenje',
    opis: 'Aktiviranje i korišćenje SpajaPro v6-v15 endžina',
    ikona: '🚀',
    uloge: ['korisnik', 'moderator', 'admin', 'super-admin', 'vlasnik'],
  },
  {
    id: 'baza-podataka',
    naziv: 'Baza podataka',
    opis: 'Direktan pristup SPAJA BAZI za čitanje i pisanje podataka',
    ikona: '💾',
    uloge: ['admin', 'super-admin', 'vlasnik'],
  },
  {
    id: 'marketing',
    naziv: 'Marketing',
    opis: 'Upravljanje marketinškim kampanjama i analitikom',
    ikona: '📢',
    uloge: ['moderator', 'admin', 'super-admin', 'vlasnik'],
  },
  {
    id: 'vlasnicke-funkcije',
    naziv: 'Vlasničke funkcije',
    opis: 'Ekstremne autorizacije — potpuna kontrola nad celim sistemom',
    ikona: '👑',
    uloge: ['vlasnik'],
  },
  {
    id: 'moderacija-sadrzaja',
    naziv: 'Moderacija sadržaja',
    opis: 'Pregled i moderacija korisničkog sadržaja na platformi',
    ikona: '🛡️',
    uloge: ['moderator', 'admin', 'super-admin', 'vlasnik'],
  },
  {
    id: 'izvestaji-analitika',
    naziv: 'Izveštaji i analitika',
    opis: 'Pristup detaljnim izveštajima, statistikama i analitici sistema',
    ikona: '📊',
    uloge: ['admin', 'super-admin', 'vlasnik'],
  },
];

// ─── Konfiguracija ───────────────────────────────────────

export const authKonfiguracija: AuthKonfiguracija = {
  jwtTajna: process.env.JWT_SECRET ?? 'development-only-secret',
  jwtIsticanje: '15m',
  refreshIsticanje: '7d',
  maxSesija: 5,
  dvofaktorObavezan: false,
  oauthProvajderi: ['google', 'github', 'email'],
  dozvoljeneDomene: [
    'ai-iq-super-platforma.vercel.app',
    'spaja.rs',
    'digitalnaindustrija.com',
    'localhost',
  ],
};

// ─── Mogućnosti ──────────────────────────────────────────

const authMogucnosti: string[] = [
  'JWT autentifikacija sa pristupnim i refresh tokenima',
  'OAuth 2.0 integracija — Google i GitHub provajderi',
  'Dvofaktorska autentifikacija (2FA) sa TOTP',
  'Role-based access control (RBAC) sa 5 nivoa uloga',
  'Automatsko obnavljanje sesija putem refresh tokena',
  'Brute-force zaštita sa rate limiting mehanizmom',
  'CORS konfiguracija za dozvoljene domene',
  'Enkripcija lozinki putem bcrypt algoritma',
  'Email verifikacija za nove korisnike',
  'Reset lozinke putem sigurnosnog tokena',
  `Integracija sa ${OMEGA_AI_PERSONA_COUNT} OMEGA AI persona`,
  'Vlasnički VIP pristup sa ekstremnim autorizacijama',
  'Audit log za sve autentifikacione događaje',
  'Podrška za više simultanih sesija po korisniku',
  'Automatsko zaključavanje naloga nakon neuspelih pokušaja',
];

// ─── Glavni Sistem — Autentifikacija ─────────────────────

export const autentifikacijaSistem: AutentifikacijaSistem = {
  naziv: 'Autentifikacija & Sigurnosni Sistem',
  opis: `Centralizovani sistem za autentifikaciju, autorizaciju i upravljanje sesijama u ${APP_NAME} ekosistemu — ${KOMPANIJA}`,
  ikona: '🔐',
  verzija: APP_VERSION,
  konfiguracija: authKonfiguracija,
  dozvole,
  mogucnosti: authMogucnosti,
  status: 'aktivan',
};

// ─── Helper funkcije ─────────────────────────────────────

export function getDozvola(id: string): AuthDozvola | undefined {
  return dozvole.find((d) => d.id === id);
}

export function getDozvoleZaUlogu(uloga: KorisnickaUloga): AuthDozvola[] {
  return dozvole.filter((d) => d.uloge.includes(uloga));
}

export function imaDozvolu(uloga: KorisnickaUloga, dozvolaId: string): boolean {
  const dozvola = getDozvola(dozvolaId);
  if (!dozvola) return false;
  return dozvola.uloge.includes(uloga);
}

export function getAuthPregled(): {
  naziv: string;
  verzija: string;
  status: string;
  ukupnoDozvola: number;
  ukupnoMogucnosti: number;
  maxSesija: number;
  oauthProvajderi: OAuthProvajder[];
  dozvoljeneDomene: string[];
  dvofaktorObavezan: boolean;
  uloge: KorisnickaUloga[];
  dozvolePoUlozi: Record<KorisnickaUloga, number>;
} {
  const uloge: KorisnickaUloga[] = ['korisnik', 'moderator', 'admin', 'super-admin', 'vlasnik'];

  const dozvolePoUlozi = {} as Record<KorisnickaUloga, number>;
  for (const uloga of uloge) {
    dozvolePoUlozi[uloga] = getDozvoleZaUlogu(uloga).length;
  }

  return {
    naziv: autentifikacijaSistem.naziv,
    verzija: autentifikacijaSistem.verzija,
    status: autentifikacijaSistem.status,
    ukupnoDozvola: dozvole.length,
    ukupnoMogucnosti: authMogucnosti.length,
    maxSesija: authKonfiguracija.maxSesija,
    oauthProvajderi: authKonfiguracija.oauthProvajderi,
    dozvoljeneDomene: authKonfiguracija.dozvoljeneDomene,
    dvofaktorObavezan: authKonfiguracija.dvofaktorObavezan,
    uloge,
    dozvolePoUlozi,
  };
}
