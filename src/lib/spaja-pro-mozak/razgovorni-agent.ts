// SpajaUltraOmegaCore -∞Ω+∞ — Multi-Turn Razgovorni Agent
// Kompanija SPAJA — Digitalna Industrija
// Detekcija nedostajućeg konteksta i generisanje follow-up pitanja

// ─── Tipovi ──────────────────────────────────────────────────────────

export type NedostajuciKontekstTip =
  | 'tech-stack'
  | 'okruzenje'
  | 'verzija'
  | 'kod-primer'
  | 'greska-poruka'
  | 'ocekivano-ponasanje'
  | 'operativni-sistem'
  | 'cilj'
  | 'ogranicenja';

export interface NedostajuciKontekst {
  tip: NedostajuciKontekstTip;
  pitanje: string;
  prioritet: number; // 1 (visok) - 5 (nizak)
}

export interface RazgovornaAnalizaRezultat {
  /** Da li upit zahteva follow-up pitanje */
  trebaPitanje: boolean;
  /** Lista nedostajućih konteksta sortirana po prioritetu */
  nedostaje: NedostajuciKontekst[];
  /** Generisano follow-up pitanje (ako trebaPitanje) */
  followUpPitanje: string;
  /** Kategorija upita */
  kategorijaUpita: string;
}

export interface IstorijaRazgovora {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Signali za nedostajući kontekst ─────────────────────────────────

const KONTEKST_SIGNALI: Array<{
  tip: NedostajuciKontekstTip;
  kljucneReci: RegExp;
  pitanje: string;
  prioritet: number;
}> = [
  {
    tip: 'greska-poruka',
    kljucneReci:
      /\b(greška|error|ne\s+radi|problem|bug|ne\s+funkcioniše|puca|crash|fails?|broken|exception)\b/i,
    pitanje:
      'Da bih bolje analizirao problem, možeš li da priložiš **tačnu poruku greške** (error message ili stack trace)?',
    prioritet: 1,
  },
  {
    tip: 'kod-primer',
    kljucneReci:
      /\b(implementiraj|napiši|popravi|refaktoriši|optimizuj|pregledaj\s+kod|code\s+review|impl|build|create)\b/i,
    pitanje:
      'Da bih dao precizan odgovor, možeš li da priložiš **relevantan deo koda** ili inicijalni snippet sa kojim radiš?',
    prioritet: 2,
  },
  {
    tip: 'tech-stack',
    kljucneReci:
      /\b(kako\s+da|how\s+to|na\s+koji\s+način|best\s+practice|preporuči|suggest|šta\s+koristiti)\b/i,
    pitanje:
      'Koji je tvoj **tech stack**? (npr. Next.js + TypeScript + Supabase, ili Python + FastAPI + PostgreSQL) To će mi pomoći da dam relevantniji odgovor.',
    prioritet: 2,
  },
  {
    tip: 'verzija',
    kljucneReci:
      /\b(next\.?js|react|node|python|typescript|vue|angular|django|laravel|spring)\b/i,
    pitanje:
      'Koju **verziju** koristiš? (npr. Next.js 15, React 18, Node 20) Neke funkcionalnosti se razlikuju između verzija.',
    prioritet: 3,
  },
  {
    tip: 'okruzenje',
    kljucneReci:
      /\b(deployment|deploy|produkcija|production|hosting|server|cloud|local|localhost|docker|k8s)\b/i,
    pitanje:
      'U kom **okruženju** se javlja problem? (lokalni development, staging, produkcija) I koji hosting provajder koristiš?',
    prioritet: 3,
  },
  {
    tip: 'ocekivano-ponasanje',
    kljucneReci:
      /\b(trebalo\s+bi|expected|treba\s+da|should|ne\s+daje\s+rezultat|wrong\s+result|incorrect)\b/i,
    pitanje:
      'Šta je **očekivano ponašanje** u poređenju sa stvarnim? Možeš li da opišeš korak po korak šta se dešava?',
    prioritet: 2,
  },
  {
    tip: 'operativni-sistem',
    kljucneReci: /\b(windows|linux|mac|macos|ubuntu|centos|wsl|terminal|cmd|powershell)\b/i,
    pitanje:
      'Na kom **operativnom sistemu** radiš? (Windows, macOS, Linux distro) Ovo utiče na path, permisije i komande.',
    prioritet: 4,
  },
  {
    tip: 'cilj',
    kljucneReci:
      /\b(šta\s+je\s+bolje|compare|versus|vs\.|koji|which|preporučuješ|recommend)\b/i,
    pitanje:
      'Šta je **krajnji cilj**? Da li gradiš startup MVP, enterprise sistem, ili nešto za ličnu upotrebu? To utiče na preporuku.',
    prioritet: 3,
  },
  {
    tip: 'ogranicenja',
    kljucneReci:
      /\b(optimizuj|performance|brzina|speed|skalabilnost|scale|cost|cena|budzet|budget)\b/i,
    pitanje:
      'Koje su tvoje **ključne ograničenja**? (budget, tim veličina, rok, broj korisnika) To utiče na arhitekturnu preporuku.',
    prioritet: 4,
  },
];

// ─── Detekcija da li istorija već ima odgovor ────────────────────────

function istorijaSadrzOdgovorNa(
  istorija: IstorijaRazgovora[],
  tip: NedostajuciKontekstTip,
): boolean {
  const SIGNALI_U_ISTORIJI: Record<NedostajuciKontekstTip, RegExp> = {
    'tech-stack': /\b(react|next|vue|angular|python|java|typescript|node)\b/i,
    okruzenje: /\b(local|production|vercel|aws|heroku|digital\s*ocean)\b/i,
    verzija: /\bv?\d+\.\d+/,
    'kod-primer': /```/,
    'greska-poruka': /error|exception|stack\s*trace|greška/i,
    'ocekivano-ponasanje': /trebalo\s+bi|expected|ocekujem/i,
    'operativni-sistem': /\b(windows|linux|mac|ubuntu)\b/i,
    cilj: /\b(MVP|produkcija|personal|enterprise)\b/i,
    ogranicenja: /\b(\d+\s*korisnika|\d+\s*users|budget|\d+k)\b/i,
  };

  const korisnickePorukeIzIstorije = istorija
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join(' ');

  return SIGNALI_U_ISTORIJI[tip]?.test(korisnickePorukeIzIstorije) ?? false;
}

// ─── Javne funkcije ───────────────────────────────────────────────────

/**
 * Analizira poruku i istoriju razgovora, vraća follow-up pitanja ako su potrebna.
 */
export function analizirajKontekst(
  poruka: string,
  istorija: IstorijaRazgovora[] = [],
): RazgovornaAnalizaRezultat {
  // Kratke poruke (pozdrav, zahvalnost) ne treba dodatnog konteksta
  const kratka =
    poruka.trim().split(/\s+/).length < 5 ||
    /^(hvala|ok|super|odlično|razumem|ясно|thanks|great)\b/i.test(poruka.trim());

  if (kratka) {
    return {
      trebaPitanje: false,
      nedostaje: [],
      followUpPitanje: '',
      kategorijaUpita: 'kratka-interakcija',
    };
  }

  const nedostaje: NedostajuciKontekst[] = [];

  for (const signal of KONTEKST_SIGNALI) {
    if (signal.kljucneReci.test(poruka)) {
      // Proveri da li je kontekst već dat u istoriji
      if (!istorijaSadrzOdgovorNa(istorija, signal.tip)) {
        nedostaje.push({
          tip: signal.tip,
          pitanje: signal.pitanje,
          prioritet: signal.prioritet,
        });
      }
    }
  }

  // Sortiraj po prioritetu (manji broj = viši prioritet)
  nedostaje.sort((a, b) => a.prioritet - b.prioritet);

  // Postavi pitanje samo ako je prioritet <= 2 (visok/srednji)
  const visokiPrioritet = nedostaje.filter((n) => n.prioritet <= 2);
  const trebaPitanje = visokiPrioritet.length > 0 && istorija.length === 0;

  const followUpPitanje = trebaPitanje && visokiPrioritet[0]
    ? visokiPrioritet[0].pitanje
    : '';

  return {
    trebaPitanje,
    nedostaje,
    followUpPitanje,
    kategorijaUpita: nedostaje[0]?.tip ?? 'opsti',
  };
}

/**
 * Generiše dodatnu instrukciju za AI na osnovu nedostajućeg konteksta.
 * Umesto da pita korisnika, pomaže AI-u da bolje odgovori.
 */
export function generisiKontekstInstrukciju(
  analiza: RazgovornaAnalizaRezultat,
): string {
  if (analiza.nedostaje.length === 0) return '';

  const nedostajuciTipovi = analiza.nedostaje
    .slice(0, 3)
    .map((n) => n.tip)
    .join(', ');

  return `\n\n**Napomena za odgovor:** Korisniku nedostaje kontekst o: ${nedostajuciTipovi}. Na kraju odgovora, ljubazno postavi jedno precizno pitanje za najvažniji nedostajući kontekst da bi naredni odgovor bio još precizniji.`;
}
