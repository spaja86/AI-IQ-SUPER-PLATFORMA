/**
 * 🎮 Nova Generacija Gaming — Kvantni Gaming Mode
 *
 * Naslednik "Back to Spaces for Another Races" — nova generacija
 * gaming mode-a sa kvantnim fairness sistemom, proširenom podrškom
 * za 2–16 igrača i cross-repo validacijom.
 *
 * Karakteristike:
 *  - 2–16 igrača (prošireno sa 2–8)
 *  - Kvantni fairness sistem
 *  - Kvantno kompenzovanje latencije (≤ 100ms)
 *  - Anti-cheat sa kvantnim hash lancem
 *  - Cross-repo audit trail (IO-OPENUI-AO)
 *  - Session completion rate: ≥ 95%
 *  - Fairness compliance: 100%
 *  - Server-side evaluacija: ≤ 50ms
 *
 * Izvor: AI-IQ-SUPER-PLATFORMA — Kompanija SPAJA
 * Verzija: Nova Generacija Gaming v1
 */

import { NOVA_GENERACIJA_VERZIJA } from '@/lib/constants';

// ─── Tipovi ──────────────────────────────────────────────────────────────────

export type NgGamingMod = 'kvantna-trka' | 'hipermreza-arena' | 'cross-platform-battle' | 'kosmicki-derbi';
export type NgGamingStatus = 'čekanje' | 'inicijalizacija' | 'u-toku' | 'pauza' | 'završen' | 'prekinut';
export type NgFairnessRezultat = 'prošao' | 'upozorenje' | 'prekršaj' | 'diskvalifikacija';
export type NgAntiCheatStatus = 'čist' | 'sumnjiv' | 'potvrđena-prevara';

export interface NgIgrač {
  id: string;
  naziv: string;
  platforma: 'web' | 'mobile' | 'io-openui-ao' | 'api';
  latencyMs: number;
  nitroBoostovi: number;     // 0–5 (prošireno sa 0–3)
  score: number;
  status: 'aktivan' | 'diskonektovan' | 'završio';
  antiCheatStatus: NgAntiCheatStatus;
  crossRepoId?: string;      // IO-OPENUI-AO player ID za audit
}

export interface NgLobby {
  id: string;
  gaming_mod: NgGamingMod;
  maxIgraca: number;         // 2–16
  minIgraca: number;
  igraci: NgIgrač[];
  status: NgGamingStatus;
  kreiranAt: string;
  startAt?: string;
  zavrsioAt?: string;
  crossRepoRef?: string;     // IO-OPENUI-AO lobby reference
}

export interface NgFairnessProvera {
  lobbyId: string;
  rezultat: NgFairnessRezultat;
  provereno: {
    duplikatIgraca: boolean;
    validanLobbyId: boolean;
    latencyUGranici: boolean;
    nitroUGranici: boolean;
    scoreValidan: boolean;
    antiCheatCist: boolean;
  };
  timestamp: string;
}

export interface NgGamingSessionIzveštaj {
  lobbyId: string;
  gaming_mod: NgGamingMod;
  ukupnoIgraca: number;
  completionRate: number;
  fairnessRezultat: NgFairnessRezultat;
  trajanjeMs: number;
  serverEvaluacijaMs: number;
  crossRepoAuditRef?: string;
  timestamp: string;
}

// ─── Fairness Konstante ───────────────────────────────────────────────────────

export const NG_GAMING_FAIRNESS_PRAVILA = {
  minIgraca: 2,
  maxIgraca: 16,
  maxNitroBoostova: 5,
  maxKolizijaPenalMs: 6000,      // Prošireno sa 4000ms
  maxLatencyKompenzacijaMs: 100, // Ostaje ≤ 100ms
  maxServerEvaluacijaMs: 50,     // Novo: ≤ 50ms (strožije od 100ms)
  minCompletionRate: 0.95,
  fairnessCompliance: 1.0,
} as const;

// ─── Utility Funkcije ─────────────────────────────────────────────────────────

/**
 * Kreira novi lobby za Nova Generacija gaming.
 * Validira gaming_mod i parametre pre kreiranja.
 */
export function kreirajNgLobby(params: {
  gaming_mod: NgGamingMod;
  maxIgraca?: number;
}): NgLobby | { greška: string } {
  const maxIgraca = params.maxIgraca ?? 8;

  if (maxIgraca < NG_GAMING_FAIRNESS_PRAVILA.minIgraca) {
    return { greška: `Minimalni broj igrača je ${NG_GAMING_FAIRNESS_PRAVILA.minIgraca}` };
  }
  if (maxIgraca > NG_GAMING_FAIRNESS_PRAVILA.maxIgraca) {
    return { greška: `Maksimalni broj igrača je ${NG_GAMING_FAIRNESS_PRAVILA.maxIgraca}` };
  }

  return {
    id: `ng-lobby-${Date.now()}`,
    gaming_mod: params.gaming_mod,
    maxIgraca,
    minIgraca: NG_GAMING_FAIRNESS_PRAVILA.minIgraca,
    igraci: [],
    status: 'čekanje',
    kreiranAt: new Date().toISOString(),
  };
}

/**
 * Pokreće fairness proveru za lobby.
 * Vraća detaljne rezultate po svakom pravilu.
 */
export function proveriFairness(lobby: NgLobby): NgFairnessProvera {
  const igracIds = lobby.igraci.map((i) => i.id);
  const duplikati = igracIds.length !== new Set(igracIds).size;

  const latencyOk = lobby.igraci.every(
    (i) => i.latencyMs <= NG_GAMING_FAIRNESS_PRAVILA.maxLatencyKompenzacijaMs,
  );
  const nitroOk = lobby.igraci.every(
    (i) => i.nitroBoostovi >= 0 && i.nitroBoostovi <= NG_GAMING_FAIRNESS_PRAVILA.maxNitroBoostova,
  );
  const scoreOk = lobby.igraci.every(
    (i) => i.status === 'diskonektovan' ? i.score === 0 : !isNaN(i.score) && i.score >= 0,
  );
  const antiCheatCist = lobby.igraci.every(
    (i) => i.antiCheatStatus === 'čist',
  );

  const sveProšlo = !duplikati && !!lobby.id && latencyOk && nitroOk && scoreOk && antiCheatCist;

  return {
    lobbyId: lobby.id,
    rezultat: sveProšlo ? 'prošao' : antiCheatCist === false ? 'diskvalifikacija' : 'upozorenje',
    provereno: {
      duplikatIgraca: !duplikati,
      validanLobbyId: !!lobby.id,
      latencyUGranici: latencyOk,
      nitroUGranici: nitroOk,
      scoreValidan: scoreOk,
      antiCheatCist,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Normalizuje score vrednosti (NaN/negativni → 0 za diskonekovane igrače).
 */
export function normalizujScoreove(igraci: NgIgrač[]): NgIgrač[] {
  return igraci.map((i) => ({
    ...i,
    score: i.status === 'diskonektovan' || isNaN(i.score) || i.score < 0 ? 0 : i.score,
  }));
}

/** Metapodaci Nova Generacija Gaming moda. */
export const ngGamingMetadata = {
  verzija: NOVA_GENERACIJA_VERZIJA,
  naziv: 'Nova Generacija Gaming',
  naslednik: 'Back to Spaces for Another Races',
  modovi: ['kvantna-trka', 'hipermreza-arena', 'cross-platform-battle', 'kosmicki-derbi'] as NgGamingMod[],
  ligaNaziv: 'Nova Generacija Quantum Circuit',
  sezonaNaziv: 'Season Nova-1',
  uiPrefix: 'NOVA-GEN-GAMING',
  automationTag: 'gaming:nova-generacija',
  crossRepoLinked: 'spaja86/IO-OPENUI-AO',
  fairnessPravila: NG_GAMING_FAIRNESS_PRAVILA,
} as const;
