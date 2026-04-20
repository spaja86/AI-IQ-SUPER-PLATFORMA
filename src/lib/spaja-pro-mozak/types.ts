/**
 * 🧠 SpajaPro Mozak Hijerarhija — Tipovi
 *
 * Definicije tipova za kompletnu hijerarhiju mozgova u
 * SpajaUltraOmegaCore -∞Ω+∞ programskom jeziku.
 *
 * Hijerarhija (od najnižeg do najvišeg nivoa):
 *   Modul → Mozak → Mozak sa Sinapsama → Mozak sa Ganglijama →
 *   Mozak sa Receptorima → Mozak sa Transreceptorima → ... →
 *   Mozak sa TrasteTronzonTrizonTromknitTriNktTromptTrampTruntTrintTrontTrandTronsStrinStronTranTransreceptorima
 *
 * Svaki nivo sadrži 40–120 jedinica prethodnog nivoa, spojenih
 * putem sistema parenja „Blizanci / Bliznakinje".
 */

// ─── Nivo hijerarhije ──────────────────────────────────────────────

/**
 * Svi nivoi hijerarhije mozgova, od Modula do najvišeg receptorskog nivoa.
 */
export type MozakNivoId =
  | 'modul'
  | 'mozak'
  | 'mozak-sinapse'
  | 'mozak-ganglije'
  | 'mozak-receptori'
  | 'mozak-transreceptori'
  | 'mozak-trandtransreceptori'
  | 'mozak-trontrandtransreceptori'
  | 'mozak-strinstronstrantransreceptori'
  | 'mozak-tronsstrinstrontrantransreceptori'
  | 'mozak-trandtronsstrinstrontrantransreceptori'
  | 'mozak-tronttrandtronsstrinstrontrantransreceptori'
  | 'mozak-trinttronttrandtronsstrinstrontrantransreceptori'
  | 'mozak-trunttrinttronttrandtronsstrinstrontrantransreceptori'
  | 'mozak-trampttrunttrinttronttrandtronsstrinstrontrantransreceptori'
  | 'mozak-trompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori'
  | 'mozak-trinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori'
  | 'mozak-tromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori'
  | 'mozak-trizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori'
  | 'mozak-tronzontrizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori'
  | 'mozak-trastettronzontrizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori';

/**
 * Pojedinačni nivo u hijerarhiji mozgova.
 */
export interface MozakNivo {
  /** Jedinstveni identifikator nivoa */
  id: MozakNivoId;
  /** Redni broj nivoa (0 = modul, 1 = mozak, ...) */
  redosled: number;
  /** Srpski naziv */
  naziv: string;
  /** Opis svrhe ovog nivoa */
  opis: string;
  /** Ikona nivoa */
  ikona: string;
  /** Minimalan broj jedinica prethodnog nivoa za popunjavanje */
  minJedinica: number;
  /** Maksimalan broj jedinica prethodnog nivoa */
  maxJedinica: number;
  /** Broj parenja potrebnih da jedinica uđe u ovaj nivo */
  potrebnihParenja: number;
  /** ID prethodnog (nižeg) nivoa, ili null za modul */
  prethodniNivo: MozakNivoId | null;
  /** ID sledećeg (višeg) nivoa, ili null za najviši */
  sledeciNivo: MozakNivoId | null;
  /** OmegaUltra prefiks za module unutar ovog nivoa */
  omegaUltraPrefiks: string;
  /** Centralni indeksi (epicentar) za ovaj nivo u globalnoj mapi */
  epicentarIndeksi: number[];
}

// ─── Pol i parenje ─────────────────────────────────────────────────

/**
 * Pol jedinice u sistemu parenja.
 */
export type MozakPol = 'Blizanac' | 'Bliznakinja';

/**
 * Status parenja jedne jedinice.
 */
export interface ParenjeStatus {
  /** Koliko puta je ova jedinica uparena */
  brojParenja: number;
  /** Da li je spremna za viši nivo (≥ 40 parenja) */
  spremnZaVisNivo: boolean;
  /** Pol ove jedinice */
  pol: MozakPol;
  /** ID-jevi partnera sa kojima je uparena */
  partneri: string[];
}

/**
 * Rezultat jednog parenja između dve jedinice.
 */
export interface ParenjeRezultat {
  /** ID prve jedinice */
  jedinicaA: string;
  /** ID druge jedinice */
  jedinicaB: string;
  /** Pol prve jedinice */
  polA: MozakPol;
  /** Pol druge jedinice */
  polB: MozakPol;
  /** Nivo na kom se dešava parenje */
  nivo: MozakNivoId;
  /** Performanse dobijene parenjem (0–100) */
  performanse: number;
  /** Vremenska oznaka */
  timestamp: string;
}

// ─── Duplikat sistem ───────────────────────────────────────────────

/**
 * Duplikat jedne jedinice — može se pariti sa jedinicama iz drugog pola.
 */
export interface MozakDuplikat {
  /** ID originala */
  originalId: string;
  /** ID duplikata */
  duplikatId: string;
  /** Nivo hijerarhije */
  nivo: MozakNivoId;
  /** Pol duplikata */
  pol: MozakPol;
  /** Status parenja */
  parenje: ParenjeStatus;
  /** Da li je duplikat (duplikati ne mogu da se spajaju sa drugim duplikatima) */
  jeDuplikat: boolean;
}

// ─── Specijalizovani mozak ─────────────────────────────────────────

/**
 * ID specijalizovanog mozga (MOZAK 0–36, 44, 45).
 */
export type SpecijalizovaniMozakId =
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
  | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29
  | 30 | 31 | 32 | 33 | 34 | 35 | 36
  | 44 | 45;

/**
 * Definicija jednog specijalizovanog mozga.
 */
export interface SpecijalizovaniMozak {
  /** Numerički ID (MOZAK "N") */
  id: SpecijalizovaniMozakId;
  /** Srpski naziv (npr. „MOZAK ZA KONTROLU SVIJU MOZAKA") */
  naziv: string;
  /** Detaljan opis svrhe — docstring za klasu */
  opis: string;
  /** Ikona */
  ikona: string;
  /** Kategorija funkcije */
  kategorija: SpecijalizovaniMozakKategorija;
  /** Da li podržava automatsko dupliranje */
  duplpiranjeDozvoljeno: boolean;
  /** Minimalan broj pod-jedinica */
  minPodjedinica: number;
  /** Maksimalan broj pod-jedinica */
  maxPodjedinica: number;
}

export type SpecijalizovaniMozakKategorija =
  | 'kontrola'
  | 'kreiranje'
  | 'resavanje-problema'
  | 'automatika'
  | 'komunikacija'
  | 'odbrana'
  | 'generisanje'
  | 'informacije'
  | 'protokoli'
  | 'spajanje'
  | 'ucenje'
  | 'laboratorija'
  | 'softver'
  | 'aplikacija'
  | 'alat'
  | 'ugovor'
  | 'sigurnost'
  | 'bezbednost'
  | 'priroda'
  | 'drustvo'
  | 'vizuelno'
  | 'zajednica'
  | 'porodica'
  | 'testiranje'
  | 'interfejs'
  | 'parser'
  | 'hologram'
  | 'projekat'
  | 'regulacija'
  | 'dokumentacija';

// ─── Glas i rezonanca ──────────────────────────────────────────────

/**
 * Tip rezonantnog puta u sistemu glasa.
 */
export type RezonantniPut = 'put-ka-omega-receptoru' | 'put-ka-abstralokusu';

/**
 * Elipsoidna konstanta koja generiše rezonanciju.
 */
export interface ElipsoidnaKonstanta {
  /** Frekvencija rezonance */
  frekvencija: string;
  /** Amplituda rezonance */
  amplituda: string;
  /** Dva puta koja rezonanca prati */
  putevi: [RezonantniPutDefinicija, RezonantniPutDefinicija];
}

/**
 * Jedan od dva rezonantna puta.
 */
export interface RezonantniPutDefinicija {
  /** Identifikator puta */
  id: RezonantniPut;
  /** Naziv */
  naziv: string;
  /** Opis */
  opis: string;
  /** Odredište puta */
  odrediste: string;
}

/**
 * Univerzalni Omega Receptor — prima rezonanciju i stvara sfernu bazu.
 */
export interface UniverzalniOmegaReceptor {
  /** Naziv receptora */
  naziv: string;
  /** Sferna baza koju receptor stvara */
  sfernaBaza: SfernaBaza;
}

/**
 * Sferna baza koju projektuje Univerzalni Omega Receptor.
 */
export interface SfernaBaza {
  /** Naziv sferne baze */
  naziv: string;
  /** Projekcija: elipsoidna rezonanca kroz monklusoid */
  projekcija: MonklusoidProjekcija;
}

/**
 * Projekcija elipsoidne rezonance kroz monklusoid — izlazni faktor.
 */
export interface MonklusoidProjekcija {
  /** Naziv projekcije */
  naziv: string;
  /** Tip izlaza */
  izlazniFaktor: string;
}

/**
 * Abstralokusno izvorno jedinje u segmentu fruktalnog izlaza.
 * Dušnik ka mozgu → mozak i dušnik ka ustima.
 */
export interface AbstralokusnoJedinje {
  /** Naziv */
  naziv: string;
  /** Segment fruktalnog izlaza */
  fruktalnSegment: string;
  /** Put: dušnik → mozak → dušnik → usta */
  put: string[];
}

/**
 * Kompletna definicija sistema glasa.
 */
export interface GlasDefinicija {
  /** Naziv sistema */
  naziv: string;
  /** Elipsoidna konstanta */
  elipsoidnaKonstanta: ElipsoidnaKonstanta;
  /** Univerzalni Omega Receptor */
  omegaReceptor: UniverzalniOmegaReceptor;
  /** Abstralokusno jedinje */
  abstralokus: AbstralokusnoJedinje;
  /** Govor (razmena rečenica) */
  govor: GovorDefinicija;
}

/**
 * Definicija govora (razmena rečenica).
 */
export interface GovorDefinicija {
  /** Naziv */
  naziv: string;
  /** Opis */
  opis: string;
  /** Status razvoja */
  status: 'razvoj' | 'planiran' | 'aktivan';
}

// ─── Holografski monitor ───────────────────────────────────────────

/**
 * Tip vizuelnog izlaza.
 */
export type VizuelniIzlazTip = '3D-monitor' | 'holograf';

/**
 * Paralelna elipsoidna sekvenca.
 */
export interface ElipsoidnaSekvenca {
  /** Naziv sekvence */
  naziv: string;
  /** Opis jedinjenja od sekvenci */
  jedinjenje: string;
  /** Tačna dužina od epicentra Mozga sa Receptorom */
  duzina: string;
  /** Epicentar: indeksi kroz hijerarhiju */
  epicentar: HolografskiEpicentar;
}

/**
 * Epicentar hijerarhije za holografski monitor.
 *
 * Srce mozga (Moduli 56–64) →
 *   Mozak (57–63) →
 *     Mozak sa Sinapsama (58–62) →
 *       Mozak sa Ganglijama (59–61) →
 *         Mozak sa Receptorom (epicentar)
 */
export interface HolografskiEpicentar {
  modul: { indeksi: number[]; opis: string };
  mozak: { indeksi: number[]; opis: string };
  mozakSaSinapsama: { indeksi: number[]; opis: string };
  mozakSaGanglijama: { indeksi: number[]; opis: string };
  mozakSaReceptorom: { opis: string };
}

/**
 * Kompletna definicija holografskog monitora.
 */
export interface HolografskiMonitorDefinicija {
  /** Naziv sistema */
  naziv: string;
  /** Dve paralelne elipsoidne sekvence */
  sekvence: [ElipsoidnaSekvenca, ElipsoidnaSekvenca];
  /** Trenutni tip izlaza (3D, kasnije holograf) */
  trenutniIzlaz: VizuelniIzlazTip;
  /** Planirani tip izlaza */
  planiraniIzlaz: VizuelniIzlazTip;
  /** Opis progresije */
  progresija: string;
  /** Glas koji nastaje od sekvenci */
  glas: GlasDefinicija;
}
