// SpajaUltraOmegaCore -∞Ω+∞ — Code Analyzer Modul
// Kompanija SPAJA — Digitalna Industrija
// Detekcija programskog jezika, analiza koda za bugove, code smells i sigurnosne ranjivosti

// ─── Tipovi ──────────────────────────────────────────────────────────

export type ProgramskiJezik =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'php'
  | 'sql'
  | 'bash'
  | 'html'
  | 'css'
  | 'json'
  | 'yaml'
  | 'nepoznat';

export type KodProblemTip =
  | 'bug'
  | 'security'
  | 'code-smell'
  | 'performance'
  | 'maintainability';

export type KodProblemOzbiljnost = 'kritican' | 'visok' | 'srednji' | 'nizak' | 'info';

export interface KodProblem {
  tip: KodProblemTip;
  ozbiljnost: KodProblemOzbiljnost;
  opis: string;
  preporuka: string;
  linija?: number;
}

export interface KodBlok {
  jezik: ProgramskiJezik;
  kod: string;
  pozicija: number;
}

export interface KodAnalizaRezultat {
  /** Da li poruka sadrži kod */
  sadrzKod: boolean;
  /** Detektovani programski jezik */
  jezik: ProgramskiJezik;
  /** Izvučeni blokovi koda */
  blokovi: KodBlok[];
  /** Lista pronađenih problema */
  problemi: KodProblem[];
  /** Ukupni skor kvaliteta (0-100, viši je bolji) */
  kvalitetSkor: number;
  /** Instrukcija za AI da analizira kod */
  aiInstrukcija: string;
}

// ─── Mapiranje jezika ─────────────────────────────────────────────────

const JEZIK_OZNAKE: Record<string, ProgramskiJezik> = {
  ts: 'typescript',
  tsx: 'typescript',
  typescript: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  javascript: 'javascript',
  py: 'python',
  python: 'python',
  java: 'java',
  cs: 'csharp',
  csharp: 'csharp',
  go: 'go',
  golang: 'go',
  rs: 'rust',
  rust: 'rust',
  php: 'php',
  sql: 'sql',
  sh: 'bash',
  bash: 'bash',
  shell: 'bash',
  html: 'html',
  css: 'css',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
};

// ─── Detekcija programa ────────────────────────────────────────────────

/**
 * Detektuje programski jezik iz markdown fence oznake ili sadržaja koda.
 */
export function detektujJezik(tekst: string): ProgramskiJezik {
  // Pokušaj iz fence bloka ```jezik
  const fenceMatch = tekst.match(/```(\w+)/);
  if (fenceMatch?.[1]) {
    const oznaka = fenceMatch[1].toLowerCase();
    if (JEZIK_OZNAKE[oznaka]) return JEZIK_OZNAKE[oznaka];
  }

  // Heuristike po sadržaju
  const cod = tekst.replace(/```[\s\S]*?```/g, '').toLowerCase();
  if (/\bimport\s+type\b|\binterface\b|\btype\s+\w+\s*=/.test(tekst)) return 'typescript';
  if (/\bdef\s+\w+\s*\(|\bimport\s+\w+\b.*\n.*:/.test(tekst)) return 'python';
  if (/\bpublic\s+class\b|\bprivate\s+\w+\s+\w+;/.test(tekst)) return 'java';
  if (/\bnamespace\b|\busing\s+System/.test(tekst)) return 'csharp';
  if (/\bfunc\s+\w+\s*\(|\bpackage\s+main\b/.test(tekst)) return 'go';
  if (/\bfn\s+\w+\s*\(|\blet\s+mut\b|\bimpl\b/.test(tekst)) return 'rust';
  if (/\$\w+\s*=|\becho\b|\bphp\b/i.test(tekst)) return 'php';
  if (/\bSELECT\b|\bFROM\b|\bWHERE\b/i.test(tekst)) return 'sql';
  if (/\bconst\b|\blet\b|\bvar\b|\bfunction\b/.test(cod)) return 'javascript';
  if (cod.includes('#!/')) return 'bash';
  if (/<\w+[\s>]/.test(tekst)) return 'html';
  if (/\bmargin:|padding:|display:/.test(cod)) return 'css';
  if (/^\s*[\[{]/.test(cod)) return 'json';
  return 'nepoznat';
}

// ─── Izvlačenje blokova koda ──────────────────────────────────────────

/**
 * Izvlači sve blokove koda iz markdown teksta.
 */
export function izvuciBlokoveKoda(tekst: string): KodBlok[] {
  const blokovi: KodBlok[] = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  let indeks = 0;

  while ((m = regex.exec(tekst)) !== null) {
    const oznaka = m[1]?.toLowerCase() ?? '';
    const kod = m[2] ?? '';
    const jezik: ProgramskiJezik = JEZIK_OZNAKE[oznaka] ?? detektujJezik(kod);
    blokovi.push({ jezik, kod, pozicija: indeks++ });
  }

  // Ako nema fence blokova, proveri da li cela poruka izgleda kao kod
  if (blokovi.length === 0) {
    const izgledaKaoKod =
      /^\s*(import|export|const|let|var|def|func|function|class|public|private|SELECT)\b/.test(
        tekst.trim(),
      );
    if (izgledaKaoKod) {
      blokovi.push({ jezik: detektujJezik(tekst), kod: tekst, pozicija: 0 });
    }
  }

  return blokovi;
}

// ─── Statička analiza problema ────────────────────────────────────────

const SIGURNOSNI_OBRASCI: Array<{ regex: RegExp; opis: string; preporuka: string }> = [
  {
    regex: /eval\s*\(/,
    opis: 'Korišćenje `eval()` može izvršiti proizvoljni kod',
    preporuka: 'Zamenite `eval()` bezbednom alternativom (JSON.parse, Function constructor sa validacijom)',
  },
  {
    regex: /innerHTML\s*=/,
    opis: 'Direktno postavljanje `innerHTML` može dovesti do XSS napada',
    preporuka: 'Koristite `textContent` ili DOMPurify za sanitizaciju HTML-a',
  },
  {
    regex: /process\.env\.[A-Z_]+\s*(?!&&|\?\?)/,
    opis: 'Environment varijabla se koristi bez null-check-a',
    preporuka: 'Uvek proverite da li env var postoji: `process.env.VAR ?? throwIfMissing()`',
  },
  {
    regex: /password|lozinka|sifra|secret|api[_-]?key/i,
    opis: 'Potencijalno osetljiva promenljiva detektovana u kodu',
    preporuka: 'Nikada ne hardcode-ujte lozinke ili API ključeve — koristite env varijable',
  },
  {
    regex: /\bexec\s*\(|child_process/,
    opis: 'Izvršavanje sistemskih komandi može biti rizično',
    preporuka: 'Validujte sve ulaze pre prosleđivanja OS komandama; koristite allowlist',
  },
  {
    regex: /Math\.random\(\)/,
    opis: '`Math.random()` nije kriptografski siguran',
    preporuka: 'Za sigurnosne svrhe koristite `crypto.getRandomValues()` ili `crypto.randomBytes()`',
  },
];

const BUG_OBRASCI: Array<{ regex: RegExp; opis: string; preporuka: string }> = [
  {
    regex: /===\s*null\s*&&\s*===\s*undefined|==\s*null\s*&&\s*==\s*undefined/,
    opis: 'Redundantna null/undefined provera — može se skratiti',
    preporuka: 'Koristite `== null` da proverite i null i undefined istovremeno',
  },
  {
    regex: /catch\s*\([^)]*\)\s*\{\s*\}/,
    opis: 'Prazan catch blok — greška se tihо guta',
    preporuka: 'Bar logujte grešku: `catch (e) { console.error(e); }`',
  },
  {
    regex: /\.length\s*>\s*0\s*&&\s*\w+\[0\]|\.length\s*&&\s*\w+\[0\]/,
    opis: 'Pristup prvom elementu bez provere na undefined',
    preporuka: 'Koristite optional chaining: `niz[0]?.property`',
  },
  {
    regex: /return\s*;?\n\s*[^}\s]/,
    opis: 'Mrtav kod posle `return` izjave',
    preporuka: 'Uklonite kod koji se nikad ne izvršava',
  },
];

const CODE_SMELL_OBRASCI: Array<{ regex: RegExp; opis: string; preporuka: string }> = [
  {
    regex: /function\s+\w+\s*\([^)]{100,}\)/,
    opis: 'Funkcija ima previše parametara',
    preporuka: 'Grupišite parametre u objekat (Options pattern)',
  },
  {
    regex: /\/\/\s*TODO|\/\/\s*FIXME|\/\/\s*HACK/i,
    opis: 'TODO/FIXME komentar detektovan u kodu',
    preporuka: 'Rešite odložene zadatke ili ih pratite u ticket sistemu',
  },
  {
    regex: /console\.(log|warn|info)\s*\(/,
    opis: '`console.log` ostavljen u produkcijskom kodu',
    preporuka: 'Koristite strukturirani logger (winston, pino) umesto console.log',
  },
  {
    regex: /any\b/,
    opis: 'TypeScript tip `any` korišćen — gubi se type-safety',
    preporuka: 'Zamenite `any` konkretnim tipom, `unknown`, ili generičkim tipom',
  },
];

/**
 * Statički analizira kod i pronalazi potencijalne probleme.
 */
export function analizirajKod(kod: string, jezik: ProgramskiJezik): KodProblem[] {
  const problemi: KodProblem[] = [];

  for (const obrazac of SIGURNOSNI_OBRASCI) {
    if (obrazac.regex.test(kod)) {
      problemi.push({
        tip: 'security',
        ozbiljnost: 'visok',
        opis: obrazac.opis,
        preporuka: obrazac.preporuka,
      });
    }
  }

  for (const obrazac of BUG_OBRASCI) {
    if (obrazac.regex.test(kod)) {
      problemi.push({
        tip: 'bug',
        ozbiljnost: 'srednji',
        opis: obrazac.opis,
        preporuka: obrazac.preporuka,
      });
    }
  }

  for (const obrazac of CODE_SMELL_OBRASCI) {
    if (obrazac.regex.test(kod)) {
      problemi.push({
        tip: 'code-smell',
        ozbiljnost: 'nizak',
        opis: obrazac.opis,
        preporuka: obrazac.preporuka,
      });
    }
  }

  // Dužina reda — samo za tekstualne jezike
  if (!['sql', 'json', 'yaml'].includes(jezik)) {
    const dugaLinija = kod
      .split('\n')
      .findIndex((red) => red.length > 120);
    if (dugaLinija !== -1) {
      problemi.push({
        tip: 'maintainability',
        ozbiljnost: 'info',
        opis: `Linija ${dugaLinija + 1} je duža od 120 karaktera`,
        preporuka: 'Razbijte dugačke linije za bolju čitljivost',
        linija: dugaLinija + 1,
      });
    }
  }

  return problemi;
}

/**
 * Računa skor kvaliteta koda (0–100).
 */
export function izracunajKvalitetSkor(problemi: KodProblem[]): number {
  const ODBITAK: Record<KodProblemOzbiljnost, number> = {
    kritican: 30,
    visok: 15,
    srednji: 8,
    nizak: 3,
    info: 1,
  };

  const ukupanOdbitak = problemi.reduce(
    (sum, p) => sum + (ODBITAK[p.ozbiljnost] ?? 0),
    0,
  );

  return Math.max(0, 100 - ukupanOdbitak);
}

/**
 * Generiše instrukciju za AI da napravi detaljnu analizu koda.
 */
export function generisiAIAnalizuInstrukciju(
  jezik: ProgramskiJezik,
  problemi: KodProblem[],
): string {
  const problemTekst =
    problemi.length > 0
      ? `\n\nStatička analiza je pronašla sledeće potencijalne probleme:\n${
          problemi
            .map(
              (p, i) =>
                `${i + 1}. [${p.tip.toUpperCase()}] ${p.opis} — Preporuka: ${p.preporuka}`,
            )
            .join('\n')
        }\n\nAnaliziraj da li su ovi problemi stvarni u kontekstu celog koda.`
      : '';

  return `Analiziraj sledeći ${jezik} kod sveobuhvatno:\n\n**Traži:**\n- Bugove i logičke greške\n- Sigurnosne ranjivosti (OWASP Top 10 relevantne za ${jezik})\n- Code smells i loše prakse\n- Performansne probleme\n- Probleme sa čitljivošću i održavanjem\n\n**Format odgovora:**\n1. Kratak opis šta kod radi\n2. Pronađeni problemi (sa linijama ako je moguće)\n3. Konkretne ispravke sa code primerima\n4. Opšte preporuke za poboljšanje${problemTekst}`;
}

// ─── Glavna funkcija ──────────────────────────────────────────────────

/**
 * Kompletna analiza poruke — detektuje kod, jezik i probleme.
 */
export function analizirajPoruku(poruka: string): KodAnalizaRezultat {
  const blokovi = izvuciBlokoveKoda(poruka);

  if (blokovi.length === 0) {
    return {
      sadrzKod: false,
      jezik: 'nepoznat',
      blokovi: [],
      problemi: [],
      kvalitetSkor: 100,
      aiInstrukcija: '',
    };
  }

  const primarniBlok = blokovi[0]!;
  const sviProblemi: KodProblem[] = [];

  for (const blok of blokovi) {
    const problemi = analizirajKod(blok.kod, blok.jezik);
    sviProblemi.push(...problemi);
  }

  const kvalitetSkor = izracunajKvalitetSkor(sviProblemi);
  const aiInstrukcija = generisiAIAnalizuInstrukciju(primarniBlok.jezik, sviProblemi);

  return {
    sadrzKod: true,
    jezik: primarniBlok.jezik,
    blokovi,
    problemi: sviProblemi,
    kvalitetSkor,
    aiInstrukcija,
  };
}
