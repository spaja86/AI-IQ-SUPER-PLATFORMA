/**
 * 📝 SPAJA Blog & FAQ — Content Marketing Modul
 *
 * Blog i FAQ sistem za content marketing na AI IQ SUPER PLATFORMA.
 * Članci, vodiči, FAQ pitanja za korisnike i SEO optimizaciju.
 *
 * Integracija: OMEGA AI + SpajaPro Prompt + SEO
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { APP_VERSION, KOMPANIJA } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type BlogKategorija =
  | 'tehnologija'
  | 'tutorial'
  | 'vest'
  | 'analiza'
  | 'vodic'
  | 'najava';

export type FAQKategorija =
  | 'opste'
  | 'placanje'
  | 'tehnicko'
  | 'bezbednost'
  | 'integracija'
  | 'podrska';

// ─── Interfejsi ──────────────────────────────────────────

export interface BlogClanak {
  id: string;
  naslov: string;
  opis: string;
  ikona: string;
  kategorija: BlogKategorija;
  autor: string;
  sadrzaj: string;
  datum: string;
  citanja: number;
  oznake: string[];
  istaknut: boolean;
}

export interface FAQPitanje {
  id: string;
  pitanje: string;
  odgovor: string;
  ikona: string;
  kategorija: FAQKategorija;
  korisno: number;
  redosled: number;
}

export interface BlogFaqStatistika {
  ukupnoClanaka: number;
  ukupnoPitanja: number;
  ukupnoCitanja: number;
  prosecnaCitanja: number;
}

export interface SpajaBlogFaq {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  clanci: BlogClanak[];
  faqPitanja: FAQPitanje[];
  statistika: BlogFaqStatistika;
  mogucnosti: string[];
  status: 'aktivan' | 'draft';
}

// ─── Blog Članci ─────────────────────────────────────────

const blogClanci: BlogClanak[] = [
  {
    id: 'blog-spajapro-v15',
    naslov: 'SpajaPro v15 — Nova Era AI Endžina',
    opis: 'Pregled novih mogućnosti SpajaPro v15 — multifunkcionalni endžin, beskonačne sesije i SPAJA BAZA',
    ikona: '🌟',
    kategorija: 'najava',
    autor: 'SPAJA Tim',
    sadrzaj: 'SpajaPro v15 donosi revolucionarne promene u AI endžin tehnologiji...',
    datum: '2025-07-01',
    citanja: 15_230,
    oznake: ['SpajaPro', 'v15', 'AI', 'endžin'],
    istaknut: true,
  },
  {
    id: 'blog-omega-ai-persone',
    naslov: 'OMEGA AI — 21 Persona za Svaki Zadatak',
    opis: 'Upoznajte svih 21 OMEGA AI personu i njihove specijalizacije',
    ikona: '🧠',
    kategorija: 'tehnologija',
    autor: 'OMEGA AI Tim',
    sadrzaj: 'OMEGA AI sistem sa 21 personom pokriva svaki aspekt digitalnog poslovanja...',
    datum: '2025-06-28',
    citanja: 12_450,
    oznake: ['OMEGA AI', 'persone', 'orkestracija'],
    istaknut: true,
  },
  {
    id: 'blog-prompt-tutorial',
    naslov: 'Vodič: Prompt Inženjering za Početnike',
    opis: 'Naučite osnove prompt inženjeringa sa SpajaPro Univerzalnim Promptom',
    ikona: '🎓',
    kategorija: 'tutorial',
    autor: 'Edukacija Tim',
    sadrzaj: 'Prompt inženjering je veština kreiranja efektivnih upita za AI sisteme...',
    datum: '2025-06-25',
    citanja: 8_920,
    oznake: ['prompt', 'tutorial', 'početnici'],
    istaknut: false,
  },
  {
    id: 'blog-proksi-mreza',
    naslov: 'Proksi Mreža — Hipsoneurični Signal u Praksi',
    opis: 'Kako Proksi mreža koristi hipsoneurični signal za ultra-brzu komunikaciju',
    ikona: '📡',
    kategorija: 'tehnologija',
    autor: 'Proksi Tim',
    sadrzaj: 'Proksi mreža je revolucionarni mrežni sistem koji koristi hipsoneurične signale...',
    datum: '2025-06-22',
    citanja: 6_780,
    oznake: ['Proksi', 'mreža', 'signal'],
    istaknut: false,
  },
  {
    id: 'blog-gaming-dimenzije',
    naslov: 'Gaming Dimenzije — Od 360D do 5760D',
    opis: 'Istraživanje dimenzionalnog gaming sistema sa 95 igrica',
    ikona: '🎮',
    kategorija: 'analiza',
    autor: 'Gaming Tim',
    sadrzaj: 'Gaming Dimenzije predstavljaju jedinstven pristup gaming industriji...',
    datum: '2025-06-18',
    citanja: 9_340,
    oznake: ['gaming', 'dimenzije', 'igrice'],
    istaknut: false,
  },
  {
    id: 'blog-stripe-integracija',
    naslov: 'Vodič: Stripe Integracija sa SPAJA Platnim Sistemom',
    opis: 'Korak-po-korak vodič za integraciju Stripe plaćanja',
    ikona: '💳',
    kategorija: 'vodic',
    autor: 'DevOps Tim',
    sadrzaj: 'SPAJA Platni Sistem koristi Stripe za sigurno procesiranje plaćanja...',
    datum: '2025-06-15',
    citanja: 5_120,
    oznake: ['Stripe', 'plaćanje', 'integracija'],
    istaknut: false,
  },
  {
    id: 'blog-auto-popravka',
    naslov: 'Auto-Popravka — AI koji Sam Popravlja Greške',
    opis: 'Kako OMEGA AI automatski detektuje i popravlja greške u produkciji',
    ikona: '🔧',
    kategorija: 'tehnologija',
    autor: 'AI Tim',
    sadrzaj: 'Auto-Popravka sistem koristi OMEGA AI za automatsko rešavanje grešaka...',
    datum: '2025-06-12',
    citanja: 7_650,
    oznake: ['auto-popravka', 'AI', 'monitoring'],
    istaknut: true,
  },
  {
    id: 'blog-platforma-vest',
    naslov: 'AI IQ SUPER PLATFORMA Dostiže 100.000 Korisnika',
    opis: 'Platforma je premašila 100.000 registrovanih korisnika',
    ikona: '🎉',
    kategorija: 'vest',
    autor: 'Marketing Tim',
    sadrzaj: 'Sa ponosom objavljujemo da je AI IQ SUPER PLATFORMA dostigla...',
    datum: '2025-06-10',
    citanja: 18_900,
    oznake: ['vest', 'milestone', 'korisnici'],
    istaknut: true,
  },
];

// ─── FAQ Pitanja ─────────────────────────────────────────

const faqPitanja: FAQPitanje[] = [
  {
    id: 'faq-sta-je-platforma',
    pitanje: 'Šta je AI IQ SUPER PLATFORMA?',
    odgovor: 'AI IQ SUPER PLATFORMA je centralna digitalna platforma koja objedinjuje sve SPAJA servise — SpajaPro AI, OMEGA AI, Proksi mrežu, Gaming Dimenzije i mnoge druge module u jedinstven ekosistem.',
    ikona: '🏛️',
    kategorija: 'opste',
    korisno: 342,
    redosled: 1,
  },
  {
    id: 'faq-kako-registracija',
    pitanje: 'Kako se registrovati na platformi?',
    odgovor: 'Registracija je jednostavna — kliknite na "Registruj se", unesite email i lozinku, verifikujte email i izaberite plan koji vam odgovara. Dostupna je i prijava putem Google ili GitHub naloga.',
    ikona: '👤',
    kategorija: 'opste',
    korisno: 289,
    redosled: 2,
  },
  {
    id: 'faq-koji-planovi',
    pitanje: 'Koji pricing planovi su dostupni?',
    odgovor: 'Nudimo 5 planova: Starter ($29/mesečno), Profesionalni ($79/mesečno), Biznis ($199/mesečno), Enterprise ($499/mesečno) i Unlimited VIP ($999/mesečno). Svi planovi imaju popust za godišnju pretplatu.',
    ikona: '💰',
    kategorija: 'placanje',
    korisno: 456,
    redosled: 3,
  },
  {
    id: 'faq-nacin-placanja',
    pitanje: 'Koji načini plaćanja su podržani?',
    odgovor: 'Podržavamo kartice (Visa, Mastercard, Amex), bank transfer, PayPal i kripto plaćanja (BTC, ETH) putem Stripe platnog sistema.',
    ikona: '💳',
    kategorija: 'placanje',
    korisno: 198,
    redosled: 4,
  },
  {
    id: 'faq-sta-je-spajapro',
    pitanje: 'Šta je SpajaPro i koje verzije postoje?',
    odgovor: 'SpajaPro je AI endžin sa 10 verzija (v6 do v15). Svaka verzija ima jedinstvene mogućnosti — od osnovnog chat-a do multifunkcionalnog rada sa beskonačnim sesijama i SPAJA BAZOM.',
    ikona: '🌟',
    kategorija: 'tehnicko',
    korisno: 367,
    redosled: 5,
  },
  {
    id: 'faq-bezbednost-podataka',
    pitanje: 'Kako su moji podaci zaštićeni?',
    odgovor: 'Koristimo end-to-end enkripciju, PCI DSS Level 1 usklađenost za plaćanja, 2FA autentifikaciju i redovne sigurnosne revizije. Svi podaci se čuvaju u SPAJA BAZA sa automatskim backup-om.',
    ikona: '🔒',
    kategorija: 'bezbednost',
    korisno: 512,
    redosled: 6,
  },
  {
    id: 'faq-api-integracija',
    pitanje: 'Da li postoji API za integraciju?',
    odgovor: 'Da, nudimo RESTful API i WebSocket konekcije za integraciju sa vašim sistemima. API dokumentacija je dostupna na /docs/api sa primerima za sve endpointe.',
    ikona: '🔗',
    kategorija: 'integracija',
    korisno: 234,
    redosled: 7,
  },
  {
    id: 'faq-omega-ai',
    pitanje: 'Šta je OMEGA AI i kako radi?',
    odgovor: 'OMEGA AI je napredni AI sistem sa 21 personom i 8 oktavnih nivoa. Svaka persona je specijalizovana za određenu oblast — od kodiranja do kreativnog pisanja, analize podataka i korisničke podrške.',
    ikona: '🧠',
    kategorija: 'tehnicko',
    korisno: 445,
    redosled: 8,
  },
  {
    id: 'faq-podrska-kontakt',
    pitanje: 'Kako kontaktirati korisničku podršku?',
    odgovor: 'Podrška je dostupna putem live chata na platformi, email-a na support@spaja.rs i putem OMEGA AI asistenta koji je dostupan 24/7.',
    ikona: '📞',
    kategorija: 'podrska',
    korisno: 178,
    redosled: 9,
  },
  {
    id: 'faq-refund-politika',
    pitanje: 'Koja je politika povrata sredstava?',
    odgovor: 'Nudimo pun povrat sredstava u roku od 30 dana od kupovine bez pitanja. Za godišnje pretplate, povrat se vrši proporcionalno neiskorišćenom periodu.',
    ikona: '💸',
    kategorija: 'placanje',
    korisno: 267,
    redosled: 10,
  },
];

// ─── Mogućnosti ──────────────────────────────────────────

const blogFaqMogucnosti: string[] = [
  'SEO optimizovani blog članci',
  'Kategorisani FAQ sa pretragom',
  'Automatsko generisanje sadržaja putem OMEGA AI',
  'Markdown i rich-text podrška za članke',
  'Sistem oznaka (tagova) za lakšu navigaciju',
  'Istaknuti članci na naslovnoj stranici',
  'Sistem glasanja za korisnost FAQ odgovora',
  `Content marketing integracija sa ${KOMPANIJA}`,
];

// ─── Statistika ──────────────────────────────────────────

function izracunajStatistiku(): BlogFaqStatistika {
  const ukupnoCitanja = blogClanci.reduce((sum, c) => sum + c.citanja, 0);
  const prosecnaCitanja = Math.round(ukupnoCitanja / blogClanci.length);

  return {
    ukupnoClanaka: blogClanci.length,
    ukupnoPitanja: faqPitanja.length,
    ukupnoCitanja,
    prosecnaCitanja,
  };
}

// ─── Glavni Objekat — SPAJA Blog & FAQ ───────────────────

export const spajaBlogFaq: SpajaBlogFaq = {
  naziv: 'SPAJA Blog & FAQ',
  opis: `Blog i FAQ sistem za content marketing i korisničku podršku — ${KOMPANIJA}`,
  ikona: '📝',
  verzija: APP_VERSION,
  clanci: blogClanci,
  faqPitanja,
  statistika: izracunajStatistiku(),
  mogucnosti: blogFaqMogucnosti,
  status: 'aktivan',
};

// ─── Helper funkcije ─────────────────────────────────────

/** Vraća članke po kategoriji */
export function getClanciPoKategoriji(kategorija: BlogKategorija): BlogClanak[] {
  return blogClanci.filter((c) => c.kategorija === kategorija);
}

/** Vraća istaknute članke */
export function getIstaknutiClanci(): BlogClanak[] {
  return blogClanci.filter((c) => c.istaknut);
}

/** Vraća FAQ pitanja po kategoriji */
export function getFaqPoKategoriji(kategorija: FAQKategorija): FAQPitanje[] {
  return faqPitanja.filter((f) => f.kategorija === kategorija);
}

/** Vraća pregled Blog & FAQ sistema — sažetak za dashboard */
export function getBlogFaqPregled(): {
  naziv: string;
  verzija: string;
  status: string;
  ukupnoClanaka: number;
  ukupnoPitanja: number;
  ukupnoCitanja: number;
  prosecnaCitanja: number;
  istaknutihClanaka: number;
  ukupnoMogucnosti: number;
} {
  const statistika = izracunajStatistiku();

  return {
    naziv: spajaBlogFaq.naziv,
    verzija: spajaBlogFaq.verzija,
    status: spajaBlogFaq.status,
    ukupnoClanaka: statistika.ukupnoClanaka,
    ukupnoPitanja: statistika.ukupnoPitanja,
    ukupnoCitanja: statistika.ukupnoCitanja,
    prosecnaCitanja: statistika.prosecnaCitanja,
    istaknutihClanaka: blogClanci.filter((c) => c.istaknut).length,
    ukupnoMogucnosti: blogFaqMogucnosti.length,
  };
}
