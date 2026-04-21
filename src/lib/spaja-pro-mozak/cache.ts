// SpajaUltraOmegaCore -∞Ω+∞ — Response Cache
// Kompanija SPAJA — Digitalna Industrija
// In-memory LRU keš za identične upite (smanjuje latenciju i troškove)

// ─── Konfiguracija ────────────────────────────────────────────────────

const MAX_CACHE_VELICINA = 200;      // Maks. broj keširanih unosa
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minuta TTL

// ─── LRU Node ─────────────────────────────────────────────────────────

interface CacheUnos {
  kljuc: string;
  odgovor: string;
  model: string;
  tokeniKorisceni: number;
  kreiran: number; // timestamp
  prev: CacheUnos | null;
  next: CacheUnos | null;
}

// ─── LRU Cache ────────────────────────────────────────────────────────

class LRUCache {
  private mapa: Map<string, CacheUnos> = new Map();
  private head: CacheUnos | null = null; // Najsvežiji
  private tail: CacheUnos | null = null; // Najstariji
  private velicina = 0;
  private maxVelicina: number;

  constructor(maxVelicina: number) {
    this.maxVelicina = maxVelicina;
  }

  private ukloniUnos(unos: CacheUnos): void {
    if (unos.prev) unos.prev.next = unos.next;
    else this.head = unos.next;

    if (unos.next) unos.next.prev = unos.prev;
    else this.tail = unos.prev;

    unos.prev = null;
    unos.next = null;
    this.velicina--;
  }

  private dodajNaPocetak(unos: CacheUnos): void {
    unos.next = this.head;
    unos.prev = null;
    if (this.head) this.head.prev = unos;
    this.head = unos;
    if (!this.tail) this.tail = unos;
    this.velicina++;
  }

  get(kljuc: string): CacheUnos | null {
    const unos = this.mapa.get(kljuc);
    if (!unos) return null;

    // Proveri TTL
    if (Date.now() - unos.kreiran > CACHE_TTL_MS) {
      this.delete(kljuc);
      return null;
    }

    // Pomeri na početak (najsvežiji)
    this.ukloniUnos(unos);
    this.dodajNaPocetak(unos);

    return unos;
  }

  set(kljuc: string, odgovor: string, model: string, tokeniKorisceni: number): void {
    // Ako već postoji, ukloni stari
    if (this.mapa.has(kljuc)) {
      const stari = this.mapa.get(kljuc)!;
      this.ukloniUnos(stari);
      this.mapa.delete(kljuc);
    }

    // Ukloni najstariji ako je pun
    if (this.velicina >= this.maxVelicina && this.tail) {
      this.mapa.delete(this.tail.kljuc);
      this.ukloniUnos(this.tail);
    }

    // Dodaj novi unos
    const novi: CacheUnos = {
      kljuc,
      odgovor,
      model,
      tokeniKorisceni,
      kreiran: Date.now(),
      prev: null,
      next: null,
    };
    this.dodajNaPocetak(novi);
    this.mapa.set(kljuc, novi);
  }

  delete(kljuc: string): void {
    const unos = this.mapa.get(kljuc);
    if (!unos) return;
    this.ukloniUnos(unos);
    this.mapa.delete(kljuc);
  }

  getStatistike(): { velicina: number; maxVelicina: number; ttlSekundi: number } {
    return {
      velicina: this.velicina,
      maxVelicina: this.maxVelicina,
      ttlSekundi: CACHE_TTL_MS / 1000,
    };
  }

  ocisti(): void {
    this.mapa.clear();
    this.head = null;
    this.tail = null;
    this.velicina = 0;
  }
}

// ─── Globalni keš (singleton) ─────────────────────────────────────────

const globalKes = new LRUCache(MAX_CACHE_VELICINA);

// ─── Generisanje ključa ───────────────────────────────────────────────

/**
 * Generiši determinizovani ključ za keš na osnovu upita, modela i sistema.
 * Keš je per-model (isti upit sa različitim modelom = drugačiji ključ).
 * Keš NIJE per-korisnik (jer sistemski prompt je isti za sve).
 */
export function generisiCacheKljuc(
  poruka: string,
  model: string,
  sistemskiPrompt?: string,
): string {
  // Normalizuj poruku: lower, trim, ukloni višestruke razmake
  const normPoruka = poruka.trim().toLowerCase().replace(/\s+/g, ' ');

  // Kratki hash sistemskog prompta (zadnjih 50 karaktera = dovoljno za razlikovanje)
  const sistemHash = sistemskiPrompt
    ? sistemskiPrompt.slice(-50).replace(/\s+/g, '')
    : '';

  // Kombinuj
  return `${model}::${sistemHash}::${normPoruka}`;
}

// ─── Javni API ────────────────────────────────────────────────────────

export interface CacheHit {
  pronadjen: true;
  odgovor: string;
  model: string;
  tokeniKorisceni: number;
  starostMs: number;
}

export interface CacheMiss {
  pronadjen: false;
}

export type CacheRezultat = CacheHit | CacheMiss;

/**
 * Pokušaj dohvatiti keširani odgovor
 */
export function dohvatiIzKesa(kljuc: string): CacheRezultat {
  const unos = globalKes.get(kljuc);
  if (!unos) return { pronadjen: false };

  return {
    pronadjen: true,
    odgovor: unos.odgovor,
    model: unos.model,
    tokeniKorisceni: unos.tokeniKorisceni,
    starostMs: Date.now() - unos.kreiran,
  };
}

/**
 * Sačuvaj odgovor u keš
 */
export function sacuvajUKes(
  kljuc: string,
  odgovor: string,
  model: string,
  tokeniKorisceni: number,
): void {
  // Keširaj samo kratke/srednje odgovore (dugi odgovori su kontekstualni)
  if (odgovor.length > 10000) return;

  globalKes.set(kljuc, odgovor, model, tokeniKorisceni);
}

/**
 * Statistike keša
 */
export function getKesStatistike() {
  return globalKes.getStatistike();
}

/**
 * Obriši sve iz keša (za testiranje ili reset)
 */
export function ocistiKes(): void {
  globalKes.ocisti();
}
