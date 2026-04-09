/**
 * 💰 SPAJA Pricing & Login Stranice — Frontend za Registraciju i Plaćanje
 *
 * Pricing/Login modul generisan kroz SPAJA Generator za Endžine.
 * Pokriva stranice za registraciju, prijavljivanje i odabir planova.
 *
 * Link: https://chatgpt.com/c/68981608-32dc-832e-831e-9ff1a0ff485c
 * Integracija: Stripe Platni Sistem + Autentifikacija + SPAJA BAZA
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { APP_VERSION, KOMPANIJA } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type PricingPlanTip =
  | 'starter'
  | 'profesionalni'
  | 'biznis'
  | 'enterprise'
  | 'unlimited';

export type LoginMetod = 'email' | 'google' | 'github' | 'telefon';

export type RegistracijaStatus =
  | 'aktivna'
  | 'cekanje'
  | 'verifikacija'
  | 'zavrsena';

// ─── Interfejsi ──────────────────────────────────────────

export interface PricingPlan {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: PricingPlanTip;
  cenaMesecno: number;
  cenaGodisnje: number;
  valuta: string;
  mogucnosti: string[];
  preporucen: boolean;
  dugmeText: string;
  dugmeLink: string;
}

export interface LoginForma {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  metod: LoginMetod;
  url: string;
  aktivan: boolean;
}

export interface RegistracijaKorak {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  redosled: number;
  obavezan: boolean;
}

export interface PricingLoginSistem {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  link: string;
  planovi: PricingPlan[];
  loginMetode: LoginForma[];
  registracijaKoraci: RegistracijaKorak[];
  mogucnosti: string[];
  status: 'aktivan' | 'konfiguracija';
}

// ─── Pricing Planovi ─────────────────────────────────────

const pricingPlanovi: PricingPlan[] = [
  {
    id: 'plan-starter',
    naziv: 'Starter',
    opis: 'Početni plan — pristup osnovnim endžinima, 100 upita dnevno, standardna podrška',
    ikona: '🌱',
    tip: 'starter',
    cenaMesecno: 29,
    cenaGodisnje: 290,
    valuta: 'USD',
    mogucnosti: [
      'SpajaPro v6-v8 endžini',
      '100 upita dnevno',
      'Standardna podrška',
      'SPAJA BAZA — 1 GB',
      'Osnovna analitika',
    ],
    preporucen: false,
    dugmeText: 'Započni Starter',
    dugmeLink: '/pricing/starter',
  },
  {
    id: 'plan-profesionalni',
    naziv: 'Profesionalni',
    opis: 'Plan za profesionalce — pristup v6-v11 endžinima, 500 upita dnevno, prioritetna podrška',
    ikona: '💼',
    tip: 'profesionalni',
    cenaMesecno: 79,
    cenaGodisnje: 790,
    valuta: 'USD',
    mogucnosti: [
      'SpajaPro v6-v11 endžini',
      '500 upita dnevno',
      'Prioritetna podrška',
      'SPAJA BAZA — 10 GB',
      'Napredna analitika',
      'OMEGA AI pristup',
    ],
    preporucen: true,
    dugmeText: 'Izaberi Profesionalni',
    dugmeLink: '/pricing/profesionalni',
  },
  {
    id: 'plan-biznis',
    naziv: 'Biznis',
    opis: 'Poslovni plan — svi v6-v15 endžini, 2.000 upita dnevno, premium podrška',
    ikona: '🏢',
    tip: 'biznis',
    cenaMesecno: 199,
    cenaGodisnje: 1990,
    valuta: 'USD',
    mogucnosti: [
      'SpajaPro v6-v15 endžini',
      '2.000 upita dnevno',
      'Premium podrška',
      'SPAJA BAZA — 50 GB',
      'Kompletna analitika',
      'OMEGA AI pun pristup',
      'Proksi mreža',
    ],
    preporucen: false,
    dugmeText: 'Izaberi Biznis',
    dugmeLink: '/pricing/biznis',
  },
  {
    id: 'plan-enterprise',
    naziv: 'Enterprise',
    opis: 'Enterprise plan — svi endžini, beskonačne sesije, dedicirani resursi, 24/7 podrška',
    ikona: '🏛️',
    tip: 'enterprise',
    cenaMesecno: 499,
    cenaGodisnje: 4990,
    valuta: 'USD',
    mogucnosti: [
      'Svi SpajaPro endžini',
      'Beskonačne sesije',
      '24/7 dedicirani support',
      'SPAJA BAZA — 200 GB',
      'Custom analitika i izveštaji',
      'OMEGA AI sve persone',
      'Proksi mreža + WiFi Antena',
      'Dedicirani resursi',
    ],
    preporucen: false,
    dugmeText: 'Kontaktiraj nas',
    dugmeLink: '/pricing/enterprise',
  },
  {
    id: 'plan-unlimited',
    naziv: 'Unlimited VIP',
    opis: 'Ultimativni plan — sve bez ograničenja, VIP podrška, lični menadžer, pristup budućim verzijama',
    ikona: '👑',
    tip: 'unlimited',
    cenaMesecno: 999,
    cenaGodisnje: 9990,
    valuta: 'USD',
    mogucnosti: [
      'Sve bez ograničenja',
      'VIP podrška sa ličnim menadžerom',
      'SPAJA BAZA — neograničeno',
      'Pristup budućim verzijama',
      'OMEGA AI kompletna orkestracija',
      'Proksi mreža — full pristup',
      'Gaming Dimenzije uključene',
      'Prioritet kod novih funkcionalnosti',
      'Custom integracije',
    ],
    preporucen: false,
    dugmeText: 'Postani VIP',
    dugmeLink: '/pricing/unlimited',
  },
];

// ─── Login Metode ────────────────────────────────────────

const loginMetode: LoginForma[] = [
  {
    id: 'login-email',
    naziv: 'Email prijava',
    opis: 'Klasična prijava putem email adrese i lozinke',
    ikona: '📧',
    metod: 'email',
    url: '/auth/login/email',
    aktivan: true,
  },
  {
    id: 'login-google',
    naziv: 'Google prijava',
    opis: 'Brza prijava putem Google naloga (OAuth 2.0)',
    ikona: '🔵',
    metod: 'google',
    url: '/auth/login/google',
    aktivan: true,
  },
  {
    id: 'login-github',
    naziv: 'GitHub prijava',
    opis: 'Prijava putem GitHub naloga za developere',
    ikona: '🐙',
    metod: 'github',
    url: '/auth/login/github',
    aktivan: true,
  },
  {
    id: 'login-telefon',
    naziv: 'Telefonska prijava',
    opis: 'Prijava putem broja telefona i SMS verifikacije',
    ikona: '📱',
    metod: 'telefon',
    url: '/auth/login/telefon',
    aktivan: true,
  },
];

// ─── Registracija Koraci ─────────────────────────────────

const registracijaKoraci: RegistracijaKorak[] = [
  {
    id: 'korak-nalog',
    naziv: 'Kreiranje naloga',
    opis: 'Unos osnovnih podataka — ime, email, lozinka',
    ikona: '👤',
    redosled: 1,
    obavezan: true,
  },
  {
    id: 'korak-verifikacija',
    naziv: 'Email verifikacija',
    opis: 'Potvrda email adrese putem verifikacionog linka',
    ikona: '✉️',
    redosled: 2,
    obavezan: true,
  },
  {
    id: 'korak-profil',
    naziv: 'Podešavanje profila',
    opis: 'Dodavanje profilne slike, biografije i preferencija',
    ikona: '⚙️',
    redosled: 3,
    obavezan: false,
  },
  {
    id: 'korak-plan',
    naziv: 'Odabir plana',
    opis: 'Izbor pricing plana — Starter, Profesionalni, Biznis, Enterprise ili Unlimited',
    ikona: '💳',
    redosled: 4,
    obavezan: true,
  },
  {
    id: 'korak-dobrodoslica',
    naziv: 'Dobrodošlica',
    opis: 'Uvodni vodič i pristup platformi',
    ikona: '🎉',
    redosled: 5,
    obavezan: false,
  },
];

// ─── Mogućnosti ──────────────────────────────────────────

const pricingLoginMogucnosti: string[] = [
  'Stripe Checkout za sigurno plaćanje',
  'OAuth 2.0 prijava (Google, GitHub)',
  'Email i SMS verifikacija',
  'Multi-step registracija sa progres barom',
  'Automatsko aktiviranje pretplate',
  'Responzivni pricing table sa poređenjem planova',
  'Promo kodovi i kuponi za popuste',
  'Besplatni trial period za nove korisnike',
  `Integracija sa ${KOMPANIJA} autentifikacijom`,
  'SPAJA BAZA za skladištenje korisničkih podataka',
];

// ─── Glavni Objekat — SPAJA Pricing & Login ──────────────

export const spajaPricingLogin: PricingLoginSistem = {
  naziv: 'SPAJA Pricing & Login',
  opis: `Frontend za registraciju, prijavljivanje i odabir planova u AI IQ SUPER PLATFORMA ekosistemu — ${KOMPANIJA}`,
  ikona: '💰',
  verzija: APP_VERSION,
  link: 'https://chatgpt.com/c/68981608-32dc-832e-831e-9ff1a0ff485c',
  planovi: pricingPlanovi,
  loginMetode,
  registracijaKoraci,
  mogucnosti: pricingLoginMogucnosti,
  status: 'aktivan',
};

// ─── Helper funkcije ─────────────────────────────────────

/** Pronalazi pricing plan po tipu */
export function getPlanPoTipu(tip: PricingPlanTip): PricingPlan | undefined {
  return pricingPlanovi.find((p) => p.tip === tip);
}

/** Vraća preporučeni plan */
export function getPreporuceniPlan(): PricingPlan | undefined {
  return pricingPlanovi.find((p) => p.preporucen);
}

/** Vraća sve aktivne login metode */
export function getLoginMetode(): LoginForma[] {
  return loginMetode.filter((l) => l.aktivan);
}

/** Vraća pregled pricing/login sistema — sažetak za dashboard */
export function getPricingLoginPregled(): {
  naziv: string;
  verzija: string;
  status: string;
  ukupnoPlanova: number;
  ukupnoLoginMetoda: number;
  ukupnoKoraka: number;
  ukupnoMogucnosti: number;
  preporuceniPlan: string | undefined;
  planovi: Array<{
    id: string;
    naziv: string;
    cenaMesecno: number;
    cenaGodisnje: number;
  }>;
} {
  const preporucen = getPreporuceniPlan();

  return {
    naziv: spajaPricingLogin.naziv,
    verzija: spajaPricingLogin.verzija,
    status: spajaPricingLogin.status,
    ukupnoPlanova: pricingPlanovi.length,
    ukupnoLoginMetoda: loginMetode.length,
    ukupnoKoraka: registracijaKoraci.length,
    ukupnoMogucnosti: pricingLoginMogucnosti.length,
    preporuceniPlan: preporucen?.naziv,
    planovi: pricingPlanovi.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      cenaMesecno: p.cenaMesecno,
      cenaGodisnje: p.cenaGodisnje,
    })),
  };
}
