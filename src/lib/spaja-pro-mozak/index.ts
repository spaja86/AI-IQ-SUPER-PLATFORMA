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
