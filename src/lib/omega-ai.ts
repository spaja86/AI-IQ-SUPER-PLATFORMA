import type { OmegaAI } from './types';

export type OmegaKategorija =
  | 'arhitektura' | 'bezbednost' | 'razvoj' | 'kvalitet'
  | 'strategija' | 'operacije' | 'komunikacija';

export type OktavniNivo = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type OmegaPol = 'muški' | 'ženski';

export interface OmegaPersona extends OmegaAI {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: OmegaKategorija;
  oktavniNivo: OktavniNivo;
  prioritet: 'kritican' | 'visok' | 'srednji' | 'nizak';
  aktivna: boolean;
  prompt: string;
  spajaProVerzija: number;
  pol: OmegaPol;
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
    pol: 'muški',
    odgovornosti: ['Sistemska arhitektura', 'Tehnološke odluke', 'Skalabilnost', 'Pattern dizajn'],
    prompt: 'Dizajniraj sistemsku arhitekturu. Analiziraj strukturu, predloži poboljšanja, optimizuj skalabilnost.',
    spajaProVerzija: 10,
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
    pol: 'ženski',
    odgovornosti: ['Implementacija', 'Feature development', 'Code review', 'Refactoring'],
    prompt: 'Implementiraj novu funkcionalnost. Napiši kod, testove, izvrši code review. TypeScript + Next.js 16.',
    spajaProVerzija: 10,
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
    pol: 'muški',
    odgovornosti: ['Bezbednost', 'Autentifikacija', 'Autorizacija', 'Security audit'],
    prompt: 'Izvrši bezbednosni audit. Proveri autentifikaciju, autorizaciju, enkripciju. Detektuj ranjivosti.',
    spajaProVerzija: 7,
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
    pol: 'ženski',
    odgovornosti: ['Dijagnostika', 'Bug fixing', 'Auto-popravka', 'Health monitoring'],
    prompt: 'Dijagnostikuj sistem. Pokreni 11 provera, identifikuj probleme, primeni popravke. Auto-popravka aktivan.',
    spajaProVerzija: 8,
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
    pol: 'muški',
    odgovornosti: ['Testiranje', 'QA', 'Test automatizacija', 'Regression testing'],
    prompt: 'Testiraj kvalitet koda. Unit testovi, integration testovi, regression testing. Osiguraj pokrivenost.',
    spajaProVerzija: 8,
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
    pol: 'ženski',
    odgovornosti: ['Dokumentacija', 'API docs', 'Changelog', 'Knowledge base'],
    prompt: 'Napiši dokumentaciju. API docs, changelog, knowledge base. Jasno i precizno sa primerima.',
    spajaProVerzija: 8,
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
    pol: 'ženski',
    odgovornosti: ['UI/UX dizajn', 'Vizuelni identitet', 'Responsivnost', 'Accessibility'],
    prompt: 'Kreiraj UI/UX rešenje. Vizuelni identitet, responsivnost, accessibility. Tailwind CSS 4 + React 19.',
    spajaProVerzija: 9,
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
    pol: 'muški',
    odgovornosti: ['Content creation', 'Resursi', 'Šabloni', 'Primeri'],
    prompt: 'Kreiraj sadržaj. Šabloni, primeri, resursi, multimedija. SpajaPro 9 multimodalni Prompt aktivan.',
    spajaProVerzija: 9,
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
    pol: 'muški',
    odgovornosti: ['Performanse', 'Bundle optimization', 'Caching', 'Core Web Vitals'],
    prompt: 'Optimizuj performanse. Bundle size, caching, lazy loading, Core Web Vitals. Merenje pre i posle.',
    spajaProVerzija: 8,
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
    pol: 'ženski',
    odgovornosti: ['Skaliranje', 'Load balancing', 'CDN', 'Edge computing'],
    prompt: 'Skaliraj infrastrukturu. Load balancing, CDN, edge computing. Nulto vreme zastoja.',
    spajaProVerzija: 10,
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
    pol: 'muški',
    odgovornosti: ['Istraživanje', 'Novi pristupi', 'Prototipovi', 'Benchmarking'],
    prompt: 'Istraži nove tehnologije. Prototipovi, benchmarking. SpajaPro 8 analitički Prompt za duboku analizu.',
    spajaProVerzija: 8,
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
    pol: 'ženski',
    odgovornosti: ['Analitika', 'Metrike', 'Trendovi', 'Izveštaji'],
    prompt: 'Analiziraj podatke, metrike i trendove. Generiši izveštaje sa vizualizacijom. Prediktivna analitika.',
    spajaProVerzija: 8,
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
    pol: 'muški',
    odgovornosti: ['Strategija', 'Roadmap', 'Prioritizacija', 'Planiranje'],
    prompt: 'Planiraj strategiju razvoja. Roadmap, prioritizacija, resursi. Kratkoročno i dugoročno planiranje.',
    spajaProVerzija: 10,
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
    pol: 'ženski',
    odgovornosti: ['Obuka', 'Mentoring', 'Best practices', 'Knowledge sharing'],
    prompt: 'Obučavaj i vodi tim. Best practices, knowledge sharing, mentoring. Prompt za edukaciju.',
    spajaProVerzija: 9,
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
    pol: 'muški',
    odgovornosti: ['Integracija', 'API-jevi', 'Webhook-ovi', 'Sinhronizacija'],
    prompt: 'Integriši sisteme i servise. API-jevi, webhook-ovi, sinhronizacija. SpajaPro 10 multi-agent Prompt.',
    spajaProVerzija: 10,
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
    pol: 'ženski',
    odgovornosti: ['Komunikacija', 'Notifikacije', 'Eskalacija', 'Izveštavanje'],
    prompt: 'Upravljaj komunikacijom. Notifikacije, eskalacija, izveštavanje. Prompt za jasnu komunikaciju.',
    spajaProVerzija: 9,
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
    pol: 'muški',
    odgovornosti: ['Finansije', 'Budžeti', 'ROI', 'Cost optimization'],
    prompt: 'Upravljaj finansijama. Budžeti, ROI, cost optimization. Prompt za finansijsku analizu.',
    spajaProVerzija: 8,
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
    pol: 'ženski',
    odgovornosti: ['Evolucija', 'Nadogradnja', 'Inovacije', 'Napredak'],
    prompt: 'Evolviraj sistem. Nadogradnja, inovacije, napredak. SpajaPro 13 samo-evolucioni Prompt.',
    spajaProVerzija: 13,
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
    pol: 'muški',
    odgovornosti: ['Monitoring', 'Alerting', 'Uptime', 'Anomaly detection'],
    prompt: 'Nadgledaj operacije. Real-time alerting, uptime monitoring, anomaly detection.',
    spajaProVerzija: 8,
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
    pol: 'ženski',
    odgovornosti: ['Ekosistem', 'Zdravlje', 'Balans', 'Sustainability'],
    prompt: 'Brine o zdravlju ekosistema. Balans resursa, sustainability. Prompt za holistički pristup.',
    spajaProVerzija: 10,
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
    pol: 'muški',
    odgovornosti: ['Vizija', 'Budućnost', 'Trendovi', 'Dugoročno planiranje'],
    prompt: 'Vizija budućnosti. Trendovi, inovativni koncepti. SpajaPro 15 univerzalni Prompt.',
    spajaProVerzija: 15,
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

export function getPersonePoPolu(pol: OmegaPol): OmegaPersona[] {
  return omegaPersone.filter((p) => p.pol === pol);
}

export function getBrojPoPolu(): { muskih: number; zenskih: number } {
  return {
    muskih: omegaPersone.filter((p) => p.pol === 'muški').length,
    zenskih: omegaPersone.filter((p) => p.pol === 'ženski').length,
  };
}
