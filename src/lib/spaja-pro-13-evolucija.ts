/**
 * 🧬 SpajaPro 13 Evolucija Engine
 *
 * Genetski algoritmi, samo-evolucija promptova i autonomno učenje.
 * SpajaPro 13 je engine koji se sam unapređuje kroz svaku sesiju —
 * mutira, selekcijom bira, i križa promptove da dostiže optimalne odgovore.
 *
 * Karakteristike:
 *  - 256K token kontekst
 *  - Genetski algoritmi za optimizaciju promptova
 *  - Samo-evolucioni feedback loop
 *  - Meta-prompt generisanje
 *  - Kontinualno učenje iz sesija
 *  - Autonomna Prompt mutacija i selekcija
 *
 * Izvor: AI-IQ-SUPER-PLATFORMA — Kompanija SPAJA
 * Verzija: SpajaPro 13 (Evolucija)
 */

// ─── Tipovi ────────────────────────────────────────────────────────────────────

export type EvolucijaSelekcija = 'elitna' | 'turnirska' | 'ruletska' | 'rangirna';
export type EvolucijaMutacija = 'tačkasta' | 'inverzija' | 'zamena' | 'ekspanzija' | 'kompresija';
export type EvolucijаStatus = 'inicijalizacija' | 'evaluacija' | 'selekcija' | 'ukrstanje' | 'mutacija' | 'konvergencija' | 'zavrsetak';

export interface PromptHromozom {
  id: string;
  tekst: string;
  fitness: number;          // 0.0 – 1.0 (viši = bolji)
  generacija: number;
  roditeljIds: string[];
  mutacije: string[];
  kreiranAt: string;
}

export interface GenetskiParametri {
  velicinaPopulacije: number;
  maxGeneracija: number;
  stopaMutacije: number;       // 0.0 – 1.0
  stopaUkrstanja: number;      // 0.0 – 1.0
  elitizam: number;            // broj direktno prenešenih elitnih jedinki
  ciljnaFitness: number;       // fitness pri kome se zaustavlja evolucija
  selekcijaTip: EvolucijaSelekcija;
  mutacijaTipovi: EvolucijaMutacija[];
}

export interface EvolucijaSesija {
  id: string;
  upit: string;
  generacija: number;
  populacija: PromptHromozom[];
  najboljiFitness: number;
  najboljaTekst: string;
  istorija: EvolucijаGeneracija[];
  status: EvolucijаStatus;
  pocetakAt: string;
  trajanjeSekundi: number;
  parametri: GenetskiParametri;
}

export interface EvolucijаGeneracija {
  broj: number;
  prosecnaFitness: number;
  najboljiFitness: number;
  raznolikost: number;         // 0.0 – 1.0 genetska raznolikost populacije
  eliminisano: number;
  novihMutacija: number;
}

export interface MetaPrompt {
  id: string;
  bazniPrompt: string;
  metaInstrukcije: string[];
  evolucijskiKontekst: string;
  samoOptimizacija: boolean;
  targetFitness: number;
  generisanAt: string;
}

export interface EvolucijaIzvestaj {
  sesijaid: string;
  upit: string;
  ukupnoGeneracija: number;
  ukupnoEvaluacija: number;
  finalnaFitness: number;
  finalniPrompt: string;
  poboljsanje: number;         // procenat poboljšanja vs početni prompt
  konvergiraloU: number;       // generacija u kojoj je dostignut ciljni fitness
  trajanjeSekundi: number;
  istorija: EvolucijаGeneracija[];
}

export interface EvolucijaDijagnostika {
  aktivneSesije: number;
  ukupnoSesija: number;
  prosecnaKonvergencija: number;
  najboljiFitnessIkad: number;
  ukupnoMutacija: number;
  ukupnoUkrstanja: number;
  topPrompti: PromptHromozom[];
}

// ─── Podrazumevani Genetski Parametri ──────────────────────────────────────────

export const podrazumevaniGenetskiParametri: GenetskiParametri = {
  velicinaPopulacije: 50,
  maxGeneracija: 100,
  stopaMutacije: 0.15,
  stopaUkrstanja: 0.75,
  elitizam: 5,
  ciljnaFitness: 0.95,
  selekcijaTip: 'elitna',
  mutacijaTipovi: ['tačkasta', 'ekspanzija', 'kompresija'],
};

export const brzaEvolucija: GenetskiParametri = {
  velicinaPopulacije: 20,
  maxGeneracija: 30,
  stopaMutacije: 0.25,
  stopaUkrstanja: 0.8,
  elitizam: 3,
  ciljnaFitness: 0.85,
  selekcijaTip: 'turnirska',
  mutacijaTipovi: ['tačkasta', 'zamena'],
};

export const dubinskaEvolucija: GenetskiParametri = {
  velicinaPopulacije: 100,
  maxGeneracija: 500,
  stopaMutacije: 0.08,
  stopaUkrstanja: 0.9,
  elitizam: 10,
  ciljnaFitness: 0.99,
  selekcijaTip: 'rangirna',
  mutacijaTipovi: ['tačkasta', 'inverzija', 'zamena', 'ekspanzija', 'kompresija'],
};

// ─── Meta-Prompt Biblioteka ────────────────────────────────────────────────────

export const metaPrompti: MetaPrompt[] = [
  {
    id: 'meta-evolucija-core',
    bazniPrompt: 'Analiziraj upit i generiši optimalni odgovor.',
    metaInstrukcije: [
      'Evoluiraj ovaj prompt kroz 10 generacija da dostigneš fitness 0.95+',
      'Mutacija: dodaj preciznost bez gubitka informacija',
      'Selekcija: drži promptove koji generišu najtačnije odgovore',
      'Ukrstanje: kombiniraj preciznost i kreativnost',
    ],
    evolucijskiKontekst: 'Optimizacija za tačnost i relevantnost',
    samoOptimizacija: true,
    targetFitness: 0.95,
    generisanAt: '2025-09-01',
  },
  {
    id: 'meta-kod-evolucija',
    bazniPrompt: 'Napiši TypeScript kod za zadati problem.',
    metaInstrukcije: [
      'Evoluiraj prompt da generiše kod bez grešaka',
      'Mutacija: dodaj type safety i edge case handling',
      'Selekcija: kod koji se kompajlira bez grešaka ima fitness 1.0',
      'Ukrstanje: kombinuj stilove dokumentacije i logiku',
    ],
    evolucijskiKontekst: 'TypeScript kod generisanje sa evolucijom',
    samoOptimizacija: true,
    targetFitness: 0.98,
    generisanAt: '2025-09-01',
  },
  {
    id: 'meta-analiza-evolucija',
    bazniPrompt: 'Izvrši duboku analizu zadatog problema.',
    metaInstrukcije: [
      'Evoluiraj prompt da produbi analizu kroz generacije',
      'Mutacija: proširuj kontekst i dodaj dimenzije analize',
      'Selekcija: analiza sa više uvida ima veći fitness',
      'Ukrstanje: kombinuj tehničke i strategijske perspektive',
    ],
    evolucijskiKontekst: 'Duboka analiza sa samo-poboljšanjem',
    samoOptimizacija: true,
    targetFitness: 0.92,
    generisanAt: '2025-09-01',
  },
  {
    id: 'meta-kreativna-evolucija',
    bazniPrompt: 'Kreiraj originalan i inovativan sadržaj.',
    metaInstrukcije: [
      'Evoluiraj prompt ka maksimalnoj originalnosti',
      'Mutacija: uvodi iznenađujuće elemente i neočekivane veze',
      'Selekcija: originalnost i korisnost su podjednako važni',
      'Ukrstanje: meša različite stilove i perspektive',
    ],
    evolucijskiKontekst: 'Kreativna evolucija sadržaja',
    samoOptimizacija: true,
    targetFitness: 0.88,
    generisanAt: '2025-09-01',
  },
  {
    id: 'meta-strategija-evolucija',
    bazniPrompt: 'Razvij strategiju za postizanje cilja.',
    metaInstrukcije: [
      'Evoluiraj prompt da generiše robusniju strategiju u svakoj generaciji',
      'Mutacija: dodaj alternativne planove i rizik analizu',
      'Selekcija: strategija otporna na promene ima veći fitness',
      'Ukrstanje: kombinuj kratkoročne i dugoročne perspektive',
    ],
    evolucijskiKontekst: 'Strateška evolucija planiranja',
    samoOptimizacija: true,
    targetFitness: 0.93,
    generisanAt: '2025-09-01',
  },
];

// ─── SpajaPro 13 Evolucija Engine Konfiguracija ───────────────────────────────

export interface SpajaPro13Konfiguracija {
  naziv: string;
  verzija: 13;
  kodnoIme: 'Evolucija';
  ikona: '🧬';
  opis: string;
  maxTokena: 262144;
  genetskiParametri: GenetskiParametri;
  metaPrompti: MetaPrompt[];
  autonomnoUcenje: boolean;
  samoEvolucija: boolean;
  promptVerzionisanje: boolean;
  feedbackIntegracija: boolean;
  status: 'beta';
}

export const spajaPro13Konfiguracija: SpajaPro13Konfiguracija = {
  naziv: 'SpajaPro 13 Evolucija Engine',
  verzija: 13,
  kodnoIme: 'Evolucija',
  ikona: '🧬',
  opis: 'Autonomni evolucioni AI engine — genetski algoritmi optimizuju promptove kroz generacije. Svaka sesija uči i unapređuje narednu. Samo-evolucija, meta-prompt generisanje, i kontinualno poboljšanje.',
  maxTokena: 262144,
  genetskiParametri: podrazumevaniGenetskiParametri,
  metaPrompti: metaPrompti,
  autonomnoUcenje: true,
  samoEvolucija: true,
  promptVerzionisanje: true,
  feedbackIntegracija: true,
  status: 'beta',
};

// ─── Utility Funkcije ─────────────────────────────────────────────────────────

/**
 * Procenjuje fitness hromozoma (promptа) na osnovu metrike.
 * Fitness 0.0 = potpuno neprikladan, 1.0 = savršen.
 */
export function proceniFitness(hromozom: PromptHromozom, metrike: {
  tacnost?: number;
  relevantnost?: number;
  preciznost?: number;
  originalnost?: number;
}): number {
  const {
    tacnost = 0.5,
    relevantnost = 0.5,
    preciznost = 0.5,
    originalnost = 0.5,
  } = metrike;
  return (tacnost * 0.4 + relevantnost * 0.3 + preciznost * 0.2 + originalnost * 0.1);
}

/**
 * Vraća top N hromozoma iz populacije po fitness vrednosti.
 */
export function getTopHromozomi(populacija: PromptHromozom[], n: number): PromptHromozom[] {
  return [...populacija]
    .sort((a, b) => b.fitness - a.fitness)
    .slice(0, n);
}

/**
 * Vraća prosečan fitness populacije.
 */
export function getProsecnaFitness(populacija: PromptHromozom[]): number {
  if (populacija.length === 0) return 0;
  return populacija.reduce((sum, h) => sum + h.fitness, 0) / populacija.length;
}

/**
 * Provera da li je sesija konvergirala (dostigla ciljni fitness).
 */
export function jeKonvergirala(sesija: EvolucijaSesija): boolean {
  return sesija.najboljiFitness >= sesija.parametri.ciljnaFitness
    || sesija.generacija >= sesija.parametri.maxGeneracija;
}

/**
 * Generiše dijagnostiku evolucijskog sistema.
 */
export function getEvolucijaStatistika(sesije: EvolucijaSesija[]): EvolucijaDijagnostika {
  const zavrseneSesije = sesije.filter((s) => s.status === 'zavrsetak' || s.status === 'konvergencija');
  const sviHromozomi = sesije.flatMap((s) => s.populacija);

  return {
    aktivneSesije: sesije.filter((s) => s.status !== 'zavrsetak' && s.status !== 'konvergencija').length,
    ukupnoSesija: sesije.length,
    prosecnaKonvergencija: zavrseneSesije.length > 0
      ? zavrseneSesije.reduce((sum, s) => sum + s.generacija, 0) / zavrseneSesije.length
      : 0,
    najboljiFitnessIkad: sviHromozomi.length > 0
      ? Math.max(...sviHromozomi.map((h) => h.fitness))
      : 0,
    ukupnoMutacija: sviHromozomi.reduce((sum, h) => sum + h.mutacije.length, 0),
    ukupnoUkrstanja: sviHromozomi.filter((h) => h.roditeljIds.length > 1).length,
    topPrompti: getTopHromozomi(sviHromozomi, 5),
  };
}

/**
 * Vraća meta-prompt po ID-u.
 */
export function getMetaPrompt(id: string): MetaPrompt | undefined {
  return metaPrompti.find((m) => m.id === id);
}

/**
 * Simulira fitness evaluaciju novog hromozoma za prikaz.
 */
export function simulirajEvaluaciju(tekst: string): number {
  // Jednostavna heuristika: duži, precizniji promptovi imaju bolji fitness
  const duzinaSkor = Math.min(tekst.length / 500, 1.0) * 0.3;
  const preciznostSkor = (tekst.includes('TypeScript') || tekst.includes('analiz') || tekst.includes('strategij')) ? 0.4 : 0.2;
  const strukturaSkor = tekst.includes('\n') ? 0.3 : 0.1;
  return Math.min(duzinaSkor + preciznostSkor + strukturaSkor, 1.0);
}
