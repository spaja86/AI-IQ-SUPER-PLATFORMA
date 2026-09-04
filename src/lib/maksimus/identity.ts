// SpajaUltraOmegaCore -∞Ω+∞ — MAKSIMUS Identity / Persona
// Kompanija SPAJA — Digitalna Industrija
//
// Persona definicija za MAKSIMUS — analitički/razvojni agent.
// Komplementaran ANOTHER MAKS-u (kreativni agent) — MAKSIMUS preuzima
// analitičke, sistemske i razvojne zadatke unutar Nova Generacija ekosistema.

import type { MaksimусPersonaInfo } from './types';

export const MAKSIMUS_PERSONA: MaksimусPersonaInfo = {
  id: 'maksimus',
  naziv: 'MAKSIMUS — Analitički/Razvojni Apex Agent',
  specijalizacija: 'analiticka-orkestracija',
  opis:
    'Apex analitički/razvojni agent platforme AI-IQ-SUPER-PLATFORMA. ' +
    'Specijalizovan za analitičku orkestraciju, razvojnu strategiju i cross-agent koordinaciju. ' +
    'Komplementaran ANOTHER MAKS kreativnom agentu — aktivira se za sistemske, ' +
    'analitičke i strategijske zadatke. Hipermreza node 128, octave 13.',
  verzija: '1.0.0',
  linkedAgent: 'another-maks',
  octave: 13,
  hipermrezaNode: 128,
  performanceKpi: {
    evaluacijaMaxMs: 50,
    buildMaxMin: 3,
    uptimeSla: '99.99%',
  },
};

export function getMaksimусPersona(): MaksimусPersonaInfo {
  return MAKSIMUS_PERSONA;
}

/**
 * Određuje da li treba handoff na ANOTHER MAKS (kreativni) ili ostajemo na MAKSIMUS (analitički).
 * MAKSIMUS preuzima analitičke/sistemske zadatke, ANOTHER MAKS preuzima kreativne.
 */
export function shouldHandoffToAnotherMaks(kontekst: string | undefined): {
  handoff: boolean;
  razlog: string | null;
} {
  if (!kontekst) {
    return { handoff: false, razlog: null };
  }

  const kreativneReci = [
    'kreativ',
    'generativ',
    'inovacij',
    'idej',
    'kampanj',
    'dizajn',
    'brainstorm',
    'sinteza',
  ];
  const kontekstLower = kontekst.toLowerCase();
  const jeKreativni = kreativneReci.some((rec) => kontekstLower.includes(rec));

  if (jeKreativni) {
    return {
      handoff: true,
      razlog: 'Zadatak je kreativne prirode — handoff na ANOTHER MAKS za optimalne rezultate.',
    };
  }

  return { handoff: false, razlog: null };
}
