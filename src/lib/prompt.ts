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
