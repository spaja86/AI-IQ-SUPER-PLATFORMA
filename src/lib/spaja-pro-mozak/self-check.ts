// SpajaUltraOmegaCore -∞Ω+∞ — Self-Check Verifikacija
// Kompanija SPAJA — Digitalna Industrija
// Verifikacija kvaliteta odgovora pre slanja korisniku

// ─── Tipovi ──────────────────────────────────────────────────────────

export type KonfidensPivo = 'visok' | 'srednji' | 'nizak' | 'ne-znam';

export interface SelfCheckRezultat {
  konfidensNivo: KonfidensPivo;
  konfidensProcenat: number; // 0-100
  istinitostProvere: string[];
  upozoravanja: string[];
  preporuke: string[];
  jePotrebanNe_Znam: boolean;
}

// ─── Detekcija nesigurnih odgovora ───────────────────────────────────

// Fraze koje ukazuju na halucinacije ili nesigurnost
const NESIGURNE_FRAZE = [
  'pretpostavljam', 'mislim da', 'verujem da', 'možda',
  'nije mi poznato', 'nisam siguran', 'ne znam tačno',
  'koliko mi je poznato', 'as far as i know',
  'i think', 'i believe', 'i assume', 'perhaps', 'maybe',
  'could be', 'might be', 'i\'m not sure',
  'roughly', 'approximately', 'about',
  'nisam 100%', 'not 100%',
];

// Fraze koje ukazuju na nedostatak znanja
const NE_ZNAM_FRAZE = [
  'ne znam', 'nemam informacije', 'nemam podatke',
  'izvan mog znanja', 'my knowledge cutoff',
  'i don\'t know', 'i have no information',
  'cannot provide', 'ne mogu da potvrdim',
  'nije u mojoj bazi', 'beyond my knowledge',
];

// Fraze koje ukazuju na visok konfidensni nivo
const VISOK_KONFIDENSNI_SIGNALI = [
  // Definitivne tvrdnje
  /definitivno|svakako|sigurno|tačno/i,
  // Citati i reference
  /prema|according to|source:|izvor:/i,
  // Konkretni primeri koda
  /```[\s\S]+```/,
  // Numerički podaci
  /\d+%|\d+\.\d+|=\s*\d+/,
];

// ─── Analiza teksta odgovora ──────────────────────────────────────────

function broji_reci(tekst: string): number {
  return tekst.trim().split(/\s+/).length;
}

function detektujNesigurnost(odgovor: string): {
  nesigurnost: number;
  neZnam: boolean;
} {
  const lower = odgovor.toLowerCase();
  let nesigurnostScore = 0;
  let neZnam = false;

  for (const fraza of NESIGURNE_FRAZE) {
    if (lower.includes(fraza)) nesigurnostScore++;
  }
  for (const fraza of NE_ZNAM_FRAZE) {
    if (lower.includes(fraza)) {
      nesigurnostScore += 2;
      neZnam = true;
    }
  }

  return { nesigurnost: nesigurnostScore, neZnam };
}

function detektujVisokiKonfidensSignale(odgovor: string): number {
  let score = 0;
  for (const pattern of VISOK_KONFIDENSNI_SIGNALI) {
    if (pattern.test(odgovor)) score++;
  }
  return score;
}

// ─── Glavna verifikacija ──────────────────────────────────────────────

/**
 * Verifikuj kvalitet AI odgovora i proceni nivo poverenja.
 * Vraća strukturirani izveštaj za korisnički interfejs.
 */
export function verifikujOdgovor(
  upit: string,
  odgovor: string,
): SelfCheckRezultat {
  const istinitostProvere: string[] = [];
  const upozoravanja: string[] = [];
  const preporuke: string[] = [];

  const brojReciOdgovora = broji_reci(odgovor);
  const { nesigurnost, neZnam } = detektujNesigurnost(odgovor);
  const visokiKonfidensSignali = detektujVisokiKonfidensSignale(odgovor);

  // ── Provere tačnosti ──────────────────────────────────────────────

  // 1. Da li je odgovor dovoljno dugačak?
  if (brojReciOdgovora < 5) {
    upozoravanja.push('Odgovor je veoma kratak — možda nije kompletan.');
    preporuke.push('Zamolite za detaljnije objašnjenje.');
  } else {
    istinitostProvere.push('Odgovor ima adekvatnu dužinu.');
  }

  // 2. Da li odgovor sadrži kod ako je tražen?
  const upitatraziKod = /kod|code|primer|example|function|klasa|class|script/i.test(upit);
  const odgovorImaKod = /```|`[^`]+`/.test(odgovor);
  if (upitatraziKod && !odgovorImaKod && brojReciOdgovora > 20) {
    preporuke.push('Tražen je primer koda — pitajte za konkretan primer.');
  }

  // 3. Da li je detektovana nesigurnost?
  if (nesigurnost >= 3) {
    upozoravanja.push('Odgovor sadrži više signala nesigurnosti — proverite informacije iz pouzdanog izvora.');
  } else if (nesigurnost >= 1) {
    istinitostProvere.push('Detektovana mala nesigurnost — odgovor je uglavnom pouzdan.');
  } else {
    istinitostProvere.push('Nije detektovana nesigurnost u odgovoru.');
  }

  // 4. Visoki konfidensni signali
  if (visokiKonfidensSignali >= 2) {
    istinitostProvere.push('Odgovor sadrži konkretne podatke ili reference.');
  }

  // 5. Ne-znam situacija
  if (neZnam) {
    istinitostProvere.push('Sistem je iskreno prijavio nedostatak znanja — to je znak pouzdanosti.');
    preporuke.push('Za ovo pitanje konsultujte specijalizovane izvore ili stručnjaka.');
  }

  // ── Izračun konfidensnog procenta ─────────────────────────────────

  let konfidensProcenat = 70; // Osnova

  // Umanjivači
  konfidensProcenat -= nesigurnost * 8;
  if (neZnam) konfidensProcenat -= 20;
  if (brojReciOdgovora < 5) konfidensProcenat -= 15;

  // Uvećivači
  konfidensProcenat += visokiKonfidensSignali * 5;
  if (odgovorImaKod && upitatraziKod) konfidensProcenat += 10;
  if (brojReciOdgovora > 50) konfidensProcenat += 5;

  // Ograniči na 0-100
  konfidensProcenat = Math.min(100, Math.max(0, konfidensProcenat));

  // ── Konfidensni nivo ──────────────────────────────────────────────

  let konfidensNivo: KonfidensPivo;
  if (neZnam) {
    konfidensNivo = 'ne-znam';
  } else if (konfidensProcenat >= 75) {
    konfidensNivo = 'visok';
  } else if (konfidensProcenat >= 45) {
    konfidensNivo = 'srednji';
  } else {
    konfidensNivo = 'nizak';
  }

  return {
    konfidensNivo,
    konfidensProcenat,
    istinitostProvere,
    upozoravanja,
    preporuke,
    jePotrebanNe_Znam: neZnam,
  };
}

/**
 * Formatuj konfidensni nivo za prikaz u UI
 */
export function formatirajKonfidensNivo(nivo: KonfidensPivo, procenat: number): {
  tekst: string;
  boja: string;
  ikona: string;
} {
  switch (nivo) {
    case 'visok':
      return { tekst: `Visok konfidensni nivo (${procenat}%)`, boja: 'zelena', ikona: '✅' };
    case 'srednji':
      return { tekst: `Srednji konfidensni nivo (${procenat}%)`, boja: 'žuta', ikona: '⚠️' };
    case 'nizak':
      return { tekst: `Nizak konfidensni nivo (${procenat}%) — proverite informacije`, boja: 'narandžasta', ikona: '⚠️' };
    case 'ne-znam':
      return { tekst: 'Sistem nema dovoljno informacija za pouzdan odgovor', boja: 'siva', ikona: '❓' };
    default:
      return { tekst: 'Nepoznat nivo', boja: 'siva', ikona: '❓' };
  }
}
