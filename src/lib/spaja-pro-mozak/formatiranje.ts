// SpajaUltraOmegaCore -∞Ω+∞ — Adaptivni Formatter
// Kompanija SPAJA — Digitalna Industrija
// Automatski detektuje kontekst poruke i prilagođava format odgovora

// ─── Tipovi ──────────────────────────────────────────────────────────

export type FormatTip =
  | 'proza'
  | 'bullet-lista'
  | 'tabela'
  | 'kod'
  | 'email'
  | 'izvestaj'
  | 'koraci'
  | 'poredenje'
  | 'json'
  | 'auto';

export interface FormatiranjePreporuka {
  format: FormatTip;
  pouzdanost: number; // 0-100
  razlog: string;
  aiInstrukcija: string;
}

// ─── Obrasci za detekciju formata ────────────────────────────────────

const FORMAT_SIGNALI: Array<{
  format: FormatTip;
  obrasci: RegExp[];
  pouzdanost: number;
  razlog: string;
}> = [
  {
    format: 'email',
    obrasci: [
      /\b(napiši\s+email|write\s+an?\s+email|pošalji\s+email|email\s+klijentu|email\s+to)\b/i,
      /\b(mejl|e-mail|poruka\s+za|message\s+to|dragi|pozdrav|regards)\b/i,
    ],
    pouzdanost: 95,
    razlog: 'Detektovana poruka o pisanju emaila',
  },
  {
    format: 'poredenje',
    obrasci: [
      /\b(uporedi|compare|vs\.?|versus|razlika\s+između|difference\s+between|a\s+vs\s+b)\b/i,
      /\b(bolje|worse|prednosti\s+i\s+mane|pros\s+and\s+cons|pros\/cons)\b/i,
    ],
    pouzdanost: 90,
    razlog: 'Detektovano poređenje između opcija — tabela je optimalan format',
  },
  {
    format: 'koraci',
    obrasci: [
      /\b(kako\s+da|how\s+to|korak\s+po\s+korak|step\s+by\s+step|postupak|procedure)\b/i,
      /\b(instalacija|setup|podešavanje|konfiguracija|upustvo|tutorial)\b/i,
    ],
    pouzdanost: 88,
    razlog: 'Detektovano pitanje o procesu — numerisani koraci su optimalni',
  },
  {
    format: 'kod',
    obrasci: [
      /\b(napiši\s+(?:mi\s+)?kod|write\s+code|implementiraj\s+funkciju|create\s+function|generiši\s+klasu)\b/i,
      /\b(primer\s+koda|code\s+example|snippet|napiši\s+(?:mi\s+)?script)\b/i,
    ],
    pouzdanost: 95,
    razlog: 'Detektovana poruka o generisanju koda',
  },
  {
    format: 'izvestaj',
    obrasci: [
      /\b(napiši\s+izveštaj|write\s+(?:a\s+)?report|bug\s+report|status\s+report|analitički\s+izveštaj)\b/i,
      /\b(dokumentacija|specification|technical\s+spec|proposal|prijedlog)\b/i,
    ],
    pouzdanost: 85,
    razlog: 'Detektovano pisanje formalnog dokumenta',
  },
  {
    format: 'bullet-lista',
    obrasci: [
      /\b(navedi|nabroj|lista|list\s+(?:of|all)|sve\s+opcije|koje\s+su|šta\s+su)\b/i,
      /\b(funkcionalnosti|features|mogućnosti|capabilities|primeri)\b/i,
    ],
    pouzdanost: 80,
    razlog: 'Detektovano nabrajanje — bullet lista je optimalan format',
  },
  {
    format: 'json',
    obrasci: [
      /\b(vrati\s+json|return\s+json|json\s+format|json\s+objekat|json\s+array|as\s+json)\b/i,
      /\b(json\s+schema|api\s+response|strukturirani\s+podaci)\b/i,
    ],
    pouzdanost: 95,
    razlog: 'Detektovana poruka o JSON formatu',
  },
  {
    format: 'tabela',
    obrasci: [
      /\b(tabela|table|matrix|prikaži\s+u\s+tabeli|prikaz\s+po)\b/i,
      /\b(statistike|metrics|podaci\s+za|data\s+for|pokazatelji)\b/i,
    ],
    pouzdanost: 85,
    razlog: 'Detektovana poruka o tabličnom prikazu',
  },
];

// ─── Instrukcije po formatu ───────────────────────────────────────────

const FORMAT_INSTRUKCIJE: Record<FormatTip, string> = {
  email: `Formatuj odgovor kao profesionalni email sa sledećom strukturom:
**Predmet:** [Naslov emaila]

**Tekst:**
Poštovani/Dragi [ime],

[Telo emaila — jasno, profesionalno, bez suvišnih reči]

Srdačan pozdrav,
[Pošiljalac]`,

  poredenje: `Prikaži poređenje OBAVEZNO u Markdown tabeli sa sledećom strukturom:
| Kriterijum | Opcija A | Opcija B |
|-----------|---------|---------|
| ... | ... | ... |
Posle tabele dodaj kratki zaključak sa preporukom.`,

  koraci: `Odgovori sa numerisanim koracima:
1. **Korak 1:** [Naziv] — [Detaljan opis]
2. **Korak 2:** ...
Svaki korak mora biti konkretan i izvodljiv. Uključi code snippete gde je relevantno.`,

  kod: `Generiši kod sa:
- Fence blokom sa tačnim jezikom (npr. \`\`\`typescript)
- Komentarima za svaki logički blok
- TypeScript tipovima ako je relevantno
- Kratkim objašnjenjem pre i posle koda`,

  izvestaj: `Formatuj kao profesionalni izveštaj:
## Izvršni sažetak
[2-3 rečenice]

## Analiza
[Detaljna analiza sa podsekcijama]

## Zaključci
[Ključni nalazi]

## Preporuke
[Konkretne akcije]`,

  'bullet-lista': `Odgovori sa jasnom bullet listom:
- **Stavka 1:** Objašnjenje
- **Stavka 2:** Objašnjenje
Grupiši srodne stavke. Svaka stavka treba biti informativna, ne samo naziv.`,

  json: `Vrati validni JSON format:
\`\`\`json
{
  "kljuc": "vrednost"
}
\`\`\`
Dodaj kratko objašnjenje strukture pre JSON bloka.`,

  tabela: `Prikaži podatke u Markdown tabeli:
| Kolona 1 | Kolona 2 | Kolona 3 |
|---------|---------|---------|
| Vrednost | Vrednost | Vrednost |
Koristi jasna zaglavlja i sortiran redosled vrednosti.`,

  proza: 'Odgovori jasno i koncizno. Koristi paragraphe, bold za ključne pojmove i primere.',

  auto: '',
};

// ─── Javne funkcije ───────────────────────────────────────────────────

/**
 * Detektuje optimalni format za poruku korisnika.
 */
export function detektujFormat(poruka: string): FormatiranjePreporuka {
  let najboljiFit: FormatiranjePreporuka | null = null;

  for (const signal of FORMAT_SIGNALI) {
    const match = signal.obrasci.some((o) => o.test(poruka));
    if (match) {
      if (!najboljiFit || signal.pouzdanost > najboljiFit.pouzdanost) {
        najboljiFit = {
          format: signal.format,
          pouzdanost: signal.pouzdanost,
          razlog: signal.razlog,
          aiInstrukcija: FORMAT_INSTRUKCIJE[signal.format],
        };
      }
    }
  }

  // Fallback na prozu
  return (
    najboljiFit ?? {
      format: 'proza',
      pouzdanost: 50,
      razlog: 'Nema specifičnog formata detektovanog — koristi prozu',
      aiInstrukcija: FORMAT_INSTRUKCIJE['proza'],
    }
  );
}

/**
 * Generiše instrukciju za ubacivanje u system prompt.
 * Koristi se pre OpenAI poziva.
 */
export function generisiFormatInstrukciju(poruka: string): string {
  const preporuka = detektujFormat(poruka);

  if (preporuka.format === 'proza' || preporuka.pouzdanost < 70) {
    return ''; // Ne forsiramo format za opšte odgovore
  }

  return `\n\n**Format odgovora (obavezno):** ${preporuka.razlog}\n${preporuka.aiInstrukcija}`;
}

/**
 * Vraća tipove format-a koji su dostupni u sistemu.
 */
export function getSviFormati(): FormatTip[] {
  return ['proza', 'bullet-lista', 'tabela', 'kod', 'email', 'izvestaj', 'koraci', 'poredenje', 'json'];
}
