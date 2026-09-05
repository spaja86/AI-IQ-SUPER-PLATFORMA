import type { ExtrimliExtrondolGovernanceEvidence, ExtrimliExtrondolReport } from '../extrimli-extrondol';
import type { ExtrimliAggregateSignals } from '../extrimli';
import type { AiIqWorldBankRezultat } from '../ai-iq-world-bank';
import type { Persona, PersonaRegistrationInput } from '../persona-bank';

export type ExtrimliWorldBankPersonaMode = 'preview' | 'apply';
export type ExtrimliWorldBankPersonaLifecycle = 'ACTIVE' | 'DORMANT' | 'HOLD';

export interface ExtrimliWorldBankPersonaOptions {
  mode?: ExtrimliWorldBankPersonaMode;
  agentId?: string;
  includeSubflows?: boolean;
  evidence?: ExtrimliExtrondolGovernanceEvidence;
}

export interface ExtrimliWorldBankPersonaSubflow {
  id: 'risk' | 'performance';
  score: number;
  status: 'stable' | 'watch' | 'critical';
  rationale: string;
}

export interface ExtrimliWorldBankPersonaReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  sourceOfTruth: '/api/extrimli/world-bank-persona';
  mode: ExtrimliWorldBankPersonaMode;
  ownership: string;
  triggerLabel: 'extrimli:logic-change';
  linkedRepo: 'spaja86/IO-OPENUI-AO';
  sourceContracts: {
    worldBank: '/api/ai-iq-world-bank';
    extrimli: '/api/extrimli/health';
    extrondol: '/api/extrimli/extrondol';
    personaBank: '/api/persona-bank';
  };
  governanceGate: {
    currentWave: ExtrimliExtrondolReport['rollout']['currentWawe'];
    eligibleNextWave: ExtrimliExtrondolReport['rollout']['eligibleNextWawe'];
    promotionFreeze: boolean;
    requiredEvidence: ReadonlyArray<'onboarding-complete' | 'downstream-sync-complete' | 'audit-trail-complete' | 'human-review-complete'>;
    missingEvidence: string[];
    blocked: boolean;
  };
  mappedSignals: {
    financialContextScore: number;
    extrimliReadinessSignal: number;
    orchestrationReadinessScore: number;
    combinedReadinessScore: number;
    degraded: boolean;
    degradedSources: string[];
  };
  lifecycle: {
    decision: ExtrimliWorldBankPersonaLifecycle;
    targetPersonaStatus: 'active' | 'dormant';
    promotionAllowed: boolean;
    reason: string;
  };
  personaPayload: PersonaRegistrationInput;
  subflows: ExtrimliWorldBankPersonaSubflow[];
  sources: {
    worldBank: AiIqWorldBankRezultat;
    extrimliAggregate: ExtrimliAggregateSignals;
    extrondol: ExtrimliExtrondolReport;
  };
  writeResult: {
    attempted: boolean;
    operation: 'register' | 'update' | 'skipped';
    personaStatusAfter: 'active' | 'dormant' | 'archived' | null;
    auditEntriesAfter: number;
    personaVersionAfter: number;
    appliedBy: string | null;
    persona: Persona | null;
  };
}

export const EXTRIMLI_WORLD_BANK_PERSONA_CONTRACT_VERSION = 'v1-extrimli-world-bank-persona';
export const EXTRIMLI_WORLD_BANK_PERSONA_MODULE_VERSION = '1.0.0';
export const EXTRIMLI_WORLD_BANK_PERSONA_SOURCE_OF_TRUTH = '/api/extrimli/world-bank-persona' as const;
export const EXTRIMLI_WORLD_BANK_PERSONA_AGENT = 'extrimli-world-bank-persona-orchestrator';
