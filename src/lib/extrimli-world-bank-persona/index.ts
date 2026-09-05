import { buildAiIqWorldBank } from '../ai-iq-world-bank';
import { EXTRIMLI_PERSONA_ID, getExtrimliAggregateSignals } from '../extrimli';
import { getExtrimliExtrondolReport } from '../extrimli-extrondol';
import { createPersonaBankClient, PERSONA_BANK_CONTRACT_VERSION } from '../persona-bank';
import type { ExtrimliWorldBankPersonaOptions, ExtrimliWorldBankPersonaReport, ExtrimliWorldBankPersonaSubflow } from './types';
import {
  EXTRIMLI_WORLD_BANK_PERSONA_AGENT,
  EXTRIMLI_WORLD_BANK_PERSONA_CONTRACT_VERSION,
  EXTRIMLI_WORLD_BANK_PERSONA_MODULE_VERSION,
  EXTRIMLI_WORLD_BANK_PERSONA_SOURCE_OF_TRUTH,
} from './types';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function buildFinancialContextScore(worldBank: ReturnType<typeof buildAiIqWorldBank>): number {
  const activeAccountsSignal = clamp((worldBank.kpi.aktivnihRacuna / 2_500) * 100, 0, 100);
  const githubBillingSignal = clamp((worldBank.kpi.githubBillingTransakcija / 300) * 100, 0, 100);
  const partnerSignal = clamp((worldBank.kpi.partneraUkupno / 8) * 100, 0, 100);
  const aiSignal = clamp(worldBank.kpi.aiTacnost, 0, 100);
  return round((aiSignal * 0.45) + (activeAccountsSignal * 0.2) + (githubBillingSignal * 0.2) + (partnerSignal * 0.15));
}

function lifecycleFromSignals(params: {
  combinedReadinessScore: number;
  promotionBlocked: boolean;
  degraded: boolean;
  missingEvidence: string[];
}): ExtrimliWorldBankPersonaReport['lifecycle'] {
  if (params.promotionBlocked) {
    return {
      decision: 'HOLD',
      targetPersonaStatus: 'dormant',
      promotionAllowed: false,
      reason: params.missingEvidence.length > 0
        ? `Promotion blocked: missing ${params.missingEvidence.join(', ')}`
        : 'Promotion blocked: rollout freeze is active',
    };
  }

  if (params.degraded || params.combinedReadinessScore < 70) {
    return {
      decision: 'DORMANT',
      targetPersonaStatus: 'dormant',
      promotionAllowed: true,
      reason: params.degraded
        ? 'Conservative dormant posture because degraded sources exist'
        : 'Combined readiness is below active threshold (70)',
    };
  }

  return {
    decision: 'ACTIVE',
    targetPersonaStatus: 'active',
    promotionAllowed: true,
    reason: 'Governance gate passed and readiness score is at or above active threshold',
  };
}

function mapTone(score: number): string {
  if (score >= 85) return 'energetic';
  if (score >= 70) return 'focused';
  return 'conservative';
}

function buildSubflows(riskScore: number, performanceScore: number): ExtrimliWorldBankPersonaSubflow[] {
  return [
    {
      id: 'risk',
      score: round(riskScore),
      status: riskScore >= 75 ? 'stable' : riskScore >= 55 ? 'watch' : 'critical',
      rationale: 'Derived from EXTRIMLI safety signal (100 - risk exposure)',
    },
    {
      id: 'performance',
      score: round(performanceScore),
      status: performanceScore >= 75 ? 'stable' : performanceScore >= 55 ? 'watch' : 'critical',
      rationale: 'Derived from EXTRONDOL orchestration readiness and DUET posture',
    },
  ];
}

export function getExtrimliWorldBankPersonaReport(options: ExtrimliWorldBankPersonaOptions = {}): ExtrimliWorldBankPersonaReport {
  const mode = options.mode ?? 'preview';
  const includeSubflows = options.includeSubflows ?? true;
  const agentId = options.agentId ?? EXTRIMLI_WORLD_BANK_PERSONA_AGENT;

  const worldBank = buildAiIqWorldBank('extrimli-world-bank-persona');
  const extrimliAggregate = getExtrimliAggregateSignals();
  const extrondol = getExtrimliExtrondolReport(options.evidence);

  const financialContextScore = buildFinancialContextScore(worldBank);
  const extrimliReadinessSignal = round(extrimliAggregate.readinessSignal);
  const orchestrationReadinessScore = round(extrondol.orchestrationReadinessScore);
  const combinedReadinessScore = round(
    (financialContextScore * 0.25) + (extrimliReadinessSignal * 0.35) + (orchestrationReadinessScore * 0.4),
  );

  const requiredEvidence = [
    'onboarding-complete',
    'downstream-sync-complete',
    'audit-trail-complete',
    'human-review-complete',
  ] as const;
  const evidenceState = {
    'onboarding-complete': extrondol.b2bReadiness.compliance.onboardingComplete,
    'downstream-sync-complete': extrondol.b2bReadiness.downstreamSync.status === 'ALIGNED',
    'audit-trail-complete': extrondol.b2bReadiness.compliance.auditTrailComplete,
    'human-review-complete': extrondol.b2bReadiness.compliance.humanReviewComplete,
  } as const;
  const missingEvidence = requiredEvidence.filter((key) => !evidenceState[key]);
  const promotionBlocked = extrondol.rollout.promotionFreeze || missingEvidence.length > 0;
  const hasExtrimliDegradation = extrimliAggregate.degradationSignal > 0;
  const degraded = extrondol.degraded || hasExtrimliDegradation;
  const lifecycle = lifecycleFromSignals({
    combinedReadinessScore,
    promotionBlocked,
    degraded,
    missingEvidence,
  });

  const personaPayload = {
    id: EXTRIMLI_PERSONA_ID,
    name: 'EXTRIMLI — Extreme Sports & Adventure Intelligence Persona',
    type: 'extrimli' as const,
    octave: 7,
    hipermrezaNode: 56,
    attributes: {
      traits: ['risk-aware', 'performance-driven', 'bank-contextual', 'governance-gated'],
      skills: [
        'risk-scoring',
        'event-management',
        'gear-catalog',
        'athlete-tracking',
        'world-bank-signal-translation',
        'wawe-governance-gating',
      ],
      tone: mapTone(combinedReadinessScore),
      domain: 'extreme-sports/financial-readiness',
      worldBankSignal: {
        source: '/api/ai-iq-world-bank',
        kpi: worldBank.kpi,
      },
      extrondolSignal: {
        source: '/api/extrimli/extrondol',
        wawe: extrondol.rollout.currentWawe,
        eligibleNextWawe: extrondol.rollout.eligibleNextWawe,
        promotionFreeze: extrondol.rollout.promotionFreeze,
      },
      lifecycleDecision: lifecycle.decision,
    },
    status: lifecycle.targetPersonaStatus,
    linkedAgents: ['extrimli-validator-agent', 'multi-repo-sync-agent', 'persona-bank-agent'],
    crossRepoRef: EXTRIMLI_PERSONA_ID,
  };

  const subflows = includeSubflows
    ? buildSubflows(extrimliAggregate.safetySignal, orchestrationReadinessScore)
    : [];

  let writeResult: ExtrimliWorldBankPersonaReport['writeResult'] = {
    attempted: false,
    operation: 'skipped',
    personaStatusAfter: null,
    auditEntriesAfter: 0,
    personaVersionAfter: 0,
    appliedBy: null,
    persona: null,
  };

  if (mode === 'apply') {
    const client = createPersonaBankClient(agentId);
    const existing = client.get(personaPayload.id);
    if (existing?.status === 'archived') {
      writeResult = {
        attempted: false,
        operation: 'skipped',
        personaStatusAfter: 'archived',
        auditEntriesAfter: existing.auditLog.length,
        personaVersionAfter: existing.version,
        appliedBy: null,
        persona: existing,
      };
    } else {
      const targetStatus = lifecycle.targetPersonaStatus;
      const updated = existing
        ? client.update(personaPayload.id, {
          name: personaPayload.name,
          octave: personaPayload.octave,
          hipermrezaNode: personaPayload.hipermrezaNode,
          linkedAgents: personaPayload.linkedAgents,
          crossRepoRef: personaPayload.crossRepoRef,
          attributes: personaPayload.attributes,
          status: targetStatus,
        })
        : client.register(personaPayload);

      writeResult = {
        attempted: true,
        operation: existing ? 'update' : 'register',
        personaStatusAfter: updated.status,
        auditEntriesAfter: updated.auditLog.length,
        personaVersionAfter: updated.version,
        appliedBy: agentId,
        persona: updated,
      };
    }
  }

  return {
    personaId: EXTRIMLI_PERSONA_ID,
    contractVersion: EXTRIMLI_WORLD_BANK_PERSONA_CONTRACT_VERSION,
    moduleVersion: EXTRIMLI_WORLD_BANK_PERSONA_MODULE_VERSION,
    sourceOfTruth: EXTRIMLI_WORLD_BANK_PERSONA_SOURCE_OF_TRUTH,
    mode,
    ownership: '@spaja86 / Kompanija SPAJA / Digitalna Industrija',
    triggerLabel: 'extrimli:logic-change',
    linkedRepo: 'spaja86/IO-OPENUI-AO',
    sourceContracts: {
      worldBank: '/api/ai-iq-world-bank',
      extrimli: '/api/extrimli/health',
      extrondol: '/api/extrimli/extrondol',
      personaBank: '/api/persona-bank',
    },
    governanceGate: {
      currentWawe: extrondol.rollout.currentWawe,
      eligibleNextWawe: extrondol.rollout.eligibleNextWawe,
      promotionFreeze: extrondol.rollout.promotionFreeze,
      requiredEvidence,
      missingEvidence,
      blocked: promotionBlocked,
    },
    mappedSignals: {
      financialContextScore,
      extrimliReadinessSignal,
      orchestrationReadinessScore,
      combinedReadinessScore,
      degraded,
      degradedSources: [
        ...(hasExtrimliDegradation ? ['extrimli:degradation-signal'] : []),
        ...extrondol.degradedSources,
      ],
    },
    lifecycle,
    personaPayload,
    subflows,
    sources: {
      worldBank,
      extrimliAggregate,
      extrondol,
    },
    writeResult,
  };
}

export {
  EXTRIMLI_WORLD_BANK_PERSONA_AGENT,
  EXTRIMLI_WORLD_BANK_PERSONA_CONTRACT_VERSION,
  EXTRIMLI_WORLD_BANK_PERSONA_MODULE_VERSION,
  EXTRIMLI_WORLD_BANK_PERSONA_SOURCE_OF_TRUTH,
  PERSONA_BANK_CONTRACT_VERSION,
};

export type {
  ExtrimliWorldBankPersonaMode,
  ExtrimliWorldBankPersonaLifecycle,
  ExtrimliWorldBankPersonaOptions,
  ExtrimliWorldBankPersonaReport,
} from './types';
