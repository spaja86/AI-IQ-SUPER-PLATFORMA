// SpajaUltraOmegaCore -∞Ω+∞ — Inteligentni Prevodilac
// Kompanija SPAJA — Digitalna Industrija
// Specijalizovani prevod srpski ↔ engleski sa tehničkim, pravnim i marketing registrima

// ─── Tipovi ──────────────────────────────────────────────────────────

export type PrevodKontekst =
  | 'tehnicko'
  | 'pravno'
  | 'marketing'
  | 'poslovni'
  | 'medicinski'
  | 'opsti';

export type PareziJezika = 'sr-en' | 'en-sr' | 'auto';

export interface PrevodZahtev {
  jeZahtevZaPrevod: boolean;
  par: PareziJezika;
  kontekst: PrevodKontekst;
  originalniTekst: string;
  aiInstrukcija: string;
}

// ─── Detekcija zahteva za prevod ──────────────────────────────────────

const PREVOD_OBRASCI: RegExp[] = [
  /prevedi\s+(?:mi\s+)?(?:na\s+\w+\s+)?["']?(.+)["']?/i,
  /\b(translate|prevedi|prevedi\s+na\s+srpski|prevedi\s+na\s+engleski)\b/i,
  /kako\s+se\s+kaže\s+(.+)\s+na\s+\w+/i,
  /šta\s+znači\s+(.+)\s+na\s+\w+/i,
  /\bna\s+engleskom\s+(?:je|bi\s+bilo)\b/i,
  /\bna\s+srpskom\s+(?:je|bi\s+bilo)\b/i,
  /what\s+does\s+(.+)\s+mean\s+in\s+\w+/i,
  /how\s+(?:do\s+you\s+)?say\s+(.+)\s+in\s+\w+/i,
];

const PRAVAC_SR_EN: RegExp[] = [
  /(?:prevedi|translate)\s+(?:na\s+)?(?:engleski|english)/i,
  /na\s+engleskom/i,
  /in\s+english/i,
];

const PRAVAC_EN_SR: RegExp[] = [
  /(?:prevedi|translate)\s+(?:na\s+)?(?:srpski|serbian|bosnian|bosanski|hrvatski|croatian)/i,
  /na\s+srpskom/i,
  /in\s+serbian/i,
];

// ─── Detekcija konteksta ──────────────────────────────────────────────

const KONTEKST_OBRASCI: Array<{ kontekst: PrevodKontekst; regex: RegExp }> = [
  {
    kontekst: 'tehnicko',
    regex: /\b(API|REST|GraphQL|OAuth|JWT|SQL|docker|kubernetes|cloud|devops|microservices|CI\/CD|deployment|refactor|database|framework|library|repository|commit|merge|branch|pull\s+request)\b/i,
  },
  {
    kontekst: 'pravno',
    regex: /\b(ugovor|contract|zakon|law|regulativa|regulation|GDPR|odgovornost|liability|intelektualna\s+svojina|intellectual\s+property|klauzula|clause|saglasnost|consent)\b/i,
  },
  {
    kontekst: 'marketing',
    regex: /\b(brend|brand|kampanja|campaign|konverzija|conversion|ROI|CTA|call\s+to\s+action|ciljno\s+tržište|target\s+audience|lead|funnel|engagement|reach|impressions)\b/i,
  },
  {
    kontekst: 'poslovni',
    regex: /\b(invoice|faktura|PDV|VAT|prihod|revenue|budzet|budget|ROI|KPI|meeting|sastanak|agenda|deliverable|milestone|stakeholder)\b/i,
  },
  {
    kontekst: 'medicinski',
    regex: /\b(dijagnoza|diagnosis|terapija|therapy|simptom|symptom|lek|medication|protokol\s+lečenja|clinical|pacijent|patient)\b/i,
  },
];

// ─── Specijalizovane terminologije ────────────────────────────────────

const TEHNICKE_NAPOMENE: Record<PrevodKontekst, string> = {
  tehnicko: `Tehničke napomene za prevod:
- Nazivi programskih jezika, framework-a i biblioteka se NE prevode (React, Next.js, TypeScript)
- "Deploy" = "deplojtovati/objaviti", "debugging" = "debagovanje"
- API endpoint nazivi se zadržavaju na engleskom
- Dodaj originalni engleski termin u zagradi za specifičnu terminologiju: "kontejner (container)"`,

  pravno: `Pravne napomene za prevod:
- Pravne termine prevedi sa preciznošću — svaka reč je važna
- Uz pravne termine dodaj originalnu latinsku ili englesku verziju u zagradi
- Označi ako termin ima drugačije pravno značenje u srpskom pravu vs. EU pravu
- GDPR = "Uredba o zaštiti ličnih podataka (GDPR)"`,

  marketing: `Marketing napomene za prevod:
- Prevedi sa fokusom na efekat, ne doslovan prevod ("buzzword" = efektna reč)
- Eng. slogane adaptiraj kulturološki, ne samo lingvistički
- "Call to action" ostaje engl. ili se prevodi kao "poziv na akciju"
- Navedi ako postoji lokalizovana srpska verzija pojma`,

  poslovni: `Poslovne napomene za prevod:
- Finansijski termini: koristi standardnu srpsku poslovnu terminologiju (NBS, RSD, PDV)
- "Invoice" = "faktura", "Revenue" = "prihod", "Profit" = "profit/zarada"
- Skraćenice: PDV (VAT), PIB (TIN), APR (Business Registry)`,

  medicinski: `Medicinske napomene za prevod:
- Koristi standardnu medicinsku terminologiju (latinsku osnovu)
- Uvek navedi i latinsku verziju termina uz srpski prevod
- Ne improvizuj medicinske termine — ako nisi siguran, napomeni to
- Dodaj da uvek konsultuju medicinskog stručnjaka`,

  opsti: 'Prevedi tečno i prirodno, prilagođavajući kontekstu i registru.',
};

// ─── Javne funkcije ───────────────────────────────────────────────────

/**
 * Detektuje da li poruka sadrži zahtev za prevod.
 */
export function detektujPrevodZahtev(poruka: string): PrevodZahtev {
  const jeZahtev = PREVOD_OBRASCI.some((o) => o.test(poruka));

  if (!jeZahtev) {
    return {
      jeZahtevZaPrevod: false,
      par: 'auto',
      kontekst: 'opsti',
      originalniTekst: '',
      aiInstrukcija: '',
    };
  }

  // Detektuj pravac prevoda
  let par: PareziJezika = 'auto';
  if (PRAVAC_SR_EN.some((o) => o.test(poruka))) par = 'sr-en';
  else if (PRAVAC_EN_SR.some((o) => o.test(poruka))) par = 'en-sr';

  // Detektuj kontekst
  let kontekst: PrevodKontekst = 'opsti';
  for (const { kontekst: k, regex } of KONTEKST_OBRASCI) {
    if (regex.test(poruka)) {
      kontekst = k;
      break;
    }
  }

  const aiInstrukcija = generisiPrevodInstrukciju(par, kontekst);

  return {
    jeZahtevZaPrevod: true,
    par,
    kontekst,
    originalniTekst: poruka,
    aiInstrukcija,
  };
}

/**
 * Generiše instrukciju za AI prevodilac.
 */
export function generisiPrevodInstrukciju(
  par: PareziJezika,
  kontekst: PrevodKontekst,
): string {
  const NAZIV_PARA: Record<PareziJezika, string> = {
    'sr-en': 'srpskog na engleski',
    'en-sr': 'engleskog na srpski',
    auto: 'između srpskog i engleskog',
  };

  const NAZIV_KONTEKSTA: Record<PrevodKontekst, string> = {
    tehnicko: 'tehničkim (IT/software)',
    pravno: 'pravnim',
    marketing: 'marketing',
    poslovni: 'poslovnim',
    medicinski: 'medicinskim',
    opsti: 'opštim',
  };

  const napomena = TEHNICKE_NAPOMENE[kontekst];

  return [
    `Prevedi sa ${NAZIV_PARA[par]} u ${NAZIV_KONTEKSTA[kontekst]} registru.`,
    '',
    napomena,
    '',
    '**Format odgovora:**',
    '1. **Prevod:** [Prevedeni tekst]',
    '2. **Napomene:** [Terminološke napomene i alternative ako postoje]',
    '3. **Alternativni prevod:** [Ako postoji drugi validan prevod u drugom registru]',
  ].join('\n');
}

/**
 * Vraća dostupne prevodne parove.
 */
export function getPrevodniParovi(): PareziJezika[] {
  return ['sr-en', 'en-sr', 'auto'];
}

/**
 * Vraća dostupne kontekste prevoda.
 */
export function getPrevodniKonteksti(): PrevodKontekst[] {
  return ['tehnicko', 'pravno', 'marketing', 'poslovni', 'medicinski', 'opsti'];
}
