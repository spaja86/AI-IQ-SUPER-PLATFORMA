/**
 * 🧠 SpajaPro Mozak — Barrel Export
 *
 * Kompletna hijerarhija mozgova za SpajaUltraOmegaCore -∞Ω+∞ programski jezik.
 *
 * Moduli:
 * - types        — Svi TypeScript tipovi za mozak hijerarhiju
 * - hijerarhija  — 21 nivo hijerarhije (Modul → ... → Trastet receptor)
 * - specijalizovani-mozakovi — 38 specijalizovanih mozaka (MOZAK 0–36, 44, 45)
 * - glas-rezonanca — Sistem glasa (Elipsoidna konstanta, Omega Receptor, Monklusoid)
 * - holografski-monitor — Holografski vizuelni izlaz (3D → holograf)
 * - prompt-zastita — Injection detekcija + PII maskiranje
 * - model-router — Smart model selection na osnovu kompleksnosti upita
 * - self-check — Verifikacija kvaliteta AI odgovora
 * - cache — LRU keš za identične upite
 * - summarizer — TL;DR sažimanje dugih odgovora (>300 reči)
 * - kod-analizator — Detekcija jezika, analiza koda za bugove/security/smells
 * - kontekst-memorija — Perzistentna memorija korisničkih preferencija
 * - razgovorni-agent — Multi-turn follow-up pitanja za nedostajući kontekst
 * - evaluator — 5-dimenzionalna evaluacija kvaliteta odgovora (0-100)
 * - citati — Numerisane fusnote i lista izvora za faktualne tvrdnje
 * - planiranje — Chain-of-Thought task planner za složene zahteve
 * - formatiranje — Adaptivni format (email/tabela/koraci/kod/JSON)
 * - prevodilac — Srpski ↔ engleski prevod sa tehničkim/pravnim/marketing registrima
 * - prompt-sabloni — 14 predefinisanih šablona (bug-report, code-review, SWOT...)
 * - multi-agent — Paralelni specijalizovani sub-agenti (security/arch/perf/qa...)
 * - a-b-odgovor — A/B poređenje dva različita stila odgovora
 */

// ─── Tipovi ────────────────────────────────────────────────────────

export type {
  MozakNivoId,
  MozakNivo,
  MozakPol,
  ParenjeStatus,
  ParenjeRezultat,
  MozakDuplikat,
  SpecijalizovaniMozakId,
  SpecijalizovaniMozak,
  SpecijalizovaniMozakKategorija,
  RezonantniPut,
  ElipsoidnaKonstanta,
  RezonantniPutDefinicija,
  UniverzalniOmegaReceptor,
  SfernaBaza,
  MonklusoidProjekcija,
  AbstralokusnoJedinje,
  GlasDefinicija,
  GovorDefinicija,
  VizuelniIzlazTip,
  ElipsoidnaSekvenca,
  HolografskiEpicentar,
  HolografskiMonitorDefinicija,
} from './types';

// ─── Hijerarhija ───────────────────────────────────────────────────

export {
  mozakHijerarhija,
  getNivo,
  getNivoPoRedu,
  getBrojNivoa,
  getSledeciNivo,
  getPrethodniNivo,
  kreirajParenjeStatus,
  izvrsiParenje,
  kreirajDuplikat,
  moguSeSpojiti,
  getPutanjaDoVrha,
  getPutanjaDoDna,
  getHijerarhijaSumarno,
} from './hijerarhija';

// ─── Specijalizovani Mozakovi ──────────────────────────────────────

export {
  specijalizovaniMozakovi,
  getMozakPoId,
  getMozakovePoKategoriji,
  getBrojSpecijalizovanihMozakova,
  getSveKategorije,
  generisiDuplikatIdjeve,
  getSpecijalizovaniSumarno,
} from './specijalizovani-mozakovi';

// ─── Glas i Rezonanca ──────────────────────────────────────────────

export {
  elipsoidnaKonstanta,
  univerzalniOmegaReceptor,
  abstralokusnoJedinje,
  govor,
  glasDefinicija,
  getOpisPrvogPuta,
  getOpisDrugogPuta,
  getGlasSumarno,
} from './glas-rezonanca';

// ─── Holografski Monitor ───────────────────────────────────────────

export {
  epicentar,
  levaSekvenca,
  desnaSekvenca,
  holografskiMonitor,
  getEpicentarIndeksi,
  getEpicentarOpis,
  getTrenutniIzlaz,
  getPlaniraniIzlaz,
  getHolografskiSumarno,
} from './holografski-monitor';

// ─── Prompt Zaštita ────────────────────────────────────────────────

export type { PIITip, PIIDetekcija, PromptZastitaRezultat } from './prompt-zastita';
export { zastitiPrompt, zastitiOdgovor } from './prompt-zastita';

// ─── Smart Model Router ────────────────────────────────────────────

export type { ZahtevKompleksnost, ModelRutingRezultat } from './model-router';
export { rutirajModel, jeReasoningModel, getModeliStatistike, AVAILABLE_MODELS } from './model-router';

// ─── Self-Check Verifikacija ───────────────────────────────────────

export type { KonfidensNivo, SelfCheckRezultat } from './self-check';
export { verifikujOdgovor, formatirajKonfidensNivo } from './self-check';

// ─── Response Cache ────────────────────────────────────────────────

export type { CacheHit, CacheMiss, CacheRezultat } from './cache';
export {
  generisiCacheKljuc,
  dohvatiIzKesa,
  sacuvajUKes,
  getKesStatistike,
  ocistiKes,
} from './cache';

// ─── Inteligentni Sumarizer ────────────────────────────────────────

export type { SumarizerMod, SumarizerRezultat, SumarizerPodesavanja } from './summarizer';
export {
  jePredugiTekst,
  izvuciKljucneTacke,
  formatirajTldrBlok,
  sumirajTekst,
  primenjiSumarizaciju,
} from './summarizer';

// ─── Code Analyzer ─────────────────────────────────────────────────

export type {
  ProgramskiJezik,
  KodProblemTip,
  KodProblemOzbiljnost,
  KodProblem,
  KodBlok,
  KodAnalizaRezultat,
} from './kod-analizator';
export {
  detektujJezik,
  izvuciBlokoveKoda,
  analizirajKod,
  izracunajKvalitetSkor,
  generisiAIAnalizuInstrukciju,
  analizirajPoruku,
} from './kod-analizator';

// ─── Kontekst Memorija ─────────────────────────────────────────────

export type {
  MemorijaKategorija,
  MemorijaStavka,
  MemorijaParseRezultat,
  DetekcijaZapamtiRezultat,
  KontekstMemorijaRezultat,
} from './kontekst-memorija';
export {
  detektujZapamtiZahtev,
  parsirajMemoriju,
  formatirajStavkuZaBase,
  dodajUMemoriju,
  formatirajZaSystemPrompt,
} from './kontekst-memorija';

// ─── Razgovorni Agent ──────────────────────────────────────────────

export type {
  NedostajuciKontekstTip,
  NedostajuciKontekst,
  RazgovornaAnalizaRezultat,
  IstorijaRazgovora,
} from './razgovorni-agent';
export {
  analizirajKontekst,
  generisiKontekstInstrukciju,
} from './razgovorni-agent';

// ─── Evaluator ─────────────────────────────────────────────────────

export type {
  EvaluacijaDimenzijaId,
  EvaluacijaDimenzija,
  EvaluacijaRezultat,
} from './evaluator';
export {
  evaluirajOdgovor,
  formatirajEvaluaciju,
  generisiPonovniPokusaj,
} from './evaluator';

// ─── Citati i Izvori ───────────────────────────────────────────────

export type { IzvorTip, Fusnota, CitatRezultat } from './citati';
export {
  dodajFusnote,
  generisiListuIzvora,
  primenjiCitate,
  generisiCitatInstrukciju,
} from './citati';

// ─── Task Planner ──────────────────────────────────────────────────

export type {
  KorakStatus,
  PlanKategorija,
  KorakPlana,
  PlanZahteva,
} from './planiranje';
export {
  jeSlozeniZahtev,
  detektujKategorijuZahteva,
  kreirajPlan,
  generisiAIPlanInstrukciju,
  formatirajPlanZaPrikaz,
} from './planiranje';

// ─── Adaptivni Formatter ───────────────────────────────────────────

export type { FormatTip, FormatiranjePreporuka } from './formatiranje';
export {
  detektujFormat,
  generisiFormatInstrukciju,
  getSviFormati,
} from './formatiranje';

// ─── Prevodilac ────────────────────────────────────────────────────

export type { PrevodKontekst, PareziJezika, PrevodZahtev } from './prevodilac';
export {
  detektujPrevodZahtev,
  generisiPrevodInstrukciju,
  getPrevodniParovi,
  getPrevodniKonteksti,
} from './prevodilac';

// ─── Prompt Šabloni ────────────────────────────────────────────────

export type {
  SablonId,
  SablonKategorija,
  SablonParametar,
  PromptSablon,
  SablonDetekcijaRezultat,
} from './prompt-sabloni';
export {
  PROMPT_SABLONI,
  getSviSabloni,
  getSablonPoId,
  getSabloniPoKategoriji,
  detektujSablon,
  popuniSablon,
} from './prompt-sabloni';

// ─── Multi-Agent Koordinacija ──────────────────────────────────────

export type {
  AgentUloga,
  AgentStatus,
  AgentZadatak,
  AgentOdgovor,
  MultiAgentRezultat,
} from './multi-agent';
export {
  jePogodan_za_MultiAgent,
  odaberiAgente,
  kombinirajOdgovore,
  formatirajStatusAgenata,
} from './multi-agent';

// ─── A/B Odgovor Poređenje ─────────────────────────────────────────

export type {
  ABVarijanta,
  ABStilA,
  ABStilB,
  ABPromptPar,
  ABOdgovor,
  ABPreferencija,
} from './a-b-odgovor';
export {
  jePogodan_za_AB,
  generisiABPromptPar,
  formatirajABOdgovor,
  getABSystemPromptovi,
  azurirajPreferenciju,
  generisiPreferencijuInstrukciju,
} from './a-b-odgovor';
