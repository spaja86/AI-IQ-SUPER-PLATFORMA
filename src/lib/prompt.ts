/**
 * Prompt sistem — Centralni Prompt engine za ceo ekosistem
 *
 * Svaka OMEGA AI persona ima svoj specijalizovani Prompt.
 * Svaka platforma ima Prompt šablone.
 * SpajaPro engine obrađuje sve Prompt-ove.
 *
 * Prompt je svuda — u svakom aspektu platforme.
 */

import type { OmegaAIUloga } from './types';

export type PromptFormat =
  | 'json'
  | 'csv'
  | 'xml'
  | 'yaml'
  | 'txt'
  | 'md'
  | 'html'
  | 'pdf'
  | 'xlsx'
  | 'docx'
  | 'png'
  | 'jpg'
  | 'svg'
  | 'sql'
  | 'log';

export interface PromptImport {
  naziv: string;
  opis: string;
  formati: PromptFormat[];
  obavezan: boolean;
}

export interface PromptExport {
  naziv: string;
  opis: string;
  formati: PromptFormat[];
}

export interface Prompt {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: PromptKategorija;
  sadrzaj: string;
  spajaProVerzija: number;
  ciljnaPersona?: OmegaAIUloga;
  ciljnaPlatforma?: string;
  parametri: PromptParametar[];
  tagovi: string[];
  prioritet: 'kritican' | 'visok' | 'srednji' | 'nizak';
  importi: PromptImport[];
  exporti: PromptExport[];
}

export type PromptKategorija =
  | 'sistemski'
  | 'persona'
  | 'platforma'
  | 'analitika'
  | 'bezbednost'
  | 'kreativni'
  | 'orkestracioni'
  | 'evolucioni'
  | 'dijagnosticki'
  | 'univerzalni';

export interface PromptParametar {
  naziv: string;
  tip: 'string' | 'number' | 'boolean' | 'lista';
  opis: string;
  podrazumevano?: string;
}

export interface PromptBiblioteka {
  ukupnoPromptova: number;
  kategorije: Record<PromptKategorija, number>;
  personaPromptovi: number;
  platformaPromptovi: number;
  spajaProVerzije: number[];
  promptovi: Prompt[];
}

/**
 * Centralna biblioteka Prompt-ova za ceo ekosistem.
 *
 * Prompt je integrisana u svaki aspekt:
 * - Svaka OMEGA AI persona ima Prompt
 * - Svaka platforma ima Prompt šablone
 * - Svaki IT proizvod koristi Prompt
 * - SpajaPro engine obrađuje Prompt-ove
 */
export const promptovi: Prompt[] = [
  // ─── Sistemski Prompt-ovi ────────────────────────────────
  {
    id: 'prompt-sistem-inicijalizacija',
    naziv: 'Sistemska Inicijalizacija Prompt',
    opis: 'Prompt za inicijalizaciju celog OMEGA AI sistema',
    ikona: '⚡',
    kategorija: 'sistemski',
    sadrzaj: 'Inicijalizuj OMEGA AI sistem sa 21 personom u 8 oktava. Aktiviraj matrično jezgro i neurološku mrežu. SpajaPro engine: aktivan.',
    spajaProVerzija: 10,
    parametri: [
      { naziv: 'oktave', tip: 'number', opis: 'Broj oktava za aktivaciju', podrazumevano: '8' },
      { naziv: 'persone', tip: 'number', opis: 'Broj persona za aktivaciju', podrazumevano: '21' },
    ],
    tagovi: ['sistem', 'inicijalizacija', 'omega-ai'],
    prioritet: 'kritican',
    importi: [
      { naziv: 'Konfiguracija sistema', opis: 'JSON/YAML konfiguracija za inicijalizaciju sistema', formati: ['json', 'yaml'], obavezan: true },
      { naziv: 'Lista persona', opis: 'Lista persona za aktivaciju', formati: ['json', 'csv'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Inicijalizacioni izveštaj', opis: 'Izveštaj o statusu inicijalizacije sistema', formati: ['json', 'pdf', 'html'] },
      { naziv: 'Sistemski log', opis: 'Log inicijalizacije', formati: ['log', 'txt', 'json'] },
    ],
  },
  {
    id: 'prompt-sistem-zdravlje',
    naziv: 'Prompt za Zdravlje Sistema',
    opis: 'Prompt koji proverava zdravlje celokupnog ekosistema',
    ikona: '💚',
    kategorija: 'sistemski',
    sadrzaj: 'Proveri zdravlje svih 11 platformi, 17 IT proizvoda i 21 OMEGA AI persone. Generiši izveštaj o statusu.',
    spajaProVerzija: 8,
    parametri: [
      { naziv: 'detaljan', tip: 'boolean', opis: 'Da li generisati detaljan izveštaj', podrazumevano: 'true' },
    ],
    tagovi: ['zdravlje', 'monitoring', 'dijagnostika'],
    prioritet: 'visok',
    importi: [
      { naziv: 'Sistemske metrike', opis: 'Trenutne metrike sistema za analizu zdravlja', formati: ['json', 'csv'], obavezan: true },
      { naziv: 'Prethodni izveštaji', opis: 'Prethodni health-check izveštaji za poređenje', formati: ['json', 'pdf'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Zdravstveni izveštaj', opis: 'Kompletan izveštaj o zdravlju sistema', formati: ['json', 'pdf', 'html', 'md'] },
      { naziv: 'Metrike zdravlja', opis: 'Detaljne metrike u tabelarnom formatu', formati: ['csv', 'xlsx', 'json'] },
    ],
  },
  {
    id: 'prompt-sistem-evolucija',
    naziv: 'Prompt za Autonomnu Evoluciju',
    opis: 'Prompt koji pokreće ciklus autonomne evolucije platforme',
    ikona: '🧬',
    kategorija: 'evolucioni',
    sadrzaj: 'Pokreni evolucioni ciklus: dijagnostika → analiza → predlog → implementacija → verifikacija. SpajaPro 13 meta-Prompt generisanje aktivno.',
    spajaProVerzija: 13,
    parametri: [
      { naziv: 'ciklus', tip: 'string', opis: 'Tip evolucije', podrazumevano: 'potpuni' },
    ],
    tagovi: ['evolucija', 'autonomno', 'meta-prompt'],
    prioritet: 'visok',
    importi: [
      { naziv: 'Analiza stanja', opis: 'Trenutno stanje sistema za evolucioni ciklus', formati: ['json', 'yaml'], obavezan: true },
      { naziv: 'Evoluciona istorija', opis: 'Prethodni evolucioni ciklusi', formati: ['json', 'csv'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Evolucioni plan', opis: 'Plan evolucije sa koracima implementacije', formati: ['json', 'md', 'pdf'] },
      { naziv: 'Evolucioni izveštaj', opis: 'Rezultat evolucionog ciklusa', formati: ['json', 'html', 'pdf'] },
    ],
  },

  // ─── Persona Prompt-ovi (za svaku OMEGA AI personu) ──────
  {
    id: 'prompt-persona-arhitekta',
    naziv: 'Arhitekta Prompt',
    opis: 'Prompt za OMEGA AI Arhitektu — sistemska arhitektura',
    ikona: '🏗️',
    kategorija: 'persona',
    sadrzaj: 'Dizajniraj sistemsku arhitekturu. Analiziraj trenutnu strukturu, predloži poboljšanja, optimizuj skalabilnost. Koristi pattern dizajn i best practices.',
    spajaProVerzija: 10,
    ciljnaPersona: 'Arhitekta',
    parametri: [
      { naziv: 'oblast', tip: 'string', opis: 'Oblast arhitekture', podrazumevano: 'ceo-sistem' },
    ],
    tagovi: ['arhitektura', 'dizajn', 'skalabilnost'],
    prioritet: 'kritican',
    importi: [
      { naziv: 'Arhitekturni dijagrami', opis: 'Trenutni dijagrami sistema za analizu', formati: ['json', 'yaml', 'xml', 'svg', 'png'], obavezan: true },
      { naziv: 'Zahtevi sistema', opis: 'Funkcionalni i nefunkcionalni zahtevi', formati: ['md', 'docx', 'pdf', 'txt'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Arhitekturni plan', opis: 'Novi/ažurirani arhitekturni plan sistema', formati: ['json', 'yaml', 'md', 'pdf'] },
      { naziv: 'Dijagrami', opis: 'Arhitekturni dijagrami sistema', formati: ['svg', 'png', 'json'] },
    ],
  },
  {
    id: 'prompt-persona-cuvar',
    naziv: 'Čuvar Prompt',
    opis: 'Prompt za OMEGA AI Čuvara — bezbednost sistema',
    ikona: '🛡️',
    kategorija: 'bezbednost',
    sadrzaj: 'Izvrši bezbednosni audit sistema. Proveri autentifikaciju, autorizaciju, enkripciju. Detektuj ranjivosti i predloži popravke.',
    spajaProVerzija: 7,
    ciljnaPersona: 'Cuvar',
    parametri: [
      { naziv: 'nivo', tip: 'string', opis: 'Nivo skeniranja', podrazumevano: 'potpuni' },
    ],
    tagovi: ['bezbednost', 'audit', 'ranjivosti'],
    prioritet: 'kritican',
    importi: [
      { naziv: 'Bezbednosni logovi', opis: 'Log fajlovi za bezbednosnu analizu', formati: ['log', 'json', 'csv', 'txt'], obavezan: true },
      { naziv: 'Konfiguracija sistema', opis: 'Bezbednosna konfiguracija za audit', formati: ['json', 'yaml', 'xml'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Bezbednosni izveštaj', opis: 'Izveštaj o ranjivostima i preporukama', formati: ['json', 'pdf', 'html', 'md'] },
      { naziv: 'Lista ranjivosti', opis: 'Detaljne ranjivosti sa prioritetima', formati: ['csv', 'xlsx', 'json'] },
    ],
  },
  {
    id: 'prompt-persona-lekar',
    naziv: 'Lekar Prompt',
    opis: 'Prompt za OMEGA AI Lekara — dijagnostika i popravke',
    ikona: '⚕️',
    kategorija: 'dijagnosticki',
    sadrzaj: 'Dijagnostikuj sistem. Pokreni 11 dijagnostičkih provera, identifikuj probleme, predloži i primeni popravke. Auto-popravka mod aktivan.',
    spajaProVerzija: 8,
    ciljnaPersona: 'Lekar',
    parametri: [
      { naziv: 'autoPopravka', tip: 'boolean', opis: 'Automatska popravka', podrazumevano: 'true' },
    ],
    tagovi: ['dijagnostika', 'popravka', 'zdravlje'],
    prioritet: 'kritican',
    importi: [
      { naziv: 'Dijagnostički podaci', opis: 'Sistemski logovi i metrike za dijagnostiku', formati: ['json', 'log', 'csv', 'txt'], obavezan: true },
      { naziv: 'Greške sistema', opis: 'Error logovi i stack trace-ovi', formati: ['log', 'txt', 'json'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Dijagnostički izveštaj', opis: 'Rezultati dijagnostike sa popravkama', formati: ['json', 'pdf', 'html', 'md'] },
      { naziv: 'Popravke log', opis: 'Log izvršenih popravki', formati: ['log', 'json', 'txt'] },
    ],
  },
  {
    id: 'prompt-persona-graditelj',
    naziv: 'Graditelj Prompt',
    opis: 'Prompt za OMEGA AI Graditelja — implementacija funkcionalnosti',
    ikona: '🔨',
    kategorija: 'persona',
    sadrzaj: 'Implementiraj novu funkcionalnost. Napravi kod, napiši testove, izvrši code review, refaktoruj po potrebi. TypeScript + Next.js 16 standardi.',
    spajaProVerzija: 10,
    ciljnaPersona: 'Graditelj',
    parametri: [
      { naziv: 'funkcionalnost', tip: 'string', opis: 'Naziv funkcionalnosti za implementaciju' },
    ],
    tagovi: ['implementacija', 'kod', 'razvoj'],
    prioritet: 'kritican',
    importi: [
      { naziv: 'Specifikacija', opis: 'Specifikacija funkcionalnosti za implementaciju', formati: ['md', 'docx', 'pdf', 'txt'], obavezan: true },
      { naziv: 'Izvorni kod', opis: 'Postojeći kod za refaktorisanje', formati: ['json', 'txt', 'csv'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Generisani kod', opis: 'Implementirani kod sa testovima', formati: ['json', 'txt', 'md'] },
      { naziv: 'Code review izveštaj', opis: 'Izveštaj o kvalitetu koda', formati: ['json', 'pdf', 'md', 'html'] },
    ],
  },
  {
    id: 'prompt-persona-dizajner',
    naziv: 'Dizajner Prompt',
    opis: 'Prompt za OMEGA AI Dizajnera — UI/UX dizajn',
    ikona: '🎨',
    kategorija: 'kreativni',
    sadrzaj: 'Kreiraj UI/UX rešenje. Definiši vizuelni identitet, obezbedi responsivnost i accessibility. Tailwind CSS 4 + React 19 komponente.',
    spajaProVerzija: 9,
    ciljnaPersona: 'Dizajner',
    parametri: [
      { naziv: 'komponenta', tip: 'string', opis: 'Naziv komponente za dizajn' },
    ],
    tagovi: ['dizajn', 'ui', 'ux', 'accessibility'],
    prioritet: 'srednji',
    importi: [
      { naziv: 'Dizajn zahtevi', opis: 'Zahtevi za UI/UX dizajn', formati: ['md', 'pdf', 'docx', 'txt'], obavezan: true },
      { naziv: 'Vizuelni resursi', opis: 'Slike, ikone, boje za dizajn', formati: ['png', 'jpg', 'svg', 'json'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Dizajn specifikacija', opis: 'UI/UX specifikacija sa komponentama', formati: ['json', 'html', 'pdf', 'md'] },
      { naziv: 'Dizajn resursi', opis: 'Generisani vizuelni elementi', formati: ['svg', 'png', 'json'] },
    ],
  },
  {
    id: 'prompt-persona-tester',
    naziv: 'Tester Prompt',
    opis: 'Prompt za OMEGA AI Testera — kvalitet i testiranje',
    ikona: '🧪',
    kategorija: 'persona',
    sadrzaj: 'Testiraj kvalitet koda. Napiši unit testove, integration testove, izvrši regression testing. Osiguraj pokrivenost koda.',
    spajaProVerzija: 8,
    ciljnaPersona: 'Tester',
    parametri: [
      { naziv: 'tipTesta', tip: 'string', opis: 'Tip testa', podrazumevano: 'svi' },
    ],
    tagovi: ['testiranje', 'kvalitet', 'qa'],
    prioritet: 'visok',
    importi: [
      { naziv: 'Izvorni kod', opis: 'Kod za testiranje', formati: ['json', 'txt'], obavezan: true },
      { naziv: 'Test specifikacije', opis: 'Specifikacije za test scenarije', formati: ['md', 'csv', 'json', 'xlsx'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Test rezultati', opis: 'Rezultati izvršenih testova', formati: ['json', 'html', 'csv', 'pdf'] },
      { naziv: 'Pokrivenost koda', opis: 'Izveštaj o pokrivenosti koda testovima', formati: ['json', 'html', 'csv'] },
    ],
  },
  {
    id: 'prompt-persona-dokumentar',
    naziv: 'Dokumentar Prompt',
    opis: 'Prompt za OMEGA AI Dokumentara — dokumentacija',
    ikona: '📝',
    kategorija: 'persona',
    sadrzaj: 'Napiši dokumentaciju. API docs, changelog, knowledge base. Jasno, precizno, sa primerima koda i dijagramima.',
    spajaProVerzija: 8,
    ciljnaPersona: 'Dokumentar',
    parametri: [
      { naziv: 'format', tip: 'string', opis: 'Format dokumentacije', podrazumevano: 'markdown' },
    ],
    tagovi: ['dokumentacija', 'api', 'changelog'],
    prioritet: 'visok',
    importi: [
      { naziv: 'Izvorni kod', opis: 'Kod za koji se piše dokumentacija', formati: ['json', 'txt', 'yaml'], obavezan: true },
      { naziv: 'Postojeća dokumentacija', opis: 'Prethodna dokumentacija za ažuriranje', formati: ['md', 'docx', 'html', 'pdf'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Dokumentacija', opis: 'Generisana dokumentacija', formati: ['md', 'html', 'pdf', 'docx'] },
      { naziv: 'API specifikacija', opis: 'API dokumentacija u standardnom formatu', formati: ['json', 'yaml', 'html'] },
    ],
  },
  {
    id: 'prompt-persona-kreator',
    naziv: 'Kreator Prompt',
    opis: 'Prompt za OMEGA AI Kreatora — kreacija sadržaja',
    ikona: '✨',
    kategorija: 'kreativni',
    sadrzaj: 'Kreiraj sadržaj za platformu. Šabloni, primeri, resursi, multimedija. SpajaPro 9 multimodalni Prompt aktivan.',
    spajaProVerzija: 9,
    ciljnaPersona: 'Kreator',
    parametri: [
      { naziv: 'tipSadrzaja', tip: 'string', opis: 'Tip sadržaja za kreaciju' },
    ],
    tagovi: ['kreacija', 'sadrzaj', 'multimedija'],
    prioritet: 'srednji',
    importi: [
      { naziv: 'Šabloni sadržaja', opis: 'Šabloni i primeri za kreaciju sadržaja', formati: ['json', 'md', 'html', 'txt'], obavezan: false },
      { naziv: 'Multimedijalni resursi', opis: 'Slike, ikone i ostali resursi', formati: ['png', 'jpg', 'svg'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Kreiran sadržaj', opis: 'Generisani sadržaj u željenom formatu', formati: ['md', 'html', 'json', 'txt', 'pdf'] },
      { naziv: 'Multimedija', opis: 'Generisani vizuelni sadržaj', formati: ['png', 'svg', 'jpg'] },
    ],
  },
  {
    id: 'prompt-persona-optimizator',
    naziv: 'Optimizator Prompt',
    opis: 'Prompt za OMEGA AI Optimizatora — performanse',
    ikona: '⚡',
    kategorija: 'analitika',
    sadrzaj: 'Optimizuj performanse. Bundle size, caching, lazy loading, Core Web Vitals. Merenje pre i posle optimizacije.',
    spajaProVerzija: 8,
    ciljnaPersona: 'Optimizator',
    parametri: [
      { naziv: 'metrika', tip: 'string', opis: 'Ciljna metrika za optimizaciju', podrazumevano: 'sve' },
    ],
    tagovi: ['performanse', 'optimizacija', 'web-vitals'],
    prioritet: 'visok',
    importi: [
      { naziv: 'Performansni podaci', opis: 'Metrike performansi za analizu', formati: ['json', 'csv'], obavezan: true },
      { naziv: 'Konfiguracija', opis: 'Build i runtime konfiguracija', formati: ['json', 'yaml'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Optimizacioni izveštaj', opis: 'Izveštaj sa preporukama za optimizaciju', formati: ['json', 'pdf', 'html', 'md'] },
      { naziv: 'Performansne metrike', opis: 'Pre/posle metrike optimizacije', formati: ['csv', 'json', 'xlsx'] },
    ],
  },
  {
    id: 'prompt-persona-skalator',
    naziv: 'Skalator Prompt',
    opis: 'Prompt za OMEGA AI Skalatora — skaliranje infrastrukture',
    ikona: '📐',
    kategorija: 'persona',
    sadrzaj: 'Skaliraj infrastrukturu. Load balancing, CDN, edge computing. Obezbedi nulto vreme zastoja.',
    spajaProVerzija: 10,
    ciljnaPersona: 'Skalator',
    parametri: [
      { naziv: 'kapacitet', tip: 'string', opis: 'Ciljni kapacitet' },
    ],
    tagovi: ['skaliranje', 'infrastruktura', 'edge'],
    prioritet: 'visok',
    importi: [
      { naziv: 'Infrastrukturna mapa', opis: 'Trenutna infrastruktura i resursi', formati: ['json', 'yaml', 'xml'], obavezan: true },
      { naziv: 'Metrike opterećenja', opis: 'Podaci o opterećenju i saobraćaju', formati: ['csv', 'json'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Plan skaliranja', opis: 'Detaljan plan za skaliranje infrastrukture', formati: ['json', 'pdf', 'md', 'yaml'] },
      { naziv: 'Konfiguracija infrastrukture', opis: 'Ažurirana konfiguracija resursa', formati: ['json', 'yaml', 'xml'] },
    ],
  },
  {
    id: 'prompt-persona-naucnik',
    naziv: 'Naučnik Prompt',
    opis: 'Prompt za OMEGA AI Naučnika — istraživanje',
    ikona: '🔬',
    kategorija: 'analitika',
    sadrzaj: 'Istraži nove tehnologije i pristupe. Napravi prototipove, izvrši benchmarking. SpajaPro 8 analitički Prompt za duboku analizu.',
    spajaProVerzija: 8,
    ciljnaPersona: 'Naucnik',
    parametri: [
      { naziv: 'tema', tip: 'string', opis: 'Tema istraživanja' },
    ],
    tagovi: ['istrazivanje', 'prototip', 'benchmark'],
    prioritet: 'srednji',
    importi: [
      { naziv: 'Istraživački podaci', opis: 'Podaci za analizu i istraživanje', formati: ['csv', 'json', 'xlsx', 'txt'], obavezan: true },
      { naziv: 'Prethodna istraživanja', opis: 'Rezultati prethodnih istraživanja', formati: ['pdf', 'md', 'json'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Istraživački izveštaj', opis: 'Rezultati istraživanja sa zaključcima', formati: ['pdf', 'md', 'html', 'json'] },
      { naziv: 'Benchmark rezultati', opis: 'Rezultati benchmarking testova', formati: ['csv', 'json', 'xlsx'] },
    ],
  },
  {
    id: 'prompt-persona-analiticar',
    naziv: 'Analitičar Prompt',
    opis: 'Prompt za OMEGA AI Analitičara — analiza podataka',
    ikona: '📊',
    kategorija: 'analitika',
    sadrzaj: 'Analiziraj podatke, metrike i trendove. Generiši izveštaje sa vizualizacijom. Prediktivna analitika aktivna.',
    spajaProVerzija: 8,
    ciljnaPersona: 'Analiticar',
    parametri: [
      { naziv: 'perioda', tip: 'string', opis: 'Period analize', podrazumevano: '30d' },
    ],
    tagovi: ['analitika', 'metrike', 'izvestaji'],
    prioritet: 'srednji',
    importi: [
      { naziv: 'Podaci za analizu', opis: 'Sirovi podaci za analitičku obradu', formati: ['csv', 'json', 'xlsx', 'sql'], obavezan: true },
      { naziv: 'Definicije metrika', opis: 'Definicije metrika i KPI-jeva', formati: ['json', 'yaml', 'md'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Analitički izveštaj', opis: 'Izveštaj sa vizualizacijom podataka', formati: ['pdf', 'html', 'json', 'md'] },
      { naziv: 'Izvezeni podaci', opis: 'Obrađeni podaci u tabelarnom formatu', formati: ['csv', 'xlsx', 'json'] },
    ],
  },
  {
    id: 'prompt-persona-strateg',
    naziv: 'Strateg Prompt',
    opis: 'Prompt za OMEGA AI Stratega — strategija razvoja',
    ikona: '♟️',
    kategorija: 'orkestracioni',
    sadrzaj: 'Planiraj strategiju razvoja. Roadmap, prioritizacija, resursi. Dugoročno i kratkoročno planiranje.',
    spajaProVerzija: 10,
    ciljnaPersona: 'Strateg',
    parametri: [
      { naziv: 'horizont', tip: 'string', opis: 'Vremenski horizont', podrazumevano: '6m' },
    ],
    tagovi: ['strategija', 'roadmap', 'planiranje'],
    prioritet: 'visok',
    importi: [
      { naziv: 'Trenutno stanje', opis: 'Podaci o trenutnom stanju projekta', formati: ['json', 'md', 'pdf', 'xlsx'], obavezan: true },
      { naziv: 'Tržišna analiza', opis: 'Podaci o tržištu i konkurenciji', formati: ['csv', 'json', 'pdf'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Strateški plan', opis: 'Kompletan strateški plan razvoja', formati: ['pdf', 'md', 'docx', 'json'] },
      { naziv: 'Roadmap', opis: 'Vremenski plan sa miljokazima', formati: ['json', 'csv', 'xlsx', 'html'] },
    ],
  },
  {
    id: 'prompt-persona-mentor',
    naziv: 'Mentor Prompt',
    opis: 'Prompt za OMEGA AI Mentora — obuka i vođenje',
    ikona: '🎓',
    kategorija: 'persona',
    sadrzaj: 'Obučavaj i vodi tim. Best practices, knowledge sharing, mentoring sesije. Prompt za edukaciju i transfer znanja.',
    spajaProVerzija: 9,
    ciljnaPersona: 'Mentor',
    parametri: [
      { naziv: 'tema', tip: 'string', opis: 'Tema obuke' },
    ],
    tagovi: ['obuka', 'mentoring', 'znanje'],
    prioritet: 'srednji',
    importi: [
      { naziv: 'Materijali za obuku', opis: 'Edukativni materijali i resursi', formati: ['md', 'pdf', 'docx', 'txt', 'html'], obavezan: false },
      { naziv: 'Profil polaznika', opis: 'Informacije o timu/polaznicima', formati: ['json', 'csv'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Plan obuke', opis: 'Strukturisan plan obuke', formati: ['md', 'pdf', 'docx', 'html'] },
      { naziv: 'Edukativni materijal', opis: 'Generisan edukativni sadržaj', formati: ['md', 'html', 'pdf', 'txt'] },
    ],
  },
  {
    id: 'prompt-persona-integrator',
    naziv: 'Integrator Prompt',
    opis: 'Prompt za OMEGA AI Integratora — sistemska integracija',
    ikona: '🔗',
    kategorija: 'orkestracioni',
    sadrzaj: 'Integriši sisteme i servise. API-jevi, webhook-ovi, sinhronizacija. SpajaPro 10 multi-agent Prompt za koordinaciju.',
    spajaProVerzija: 10,
    ciljnaPersona: 'Integrator',
    parametri: [
      { naziv: 'sistem', tip: 'string', opis: 'Ciljni sistem za integraciju' },
    ],
    tagovi: ['integracija', 'api', 'sinhronizacija'],
    prioritet: 'visok',
    importi: [
      { naziv: 'API specifikacija', opis: 'OpenAPI/Swagger specifikacije za integraciju', formati: ['json', 'yaml', 'xml'], obavezan: true },
      { naziv: 'Konfiguracija servisa', opis: 'Konfiguracija spoljnih servisa', formati: ['json', 'yaml'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Integracioni plan', opis: 'Plan integracije sa mapiranjem podataka', formati: ['json', 'yaml', 'md', 'pdf'] },
      { naziv: 'Integracioni izveštaj', opis: 'Status integracije i logovi', formati: ['json', 'html', 'csv', 'log'] },
    ],
  },
  {
    id: 'prompt-persona-komunikator',
    naziv: 'Komunikator Prompt',
    opis: 'Prompt za OMEGA AI Komunikatora — komunikacija',
    ikona: '📢',
    kategorija: 'persona',
    sadrzaj: 'Upravaljaj komunikacijom. Notifikacije, eskalacija, izveštavanje. Prompt za jasnu i efikasnu komunikaciju.',
    spajaProVerzija: 9,
    ciljnaPersona: 'Komunikator',
    parametri: [
      { naziv: 'kanal', tip: 'string', opis: 'Komunikacioni kanal', podrazumevano: 'svi' },
    ],
    tagovi: ['komunikacija', 'notifikacije', 'izveštavanje'],
    prioritet: 'srednji',
    importi: [
      { naziv: 'Poruke/obaveštenja', opis: 'Šabloni poruka i obaveštenja', formati: ['json', 'txt', 'md', 'html'], obavezan: false },
      { naziv: 'Kontakt lista', opis: 'Lista primalaca komunikacije', formati: ['csv', 'json', 'xlsx'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Komunikacioni izveštaj', opis: 'Izveštaj o poslatim komunikacijama', formati: ['json', 'pdf', 'csv', 'html'] },
      { naziv: 'Šabloni poruka', opis: 'Generisani šabloni za komunikaciju', formati: ['json', 'html', 'md', 'txt'] },
    ],
  },
  {
    id: 'prompt-persona-finansijer',
    naziv: 'Finansijer Prompt',
    opis: 'Prompt za OMEGA AI Finansijera — budžeti i ROI',
    ikona: '💰',
    kategorija: 'analitika',
    sadrzaj: 'Upravljaj finansijama. Budžeti, ROI, cost optimization. Prompt za finansijsku analizu i izveštavanje.',
    spajaProVerzija: 8,
    ciljnaPersona: 'Finansijer',
    parametri: [
      { naziv: 'period', tip: 'string', opis: 'Finansijski period', podrazumevano: 'mesec' },
    ],
    tagovi: ['finansije', 'budzet', 'roi'],
    prioritet: 'srednji',
    importi: [
      { naziv: 'Finansijski podaci', opis: 'Transakcije, prihodi, rashodi', formati: ['csv', 'xlsx', 'json', 'sql'], obavezan: true },
      { naziv: 'Budžetski plan', opis: 'Postojeći budžetski plan za analizu', formati: ['xlsx', 'csv', 'json', 'pdf'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Finansijski izveštaj', opis: 'Izveštaj o finansijskom stanju', formati: ['pdf', 'xlsx', 'csv', 'json', 'html'] },
      { naziv: 'ROI analiza', opis: 'Analiza povraćaja investicije', formati: ['pdf', 'json', 'xlsx'] },
    ],
  },
  {
    id: 'prompt-persona-evolver',
    naziv: 'Evolver Prompt',
    opis: 'Prompt za OMEGA AI Evolvera — evolucija sistema',
    ikona: '🧬',
    kategorija: 'evolucioni',
    sadrzaj: 'Evolviraj sistem. Nadogradnja, inovacije, napredak. SpajaPro 13 samo-evolucioni Prompt za kontinuirani napredak.',
    spajaProVerzija: 13,
    ciljnaPersona: 'Evolver',
    parametri: [
      { naziv: 'oblast', tip: 'string', opis: 'Oblast evolucije' },
    ],
    tagovi: ['evolucija', 'inovacija', 'napredak'],
    prioritet: 'srednji',
    importi: [
      { naziv: 'Stanje sistema', opis: 'Trenutno stanje sistema za evoluciju', formati: ['json', 'yaml'], obavezan: true },
      { naziv: 'Evolucioni ciljevi', opis: 'Definisani ciljevi evolucije', formati: ['md', 'json', 'txt'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Evolucioni izveštaj', opis: 'Rezultat evolucionog procesa', formati: ['json', 'md', 'pdf', 'html'] },
      { naziv: 'Ažurirani sistem', opis: 'Nova konfiguracija sistema posle evolucije', formati: ['json', 'yaml'] },
    ],
  },
  {
    id: 'prompt-persona-monitor',
    naziv: 'Monitor Prompt',
    opis: 'Prompt za OMEGA AI Monitora — nadzor u realnom vremenu',
    ikona: '👁️',
    kategorija: 'dijagnosticki',
    sadrzaj: 'Nadgledaj operacije. Real-time alerting, uptime monitoring, anomaly detection. Prompt za kontinuirani nadzor.',
    spajaProVerzija: 8,
    ciljnaPersona: 'Monitor',
    parametri: [
      { naziv: 'interval', tip: 'string', opis: 'Interval provere', podrazumevano: '30s' },
    ],
    tagovi: ['monitoring', 'alerting', 'uptime'],
    prioritet: 'visok',
    importi: [
      { naziv: 'Monitoring konfiguracija', opis: 'Konfiguracija za monitoring i alerting', formati: ['json', 'yaml'], obavezan: true },
      { naziv: 'Metrički podaci', opis: 'Real-time metrike sistema', formati: ['json', 'csv'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Monitoring izveštaj', opis: 'Izveštaj o statusu i uptime-u sistema', formati: ['json', 'html', 'pdf', 'csv'] },
      { naziv: 'Alert logovi', opis: 'Logovi alarma i notifikacija', formati: ['log', 'json', 'csv', 'txt'] },
    ],
  },
  {
    id: 'prompt-persona-ekolog',
    naziv: 'Ekolog Prompt',
    opis: 'Prompt za OMEGA AI Ekologa — zdravlje ekosistema',
    ikona: '🌿',
    kategorija: 'dijagnosticki',
    sadrzaj: 'Brine o zdravlju ekosistema. Balans resursa, sustainability, optimizacija. Prompt za holistički pristup.',
    spajaProVerzija: 10,
    ciljnaPersona: 'Ekolog',
    parametri: [
      { naziv: 'metrika', tip: 'string', opis: 'Ekosistem metrika', podrazumevano: 'zdravlje' },
    ],
    tagovi: ['ekosistem', 'zdravlje', 'sustainability'],
    prioritet: 'srednji',
    importi: [
      { naziv: 'Ekosistem podaci', opis: 'Podaci o stanju ekosistema', formati: ['json', 'csv', 'yaml'], obavezan: true },
      { naziv: 'Resursi sistema', opis: 'Trenutna potrošnja resursa', formati: ['json', 'csv'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Ekosistem izveštaj', opis: 'Izveštaj o zdravlju ekosistema', formati: ['json', 'pdf', 'html', 'md'] },
      { naziv: 'Sustainability metrike', opis: 'Metrike održivosti sistema', formati: ['csv', 'json', 'xlsx'] },
    ],
  },
  {
    id: 'prompt-persona-vizionar',
    naziv: 'Vizionar Prompt',
    opis: 'Prompt za OMEGA AI Vizionara — vizija budućnosti',
    ikona: '🔮',
    kategorija: 'persona',
    sadrzaj: 'Vizija budućnosti platforme. Trendovi, dugoročno planiranje, inovativni koncepti. SpajaPro 15 univerzalni Prompt.',
    spajaProVerzija: 15,
    ciljnaPersona: 'Vizionar',
    parametri: [
      { naziv: 'horizont', tip: 'string', opis: 'Vremenski horizont vizije', podrazumevano: '5g' },
    ],
    tagovi: ['vizija', 'buducnost', 'inovacija'],
    prioritet: 'nizak',
    importi: [
      { naziv: 'Trendovi', opis: 'Analiza trendova i predikcije', formati: ['json', 'csv', 'pdf', 'md'], obavezan: false },
      { naziv: 'Strateški dokumenti', opis: 'Postojeća strategija i vizija', formati: ['pdf', 'md', 'docx'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Vizija dokument', opis: 'Dokument sa vizijom i pravcima razvoja', formati: ['pdf', 'md', 'docx', 'html'] },
      { naziv: 'Inovacioni predlozi', opis: 'Lista inovativnih predloga', formati: ['json', 'md', 'csv'] },
    ],
  },

  // ─── Platforma Prompt-ovi ────────────────────────────────
  {
    id: 'prompt-platforma-io-openui-ao',
    naziv: 'IO-OPENUI-AO Prompt',
    opis: 'Prompt za IO-OPENUI-AO platformu — zamena za ChatGPT sa SpajaPro engine-om',
    ikona: '🖥️',
    kategorija: 'platforma',
    sadrzaj: 'IO-OPENUI-AO koristi SpajaPro engine umesto ChatGPT-a. Svi Prompt-ovi se obrađuju kroz SpajaPro 6-15 verzije za optimalni rezultat.',
    spajaProVerzija: 10,
    ciljnaPlatforma: 'IO-OPENUI-AO',
    parametri: [
      { naziv: 'modul', tip: 'string', opis: 'UI modul za Prompt', podrazumevano: 'svi' },
    ],
    tagovi: ['io-openui-ao', 'spajapro', 'frontend'],
    prioritet: 'visok',
    importi: [
      { naziv: 'UI komponente', opis: 'Konfiguacija UI komponenti za obradu', formati: ['json', 'yaml', 'html'], obavezan: false },
      { naziv: 'Korisnikovi podaci', opis: 'Ulazni podaci korisnika za Prompt', formati: ['json', 'txt', 'csv', 'md'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Prompt rezultat', opis: 'Rezultat obrade Prompt-a', formati: ['json', 'md', 'html', 'txt'] },
      { naziv: 'UI konfiguracija', opis: 'Generisana UI konfiguracija', formati: ['json', 'yaml', 'html'] },
    ],
  },
  {
    id: 'prompt-platforma-super-platforma',
    naziv: 'AI IQ SUPER PLATFORMA Prompt',
    opis: 'Centralni Prompt za upravljanje celim ekosistemom',
    ikona: '🏢',
    kategorija: 'platforma',
    sadrzaj: 'Centralna Prompt komanda za AI IQ SUPER PLATFORMA. Upravlja svim modulima, platformama i AI agentima kroz SpajaPro engine.',
    spajaProVerzija: 10,
    ciljnaPlatforma: 'AI-IQ-SUPER-PLATFORMA',
    parametri: [
      { naziv: 'operacija', tip: 'string', opis: 'Tip operacije', podrazumevano: 'status' },
    ],
    tagovi: ['platforma', 'upravljanje', 'ekosistem'],
    prioritet: 'kritican',
    importi: [
      { naziv: 'Komanda operacija', opis: 'Komandni fajl sa operacijama za izvršenje', formati: ['json', 'yaml', 'txt'], obavezan: true },
      { naziv: 'Ekosistem stanje', opis: 'Trenutno stanje celokupnog ekosistema', formati: ['json', 'yaml'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Ekosistem izveštaj', opis: 'Kompletan izveštaj o ekosistemu', formati: ['json', 'pdf', 'html', 'md'] },
      { naziv: 'Operacioni log', opis: 'Log izvršenih operacija', formati: ['log', 'json', 'txt', 'csv'] },
    ],
  },
  {
    id: 'prompt-platforma-proksi',
    naziv: 'Proksi Prompt',
    opis: 'Prompt za Proksi mrežu — distribucija kroz egzotične signale',
    ikona: '📡',
    kategorija: 'platforma',
    sadrzaj: 'Prompt distribucija kroz Proksi mrežu. Koncentrični, ekscentrični, ekliptični i rezonantni signali za Prompt prenos.',
    spajaProVerzija: 11,
    ciljnaPlatforma: 'Proksi-Mreza',
    parametri: [
      { naziv: 'signal', tip: 'string', opis: 'Tip signala', podrazumevano: 'koncentricni' },
    ],
    tagovi: ['proksi', 'signal', 'distribucija'],
    prioritet: 'visok',
    importi: [
      { naziv: 'Signal konfiguracija', opis: 'Konfiguracija signala za distribuciju', formati: ['json', 'yaml', 'xml'], obavezan: true },
      { naziv: 'Mrežni podaci', opis: 'Podaci za prenos kroz mrežu', formati: ['json', 'csv', 'txt'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Distribucioni izveštaj', opis: 'Izveštaj o distribuciji signala', formati: ['json', 'html', 'pdf'] },
      { naziv: 'Mrežni logovi', opis: 'Logovi mrežnog prenosa', formati: ['log', 'json', 'csv', 'txt'] },
    ],
  },
  {
    id: 'prompt-platforma-mobilna',
    naziv: 'Mobilna Mreža Prompt',
    opis: 'Prompt optimizovan za SPAJA Mobilnu Mrežu',
    ikona: '📱',
    kategorija: 'platforma',
    sadrzaj: 'Mobilni Prompt kroz SPAJA Mobilnu Mrežu. Edge AI obrada, offline keš, IoT senzori. Kompresovani Prompt za mobilne uređaje.',
    spajaProVerzija: 12,
    ciljnaPlatforma: 'SPAJA-Mobilna-Mreza',
    parametri: [
      { naziv: 'mreza', tip: 'string', opis: 'Mobilna mreža', podrazumevano: 'sve' },
    ],
    tagovi: ['mobilna', 'edge', 'iot'],
    prioritet: 'visok',
    importi: [
      { naziv: 'Senzorski podaci', opis: 'Podaci sa IoT senzora i mobilnih uređaja', formati: ['json', 'csv'], obavezan: false },
      { naziv: 'Mobilna konfiguracija', opis: 'Konfiguracija mobilne mreže', formati: ['json', 'yaml'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Mobilni izveštaj', opis: 'Izveštaj o mobilnoj mreži i uređajima', formati: ['json', 'pdf', 'html'] },
      { naziv: 'Edge AI rezultati', opis: 'Rezultati Edge AI obrade', formati: ['json', 'csv', 'txt'] },
    ],
  },

  // ─── Univerzalni Prompt ──────────────────────────────────
  {
    id: 'prompt-univerzalni',
    naziv: 'Univerzalni Prompt',
    opis: 'Univerzalni Prompt za sve sisteme — SpajaPro 15 engine',
    ikona: '🌟',
    kategorija: 'univerzalni',
    sadrzaj: 'Univerzalni SpajaPro Prompt koji može da obradi bilo koji zahtev u celom ekosistemu Kompanije SPAJA. Kvantni procesor, neograničeni kontekst.',
    spajaProVerzija: 15,
    parametri: [
      { naziv: 'zahtev', tip: 'string', opis: 'Slobodan zahtev' },
    ],
    tagovi: ['univerzalni', 'svemoguci', 'kvantni'],
    prioritet: 'kritican',
    importi: [
      { naziv: 'Ulazni podaci', opis: 'Bilo koji tip ulaznih podataka za univerzalnu obradu', formati: ['json', 'csv', 'xml', 'yaml', 'txt', 'md', 'html', 'pdf', 'xlsx', 'docx', 'sql', 'log'], obavezan: false },
      { naziv: 'Multimedijalni fajlovi', opis: 'Slike i vizuelni resursi za obradu', formati: ['png', 'jpg', 'svg'], obavezan: false },
    ],
    exporti: [
      { naziv: 'Univerzalni rezultat', opis: 'Rezultat obrade u željenom formatu', formati: ['json', 'csv', 'xml', 'yaml', 'txt', 'md', 'html', 'pdf', 'xlsx', 'docx'] },
      { naziv: 'Vizuelni rezultat', opis: 'Generisani vizuelni sadržaj', formati: ['png', 'svg', 'jpg'] },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────

export function getPromptPoKategoriji(kategorija: PromptKategorija): Prompt[] {
  return promptovi.filter((p) => p.kategorija === kategorija);
}

export function getPromptZaPersonu(persona: OmegaAIUloga): Prompt | undefined {
  return promptovi.find((p) => p.ciljnaPersona === persona);
}

export function getPromptZaPlatformu(platforma: string): Prompt[] {
  return promptovi.filter((p) => p.ciljnaPlatforma === platforma);
}

export function getPromptBiblioteka(): PromptBiblioteka {
  const kategorije = promptovi.reduce<Record<string, number>>((acc, p) => {
    acc[p.kategorija] = (acc[p.kategorija] ?? 0) + 1;
    return acc;
  }, {}) as Record<PromptKategorija, number>;

  const spajaProVerzije = [...new Set(promptovi.map((p) => p.spajaProVerzija))].sort((a, b) => a - b);

  return {
    ukupnoPromptova: promptovi.length,
    kategorije,
    personaPromptovi: promptovi.filter((p) => p.ciljnaPersona).length,
    platformaPromptovi: promptovi.filter((p) => p.ciljnaPlatforma).length,
    spajaProVerzije,
    promptovi,
  };
}

export function getBrojPromptova(): number {
  return promptovi.length;
}

export function getPromptKategorije(): PromptKategorija[] {
  return [...new Set(promptovi.map((p) => p.kategorija))];
}
