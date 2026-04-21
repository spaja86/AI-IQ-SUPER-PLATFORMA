// SpajaUltraOmegaCore -∞Ω+∞ — A/B Odgovor Poređenje
// Kompanija SPAJA — Digitalna Industrija
// Generiše dva različita odgovora i pamti korisnikove preferencije

// ─── Tipovi ──────────────────────────────────────────────────────────

export type ABVarijanta = 'A' | 'B';

export type ABStilA =
  | 'koncizan'
  | 'detaljan'
  | 'tehnicko'
  | 'poslovni'
  | 'korak-po-korak';

export type ABStilB =
  | 'narativan'
  | 'sa-primerima'
  | 'alternativni-pristup'
  | 'pojednostavljen'
  | 'ekspertski'
  | 'detaljan';

export interface ABPromptPar {
  /** Sistem prompt za varijante A */
  systemPromptA: string;
  /** Sistem prompt za varijantu B */
  systemPromptB: string;
  /** Opis stila A */
  opisA: string;
  /** Opis stila B */
  opisB: string;
  /** Stil A */
  stilA: ABStilA;
  /** Stil B */
  stilB: ABStilB;
}

export interface ABOdgovor {
  /** Varijanta A (odgovor) */
  varijantaA: string;
  /** Varijanta B (odgovor) */
  varijantaB: string;
  /** Opis razlike između varijanti */
  opisRazlike: string;
  /** Formatiran prikaz za UI */
  formatiranPrikaz: string;
}

export interface ABPreferencija {
  userId: string;
  preferirani_stil: ABStilA | ABStilB;
  brPreferencija: number;
  poslednjaPrimena: string;
}

// ─── Stilovi i promptovi ──────────────────────────────────────────────

const AB_PAROVI: Array<{
  trigerisi: RegExp[];
  par: ABPromptPar;
}> = [
  {
    trigerisi: [
      /\b(implementiraj|napiši\s+kod|create\s+function|napravi\s+komponent)\b/i,
    ],
    par: {
      stilA: 'koncizan',
      stilB: 'sa-primerima',
      opisA: '⚡ Koncizan — direktna implementacija',
      opisB: '📚 Detaljno sa primerima — sa objašnjenjima i alternativama',
      systemPromptA: `Daj KONCIZAN odgovor. Fokusiraj se na najvažniji deo implementacije bez dugih uvoda. 
Kod treba biti production-ready, bez nepotrebnih komentara. Max 200 reči objašnjenja.`,
      systemPromptB: `Daj DETALJAN odgovor sa primerima. Uključi:
1. Objašnjenje pristupa pre koda
2. Kompletnu implementaciju sa komentarima
3. Primer upotrebe
4. Edge cases i potencijalni problemi
5. Alternativni pristup ako postoji`,
    },
  },
  {
    trigerisi: [
      /\b(objasni|explain|šta\s+je|what\s+is|kako\s+radi|how\s+does)\b/i,
    ],
    par: {
      stilA: 'tehnicko',
      stilB: 'pojednostavljen',
      opisA: '🔬 Tehničko — sa svim detaljima',
      opisB: '💡 Pojednostavljeno — analogije i jednostavni primeri',
      systemPromptA: `Daj TEHNIČKO objašnjenje sa svim detaljima. 
Koristi tačnu terminologiju, uključi tehničke detalje, dijagrame (ASCII), 
primere koda i linkove na specifikacije. Namenjeno iskusnim developerima.`,
      systemPromptB: `Objasni na JEDNOSTAVAN način koristeći analogije iz svakodnevnog života.
Izbegavaj žargon — ako ga moraš koristiti, odmah objasni.
Koristi metafore, vizuelne opise i primere koji su svakome razumljivi.
Na kraju možeš dodati jedan kratki tehnički detalj za znatiželje.`,
    },
  },
  {
    trigerisi: [
      /\b(preporuči|recommend|koji\s+je\s+bolji|which\s+is\s+better|šta\s+da\s+koristim)\b/i,
    ],
    par: {
      stilA: 'koncizan',
      stilB: 'detaljan',
      opisA: '🎯 Direktna preporuka — odmah na stvar',
      opisB: '⚖️ Sveobuhvatna analiza — sve opcije sa trade-offs',
      systemPromptA: `Daj DIREKTNU preporuku bez dugog uvoda. 
U prvoj rečenici kažeš šta preporučuješ i zašto.
Zatim kratko nabrojaj 3 ključna razloga.`,
      systemPromptB: `Daj SVEOBUHVATNU analizu svih opcija.
Uključi tabelu poređenja, pros/cons, use-case scenarije,
priče iz prakse kada je koja opcija bolja, i konačnu preporuku sa kontekstom.`,
    },
  },
  {
    trigerisi: [
      /\b(napiši|write|kreiraj|create)\b.*\b(email|poruku|tekst|sadržaj|blog|članak)\b/i,
    ],
    par: {
      stilA: 'poslovni',
      stilB: 'narativan',
      opisA: '💼 Formalni poslovni stil',
      opisB: '✍️ Narativan i ličan stil',
      systemPromptA: `Napiši u FORMALNOM POSLOVNOM STILU.
Profesionalan ton, strukturirane rečenice, jasan i direktan jezik.
Fokusiraj se na vrednost za čitaoca, bez nepotrebnih ukrasa.`,
      systemPromptB: `Napiši u NARATIVNOM LIČNOM STILU.
Topliji ton, priče i primeri, direktno obraćanje čitaocu.
Budi autentičan i angažujući, a ipak profesionalan.`,
    },
  },
];

const PODRAZUMEVANI_PAR: ABPromptPar = {
  stilA: 'koncizan',
  stilB: 'detaljan',
  opisA: '⚡ Koncizan odgovor',
  opisB: '📖 Detaljan odgovor',
  systemPromptA: 'Odgovori KONCIZAN i direktno. Max 150 reči. Samo suština.',
  systemPromptB: 'Odgovori DETALJNO sa svim relevantnim informacijama, primerima i kontekstom.',
};

// ─── Javne funkcije ───────────────────────────────────────────────────

/**
 * Proverava da li je poruka pogodna za A/B poređenje.
 */
export function jePogodan_za_AB(poruka: string): boolean {
  // A/B ima smisla za zahteve srednje kompleksnosti
  const reci = poruka.trim().split(/\s+/).length;
  return reci >= 5 && reci <= 200;
}

/**
 * Generiše par promptova za A/B odgovor na osnovu zahteva.
 */
export function generisiABPromptPar(poruka: string): ABPromptPar {
  for (const { trigerisi, par } of AB_PAROVI) {
    if (trigerisi.some((t) => t.test(poruka))) {
      return par;
    }
  }
  return PODRAZUMEVANI_PAR;
}

/**
 * Formatira A/B odgovor za prikaz korisniku.
 */
export function formatirajABOdgovor(
  varijantaA: string,
  varijantaB: string,
  par: ABPromptPar,
): ABOdgovor {
  const opisRazlike = `**${par.opisA}** vs. **${par.opisB}**`;

  const formatiranPrikaz = [
    `## 🅰️ ${par.opisA}`,
    '',
    varijantaA,
    '',
    '---',
    '',
    `## 🅱️ ${par.opisB}`,
    '',
    varijantaB,
    '',
    '---',
    '',
    `> **Koja ti se više sviđa?** Obe varijante su validne. Odaberi stil koji ti više odgovara — SpajaPro će pamtiti tvoju preferenciju.`,
  ].join('\n');

  return {
    varijantaA,
    varijantaB,
    opisRazlike,
    formatiranPrikaz,
  };
}

/**
 * Generiše system promptove za obe varijante.
 * Vraća [systemPromptA, systemPromptB] za zasebne OpenAI pozive.
 */
export function getABSystemPromptovi(
  baseSystemPrompt: string,
  par: ABPromptPar,
): [string, string] {
  return [
    `${baseSystemPrompt}\n\n**Stil odgovora:** ${par.systemPromptA}`,
    `${baseSystemPrompt}\n\n**Stil odgovora:** ${par.systemPromptB}`,
  ];
}

/**
 * Registruje korisnikovu preferenciju i vraća ažuriranu preferenciju.
 */
export function azurirajPreferenciju(
  existingPref: ABPreferencija | null,
  userId: string,
  odabranVarijanta: ABVarijanta,
  par: ABPromptPar,
): ABPreferencija {
  const preferirani_stil = odabranVarijanta === 'A' ? par.stilA : par.stilB;

  return {
    userId,
    preferirani_stil,
    brPreferencija: (existingPref?.brPreferencija ?? 0) + 1,
    poslednjaPrimena: new Date().toISOString(),
  };
}

/**
 * Generiše instrukciju za prilagođavanje na osnovu preferencije.
 */
export function generisiPreferencijuInstrukciju(
  preferencijaStil: ABStilA | ABStilB | null,
): string {
  if (!preferencijaStil) return '';

  const INSTRUKCIJE: Partial<Record<ABStilA | ABStilB, string>> = {
    koncizan: 'Korisnik preferira KONCIZAN stil. Odgovaraj direktno i kratko, bez nepotrebnih uvoda.',
    detaljan: 'Korisnik preferira DETALJNE odgovore. Uključi primere, detalje i alternativne pristupe.',
    tehnicko: 'Korisnik preferira TEHNIČKE odgovore. Koristi preciznu terminologiju i detaljne tehničke informacije.',
    pojednostavljen: 'Korisnik preferira JEDNOSTAVNA objašnjenja. Koristi analogije i izbegavaj žargon.',
    poslovni: 'Korisnik preferira POSLOVNI TON. Formalan, strukturiran i profesionalan stil.',
    narativan: 'Korisnik preferira NARATIVAN STIL. Topliji ton sa pričama i direktnim obraćanjem.',
    'sa-primerima': 'Korisnik preferira odgovore SA PRIMERIMA. Uvek uključi konkretne primere koda ili scenarija.',
    'korak-po-korak': 'Korisnik preferira KORAK PO KORAK format. Uvek struktuiraj odgovore kao numerisane korake.',
    'alternativni-pristup': 'Korisnik želi ALTERNATIVNE PRISTUPE. Navedi više opcija sa trade-offs.',
    ekspertski: 'Korisnik preferira EKSPERTSKI NIVO. Pretpostavi napredno znanje, bez bazičnih objašnjenja.',
  };

  const instrukcija = INSTRUKCIJE[preferencijaStil];
  return instrukcija ? `\n\n**Korisnikova preferencija stila:** ${instrukcija}` : '';
}
