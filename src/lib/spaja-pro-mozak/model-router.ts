// SpajaUltraOmegaCore -∞Ω+∞ — Smart Model Router
// Kompanija SPAJA — Digitalna Industrija
// Automatski odabir optimalnog AI modela na osnovu upita i korisničkog plana

import type { ModelId, PlanTip } from '@/lib/supabase/types';
import { AVAILABLE_MODELS, getModelsForPlan } from '@/lib/openai/client';

// ─── Tipovi ──────────────────────────────────────────────────────────

export type ZahtevKompleksnost = 'brzi' | 'srednji' | 'duboki' | 'rezonovanje';

export interface ModelRutingRezultat {
  model: ModelId;
  kompleksnost: ZahtevKompleksnost;
  razlog: string;
  alternativa?: ModelId;
  tokenBudzet: number;
  temperatura: number;
}

// ─── Signali kompleksnosti ────────────────────────────────────────────

// Ključne reči koje ukazuju na zahtev za dubokim razmišljanjem
const DUBOKI_KLJUCNE_RECI = [
  'analiziraj', 'analiza', 'analyze',
  'objasni detaljno', 'explain in detail',
  'napiši izveštaj', 'write report',
  'složen', 'complex', 'kompleksno',
  'arhitektura', 'architecture',
  'optimizuj', 'optimize',
  'debuguj', 'debug', 'ispravi grešku',
  'refaktoriši', 'refactor',
  'dizajn sistema', 'system design',
  'poslovni plan', 'business plan',
  'strategija', 'strategy',
  'dugoročno', 'long-term',
  'sveobuhvatno', 'comprehensive',
];

// Ključne reči za rezonovanje i matematiku
const REZONOVANJE_KLJUCNE_RECI = [
  'dokaži', 'prove', 'proof',
  'matematički', 'mathematical', 'matematika',
  'algoritam', 'algorithm',
  'logika', 'logic', 'logički',
  'jednadžba', 'equation', 'jednačina',
  'izvedeni', 'derivation', 'derivat',
  'integral', 'diferencijalna',
  'np-hard', 'np-complete',
  'korak po korak', 'step by step',
  'rezonovanje', 'reasoning',
  'zaključi', 'conclude', 'dedukuj',
];

// Ključne reči za brze odgovore
const BRZI_KLJUCNE_RECI = [
  'šta je', 'what is', 'što je',
  'kako se kaže', 'how do you say',
  'prevedi', 'translate',
  'kratak', 'brief', 'kratko',
  'brzo', 'quick', 'quickly',
  'datum', 'date', 'vreme', 'time',
  'definicija', 'definition',
  'hvala', 'thank', 'ok', 'ок',
  'zdravo', 'hello', 'hi',
  'lista', 'list',
];

// ─── Analiza upita ────────────────────────────────────────────────────

function analizirajKompleksnost(poruka: string): ZahtevKompleksnost {
  const pSmall = poruka.toLowerCase();

  // Proveri rezonovanje (matematika, logika, dokazi)
  const rezonovanjeScore = REZONOVANJE_KLJUCNE_RECI.filter(
    (kw) => pSmall.includes(kw),
  ).length;

  // Proveri duboke zahteve
  const dubokiScore = DUBOKI_KLJUCNE_RECI.filter(
    (kw) => pSmall.includes(kw),
  ).length;

  // Proveri brze zahteve
  const brziScore = BRZI_KLJUCNE_RECI.filter(
    (kw) => pSmall.includes(kw),
  ).length;

  // Dužina poruke kao signal
  const duzina = poruka.trim().length;
  const duzinaSkor = duzina > 800 ? 3 : duzina > 400 ? 2 : duzina > 100 ? 1 : 0;

  // Prisustvo koda ili tehničkih blokova
  const imaKod = /```|`[^`]+`|def |function |class |import |from |SELECT |INSERT |UPDATE/.test(poruka);

  if (rezonovanjeScore >= 2) return 'rezonovanje';
  if (dubokiScore >= 2 || (dubokiScore >= 1 && duzinaSkor >= 2) || (imaKod && duzinaSkor >= 2)) return 'duboki';
  if (brziScore >= 2 && duzinaSkor <= 1) return 'brzi';
  if (duzinaSkor >= 3 || dubokiScore >= 1 || imaKod) return 'srednji';
  return 'brzi';
}

function odrediTokenBudzet(kompleksnost: ZahtevKompleksnost): number {
  switch (kompleksnost) {
    case 'brzi': return 1024;
    case 'srednji': return 2048;
    case 'duboki': return 4096;
    case 'rezonovanje': return 4096;
    default: return 2048;
  }
}

function odrediTemperaturu(kompleksnost: ZahtevKompleksnost): number {
  switch (kompleksnost) {
    case 'brzi': return 0.7;
    case 'srednji': return 0.7;
    case 'duboki': return 0.5; // Manje kreativno, više precizno
    case 'rezonovanje': return 0.1; // Deterministički
    default: return 0.7;
  }
}

// ─── Rutiranje ────────────────────────────────────────────────────────

const PREFEROVANI_MODEL_PO_KOMPLEKSNOSTI: Record<ZahtevKompleksnost, ModelId> = {
  brzi: 'gpt-4o-mini',
  srednji: 'gpt-4o-mini',
  duboki: 'gpt-4o',
  rezonovanje: 'o3-mini',
};

const ALTERNATIVA_PO_KOMPLEKSNOSTI: Partial<Record<ZahtevKompleksnost, ModelId>> = {
  duboki: 'gpt-4o-mini',
  rezonovanje: 'o1-mini',
};

/**
 * Odaberi optimalni model za dati upit i korisnikov plan.
 * Uzima u obzir kompleksnost upita i dostupne modele po planu.
 */
export function rutirajModel(
  poruka: string,
  plan: PlanTip,
  korisnikovPreferredModel?: ModelId | null,
  requestedModel?: ModelId | null,
): ModelRutingRezultat {
  const kompleksnost = analizirajKompleksnost(poruka);
  const tokenBudzet = odrediTokenBudzet(kompleksnost);
  const temperatura = odrediTemperaturu(kompleksnost);

  // Dostupni modeli za ovaj plan
  const dostupniModeli = getModelsForPlan(plan).map((m) => m.id);

  // Ako je korisnik eksplicitno tražio model i dostupan je, poštuj to
  if (requestedModel && dostupniModeli.includes(requestedModel)) {
    return {
      model: requestedModel,
      kompleksnost,
      razlog: 'Korisnik eksplicitno odabrao model.',
      tokenBudzet,
      temperatura,
    };
  }

  // Ako korisnik ima preferred model, počni od njega
  if (korisnikovPreferredModel && dostupniModeli.includes(korisnikovPreferredModel)) {
    // Ali za rezonovanje, ako preferred nije reasoning model, preporuči reasoning
    if (kompleksnost === 'rezonovanje' && !korisnikovPreferredModel.startsWith('o')) {
      const preferovanReasoning = PREFEROVANI_MODEL_PO_KOMPLEKSNOSTI['rezonovanje'];
      if (dostupniModeli.includes(preferovanReasoning)) {
        return {
          model: preferovanReasoning,
          kompleksnost,
          razlog: 'Upit zahteva rezonovanje — odabran reasoning model umesto preferred-a.',
          alternativa: korisnikovPreferredModel,
          tokenBudzet,
          temperatura,
        };
      }
    }
    return {
      model: korisnikovPreferredModel,
      kompleksnost,
      razlog: `Korišćen preferred model korisnika (${kompleksnost} zahtev).`,
      tokenBudzet,
      temperatura,
    };
  }

  // Odaberi model na osnovu kompleksnosti
  let odabraniModel = PREFEROVANI_MODEL_PO_KOMPLEKSNOSTI[kompleksnost];

  // Ako odabrani model nije dostupan za ovaj plan, spusti se na dostupni
  if (!dostupniModeli.includes(odabraniModel)) {
    // Nađi najbolji dostupni model
    const modeli = getModelsForPlan(plan);
    // Sortiraj po ceni (skuplje = bolje) i uzmi najskuplji
    modeli.sort((a, b) => b.cenaPo1kInput - a.cenaPo1kInput);
    odabraniModel = modeli[0]?.id ?? 'gpt-4o-mini';
  }

  const alternativa = ALTERNATIVA_PO_KOMPLEKSNOSTI[kompleksnost];
  const dostupnaAlternativa = alternativa && dostupniModeli.includes(alternativa)
    ? alternativa
    : undefined;

  const razlogPoruke: Record<ZahtevKompleksnost, string> = {
    brzi: 'Kratak/jednostavan upit — ekonomičan model za brz odgovor.',
    srednji: 'Srednje složen upit — balans brzine i kvaliteta.',
    duboki: 'Složen upit — napredni model za duboku analizu.',
    rezonovanje: 'Upit zahteva logičko rezonovanje — reasoning model.',
  };

  return {
    model: odabraniModel,
    kompleksnost,
    razlog: razlogPoruke[kompleksnost],
    alternativa: dostupnaAlternativa,
    tokenBudzet,
    temperatura,
  };
}

/**
 * Da li je model reasoning model (ne podržava streaming ni system poruke)
 */
export function jeReasoningModel(model: ModelId): boolean {
  return model.startsWith('o1') || model.startsWith('o3');
}

/**
 * Statistike o dostupnim modelima za plan
 */
export function getModeliStatistike(plan: PlanTip): {
  ukupno: number;
  brzi: string;
  duboki: string;
  reasoning: string;
} {
  const modeli = getModelsForPlan(plan);
  const brzi = modeli.find((m) => m.id === 'gpt-4o-mini')?.naziv ?? 'N/A';
  const duboki = modeli.find((m) => ['gpt-4o', 'gpt-4-turbo'].includes(m.id))?.naziv ?? 'N/A';
  const reasoning = modeli.find((m) => m.id.startsWith('o'))?.naziv ?? 'N/A';
  return { ukupno: modeli.length, brzi, duboki, reasoning };
}

// Re-export AVAILABLE_MODELS for convenience
export { AVAILABLE_MODELS };
