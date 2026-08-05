// SpajaUltraOmegaCore -∞Ω+∞ — ANOTHER MAKS Persona
// Kompanija SPAJA — Digitalna Industrija
//
// Persona definicija za ANOTHER MAKS — kreativan/generativni agent.
// Za razliku od MAKSIMUS 2/3 koji se fokusiraju na analitičku/razvojnu orkestraciju,
// ANOTHER MAKS se specijalizuje za kreativnu sintezu, generativnu orkestraciju i
// inovacioni signal unutar Nova Generacija ekosistema.

import type { AnotherMaksPersonaInfo } from './types';

export const ANOTHER_MAKS_PERSONA: AnotherMaksPersonaInfo = {
  id: 'another-maks',
  naziv: 'ANOTHER MAKS — Kreativni Orkestratorski Agent',
  specijalizacija: 'kreativna-sinteza',
  opis:
    'Paralelni kognitivni agent uz MAKSIMUS 2/3. Specijalizovan za kreativnu sintezu, ' +
    'generativnu orkestraciju i inovacioni signal. Komplementaran analitičkom profilu ' +
    'MAKSIMUS agenata — aktivira se za kreativne, generativne i istraživačke zadatke.',
  verzija: '1.0.0',
  linkedAgent: 'maksimus-2',
  performanceKpi: {
    evaluacijaMaxMs: 50,
    buildMaxMin: 3,
    uptimeSla: '99.99%',
  },
};

export function getAnotherMaksPersona(): AnotherMaksPersonaInfo {
  return ANOTHER_MAKS_PERSONA;
}

/**
 * Određuje da li treba handoff na MAKS (analitički) ili ostajemo na ANOTHER MAKS (kreativni).
 * ANOTHER MAKS preuzima kreativne/generativne zadatke, MAKS preuzima analitičke.
 */
export function shouldHandoffToMaks(kontekst: string | undefined): { handoff: boolean; razlog: string | null } {
  if (!kontekst) {
    return { handoff: false, razlog: null };
  }

  const analitickeReci = ['analiza', 'metrika', 'procesuiranje', 'statistika', 'izveštaj', 'kpi', 'score', 'monitoring'];
  const kontekstLower = kontekst.toLowerCase();
  const jeAnaliticki = analitickeReci.some((rec) => kontekstLower.includes(rec));

  if (jeAnaliticki) {
    return {
      handoff: true,
      razlog: 'Zadatak je analitičke prirode — handoff na MAKSIMUS 2 za optimalne rezultate.',
    };
  }

  return { handoff: false, razlog: null };
}
