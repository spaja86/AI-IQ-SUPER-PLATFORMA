/**
 * 🧬 SpajaUltraOmegaCore -∞Ω+∞ — Programski Jezik
 *
 * Univerzalni programski jezik Kompanije SPAJA koji operira
 * u beskonačnom spektru od -∞ do +∞ kroz Omega (Ω) jezgro.
 *
 * Paradigme: omega-oktavni, sekvencijalni, proksi-signalni,
 * neuroloski-mrezni, evolucioni, hibridni.
 *
 * Svaka naredba se izvršava kroz 8 oktavnih nivoa OMEGA AI sistema
 * sa elastičnom sinhronizacijom i matricnim jezgrom 8×8.
 */

// ─── Tipovi paradigmi ───────────────────────────────────────────────

export type JezickaParadigma =
  | 'omega-oktavni'
  | 'sekvencijalni'
  | 'proksi-signalni'
  | 'neuroloski-mrezni'
  | 'evolucioni'
  | 'hibridni';

export interface Paradigma {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  paradigma: JezickaParadigma;
  oktavniNivo: number;
  snaga: string;
}

// ─── Tipovi podataka ────────────────────────────────────────────────

export type OmegaTipPodatka =
  | 'omega-broj'
  | 'omega-signal'
  | 'omega-matrica'
  | 'omega-sekvenca'
  | 'omega-persona'
  | 'omega-oktava'
  | 'omega-mreza'
  | 'omega-prompt'
  | 'omega-beskonacnost'
  | 'omega-vez';

export interface TipPodatka {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: OmegaTipPodatka;
  opseg: string;
  primer: string;
}

// ─── Operatori ──────────────────────────────────────────────────────

export type OmegaOperatorTip =
  | 'aritmeticki'
  | 'logicki'
  | 'signalni'
  | 'oktavni'
  | 'mrezni'
  | 'evolucioni';

export interface Operator {
  id: string;
  simbol: string;
  naziv: string;
  opis: string;
  tip: OmegaOperatorTip;
  primer: string;
}

// ─── Naredbe ────────────────────────────────────────────────────────

export type NaredbaTip =
  | 'deklaracija'
  | 'kontrola-toka'
  | 'omega-dispatch'
  | 'proksi-signal'
  | 'evolucija'
  | 'prompt';

export interface Naredba {
  id: string;
  kljucnaRec: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: NaredbaTip;
  sintaksa: string;
  primer: string;
}

// ─── Kompajler faze ─────────────────────────────────────────────────

export interface KompajlerFaza {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  redosled: number;
  trajanje: string;
}

// ─── Runtime ────────────────────────────────────────────────────────

export interface OmegaRuntime {
  naziv: string;
  verzija: string;
  opis: string;
  ikona: string;
  oktave: number;
  persone: number;
  kapacitet: string;
  status: 'aktivan' | 'razvoj' | 'planiranje';
}

// ─── Kompletna specifikacija jezika ─────────────────────────────────

export interface SpajaUltraOmegaCoreSpec {
  naziv: string;
  verzija: string;
  opis: string;
  spektar: string;
  paradigme: Paradigma[];
  tipoviPodataka: TipPodatka[];
  operatori: Operator[];
  naredbe: Naredba[];
  kompajlerFaze: KompajlerFaza[];
  runtime: OmegaRuntime;
}

// ═══════════════════════════════════════════════════════════════════
// PARADIGME
// ═══════════════════════════════════════════════════════════════════

export const paradigme: Paradigma[] = [
  {
    id: 'omega-oktavni',
    naziv: 'Omega-Oktavni',
    opis: 'Kod se izvršava kroz 8 oktavnih nivoa OMEGA AI sistema — od Temelja do Evolucije',
    ikona: '🎵',
    paradigma: 'omega-oktavni',
    oktavniNivo: 8,
    snaga: '∞ Ω',
  },
  {
    id: 'sekvencijalni',
    naziv: 'Sekvencijalni',
    opis: 'Sekvencijalno izvršavanje naredbi sa elastičnom sinhronizacijom između oktava',
    ikona: '📋',
    paradigma: 'sekvencijalni',
    oktavniNivo: 8,
    snaga: '10²²⁸ ops/s',
  },
  {
    id: 'proksi-signalni',
    naziv: 'Proksi-Signalni',
    opis: 'Komunikacija preko Proksi hipsoneuričnih signala — ekscentrični, koncentrični, ekliptični, rezonantni',
    ikona: '📡',
    paradigma: 'proksi-signalni',
    oktavniNivo: 6,
    snaga: '10²²⁸ TB/s',
  },
  {
    id: 'neuroloski-mrezni',
    naziv: 'Neurološko-Mrežni',
    opis: 'Neurološka mreža sa sinaptičkim vezama između 21 OMEGA AI persone — intra i inter-oktavne sinapse',
    ikona: '🧠',
    paradigma: 'neuroloski-mrezni',
    oktavniNivo: 8,
    snaga: '21 × 21 sinapsa',
  },
  {
    id: 'evolucioni',
    naziv: 'Evolucioni',
    opis: 'Samoevoluirajući kod koji se autonomno unapređuje kroz Evolver, Monitor, Ekolog i Vizionar persone',
    ikona: '🧬',
    paradigma: 'evolucioni',
    oktavniNivo: 8,
    snaga: '∞ generacija',
  },
  {
    id: 'hibridni',
    naziv: 'Hibridni',
    opis: 'Kombinacija svih paradigmi u jedinstven -∞Ω+∞ izvršni model sa adaptivnim prebacivanjem',
    ikona: '🔮',
    paradigma: 'hibridni',
    oktavniNivo: 8,
    snaga: '-∞ do +∞',
  },
];

// ═══════════════════════════════════════════════════════════════════
// TIPOVI PODATAKA
// ═══════════════════════════════════════════════════════════════════

export const tipoviPodataka: TipPodatka[] = [
  {
    id: 'omega-broj',
    naziv: 'ΩBroj',
    opis: 'Omega broj sa opsegom od -∞ do +∞ — beskonačna preciznost',
    ikona: '🔢',
    tip: 'omega-broj',
    opseg: '-∞ ... +∞',
    primer: 'neka x: ΩBroj = ∞;',
  },
  {
    id: 'omega-signal',
    naziv: 'ΩSignal',
    opis: 'Proksi signal sa frekvencijom, amplitudom i tipom — prenosi podatke kroz mrežu',
    ikona: '📡',
    tip: 'omega-signal',
    opseg: '0 THz ... 88.2 THz',
    primer: 'neka sig: ΩSignal = proksi.signal("hipsoneuricni");',
  },
  {
    id: 'omega-matrica',
    naziv: 'ΩMatrica',
    opis: 'Matricno jezgro 8×8 sa sekvencijalnim odazivima — ekscitatorni, inhibitorni, modulatorni',
    ikona: '🔲',
    tip: 'omega-matrica',
    opseg: '8 × 8 × 3 tipa',
    primer: 'neka mat: ΩMatrica = omega.matrica(8, 8);',
  },
  {
    id: 'omega-sekvenca',
    naziv: 'ΩSekvenca',
    opis: 'Sekvenca instrukcija organizovana po tipu — hero, statistika, kartice, tabela i više',
    ikona: '📑',
    tip: 'omega-sekvenca',
    opseg: '10 tipova × ∞ stavki',
    primer: 'neka sek: ΩSekvenca = sekvenca.kreiraj("hero");',
  },
  {
    id: 'omega-persona',
    naziv: 'ΩPersona',
    opis: 'OMEGA AI persona sa ulogom, oktavom, kategorijom i prioritetom',
    ikona: '👤',
    tip: 'omega-persona',
    opseg: '21 persona × 8 oktava',
    primer: 'neka arh: ΩPersona = omega.persona("arhitekta");',
  },
  {
    id: 'omega-oktava',
    naziv: 'ΩOktava',
    opis: 'Oktavni nivo od 1 (Temelj) do 8 (Evolucija) sa elastičnom sinhronizacijom',
    ikona: '🎵',
    tip: 'omega-oktava',
    opseg: '1 ... 8',
    primer: 'neka okt: ΩOktava = omega.oktava(1, "Temelj");',
  },
  {
    id: 'omega-mreza',
    naziv: 'ΩMreza',
    opis: 'Neurološka mreža sa čvorovima, sinapsama i klasterima',
    ikona: '🌐',
    tip: 'omega-mreza',
    opseg: '21 čvor × ∞ sinapsa',
    primer: 'neka net: ΩMreza = omega.mreza.kreiraj();',
  },
  {
    id: 'omega-prompt',
    naziv: 'ΩPrompt',
    opis: 'Univerzalni prompt za komunikaciju sa OMEGA AI — strukturirani zahtev',
    ikona: '💬',
    tip: 'omega-prompt',
    opseg: '∞ kategorija × ∞ promptova',
    primer: 'neka p: ΩPrompt = prompt.kreiraj("arhitektura");',
  },
  {
    id: 'omega-beskonacnost',
    naziv: 'ΩBeskonačnost',
    opis: 'Beskonačni tip podatka — sadrži opseg od -∞ do +∞ sa Ω jezgrom',
    ikona: '♾️',
    tip: 'omega-beskonacnost',
    opseg: '-∞Ω+∞',
    primer: 'neka inf: ΩBeskonačnost = Ω(-∞, +∞);',
  },
  {
    id: 'omega-vez',
    naziv: 'ΩVez',
    opis: 'Ekliptična vez između čvorova — orbitalna komunikaciona veza',
    ikona: '🔗',
    tip: 'omega-vez',
    opseg: 'N čvorova × N veza',
    primer: 'neka v: ΩVez = proksi.vez("eklipticna");',
  },
];

// ═══════════════════════════════════════════════════════════════════
// OPERATORI
// ═══════════════════════════════════════════════════════════════════

export const operatori: Operator[] = [
  // Aritmetički
  {
    id: 'omega-sabiranje',
    simbol: 'Ω+',
    naziv: 'Omega Sabiranje',
    opis: 'Sabiranje sa Omega pojačanjem — rezultat uvek ≥ oba operanda',
    tip: 'aritmeticki',
    primer: 'x Ω+ y  // x + y + Ω pojačanje',
  },
  {
    id: 'omega-oduzimanje',
    simbol: 'Ω-',
    naziv: 'Omega Oduzimanje',
    opis: 'Oduzimanje sa Omega prigušenjem — nikada ne prelazi -∞',
    tip: 'aritmeticki',
    primer: 'x Ω- y  // x - y sa Ω stabilizacijom',
  },
  {
    id: 'omega-mnozenje',
    simbol: 'Ω×',
    naziv: 'Omega Množenje',
    opis: 'Množenje sa Omega eskalacijom — eksponencijalni rast',
    tip: 'aritmeticki',
    primer: 'x Ω× y  // x × y × Ω faktor',
  },
  {
    id: 'omega-deljenje',
    simbol: 'Ω÷',
    naziv: 'Omega Deljenje',
    opis: 'Deljenje sa Omega zaštitom — nikada ne deli sa nulom',
    tip: 'aritmeticki',
    primer: 'x Ω÷ y  // x ÷ y sa Ω sigurnosnom mrežom',
  },
  // Logički
  {
    id: 'omega-i',
    simbol: 'Ω∧',
    naziv: 'Omega I (AND)',
    opis: 'Logičko I sa Omega fuzzy logikom — stepen istine 0.0–1.0',
    tip: 'logicki',
    primer: 'a Ω∧ b  // fuzzy AND sa Ω graduacijom',
  },
  {
    id: 'omega-ili',
    simbol: 'Ω∨',
    naziv: 'Omega ILI (OR)',
    opis: 'Logičko ILI sa Omega inkluzijom — uvek bira jači signal',
    tip: 'logicki',
    primer: 'a Ω∨ b  // inkluzivno OR sa Ω selekcijom',
  },
  {
    id: 'omega-ne',
    simbol: 'Ω¬',
    naziv: 'Omega NE (NOT)',
    opis: 'Logička negacija sa Omega inverzijom — menja fazu signala',
    tip: 'logicki',
    primer: 'Ω¬ a  // inverzija sa faznim pomerajem',
  },
  // Signalni
  {
    id: 'omega-emit',
    simbol: 'Ω→',
    naziv: 'Omega Emituj',
    opis: 'Emituje signal kroz Proksi mrežu — prema ciljnom čvoru',
    tip: 'signalni',
    primer: 'cvor Ω→ signal  // emituj signal ka čvoru',
  },
  {
    id: 'omega-primi',
    simbol: 'Ω←',
    naziv: 'Omega Primi',
    opis: 'Prima signal iz Proksi mreže — od izvornog čvora',
    tip: 'signalni',
    primer: 'signal Ω← cvor  // primi signal od čvora',
  },
  {
    id: 'omega-rezonanca',
    simbol: 'Ω↔',
    naziv: 'Omega Rezonanca',
    opis: 'Bidirekciona rezonantna veza — pojačava oba smera',
    tip: 'signalni',
    primer: 'cvor1 Ω↔ cvor2  // rezonantna vez',
  },
  // Oktavni
  {
    id: 'omega-uzdignuce',
    simbol: 'Ω↑',
    naziv: 'Omega Uzdignuće',
    opis: 'Podiže izvršavanje na viši oktavni nivo',
    tip: 'oktavni',
    primer: 'kontekst Ω↑ 3  // podigni na oktavu 3',
  },
  {
    id: 'omega-poniranje',
    simbol: 'Ω↓',
    naziv: 'Omega Poniranje',
    opis: 'Spušta izvršavanje na niži oktavni nivo',
    tip: 'oktavni',
    primer: 'kontekst Ω↓ 1  // spusti na oktavu 1',
  },
  // Mrežni
  {
    id: 'omega-sinapsa',
    simbol: 'Ω⇌',
    naziv: 'Omega Sinapsa',
    opis: 'Kreira sinaptičku vezu između dva neurološka čvora',
    tip: 'mrezni',
    primer: 'persona1 Ω⇌ persona2  // sinaptička veza',
  },
  // Evolucioni
  {
    id: 'omega-evolucija',
    simbol: 'Ω🧬',
    naziv: 'Omega Evolucija',
    opis: 'Pokreće evolucioni ciklus — samonadogradnja koda',
    tip: 'evolucioni',
    primer: 'modul Ω🧬 verzija  // evoluiraj modul',
  },
  {
    id: 'omega-beskonacnost-op',
    simbol: '-∞Ω+∞',
    naziv: 'Omega Beskonačnost',
    opis: 'Univerzalni operator — pokriva celokupan spektar od -∞ do +∞',
    tip: 'evolucioni',
    primer: 'sistem -∞Ω+∞  // aktiviraj pun spektar',
  },
];

// ═══════════════════════════════════════════════════════════════════
// NAREDBE (Ključne reči)
// ═══════════════════════════════════════════════════════════════════

export const naredbe: Naredba[] = [
  // Deklaracija
  {
    id: 'neka',
    kljucnaRec: 'neka',
    naziv: 'Deklaracija promenljive',
    opis: 'Deklariše promenljivu sa Omega tipom podatka',
    ikona: '📌',
    tip: 'deklaracija',
    sintaksa: 'neka <ime>: <ΩTip> = <vrednost>;',
    primer: 'neka signal: ΩSignal = proksi.signal("primarni");',
  },
  {
    id: 'stalna',
    kljucnaRec: 'stalna',
    naziv: 'Konstantna deklaracija',
    opis: 'Deklariše nepromenljivu konstantu — jednom postavljena, zauvek fiksirana',
    ikona: '🔒',
    tip: 'deklaracija',
    sintaksa: 'stalna <ime>: <ΩTip> = <vrednost>;',
    primer: 'stalna PI: ΩBroj = 3.14159265358979;',
  },
  {
    id: 'funkcija-omega',
    kljucnaRec: 'funkcija',
    naziv: 'Omega Funkcija',
    opis: 'Definiše funkciju koja se izvršava kroz oktavni sistem',
    ikona: '⚙️',
    tip: 'deklaracija',
    sintaksa: 'funkcija <ime>(<param>: <ΩTip>): <ΩTip> { ... }',
    primer: 'funkcija obrada(sig: ΩSignal): ΩMatrica { ... }',
  },
  // Kontrola toka
  {
    id: 'ako',
    kljucnaRec: 'ako',
    naziv: 'Omega Uslov',
    opis: 'Uslovno grananje sa Omega fuzzy evaluacijom',
    ikona: '🔀',
    tip: 'kontrola-toka',
    sintaksa: 'ako (<uslov>) { ... } inace { ... }',
    primer: 'ako (signal.snaga Ω+ 10 > prag) { emituj(); }',
  },
  {
    id: 'za-svaku',
    kljucnaRec: 'za_svaku',
    naziv: 'Omega Iteracija',
    opis: 'Iterira kroz Omega kolekciju sa paralelnom obradom',
    ikona: '🔄',
    tip: 'kontrola-toka',
    sintaksa: 'za_svaku (<stavka> u <kolekcija>) { ... }',
    primer: 'za_svaku (persona u omega.persone) { persona.aktiviraj(); }',
  },
  {
    id: 'dok',
    kljucnaRec: 'dok',
    naziv: 'Omega Petlja',
    opis: 'Petlja sa Omega uslovom — nastavlja dok uslov rezonira',
    ikona: '♻️',
    tip: 'kontrola-toka',
    sintaksa: 'dok (<uslov>) { ... }',
    primer: 'dok (mreza.zdravlje < 100) { mreza.popravi(); }',
  },
  // Omega Dispatch
  {
    id: 'dispatch',
    kljucnaRec: 'dispatch',
    naziv: 'Omega Dispatch',
    opis: 'Dispečuje zadatak kroz OMEGA AI sistem — bira optimalnu personu i oktavu',
    ikona: '🚀',
    tip: 'omega-dispatch',
    sintaksa: 'dispatch <zadatak> kroz <oktava|persona>;',
    primer: 'dispatch "optimizuj-build" kroz Optimizator;',
  },
  {
    id: 'sinhronizuj',
    kljucnaRec: 'sinhronizuj',
    naziv: 'Omega Sinhronizacija',
    opis: 'Sinhronizuje sve oktave u elastičnom režimu',
    ikona: '🔄',
    tip: 'omega-dispatch',
    sintaksa: 'sinhronizuj <mod> { ... }',
    primer: 'sinhronizuj paralelni { oktava1(); oktava2(); }',
  },
  // Proksi Signal
  {
    id: 'emituj',
    kljucnaRec: 'emituj',
    naziv: 'Proksi Emituj',
    opis: 'Emituje hipsoneurični signal kroz Proksi mrežu',
    ikona: '📡',
    tip: 'proksi-signal',
    sintaksa: 'emituj <signal> prema <cvor>;',
    primer: 'emituj hipsoneuricni prema jezgro_cvor;',
  },
  {
    id: 'primi',
    kljucnaRec: 'primi',
    naziv: 'Proksi Primi',
    opis: 'Prima i obrađuje signal iz Proksi mreže',
    ikona: '📥',
    tip: 'proksi-signal',
    sintaksa: 'primi <signal> od <cvor>;',
    primer: 'primi rezonantni od ai_cvor;',
  },
  // Evolucija
  {
    id: 'evoluiraj',
    kljucnaRec: 'evoluiraj',
    naziv: 'Omega Evolucija',
    opis: 'Pokreće evolucioni ciklus — kod se samonadograđuje',
    ikona: '🧬',
    tip: 'evolucija',
    sintaksa: 'evoluiraj <modul> verzija <N>;',
    primer: 'evoluiraj omega_core verzija 2;',
  },
  {
    id: 'nadgledaj',
    kljucnaRec: 'nadgledaj',
    naziv: 'Omega Nadgledanje',
    opis: 'Aktivira kontinuirano nadgledanje sistema u realnom vremenu',
    ikona: '👁️',
    tip: 'evolucija',
    sintaksa: 'nadgledaj <sistem> svaki <interval>;',
    primer: 'nadgledaj zdravlje svaki 6h;',
  },
  // Prompt
  {
    id: 'prompt-naredba',
    kljucnaRec: 'prompt',
    naziv: 'Univerzalni Prompt',
    opis: 'Šalje strukturirani prompt OMEGA AI sistemu — jezgro komunikacije',
    ikona: '💬',
    tip: 'prompt',
    sintaksa: 'prompt "<tekst>" kategorija <kat> nivo <N>;',
    primer: 'prompt "dizajniraj novi modul" kategorija arhitektura nivo 1;',
  },
  {
    id: 'odgovor',
    kljucnaRec: 'odgovor',
    naziv: 'Omega Odgovor',
    opis: 'Prima strukturirani odgovor od OMEGA AI persone',
    ikona: '📨',
    tip: 'prompt',
    sintaksa: 'odgovor od <persona> u <promenljiva>;',
    primer: 'odgovor od Arhitekta u rezultat;',
  },
];

// ═══════════════════════════════════════════════════════════════════
// KOMPAJLER FAZE
// ═══════════════════════════════════════════════════════════════════

export const kompajlerFaze: KompajlerFaza[] = [
  {
    id: 'leksicka-analiza',
    naziv: 'Leksička Analiza',
    opis: 'Razbija izvorni kod na Omega tokene — prepoznaje ključne reči, operatore i literale',
    ikona: '🔤',
    redosled: 1,
    trajanje: '0.001 ms',
  },
  {
    id: 'sintaksna-analiza',
    naziv: 'Sintaksna Analiza',
    opis: 'Gradi apstraktno sintaksno stablo (AST) sa Omega čvorovima i oktavnim anotacijama',
    ikona: '🌳',
    redosled: 2,
    trajanje: '0.002 ms',
  },
  {
    id: 'semanticka-analiza',
    naziv: 'Semantička Analiza',
    opis: 'Proverava tipove, oktavne nivoe i signalne kompatibilnosti — Omega type checking',
    ikona: '🔍',
    redosled: 3,
    trajanje: '0.003 ms',
  },
  {
    id: 'omega-optimizacija',
    naziv: 'Omega Optimizacija',
    opis: 'Optimizuje izvršavanje kroz matricno jezgro 8×8 — bira optimalne putanje',
    ikona: '⚡',
    redosled: 4,
    trajanje: '0.005 ms',
  },
  {
    id: 'proksi-mapiranje',
    naziv: 'Proksi Mapiranje',
    opis: 'Mapira signalne operacije na Proksi mrežne čvorove — rutiranje komunikacije',
    ikona: '🗺️',
    redosled: 5,
    trajanje: '0.004 ms',
  },
  {
    id: 'oktavno-raspoređivanje',
    naziv: 'Oktavno Raspoređivanje',
    opis: 'Raspoređuje naredbe po oktavnim nivoima sa elastičnom sinhronizacijom',
    ikona: '📊',
    redosled: 6,
    trajanje: '0.003 ms',
  },
  {
    id: 'generisanje-koda',
    naziv: 'Generisanje Omega Koda',
    opis: 'Generiše izvršni Omega bajtkod za -∞Ω+∞ runtime',
    ikona: '🔧',
    redosled: 7,
    trajanje: '0.002 ms',
  },
  {
    id: 'deploy-verifikacija',
    naziv: 'Deploy Verifikacija',
    opis: 'Verifikuje zdravlje generisanog koda kroz 11 dijagnostičkih provera',
    ikona: '✅',
    redosled: 8,
    trajanje: '0.001 ms',
  },
];

// ═══════════════════════════════════════════════════════════════════
// RUNTIME
// ═══════════════════════════════════════════════════════════════════

export const omegaRuntime: OmegaRuntime = {
  naziv: 'SpajaUltraOmegaCore Runtime -∞Ω+∞',
  verzija: '1.0.0',
  opis: 'Univerzalni runtime koji izvršava Omega bajtkod kroz 8 oktava, 21 personu i Proksi mrežu sa beskonačnim spektrom od -∞ do +∞',
  ikona: '🧬',
  oktave: 8,
  persone: 21,
  kapacitet: '10²²⁸ ops/s',
  status: 'aktivan',
};

// ═══════════════════════════════════════════════════════════════════
// KOMPLETNA SPECIFIKACIJA
// ═══════════════════════════════════════════════════════════════════

export const spajaUltraOmegaCore: SpajaUltraOmegaCoreSpec = {
  naziv: 'SpajaUltraOmegaCore -∞Ω+∞',
  verzija: '1.0.0',
  opis: 'Univerzalni programski jezik Kompanije SPAJA koji operira u beskonačnom spektru od -∞ do +∞ kroz Omega (Ω) jezgro sa 8 oktava, 21 AI personom, Proksi mrežom i evolucijskim samounapređenjem',
  spektar: '-∞Ω+∞',
  paradigme,
  tipoviPodataka,
  operatori,
  naredbe,
  kompajlerFaze,
  runtime: omegaRuntime,
};

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

export function getParadigmePoTipu(tip: JezickaParadigma): Paradigma[] {
  return paradigme.filter((p) => p.paradigma === tip);
}

export function getNaredbePoTipu(tip: NaredbaTip): Naredba[] {
  return naredbe.filter((n) => n.tip === tip);
}

export function getOperatorePoTipu(tip: OmegaOperatorTip): Operator[] {
  return operatori.filter((o) => o.tip === tip);
}

export function getBrojNaredbi(): number {
  return naredbe.length;
}

export function getBrojOperatora(): number {
  return operatori.length;
}

export function getBrojTipova(): number {
  return tipoviPodataka.length;
}

export function getKompajlerFazeSortirane(): KompajlerFaza[] {
  return [...kompajlerFaze].sort((a, b) => a.redosled - b.redosled);
}

export function getSpecSummary() {
  return {
    naziv: spajaUltraOmegaCore.naziv,
    verzija: spajaUltraOmegaCore.verzija,
    spektar: spajaUltraOmegaCore.spektar,
    paradigmi: paradigme.length,
    tipovaPodataka: tipoviPodataka.length,
    operatora: operatori.length,
    naredbi: naredbe.length,
    kompajlerFaza: kompajlerFaze.length,
    runtime: omegaRuntime.status,
  };
}
