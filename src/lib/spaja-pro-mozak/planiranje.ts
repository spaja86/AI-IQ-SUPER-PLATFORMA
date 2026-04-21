// SpajaUltraOmegaCore -∞Ω+∞ — Task Planner Modul
// Kompanija SPAJA — Digitalna Industrija
// Razbija složene zahteve u Chain-of-Thought korake sa progress praćenjem

// ─── Tipovi ──────────────────────────────────────────────────────────

export type KorakStatus = 'ceka' | 'aktivno' | 'zavrseno' | 'preskoceno';

export type PlanKategorija =
  | 'razvoj-softvera'
  | 'analiza'
  | 'pisanje'
  | 'debugging'
  | 'arhitektura'
  | 'istrazivanje'
  | 'opsti';

export interface KorakPlana {
  redni: number;
  naziv: string;
  opis: string;
  status: KorakStatus;
  alati?: string[];
}

export interface PlanZahteva {
  /** Da li je zahtev dovoljno složen za planiranje */
  jeSlozeni: boolean;
  /** Kategorija zahteva */
  kategorija: PlanKategorija;
  /** Lista koraka */
  koraci: KorakPlana[];
  /** Ukupan broj koraka */
  ukupnoKoraka: number;
  /** Procenjeno vreme (opisno) */
  procenjenovreme: string;
  /** Instrukcija za AI da prati plan */
  aiInstrukcija: string;
}

// ─── Detekcija složenosti zahteva ─────────────────────────────────────

const SLOZENI_SIGNALI: RegExp[] = [
  /\b(implementiraj|izgradi|napravi|develop|build|create)\b.*\b(sistem|aplikacija|platforma|servis|api|auth)\b/i,
  /\b(refaktoriši|refactor|prepiši|rewrite)\b.*\b(kod|codebase|modul|klasa)\b/i,
  /\b(analiziraj|analyze)\b.*\b(i\s+(preporuči|prikaži|objasni)|then\s+(suggest|explain))\b/i,
  /\b(napiši|write)\b.*\b(izveštaj|report|dokumentacija|documentation|plan|specifikacija)\b/i,
  /\b(optimizuj|optimize)\b.*\b(performance|baza|database|upiti|queries)\b/i,
  /\b(dizajniraj|design)\b.*\b(arhitektura|architecture|schema|api|database)\b/i,
  /\b(popravi|fix)\b.*\b(sve|all|svaki|each|multiple)\b/i,
  /korak\s+po\s+korak|step\s+by\s+step/i,
];

const KATEGORIJA_OBRASCI: Array<{ kategorija: PlanKategorija; regex: RegExp }> = [
  { kategorija: 'razvoj-softvera', regex: /\b(implementiraj|napiši\s+kod|build|create\s+function|napravi\s+komponent)\b/i },
  { kategorija: 'debugging', regex: /\b(popravi|fix|debug|greška\s+se|error\s+occurs|ne\s+radi)\b/i },
  { kategorija: 'arhitektura', regex: /\b(dizajniraj|arhitektura|design\s+system|database\s+schema|API\s+design)\b/i },
  { kategorija: 'analiza', regex: /\b(analiziraj|analyze|review|pregledaj|proceni|evaluate)\b/i },
  { kategorija: 'pisanje', regex: /\b(napiši|write|dokumentacija|izveštaj|blog|email|nacrt)\b/i },
  { kategorija: 'istrazivanje', regex: /\b(istraži|research|uporedi|compare|šta\s+je\s+bolje)\b/i },
];

// ─── Generisanje koraka po kategoriji ────────────────────────────────

const KORACI_PO_KATEGORIJI: Record<PlanKategorija, Omit<KorakPlana, 'status'>[]> = {
  'razvoj-softvera': [
    { redni: 1, naziv: 'Analiza zahteva', opis: 'Razumevanje šta tačno treba implementirati i koji edge cases postoje', alati: [] },
    { redni: 2, naziv: 'Dizajn rešenja', opis: 'Definisanje interfejsa, tipova i arhitekture pre pisanja koda', alati: [] },
    { redni: 3, naziv: 'Implementacija', opis: 'Pisanje koda sa komentarima i TypeScript tipovima', alati: [] },
    { redni: 4, naziv: 'Testiranje i validacija', opis: 'Edge case analiza, unit test primeri, potencijalni bugovi', alati: [] },
    { redni: 5, naziv: 'Dokumentacija', opis: 'Docstrings, primer upotrebe, README sekcija', alati: [] },
  ],
  debugging: [
    { redni: 1, naziv: 'Reprodukcija problema', opis: 'Razumevanje tačnog scenarija koji dovodi do greške', alati: [] },
    { redni: 2, naziv: 'Analiza stack trace-a', opis: 'Identifikacija tačne linije i modula gde se greška javlja', alati: [] },
    { redni: 3, naziv: 'Root cause analiza', opis: 'Pronalaženje uzroka greške (tipovi, async, null, dependency)', alati: [] },
    { redni: 4, naziv: 'Primena ispravke', opis: 'Konkretna ispravka koda sa objašnjenjem', alati: [] },
    { redni: 5, naziv: 'Prevencija ponavljanja', opis: 'Dodavanje validacije, testova ili logging-a da se spreči ponavljanje', alati: [] },
  ],
  arhitektura: [
    { redni: 1, naziv: 'Definisanje ciljeva', opis: 'Funkcionalni i nefunkcionalni zahtevi (scale, performance, security)', alati: [] },
    { redni: 2, naziv: 'Analiza alternativa', opis: 'Poređenje različitih arhitekturnih pristupa sa trade-offs', alati: [] },
    { redni: 3, naziv: 'Definisanje komponenti', opis: 'Dijagram sistema, interfejsi između komponenti, data flow', alati: [] },
    { redni: 4, naziv: 'Database dizajn', opis: 'Shema baze podataka, indexi, relacije, normalizacija', alati: [] },
    { redni: 5, naziv: 'Implementacioni plan', opis: 'Faze razvoja, prioriteti, tehnički dugovi', alati: [] },
  ],
  analiza: [
    { redni: 1, naziv: 'Definisanje opsega', opis: 'Šta tačno treba analizirati i koji su kriterijumi', alati: [] },
    { redni: 2, naziv: 'Prikupljanje podataka', opis: 'Identifikacija relevantnih informacija i izvora', alati: [] },
    { redni: 3, naziv: 'Analiza i interpretacija', opis: 'Duboka analiza sa konkretnim nalazima', alati: [] },
    { redni: 4, naziv: 'Zaključci i preporuke', opis: 'Sažetak nalaza sa prioritizovanim akcijama', alati: [] },
  ],
  pisanje: [
    { redni: 1, naziv: 'Definisanje strukture', opis: 'Outline sa sekcijama i ključnim tačkama', alati: [] },
    { redni: 2, naziv: 'Pisanje sadržaja', opis: 'Detaljan sadržaj svake sekcije', alati: [] },
    { redni: 3, naziv: 'Revizija i poboljšanje', opis: 'Provera toka, jasnoće i tona teksta', alati: [] },
    { redni: 4, naziv: 'Formatiranje', opis: 'Finalni format, zaglavlja, liste, bold ključnih termina', alati: [] },
  ],
  istrazivanje: [
    { redni: 1, naziv: 'Definisanje upita', opis: 'Preciziranje šta tačno istražiti i koji su kriterijumi poređenja', alati: [] },
    { redni: 2, naziv: 'Web pretraga', opis: 'Prikupljanje aktuelnih informacija i podataka', alati: ['web_search'] },
    { redni: 3, naziv: 'Poređenje opcija', opis: 'Tabelarno poređenje sa pro/con analizom', alati: [] },
    { redni: 4, naziv: 'Preporuka', opis: 'Konkretna preporuka bazirana na kontekstu korisnika', alati: [] },
  ],
  opsti: [
    { redni: 1, naziv: 'Analiza upita', opis: 'Razumevanje pitanja i potrebnog konteksta', alati: [] },
    { redni: 2, naziv: 'Obrada', opis: 'Detaljna obrada zahteva', alati: [] },
    { redni: 3, naziv: 'Odgovor', opis: 'Strukturiran i potpun odgovor', alati: [] },
  ],
};

const VREME_PO_KATEGORIJI: Record<PlanKategorija, string> = {
  'razvoj-softvera': '5-15 minuta',
  debugging: '3-10 minuta',
  arhitektura: '10-20 minuta',
  analiza: '5-10 minuta',
  pisanje: '5-15 minuta',
  istrazivanje: '3-8 minuta',
  opsti: '1-5 minuta',
};

// ─── Javne funkcije ───────────────────────────────────────────────────

/**
 * Proverava da li je zahtev dovoljno složen za planiranje.
 */
export function jeSlozeniZahtev(poruka: string): boolean {
  return SLOZENI_SIGNALI.some((s) => s.test(poruka));
}

/**
 * Detektuje kategoriju zahteva.
 */
export function detektujKategorijuZahteva(poruka: string): PlanKategorija {
  for (const { kategorija, regex } of KATEGORIJA_OBRASCI) {
    if (regex.test(poruka)) return kategorija;
  }
  return 'opsti';
}

/**
 * Kreira plan za dati zahtev.
 */
export function kreirajPlan(poruka: string): PlanZahteva {
  const jeSlozeni = jeSlozeniZahtev(poruka);
  const kategorija = detektujKategorijuZahteva(poruka);
  const predlosciKoraci = KORACI_PO_KATEGORIJI[kategorija] ?? KORACI_PO_KATEGORIJI['opsti']!;

  const koraci: KorakPlana[] = predlosciKoraci.map((k) => ({
    ...k,
    status: 'ceka' as KorakStatus,
  }));

  const aiInstrukcija = jeSlozeni
    ? generisiAIPlanInstrukciju(kategorija, koraci)
    : '';

  return {
    jeSlozeni,
    kategorija,
    koraci,
    ukupnoKoraka: koraci.length,
    procenjenovreme: VREME_PO_KATEGORIJI[kategorija],
    aiInstrukcija,
  };
}

/**
 * Generiše instrukciju za AI da prati plan pri odgovaranju.
 */
export function generisiAIPlanInstrukciju(
  kategorija: PlanKategorija,
  koraci: KorakPlana[],
): string {
  const koraciTekst = koraci
    .map((k) => `**Korak ${k.redni}: ${k.naziv}** — ${k.opis}`)
    .join('\n');

  return [
    `Ovaj zahtev je klasifikovan kao "${kategorija}" i zahteva strukturisani pristup.`,
    '',
    'Organizuj odgovor prema sledećim koracima (označi svaki korak jasno):',
    '',
    koraciTekst,
    '',
    'Za svaki korak koristi odgovarajuće Markdown formatiranje. Budi konkretan i daj primere.',
  ].join('\n');
}

/**
 * Formatira plan kao progress prikaz (za UI streaming).
 */
export function formatirajPlanZaPrikaz(plan: PlanZahteva): string {
  if (!plan.jeSlozeni) return '';

  const koraci = plan.koraci
    .map((k) => {
      const ikona = k.status === 'zavrseno' ? '✅' : k.status === 'aktivno' ? '⏳' : '⬜';
      return `${ikona} **Korak ${k.redni}:** ${k.naziv}`;
    })
    .join('\n');

  return [
    `📋 **Plan za: ${plan.kategorija}** (${plan.ukupnoKoraka} koraka · ~${plan.procenjenovreme})`,
    '',
    koraci,
    '',
    '---',
    '',
  ].join('\n');
}
