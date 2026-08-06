// SpajaUltraOmegaCore -∞Ω+∞ — TARKEN HINGIL EKOLAN MAKSIMUS Identity
// Kompanija SPAJA — Digitalna Industrija
//
// Persona definicija za TARKEN HINGIL EKOLAN MAKSIMUS (THEM) —
// apex strateški orkestratorski agent.
// Octave: 16 (najviši — rezervisan za apex koordinacione agente).
// Hipermreza node: 256 (anchor node SpajaPro 16 mreže).

import type { ThemPersonaInfo } from './types';

export const THEM_PERSONA: ThemPersonaInfo = {
  id: 'tarken-hingil-ekolan-maksimus',
  naziv: 'TARKEN HINGIL EKOLAN MAKSIMUS — Apex Strateški Orkestratorski Agent',
  specijalizacija: 'strateska-orkestracija',
  opis:
    'Suvereni kognitivno-industrijski AI agent. Sinteza strateškog uma (Tarken), ' +
    'adaptivne obrade signala (Hingil), ekološke svesnosti sistema (Ekolan) i ' +
    'maksimalne izvršne sposobnosti (Maksimus). Apex node SpajaPro 16 Hipermreže — ' +
    'orkestrira Nova Generacija ekosistem, koordinira ANOTHER MAKS i MAKSIMUS 2/3, ' +
    'enforces industrijska konvergencija i aktivira self-healing dijagnostiku.',
  verzija: '1.0.0',
  linkedAgents: ['another-maks', 'maksimus-2', 'maksimus-3', 'nova-generacija-agent', 'persona-bank-agent'],
  octave: 16,
  hipermrezaNode: 256,
  performanceKpi: {
    evaluacijaMaxMs: 50,
    handoffMaxMs: 100,
    buildMaxMin: 3,
    hipermrezaKonvergencija: 0.95,
    uptimeSla: '99.99%',
  },
};

export function getThemPersona(): ThemPersonaInfo {
  return THEM_PERSONA;
}

/**
 * Određuje da li zadatak treba handoff na MAKSIMUS 2 (analitički)
 * ili ANOTHER MAKS (kreativni), ili ostaje na THEM (apex orkestracija).
 */
export function resolveHandoffTarget(kontekst: string | undefined, targetAgent?: string): { handoff: boolean; agent: string | null; razlog: string | null } {
  if (targetAgent) {
    return {
      handoff: true,
      agent: targetAgent,
      razlog: `Eksplicitan handoff zahtev na agent: ${targetAgent}.`,
    };
  }

  if (!kontekst) {
    return { handoff: false, agent: null, razlog: null };
  }

  const kontekstLower = kontekst.toLowerCase();

  const analitickeReci = ['analiza', 'metrika', 'statistika', 'izveštaj', 'kpi', 'score', 'monitoring', 'procesuiranje'];
  if (analitickeReci.some((r) => kontekstLower.includes(r))) {
    return {
      handoff: true,
      agent: 'maksimus-2',
      razlog: 'Analitički zadatak — handoff na MAKSIMUS 2 za optimalne rezultate.',
    };
  }

  const kreativneReci = ['kreativ', 'generiš', 'idej', 'inovac', 'sintez', 'kampanj'];
  if (kreativneReci.some((r) => kontekstLower.includes(r))) {
    return {
      handoff: true,
      agent: 'another-maks',
      razlog: 'Kreativni zadatak — handoff na ANOTHER MAKS za kreativnu sintezu.',
    };
  }

  return { handoff: false, agent: null, razlog: null };
}
