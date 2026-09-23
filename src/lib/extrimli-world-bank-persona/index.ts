import { buildAiIqWorldBank } from '../ai-iq-world-bank';
import {
  buildAiIdentityFinanceGovernancePackage,
  buildAiIdentityFinancePersonaAttributes,
} from '../ai-identity-finance-governance';
import { buildAIIQWorldBankLicencniRegistar } from '../aiiq-world-bank-licencni-registar';
import { EXTRIMLI_PERSONA_ID, getExtrimliAggregateSignals } from '../extrimli';
import { getExtrimliExtrondolReport } from '../extrimli-extrondol';
import {
  createPersonaBankClient,
  PersonaLockConflictError,
  PERSONA_BANK_CONTRACT_VERSION,
  PersonaArchivedError,
  PersonaNotFoundError,
  SEED_PERSONAS,
} from '../persona-bank';
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
  globalLicenseFreeze: boolean;
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

  if (params.globalLicenseFreeze) {
    return {
      decision: 'HOLD',
      targetPersonaStatus: 'dormant',
      promotionAllowed: false,
      reason: 'Promotion blocked: global licensing readiness is below required threshold',
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
  const licencniRegistar = buildAIIQWorldBankLicencniRegistar();
  const extrimliAggregate = getExtrimliAggregateSignals();
  const extrondol = getExtrimliExtrondolReport(options.evidence);

  const financialContextScore = buildFinancialContextScore(worldBank);
  const extrimliReadinessSignal = round(extrimliAggregate.readinessSignal);
  const orchestrationReadinessScore = round(extrondol.orchestrationReadinessScore);
  const activityCoverageScore = round(licencniRegistar.globalniCoverage.coverageProcenat);
  const globalLicenseReadinessScore = round(extrondol.b2bReadiness.globalLicensing.globalLicenseReadinessScore);
  const criticalGlobalGapCount = extrondol.b2bReadiness.globalLicensing.criticalGlobalGapCount;
  const combinedReadinessScore = round(
    (financialContextScore * 0.2)
      + (extrimliReadinessSignal * 0.2)
      + (orchestrationReadinessScore * 0.3)
      + (activityCoverageScore * 0.15)
      + (globalLicenseReadinessScore * 0.15),
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
    globalLicenseFreeze: extrondol.b2bReadiness.globalLicensing.freezeRequired,
  });
  const aiIdentityFinanceGovernance = buildAiIdentityFinanceGovernancePackage({
    readinessStatus: lifecycle.decision === 'HOLD'
      ? 'BLOCKED'
      : lifecycle.decision === 'DORMANT'
        ? 'WATCH'
        : 'READY',
    readinessScore: combinedReadinessScore,
    deterministicFallbackRequired: degraded,
    promotionFreeze: promotionBlocked || extrondol.b2bReadiness.globalLicensing.freezeRequired,
    blockers: [
      ...missingEvidence,
      ...(extrondol.rollout.promotionFreeze ? ['promotion-freeze'] : []),
      ...(extrondol.b2bReadiness.globalLicensing.freezeRequired ? ['global-licensing-freeze'] : []),
    ],
  });
  const aiPersonaCatalog = new Map(
    aiIdentityFinanceGovernance.personas.map((persona) => [persona.personaId, persona] as const),
  );

  const prioritizedActivities = [...licencniRegistar.delatnosti]
    .sort((a, b) => b.prioritet.score - a.prioritet.score)
    .slice(0, 8)
    .map((activity) => ({
      id: activity.id,
      naziv: activity.naziv,
      sektor: activity.sektor,
      score: activity.prioritet.score,
    }));

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
      activityFootprint: {
        source: '/api/aiiq-world-bank-licencni-registar',
        totalActivities: licencniRegistar.delatnosti.length,
        prioritized: prioritizedActivities,
      },
      globalLicensing: {
        source: '/api/aiiq-world-bank-licencni-registar',
        readinessScore: globalLicenseReadinessScore,
        activityCoverageScore,
        criticalGapCount: criticalGlobalGapCount,
        freezeRequired: extrondol.b2bReadiness.globalLicensing.freezeRequired,
      },
      extrondolSignal: {
        source: '/api/extrimli/extrondol',
        currentWave: extrondol.rollout.currentWawe,
        eligibleNextWave: extrondol.rollout.eligibleNextWawe,
        promotionFreeze: extrondol.rollout.promotionFreeze,
      },
      lifecycleDecision: lifecycle.decision,
      ...buildAiIdentityFinancePersonaAttributes(aiPersonaCatalog.get(EXTRIMLI_PERSONA_ID) ?? aiIdentityFinanceGovernance.personas[0]),
    },
    status: lifecycle.targetPersonaStatus,
    linkedAgents: ['extrimli-validator-agent', 'multi-repo-sync-agent', 'persona-bank-agent'],
    crossRepoRef: EXTRIMLI_PERSONA_ID,
  };
  const seededPrimaryPersona = SEED_PERSONAS.some((seedPersona) => (seedPersona.id ?? seedPersona.name) === (personaPayload.id ?? personaPayload.name));
  const totalCatalogPersonas = aiIdentityFinanceGovernance.rolloutScope.totalSeededPersonas + (seededPrimaryPersona ? 0 : 1);

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
    catalogSync: {
      totalCatalogPersonas,
      processedPersonas: 0,
      registered: 0,
      updated: 0,
      skippedArchived: 0,
      recoveredFromLock: 0,
    },
  };

  if (mode === 'apply') {
    const client = createPersonaBankClient(agentId);
    const targetStatus = lifecycle.targetPersonaStatus;
    const primaryPersonaId = personaPayload.id ?? personaPayload.name;
    let primaryPersonaSynced = false;
    let primaryRecoveredFromLock = false;
    let primarySkippedArchived = false;
    const personaMatchesPayload = (
      persona: NonNullable<ExtrimliWorldBankPersonaReport['writeResult']['persona']>,
      payload: PersonaRegistrationInput,
      status: ExtrimliWorldBankPersonaReport['lifecycle']['targetPersonaStatus'],
    ): boolean =>
      persona.status === status
      && JSON.stringify(persona.attributes?.aiIdentityCard ?? null) === JSON.stringify(payload.attributes.aiIdentityCard)
      && JSON.stringify(persona.attributes?.aiBankAccountGovernance ?? null) === JSON.stringify(payload.attributes.aiBankAccountGovernance)
      && persona.crossRepoRef === payload.crossRepoRef;
    try {
      const updated = client.update(primaryPersonaId, {
        name: personaPayload.name,
        octave: personaPayload.octave,
        hipermrezaNode: personaPayload.hipermrezaNode,
        linkedAgents: personaPayload.linkedAgents,
        crossRepoRef: personaPayload.crossRepoRef,
        attributes: personaPayload.attributes,
        status: targetStatus,
      });

      writeResult = {
        attempted: true,
        operation: 'update',
        personaStatusAfter: updated.status,
        auditEntriesAfter: updated.auditLog.length,
        personaVersionAfter: updated.version,
        appliedBy: agentId,
        persona: updated,
        catalogSync: writeResult.catalogSync,
      };
      primaryPersonaSynced = true;
    } catch (error) {
      if (error instanceof PersonaNotFoundError) {
        try {
          const registered = client.register(personaPayload);
          writeResult = {
            attempted: true,
            operation: 'register',
            personaStatusAfter: registered.status,
            auditEntriesAfter: registered.auditLog.length,
            personaVersionAfter: registered.version,
            appliedBy: agentId,
            persona: registered,
            catalogSync: writeResult.catalogSync,
          };
          primaryPersonaSynced = true;
        } catch (registerError) {
          if (!(registerError instanceof PersonaLockConflictError)) throw registerError;
          const concurrentPersona = client.get(primaryPersonaId);
          if (!concurrentPersona) throw registerError;
          const resolved = personaMatchesPayload(concurrentPersona, personaPayload, targetStatus);
          writeResult = {
            attempted: resolved,
            operation: resolved ? 'update' : 'skipped',
            personaStatusAfter: concurrentPersona.status,
            auditEntriesAfter: concurrentPersona.auditLog.length,
            personaVersionAfter: concurrentPersona.version,
            appliedBy: agentId,
            persona: concurrentPersona,
            catalogSync: writeResult.catalogSync,
          };
          primaryPersonaSynced = resolved;
          primaryRecoveredFromLock = resolved;
        }
      } else if (error instanceof PersonaLockConflictError) {
        const concurrentPersona = client.get(primaryPersonaId);
        const resolved = concurrentPersona ? personaMatchesPayload(concurrentPersona, personaPayload, targetStatus) : false;
        writeResult = {
          attempted: resolved,
          operation: resolved ? 'update' : 'skipped',
          personaStatusAfter: concurrentPersona?.status ?? null,
          auditEntriesAfter: concurrentPersona?.auditLog.length ?? 0,
          personaVersionAfter: concurrentPersona?.version ?? 0,
          appliedBy: agentId,
          persona: concurrentPersona,
          catalogSync: writeResult.catalogSync,
        };
        primaryPersonaSynced = resolved;
        primaryRecoveredFromLock = resolved;
      } else if (error instanceof PersonaArchivedError) {
        const archived = client.get(primaryPersonaId);
        writeResult = {
          attempted: false,
          operation: 'skipped',
          personaStatusAfter: archived?.status ?? 'archived',
          auditEntriesAfter: archived?.auditLog.length ?? 0,
          personaVersionAfter: archived?.version ?? 0,
          appliedBy: agentId,
          persona: archived,
          catalogSync: writeResult.catalogSync,
        };
        primarySkippedArchived = true;
      } else {
        throw error;
      }
    }

    writeResult.catalogSync = {
      ...writeResult.catalogSync,
      processedPersonas: primaryPersonaSynced || primarySkippedArchived ? 1 : 0,
      registered: writeResult.operation === 'register' ? 1 : 0,
      updated: writeResult.operation === 'update' && writeResult.attempted ? 1 : 0,
      skippedArchived: primarySkippedArchived ? 1 : 0,
      recoveredFromLock: primaryRecoveredFromLock ? 1 : 0,
    };
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
      currentWave: extrondol.rollout.currentWawe,
      eligibleNextWave: extrondol.rollout.eligibleNextWawe,
      promotionFreeze: extrondol.rollout.promotionFreeze,
      requiredEvidence,
      missingEvidence,
      blocked: promotionBlocked,
    },
    mappedSignals: {
      financialContextScore,
      extrimliReadinessSignal,
      orchestrationReadinessScore,
      activityCoverageScore,
      globalLicenseReadinessScore,
      criticalGlobalGapCount,
      combinedReadinessScore,
      degraded,
      degradedSources: [
        ...(hasExtrimliDegradation ? ['extrimli:degradation-signal'] : []),
        ...extrondol.degradedSources,
      ],
    },
    lifecycle,
    aiIdentityFinanceGovernance,
    personaPayload,
    activityFootprint: {
      totalActivities: licencniRegistar.delatnosti.length,
      prioritizedActivities,
    },
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
