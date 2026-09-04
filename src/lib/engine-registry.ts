/**
 * 🗂️ Engine Registry — Centralni Auto-Discovery Hub
 *
 * Centralni registry koji automatski prikuplja sve engine-e sa cele platforme.
 * Svaki engine modul poziva registerEngine() pri importu i automatski
 * se pojavljuje u Glavnom Endžinu bez ijedne ručne izmene spojiSveEndzine().
 *
 * Princip:
 *  1. Svaki engine wrapper fajl poziva registerEngine() na nivou modula
 *  2. engine-registry-all.ts uvozi sve wrappere (jedini fajl koji se menja)
 *  3. glavni-endzin poziva getAllEngines() umesto hard-coded liste
 *
 * Autofinish #331+
 */

import type { EngineTip } from './spaja-generator-engine';

// ─── Tipovi ────────────────────────────────────────────────────────────────

export type EngineRegistryStatus =
  | 'aktivan'
  | 'beta'
  | 'razvoj'
  | 'planiran'
  | 'odrzavanje'
  | 'deprecated';

export interface EngineRegistryEntry {
  /** Jedinstven ID engine-a (kebab-case) */
  id: string;
  /** Naziv koji se prikazuje u UI */
  naziv: string;
  /** Kratki opis šta engine radi */
  opis: string;
  /** Ikona (emoji) */
  ikona: string;
  /** Tip engine-a — mapirano na EngineTip iz spaja-generator-engine */
  tip: EngineTip;
  /** Trenutni operativni status */
  status: EngineRegistryStatus;
  /** Verzija engine-a */
  verzija: string;
  /** Procenat optimizacije (0–100) */
  optimizacija: number;
  /** Izvor / modul koji wrappuje */
  izvor: string;
  /** Lista izvornih lib fajlova koji su wrapovani */
  izvoriFajlovi: string[];
  /** Timestamp registracije (ISO 8601) */
  registrovanDatum: string;
  /** Opcioni tagovi za pretragu i filtriranje */
  tagovi?: string[];
}

// ─── Registry Store ────────────────────────────────────────────────────────

const _registry = new Map<string, EngineRegistryEntry>();

/**
 * Registruj engine u centralni registry.
 * Pozivati na nivou modula iz svakog wrapper fajla.
 * Ako engine sa istim ID-em već postoji, biće ažuriran.
 */
export function registerEngine(entry: EngineRegistryEntry): void {
  _registry.set(entry.id, {
    ...entry,
    registrovanDatum: entry.registrovanDatum || new Date().toISOString(),
  });
}

/**
 * Dohvati sve registrovane engine-e kao niz.
 * Sortiranje: po tipu, zatim po nazivu.
 */
export function getAllEngines(): EngineRegistryEntry[] {
  return Array.from(_registry.values()).sort((a, b) => {
    if (a.tip !== b.tip) return a.tip.localeCompare(b.tip);
    return a.naziv.localeCompare(b.naziv);
  });
}

/**
 * Dohvati engine-e po tipu.
 */
export function getEnginesByTip(tip: EngineTip): EngineRegistryEntry[] {
  return Array.from(_registry.values()).filter((e) => e.tip === tip);
}

/**
 * Dohvati engine-e po statusu.
 */
export function getEnginesByStatus(status: EngineRegistryStatus): EngineRegistryEntry[] {
  return Array.from(_registry.values()).filter((e) => e.status === status);
}

/**
 * Dohvati engine po ID-u.
 */
export function getEngineById(id: string): EngineRegistryEntry | undefined {
  return _registry.get(id);
}

/**
 * Broj registrovanih engine-a.
 */
export function getRegistryCount(): number {
  return _registry.size;
}

/**
 * Dohvati statistiku registra.
 */
export function getRegistryStatistika() {
  const sve = getAllEngines();
  const aktivnih = sve.filter((e) => e.status === 'aktivan').length;
  const prosekOptimizacija = sve.length > 0
    ? Math.round(sve.reduce((a, e) => a + e.optimizacija, 0) / sve.length)
    : 0;

  const poTipu: Partial<Record<EngineTip, number>> = {};
  for (const e of sve) {
    poTipu[e.tip] = (poTipu[e.tip] ?? 0) + 1;
  }

  return {
    ukupno: sve.length,
    aktivnih,
    prosekOptimizacija,
    poTipu,
  };
}

/**
 * Pretvori EngineRegistryEntry u SpojeniEndzin format koji koristi Glavni Endžin.
 * Ovo osigurava kompatibilnost sa postojećim interfejsom.
 */
export function toSpojeniEndzinFormat(entry: EngineRegistryEntry) {
  return {
    id: entry.id,
    naziv: entry.naziv,
    tip: entry.tip,
    optimizacija: entry.optimizacija,
    status: entry.status,
    izvor: entry.izvor,
  };
}
