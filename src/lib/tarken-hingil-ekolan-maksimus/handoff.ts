// SpajaUltraOmegaCore -∞Ω+∞ — TARKEN HINGIL EKOLAN MAKSIMUS — Handoff
// Kompanija SPAJA — Digitalna Industrija
//
// Handoff protocol to MAKSIMUS 2/3 and ANOTHER MAKS.
// Failure recovery: if handoff fails, THEM remains active.

import type { ThemHandoffRequest, ThemHandoffResult } from './types';

const SUPPORTED_AGENTS = ['maksimus-2', 'maksimus-3', 'another-maks'] as const;
type SupportedAgent = (typeof SUPPORTED_AGENTS)[number];

function isSupportedAgent(agent: string): agent is SupportedAgent {
  return (SUPPORTED_AGENTS as readonly string[]).includes(agent);
}

/**
 * Izvršava handoff na linked agent.
 * Vraća status 'initiated' ili 'failed' uz razlog.
 */
export function executeHandoff(request: ThemHandoffRequest): ThemHandoffResult {
  const timestamp = new Date().toISOString();
  const handoffId = `them-handoff-${Date.now()}`;

  if (!isSupportedAgent(request.targetAgent)) {
    return {
      targetAgent: request.targetAgent,
      handoffId,
      status: 'failed',
      razlog: `Nepodržani target agent: ${request.targetAgent}. Dozvoljeni: ${SUPPORTED_AGENTS.join(', ')}.`,
      timestamp,
    };
  }

  if (!request.razlog || request.razlog.trim().length === 0) {
    return {
      targetAgent: request.targetAgent,
      handoffId,
      status: 'failed',
      razlog: 'Handoff zahteva validan razlog (razlog je prazan).',
      timestamp,
    };
  }

  // U produkciji: poziv API-ja linked agenta
  return {
    targetAgent: request.targetAgent,
    handoffId,
    status: 'initiated',
    razlog: request.razlog,
    timestamp,
  };
}

/**
 * Fallback recovery: vraća preporučeni fallback agent na osnovu tipa anomalije.
 */
export function resolveFallbackAgent(anomalijaLog: string[]): string | null {
  const log = anomalijaLog.join(' ').toLowerCase();
  if (log.includes('analitik') || log.includes('metrik') || log.includes('kpi')) {
    return 'maksimus-2';
  }
  if (log.includes('kreatIV') || log.includes('generat')) {
    return 'another-maks';
  }
  // Default fallback
  return 'maksimus-2';
}
