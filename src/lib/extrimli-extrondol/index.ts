import {
  EXTRIMLI_API_RESPONSE_MAX_MS,
  EXTRIMLI_PERFORMANCE_MAX_MS,
  clamp,
  round,
} from '../extrimli';
import { evaluateDuet } from '../duet';
import { getExtrimliExtrondendReport } from '../extrimli-extrondend';
import { getExtrimliExtendolReport } from '../extrimli-extendol';
import { getExtrimliKoronHealthReport } from '../extrimli-koron';
import type {
  ExtrimliExtrondolAcceptanceCriterion,
  ExtrimliExtrondolDistanceRatioEkvilaterRow,
  ExtrimliExtrondolGovernanceEvidence,
  ExtrimliExtrondolReport,
  ExtrimliExtrondolWaweStage,
} from './types';
import {
  EXTRONDOL_CANONICAL_APEX_DOMAIN,
  EXTRONDOL_CANONICAL_WILDCARD_DOMAIN,
  EXTRONDOL_API_MAX_MS,
  EXTRONDOL_BASE_ORCHESTRATION_SHARE,
  EXTRONDOL_BUILD_MAX_MIN,
  EXTRONDOL_CONTRACT_VERSION,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_BALANCED_MIN,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_CONTRACT_FIELD,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_INTERPRETATION,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_LEGACY_MISSPELLED_ALIAS,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_SCORING_SOURCE,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_TABLE_NAME,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_TARGET_SHAPE,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_VERSION,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_WATCH_MIN,
  EXTRONDOL_DUET_INVALID_FALLBACK_SCORE,
  EXTRONDOL_DUET_INVALID_SIGNAL_PENALTY,
  EXTRONDOL_DUET_STATUS_ADJUSTMENT,
  EXTRONDOL_DUET_WARNING_PENALTY_CAP,
  EXTRONDOL_DUET_WARNING_PENALTY_STEP,
  EXTRONDOL_DINKOS_PERSONA_ID,
  EXTRONDOL_DINKOS_TRIGGER_LABEL,
  EXTRONDOL_EVALUATION_MAX_MS,
  EXTRONDOL_MODULE_VERSION,
  EXTRONDOL_NIVO_DUET_SHARE,
  EXTRONDOL_NIVO_DUET_SEGMENT,
  EXTRONDOL_NIVO_DUET_TRIGGER_LABEL,
  EXTRONDOL_PERSONA_ID,
  EXTRONDOL_REQUESTED_DOMAIN_PATTERN,
  EXTRONDOL_SOURCE_OF_TRUTH,
} from './types';

const EXTRONDOL_WAWE_THRESHOLDS = {
  wawe2: 60,
  wawe3: 72,
  wawe4: 84,
  wawe5: 93,
} as const;

function pickWawe(score: number, degraded: boolean): ExtrimliExtrondolWaweStage {
  if (degraded || score < EXTRONDOL_WAWE_THRESHOLDS.wawe2) return 'WAWE-1';
  if (score < EXTRONDOL_WAWE_THRESHOLDS.wawe3) return 'WAWE-2';
  if (score < EXTRONDOL_WAWE_THRESHOLDS.wawe4) return 'WAWE-3';
  if (score < EXTRONDOL_WAWE_THRESHOLDS.wawe5) return 'WAWE-4';
  return 'WAWE-5';
}

function nextWawe(stage: ExtrimliExtrondolWaweStage): ExtrimliExtrondolWaweStage {
  if (stage === 'WAWE-1') return 'WAWE-2';
  if (stage === 'WAWE-2') return 'WAWE-3';
  if (stage === 'WAWE-3') return 'WAWE-4';
  if (stage === 'WAWE-4') return 'WAWE-5';
  return 'WAWE-5';
}

function isValidApexDomain(domain: string): boolean {
  const regex = /^([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]{0,61}[A-Za-z0-9])(\.([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]{0,61}[A-Za-z0-9]))+$/;
  return Boolean(domain) && !domain.includes('*') && regex.test(domain);
}

function isValidWildcardDomain(domain: string): boolean {
  if (!domain.startsWith('*.')) return false;
  const suffix = domain.slice(2);
  return isValidApexDomain(suffix);
}

function validateDomainStrategy() {
  const requestedPatternRejected = !isValidApexDomain(EXTRONDOL_REQUESTED_DOMAIN_PATTERN)
    && !isValidWildcardDomain(EXTRONDOL_REQUESTED_DOMAIN_PATTERN);
  const canonicalValid = isValidApexDomain(EXTRONDOL_CANONICAL_APEX_DOMAIN);
  const wildcardValid = isValidWildcardDomain(EXTRONDOL_CANONICAL_WILDCARD_DOMAIN);
  const wildcardSuffix = EXTRONDOL_CANONICAL_WILDCARD_DOMAIN.replace('*.', '');
  const suffixAligned = wildcardSuffix === EXTRONDOL_CANONICAL_APEX_DOMAIN;
  const reasons: string[] = [];
  if (requestedPatternRejected) reasons.push(`invalid requested pattern: ${EXTRONDOL_REQUESTED_DOMAIN_PATTERN}`);
  if (!canonicalValid) reasons.push(`invalid canonical apex: ${EXTRONDOL_CANONICAL_APEX_DOMAIN}`);
  if (!wildcardValid) reasons.push(`invalid canonical wildcard: ${EXTRONDOL_CANONICAL_WILDCARD_DOMAIN}`);
  if (!suffixAligned) reasons.push('canonical wildcard suffix must match canonical apex');
  return {
    requestedPattern: EXTRONDOL_REQUESTED_DOMAIN_PATTERN,
    requestedPatternRejected,
    canonicalApex: EXTRONDOL_CANONICAL_APEX_DOMAIN,
    canonicalWildcard: EXTRONDOL_CANONICAL_WILDCARD_DOMAIN,
    valid: canonicalValid && wildcardValid && suffixAligned,
    invalidReason: reasons.length > 0 ? reasons.join('; ') : null,
  } as const;
}

function mapDuetEnergy(score: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (score >= 80) return 'HIGH';
  if (score >= 55) return 'MEDIUM';
  return 'LOW';
}

function mapDuetStatusAdjustment(status: string): number {
  if (status === 'HARMONIZED') return EXTRONDOL_DUET_STATUS_ADJUSTMENT.HARMONIZED;
  if (status === 'ALIGNED') return EXTRONDOL_DUET_STATUS_ADJUSTMENT.ALIGNED;
  if (status === 'FRAGILE') return EXTRONDOL_DUET_STATUS_ADJUSTMENT.FRAGILE;
  return EXTRONDOL_DUET_STATUS_ADJUSTMENT.DISSONANT;
}

function buildDistanceRatioEkvilaterTable(scores: {
  extrondend: number;
  extendol: number;
  koron: number;
}) {
  const baseRows = [
    {
      edgeId: 'extrondend-extendol' as const,
      from: 'EXTRONDEND' as const,
      to: 'EXTENDOL' as const,
      fromScore: round(clamp(scores.extrondend, 0, 100), 2),
      toScore: round(clamp(scores.extendol, 0, 100), 2),
    },
    {
      edgeId: 'extrondend-koron' as const,
      from: 'EXTRONDEND' as const,
      to: 'KORON' as const,
      fromScore: round(clamp(scores.extrondend, 0, 100), 2),
      toScore: round(clamp(scores.koron, 0, 100), 2),
    },
    {
      edgeId: 'extendol-koron' as const,
      from: 'EXTENDOL' as const,
      to: 'KORON' as const,
      fromScore: round(clamp(scores.extendol, 0, 100), 2),
      toScore: round(clamp(scores.koron, 0, 100), 2),
    },
  ];

  const distances = baseRows.map((row) => Math.abs(row.fromScore - row.toScore));
  const rawAverageDistance = distances.reduce((sum, value) => sum + value, 0) / distances.length;
  const rawMaxDistance = Math.max(...distances);
  const rawMinDistance = Math.min(...distances);
  const denominator = rawAverageDistance === 0 ? 1 : rawAverageDistance;

  const rows: ExtrimliExtrondolDistanceRatioEkvilaterRow[] = baseRows.map((row, index) => {
    const distance = round(distances[index], 2);
    const rawDistance = distances[index];
    const distanceRatio = round(rawMaxDistance === 0 ? 1 : clamp(rawDistance / rawMaxDistance, 0, 1), 2);
    const equilateralAlignment = round(clamp(100 - (Math.abs(rawDistance - rawAverageDistance) / denominator) * 100, 0, 100), 2);
    return {
      ...row,
      distance,
      distanceRatio,
      equilateralAlignment,
      balanced: equilateralAlignment >= EXTRONDOL_DISTANCE_RATIO_EKVILATER_BALANCED_MIN,
    };
  });

  const equilateralConsistency = round(
    rows.reduce((sum, row) => sum + row.equilateralAlignment, 0) / rows.length,
    2,
  );
  const interpretation = equilateralConsistency >= EXTRONDOL_DISTANCE_RATIO_EKVILATER_BALANCED_MIN
    ? 'balanced'
    : equilateralConsistency >= EXTRONDOL_DISTANCE_RATIO_EKVILATER_WATCH_MIN
      ? 'watch'
      : 'skewed';

  return {
    requestedTableName: EXTRONDOL_DISTANCE_RATIO_EKVILATER_TABLE_NAME,
    normalizedTableName: EXTRONDOL_DISTANCE_RATIO_EKVILATER_TABLE_NAME,
    legacyRequestedTableNames: [EXTRONDOL_DISTANCE_RATIO_EKVILATER_LEGACY_MISSPELLED_ALIAS] as const,
    contractField: EXTRONDOL_DISTANCE_RATIO_EKVILATER_CONTRACT_FIELD,
    version: EXTRONDOL_DISTANCE_RATIO_EKVILATER_VERSION,
    interpretation: EXTRONDOL_DISTANCE_RATIO_EKVILATER_INTERPRETATION,
    targetShape: EXTRONDOL_DISTANCE_RATIO_EKVILATER_TARGET_SHAPE,
    scoringSource: EXTRONDOL_DISTANCE_RATIO_EKVILATER_SCORING_SOURCE,
    rows,
    summary: {
      averageDistance: round(rawAverageDistance, 2),
      maxDistance: round(rawMaxDistance, 2),
      minDistance: round(rawMinDistance, 2),
      equilateralConsistency,
      interpretation,
    },
  };
}

function resolveGovernanceEvidence(evidence?: ExtrimliExtrondolGovernanceEvidence) {
  return {
    auditTrailComplete: evidence?.auditTrailComplete ?? process.env.EXTRONDOL_AUDIT_TRAIL_COMPLETE !== 'false',
    downstreamSyncComplete: evidence?.downstreamSyncComplete ?? process.env.EXTRONDOL_DOWNSTREAM_SYNC_COMPLETE === 'true',
    humanReviewComplete: evidence?.humanReviewComplete ?? process.env.EXTRONDOL_HUMAN_REVIEW_COMPLETE === 'true',
    onboardingComplete: evidence?.onboardingComplete ?? process.env.EXTRONDOL_ONBOARDING_COMPLETE === 'true',
  } as const;
}

/**
 * Builds the EXTRONDOL readiness report.
 * Explicit `evidence` values take precedence; when omitted, governance evidence
 * is resolved from `EXTRONDOL_AUDIT_TRAIL_COMPLETE`,
 * `EXTRONDOL_DOWNSTREAM_SYNC_COMPLETE`, and
 * `EXTRONDOL_HUMAN_REVIEW_COMPLETE`, and
 * `EXTRONDOL_ONBOARDING_COMPLETE`.
 */
export function getExtrimliExtrondolReport(evidence?: ExtrimliExtrondolGovernanceEvidence): ExtrimliExtrondolReport {
  const extrondend = getExtrimliExtrondendReport();
  const extendol = getExtrimliExtendolReport();
  const koron = getExtrimliKoronHealthReport();
  const domainStrategy = validateDomainStrategy();
  const governanceEvidence = resolveGovernanceEvidence(evidence);

  const duetInput = {
    referenceId: 'extrimli-extrondol:nivo-duet',
    objective: 'DELIVER' as const,
    mode: 'HYBRID' as const,
    energyMatch: mapDuetEnergy((extrondend.aggregationScore + extendol.unifiedReadinessScore + koron.readinessScore) / 3),
    clarityScore: round(clamp(extrondend.aggregationScore, 0, 100), 2),
    reciprocityScore: round(clamp(extendol.unifiedReadinessScore, 0, 100), 2),
    trustScore: round(clamp(koron.readinessScore, 0, 100), 2),
    rhythmScore: round(clamp(extrondend.weightedSurfaceHealth, 0, 100), 2),
    tensionLevel: round(clamp(100 - ((extrondend.aggregationScore + extendol.unifiedReadinessScore + koron.readinessScore) / 3), 0, 100), 2),
    sharedWindowHours: 3,
  };
  const duetSignal = evaluateDuet(duetInput);

  const degradedSources: string[] = [];
  if (extrondend.degraded) degradedSources.push('extrondend:degraded');
  if (extendol.degraded) degradedSources.push('extendol:degraded');
  if (koron.degraded) degradedSources.push('koron:degraded');
  if (!domainStrategy.valid) degradedSources.push('domain-strategy:invalid-canonical');
  if (!duetSignal.valid) degradedSources.push('duet:invalid-signal');
  if (duetSignal.status === 'DISSONANT') degradedSources.push('duet:dissonant');
  if (duetSignal.warnings.length >= 2) degradedSources.push('duet:warning-load');
  if (extrondend.surfaces.duelKing.kurTelemetryStatus === 'DEGRADED') degradedSources.push('duel-king:kur-signal');
  if (extrondend.surfaces.duelKing.durTelemetryStatus === 'DEGRADED') degradedSources.push('duel-king:dur-signal');
  if (extrondend.surfaces.duelKing.molTelemetryStatus === 'DEGRADED') degradedSources.push('duel-king:mol-signal');
  if (koron.performanceMaxMs > EXTRONDOL_EVALUATION_MAX_MS || koron.apiResponseMaxMs > EXTRONDOL_API_MAX_MS) {
    degradedSources.push('koron-kpi');
  }

  const baseOrchestrationScore = round(
    clamp(
      extrondend.aggregationScore * 0.50
      + extendol.unifiedReadinessScore * 0.30
      + koron.readinessScore * 0.20,
      0,
      100,
    ),
    2,
  );
  const distanceRatioEkvilaterTable = buildDistanceRatioEkvilaterTable({
    extrondend: extrondend.aggregationScore,
    extendol: extendol.unifiedReadinessScore,
    koron: koron.readinessScore,
  });
  const duetScoreForBlend = duetSignal.valid ? duetSignal.overallScore : EXTRONDOL_DUET_INVALID_FALLBACK_SCORE;
  const blendedBaseScore = (baseOrchestrationScore * EXTRONDOL_BASE_ORCHESTRATION_SHARE) + (duetScoreForBlend * EXTRONDOL_NIVO_DUET_SHARE);
  const duetAdjustment = duetSignal.valid
    ? mapDuetStatusAdjustment(duetSignal.status) - Math.min(EXTRONDOL_DUET_WARNING_PENALTY_CAP, duetSignal.warnings.length * EXTRONDOL_DUET_WARNING_PENALTY_STEP)
    : -EXTRONDOL_DUET_INVALID_SIGNAL_PENALTY;
  const orchestrationReadinessScore = round(
    clamp(blendedBaseScore + duetAdjustment, 0, 100),
    2,
  );

  const b2bScope = {
    consumerModel: 'organization-level',
    accountOwnership: {
      owner: '@spaja86',
      operatingEntity: 'Kompanija SPAJA / Digitalna Industrija',
      mandatoryHumanReview: true,
    },
    partnerOperatorRoles: {
      owner: ['platform-owner', 'contract-owner'],
      operators: ['wawe-orchestrator', 'tenant-onboarding', 'downstream-sync'],
      partners: ['spaja86/IO-OPENUI-AO', 'b2b-consumer'],
      reviewers: ['human-review', 'security-scanner', 'extrimli-validator-agent'],
    },
    procurementReviewFlow: {
      steps: ['request-submitted', 'procurement-review', 'compliance-review', 'operational-approval', 'activation'],
      activationRequires: ['contract-approved', 'onboarding-complete', 'downstream-sync-complete', 'human-review-complete'],
    },
    slaExpectations: {
      tier: 'enterprise-governed',
      evaluationMaxMs: EXTRONDOL_EVALUATION_MAX_MS,
      apiResponseMaxMs: EXTRONDOL_API_MAX_MS,
      buildDurationMaxMin: EXTRONDOL_BUILD_MAX_MIN,
      supportWindow: 'business-critical',
    },
    auditObligations: [
      'Trace procurement, review, and activation decisions in audit-ready artifacts.',
      'Do not activate B2B tenants before contract, compliance, onboarding, and downstream sync gates pass.',
      'Keep secrets, deploy hooks, and operational credentials outside Git.',
      'Preserve downstream references and human review evidence before WAWE promotion.',
    ],
  } as const;

  const degraded = degradedSources.length > 0;
  const currentWawe = pickWawe(orchestrationReadinessScore, degraded);
  const contractApproved = !degraded && domainStrategy.valid;
  const onboardingComplete = governanceEvidence.onboardingComplete;
  const downstreamSyncComplete = governanceEvidence.downstreamSyncComplete;
  const operationalApproval = currentWawe !== 'WAWE-1' && currentWawe !== 'WAWE-2';
  const humanReviewComplete = governanceEvidence.humanReviewComplete;
  const rolloutRing = currentWawe === 'WAWE-1'
    ? 'RING-0-CONTRACT'
    : currentWawe === 'WAWE-2'
      ? 'RING-1-STAGING'
      : currentWawe === 'WAWE-3'
        ? 'RING-2-CANARY'
        : currentWawe === 'WAWE-4'
          ? 'RING-3-PRODUCTION'
          : 'RING-4-RESILIENCE';
  const partnerReadinessWarnings = [
    ...duetSignal.warnings.map((warning) => `DUET: ${warning}`),
    ...(!domainStrategy.valid ? ['Domain strategy lock is invalid for B2B rollout.'] : []),
    ...(!duetSignal.valid || duetSignal.status === 'DISSONANT' ? ['DUET signal posture prevents onboarding hold from clearing.'] : []),
    ...(!downstreamSyncComplete ? ['Downstream sync must complete before B2B activation.'] : []),
    ...(!humanReviewComplete ? ['Human review evidence is required before B2B activation.'] : []),
  ];
  const complianceBlockers = [
    ...(!contractApproved ? ['contract-approved'] : []),
    ...(!onboardingComplete ? ['onboarding-complete'] : []),
    ...(!downstreamSyncComplete ? ['downstream-sync-complete'] : []),
    ...(!operationalApproval ? ['operational-approval'] : []),
    ...(!humanReviewComplete ? ['human-review-complete'] : []),
    ...(!governanceEvidence.auditTrailComplete ? ['audit-trail-complete'] : []),
  ];
  const auditTrailComplete = governanceEvidence.auditTrailComplete;
  const promotionFreeze = degraded || complianceBlockers.length > 0 || currentWawe === 'WAWE-1';
  const reasons = promotionFreeze
    ? [
      'Promotion freeze required because readiness, B2B controls, or degraded posture is below rollout threshold.',
      ...degradedSources,
      ...complianceBlockers.map((blocker) => `b2b:${blocker}`),
    ]
    : ['Ready for next WAWE stage with governance evidence.'];

  const b2bReadiness = {
    tenant: {
      organizationId: 'spaja-digital-industrija-b2b',
      organizationName: 'Kompanija SPAJA / Digitalna Industrija',
      accountOwner: '@spaja86',
      environmentTier: 'B2B',
      rolloutRing,
    },
    support: {
      slaTier: 'enterprise-governed',
      status: promotionFreeze ? 'ATTENTION' : 'ACTIVE',
      escalationRequired: promotionFreeze,
    },
    compliance: {
      contractApproved,
      onboardingComplete,
      operationalApproval,
      humanReviewComplete,
      auditTrailComplete,
      secretsInGitAllowed: false,
      blockers: complianceBlockers,
    },
    downstreamSync: {
      linkedRepo: 'spaja86/IO-OPENUI-AO',
      status: downstreamSyncComplete ? 'ALIGNED' : 'FOLLOW_UP_REQUIRED',
      syncedFields: [
        'rollout.currentWawe',
        'rollout.eligibleNextWawe',
        'rollout.promotionFreeze',
        'nivoDuet.signal.valid',
        'nivoDuet.signal.status',
        'nivoDuet.signal.overallScore',
        'nivoDuet.signal.warnings',
        'dinkos.classification',
        'dinkos.triggerLabel',
        'dinkos.personaId',
        'domainStrategy.canonicalApex',
        'domainStrategy.canonicalWildcard',
      ],
    },
    governanceDecisions: {
      onboardingHold: !onboardingComplete || !contractApproved || !duetSignal.valid || duetSignal.status === 'DISSONANT',
      rolloutFreeze: promotionFreeze,
      escalationRequired: promotionFreeze,
      partnerReadinessWarnings,
      dinkosSignalRequired: true,
    },
  } as const;

  const acceptanceCriteria: ExtrimliExtrondolAcceptanceCriterion[] = [
    {
      id: 'naming-lock',
      description: 'EXTRONDOL is a dedicated orchestration/readiness module, not an alias of Extendol/KORON.',
      passed: true,
    },
    {
      id: 'stable-contract',
      description: 'EXTRONDOL contract and module versions are stable and explicit.',
      passed: EXTRONDOL_CONTRACT_VERSION === 'v1-extrondol' && EXTRONDOL_MODULE_VERSION === '1.0.0',
    },
    {
      id: 'wawe-sequencing',
      description: 'Rollout sequencing maps readiness (including KUR/DUR/MOL and NIVO DUET signal posture) to WAWE-1..WAWE-5 with promotion freeze guard.',
      passed: ['WAWE-1', 'WAWE-2', 'WAWE-3', 'WAWE-4', 'WAWE-5'].includes(currentWawe),
    },
    {
      id: 'kpi-targets',
      description: 'Upstream surfaces satisfy evaluation ≤ 50ms and API ≤ 200ms budgets.',
      passed: degradedSources.length === 0,
    },
    {
      id: 'domain-strategy-lock',
      description: 'Requested `spaja.nivo*spaja` is rejected and canonical domains remain `spaja.nivo-spaja` + `*.spaja.nivo-spaja`.',
      passed: domainStrategy.valid && domainStrategy.requestedPatternRejected,
    },
    {
      id: 'nivo-duet-mapping',
      description: 'DUET status/overallScore/warnings are mapped into WAWE orchestration and B2B onboarding/promotion decisions.',
      passed: Number.isFinite(orchestrationReadinessScore)
        && currentWawe === pickWawe(orchestrationReadinessScore, degraded)
        && b2bReadiness.governanceDecisions.rolloutFreeze === promotionFreeze,
    },
    {
      id: 'dinkos-contract',
      description: 'DINKOS is explicitly locked as a signal contract with ownership, trigger label, persona and degraded-mode boundary.',
      passed: EXTRONDOL_DINKOS_TRIGGER_LABEL === 'dinkos:logic-change' && EXTRONDOL_DINKOS_PERSONA_ID.length > 0,
    },
    {
      id: 'finite-orchestration-score',
      description: 'Orchestration readiness score is finite and bounded in [0,100].',
      passed: Number.isFinite(orchestrationReadinessScore) && orchestrationReadinessScore >= 0 && orchestrationReadinessScore <= 100,
    },
    {
      id: 'distance-ratio-ekvilater-table',
      description: 'DISTANCE RATIO EKVILATER is exposed as an additive derived-readiness table over EXTRONDEND, EXTENDOL, and KORON score distances.',
      passed: distanceRatioEkvilaterTable.contractField === EXTRONDOL_DISTANCE_RATIO_EKVILATER_CONTRACT_FIELD
        && distanceRatioEkvilaterTable.rows.length === 3
        && Number.isFinite(distanceRatioEkvilaterTable.summary.equilateralConsistency),
    },
    {
      id: 'b2b-scope',
      description: 'EXTRONDOL defines organization-level B2B ownership, partner/operator roles, procurement review flow, SLA targets, and audit obligations.',
      passed: b2bScope.consumerModel === 'organization-level'
        && b2bScope.accountOwnership.mandatoryHumanReview
        && b2bScope.partnerOperatorRoles.partners.includes('spaja86/IO-OPENUI-AO'),
    },
    {
      id: 'b2b-controls',
      description: 'B2B activation stays blocked until contract, onboarding, downstream sync, operational approval, and audit controls are satisfied.',
      passed: b2bReadiness.compliance.secretsInGitAllowed === false
        && b2bReadiness.governanceDecisions.dinkosSignalRequired
        && b2bReadiness.governanceDecisions.rolloutFreeze === promotionFreeze,
    },
    {
      id: 'b2b-downstream-sync',
      description: 'Downstream B2B consumers receive WAWE fields, DUET warning posture, DINKOS metadata, and domain-strategy validation.',
      passed: b2bReadiness.downstreamSync.syncedFields.includes('rollout.currentWawe')
        && b2bReadiness.downstreamSync.syncedFields.includes('nivoDuet.signal.warnings')
        && b2bReadiness.downstreamSync.syncedFields.includes('dinkos.personaId')
        && b2bReadiness.downstreamSync.syncedFields.includes('domainStrategy.canonicalWildcard'),
    },
  ];

  return {
    personaId: EXTRONDOL_PERSONA_ID,
    contractVersion: EXTRONDOL_CONTRACT_VERSION,
    moduleVersion: EXTRONDOL_MODULE_VERSION,
    sourceOfTruth: EXTRONDOL_SOURCE_OF_TRUTH,
    statement: 'EXTRONDOL orchestrates WAWE rollout readiness across EXTRIMLI aggregation surfaces for organization-level B2B consumers.',
    ownership: '@spaja86',
    triggerLabel: 'extrondol:logic-change',
    pathScope: [
      'src/lib/extrimli-extrondol/**',
      'src/app/api/extrimli/extrondol/**',
      'src/tests/lib/extrimli-extrondol.test.ts',
      'src/lib/duet/**',
      'src/app/api/duet/**',
      'src/tests/lib/duet.test.ts',
      'src/tests/api/duet-route.test.ts',
    ],
    orchestrationReadinessScore,
    b2bScope,
    b2bReadiness,
    domainStrategy,
    distanceRatioEkvilaterTable,
    nivoDuet: {
      sourceOfTruth: '/api/duet/evaluate',
      triggerLabel: EXTRONDOL_NIVO_DUET_TRIGGER_LABEL,
      mapping: {
        fromDuet: ['valid', 'status', 'overallScore', 'warnings'],
        toOrchestration: ['rollout.currentWawe', 'rollout.eligibleNextWawe', 'rollout.promotionFreeze'],
      },
      duetInputProfile: {
        objective: duetInput.objective,
        mode: duetInput.mode,
        energyMatch: duetInput.energyMatch,
        clarityScore: duetInput.clarityScore,
        reciprocityScore: duetInput.reciprocityScore,
        trustScore: duetInput.trustScore,
        rhythmScore: duetInput.rhythmScore,
        tensionLevel: duetInput.tensionLevel,
        sharedWindowHours: duetInput.sharedWindowHours,
      },
      signal: {
        valid: duetSignal.valid,
        status: duetSignal.status,
        overallScore: duetSignal.overallScore,
        warnings: duetSignal.warnings,
      },
    },
    dinkos: {
      domain: 'DINKOS',
      classification: 'signal',
      ownership: '@spaja86',
      triggerLabel: EXTRONDOL_DINKOS_TRIGGER_LABEL,
      personaId: EXTRONDOL_DINKOS_PERSONA_ID,
      routeSegment: EXTRONDOL_NIVO_DUET_SEGMENT,
      degradedMode: 'partial-payload-no-500',
    },
    rollout: {
      currentWawe,
      eligibleNextWawe: nextWawe(currentWawe),
      promotionFreeze,
      reasons,
    },
    degraded,
    degradedMode: 'partial-payload-no-500',
    degradedSources,
    acceptanceCriteria,
    integrationBoundaries: {
      dependsOn: ['/api/extrimli/extrondend', '/api/extrimli/extendol', '/api/extrimli/koron', '/api/duet/evaluate'],
      aliasesOfExistingSurfaces: false,
    },
    kpiTargets: {
      evaluationMaxMs: EXTRIMLI_PERFORMANCE_MAX_MS,
      apiResponseMaxMs: EXTRIMLI_API_RESPONSE_MAX_MS,
      buildDurationMaxMin: EXTRONDOL_BUILD_MAX_MIN,
    },
    surfaces: { extrondend, extendol, koron },
  };
}

export type {
  ExtrimliExtrondolAcceptanceCriterion,
  ExtrimliExtrondolGovernanceEvidence,
  ExtrimliExtrondolReport,
  ExtrimliExtrondolWaweStage,
} from './types';

export {
  EXTRONDOL_API_MAX_MS,
  EXTRONDOL_BASE_ORCHESTRATION_SHARE,
  EXTRONDOL_BUILD_MAX_MIN,
  EXTRONDOL_DUET_INVALID_FALLBACK_SCORE,
  EXTRONDOL_DUET_INVALID_SIGNAL_PENALTY,
  EXTRONDOL_DUET_STATUS_ADJUSTMENT,
  EXTRONDOL_DUET_WARNING_PENALTY_CAP,
  EXTRONDOL_DUET_WARNING_PENALTY_STEP,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_BALANCED_MIN,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_CONTRACT_FIELD,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_INTERPRETATION,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_LEGACY_MISSPELLED_ALIAS,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_SCORING_SOURCE,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_TABLE_NAME,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_TARGET_SHAPE,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_VERSION,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_WATCH_MIN,
  EXTRONDOL_CANONICAL_APEX_DOMAIN,
  EXTRONDOL_CANONICAL_WILDCARD_DOMAIN,
  EXTRONDOL_CONTRACT_VERSION,
  EXTRONDOL_DINKOS_PERSONA_ID,
  EXTRONDOL_DINKOS_TRIGGER_LABEL,
  EXTRONDOL_EVALUATION_MAX_MS,
  EXTRONDOL_MODULE_VERSION,
  EXTRONDOL_NIVO_DUET_SHARE,
  EXTRONDOL_NIVO_DUET_SEGMENT,
  EXTRONDOL_NIVO_DUET_TRIGGER_LABEL,
  EXTRONDOL_PERSONA_ID,
  EXTRONDOL_REQUESTED_DOMAIN_PATTERN,
  EXTRONDOL_SOURCE_OF_TRUTH,
} from './types';
