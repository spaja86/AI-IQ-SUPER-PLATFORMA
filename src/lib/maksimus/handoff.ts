// SpajaUltraOmegaCore -∞Ω+∞ — MAKSIMUS Handoff
// Kompanija SPAJA — Digitalna Industrija
//
// Handoff logika: MAKSIMUS ↔ ANOTHER MAKS i ostali linked agenti.

import type { MaksimусHandoffRequest, MaksimусHandoffResult } from './types';

const SUPPORTED_TARGETS = ['another-maks', 'nova-generacija-agent', 'persona-bank-agent'] as const;

/**
 * Inicira handoff ka linkedAgent-u.
 * MAKSIMUS može predati kontrolu ANOTHER MAKS-u za kreativne zadatke,
 * nova-generacija-agent-u za feature flag operacije,
 * i persona-bank-agent-u za persona operacije.
 */
export async function initiateMaksimусHandoff(
  request: MaksimусHandoffRequest,
): Promise<MaksimусHandoffResult> {
  const handoffId = `maksimus-handoff-${Date.now()}`;
  const timestamp = new Date().toISOString();

  const isSupported = SUPPORTED_TARGETS.includes(
    request.targetAgent as (typeof SUPPORTED_TARGETS)[number],
  );

  if (!isSupported) {
    return {
      handoffId,
      accepted: false,
      targetAgent: request.targetAgent,
      razlog: `Nepoznati target agent: ${request.targetAgent}. Dozvoljeni: ${SUPPORTED_TARGETS.join(', ')}`,
      timestamp,
    };
  }

  return {
    handoffId,
    accepted: true,
    targetAgent: request.targetAgent,
    razlog: `Handoff prihvaćen. MAKSIMUS predaje kontrolu ka ${request.targetAgent} (prioritet: ${request.prioritet}).`,
    timestamp,
  };
}

export { SUPPORTED_TARGETS as MAKSIMUS_HANDOFF_TARGETS };
