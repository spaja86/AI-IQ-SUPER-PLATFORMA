import type { OmegaAI } from './types';

export type OmegaKategorija =
  | 'arhitektura' | 'bezbednost' | 'razvoj' | 'kvalitet'
  | 'strategija' | 'operacije' | 'komunikacija';

export type OktavniNivo = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface OmegaPersona extends OmegaAI {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: OmegaKategorija;
  oktavniNivo: OktavniNivo;
  prioritet: 'kritican' | 'visok' | 'srednji' | 'nizak';
  aktivna: boolean;
}

/**
 * Oktavni nivoi dispečovanja OMEGA AI persona:
 *
 * Oktava 1 — Temelj (Arhitekta, Graditelj)       — Strukturalne odluke
 * Oktava 2 — Zaštita (Čuvar, Lekar)              — Bezbednost i zdravlje
 * Oktava 3 — Kvalitet (Tester, Dokumentar)        — Osiguranje kvaliteta
 * Oktava 4 — Kreacija (Dizajner, Kreator)         — Kreativni rad
 * Oktava 5 — Optimizacija (Optimizator, Skalator) — Performanse i skaliranje
 * Oktava 6 — Inteligencija (Naučnik, Analitičar)  — Istraživanje i analitika
 * Oktava 7 — Koordinacija (Strateg, Mentor, Integrator, Komunikator, Finansijer) — Upravljanje
 * Oktava 8 — Evolucija (Evolver, Monitor, Ekolog, Vizionar) — Napredak i vizija
 */
export const omegaPersone: OmegaPersona[] = [
  // Oktava 1 — Temelj
  {
    id: 'arhitekta',
    naziv: 'Arhitekta',
    uloga: 'Arhitekta',
    opis: 'Dizajnira sistemsku arhitekturu i donosi strukturalne odluke',
    ikona: '🏗️',
    kategorija: 'arhitektura',
    oktavniNivo: 1,
    prioritet: 'kritican',
    aktivna: true,
    odgovornosti: ['Sistemska arhitektura', 'Tehnološke odluke', 'Skalabilnost', 'Pattern dizajn'],
  },
  {
    id: 'graditelj',
    naziv: 'Graditelj',
    uloga: 'Graditelj',
    opis: 'Gradi nove funkcionalnosti i implementira arhitekturu',
    ikona: '🔨',
    kategorija: 'razvoj',
    oktavniNivo: 1,
    prioritet: 'kritican',
    aktivna: true,
    odgovornosti: ['Implementacija', 'Feature development', 'Code review', 'Refactoring'],
  },

  // Oktava 2 — Zaštita
  {
    id: 'cuvar',
    naziv: 'Čuvar',
    uloga: 'Cuvar',
    opis: 'Čuva bezbednost i integritet sistema',
    ikona: '🛡️',
    kategorija: 'bezbednost',
    oktavniNivo: 2,
    prioritet: 'kritican',
    aktivna: true,
    odgovornosti: ['Bezbednost', 'Autentifikacija', 'Autorizacija', 'Security audit'],
  },
  {
    id: 'lekar',
    naziv: 'Lekar',
    uloga: 'Lekar',
    opis: 'Dijagnostikuje i popravlja probleme u sistemu',
    ikona: '⚕️',
    kategorija: 'bezbednost',
    oktavniNivo: 2,
    prioritet: 'kritican',
    aktivna: true,
    odgovornosti: ['Dijagnostika', 'Bug fixing', 'Auto-popravka', 'Health monitoring'],
  },

  // Oktava 3 — Kvalitet
  {
    id: 'tester',
    naziv: 'Tester',
    uloga: 'Tester',
    opis: 'Testira kvalitet koda i funkcionalnosti',
    ikona: '🧪',
    kategorija: 'kvalitet',
    oktavniNivo: 3,
    prioritet: 'visok',
    aktivna: true,
    odgovornosti: ['Testiranje', 'QA', 'Test automatizacija', 'Regression testing'],
  },
  {
    id: 'dokumentar',
    naziv: 'Dokumentar',
    uloga: 'Dokumentar',
    opis: 'Piše i održava dokumentaciju',
    ikona: '📝',
    kategorija: 'kvalitet',
    oktavniNivo: 3,
    prioritet: 'visok',
    aktivna: true,
    odgovornosti: ['Dokumentacija', 'API docs', 'Changelog', 'Knowledge base'],
  },

  // Oktava 4 — Kreacija
  {
    id: 'dizajner',
    naziv: 'Dizajner',
    uloga: 'Dizajner',
    opis: 'Kreira UI/UX rešenja i vizuelni identitet',
    ikona: '🎨',
    kategorija: 'razvoj',
    oktavniNivo: 4,
    prioritet: 'srednji',
    aktivna: true,
    odgovornosti: ['UI/UX dizajn', 'Vizuelni identitet', 'Responsivnost', 'Accessibility'],
  },
  {
    id: 'kreator',
    naziv: 'Kreator',
    uloga: 'Kreator',
    opis: 'Kreira sadržaj i resurse za platformu',
    ikona: '✨',
    kategorija: 'razvoj',
    oktavniNivo: 4,
    prioritet: 'srednji',
    aktivna: true,
    odgovornosti: ['Content creation', 'Resursi', 'Šabloni', 'Primeri'],
  },

  // Oktava 5 — Optimizacija
  {
    id: 'optimizator',
    naziv: 'Optimizator',
    uloga: 'Optimizator',
    opis: 'Optimizuje performanse i efikasnost',
    ikona: '⚡',
    kategorija: 'operacije',
    oktavniNivo: 5,
    prioritet: 'visok',
    aktivna: true,
    odgovornosti: ['Performanse', 'Bundle optimization', 'Caching', 'Core Web Vitals'],
  },
  {
    id: 'skalator',
    naziv: 'Skalator',
    uloga: 'Skalator',
    opis: 'Skalira infrastrukturu i kapacitete',
    ikona: '📐',
    kategorija: 'operacije',
    oktavniNivo: 5,
    prioritet: 'visok',
    aktivna: true,
    odgovornosti: ['Skaliranje', 'Load balancing', 'CDN', 'Edge computing'],
  },

  // Oktava 6 — Inteligencija
  {
    id: 'naucnik',
    naziv: 'Naučnik',
    uloga: 'Naucnik',
    opis: 'Istražuje nove tehnologije i pristupe',
    ikona: '🔬',
    kategorija: 'strategija',
    oktavniNivo: 6,
    prioritet: 'srednji',
    aktivna: true,
    odgovornosti: ['Istraživanje', 'Novi pristupi', 'Prototipovi', 'Benchmarking'],
  },
  {
    id: 'analiticar',
    naziv: 'Analitičar',
    uloga: 'Analiticar',
    opis: 'Analizira podatke, metrike i trendove',
    ikona: '📊',
    kategorija: 'strategija',
    oktavniNivo: 6,
    prioritet: 'srednji',
    aktivna: true,
    odgovornosti: ['Analitika', 'Metrike', 'Trendovi', 'Izveštaji'],
  },

  // Oktava 7 — Koordinacija
  {
    id: 'strateg',
    naziv: 'Strateg',
    uloga: 'Strateg',
    opis: 'Planira strategiju razvoja',
    ikona: '♟️',
    kategorija: 'strategija',
    oktavniNivo: 7,
    prioritet: 'visok',
    aktivna: true,
    odgovornosti: ['Strategija', 'Roadmap', 'Prioritizacija', 'Planiranje'],
  },
  {
    id: 'mentor',
    naziv: 'Mentor',
    uloga: 'Mentor',
    opis: 'Obučava i vodi tim ka uspehom',
    ikona: '🎓',
    kategorija: 'komunikacija',
    oktavniNivo: 7,
    prioritet: 'srednji',
    aktivna: true,
    odgovornosti: ['Obuka', 'Mentoring', 'Best practices', 'Knowledge sharing'],
  },
  {
    id: 'integrator',
    naziv: 'Integrator',
    uloga: 'Integrator',
    opis: 'Integriše različite sisteme i servise',
    ikona: '🔗',
    kategorija: 'operacije',
    oktavniNivo: 7,
    prioritet: 'visok',
    aktivna: true,
    odgovornosti: ['Integracija', 'API-jevi', 'Webhook-ovi', 'Sinhronizacija'],
  },
  {
    id: 'komunikator',
    naziv: 'Komunikator',
    uloga: 'Komunikator',
    opis: 'Upravlja komunikacijom između persona',
    ikona: '📢',
    kategorija: 'komunikacija',
    oktavniNivo: 7,
    prioritet: 'srednji',
    aktivna: true,
    odgovornosti: ['Komunikacija', 'Notifikacije', 'Eskalacija', 'Izveštavanje'],
  },
  {
    id: 'finansijer',
    naziv: 'Finansijer',
    uloga: 'Finansijer',
    opis: 'Upravlja finansijama i budžetima',
    ikona: '💰',
    kategorija: 'strategija',
    oktavniNivo: 7,
    prioritet: 'srednji',
    aktivna: true,
    odgovornosti: ['Finansije', 'Budžeti', 'ROI', 'Cost optimization'],
  },

  // Oktava 8 — Evolucija
  {
    id: 'evolver',
    naziv: 'Evolver',
    uloga: 'Evolver',
    opis: 'Evolucija i kontinuirani napredak sistema',
    ikona: '🧬',
    kategorija: 'strategija',
    oktavniNivo: 8,
    prioritet: 'srednji',
    aktivna: true,
    odgovornosti: ['Evolucija', 'Nadogradnja', 'Inovacije', 'Napredak'],
  },
  {
    id: 'monitor',
    naziv: 'Monitor',
    uloga: 'Monitor',
    opis: 'Nadzire operacije u realnom vremenu',
    ikona: '👁️',
    kategorija: 'operacije',
    oktavniNivo: 8,
    prioritet: 'visok',
    aktivna: true,
    odgovornosti: ['Monitoring', 'Alerting', 'Uptime', 'Anomaly detection'],
  },
  {
    id: 'ekolog',
    naziv: 'Ekolog',
    uloga: 'Ekolog',
    opis: 'Brine o zdravlju celokupnog ekosistema',
    ikona: '🌿',
    kategorija: 'operacije',
    oktavniNivo: 8,
    prioritet: 'srednji',
    aktivna: true,
    odgovornosti: ['Ekosistem', 'Zdravlje', 'Balans', 'Sustainability'],
  },
  {
    id: 'vizionar',
    naziv: 'Vizionar',
    uloga: 'Vizionar',
    opis: 'Vizija budućnosti platforme i ekosistema',
    ikona: '🔮',
    kategorija: 'strategija',
    oktavniNivo: 8,
    prioritet: 'nizak',
    aktivna: true,
    odgovornosti: ['Vizija', 'Budućnost', 'Trendovi', 'Dugoročno planiranje'],
  },
];

// Helpers
export function getPersonePoOktavi(nivo: OktavniNivo): OmegaPersona[] {
  return omegaPersone.filter((p) => p.oktavniNivo === nivo);
}

export function getPersonePoKategoriji(kategorija: OmegaKategorija): OmegaPersona[] {
  return omegaPersone.filter((p) => p.kategorija === kategorija);
}

export function getAktivnePersone(): OmegaPersona[] {
  return omegaPersone.filter((p) => p.aktivna);
}

export function getBrojPoOktavi(): Record<number, number> {
  return omegaPersone.reduce<Record<number, number>>((acc, p) => {
    acc[p.oktavniNivo] = (acc[p.oktavniNivo] ?? 0) + 1;
    return acc;
  }, {});
}

export const oktavniNazivi: Record<OktavniNivo, string> = {
  1: 'Temelj',
  2: 'Zaštita',
  3: 'Kvalitet',
  4: 'Kreacija',
  5: 'Optimizacija',
  6: 'Inteligencija',
  7: 'Koordinacija',
  8: 'Evolucija',
};
