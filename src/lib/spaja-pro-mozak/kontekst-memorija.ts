// SpajaUltraOmegaCore -∞Ω+∞ — Perzistentna Kontekst Memorija
// Kompanija SPAJA — Digitalna Industrija
// Detekcija korisničkih "zapamti" zahteva i upravljanje memorijom sesije

// ─── Tipovi ──────────────────────────────────────────────────────────

export type MemorijaKategorija =
  | 'tech-stack'
  | 'projekat'
  | 'preferencija'
  | 'licno'
  | 'poslovni-kontekst'
  | 'ostalo';

export interface MemorijaStavka {
  kategorija: MemorijaKategorija;
  kljuc: string;
  vrednost: string;
  timestamp: string;
}

export interface MemorijaParseRezultat {
  stavke: MemorijaStavka[];
  siroviTekst: string;
}

export interface DetekcijaZapamtiRezultat {
  /** Da li poruka sadrži zahtev za pamćenjem */
  jeZahtev: boolean;
  /** Informacija koju treba zapamtiti */
  informacija: string;
  /** Detektovana kategorija */
  kategorija: MemorijaKategorija;
  /** Instrukcija za ažuriranje memorije */
  novaStavka: MemorijaStavka | null;
}

export interface KontekstMemorijaRezultat {
  /** Da li je memorija korisna za trenutni upit */
  jeRelevantna: boolean;
  /** Formatiran blok koji se dodaje u system prompt */
  systemPromptBlok: string;
  /** Stavke iz memorije (parsovane) */
  stavke: MemorijaStavka[];
}

// ─── Obrasci za detekciju ─────────────────────────────────────────────

const ZAPAMTI_OBRASCI: RegExp[] = [
  /zapamti\s+(?:da\s+)?(.+)/i,
  /pamti\s+(?:da\s+)?(.+)/i,
  /sačuvaj\s+(?:da\s+)?(.+)/i,
  /zapishi\s+(?:da\s+)?(.+)/i,
  /nemoj\s+zaboraviti\s+(.+)/i,
  /uvek\s+znaj\s+da\s+(.+)/i,
  /moj\s+(stack|projekat|framework|jezik|tim)\s+je\s+(.+)/i,
  /koristim\s+(.+)/i,
  /radim\s+(?:na\s+)?(.+)/i,
  /remember\s+(?:that\s+)?(.+)/i,
];

const KATEGORIJA_KLJUCNE_RECI: Record<MemorijaKategorija, RegExp> = {
  'tech-stack': /\b(next\.?js|react|vue|angular|typescript|python|java|go|rust|node|docker|kubernetes|aws|vercel|supabase|postgres|mysql|mongodb|redis|graphql|rest\s*api)\b/i,
  projekat: /\b(projekat|aplikacija|sajt|platforma|startup|proizvod|sistem|backend|frontend|fullstack)\b/i,
  preferencija: /\b(volim|preferiram|uvek\s+koristim|moj\s+stil|format|jezik\s+odgovora|srpski|engleski)\b/i,
  licno: /\b(zovem\s+se|moje\s+ime|radim\s+u|kompanija|tim|senior|junior|developer|inženjer)\b/i,
  'poslovni-kontekst': /\b(klijent|biznis|budzet|rok|deadline|sprint|scrum|agile|b2b|b2c|saas)\b/i,
  ostalo: /.*/,
};

// ─── Pomoćne funkcije ─────────────────────────────────────────────────

function detektujKategoriju(tekst: string): MemorijaKategorija {
  for (const [kategorija, regex] of Object.entries(KATEGORIJA_KLJUCNE_RECI)) {
    if (kategorija !== 'ostalo' && regex.test(tekst)) {
      return kategorija as MemorijaKategorija;
    }
  }
  return 'ostalo';
}

function generisiKljuc(informacija: string): string {
  // Izvuci ključnu reč (prvih 5 reči)
  return informacija
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join('_')
    .toLowerCase()
    .replace(/[^a-z0-9_čćžšđ]/g, '');
}

// ─── Javne funkcije ───────────────────────────────────────────────────

/**
 * Detektuje da li poruka sadrži zahtev za pamćenjem informacije.
 */
export function detektujZapamtiZahtev(poruka: string): DetekcijaZapamtiRezultat {
  for (const obrazac of ZAPAMTI_OBRASCI) {
    const m = poruka.match(obrazac);
    if (m) {
      // Uzmi poslednji capture group koji nije prazan
      const informacija =
        m
          .slice(1)
          .filter(Boolean)
          .join(' ')
          .trim() || poruka;

      const kategorija = detektujKategoriju(informacija);
      const novaStavka: MemorijaStavka = {
        kategorija,
        kljuc: generisiKljuc(informacija),
        vrednost: informacija,
        timestamp: new Date().toISOString(),
      };

      return { jeZahtev: true, informacija, kategorija, novaStavka };
    }
  }

  return { jeZahtev: false, informacija: '', kategorija: 'ostalo', novaStavka: null };
}

/**
 * Parsuje sačuvani memorijski string u strukturirane stavke.
 * Format u bazi: "KATEGORIJA: vrednost\n..."
 */
export function parsirajMemoriju(memorijaTekst: string | null): MemorijaParseRezultat {
  if (!memorijaTekst?.trim()) {
    return { stavke: [], siroviTekst: '' };
  }

  const stavke: MemorijaStavka[] = [];
  const redovi = memorijaTekst.split('\n').filter(Boolean);

  for (const red of redovi) {
    const m = red.match(/^\[(\w[\w-]*)\]\s+(.+)$/);
    if (m) {
      stavke.push({
        kategorija: (m[1] as MemorijaKategorija) || 'ostalo',
        kljuc: generisiKljuc(m[2] ?? ''),
        vrednost: m[2]?.trim() ?? '',
        timestamp: new Date().toISOString(),
      });
    } else if (red.trim()) {
      stavke.push({
        kategorija: 'ostalo',
        kljuc: generisiKljuc(red),
        vrednost: red.trim(),
        timestamp: new Date().toISOString(),
      });
    }
  }

  return { stavke, siroviTekst: memorijaTekst };
}

/**
 * Formatira memorijsku stavku za čuvanje u bazi.
 */
export function formatirajStavkuZaBase(stavka: MemorijaStavka): string {
  return `[${stavka.kategorija}] ${stavka.vrednost}`;
}

/**
 * Dodaje novu stavku u memorijski string (dedup po kljucu).
 */
export function dodajUMemoriju(
  postojecaMemorija: string | null,
  novaStavka: MemorijaStavka,
): string {
  const { stavke } = parsirajMemoriju(postojecaMemorija);

  // Zameni stavku sa istim ključem ili dodaj novu
  const indeks = stavke.findIndex((s) => s.kljuc === novaStavka.kljuc);
  if (indeks >= 0) {
    stavke[indeks] = novaStavka;
  } else {
    stavke.push(novaStavka);
  }

  // Ograniči na 50 stavki (najstarije se uklanjaju)
  const ograniceneStavke = stavke.slice(-50);

  return ograniceneStavke.map(formatirajStavkuZaBase).join('\n');
}

/**
 * Formatira memoriju za ubacivanje u system prompt.
 */
export function formatirajZaSystemPrompt(
  memorijaTekst: string | null,
): KontekstMemorijaRezultat {
  const { stavke } = parsirajMemoriju(memorijaTekst);

  if (stavke.length === 0) {
    return { jeRelevantna: false, systemPromptBlok: '', stavke: [] };
  }

  const grupovano: Partial<Record<MemorijaKategorija, string[]>> = {};
  for (const stavka of stavke) {
    if (!grupovano[stavka.kategorija]) {
      grupovano[stavka.kategorija] = [];
    }
    grupovano[stavka.kategorija]!.push(stavka.vrednost);
  }

  const NAZIV_KATEGORIJE: Record<MemorijaKategorija, string> = {
    'tech-stack': '🛠️ Tech stack korisnika',
    projekat: '📁 Projekat',
    preferencija: '⚙️ Preferencije',
    licno: '👤 Lični kontekst',
    'poslovni-kontekst': '💼 Poslovni kontekst',
    ostalo: '📝 Ostalo',
  };

  const sekcije = Object.entries(grupovano)
    .map(([kat, vrednosti]) => {
      const naziv = NAZIV_KATEGORIJE[kat as MemorijaKategorija] ?? kat;
      return `**${naziv}:**\n${(vrednosti as string[]).map((v) => `- ${v}`).join('\n')}`;
    })
    .join('\n\n');

  const systemPromptBlok = [
    '## Memorija korisnika (koristi ove informacije u odgovorima)',
    '',
    sekcije,
    '',
    '_Korisnik je ove informacije eksplicitno sačuvao. Prilagodi odgovore u skladu sa ovim kontekstom._',
  ].join('\n');

  return { jeRelevantna: true, systemPromptBlok, stavke };
}
