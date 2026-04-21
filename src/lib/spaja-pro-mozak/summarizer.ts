// SpajaUltraOmegaCore -∞Ω+∞ — Inteligentni Sumarizer
// Kompanija SPAJA — Digitalna Industrija
// Automatski sažima duge odgovore u TL;DR blok i strukturirane tačke

// ─── Tipovi ──────────────────────────────────────────────────────────

export type SumarizerMod = 'detaljan' | 'sazetak' | 'auto';

export interface SumarizerRezultat {
  /** Da li je tekst predugi i zahteva sažetak */
  trebaSazetak: boolean;
  /** Broj reči u originalnom tekstu */
  brojReci: number;
  /** Ključne tačke izvučene iz teksta (bullet points) */
  kljucneTacke: string[];
  /** Formatiran TL;DR blok */
  tldrBlok: string;
  /** Procenat skraćivanja (0-100) */
  procenatSkracivanja: number;
}

export interface SumarizerPodesavanja {
  /** Prag broja reči iznad kojeg se aktivira sažimanje */
  pragReci: number;
  /** Maksimalan broj ključnih tačaka */
  maxKljucnihTacaka: number;
  /** Mod rada */
  mod: SumarizerMod;
}

// ─── Konstante ────────────────────────────────────────────────────────

const PODRAZUMEVANO_PODESAVANJE: SumarizerPodesavanja = {
  pragReci: 300,
  maxKljucnihTacaka: 5,
  mod: 'auto',
};

// ─── Interni pomoćnici ────────────────────────────────────────────────

function broji_reci(tekst: string): number {
  return tekst.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Izvlači postojeće bullet tačke iz markdown teksta.
 */
function izvuciPostojeceBullets(tekst: string): string[] {
  const redovi = tekst.split('\n');
  const bullets: string[] = [];
  for (const red of redovi) {
    const m = red.match(/^[-*•]\s+(.+)$/);
    if (m?.[1]) {
      const tacka = m[1].trim();
      if (tacka.length > 10 && tacka.length < 200) {
        bullets.push(tacka);
      }
    }
  }
  return bullets;
}

/**
 * Izvlači rečenice koje sadrže ključne indikatore informacija.
 */
function izvuciKljucneReceniceIzProznog(tekst: string): string[] {
  const KLJUCNI_SIGNALI = [
    /^(važno|napomena|pažnja|rezultat|zaključak|rešenje|korak|prvo|zatim|na kraju)/i,
    /\b(treba|mora|obavezno|preporučuje se|koristiti|koristite|implementirati)\b/i,
    /\b(problem|greška|ranjivost|bug|fix|ispravka|optimizacija)\b/i,
    /\b(primer|na primer|npr\.|e\.g\.)\b/i,
  ];

  const recenice = tekst
    .replace(/```[\s\S]*?```/g, '') // ukloni code blokove
    .replace(/#{1,6}\s+.+/g, '')    // ukloni zaglavlja
    .split(/[.!?]+/)
    .map((r) => r.trim())
    .filter((r) => r.length > 20 && r.length < 300);

  return recenice.filter((r) =>
    KLJUCNI_SIGNALI.some((signal) => signal.test(r)),
  );
}

// ─── Javne funkcije ───────────────────────────────────────────────────

/**
 * Proverava da li tekst prelazi prag za automatsko sažimanje.
 */
export function jePredugiTekst(
  tekst: string,
  pragReci = PODRAZUMEVANO_PODESAVANJE.pragReci,
): boolean {
  return broji_reci(tekst) > pragReci;
}

/**
 * Izvlači ključne tačke iz bilo kog teksta (markdown ili proza).
 */
export function izvuciKljucneTacke(
  tekst: string,
  maxTacaka = PODRAZUMEVANO_PODESAVANJE.maxKljucnihTacaka,
): string[] {
  // Pokušaj da iskoristimo postojeće bullet listu
  const bullets = izvuciPostojeceBullets(tekst);
  if (bullets.length >= 2) {
    return bullets.slice(0, maxTacaka);
  }

  // Fallback: izvuci ključne rečenice iz proznog teksta
  const kljucneRecenice = izvuciKljucneReceniceIzProznog(tekst);
  if (kljucneRecenice.length > 0) {
    return kljucneRecenice.slice(0, maxTacaka);
  }

  // Krajnji fallback: uzmi prve i poslednje rečenice
  const sveRecenice = tekst
    .replace(/```[\s\S]*?```/g, '')
    .split(/[.!?]+/)
    .map((r) => r.trim())
    .filter((r) => r.length > 20);

  const rezultat: string[] = [];
  if (sveRecenice[0]) rezultat.push(sveRecenice[0]);
  if (sveRecenice.length > 2 && sveRecenice[sveRecenice.length - 1]) {
    rezultat.push(sveRecenice[sveRecenice.length - 1]);
  }
  return rezultat.slice(0, maxTacaka);
}

/**
 * Formatira TL;DR blok na osnovu ključnih tačaka.
 */
export function formatirajTldrBlok(
  kljucneTacke: string[],
  originalnaVelicina: number,
): string {
  if (kljucneTacke.length === 0) return '';

  const tackeMarkdown = kljucneTacke
    .map((t) => `- ${t}`)
    .join('\n');

  return [
    '> **⚡ TL;DR — Kratak pregled**',
    '>',
    tackeMarkdown
      .split('\n')
      .map((red) => `> ${red}`)
      .join('\n'),
    '>',
    `> *Originalni odgovor sadrži ~${originalnaVelicina} reči. Skrolujte dole za kompletan odgovor.*`,
    '',
    '---',
    '',
  ].join('\n');
}

/**
 * Glavna funkcija — analizira tekst i vraća sve podatke za sumarizaciju.
 */
export function sumirajTekst(
  tekst: string,
  podesavanja: Partial<SumarizerPodesavanja> = {},
): SumarizerRezultat {
  const konfig = { ...PODRAZUMEVANO_PODESAVANJE, ...podesavanja };
  const brojReci = broji_reci(tekst);

  const trebaSazetak =
    konfig.mod === 'sazetak' ||
    (konfig.mod === 'auto' && brojReci > konfig.pragReci);

  if (!trebaSazetak) {
    return {
      trebaSazetak: false,
      brojReci,
      kljucneTacke: [],
      tldrBlok: '',
      procenatSkracivanja: 0,
    };
  }

  const kljucneTacke = izvuciKljucneTacke(tekst, konfig.maxKljucnihTacaka);
  const tldrBlok = formatirajTldrBlok(kljucneTacke, brojReci);

  const brRRecTldr = broji_reci(tldrBlok);
  const procenatSkracivanja = Math.round(
    Math.max(0, Math.min(100, (1 - brRRecTldr / brojReci) * 100)),
  );

  return {
    trebaSazetak: true,
    brojReci,
    kljucneTacke,
    tldrBlok,
    procenatSkracivanja,
  };
}

/**
 * Prepend TL;DR blok na tekst odgovora (samo ako treba).
 */
export function primenjiSumarizaciju(
  tekst: string,
  podesavanja: Partial<SumarizerPodesavanja> = {},
): string {
  const rezultat = sumirajTekst(tekst, podesavanja);
  if (!rezultat.trebaSazetak || !rezultat.tldrBlok) {
    return tekst;
  }
  return rezultat.tldrBlok + tekst;
}
