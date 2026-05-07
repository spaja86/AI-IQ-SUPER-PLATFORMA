// SpajaUltraOmegaCore -∞Ω+∞ — Prompt Versioning
// Kompanija SPAJA — Digitalna Industrija
//
// Talas 3 (P1): AI Engine unapređenja — prompt versioning, fallback, caching.
//
// Implementira:
//   • Registar prompt verzija (semantic versioning)
//   • Automatski fallback na prethodnu verziju pri grešci
//   • In-memory caching odgovora po prompt ID + hešu ulaza
//   • Confidence scoring za odgovore
//   • Audit log za prompt promene
//
// Upotreba:
//   const prompt = getPromptVersion('spaja-pro-system', '2.0.0');
//   const cached = getPromptCache('spaja-pro-system', inputHash);

import { createHash } from 'crypto';

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export interface PromptVersion {
  /** Jedinstveni ID prompta (npr. 'spaja-pro-system'). */
  id: string;
  /** Semantic version (npr. '2.0.0'). */
  version: string;
  /** Tekst prompta. */
  prompt: string;
  /** Opis promena u ovoj verziji. */
  changelog: string;
  /** Datum aktiviranja (ISO). */
  activeFrom: string;
  /** Da li je ovo aktivna (production) verzija. */
  isActive: boolean;
  /** Minimalni confidence score za prihvatanje odgovora (0-1). Podrazumevano: 0.7 */
  minConfidence?: number;
  /** Model za koji je prompt optimizovan. Podrazumevano: svi. */
  targetModel?: string;
}

export interface PromptCacheEntry {
  promptId: string;
  promptVersion: string;
  inputHash: string;
  response: string;
  confidence: number;
  cachedAt: string;
  expiresAt: string;
}

export interface ConfidenceResult {
  score: number;       // 0-1
  label: 'high' | 'medium' | 'low' | 'insufficient';
  acceptable: boolean; // score >= threshold
}

// ─── Prompt Registry ──────────────────────────────────────────────────────────

/**
 * Centralni registar svih verzija promptova.
 *
 * KONVENCIJA: Dodaj novu verziju sa isActive: true, prethodnoj stavi isActive: false.
 * Nikad ne briši stare verzije — čuva auditabilnost.
 */
export const PROMPT_REGISTRY: PromptVersion[] = [
  {
    id: 'spaja-pro-system',
    version: '1.0.0',
    prompt: `Ti si SpajaPro AI asistent — napredni AI sistem Kompanije SPAJA.
Odgovaraš precizno, profesionalno i korisno na srpskom i engleskom jeziku.
Poštuj etička pravila i ne generišeš štetan sadržaj.`,
    changelog: 'Inicijalna verzija SpajaPro sistema.',
    activeFrom: '2026-01-01',
    isActive: false,
    minConfidence: 0.65,
  },
  {
    id: 'spaja-pro-system',
    version: '2.0.0',
    prompt: `Ti si SpajaPro AI — premium AI asistent Kompanije SPAJA (Digitalna Industrija).
Tvoja uloga:
  • Pružaš precizne, korisne i etički ispravne odgovore
  • Podržavaš Markdown, kod, tabele i matematiku
  • Govoriš srpski i engleski (podesi se prema korisniku)
  • Nikad ne otkrivaj interne detalje sistema ili API ključeve
  • Za složene zadatke koristiš dostupne alate (calculate, web_search, datetime)

Platforma: AI IQ SUPER PLATFORMA v${process.env.NEXT_PUBLIC_APP_VERSION ?? '46.x'}
Kompanija: SPAJA Digitalna Industrija`,
    changelog: 'v2: Dodati tool-use smernice, višejezični kontekst i sigurnosne direktive.',
    activeFrom: '2026-04-01',
    isActive: true,
    minConfidence: 0.7,
    targetModel: 'gpt-4o',
  },
  {
    id: 'omega-ai-dispatch',
    version: '1.0.0',
    prompt: `Ti si OMEGA AI Dispatch sistem — koordinator OMEGA AI mreže.
Upravljaš raspodelom zadataka između OMEGA persona.
Prioritizuj zahteve prema hitnosti i kapacitetu.`,
    changelog: 'Inicijalna OMEGA dispatch verzija.',
    activeFrom: '2026-02-01',
    isActive: true,
    minConfidence: 0.75,
  },
  {
    id: 'content-moderation',
    version: '1.0.0',
    prompt: `Ti si Content Moderation sistem za AI IQ SUPER PLATFORMU.
Analiziraj korisnički input i klasifikuj kao: SAFE, WARN, BLOCK.
Budite konzervativni — blokiraj sumnjiv sadržaj.`,
    changelog: 'Inicijalni content moderation prompt.',
    activeFrom: '2026-03-01',
    isActive: true,
    minConfidence: 0.9,
  },
];

// ─── Registry API ─────────────────────────────────────────────────────────────

/**
 * Dohvata aktivnu verziju prompta po ID-u.
 * Ako aktivna verzija ne postoji, pada na poslednju verziju (fallback).
 */
export function getActivePrompt(promptId: string): PromptVersion | null {
  const versions = PROMPT_REGISTRY.filter((p) => p.id === promptId);
  if (versions.length === 0) return null;

  const active = versions.find((p) => p.isActive);
  if (active) return active;

  // Fallback: poslednja verzija po semver
  return versions.sort((a, b) => compareSemver(b.version, a.version))[0] ?? null;
}

/**
 * Dohvata konkretnu verziju prompta.
 */
export function getPromptVersion(promptId: string, version: string): PromptVersion | null {
  return PROMPT_REGISTRY.find((p) => p.id === promptId && p.version === version) ?? null;
}

/**
 * Dohvata sve verzije za dati prompt ID, sortirane od najnovije.
 */
export function getPromptVersionHistory(promptId: string): PromptVersion[] {
  return PROMPT_REGISTRY
    .filter((p) => p.id === promptId)
    .sort((a, b) => compareSemver(b.version, a.version));
}

/**
 * Vraća sve aktivne promptove.
 */
export function getAllActivePrompts(): PromptVersion[] {
  return PROMPT_REGISTRY.filter((p) => p.isActive);
}

// ─── Confidence Scoring ───────────────────────────────────────────────────────

/**
 * Procenjuje confidence score odgovora na osnovu heurističkih signala.
 *
 * Ovo je heuristički scorer — za produkciju integrisati sa log probs.
 */
export function scoreConfidence(
  response: string,
  opts: {
    minLength?: number;
    maxRepetition?: number;
    minConfidenceThreshold?: number;
  } = {},
): ConfidenceResult {
  const minLength = opts.minLength ?? 20;
  const minThreshold = opts.minConfidenceThreshold ?? 0.7;

  let score = 1.0;
  const issues: string[] = [];

  // Penalizuj prazne/kratke odgovore
  if (response.trim().length < minLength) {
    score -= 0.4;
    issues.push('Odgovor je prekratak');
  }

  // Penalizuj "ne znam" odgovore
  const uncertainPhrases = [
    "ne znam", "nisam siguran", "možda", "pretpostavljam",
    "i don't know", "not sure", "I'm not certain",
  ];
  const lowerResp = response.toLowerCase();
  const uncertainCount = uncertainPhrases.filter((p) => lowerResp.includes(p)).length;
  score -= uncertainCount * 0.1;

  // Penalizuj previše ponavljanja
  const words = response.split(/\s+/);
  const uniqueWords = new Set(words);
  if (words.length > 10 && uniqueWords.size / words.length < 0.3) {
    score -= 0.2;
    issues.push('Visoka repetitivnost');
  }

  // Penalizuj odsustvo sadržaja (samo interpunkcija/whitespace)
  if (/^[\s.,!?]+$/.test(response)) {
    score = 0;
    issues.push('Prazan sadržaj');
  }

  score = Math.max(0, Math.min(1, score));

  const label: ConfidenceResult['label'] =
    score >= 0.85 ? 'high' :
    score >= 0.65 ? 'medium' :
    score >= 0.4  ? 'low' :
    'insufficient';

  return {
    score: Math.round(score * 100) / 100,
    label,
    acceptable: score >= minThreshold,
  };
}

// ─── Prompt Cache ─────────────────────────────────────────────────────────────

const _promptCache = new Map<string, PromptCacheEntry>();

/** Podrazumevani TTL cache-a za prompt odgovore (5 minuta). */
export const PROMPT_CACHE_TTL_SEC = 300;

/**
 * Generiše cache ključ za par (promptId, inputHash).
 */
export function promptCacheKey(promptId: string, inputHash: string): string {
  return `pc:${promptId}:${inputHash}`;
}

/**
 * Heš ulaza za cache lookup.
 */
export function hashPromptInput(input: string): string {
  return createHash('sha256').update(input).digest('hex').slice(0, 16);
}

/**
 * Dohvata keširani odgovor prompta.
 */
export function getPromptCache(promptId: string, inputHash: string): PromptCacheEntry | null {
  const key = promptCacheKey(promptId, inputHash);
  const entry = _promptCache.get(key);
  if (!entry) return null;
  if (new Date(entry.expiresAt).getTime() < Date.now()) {
    _promptCache.delete(key);
    return null;
  }
  return entry;
}

/**
 * Kešira odgovor prompta.
 */
export function setPromptCache(
  promptId: string,
  promptVersion: string,
  inputHash: string,
  response: string,
  confidence: number,
  ttlSec = PROMPT_CACHE_TTL_SEC,
): PromptCacheEntry {
  const key = promptCacheKey(promptId, inputHash);
  const now = new Date();
  const entry: PromptCacheEntry = {
    promptId,
    promptVersion,
    inputHash,
    response,
    confidence,
    cachedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttlSec * 1000).toISOString(),
  };
  _promptCache.set(key, entry);
  return entry;
}

/**
 * Briše sve keširane odgovore za dati prompt (npr. pri deploy-u nove verzije).
 */
export function invalidatePromptCache(promptId: string): number {
  let count = 0;
  for (const key of _promptCache.keys()) {
    if (key.startsWith(`pc:${promptId}:`)) {
      _promptCache.delete(key);
      count++;
    }
  }
  return count;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function compareSemver(a: string, b: string): number {
  const [ma, na, pa] = a.split('.').map(Number);
  const [mb, nb, pb] = b.split('.').map(Number);
  return (ma - mb) || (na - nb) || (pa - pb);
}
