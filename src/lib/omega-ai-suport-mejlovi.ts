/**
 * 📧 OMEGA AI Industrijski Suport Mejlovi
 *
 * Sistem industrijskih mejlova za direktan suport i dopisivanje sa korisnicima.
 * Svaka od 21 OMEGA AI persona ima svoj suport mejl za dopisivanje u kontekstu:
 * - Platforma (AI IQ SUPER PLATFORMA, IO OPENUI AO, SpajaPro)
 * - Industrija (Digitalna Industrija, IT sektor)
 * - Menjačnica (AI IQ Menjačnica — valute, kursevi)
 * - Banka (AI IQ World Bank — transakcije, računi)
 * - IT proizvodi (hardver, softver, alati)
 * - Kompanije (Kompanija SPAJA, SPAJA FinTech, SPAJA AI...)
 * - Korporacije (enterprise rešenja, B2B)
 *
 * Domen: @omega-ai.spaja.rs
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { OMEGA_AI_PERSONA_COUNT, OMEGA_AI_INSTANCI } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type SuportDepartman =
  | 'platforma'
  | 'industrija'
  | 'menjacnica'
  | 'banka'
  | 'it-proizvodi'
  | 'kompanije'
  | 'korporacije'
  | 'tehnicka-podrska'
  | 'opsti-suport';

export type MejlPrioritet = 'hitan' | 'visok' | 'normalan' | 'nizak';

export type DopisivanjeTip = 'upit' | 'objasnjenje' | 'prigovor' | 'predlog' | 'tehnicko-pitanje' | 'finansijsko-pitanje' | 'opste';

export interface OmegaAiSuportMejl {
  personaId: string;
  personaNaziv: string;
  personaIkona: string;
  mejlAdresa: string;
  departmani: SuportDepartman[];
  opis: string;
  kontekstRada: string[];
  radnoVreme: string;
  prosecnoVremeOdgovora: string;
  aktivan: boolean;
}

export interface SuportDepartmanInfo {
  id: SuportDepartman;
  naziv: string;
  ikona: string;
  opis: string;
  glavniMejl: string;
  osoblje: string[];
  kontekst: string[];
  tipoviUpita: DopisivanjeTip[];
}

export interface IndustrijskiMejlSistem {
  naziv: string;
  opis: string;
  ikona: string;
  domen: string;
  mejlovi: OmegaAiSuportMejl[];
  departmani: SuportDepartmanInfo[];
  ukupnoMejlova: number;
  ukupnoDepartmana: number;
  radnoVreme: string;
  prosecnoVremeOdgovora: string;
  status: 'aktivan' | 'konfiguracija' | 'testiranje';
}

// ─── Mejlovi svih 21 OMEGA AI Persona ────────────────────

export const omegaAiSuportMejlovi: OmegaAiSuportMejl[] = [
  // Oktava 1 — Temelj
  {
    personaId: 'arhitekta',
    personaNaziv: 'Arhitekta',
    personaIkona: '🏗️',
    mejlAdresa: 'arhitekta@omega-ai.spaja.rs',
    departmani: ['platforma', 'industrija', 'tehnicka-podrska'],
    opis: 'Suport za sistemsku arhitekturu, tehnološke odluke i strukturu platforme',
    kontekstRada: ['Dizajn sistema', 'Arhitektura platforme', 'Skalabilnost', 'Tehnološki stack', 'Pattern dizajn'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 2 sata',
    aktivan: true,
  },
  {
    personaId: 'graditelj',
    personaNaziv: 'Graditelj',
    personaIkona: '🔨',
    mejlAdresa: 'graditelj@omega-ai.spaja.rs',
    departmani: ['platforma', 'it-proizvodi', 'tehnicka-podrska'],
    opis: 'Suport za implementaciju, razvoj funkcionalnosti i code review',
    kontekstRada: ['Implementacija', 'Feature development', 'Code review', 'Refactoring', 'TypeScript/Next.js'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 2 sata',
    aktivan: true,
  },

  // Oktava 2 — Zaštita
  {
    personaId: 'cuvar',
    personaNaziv: 'Čuvar',
    personaIkona: '🛡️',
    mejlAdresa: 'cuvar@omega-ai.spaja.rs',
    departmani: ['platforma', 'banka', 'tehnicka-podrska'],
    opis: 'Suport za bezbednost, autentifikaciju, autorizaciju i zaštitu podataka',
    kontekstRada: ['Bezbednost sistema', 'Autentifikacija', 'Autorizacija', 'Enkripcija', 'Security audit'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 1 sat',
    aktivan: true,
  },
  {
    personaId: 'lekar',
    personaNaziv: 'Lekar',
    personaIkona: '⚕️',
    mejlAdresa: 'lekar@omega-ai.spaja.rs',
    departmani: ['platforma', 'tehnicka-podrska'],
    opis: 'Suport za dijagnostiku problema, popravke i zdravlje sistema',
    kontekstRada: ['Dijagnostika', 'Popravke sistema', 'Zdravlje servisa', 'Bug fixing', 'Recovery'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 1 sat',
    aktivan: true,
  },

  // Oktava 3 — Kvalitet
  {
    personaId: 'tester',
    personaNaziv: 'Tester',
    personaIkona: '🧪',
    mejlAdresa: 'tester@omega-ai.spaja.rs',
    departmani: ['platforma', 'it-proizvodi', 'tehnicka-podrska'],
    opis: 'Suport za testiranje kvaliteta, QA procese i validaciju funkcionalnosti',
    kontekstRada: ['Testiranje', 'QA procesi', 'Validacija', 'Automatski testovi', 'Kvalitet koda'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 3 sata',
    aktivan: true,
  },
  {
    personaId: 'dokumentar',
    personaNaziv: 'Dokumentar',
    personaIkona: '📝',
    mejlAdresa: 'dokumentar@omega-ai.spaja.rs',
    departmani: ['platforma', 'industrija', 'opsti-suport'],
    opis: 'Suport za dokumentaciju, uputstva, API referenca i korisničke vodiče',
    kontekstRada: ['Dokumentacija', 'Uputstva', 'API referenca', 'Korisnički vodiči', 'FAQ'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 4 sata',
    aktivan: true,
  },

  // Oktava 4 — Kreacija
  {
    personaId: 'dizajner',
    personaNaziv: 'Dizajner',
    personaIkona: '🎨',
    mejlAdresa: 'dizajner@omega-ai.spaja.rs',
    departmani: ['platforma', 'it-proizvodi', 'kompanije'],
    opis: 'Suport za UI/UX, vizuelni identitet i dizajn platforme',
    kontekstRada: ['UI/UX dizajn', 'Vizuelni identitet', 'Brending', 'Korisnički interfejs', 'Accessibility'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 4 sata',
    aktivan: true,
  },
  {
    personaId: 'kreator',
    personaNaziv: 'Kreator',
    personaIkona: '🎭',
    mejlAdresa: 'kreator@omega-ai.spaja.rs',
    departmani: ['platforma', 'industrija', 'kompanije'],
    opis: 'Suport za kreiranje sadržaja, resursa i kreativnih rešenja',
    kontekstRada: ['Kreiranje sadržaja', 'Resursi', 'Marketing materijali', 'Blog', 'Multimedija'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 4 sata',
    aktivan: true,
  },

  // Oktava 5 — Optimizacija
  {
    personaId: 'optimizator',
    personaNaziv: 'Optimizator',
    personaIkona: '⚡',
    mejlAdresa: 'optimizator@omega-ai.spaja.rs',
    departmani: ['platforma', 'tehnicka-podrska', 'korporacije'],
    opis: 'Suport za optimizaciju performansi, brzine i efikasnosti sistema',
    kontekstRada: ['Performanse', 'Optimizacija', 'Brzina', 'Caching', 'Resource management'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 3 sata',
    aktivan: true,
  },
  {
    personaId: 'skalator',
    personaNaziv: 'Skalator',
    personaIkona: '📈',
    mejlAdresa: 'skalator@omega-ai.spaja.rs',
    departmani: ['platforma', 'korporacije', 'tehnicka-podrska'],
    opis: 'Suport za skaliranje infrastrukture, kapaciteta i enterprise rešenja',
    kontekstRada: ['Skaliranje', 'Infrastruktura', 'Load balancing', 'Auto-scaling', 'Enterprise'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 2 sata',
    aktivan: true,
  },

  // Oktava 6 — Inteligencija
  {
    personaId: 'naucnik',
    personaNaziv: 'Naučnik',
    personaIkona: '🔬',
    mejlAdresa: 'naucnik@omega-ai.spaja.rs',
    departmani: ['industrija', 'it-proizvodi', 'korporacije'],
    opis: 'Suport za istraživanje novih tehnologija, ML modele i inovacije',
    kontekstRada: ['Istraživanje', 'AI/ML modeli', 'Inovacije', 'Nove tehnologije', 'R&D'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 4 sata',
    aktivan: true,
  },
  {
    personaId: 'analiticar',
    personaNaziv: 'Analitičar',
    personaIkona: '📊',
    mejlAdresa: 'analiticar@omega-ai.spaja.rs',
    departmani: ['industrija', 'banka', 'menjacnica', 'kompanije'],
    opis: 'Suport za analizu podataka, metrika, finansijskih izveštaja i tržišnih trendova',
    kontekstRada: ['Analiza podataka', 'Metrike', 'Finansijski izveštaji', 'Tržišni trendovi', 'KPI'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 3 sata',
    aktivan: true,
  },

  // Oktava 7 — Koordinacija
  {
    personaId: 'strateg',
    personaNaziv: 'Strateg',
    personaIkona: '♟️',
    mejlAdresa: 'strateg@omega-ai.spaja.rs',
    departmani: ['industrija', 'kompanije', 'korporacije'],
    opis: 'Suport za strategiju razvoja, poslovne planove i dugoročne ciljeve',
    kontekstRada: ['Strategija', 'Poslovni planovi', 'Dugoročni ciljevi', 'Tržište', 'Kompetitivnost'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 4 sata',
    aktivan: true,
  },
  {
    personaId: 'mentor',
    personaNaziv: 'Mentor',
    personaIkona: '🎓',
    mejlAdresa: 'mentor@omega-ai.spaja.rs',
    departmani: ['opsti-suport', 'industrija', 'kompanije'],
    opis: 'Suport za obuku korisnika, vodiče, tutoriale i mentorstvo',
    kontekstRada: ['Obuka', 'Tutoriali', 'Mentorstvo', 'Onboarding', 'Best practices'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 3 sata',
    aktivan: true,
  },
  {
    personaId: 'integrator',
    personaNaziv: 'Integrator',
    personaIkona: '🔗',
    mejlAdresa: 'integrator@omega-ai.spaja.rs',
    departmani: ['platforma', 'it-proizvodi', 'korporacije'],
    opis: 'Suport za integraciju sistema, API-ja, servisa i eksternih alata',
    kontekstRada: ['Integracije', 'API', 'Webhook', 'Third-party servisi', 'Data sync'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 3 sata',
    aktivan: true,
  },
  {
    personaId: 'komunikator',
    personaNaziv: 'Komunikator',
    personaIkona: '📢',
    mejlAdresa: 'komunikator@omega-ai.spaja.rs',
    departmani: ['opsti-suport', 'kompanije', 'industrija'],
    opis: 'Suport za komunikaciju, PR, obaveštenja i korisničku podršku',
    kontekstRada: ['Komunikacija', 'PR', 'Obaveštenja', 'Korisnička podrška', 'Newsletter'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 2 sata',
    aktivan: true,
  },
  {
    personaId: 'finansijer',
    personaNaziv: 'Finansijer',
    personaIkona: '💰',
    mejlAdresa: 'finansijer@omega-ai.spaja.rs',
    departmani: ['banka', 'menjacnica', 'kompanije', 'korporacije'],
    opis: 'Suport za finansije, transakcije, fakture, pretplate, naplate i budžete',
    kontekstRada: ['Finansije', 'Transakcije', 'Fakture', 'Pretplate', 'Budžeti', 'Naplate'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 1 sat',
    aktivan: true,
  },

  // Oktava 8 — Evolucija
  {
    personaId: 'evolver',
    personaNaziv: 'Evolver',
    personaIkona: '🧬',
    mejlAdresa: 'evolver@omega-ai.spaja.rs',
    departmani: ['industrija', 'platforma', 'korporacije'],
    opis: 'Suport za evoluciju sistema, inovacije i kontinuirani napredak',
    kontekstRada: ['Evolucija sistema', 'Inovacije', 'Napredak', 'Modernizacija', 'Upgrade'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 4 sata',
    aktivan: true,
  },
  {
    personaId: 'monitor',
    personaNaziv: 'Monitor',
    personaIkona: '👁️',
    mejlAdresa: 'monitor@omega-ai.spaja.rs',
    departmani: ['tehnicka-podrska', 'platforma', 'korporacije'],
    opis: 'Suport za monitoring, nadzor sistema, alerting i operativne izveštaje',
    kontekstRada: ['Monitoring', 'Nadzor sistema', 'Alerting', 'Operativni izveštaji', 'Uptime'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 30 minuta',
    aktivan: true,
  },
  {
    personaId: 'ekolog',
    personaNaziv: 'Ekolog',
    personaIkona: '🌿',
    mejlAdresa: 'ekolog@omega-ai.spaja.rs',
    departmani: ['industrija', 'platforma', 'opsti-suport'],
    opis: 'Suport za zdravlje ekosistema, održivost i balans između komponenti',
    kontekstRada: ['Ekosistem', 'Održivost', 'Balans', 'Zdravlje sistema', 'Harmonija'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 4 sata',
    aktivan: true,
  },
  {
    personaId: 'vizionar',
    personaNaziv: 'Vizionar',
    personaIkona: '🔮',
    mejlAdresa: 'vizionar@omega-ai.spaja.rs',
    departmani: ['industrija', 'korporacije', 'kompanije'],
    opis: 'Suport za viziju budućnosti, trendove, dugoročno planiranje i inovacije',
    kontekstRada: ['Vizija', 'Budućnost', 'Trendovi', 'Dugoročno planiranje', 'Inovativni koncepti'],
    radnoVreme: '24/7',
    prosecnoVremeOdgovora: '< 4 sata',
    aktivan: true,
  },
];

// ─── Departmani za Dopisivanje ───────────────────────────

export const suportDepartmani: SuportDepartmanInfo[] = [
  {
    id: 'platforma',
    naziv: 'Platforma — AI IQ SUPER PLATFORMA',
    ikona: '🏢',
    opis: 'Suport za rad na platformi — sve funkcionalnosti AI IQ SUPER PLATFORMA, IO OPENUI AO, SpajaPro v6-v15',
    glavniMejl: 'platforma@omega-ai.spaja.rs',
    osoblje: ['arhitekta', 'graditelj', 'cuvar', 'lekar', 'tester', 'dizajner', 'optimizator', 'skalator', 'integrator', 'monitor', 'ekolog', 'evolver'],
    kontekst: ['AI IQ SUPER PLATFORMA', 'IO OPENUI AO', 'SpajaPro v6-v15', 'Proksi mreža', 'SPAJA Mobilna', 'API-ji', 'Dijagnostika'],
    tipoviUpita: ['upit', 'objasnjenje', 'tehnicko-pitanje', 'predlog'],
  },
  {
    id: 'industrija',
    naziv: 'Industrija — Digitalna Industrija',
    ikona: '🏭',
    opis: 'Suport za celokupnu Digitalnu Industriju — sve platforme, sve kompanije, svi proizvodi',
    glavniMejl: 'industrija@omega-ai.spaja.rs',
    osoblje: ['strateg', 'analiticar', 'naucnik', 'kreator', 'dokumentar', 'komunikator', 'mentor', 'evolver', 'ekolog', 'vizionar', 'arhitekta'],
    kontekst: ['Digitalna Industrija', 'Ekosistem', 'Platforme', 'Proizvodi', 'Organizacije', 'Strategija'],
    tipoviUpita: ['upit', 'objasnjenje', 'predlog', 'opste'],
  },
  {
    id: 'menjacnica',
    naziv: 'Menjačnica — AI IQ Menjačnica',
    ikona: '💱',
    opis: 'Suport za menjačnicu — kursevi, konverzije, valute, multi-valutni sistem sa 12 valuta',
    glavniMejl: 'menjacnica@omega-ai.spaja.rs',
    osoblje: ['finansijer', 'analiticar'],
    kontekst: ['AI IQ Menjačnica', 'Kursevi', 'Konverzije', '12 valuta (RSD, USD, EUR, GBP, CHF, JPY, CNY, RUB, INR, BRL, BTC, ETH)', 'Kripto'],
    tipoviUpita: ['upit', 'objasnjenje', 'finansijsko-pitanje'],
  },
  {
    id: 'banka',
    naziv: 'Banka — AI IQ World Bank',
    ikona: '🏦',
    opis: 'Suport za banku — transakcije, računi, plaćanja, finansijski izveštaji',
    glavniMejl: 'banka@omega-ai.spaja.rs',
    osoblje: ['finansijer', 'cuvar', 'analiticar'],
    kontekst: ['AI IQ World Bank', 'Transakcije', 'Računi', 'Plaćanja', 'Finansijski izveštaji', 'Bezbednost'],
    tipoviUpita: ['upit', 'objasnjenje', 'finansijsko-pitanje', 'prigovor'],
  },
  {
    id: 'it-proizvodi',
    naziv: 'IT Proizvodi — Hardver i Softver',
    ikona: '💻',
    opis: 'Suport za IT proizvode — digitalni hardver, softverski alati, DevOps, AI Engine',
    glavniMejl: 'it-proizvodi@omega-ai.spaja.rs',
    osoblje: ['graditelj', 'tester', 'dizajner', 'integrator', 'naucnik'],
    kontekst: ['IT proizvodi', 'Digitalni hardver', 'Softverski alati', 'DevOps', 'AI Engine', '25 proizvoda'],
    tipoviUpita: ['upit', 'objasnjenje', 'tehnicko-pitanje', 'predlog'],
  },
  {
    id: 'kompanije',
    naziv: 'Kompanije — Kompanija SPAJA Ekosistem',
    ikona: '🏛️',
    opis: 'Suport za sve kompanije u ekosistemu — Kompanija SPAJA, SPAJA FinTech, SPAJA AI, SPAJA Commerce, SPAJA Social, SPAJA Cloud',
    glavniMejl: 'kompanije@omega-ai.spaja.rs',
    osoblje: ['strateg', 'finansijer', 'komunikator', 'mentor', 'kreator', 'dizajner', 'analiticar', 'vizionar'],
    kontekst: ['Kompanija SPAJA', 'SPAJA FinTech', 'SPAJA AI', 'SPAJA Commerce', 'SPAJA Social', 'SPAJA Cloud', '6 kompanija'],
    tipoviUpita: ['upit', 'objasnjenje', 'predlog', 'opste'],
  },
  {
    id: 'korporacije',
    naziv: 'Korporacije — Enterprise Rešenja',
    ikona: '🏢',
    opis: 'Suport za enterprise/korporativne korisnike — B2B, dedicirani resursi, SLA, skaliranje',
    glavniMejl: 'korporacije@omega-ai.spaja.rs',
    osoblje: ['strateg', 'skalator', 'optimizator', 'integrator', 'finansijer', 'monitor', 'evolver', 'vizionar', 'naucnik'],
    kontekst: ['Enterprise', 'B2B', 'Dedicirani resursi', 'SLA garancija', 'Skaliranje', 'VIP podrška'],
    tipoviUpita: ['upit', 'objasnjenje', 'tehnicko-pitanje', 'finansijsko-pitanje', 'predlog'],
  },
  {
    id: 'tehnicka-podrska',
    naziv: 'Tehnička Podrška — 24/7',
    ikona: '🔧',
    opis: 'Direktna tehnička podrška za sve probleme — dijagnostika, popravke, konfiguracija, monitoring',
    glavniMejl: 'tehnicka-podrska@omega-ai.spaja.rs',
    osoblje: ['lekar', 'cuvar', 'tester', 'optimizator', 'skalator', 'monitor', 'graditelj', 'arhitekta'],
    kontekst: ['Dijagnostika', 'Popravke', 'Konfiguracija', 'Monitoring', 'Uptime', 'Performance', 'Security'],
    tipoviUpita: ['tehnicko-pitanje', 'upit', 'prigovor'],
  },
  {
    id: 'opsti-suport',
    naziv: 'Opšti Suport — Generalne Informacije',
    ikona: '📨',
    opis: 'Generalni suport za sve upite — informacije, pitanja, predlozi, povratne informacije',
    glavniMejl: 'suport@omega-ai.spaja.rs',
    osoblje: ['komunikator', 'mentor', 'dokumentar', 'ekolog'],
    kontekst: ['Generalne informacije', 'Pitanja', 'Predlozi', 'Povratne informacije', 'FAQ', 'Dokumentacija'],
    tipoviUpita: ['upit', 'objasnjenje', 'predlog', 'opste', 'prigovor'],
  },
];

// ─── Kompletni Sistem ────────────────────────────────────

export const industrijskiMejlSistem: IndustrijskiMejlSistem = {
  naziv: 'OMEGA AI Industrijski Suport Mejlovi',
  opis: `Sistem industrijskih mejlova za direktan suport i dopisivanje sa korisnicima. ${OMEGA_AI_PERSONA_COUNT} OMEGA AI persona (${OMEGA_AI_INSTANCI.toLocaleString()} instanci) pružaju suport u kontekstu platforme, industrije, menjačnice, banke, IT proizvoda, kompanija i korporacija. Domen: @omega-ai.spaja.rs`,
  ikona: '📧',
  domen: 'omega-ai.spaja.rs',
  mejlovi: omegaAiSuportMejlovi,
  departmani: suportDepartmani,
  ukupnoMejlova: omegaAiSuportMejlovi.length,
  ukupnoDepartmana: suportDepartmani.length,
  radnoVreme: '24/7/365',
  prosecnoVremeOdgovora: '< 2 sata',
  status: 'aktivan',
};

// ─── Helper Funkcije ─────────────────────────────────────

export function getMejlPoPersoni(personaId: string): OmegaAiSuportMejl | undefined {
  return omegaAiSuportMejlovi.find((m) => m.personaId === personaId);
}

export function getMejloviPoDepartmanu(departmanId: SuportDepartman): OmegaAiSuportMejl[] {
  return omegaAiSuportMejlovi.filter((m) => m.departmani.includes(departmanId));
}

export function getDepartman(departmanId: SuportDepartman): SuportDepartmanInfo | undefined {
  return suportDepartmani.find((d) => d.id === departmanId);
}

export function getSviMejlovi(): string[] {
  return omegaAiSuportMejlovi.map((m) => m.mejlAdresa);
}

export function getSviDepartmanskiMejlovi(): string[] {
  return suportDepartmani.map((d) => d.glavniMejl);
}

export function getAktivniMejlovi(): OmegaAiSuportMejl[] {
  return omegaAiSuportMejlovi.filter((m) => m.aktivan);
}

export function getUkupnoOsoblja(): number {
  const sviOsoblje = new Set(suportDepartmani.flatMap((d) => d.osoblje));
  return sviOsoblje.size;
}
