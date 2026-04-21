// SpajaUltraOmegaCore -∞Ω+∞ — Sistem Citata i Izvora
// Kompanija SPAJA — Digitalna Industrija
// Dodaje numerisane fusnote na faktualne tvrdnje i generiše listu izvora

// ─── Tipovi ──────────────────────────────────────────────────────────

export type IzvorTip =
  | 'model-znanje'
  | 'web-pretraga'
  | 'izracunavanje'
  | 'interni-kb'
  | 'korisnikov-kod'
  | 'nepoznat';

export interface Fusnota {
  broj: number;
  tvrdnja: string;
  tipIzvora: IzvorTip;
  izvorOpis: string;
}

export interface CitatRezultat {
  /** Odgovor sa ugrađenim fusnotama [1], [2]... */
  odgovorSaFusnotama: string;
  /** Lista fusnota */
  fusnote: Fusnota[];
  /** Formatirana lista izvora za kraj odgovora */
  listaIzvora: string;
  /** Da li je citiranje primenjeno */
  jePrimenjeno: boolean;
}

// ─── Detekcija faktualnih tvrdnji ─────────────────────────────────────

// Fraze koje uvode faktualne tvrdnje koje treba citirati
const FAKTUALNE_FRAZE: RegExp[] = [
  /\b(prema|according\s+to|based\s+on|na\s+osnovu)\b/i,
  /\b(\d{4})\b/,                                          // Godišnji podaci
  /\b(\d+(?:[,\.]\d+)?)\s*(%|posto|milion|billion)\b/i,  // Statistike
  /\b(studija\s+pokazuje|research\s+shows|izveštaj)\b/i,
  /\b(preporučuje\s+se|best\s+practice|standard)\b/i,
  /\b(zvanično|officially|ISO|NIST|RFC\s*\d+|OWASP)\b/i,
];

// Signali koji određuju tip izvora
const IZVOR_SIGNALI: Record<IzvorTip, RegExp> = {
  'web-pretraga': /\b(prema\s+web\s+pretrazi|web\s+search|news|aktuelno|danas|2024|2025)\b/i,
  izracunavanje: /\b(izračunato|calculated|formula|rezultat\s+je|= \d)/i,
  'interni-kb': /\b(spaja|kompanija\s+spaja|naša\s+platforma|AI\s+IQ)\b/i,
  'korisnikov-kod': /\b(tvoj\s+kod|vaš\s+kod|kodu\s+koji\s+si|kodu\s+koji\s+ste)\b/i,
  'model-znanje': /.*/,
  nepoznat: /^$/,
};

// ─── Detekcija rečenica koje treba citirati ───────────────────────────

function detektujFaktualneTvrdnje(tekst: string): string[] {
  const recenice = tekst
    .replace(/```[\s\S]*?```/g, '') // Preskoči code blokove
    .split(/(?<=[.!?])\s+/)
    .filter((r) => r.trim().length > 30);

  return recenice.filter((r) =>
    FAKTUALNE_FRAZE.some((signal) => signal.test(r)),
  );
}

function detektujTipIzvora(tvrdnja: string): IzvorTip {
  for (const [tip, regex] of Object.entries(IZVOR_SIGNALI)) {
    if (tip !== 'model-znanje' && regex.test(tvrdnja)) {
      return tip as IzvorTip;
    }
  }
  return 'model-znanje';
}

function generisiIzvorOpis(tipIzvora: IzvorTip, _tvrdnja: string): string {
  const OPISI: Record<IzvorTip, string> = {
    'model-znanje': 'Na osnovu treniranog znanja modela (cutoff: 2024)',
    'web-pretraga': 'Prema rezultatima web pretrage',
    izracunavanje: 'Matematičko izračunavanje',
    'interni-kb': 'Interni knowledge base Kompanije SPAJA',
    'korisnikov-kod': "Analiza korisnikovog koda",
    nepoznat: 'Izvor nepoznat',
  };
  return OPISI[tipIzvora];
}

// ─── Dodavanje fusnota u tekst ────────────────────────────────────────

/**
 * Dodaje numerisane fusnote na faktualne tvrdnje u tekstu.
 * Samo za odgovore koji sadrže faktualne tvrdnje — ne menja format teksta.
 */
export function dodajFusnote(
  odgovor: string,
  maxFusnota = 5,
): CitatRezultat {
  const faktualneTvrdnje = detektujFaktualneTvrdnje(odgovor);

  if (faktualneTvrdnje.length === 0) {
    return {
      odgovorSaFusnotama: odgovor,
      fusnote: [],
      listaIzvora: '',
      jePrimenjeno: false,
    };
  }

  const fusnote: Fusnota[] = [];
  let modifikovaniOdgovor = odgovor;
  let brojac = 1;

  // Ograniči broj fusnota
  const tvrdnjeZaAnotaciju = faktualneTvrdnje.slice(0, maxFusnota);

  for (const tvrdnja of tvrdnjeZaAnotaciju) {
    const tipIzvora = detektujTipIzvora(tvrdnja);
    const fusnota: Fusnota = {
      broj: brojac,
      tvrdnja: tvrdnja.slice(0, 100) + (tvrdnja.length > 100 ? '...' : ''),
      tipIzvora,
      izvorOpis: generisiIzvorOpis(tipIzvora, tvrdnja),
    };
    fusnote.push(fusnota);

    // Dodaj [N] na kraju rečenice — pronađi tvrdnju u tekstu i dodaj marker
    const escapedTvrdnja = tvrdnja.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const tvrdnjaRegex = new RegExp(escapedTvrdnja.slice(0, 50).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    modifikovaniOdgovor = modifikovaniOdgovor.replace(
      tvrdnjaRegex,
      (match) => `${match} [${brojac}]`,
    );

    brojac++;
  }

  const listaIzvora = generisiListuIzvora(fusnote);

  return {
    odgovorSaFusnotama: modifikovaniOdgovor,
    fusnote,
    listaIzvora,
    jePrimenjeno: fusnote.length > 0,
  };
}

/**
 * Generiše formatirani blok sa listom izvora.
 */
export function generisiListuIzvora(fusnote: Fusnota[]): string {
  if (fusnote.length === 0) return '';

  const IKONE: Record<IzvorTip, string> = {
    'model-znanje': '🧠',
    'web-pretraga': '🌐',
    izracunavanje: '🔢',
    'interni-kb': '📚',
    'korisnikov-kod': '💻',
    nepoznat: '❓',
  };

  const stavke = fusnote
    .map(
      (f) =>
        `**[${f.broj}]** ${IKONE[f.tipIzvora]} ${f.izvorOpis}`,
    )
    .join('\n');

  return `\n\n---\n**📎 Izvori:**\n${stavke}`;
}

/**
 * Primenuje sistem citata — dodaje fusnote i listu izvora na kraj odgovora.
 */
export function primenjiCitate(
  odgovor: string,
  maxFusnota = 5,
): string {
  const rezultat = dodajFusnote(odgovor, maxFusnota);
  if (!rezultat.jePrimenjeno) return odgovor;
  return rezultat.odgovorSaFusnotama + rezultat.listaIzvora;
}

/**
 * Generiše system prompt instrukciju koja ohrabruje AI da navodi izvore.
 */
export function generisiCitatInstrukciju(): string {
  return `\n\n**Transparentnost izvora (OBAVEZNO):**
Kada navodiš činjenice, statistike, standarde ili preporuke — jasno naznači izvor:
- "Prema mom znanju (cutoff 2024):" za opšte informacije
- "Prema web pretrazi:" ako koristiš search tool
- "Matematički:" za izračunavanja
Ovo smanjuje rizik od halucinacija i povećava poverenje korisnika.`;
}
