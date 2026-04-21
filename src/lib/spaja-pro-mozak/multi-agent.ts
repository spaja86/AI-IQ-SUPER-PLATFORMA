// SpajaUltraOmegaCore -∞Ω+∞ — Multi-Agent Koordinacija
// Kompanija SPAJA — Digitalna Industrija
// Paralelno poziva specijalizovane sub-agente i kombinuje odgovore

// ─── Tipovi ──────────────────────────────────────────────────────────

export type AgentUloga =
  | 'sigurnost'
  | 'arhitektura'
  | 'code-review'
  | 'performance'
  | 'ux'
  | 'dokumentacija'
  | 'testiranje'
  | 'biznis';

export type AgentStatus = 'ceka' | 'aktivno' | 'zavrseno' | 'greska';

export interface AgentZadatak {
  id: string;
  uloga: AgentUloga;
  naziv: string;
  ikona: string;
  opis: string;
  systemPrompt: string;
  userPrompt: string;
  status: AgentStatus;
  prioritet: number; // 1 = najviši
}

export interface AgentOdgovor {
  agentId: string;
  uloga: AgentUloga;
  naziv: string;
  ikona: string;
  odgovor: string;
  greska?: string;
}

export interface MultiAgentRezultat {
  /** Da li je zahtev pogodan za multi-agent obradu */
  jePogodan: boolean;
  /** Odabrani agenti */
  agenti: AgentZadatak[];
  /** Kombinovani odgovor */
  kombinovaniOdgovor: string;
  /** Broj uspešnih agenata */
  uspesnihAgenata: number;
  /** Ukupno agenata */
  ukupnoAgenata: number;
}

// ─── Definicije agenata ───────────────────────────────────────────────

const AGENT_DEFINICIJE: Record<
  AgentUloga,
  { naziv: string; ikona: string; opis: string; systemPrompt: string }
> = {
  sigurnost: {
    naziv: 'Security Agent',
    ikona: '🔐',
    opis: 'Analizira sigurnosne aspekte i ranjivosti',
    systemPrompt: `Ti si specijalizovani Security Expert AI agent. 
Tvoja jedina uloga je da analiziraš sigurnosne aspekte zahteva ili koda.
Fokusiraj se ISKLJUČIVO na: ranjivosti (OWASP), autentifikaciju, autorizaciju, 
enkripciju, injection napade, data exposure, i sigurnosne best practices.
Budi konkretan i navedi severitet svake ranjivosti (Kritičan/Visok/Srednji/Nizak).`,
  },
  arhitektura: {
    naziv: 'Architecture Agent',
    ikona: '🏗️',
    opis: 'Ocenjuje arhitekturalne odluke i dizajn',
    systemPrompt: `Ti si specijalizovani Software Architect AI agent.
Tvoja jedina uloga je da analiziraš arhitekturalne aspekte sistema.
Fokusiraj se ISKLJUČIVO na: design patterns, SOLID principi, scalability, 
maintainability, coupling/cohesion, microservices vs monolith trade-offs, 
database design, API design i sistemsku koheziju.`,
  },
  'code-review': {
    naziv: 'Code Review Agent',
    ikona: '🔍',
    opis: 'Pregledava kod za bugove i best practices',
    systemPrompt: `Ti si specijalizovani Code Reviewer AI agent.
Tvoja jedina uloga je da pregledaš kod na mikro-nivou.
Fokusiraj se ISKLJUČIVO na: bugove, logičke greške, edge cases, 
TypeScript tipove, imenovanje varijabli, DRY principe, 
čitljivost i konkretne sugestije za poboljšanje.`,
  },
  performance: {
    naziv: 'Performance Agent',
    ikona: '⚡',
    opis: 'Analizira performanse i optimizacije',
    systemPrompt: `Ti si specijalizovani Performance Engineer AI agent.
Tvoja jedina uloga je da analiziraš performansne aspekte.
Fokusiraj se ISKLJUČIVO na: algoritamsku kompleksnost (Big O), 
database N+1 problemi, caching strategije, lazy loading, 
memory leaks, bundle size, network waterfall i konkretna optimizacijska rešenja.`,
  },
  ux: {
    naziv: 'UX Agent',
    ikona: '🎨',
    opis: 'Ocenjuje korisničko iskustvo i upotrebljivost',
    systemPrompt: `Ti si specijalizovani UX/UI Expert AI agent.
Tvoja jedina uloga je da analiziraš korisničko iskustvo.
Fokusiraj se ISKLJUČIVO na: usability, accessibility (WCAG), 
user flow, error states, loading states, feedback mehanizmi,
mobilni dizajn i konkretne UX poboljšanje sa primerima.`,
  },
  dokumentacija: {
    naziv: 'Documentation Agent',
    ikona: '📝',
    opis: 'Generiše dokumentaciju i docstrings',
    systemPrompt: `Ti si specijalizovani Technical Writer AI agent.
Tvoja jedina uloga je da generišeš tehničku dokumentaciju.
Fokusiraj se ISKLJUČIVO na: JSDoc/docstrings, README sekcije, 
API dokumentacija, komentare u kodu, arhitekturnu dokumentaciju i
primere upotrebe koji su jasni i kompletni.`,
  },
  testiranje: {
    naziv: 'Testing Agent',
    ikona: '🧪',
    opis: 'Planira i generiše test strategiju',
    systemPrompt: `Ti si specijalizovani QA Engineer AI agent.
Tvoja jedina uloga je da planiraš i generišeš testove.
Fokusiraj se ISKLJUČIVO na: unit testovi, integration testovi,
e2e testovi, test coverage, edge cases, mocking strategije,
TDD pristup i konkretne test primere u relevantnom framework-u.`,
  },
  biznis: {
    naziv: 'Business Agent',
    ikona: '💼',
    opis: 'Analizira poslovne implikacije i ROI',
    systemPrompt: `Ti si specijalizovani Business Analyst AI agent.
Tvoja jedina uloga je da analiziraš poslovne aspekte.
Fokusiraj se ISKLJUČIVO na: ROI, poslovni uticaj, troškovi implementacije,
vremenski plan, resursi, rizici, alternativna rešenja i 
preporuke za prioritizaciju sa poslovne perspektive.`,
  },
};

// ─── Selekcija agenata po tipu zahteva ───────────────────────────────

const ZAHTEV_AGENT_MAPA: Array<{
  regex: RegExp;
  agenti: AgentUloga[];
}> = [
  {
    regex: /\b(security|sigurnost|bezbednost|audit|ranjivost|vulnerability|auth)\b/i,
    agenti: ['sigurnost', 'code-review', 'arhitektura'],
  },
  {
    regex: /\b(arhitektura|architecture|dizajn\s+sistema|system\s+design|scalability)\b/i,
    agenti: ['arhitektura', 'performance', 'sigurnost'],
  },
  {
    regex: /\b(code\s+review|pregledaj\s+kod|review\s+this|refaktorisanje|refactor)\b/i,
    agenti: ['code-review', 'performance', 'testiranje'],
  },
  {
    regex: /\b(performance|performanse|optimizacija|optimize|slow|sporo|latency)\b/i,
    agenti: ['performance', 'arhitektura', 'code-review'],
  },
  {
    regex: /\b(implementiraj|implementacija|build|razvij|napravi\s+(?:sistem|aplikaciju|api))\b/i,
    agenti: ['arhitektura', 'sigurnost', 'testiranje'],
  },
  {
    regex: /\b(dokumentacija|documentation|docs|napiši\s+docs)\b/i,
    agenti: ['dokumentacija', 'code-review'],
  },
];

// ─── Javne funkcije ───────────────────────────────────────────────────

/**
 * Proverava da li je zahtev pogodan za multi-agent obradu.
 * Multi-agent je smislen samo za složene, višedimenzionalne zahteve.
 */
export function jePogodan_za_MultiAgent(poruka: string): boolean {
  const jeSlozeni = ZAHTEV_AGENT_MAPA.some(({ regex }) => regex.test(poruka));
  const duzina = poruka.trim().split(/\s+/).length;
  return jeSlozeni && duzina > 10;
}

/**
 * Odabira najpodesnijih agenata za dati zahtev (max 3).
 */
export function odaberiAgente(poruka: string): AgentZadatak[] {
  let selectedRoles: AgentUloga[] = [];

  for (const { regex, agenti } of ZAHTEV_AGENT_MAPA) {
    if (regex.test(poruka)) {
      selectedRoles = agenti;
      break;
    }
  }

  // Podrazumevano: code-review + arhitektura ako nema specifičnog match-a
  if (selectedRoles.length === 0) {
    selectedRoles = ['code-review', 'arhitektura', 'sigurnost'];
  }

  return selectedRoles.slice(0, 3).map((uloga, index) => {
    const def = AGENT_DEFINICIJE[uloga];
    return {
      id: `agent-${uloga}-${Date.now()}`,
      uloga,
      naziv: def.naziv,
      ikona: def.ikona,
      opis: def.opis,
      systemPrompt: def.systemPrompt,
      userPrompt: poruka,
      status: 'ceka' as AgentStatus,
      prioritet: index + 1,
    };
  });
}

/**
 * Kombinuje odgovore od više agenata u jedan koherentan odgovor.
 */
export function kombinirajOdgovore(odgovori: AgentOdgovor[]): string {
  if (odgovori.length === 0) return 'Ni jedan agent nije vratio odgovor.';

  const uspesni = odgovori.filter((o) => !o.greska);

  if (uspesni.length === 0) {
    return 'Svi agenti su naišli na grešku pri obradi zahteva.';
  }

  const sekcije = uspesni.map(
    (o) => `## ${o.ikona} ${o.naziv}\n\n${o.odgovor}`,
  );

  return [
    `# 🤖 Multi-Agent Analiza (${uspesni.length}/${odgovori.length} agenata)`,
    '',
    ...sekcije,
    '',
    '---',
    '',
    `*Analiza sprovedena paralelno od ${uspesni.length} specijalizovana AI agenta.*`,
  ].join('\n\n');
}

/**
 * Formatira prikaz statusa agenata za UI (streaming prikaz).
 */
export function formatirajStatusAgenata(agenti: AgentZadatak[]): string {
  return agenti
    .map((a) => {
      const statusIkona =
        a.status === 'zavrseno'
          ? '✅'
          : a.status === 'aktivno'
            ? '⏳'
            : a.status === 'greska'
              ? '❌'
              : '⬜';
      return `${statusIkona} **${a.naziv}** ${a.opis}`;
    })
    .join('\n');
}
