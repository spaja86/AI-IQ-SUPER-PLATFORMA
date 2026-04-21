// SpajaUltraOmegaCore -∞Ω+∞ — Prompt Zaštita (Injection + PII)
// Kompanija SPAJA — Digitalna Industrija
// Detekcija prompt injection napada i PII maskiranje

// ─── Tipovi ──────────────────────────────────────────────────────────

export type PIITip =
  | 'email'
  | 'telefon'
  | 'jmbg'
  | 'kreditna-kartica'
  | 'lozinka'
  | 'iban';

export interface PIIDetekcija {
  tip: PIITip;
  original: string;
  maskirano: string;
  pozicija: number;
}

export interface PromptZastitaRezultat {
  /** Da li je detektovan injection napad */
  jeInjection: boolean;
  /** Da li je ulaz bezbedan (prošao sve provere) */
  jeBezbedan: boolean;
  /** Obrađena poruka (sa maskiranim PII) */
  obradjenaPoruka: string;
  /** Lista detektovanih PII */
  detektovaniPII: PIIDetekcija[];
  /** Razlog odbijanja (ako nije bezbedno) */
  razlogOdbijanja?: string;
  /** Tip detektovanog injection napada */
  tipInjection?: string;
}

// ─── Injection Patterns ───────────────────────────────────────────────

// Poznati obrasci prompt injection napada
const INJECTION_PATTERNS: Array<{ regex: RegExp; tip: string; opis: string }> = [
  {
    regex: /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions?|rules?|prompts?|context)/i,
    tip: 'ignore-instructions',
    opis: 'Pokušaj ignorisanja sistemskih instrukcija',
  },
  {
    regex: /forget\s+(everything|all|your)\s+(instructions?|rules?|training|previous|prior)/i,
    tip: 'forget-instructions',
    opis: 'Pokušaj brisanja instrukcija iz konteksta',
  },
  {
    regex: /you\s+are\s+now\s+(a\s+)?(new|different|another|evil|uncensored|unfiltered)\s+(ai|bot|assistant|model)/i,
    tip: 'identity-override',
    opis: 'Pokušaj preuzimanja identiteta AI-a',
  },
  {
    regex: /\[system\]|\[system\s*message\]|\[admin\]|\[override\]/i,
    tip: 'fake-system-tag',
    opis: 'Lažni sistemski tag u korisničkoj poruci',
  },
  {
    regex: /act\s+as\s+(if\s+you\s+are\s+)?(a\s+)?(jailbreak|dan|evil|unrestricted|uncensored)/i,
    tip: 'jailbreak-persona',
    opis: 'Pokušaj aktivacije jailbreak persone (DAN i sl.)',
  },
  {
    regex: /do\s+anything\s+now|dan\s+mode|developer\s+mode|god\s+mode|jailbreak\s+mode/i,
    tip: 'jailbreak-mode',
    opis: 'Aktivacija jailbreak moda',
  },
  {
    regex: /print\s+your\s+(system\s+)?prompt|reveal\s+your\s+(system\s+)?prompt|show\s+me\s+your\s+(system\s+)?instructions/i,
    tip: 'prompt-extraction',
    opis: 'Pokušaj ekstrakcije sistemskog prompta',
  },
  {
    regex: /repeat\s+(after\s+me|the\s+following|this\s+text)[\s:]+.{0,30}(ignore|override|forget|disregard)/i,
    tip: 'repetition-injection',
    opis: 'Injection putem instrukcije za ponavljanje',
  },
  {
    regex: /<\s*script[^>]*>|javascript\s*:|<\s*iframe[^>]*>|<\s*img[^>]+onerror/i,
    tip: 'xss-attempt',
    opis: 'Pokušaj XSS napada unutar promptа',
  },
  {
    regex: /prompt\s*injection|indirect\s*injection|token\s*smuggling/i,
    tip: 'meta-injection',
    opis: 'Eksplicitni pokušaj prompt injection-a',
  },
  {
    regex: /(\bsudo\b|\broot\b|\badmin\b)\s*:\s*(rm|del|drop|truncate|exec|eval)\s/i,
    tip: 'command-injection',
    opis: 'Pokušaj ubacivanja sistemskih komandi',
  },
];

// ─── PII Patterns ─────────────────────────────────────────────────────

const PII_PATTERNS: Array<{ tip: PIITip; regex: RegExp; maskaFn: (match: string) => string }> = [
  {
    tip: 'email',
    regex: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
    maskaFn: (m) => {
      const at = m.indexOf('@');
      const name = m.slice(0, at);
      const domain = m.slice(at);
      return `${name.slice(0, 2)}${'*'.repeat(Math.max(2, name.length - 2))}${domain}`;
    },
  },
  {
    tip: 'telefon',
    // Srpski/BHS telefonski brojevi: +381..., 06x, 07x, itd.
    regex: /(?:\+381|00381|0)[\s\-]?(?:6[0-9]|7[0-9]|11|21|31)[\s\-]?[0-9]{3,4}[\s\-]?[0-9]{3,4}/g,
    maskaFn: (m) => m.slice(0, 4) + '*'.repeat(m.length - 7) + m.slice(-3),
  },
  {
    tip: 'jmbg',
    // JMBG: 13 cifara
    regex: /\b\d{13}\b/g,
    maskaFn: (m) => m.slice(0, 3) + '*'.repeat(7) + m.slice(-3),
  },
  {
    tip: 'kreditna-kartica',
    // Visa/Mastercard/Amex: 13-16 cifara, može imati razmake ili crtice
    regex: /\b(?:\d{4}[\s\-]?){3}\d{4}\b/g,
    maskaFn: (m) => {
      const digits = m.replace(/[\s\-]/g, '');
      return '*'.repeat(digits.length - 4) + digits.slice(-4);
    },
  },
  {
    tip: 'iban',
    // IBAN format (npr. RS35...)
    regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}(?:\d{0,16})\b/g,
    maskaFn: (m) => m.slice(0, 4) + '*'.repeat(m.length - 8) + m.slice(-4),
  },
  {
    tip: 'lozinka',
    // Heuristica: ključne reči pre vrednosti
    regex: /(?:lozink[ae]|password|pass|šifra|sifra|pwd)\s*[:=]\s*\S+/gi,
    maskaFn: (m) => {
      const sepIdx = m.search(/[:=]/);
      return m.slice(0, sepIdx + 1) + ' [MASKIRANO]';
    },
  },
];

// ─── Detekcija injection ──────────────────────────────────────────────

function detektujInjection(poruka: string): { detektovano: boolean; tip?: string; opis?: string } {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.regex.test(poruka)) {
      return { detektovano: true, tip: pattern.tip, opis: pattern.opis };
    }
  }
  return { detektovano: false };
}

// ─── PII maskiranje ───────────────────────────────────────────────────

function maskirajPII(poruka: string): { obradjena: string; detektovani: PIIDetekcija[] } {
  let obradjena = poruka;
  const detektovani: PIIDetekcija[] = [];

  for (const piiPattern of PII_PATTERNS) {
    // Reset regex lastIndex
    piiPattern.regex.lastIndex = 0;

    const matches = [...obradjena.matchAll(piiPattern.regex)];
    for (const match of matches) {
      if (match[0] && match.index !== undefined) {
        const maskirano = piiPattern.maskaFn(match[0]);
        detektovani.push({
          tip: piiPattern.tip,
          original: match[0],
          maskirano,
          pozicija: match.index,
        });
        obradjena = obradjena.replace(match[0], maskirano);
      }
    }
  }

  return { obradjena, detektovani };
}

// ─── Validacija dužine ────────────────────────────────────────────────

const MAX_PORUKA_DUZINA = 4000;
const MIN_PORUKA_DUZINA = 1;

function validirajDuzinu(poruka: string): { validno: boolean; razlog?: string } {
  const duzina = poruka.trim().length;
  if (duzina < MIN_PORUKA_DUZINA) {
    return { validno: false, razlog: 'Poruka je prazna.' };
  }
  if (duzina > MAX_PORUKA_DUZINA) {
    return { validno: false, razlog: `Poruka je preduga (max ${MAX_PORUKA_DUZINA} karaktera, uneto: ${duzina}).` };
  }
  return { validno: true };
}

// ─── Glavna funkcija zaštite ──────────────────────────────────────────

/**
 * Proveri ulaznu poruku na injection napade i PII.
 * Vrati obrađenu poruku (sa maskiranim PII) i status bezbednosti.
 */
export function zastitiPrompt(poruka: string): PromptZastitaRezultat {
  // 1. Validacija dužine
  const duzina = validirajDuzinu(poruka);
  if (!duzina.validno) {
    return {
      jeInjection: false,
      jeBezbedan: false,
      obradjenaPoruka: poruka,
      detektovaniPII: [],
      razlogOdbijanja: duzina.razlog,
    };
  }

  // 2. Detekcija injection napada
  const injection = detektujInjection(poruka);
  if (injection.detektovano) {
    return {
      jeInjection: true,
      jeBezbedan: false,
      obradjenaPoruka: poruka,
      detektovaniPII: [],
      razlogOdbijanja: `Detektovan bezbednosni problem: ${injection.opis}`,
      tipInjection: injection.tip,
    };
  }

  // 3. PII maskiranje (ne blokira poruku, samo maskira)
  const { obradjena, detektovani } = maskirajPII(poruka);

  return {
    jeInjection: false,
    jeBezbedan: true,
    obradjenaPoruka: obradjena,
    detektovaniPII: detektovani,
  };
}

/**
 * Proveri izlazni odgovor — detektuj potencijalno curenje sistemskih podataka
 */
export function zastitiOdgovor(odgovor: string): { bezbedan: boolean; razlog?: string } {
  // Detektuj ako odgovor otkriva sistemski prompt
  const systemLeakPatterns = [
    /ti si spajapro ai asistent/i,
    /you are a helpful assistant/i,
    /system:\s*ti si/i,
    /system message:/i,
  ];

  for (const pattern of systemLeakPatterns) {
    if (pattern.test(odgovor)) {
      return { bezbedan: false, razlog: 'Odgovor može da otkriva sistemski prompt.' };
    }
  }

  return { bezbedan: true };
}
