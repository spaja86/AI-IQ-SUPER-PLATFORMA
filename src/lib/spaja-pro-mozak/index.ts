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
