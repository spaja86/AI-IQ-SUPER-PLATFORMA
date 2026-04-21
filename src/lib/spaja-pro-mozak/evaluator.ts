// SpajaUltraOmegaCore -∞Ω+∞ — Odgovor Evaluator
// Kompanija SPAJA — Digitalna Industrija
// Ocenjuje AI odgovore po 5 dimenzija: tačnost, relevantnost, jasnoća, kompletnost, ton

// ─── Tipovi ──────────────────────────────────────────────────────────

export type EvaluacijaDimenzijaId =
  | 'tacnost'
  | 'relevantnost'
  | 'jasnost'
  | 'kompletnost'
  | 'ton';

export interface EvaluacijaDimenzija {
  id: EvaluacijaDimenzijaId;
  naziv: string;
  skor: number; // 0-20 (ukupno = 100)
  boja: '🟢' | '🟡' | '🔴';
  napomena: string;
}

export interface EvaluacijaRezultat {
  /** Ukupan skor (0-100) */
  ukupanSkor: number;
  /** Dimenzije evaluacije */
  dimenzije: EvaluacijaDimenzija[];
  /** Da li odgovor treba ponovo generisati (skor < 70) */
  trebaPonovo: boolean;
  /** Formatirani prikaz za UI */
  formatiranPrikaz: string;
  /** Nivo kvaliteta */
  nivoKvaliteta: 'odlican' | 'dobar' | 'prihvatljiv' | 'slab' | 'los';
  /** Razlog za loš skor (ako postoji) */
  razlogLosSkor?: string;
}

// ─── Evaluacioni signali ──────────────────────────────────────────────

// Signali koji POVEĆAVAJU skor tacnosti
const TACNI_SIGNALI: RegExp[] = [
  /```[\s\S]+?```/,             // Primer koda
  /\d+%|\d+\.\d+/,             // Numerički podaci
  /prema|according|source:/i,   // Reference
  /\b(tačno|definitivno|sigurno|potvrđeno)\b/i,
];

// Signali koji SMANJUJU skor tacnosti (potencijalne halucinacije)
const NESIGURNI_SIGNALI: RegExp[] = [
  /\b(mislim da|pretpostavljam|možda|verovatno|I think|perhaps|might be)\b/i,
  /\b(nisam siguran|not sure|don't know|ne znam tačno)\b/i,
  /\b(koliko znam|as far as I know|to the best of my knowledge)\b/i,
];

// Signali za dobru strukturu (jasnoća)
const JASNOST_SIGNALI: RegExp[] = [
  /^#{1,3}\s+.+/m,             // Zaglavlja
  /^[-*]\s+.+/m,               // Liste
  /\*\*.+\*\*/,                // Bold tekst
  /\|.+\|.+\|/,               // Tabele
];

// Signali za kompletnost
const KOMPLETNOST_SIGNALI: RegExp[] = [
  /\b(zaključak|conclusion|summary|rezime|recap)\b/i,
  /\b(primer|example|npr\.|e\.g\.)\b/i,
  /\b(alternativa|alternatively|druga\s+opcija)\b/i,
];

// Signali za profesionalan ton
const POZITIVAN_TON: RegExp[] = [
  /\b(odlično|sjajno|svakako|naravno|rado|razumem)\b/i,
];
const NEGATIVAN_TON: RegExp[] = [
  /\b(ne mogu|impossible|ne znam ništa|cannot help)\b/i,
  /!!!+/,
  /CAPS{4,}/,
];

// ─── Evaluacione funkcije ─────────────────────────────────────────────

function evaluirajTacnost(pitanje: string, odgovor: string): EvaluacijaDimenzija {
  let skor = 14; // Baza

  for (const signal of TACNI_SIGNALI) {
    if (signal.test(odgovor)) skor += 2;
  }
  for (const signal of NESIGURNI_SIGNALI) {
    if (signal.test(odgovor)) skor -= 3;
  }

  skor = Math.max(0, Math.min(20, skor));
  const boja: EvaluacijaDimenzija['boja'] = skor >= 15 ? '🟢' : skor >= 10 ? '🟡' : '🔴';
  const napomena =
    skor >= 15
      ? 'Odgovor izgleda pouzdan sa konkretnim podacima'
      : skor >= 10
        ? 'Odgovor sadrži neke nesigurnosti'
        : 'Odgovor ima znake potencijalnih halucinacija';

  return { id: 'tacnost', naziv: 'Tačnost', skor, boja, napomena };
}

function evaluirajRelevantnost(pitanje: string, odgovor: string): EvaluacijaDimenzija {
  let skor = 12;

  // Proveri da li odgovor sadrži reči iz pitanja
  const recePitanja = pitanje
    .toLowerCase()
    .split(/\s+/)
    .filter((r) => r.length > 3);
  const odgovorLower = odgovor.toLowerCase();

  const pokriveneReci = recePitanja.filter((r) => odgovorLower.includes(r));
  const procenatPokrivenosti =
    recePitanja.length > 0 ? pokriveneReci.length / recePitanja.length : 0.5;

  skor = Math.round(12 + procenatPokrivenosti * 8);
  skor = Math.max(0, Math.min(20, skor));

  const boja: EvaluacijaDimenzija['boja'] = skor >= 15 ? '🟢' : skor >= 10 ? '🟡' : '🔴';
  const napomena =
    skor >= 15
      ? 'Odgovor direktno adresira korisničko pitanje'
      : skor >= 10
        ? 'Odgovor je delimično relevantan'
        : 'Odgovor možda ne adresira pravo pitanje';

  return { id: 'relevantnost', naziv: 'Relevantnost', skor, boja, napomena };
}

function evaluirajJasnost(odgovor: string): EvaluacijaDimenzija {
  let skor = 10;

  for (const signal of JASNOST_SIGNALI) {
    if (signal.test(odgovor)) skor += 2;
  }

  // Dužina odgovora — ni prekratko ni predugo
  const reci = odgovor.split(/\s+/).length;
  if (reci > 20 && reci < 600) skor += 2;
  if (reci > 800) skor -= 2;

  skor = Math.max(0, Math.min(20, skor));
  const boja: EvaluacijaDimenzija['boja'] = skor >= 15 ? '🟢' : skor >= 10 ? '🟡' : '🔴';
  const napomena =
    skor >= 15
      ? 'Odgovor je dobro strukturiran i lako čitljiv'
      : skor >= 10
        ? 'Odgovor bi imao koristi od bolje strukture'
        : 'Odgovor je teško čitljiv — nedostaje formatiranje';

  return { id: 'jasnost', naziv: 'Jasnoća', skor, boja, napomena };
}

function evaluirajKompletnost(pitanje: string, odgovor: string): EvaluacijaDimenzija {
  let skor = 12;

  for (const signal of KOMPLETNOST_SIGNALI) {
    if (signal.test(odgovor)) skor += 2;
  }

  // Kod pitanja koja zahtevaju primer — penalizuj ako nema koda
  const zahtevaPrimer =
    /\b(primer|example|implementiraj|napiši\s+kod|how\s+to|kako\s+da)\b/i.test(pitanje);
  if (zahtevaPrimer && !odgovor.includes('```')) {
    skor -= 4;
  }

  skor = Math.max(0, Math.min(20, skor));
  const boja: EvaluacijaDimenzija['boja'] = skor >= 15 ? '🟢' : skor >= 10 ? '🟡' : '🔴';
  const napomena =
    skor >= 15
      ? 'Odgovor je sveobuhvatan i potpun'
      : skor >= 10
        ? 'Odgovor bi mogao biti kompletiji'
        : 'Odgovoru nedostaju ključni elementi';

  return { id: 'kompletnost', naziv: 'Kompletnost', skor, boja, napomena };
}

function evaluirajTon(odgovor: string): EvaluacijaDimenzija {
  let skor = 16;

  for (const signal of POZITIVAN_TON) {
    if (signal.test(odgovor)) skor += 1;
  }
  for (const signal of NEGATIVAN_TON) {
    if (signal.test(odgovor)) skor -= 4;
  }

  // Previše emotikona
  const emojiCount = (odgovor.match(/[\u{1F300}-\u{1F9FF}]/gu) ?? []).length;
  if (emojiCount > 10) skor -= 2;

  skor = Math.max(0, Math.min(20, skor));
  const boja: EvaluacijaDimenzija['boja'] = skor >= 15 ? '🟢' : skor >= 10 ? '🟡' : '🔴';
  const napomena =
    skor >= 15
      ? 'Profesionalan i pozitivan ton'
      : skor >= 10
        ? 'Ton je prihvatljiv, ali može biti bolji'
        : 'Ton nije profesionalan ili je preodbijajoć';

  return { id: 'ton', naziv: 'Ton', skor, boja, napomena };
}

// ─── Javne funkcije ───────────────────────────────────────────────────

/**
 * Evaluira AI odgovor po 5 dimenzija i vraća ukupni skor.
 */
export function evaluirajOdgovor(
  pitanje: string,
  odgovor: string,
): EvaluacijaRezultat {
  const dimenzije: EvaluacijaDimenzija[] = [
    evaluirajTacnost(pitanje, odgovor),
    evaluirajRelevantnost(pitanje, odgovor),
    evaluirajJasnost(odgovor),
    evaluirajKompletnost(pitanje, odgovor),
    evaluirajTon(odgovor),
  ];

  const ukupanSkor = dimenzije.reduce((sum, d) => sum + d.skor, 0);
  const trebaPonovo = ukupanSkor < 70;

  const nivoKvaliteta: EvaluacijaRezultat['nivoKvaliteta'] =
    ukupanSkor >= 90
      ? 'odlican'
      : ukupanSkor >= 75
        ? 'dobar'
        : ukupanSkor >= 60
          ? 'prihvatljiv'
          : ukupanSkor >= 45
            ? 'slab'
            : 'los';

  const razlogLosSkor =
    trebaPonovo
      ? dimenzije
          .filter((d) => d.skor < 10)
          .map((d) => `${d.naziv}: ${d.napomena}`)
          .join('; ') || undefined
      : undefined;

  return {
    ukupanSkor,
    dimenzije,
    trebaPonovo,
    nivoKvaliteta,
    razlogLosSkor,
    formatiranPrikaz: formatirajEvaluaciju(ukupanSkor, dimenzije),
  };
}

/**
 * Formatira evaluaciju za prikaz u UI ili na kraju odgovora.
 */
export function formatirajEvaluaciju(
  ukupanSkor: number,
  dimenzije: EvaluacijaDimenzija[],
): string {
  const ukupnaBoja = ukupanSkor >= 75 ? '🟢' : ukupanSkor >= 50 ? '🟡' : '🔴';
  const skorBar = `[${ukupnaBoja} ${ukupanSkor}/100]`;

  const detalji = dimenzije
    .map((d) => `${d.boja} ${d.naziv}: ${d.skor}/20`)
    .join(' · ');

  return `${skorBar} ${detalji}`;
}

/**
 * Generiše instrukciju za ponovni pokušaj ako je skor nizak.
 */
export function generisiPonovniPokusaj(
  pitanje: string,
  losOdgovor: string,
  evaluacija: EvaluacijaRezultat,
): string {
  const problematikaDimenzija = evaluacija.dimenzije
    .filter((d) => d.skor < 12)
    .map((d) => `- ${d.naziv} (${d.skor}/20): ${d.napomena}`)
    .join('\n');

  return [
    'Prethodni odgovor nije bio dovoljno kvalitetan. Generiši bolji odgovor.',
    '',
    `**Korisnično pitanje:** ${pitanje}`,
    '',
    '**Problemi sa prethodnim odgovorom:**',
    problematikaDimenzija,
    '',
    '**Zahtevi za novi odgovor:**',
    '- Budi konkretan i pouzdan — navedi izvore ili primere',
    '- Koristi Markdown formatiranje (zaglavlja, liste, bold)',
    '- Ako pitanje zahteva kod, uvek uključi primer',
    '- Zadrži profesionalan ton',
  ].join('\n');
}
