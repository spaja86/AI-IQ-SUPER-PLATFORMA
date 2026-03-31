/**
 * 💬 SPAJA Univerzalni Prompt — Sistem za SpajaUltraOmegaCore -∞Ω+∞
 *
 * Univerzalni Prompt sistem koji omogućava komunikaciju sa
 * celokupnim OMEGA AI ekosistemom kroz strukturirane promptove.
 *
 * Svaki prompt je organizovan po kategoriji, OMEGA oktavi,
 * ciljnoj personi i nivou prioriteta.
 *
 * Promptovi pokrivaju sve aspekte Digitalne Industrije:
 * arhitekturu, bezbednost, razvoj, kvalitet, kreaciju,
 * optimizaciju, inteligenciju, koordinaciju i evoluciju.
 */

import type { OktavniNivo } from './omega-ai';

// ─── Tipovi ─────────────────────────────────────────────────────────

export type PromptKategorija =
  | 'arhitektura'
  | 'bezbednost'
  | 'razvoj'
  | 'kvalitet'
  | 'kreacija'
  | 'optimizacija'
  | 'inteligencija'
  | 'koordinacija'
  | 'evolucija'
  | 'proksi'
  | 'mobilna-mreza'
  | 'univerzalni';

export type PromptPrioritet = 'kritican' | 'visok' | 'srednji' | 'nizak';

export type PromptStatus = 'aktivan' | 'razvoj' | 'planiranje' | 'arhiviran';

export interface UniverzalniPrompt {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: PromptKategorija;
  oktavniNivo: OktavniNivo;
  ciljnaPersona: string;
  prioritet: PromptPrioritet;
  status: PromptStatus;
  sablon: string;
  primer: string;
  tagovi: string[];
}

export interface PromptKategorijaInfo {
  id: PromptKategorija;
  naziv: string;
  opis: string;
  ikona: string;
  oktavniNivo: OktavniNivo;
  brojPromptova: number;
}

export interface UniverzalniPromptSistem {
  naziv: string;
  verzija: string;
  opis: string;
  jezgro: string;
  promptovi: UniverzalniPrompt[];
  kategorije: PromptKategorijaInfo[];
  ukupnoPromptova: number;
  aktivnihPromptova: number;
}

// ═══════════════════════════════════════════════════════════════════
// KATEGORIJE PROMPTOVA
// ═══════════════════════════════════════════════════════════════════

export const promptKategorije: PromptKategorijaInfo[] = [
  {
    id: 'arhitektura',
    naziv: 'Arhitektura',
    opis: 'Promptovi za sistemsku arhitekturu, dizajn i strukturalne odluke',
    ikona: '🏗️',
    oktavniNivo: 1,
    brojPromptova: 3,
  },
  {
    id: 'bezbednost',
    naziv: 'Bezbednost',
    opis: 'Promptovi za zaštitu, dijagnostiku i integritet sistema',
    ikona: '🛡️',
    oktavniNivo: 2,
    brojPromptova: 3,
  },
  {
    id: 'kvalitet',
    naziv: 'Kvalitet',
    opis: 'Promptovi za testiranje, dokumentaciju i osiguranje kvaliteta',
    ikona: '🧪',
    oktavniNivo: 3,
    brojPromptova: 3,
  },
  {
    id: 'kreacija',
    naziv: 'Kreacija',
    opis: 'Promptovi za dizajn, UI/UX i kreativni sadržaj',
    ikona: '🎨',
    oktavniNivo: 4,
    brojPromptova: 3,
  },
  {
    id: 'optimizacija',
    naziv: 'Optimizacija',
    opis: 'Promptovi za performanse, skaliranje i efikasnost',
    ikona: '⚡',
    oktavniNivo: 5,
    brojPromptova: 3,
  },
  {
    id: 'inteligencija',
    naziv: 'Inteligencija',
    opis: 'Promptovi za istraživanje, analitiku i nove tehnologije',
    ikona: '🔬',
    oktavniNivo: 6,
    brojPromptova: 3,
  },
  {
    id: 'koordinacija',
    naziv: 'Koordinacija',
    opis: 'Promptovi za strategiju, integraciju i upravljanje',
    ikona: '♟️',
    oktavniNivo: 7,
    brojPromptova: 3,
  },
  {
    id: 'evolucija',
    naziv: 'Evolucija',
    opis: 'Promptovi za evoluciju, nadgledanje i viziju',
    ikona: '🧬',
    oktavniNivo: 8,
    brojPromptova: 3,
  },
  {
    id: 'proksi',
    naziv: 'Proksi',
    opis: 'Promptovi za Proksi mrežu, signale i komunikaciju',
    ikona: '📡',
    oktavniNivo: 6,
    brojPromptova: 3,
  },
  {
    id: 'mobilna-mreza',
    naziv: 'Mobilna Mreža',
    opis: 'Promptovi za SPAJA mobilnu mrežu i servise',
    ikona: '📱',
    oktavniNivo: 5,
    brojPromptova: 3,
  },
  {
    id: 'razvoj',
    naziv: 'Razvoj',
    opis: 'Promptovi za implementaciju, feature development i refactoring',
    ikona: '🔨',
    oktavniNivo: 1,
    brojPromptova: 3,
  },
  {
    id: 'univerzalni',
    naziv: 'Univerzalni',
    opis: 'Meta-promptovi koji pokrivaju celokupan -∞Ω+∞ spektar',
    ikona: '♾️',
    oktavniNivo: 8,
    brojPromptova: 3,
  },
];

// ═══════════════════════════════════════════════════════════════════
// PROMPTOVI
// ═══════════════════════════════════════════════════════════════════

export const univerzalniPromptovi: UniverzalniPrompt[] = [
  // ── Oktava 1 — Arhitektura ────────────────────────────────────────
  {
    id: 'prompt-arhitektura-dizajn',
    naziv: 'Dizajn Arhitekture',
    opis: 'Dizajniraj kompletnu sistemsku arhitekturu za novi modul',
    ikona: '🏗️',
    kategorija: 'arhitektura',
    oktavniNivo: 1,
    ciljnaPersona: 'Arhitekta',
    prioritet: 'kritican',
    status: 'aktivan',
    sablon: 'prompt "Dizajniraj arhitekturu za {modul}" kategorija arhitektura nivo 1;',
    primer: 'prompt "Dizajniraj arhitekturu za Proksi čvor" kategorija arhitektura nivo 1;',
    tagovi: ['arhitektura', 'dizajn', 'struktura', 'modul'],
  },
  {
    id: 'prompt-arhitektura-skalabilnost',
    naziv: 'Skalabilnost Sistema',
    opis: 'Analiziraj i predloži skaliranje sistema za veći kapacitet',
    ikona: '📐',
    kategorija: 'arhitektura',
    oktavniNivo: 1,
    ciljnaPersona: 'Arhitekta',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Skaliraj {sistem} za {kapacitet}" kategorija arhitektura nivo 1;',
    primer: 'prompt "Skaliraj Proksi mrežu za 10²²⁸ TB" kategorija arhitektura nivo 1;',
    tagovi: ['skalabilnost', 'kapacitet', 'performanse'],
  },
  {
    id: 'prompt-arhitektura-integracija',
    naziv: 'Sistemska Integracija',
    opis: 'Integriši nove komponente u postojeću arhitekturu',
    ikona: '🔗',
    kategorija: 'arhitektura',
    oktavniNivo: 1,
    ciljnaPersona: 'Arhitekta',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Integriši {komponenta} u {sistem}" kategorija arhitektura nivo 1;',
    primer: 'prompt "Integriši mobilnu mrežu u Proksi sistem" kategorija arhitektura nivo 1;',
    tagovi: ['integracija', 'komponenta', 'sistem'],
  },

  // ── Oktava 1 — Razvoj ────────────────────────────────────────────
  {
    id: 'prompt-razvoj-implementacija',
    naziv: 'Implementacija Funkcionalnosti',
    opis: 'Implementiraj novu funkcionalnost prema specifikaciji',
    ikona: '🔨',
    kategorija: 'razvoj',
    oktavniNivo: 1,
    ciljnaPersona: 'Graditelj',
    prioritet: 'kritican',
    status: 'aktivan',
    sablon: 'prompt "Implementiraj {funkcionalnost}" kategorija razvoj nivo 1;',
    primer: 'prompt "Implementiraj OMEGA dispatch za oktavu 3" kategorija razvoj nivo 1;',
    tagovi: ['implementacija', 'feature', 'kod'],
  },
  {
    id: 'prompt-razvoj-refaktoring',
    naziv: 'Refaktoring Koda',
    opis: 'Refaktoriši postojeći kod za bolje performanse i čitljivost',
    ikona: '♻️',
    kategorija: 'razvoj',
    oktavniNivo: 1,
    ciljnaPersona: 'Graditelj',
    prioritet: 'srednji',
    status: 'aktivan',
    sablon: 'prompt "Refaktoriši {modul}" kategorija razvoj nivo 1;',
    primer: 'prompt "Refaktoriši omega-ai-dispatch za bolju elastičnu sinhronizaciju" kategorija razvoj nivo 1;',
    tagovi: ['refaktoring', 'kod', 'performanse'],
  },
  {
    id: 'prompt-razvoj-debug',
    naziv: 'Debagovanje Problema',
    opis: 'Pronađi i ispravi greške u sistemu',
    ikona: '🐛',
    kategorija: 'razvoj',
    oktavniNivo: 1,
    ciljnaPersona: 'Graditelj',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Debaguj {problem} u {modul}" kategorija razvoj nivo 1;',
    primer: 'prompt "Debaguj sinaptičku vezu u neurološkoj mreži" kategorija razvoj nivo 1;',
    tagovi: ['debug', 'greška', 'popravka'],
  },

  // ── Oktava 2 — Bezbednost ────────────────────────────────────────
  {
    id: 'prompt-bezbednost-audit',
    naziv: 'Bezbednosni Audit',
    opis: 'Izvrši potpuni bezbednosni audit sistema',
    ikona: '🛡️',
    kategorija: 'bezbednost',
    oktavniNivo: 2,
    ciljnaPersona: 'Čuvar',
    prioritet: 'kritican',
    status: 'aktivan',
    sablon: 'prompt "Bezbednosni audit za {sistem}" kategorija bezbednost nivo 2;',
    primer: 'prompt "Bezbednosni audit za API rute" kategorija bezbednost nivo 2;',
    tagovi: ['bezbednost', 'audit', 'sigurnost'],
  },
  {
    id: 'prompt-bezbednost-zastita',
    naziv: 'Aktivna Zaštita',
    opis: 'Implementiraj zaštitne mehanizme protiv pretnji',
    ikona: '🔐',
    kategorija: 'bezbednost',
    oktavniNivo: 2,
    ciljnaPersona: 'Čuvar',
    prioritet: 'kritican',
    status: 'aktivan',
    sablon: 'prompt "Zaštiti {resurs} od {pretnja}" kategorija bezbednost nivo 2;',
    primer: 'prompt "Zaštiti API endpoint od neovlašćenog pristupa" kategorija bezbednost nivo 2;',
    tagovi: ['zaštita', 'pristup', 'autorizacija'],
  },
  {
    id: 'prompt-bezbednost-dijagnostika',
    naziv: 'Sistemska Dijagnostika',
    opis: 'Pokreni dijagnostiku i identifikuj zdravstvene probleme',
    ikona: '⚕️',
    kategorija: 'bezbednost',
    oktavniNivo: 2,
    ciljnaPersona: 'Lekar',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Dijagnostikuj {sistem}" kategorija bezbednost nivo 2;',
    primer: 'prompt "Dijagnostikuj zdravlje Proksi mreže" kategorija bezbednost nivo 2;',
    tagovi: ['dijagnostika', 'zdravlje', 'popravka'],
  },

  // ── Oktava 3 — Kvalitet ──────────────────────────────────────────
  {
    id: 'prompt-kvalitet-testiranje',
    naziv: 'Automatsko Testiranje',
    opis: 'Kreiraj i izvrši automatske testove za modul',
    ikona: '🧪',
    kategorija: 'kvalitet',
    oktavniNivo: 3,
    ciljnaPersona: 'Tester',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Testiraj {modul} sa {vrsta} testovima" kategorija kvalitet nivo 3;',
    primer: 'prompt "Testiraj omega-ai sa integration testovima" kategorija kvalitet nivo 3;',
    tagovi: ['testiranje', 'QA', 'automatizacija'],
  },
  {
    id: 'prompt-kvalitet-dokumentacija',
    naziv: 'Dokumentacija Modula',
    opis: 'Napiši kompletnu dokumentaciju za modul ili API',
    ikona: '📝',
    kategorija: 'kvalitet',
    oktavniNivo: 3,
    ciljnaPersona: 'Dokumentar',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Dokumentuj {modul}" kategorija kvalitet nivo 3;',
    primer: 'prompt "Dokumentuj SpajaUltraOmegaCore API" kategorija kvalitet nivo 3;',
    tagovi: ['dokumentacija', 'API', 'docs'],
  },
  {
    id: 'prompt-kvalitet-revizija',
    naziv: 'Code Review',
    opis: 'Izvrši detaljnu reviziju koda za kvalitet i best practices',
    ikona: '🔎',
    kategorija: 'kvalitet',
    oktavniNivo: 3,
    ciljnaPersona: 'Tester',
    prioritet: 'srednji',
    status: 'aktivan',
    sablon: 'prompt "Revizija koda za {modul}" kategorija kvalitet nivo 3;',
    primer: 'prompt "Revizija koda za proksi-signal handler" kategorija kvalitet nivo 3;',
    tagovi: ['revizija', 'code-review', 'kvalitet'],
  },

  // ── Oktava 4 — Kreacija ──────────────────────────────────────────
  {
    id: 'prompt-kreacija-ui',
    naziv: 'UI/UX Dizajn',
    opis: 'Dizajniraj korisničko okruženje za novu stranicu ili komponentu',
    ikona: '🎨',
    kategorija: 'kreacija',
    oktavniNivo: 4,
    ciljnaPersona: 'Dizajner',
    prioritet: 'srednji',
    status: 'aktivan',
    sablon: 'prompt "Dizajniraj UI za {stranica}" kategorija kreacija nivo 4;',
    primer: 'prompt "Dizajniraj UI za OMEGA AI dashboard" kategorija kreacija nivo 4;',
    tagovi: ['UI', 'UX', 'dizajn', 'stranica'],
  },
  {
    id: 'prompt-kreacija-sadrzaj',
    naziv: 'Kreacija Sadržaja',
    opis: 'Kreiraj sadržaj, resurse i šablone za platformu',
    ikona: '✨',
    kategorija: 'kreacija',
    oktavniNivo: 4,
    ciljnaPersona: 'Kreator',
    prioritet: 'srednji',
    status: 'aktivan',
    sablon: 'prompt "Kreiraj {tip_sadrzaja} za {platforma}" kategorija kreacija nivo 4;',
    primer: 'prompt "Kreiraj sekvence za novu stranicu mobilne mreže" kategorija kreacija nivo 4;',
    tagovi: ['sadržaj', 'kreacija', 'resursi'],
  },
  {
    id: 'prompt-kreacija-vizuelni-identitet',
    naziv: 'Vizuelni Identitet',
    opis: 'Definiši vizuelni identitet za komponentu ili platformu',
    ikona: '🖼️',
    kategorija: 'kreacija',
    oktavniNivo: 4,
    ciljnaPersona: 'Dizajner',
    prioritet: 'nizak',
    status: 'aktivan',
    sablon: 'prompt "Vizuelni identitet za {entitet}" kategorija kreacija nivo 4;',
    primer: 'prompt "Vizuelni identitet za SpajaUltraOmegaCore brending" kategorija kreacija nivo 4;',
    tagovi: ['vizuelni-identitet', 'brending', 'tema'],
  },

  // ── Oktava 5 — Optimizacija ──────────────────────────────────────
  {
    id: 'prompt-optimizacija-performanse',
    naziv: 'Optimizacija Performansi',
    opis: 'Optimizuj performanse sistema — build, bundle, runtime',
    ikona: '⚡',
    kategorija: 'optimizacija',
    oktavniNivo: 5,
    ciljnaPersona: 'Optimizator',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Optimizuj performanse {sistem}" kategorija optimizacija nivo 5;',
    primer: 'prompt "Optimizuj performanse Next.js build-a" kategorija optimizacija nivo 5;',
    tagovi: ['performanse', 'optimizacija', 'brzina'],
  },
  {
    id: 'prompt-optimizacija-skaliranje',
    naziv: 'Skaliranje Infrastrukture',
    opis: 'Skaliraj infrastrukturu za veći broj korisnika i podataka',
    ikona: '📐',
    kategorija: 'optimizacija',
    oktavniNivo: 5,
    ciljnaPersona: 'Skalator',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Skaliraj {infrastruktura} za {cilj}" kategorija optimizacija nivo 5;',
    primer: 'prompt "Skaliraj Vercel deployment za globalni reach" kategorija optimizacija nivo 5;',
    tagovi: ['skaliranje', 'infrastruktura', 'CDN'],
  },
  {
    id: 'prompt-optimizacija-caching',
    naziv: 'Strategija Keširanje',
    opis: 'Implementiraj optimalnu strategiju keširanja na svim nivoima',
    ikona: '💾',
    kategorija: 'optimizacija',
    oktavniNivo: 5,
    ciljnaPersona: 'Optimizator',
    prioritet: 'srednji',
    status: 'aktivan',
    sablon: 'prompt "Keširanje za {resurs}" kategorija optimizacija nivo 5;',
    primer: 'prompt "Keširanje za API odgovore i statičke stranice" kategorija optimizacija nivo 5;',
    tagovi: ['keširanje', 'cache', 'performanse'],
  },

  // ── Oktava 5 — Mobilna Mreža ─────────────────────────────────────
  {
    id: 'prompt-mobilna-servis',
    naziv: 'Mobilni Servis',
    opis: 'Konfiguriši i optimizuj mobilni servis SPAJA mreže',
    ikona: '📱',
    kategorija: 'mobilna-mreza',
    oktavniNivo: 5,
    ciljnaPersona: 'Integrator',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Konfiguriši mobilni servis {servis}" kategorija mobilna-mreza nivo 5;',
    primer: 'prompt "Konfiguriši SPAJA Glas HD za kristalno čist prenos" kategorija mobilna-mreza nivo 5;',
    tagovi: ['mobilna', 'servis', 'mreža'],
  },
  {
    id: 'prompt-mobilna-centrala',
    naziv: 'Mobilna Centrala',
    opis: 'Upravljaj mobilnim centralama i pozivnim brojevima',
    ikona: '📞',
    kategorija: 'mobilna-mreza',
    oktavniNivo: 5,
    ciljnaPersona: 'Skalator',
    prioritet: 'srednji',
    status: 'aktivan',
    sablon: 'prompt "Upravljaj centralom {centrala}" kategorija mobilna-mreza nivo 5;',
    primer: 'prompt "Upravljaj centralom +38177 za primarnu zonu" kategorija mobilna-mreza nivo 5;',
    tagovi: ['centrala', 'telefon', 'zona'],
  },
  {
    id: 'prompt-mobilna-proksi-integracija',
    naziv: 'Proksi-Mobilna Integracija',
    opis: 'Integriši mobilnu mrežu sa Proksi signalnim sistemom',
    ikona: '🔗',
    kategorija: 'mobilna-mreza',
    oktavniNivo: 5,
    ciljnaPersona: 'Integrator',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Integriši mobilnu mrežu sa Proksi {signal}" kategorija mobilna-mreza nivo 5;',
    primer: 'prompt "Integriši mobilnu mrežu sa Proksi hipsoneuričnim signalom" kategorija mobilna-mreza nivo 5;',
    tagovi: ['integracija', 'proksi', 'mobilna'],
  },

  // ── Oktava 6 — Inteligencija ─────────────────────────────────────
  {
    id: 'prompt-inteligencija-istrazivanje',
    naziv: 'Istraživanje Tehnologija',
    opis: 'Istraži nove tehnologije i pristupe za unapređenje platforme',
    ikona: '🔬',
    kategorija: 'inteligencija',
    oktavniNivo: 6,
    ciljnaPersona: 'Naučnik',
    prioritet: 'srednji',
    status: 'aktivan',
    sablon: 'prompt "Istraži {tehnologija} za {cilj}" kategorija inteligencija nivo 6;',
    primer: 'prompt "Istraži edge computing za Proksi čvorove" kategorija inteligencija nivo 6;',
    tagovi: ['istraživanje', 'tehnologija', 'inovacija'],
  },
  {
    id: 'prompt-inteligencija-analitika',
    naziv: 'Analiza Podataka',
    opis: 'Analiziraj metrike, trendove i performanse ekosistema',
    ikona: '📊',
    kategorija: 'inteligencija',
    oktavniNivo: 6,
    ciljnaPersona: 'Analitičar',
    prioritet: 'srednji',
    status: 'aktivan',
    sablon: 'prompt "Analiziraj {metrika} za {period}" kategorija inteligencija nivo 6;',
    primer: 'prompt "Analiziraj zdravlje ekosistema za poslednji mesec" kategorija inteligencija nivo 6;',
    tagovi: ['analitika', 'metrike', 'trendovi'],
  },
  {
    id: 'prompt-inteligencija-benchmark',
    naziv: 'Benchmark Testiranje',
    opis: 'Izvrši benchmark testove za poređenje performansi',
    ikona: '📈',
    kategorija: 'inteligencija',
    oktavniNivo: 6,
    ciljnaPersona: 'Naučnik',
    prioritet: 'nizak',
    status: 'aktivan',
    sablon: 'prompt "Benchmark {sistem} vs {referenca}" kategorija inteligencija nivo 6;',
    primer: 'prompt "Benchmark Proksi latencija vs industrijskog standarda" kategorija inteligencija nivo 6;',
    tagovi: ['benchmark', 'performanse', 'poređenje'],
  },

  // ── Oktava 6 — Proksi ────────────────────────────────────────────
  {
    id: 'prompt-proksi-signal',
    naziv: 'Proksi Signal Konfiguracija',
    opis: 'Konfiguriši i optimizuj Proksi signal u mreži',
    ikona: '📡',
    kategorija: 'proksi',
    oktavniNivo: 6,
    ciljnaPersona: 'Naučnik',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Konfiguriši Proksi signal {signal}" kategorija proksi nivo 6;',
    primer: 'prompt "Konfiguriši hipsoneurični primarni signal na 8.7 THz" kategorija proksi nivo 6;',
    tagovi: ['proksi', 'signal', 'konfiguracija'],
  },
  {
    id: 'prompt-proksi-cvor',
    naziv: 'Proksi Čvor Upravljanje',
    opis: 'Upravljaj Proksi čvorovima i njihovim vezama',
    ikona: '🔗',
    kategorija: 'proksi',
    oktavniNivo: 6,
    ciljnaPersona: 'Integrator',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Upravljaj Proksi čvorom {cvor}" kategorija proksi nivo 6;',
    primer: 'prompt "Upravljaj Jezgro čvorom sa 3 signala" kategorija proksi nivo 6;',
    tagovi: ['proksi', 'čvor', 'upravljanje'],
  },
  {
    id: 'prompt-proksi-rezonanca',
    naziv: 'Proksi Rezonantno Pojačanje',
    opis: 'Podesi rezonantne harmonike za maksimalnu propusnost',
    ikona: '⚡',
    kategorija: 'proksi',
    oktavniNivo: 6,
    ciljnaPersona: 'Optimizator',
    prioritet: 'srednji',
    status: 'aktivan',
    sablon: 'prompt "Rezonantno pojačanje za {cvor}" kategorija proksi nivo 6;',
    primer: 'prompt "Rezonantno pojačanje za AI čvor na 44.1 THz" kategorija proksi nivo 6;',
    tagovi: ['rezonanca', 'pojačanje', 'propusnost'],
  },

  // ── Oktava 7 — Koordinacija ──────────────────────────────────────
  {
    id: 'prompt-koordinacija-strategija',
    naziv: 'Strategija Razvoja',
    opis: 'Definiši strategiju razvoja i roadmap platforme',
    ikona: '♟️',
    kategorija: 'koordinacija',
    oktavniNivo: 7,
    ciljnaPersona: 'Strateg',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Strategija za {platforma} period {period}" kategorija koordinacija nivo 7;',
    primer: 'prompt "Strategija za AI IQ Super Platforma Q2 2026" kategorija koordinacija nivo 7;',
    tagovi: ['strategija', 'roadmap', 'planiranje'],
  },
  {
    id: 'prompt-koordinacija-integracija',
    naziv: 'Cross-Platform Integracija',
    opis: 'Koordiniši integraciju između više platformi i repozitorijuma',
    ikona: '🔗',
    kategorija: 'koordinacija',
    oktavniNivo: 7,
    ciljnaPersona: 'Integrator',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Integriši {platforma1} sa {platforma2}" kategorija koordinacija nivo 7;',
    primer: 'prompt "Integriši IO-OPENUI-AO sa AI-IQ-SUPER-PLATFORMA" kategorija koordinacija nivo 7;',
    tagovi: ['integracija', 'cross-platform', 'repozitorijum'],
  },
  {
    id: 'prompt-koordinacija-komunikacija',
    naziv: 'Inter-Persona Komunikacija',
    opis: 'Upravljaj komunikacijom i eskalacijom između OMEGA persona',
    ikona: '📢',
    kategorija: 'koordinacija',
    oktavniNivo: 7,
    ciljnaPersona: 'Komunikator',
    prioritet: 'srednji',
    status: 'aktivan',
    sablon: 'prompt "Komunikacija {persona1} → {persona2} o {tema}" kategorija koordinacija nivo 7;',
    primer: 'prompt "Komunikacija Arhitekta → Graditelj o novom modulu" kategorija koordinacija nivo 7;',
    tagovi: ['komunikacija', 'persona', 'eskalacija'],
  },

  // ── Oktava 8 — Evolucija ─────────────────────────────────────────
  {
    id: 'prompt-evolucija-nadogradnja',
    naziv: 'Sistemska Evolucija',
    opis: 'Pokreni evolucioni ciklus za samonadogradnju sistema',
    ikona: '🧬',
    kategorija: 'evolucija',
    oktavniNivo: 8,
    ciljnaPersona: 'Evolver',
    prioritet: 'srednji',
    status: 'aktivan',
    sablon: 'prompt "Evoluiraj {sistem} na verziju {verzija}" kategorija evolucija nivo 8;',
    primer: 'prompt "Evoluiraj platforma na verziju 6.0.0" kategorija evolucija nivo 8;',
    tagovi: ['evolucija', 'nadogradnja', 'verzija'],
  },
  {
    id: 'prompt-evolucija-monitoring',
    naziv: 'Monitoring Operacija',
    opis: 'Nadgledaj operacije i detektuj anomalije u realnom vremenu',
    ikona: '👁️',
    kategorija: 'evolucija',
    oktavniNivo: 8,
    ciljnaPersona: 'Monitor',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Nadgledaj {sistem} svaki {interval}" kategorija evolucija nivo 8;',
    primer: 'prompt "Nadgledaj zdravlje ekosistema svaki 6h" kategorija evolucija nivo 8;',
    tagovi: ['monitoring', 'nadgledanje', 'anomalija'],
  },
  {
    id: 'prompt-evolucija-vizija',
    naziv: 'Vizija Budućnosti',
    opis: 'Definiši dugoročnu viziju i trendove za platformu',
    ikona: '🔮',
    kategorija: 'evolucija',
    oktavniNivo: 8,
    ciljnaPersona: 'Vizionar',
    prioritet: 'nizak',
    status: 'aktivan',
    sablon: 'prompt "Vizija za {platforma} u {period}" kategorija evolucija nivo 8;',
    primer: 'prompt "Vizija za SPAJA ekosistem u 2027" kategorija evolucija nivo 8;',
    tagovi: ['vizija', 'budućnost', 'trendovi'],
  },

  // ── Univerzalni ───────────────────────────────────────────────────
  {
    id: 'prompt-univerzalni-omega-dispatch',
    naziv: 'OMEGA Full Dispatch',
    opis: 'Aktiviraj celokupan OMEGA AI sistem — svih 21 persona kroz 8 oktava',
    ikona: '🧠',
    kategorija: 'univerzalni',
    oktavniNivo: 8,
    ciljnaPersona: 'Svi',
    prioritet: 'kritican',
    status: 'aktivan',
    sablon: 'prompt "OMEGA full dispatch za {zadatak}" kategorija univerzalni nivo 8;',
    primer: 'prompt "OMEGA full dispatch za kompletnu dijagnostiku sistema" kategorija univerzalni nivo 8;',
    tagovi: ['omega', 'dispatch', 'svi', 'univerzalni'],
  },
  {
    id: 'prompt-univerzalni-beskonacnost',
    naziv: '-∞Ω+∞ Beskonačni Prompt',
    opis: 'Univerzalni prompt koji pokriva celokupan spektar od -∞ do +∞ — meta-prompt za sve paradigme',
    ikona: '♾️',
    kategorija: 'univerzalni',
    oktavniNivo: 8,
    ciljnaPersona: 'Svi',
    prioritet: 'kritican',
    status: 'aktivan',
    sablon: 'prompt "{bilo_sta}" kategorija univerzalni nivo -∞Ω+∞;',
    primer: 'prompt "Pokreni celokupan SpajaUltraOmegaCore sistem" kategorija univerzalni nivo -∞Ω+∞;',
    tagovi: ['beskonačnost', '-∞Ω+∞', 'meta', 'sve'],
  },
  {
    id: 'prompt-univerzalni-ekosistem',
    naziv: 'Ekosistem Orkestracija',
    opis: 'Orkestri celokupan SPAJA ekosistem — platforme, AI, Proksi, mobilna mreža',
    ikona: '🌐',
    kategorija: 'univerzalni',
    oktavniNivo: 8,
    ciljnaPersona: 'Strateg',
    prioritet: 'visok',
    status: 'aktivan',
    sablon: 'prompt "Orkestri ekosistem {akcija}" kategorija univerzalni nivo 8;',
    primer: 'prompt "Orkestri ekosistem deploy svih platformi na Vercel" kategorija univerzalni nivo 8;',
    tagovi: ['ekosistem', 'orkestracija', 'platforme'],
  },
];

// ═══════════════════════════════════════════════════════════════════
// KOMPLETNI SISTEM
// ═══════════════════════════════════════════════════════════════════

const aktivniPromptovi = univerzalniPromptovi.filter((p) => p.status === 'aktivan');

export const univerzalniPromptSistem: UniverzalniPromptSistem = {
  naziv: 'SPAJA Univerzalni Prompt -∞Ω+∞',
  verzija: '1.0.0',
  opis: 'Univerzalni Prompt sistem za komunikaciju sa celokupnim OMEGA AI ekosistemom kroz SpajaUltraOmegaCore programski jezik — pokriva svih 8 oktava, 21 personu, Proksi mrežu i mobilnu mrežu',
  jezgro: 'SpajaUltraOmegaCore -∞Ω+∞',
  promptovi: univerzalniPromptovi,
  kategorije: promptKategorije,
  ukupnoPromptova: univerzalniPromptovi.length,
  aktivnihPromptova: aktivniPromptovi.length,
};

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

export function getPromptovePoKategoriji(kategorija: PromptKategorija): UniverzalniPrompt[] {
  return univerzalniPromptovi.filter((p) => p.kategorija === kategorija);
}

export function getPromptovePoOktavi(nivo: OktavniNivo): UniverzalniPrompt[] {
  return univerzalniPromptovi.filter((p) => p.oktavniNivo === nivo);
}

export function getPromptovePoPersoni(persona: string): UniverzalniPrompt[] {
  return univerzalniPromptovi.filter((p) => p.ciljnaPersona === persona);
}

export function getAktivnePromptove(): UniverzalniPrompt[] {
  return univerzalniPromptovi.filter((p) => p.status === 'aktivan');
}

export function getKriticnePromptove(): UniverzalniPrompt[] {
  return univerzalniPromptovi.filter((p) => p.prioritet === 'kritican');
}

export function getBrojPoKategoriji(): Record<string, number> {
  return univerzalniPromptovi.reduce<Record<string, number>>((acc, p) => {
    acc[p.kategorija] = (acc[p.kategorija] ?? 0) + 1;
    return acc;
  }, {});
}

export function getPromptSummary() {
  return {
    naziv: univerzalniPromptSistem.naziv,
    verzija: univerzalniPromptSistem.verzija,
    jezgro: univerzalniPromptSistem.jezgro,
    ukupnoPromptova: univerzalniPromptovi.length,
    aktivnihPromptova: aktivniPromptovi.length,
    kategorija: promptKategorije.length,
    kriticnihPromptova: getKriticnePromptove().length,
  };
}
