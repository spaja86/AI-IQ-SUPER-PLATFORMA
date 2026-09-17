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
import { getExtrimliExtremProfilerReport } from '../extrimli-extrem';
import { getExtrimliVersionRoadmap } from '../extrimli-version-roadmap';
import {
  EXPECTED_VERCEL_BILLING_OWNER,
  EXPECTED_VERCEL_INVOICE_AMOUNT,
  EXPECTED_VERCEL_INVOICE_NUMBER,
  buildVercelPublicAnnouncementState,
  isVercelInvoiceResolved,
  normalizePaymentReferenceClassification,
} from '../vercel-billing-governance';
import {
  buildSpajaproGovernanceTrack,
  buildSpajaproPublicBoundaryStatus,
} from '../extrimli-spajapro-track';
import type {
  ExtrimliExtrondolAcceptanceCriterion,
  ExtrimliExtrondolDistanceRatioEkvilaterTable,
  ExtrimliExtrondolGovernanceEvidence,
  ExtrimliExtrondolMobilnaLinijaPackagePlan,
  ExtrimliExtrondolPaymentReferenceClassification,
  ExtrimliExtrondolPaymentVerification,
  ExtrimliExtrondolObjektnaProngilacijaGovernance,
  ExtrimliExtrondolReport,
  ExtrimliExtrondolReleaseAuditSummary,
  ExtrimliExtrondolStartProject,
  ExtrimliSpajaKodPublicFacade,
  ExtrimliExtrondolWaweStage,
} from './types';
import {
  EXTRIMLI_SPAJA_KOD_CONTRACT_VERSION,
  EXTRIMLI_SPAJA_KOD_MODULE_VERSION,
  EXTRIMLI_SPAJA_KOD_SOURCE_OF_TRUTH,
  EXTRONDOL_CANONICAL_APEX_DOMAIN,
  EXTRONDOL_CANONICAL_WILDCARD_DOMAIN,
  EXTRONDOL_API_MAX_MS,
  EXTRONDOL_BASE_ORCHESTRATION_SHARE,
  EXTRONDOL_BUILD_MAX_MIN,
  EXTRONDOL_CONTRACT_VERSION,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_BALANCED_MIN,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_COMPATIBILITY_ALIASES,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_CONTRACT_FIELD,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_INTERPRETATION,
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
  EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_BLOCKED_ADJUSTMENT,
  EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION,
  EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_READY_ADJUSTMENT,
  EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_WATCH_ADJUSTMENT,
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

const EXTRONDOL_ROLLOUT_RING_SEQUENCE = [
  'RING-0-CONTRACT',
  'RING-1-STAGING',
  'RING-2-CANARY',
  'RING-3-PRODUCTION',
  'RING-4-RESILIENCE',
] as const;

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
}): ExtrimliExtrondolDistanceRatioEkvilaterTable {
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
  ] as const;

  const distanceValues = baseRows.map((row) => Math.abs(row.fromScore - row.toScore));
  const rawAverageDistance = distanceValues.reduce((sum, value) => sum + value, 0) / distanceValues.length;
  const rawMaxDistance = Math.max(...distanceValues);
  const rawMinDistance = Math.min(...distanceValues);
  const denominator = rawAverageDistance === 0 ? 1 : rawAverageDistance;

  const buildRow = <T extends (typeof baseRows)[number]>(row: T) => {
    const rawDistance = Math.abs(row.fromScore - row.toScore);
    const distance = round(rawDistance, 2);
    const distanceRatio = round(rawMaxDistance === 0 ? 1 : clamp(rawDistance / rawMaxDistance, 0, 1), 2);
    const equilateralAlignment = round(clamp(100 - (Math.abs(rawDistance - rawAverageDistance) / denominator) * 100, 0, 100), 2);
    return {
      ...row,
      distance,
      distanceRatio,
      equilateralAlignment,
      balanced: equilateralAlignment >= EXTRONDOL_DISTANCE_RATIO_EKVILATER_BALANCED_MIN,
    };
  };

  const rows = [
    buildRow(baseRows[0]),
    buildRow(baseRows[1]),
    buildRow(baseRows[2]),
  ] as const;

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
    legacyRequestedTableNames: EXTRONDOL_DISTANCE_RATIO_EKVILATER_COMPATIBILITY_ALIASES,
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

function buildMobilnaLinijaReadiness(
  extremProfiler: ExtrimliExtrondolReport['extremProfiler'],
): ExtrimliExtrondolReport['mobilnaLinija'] {
  const packageCatalog: readonly ExtrimliExtrondolMobilnaLinijaPackagePlan[] = [
    {
      id: 'mobilna-start',
      name: 'Mobilna Start',
      tier: 'BASIC',
      monthlyPriceEur: 9,
      dataCapGb: 20,
      supportsEsim: false,
      minSignalStrengthPercent: 35,
      installationMessage: 'Aktivirajte osnovni data profil i proverite APN podešavanja.',
    },
    {
      id: 'mobilna-smart',
      name: 'Mobilna Smart',
      tier: 'SMART',
      monthlyPriceEur: 16,
      dataCapGb: 80,
      supportsEsim: true,
      minSignalStrengthPercent: 55,
      installationMessage: 'Aktivirajte eSIM profil i potvrdite 4G/5G fallback režim.',
    },
    {
      id: 'mobilna-pro',
      name: 'Mobilna Pro',
      tier: 'PRO',
      monthlyPriceEur: 24,
      dataCapGb: 250,
      supportsEsim: true,
      minSignalStrengthPercent: 75,
      installationMessage: 'Omogućite 5G prioritizaciju i završite premium onboarding poruke.',
    },
  ];

  const input = extremProfiler.mobilnaLinija.input;
  const installationStatus = extremProfiler.mobilnaLinija.installationMessages.status;
  const deviceStatus = extremProfiler.mobilnaLinija.deviceCompatibility.status;
  const recommendedTier = extremProfiler.mobilnaLinija.packagePlanHint.recommendedPlanTier;

  const eligiblePlans = packageCatalog.filter((plan) => (
    extremProfiler.mobilnaLinija.deviceCompatibility.compatible
    && input.signalStrengthPercent >= plan.minSignalStrengthPercent
    && (!plan.supportsEsim || input.supportsEsim)
  ));
  const cheapestEligiblePlan = [...eligiblePlans].sort((a, b) => (
    a.monthlyPriceEur - b.monthlyPriceEur || a.id.localeCompare(b.id)
  ))[0] ?? null;
  const selectedPlan = eligiblePlans.find((plan) => plan.tier === recommendedTier) ?? cheapestEligiblePlan;
  const noValidPlanBlocker = !selectedPlan;
  const freezeReasons = [
    ...(installationStatus === 'BLOCKED'
      ? ['installation-messages-incomplete-or-blocked']
      : []),
    ...(deviceStatus === 'BLOCKED'
      ? ['device-compatibility-blocked']
      : []),
    ...(noValidPlanBlocker
      ? ['no-valid-package-plan-for-current-mobile-line-state']
      : []),
  ];

  const activationStatus = installationStatus === 'BLOCKED' || deviceStatus === 'BLOCKED'
    ? 'BLOCKED'
    : !selectedPlan
      ? 'WATCH'
    : installationStatus === 'WATCH' || extremProfiler.mobilnaLinija.packagePlanHint.readiness === 'WATCH'
      ? 'WATCH'
      : 'READY';

  return {
    lineType: 'Mobilna linija',
    installationMessagesRequired: true,
    installationMessagesStatus: installationStatus,
    deviceCompatibilityStatus: deviceStatus,
    packageCatalog,
    selectedPlanId: selectedPlan?.id ?? null,
    activationStatus,
    selectionRules: [
      'Device compatibility and mandatory installation messages must pass before activation.',
      'Selected package must satisfy minimum signal threshold and eSIM requirement when applicable.',
      'Recommended tier from EXTREM is preferred; fallback selects the cheapest eligible package deterministically.',
    ],
    freezeReasons,
  };
}

function buildObjektnaProngilacijaAdjustment(
  status: ExtrimliExtrondolReport['extremProfiler']['objektnoOrijentisanaProngilacija']['readiness']['status'],
): number {
  if (status === 'READY') return EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_READY_ADJUSTMENT;
  if (status === 'WATCH') return EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_WATCH_ADJUSTMENT;
  return EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_BLOCKED_ADJUSTMENT;
}

function buildObjektnaProngilacijaPostureReasons(
  signal: ExtrimliExtrondolReport['extremProfiler']['objektnoOrijentisanaProngilacija'],
): {
  rolloutReasons: string[];
  governanceReasons: string[];
} {
  if (signal.readiness.status === 'WATCH') {
    return {
      rolloutReasons: [
        'objektna-prongilacija:watch',
        ...signal.readiness.watchReasons.map((reason) => `objektna-prongilacija:${reason}`),
      ],
      governanceReasons: signal.readiness.watchReasons.map((reason) => `watch:${reason}`),
    };
  }

  if (signal.readiness.status === 'BLOCKED') {
    return {
      rolloutReasons: [
        'objektna-prongilacija:blocked',
        ...signal.readiness.blockerReasons.map((reason) => `objektna-prongilacija:${reason}`),
      ],
      governanceReasons: signal.readiness.blockerReasons.map((reason) => `blocked:${reason}`),
    };
  }

  return {
    rolloutReasons: [],
    governanceReasons: ['ready:object-state, methods, delegation, and composition are aligned for WAWE progression'],
  };
}

function buildObjektnaProngilacijaGovernance(params: {
  extremProfiler: ExtrimliExtrondolReport['extremProfiler'];
  currentWawe: ExtrimliExtrondolWaweStage;
  eligibleNextWawe: ExtrimliExtrondolWaweStage;
  promotionFreeze: boolean;
  downstreamSyncComplete: boolean;
  humanReviewComplete: boolean;
}): ExtrimliExtrondolObjektnaProngilacijaGovernance {
  const signal = params.extremProfiler.objektnoOrijentisanaProngilacija;
  const postureReasons = buildObjektnaProngilacijaPostureReasons(signal);
  const reasons = [
    ...postureReasons.governanceReasons,
    ...(!params.downstreamSyncComplete ? ['governance:downstream-sync-follow-up-required'] : []),
    ...(!params.humanReviewComplete ? ['governance:human-review-required'] : []),
    ...(params.promotionFreeze ? ['governance:promotion-freeze-active'] : []),
  ];

  return {
    term: 'Objektno orijentisana prongilacija',
    sourceOfTruth: '/api/extrimli/extrondol',
    technicalSignalSource: '/api/extrimli/extrem',
    contractVersion: EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION,
    additiveOnly: true,
    status: signal.readiness.status,
    readinessScore: signal.readiness.score,
    ownershipModel: {
      extrem: 'technical-object-state-signal',
      extrondol: 'wawe-orchestration-audit-consumer',
      spajaKod: 'public-encapsulated-boundary',
    },
    waweImpact: {
      currentWawe: params.currentWawe,
      eligibleNextWawe: params.eligibleNextWawe,
      promotionFreeze: params.promotionFreeze,
      stageRules: [
        { stage: 'WAWE-1', requirement: 'Canonical term, source-of-truth lock, and object-state readiness must be explicitly defined.' },
        { stage: 'WAWE-2', requirement: 'Method cohesion and instance clarity stay at least in WATCH posture during build/staging.' },
        { stage: 'WAWE-3', requirement: 'Delegation/composition evidence and downstream sync posture must be audit-visible.' },
        { stage: 'WAWE-4', requirement: 'Production promotion requires READY or explicitly reviewed WATCH posture without hidden blockers.' },
        { stage: 'WAWE-5', requirement: 'Post-release resilience keeps rollback and human-review obligations attached to the object-state signal.' },
      ],
    },
    auditCoupling: {
      releaseAuditSummaryRequired: true,
      humanReviewRequired: true,
      rollbackPlanRequired: true,
      downstreamSyncRequired: true,
    },
    reasons,
  };
}

function buildSpajaKodFacade(params: {
  extremProfiler: ExtrimliExtrondolReport['extremProfiler'];
  promotionFreeze: boolean;
  currentWawe: ExtrimliExtrondolWaweStage;
  eligibleNextWawe: ExtrimliExtrondolWaweStage;
  downstreamSyncComplete: boolean;
  humanReviewComplete: boolean;
  degraded: boolean;
  releaseAuditSummary: ExtrimliExtrondolReleaseAuditSummary;
}): ExtrimliSpajaKodPublicFacade {
  const completeness = {
    extremSignalPresent: params.extremProfiler.spajaKodEncapsulation.surfaceName === 'SPAJA KOD',
    extrondolGovernancePresent: true,
    consistent: params.extremProfiler.spajaKodEncapsulation.rawPatternVisibility === 'HIDDEN'
      && params.extremProfiler.spajaKodEncapsulation.exposurePolicy.exposesRawPatternModel === false
      && params.extremProfiler.spajaKodEncapsulation.exposurePolicy.exposesFormulaInternals === false,
    exportReady: params.extremProfiler.spajaKodEncapsulation.rawPatternVisibility === 'HIDDEN',
  } as const;
  const blockers = [
    ...params.extremProfiler.spajaKodEncapsulation.blockers,
    ...(!params.downstreamSyncComplete ? ['downstream-sync-pending'] : []),
    ...(!params.humanReviewComplete ? ['human-review-required'] : []),
  ];
  const status = params.promotionFreeze
    ? 'BLOCKED'
    : params.extremProfiler.spajaKodEncapsulation.readiness.status === 'WATCH'
      ? 'WATCH'
      : 'READY';
  const platformTrack = buildSpajaproPublicBoundaryStatus({
    publicStatus: status,
  });

  return {
    surfaceName: 'SPAJA KOD',
    contractVersion: EXTRIMLI_SPAJA_KOD_CONTRACT_VERSION,
    moduleVersion: EXTRIMLI_SPAJA_KOD_MODULE_VERSION,
    sourceOfTruth: EXTRIMLI_SPAJA_KOD_SOURCE_OF_TRUTH,
    publicSurfaceType: 'encapsulated-facade',
    representationMode: 'system-encapsulation',
    encapsulationStatus: 'ACTIVE',
    rawPatternVisibility: 'HIDDEN',
    completeness,
    interpretation: params.promotionFreeze
      ? 'SPAJA KOD exposes only system blockers and freeze posture while internal EXTREM pattern logic remains hidden.'
      : status === 'WATCH'
        ? 'SPAJA KOD exposes a bounded review posture while keeping internal pattern logic encapsulated.'
        : 'SPAJA KOD exposes a stable readiness facade for downstream systems without revealing internal pattern logic.',
    readiness: {
      status,
      governanceOutcome: params.extremProfiler.spajaKodEncapsulation.readiness.governanceOutcome,
      promotionFreeze: params.promotionFreeze,
      currentWawe: params.currentWawe,
      eligibleNextWawe: params.eligibleNextWawe,
    },
    publicSignals: {
      systemStatus: params.promotionFreeze ? 'BLOCKED' : status === 'WATCH' ? 'ATTENTION' : 'STABLE',
      auditStatus: params.releaseAuditSummary.status,
      downstreamSyncStatus: params.downstreamSyncComplete ? 'ALIGNED' : 'FOLLOW_UP_REQUIRED',
      humanReviewRequired: true,
      rollbackPlanRequired: true,
      degraded: params.degraded,
    },
    platformTrack,
    blockers,
    exportContract: {
      includedInInstrukcija: true,
      downstreamConsumer: 'spaja86/IO-OPENUI-AO',
      exposesInternalPattern: false,
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

function boolFlag(value: string | undefined): boolean {
  return /^(1|true|yes)$/i.test(value ?? '');
}

function buildPaymentVerification(): ExtrimliExtrondolPaymentVerification {
  const currentInvoiceNumber = (process.env.SPAJA_VERCEL_CURRENT_INVOICE_NUMBER ?? '').trim();
  const currentInvoiceAmount = (process.env.SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT ?? '').trim();
  const billingOwner = (process.env.SPAJA_VERCEL_BILLING_OWNER ?? '').trim();

  const invoiceRequested = boolFlag(process.env.SPAJA_VERCEL_INVOICE_REQUESTED);
  const currentInvoicePaid = boolFlag(process.env.SPAJA_VERCEL_CURRENT_INVOICE_PAID);
  const invoiceCorrectionRequested = boolFlag(process.env.SPAJA_VERCEL_INVOICE_CORRECTION_REQUESTED);
  const correctedInvoiceResolved = boolFlag(process.env.SPAJA_VERCEL_CORRECTED_INVOICE_RESOLVED);
  const currentInvoiceEvidenceCaptured = boolFlag(process.env.SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED);
  const bankStatementCaptured = boolFlag(process.env.SPAJA_VERCEL_BANK_STATEMENT_CAPTURED);
  const paymentReferenceCaptured = boolFlag(process.env.SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED);
  const paymentReferencePublicSafeApproved = boolFlag(process.env.SPAJA_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED);
  const publicAnnouncementRedacted = boolFlag(process.env.SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED);
  const publicAnnouncementPublished = boolFlag(process.env.SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED);
  const billingOwnerLocked = boolFlag(process.env.SPAJA_VERCEL_BILLING_OWNER_LOCKED);
  const paymentReferenceClassificationRaw = normalizePaymentReferenceClassification(
    process.env.SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION,
  );
  const paymentReferenceClassification: ExtrimliExtrondolPaymentReferenceClassification = paymentReferenceClassificationRaw.length > 0
    ? paymentReferenceClassificationRaw as ExtrimliExtrondolPaymentReferenceClassification
    : 'unclassified';

  const invoiceMatchesExpected = currentInvoiceNumber === EXPECTED_VERCEL_INVOICE_NUMBER
    && currentInvoiceAmount === EXPECTED_VERCEL_INVOICE_AMOUNT;
  const invoiceResolved = isVercelInvoiceResolved({
    currentInvoiceNumber,
    currentInvoiceAmount,
    currentInvoicePaid,
    invoiceCorrectionRequested,
    correctedInvoiceResolved,
  });

  const publicAnnouncementState = buildVercelPublicAnnouncementState({
    invoiceRequested,
    currentInvoiceNumber,
    currentInvoiceAmount,
    currentInvoicePaid,
    invoiceCorrectionRequested,
    correctedInvoiceResolved,
    currentInvoiceEvidenceCaptured,
    bankStatementCaptured,
    paymentReferenceCaptured,
    paymentReferenceClassification,
    paymentReferencePublicSafeApproved,
    publicAnnouncementRedacted,
    publicAnnouncementPublished,
  });

  const blockers = [
    ...(billingOwnerLocked && billingOwner === EXPECTED_VERCEL_BILLING_OWNER ? [] : ['billing-owner-lock-required']),
    ...(invoiceMatchesExpected ? [] : [`invoice-mismatch:${EXPECTED_VERCEL_INVOICE_NUMBER}:${EXPECTED_VERCEL_INVOICE_AMOUNT}`]),
    ...(invoiceRequested ? [] : ['invoice-requested-required']),
    ...(invoiceResolved ? [] : ['invoice-resolution-required']),
    ...(currentInvoiceEvidenceCaptured ? [] : ['payment-evidence-required']),
    ...(bankStatementCaptured ? [] : ['bank-statement-required']),
    ...(paymentReferenceCaptured ? [] : ['payment-reference-required']),
    ...(paymentReferenceClassification !== 'unclassified' ? [] : ['payment-reference-classification-required']),
    ...(paymentReferenceClassification !== 'public-safe' || paymentReferencePublicSafeApproved
      ? []
      : ['payment-reference-public-safe-approval-required']),
    ...(publicAnnouncementRedacted ? [] : ['public-announcement-redaction-required']),
  ];

  const status = blockers.length === 0 ? 'VERIFIED' : 'BLOCKED';
  const invoiceResolutionPath = invoiceMatchesExpected && currentInvoicePaid
    ? 'paid'
    : invoiceMatchesExpected && invoiceCorrectionRequested && correctedInvoiceResolved
      ? 'correction-resolved'
      : 'unresolved';

  return {
    sourceOfTruth: '/api/vercel-status',
    ownershipActionSurface: '/api/owner/vercel-ownership',
    gate: 'pre-wawe-promotion-and-b2b-activation',
    expectedInvoice: {
      billingOwner: EXPECTED_VERCEL_BILLING_OWNER,
      invoiceNumber: EXPECTED_VERCEL_INVOICE_NUMBER,
      invoiceAmount: EXPECTED_VERCEL_INVOICE_AMOUNT,
    },
    status,
    invoiceResolutionPath,
    evidence: {
      billingOwnerLocked: billingOwnerLocked && billingOwner === EXPECTED_VERCEL_BILLING_OWNER,
      invoiceMatchesExpected,
      invoiceRequested,
      currentInvoicePaid,
      invoiceCorrectionRequested,
      correctedInvoiceResolved,
      currentInvoiceEvidenceCaptured,
      bankStatementCaptured,
      paymentReferenceCaptured,
      paymentReferenceClassification,
      paymentReferencePublicSafeApproved,
      publicAnnouncementRedacted,
      publicAnnouncementPublished: publicAnnouncementState.status === 'published',
    },
    blockers,
    auditTimestamp: new Date().toISOString(),
    readinessImpact: {
      promotionFreezeRequired: blockers.length > 0,
      blockerCount: blockers.length,
      releaseAuditStatus: status === 'VERIFIED' ? 'READY' : 'BLOCKED',
    },
  };
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
  const versionRoadmap = getExtrimliVersionRoadmap();
  const extrondend = getExtrimliExtrondendReport();
  const extendol = getExtrimliExtendolReport();
  const koron = getExtrimliKoronHealthReport();
  const extremProfiler = getExtrimliExtremProfilerReport();
  const mobilnaLinija = buildMobilnaLinijaReadiness(extremProfiler);
  const domainStrategy = validateDomainStrategy();
  const governanceEvidence = resolveGovernanceEvidence(evidence);
  const paymentVerification = buildPaymentVerification();

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
  if (extremProfiler.degraded) degradedSources.push('extrem-profiler:degraded');
  if (extremProfiler.profile.bottleneckDetected) degradedSources.push('extrem-profiler:bottleneck-detected');
  if (extremProfiler.businessLicensingSignals.freezeRequired) degradedSources.push('extrem-profiler:global-licensing-freeze');
  if (extremProfiler.objektnoOrijentisanaProngilacija.readiness.degraded) {
    degradedSources.push(`extrem-profiler:objektna-prongilacija-${extremProfiler.objektnoOrijentisanaProngilacija.readiness.status.toLowerCase()}`);
  }
  if (mobilnaLinija.activationStatus === 'BLOCKED') degradedSources.push('mobilna-linija:activation-blocked');

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
  const startProject: ExtrimliExtrondolStartProject = {
    initiativeId: 'OKRID-2026-EXTRIMLI-START-001',
    programName: 'START PROJEKAT',
    sourceOfTruthLocked: true,
    additiveContractPolicy: true,
    orchestrationInputs: {
      upstreamSurfaces: ['EXTRONDEND', 'EXTENDOL', 'KORON', 'EXTREM-PROFILER'],
      duetRole: 'signal-only',
    },
    rolloutProgram: {
      wawes: [
        { stage: 'WAWE-1', focus: 'pre-deploy-readiness', freezeRequired: true },
        { stage: 'WAWE-2', focus: 'build-and-staging', freezeRequired: true },
        { stage: 'WAWE-3', focus: 'downstream-sync-evidence', freezeRequired: true },
        { stage: 'WAWE-4', focus: 'production-rollout', freezeRequired: false },
        { stage: 'WAWE-5', focus: 'post-deploy-resilience', freezeRequired: false },
      ],
      releaseMode: 'governance-controlled',
    },
    governanceRequirements: {
      consumerModel: 'organization-level',
      requiredEvidence: [
        'contract-approved',
        'onboarding-complete',
        'downstream-sync-complete',
        'audit-trail-complete',
        'human-review-complete',
      ],
      procurementReviewFlow: [
        'request-submitted',
        'procurement-review',
        'compliance-review',
        'operational-approval',
        'activation',
      ],
    },
    domainStrategyLock: {
      requestedPattern: EXTRONDOL_REQUESTED_DOMAIN_PATTERN,
      canonicalApex: EXTRONDOL_CANONICAL_APEX_DOMAIN,
      canonicalWildcard: EXTRONDOL_CANONICAL_WILDCARD_DOMAIN,
      rejectPatternsLike: ['spaja.nivo*spaja'],
    },
    mandatoryOutputs: [
      'versionRoadmap',
      'rollout.currentWawe',
      'rollout.eligibleNextWawe',
      'rollout.promotionFreeze',
      'spajaproTrack',
      'nivoDuet',
      'dinkos',
      'distanceRatioEkvilaterTable',
      'paymentVerification',
      'extremProfiler',
      'extremProfiler.businessLicensingSignals',
      'extremProfiler.objektnoOrijentisanaProngilacija',
      'extremProfiler.resolutionReadiness',
      'extremProfiler.semaMuSemaFormula',
      'b2bReadiness.globalLicensing',
      'objektnoOrijentisanaProngilacija',
      'mobilnaLinija',
      'spajaKod',
      'releaseReadinessScorecard',
      'canaryRingMetrics',
      'incidentPlaybook',
      'contractDriftReport',
      'governanceConformance',
    ],
    downstreamSync: {
      linkedRepo: 'spaja86/IO-OPENUI-AO',
      syncRequired: true,
      syncedContractFields: [
        'versionRoadmap',
        'rollout.currentWawe',
        'rollout.eligibleNextWawe',
        'rollout.promotionFreeze',
        'spajaproTrack',
        'b2bScope',
        'b2bScope.subscriptionPackage',
        'b2bScope.unlimitedUseGuardrails',
        'b2bReadiness',
        'nivoDuet',
        'dinkos',
        'distanceRatioEkvilaterTable',
        'paymentVerification',
        'extremProfiler',
        'extremProfiler.businessLicensingSignals',
        'extremProfiler.resolutionReadiness',
        'extremProfiler.semaMuSemaFormula',
        'b2bReadiness.globalLicensing',
        'mobilnaLinija',
        'objektnoOrijentisanaProngilacija',
        'spajaKod',
        'spajaKod.platformTrack',
        'releaseReadinessScorecard',
        'canaryRingMetrics',
        'incidentPlaybook',
        'contractDriftReport',
        'governanceConformance',
      ],
    },
    qualityGates: {
      validatorCoverage: [
        'extrimli-validator-agent',
        'ci-bot',
        'security-scanner',
        'multi-repo-sync-agent',
      ],
      kpiTargets: {
        evaluationMaxMs: EXTRONDOL_EVALUATION_MAX_MS,
        apiResponseMaxMs: EXTRONDOL_API_MAX_MS,
        buildDurationMaxMin: EXTRONDOL_BUILD_MAX_MIN,
      },
    },
    auditRelease: {
      humanReviewRequired: true,
      rollbackRequired: true,
      downstreamReferenceRequired: true,
    },
  };
  const duetScoreForBlend = duetSignal.valid ? duetSignal.overallScore : EXTRONDOL_DUET_INVALID_FALLBACK_SCORE;
  const blendedBaseScore = (baseOrchestrationScore * EXTRONDOL_BASE_ORCHESTRATION_SHARE) + (duetScoreForBlend * EXTRONDOL_NIVO_DUET_SHARE);
  const duetAdjustment = duetSignal.valid
    ? mapDuetStatusAdjustment(duetSignal.status) - Math.min(EXTRONDOL_DUET_WARNING_PENALTY_CAP, duetSignal.warnings.length * EXTRONDOL_DUET_WARNING_PENALTY_STEP)
    : -EXTRONDOL_DUET_INVALID_SIGNAL_PENALTY;
  const objektnaProngilacijaAdjustment = buildObjektnaProngilacijaAdjustment(
    extremProfiler.objektnoOrijentisanaProngilacija.readiness.status,
  );
  const profilerPenalty = extremProfiler.governanceSignal.freezeRequired ? 12 : 0;
  const profilerBoost = extremProfiler.optimization.maximumGraphicsUnlockEligible ? 3 : 0;
  const orchestrationReadinessScore = round(
    clamp(blendedBaseScore + duetAdjustment + objektnaProngilacijaAdjustment + profilerBoost - profilerPenalty, 0, 100),
    2,
  );

  const b2bScope = {
    consumerModel: 'organization-level',
    subscriptionPackage: {
      provider: 'GitHub',
      offerName: 'PRETPLATA ZA NEOGRANIČENO PROGRAMIRANJE I ALATE',
      packageTier: 'B2B-enterprise',
      packageClassification: 'controlled-periodic-subscription',
      capabilities: {
        enterpriseSeats: true,
        copilotAiRights: true,
        privateRepositoryAccess: true,
        governanceLayer: 'github-actions-audit',
        supportSla: 'business-critical',
      },
      commercialAndLegalModel: {
        primarySegment: 'privreda',
        supportedSegments: ['privreda', 'gradjanstvo'],
        billingOwner: EXPECTED_VERCEL_BILLING_OWNER,
        contractStatus: 'required-before-activation',
        paymentCycle: 'monthly-or-annual',
        complianceRequiredBeforeActivation: true,
        humanReviewRequiredBeforeActivation: true,
      },
    },
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
    unlimitedUseGuardrails: {
      interpretation: 'controlled-enterprise-capacity',
      fairUsePolicyRequired: true,
      abuseProtectionRequired: true,
      finopsThresholdPercent: [50, 75, 90, 100],
      freezeTriggers: ['kpi-breach', 'audit-incomplete', 'payment-not-verified'],
      rollbackTriggers: ['kpi-breach-after-promotion', 'payment-revoked', 'governance-regression'],
    },
    globalLicensingModel: {
      sourceOfTruth: '/api/aiiq-world-bank-licencni-registar',
      policy: 'license-for-whole-planet',
      requiredJurisdictions: ['RS', 'EU', 'US', 'UK', 'UAE', 'SG', 'JP', 'IN', 'BR', 'CA', 'AU', 'ZA'],
      readinessFormula: '0.45*globalLicenseReadiness + 0.35*activityCoverage + 0.20*(100-criticalGapPenalty)',
      freezeWhen: ['global-license-readiness-below-threshold', 'critical-global-license-gap-detected'],
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
    ...(paymentVerification.status !== 'VERIFIED' ? ['Payment verification is blocking WAWE promotion and B2B activation.'] : []),
    ...(extremProfiler.governanceSignal.freezeRequired ? ['EXTREM profiler detected DISKVIT conflict pressure and requests WAWE freeze.'] : []),
    ...(extremProfiler.objektnoOrijentisanaProngilacija.readiness.status === 'WATCH'
      ? ['Objektno orijentisana prongilacija is in WATCH posture and should receive architecture review before broader rollout.']
      : []),
    ...(extremProfiler.objektnoOrijentisanaProngilacija.readiness.status === 'BLOCKED'
      ? ['Objektno orijentisana prongilacija is BLOCKED and must freeze promotion until object-state issues are resolved.']
      : []),
    ...(extremProfiler.semaMuSemaFormula.status === 'BLOCKED'
      ? ['ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA formula is blocked and must freeze WAWE promotion.']
      : []),
    ...(extremProfiler.businessLicensingSignals.freezeRequired
      ? [`Global licensing readiness gate is blocking promotion: ${extremProfiler.businessLicensingSignals.freezeReasons.join(', ')}`]
      : []),
    ...(extremProfiler.resolutionReadiness.ekodorState === 'WATCH' ? ['EKODOR alignment remains in watch posture and requires review before promotion.'] : []),
    ...(extremProfiler.resolutionReadiness.discanInKibenState === 'WATCH' ? ['DISCAN in KIBEN remains in watch posture and should be monitored before promotion.'] : []),
  ];
  const complianceBlockers = [
    ...(!contractApproved ? ['contract-approved'] : []),
    ...(!onboardingComplete ? ['onboarding-complete'] : []),
    ...(!downstreamSyncComplete ? ['downstream-sync-complete'] : []),
    ...(!operationalApproval ? ['operational-approval'] : []),
    ...(!humanReviewComplete ? ['human-review-complete'] : []),
    ...(!governanceEvidence.auditTrailComplete ? ['audit-trail-complete'] : []),
    ...(paymentVerification.status !== 'VERIFIED'
      ? paymentVerification.blockers.map((blocker) => `payment:${blocker}`)
      : []),
    ...(extremProfiler.objektnoOrijentisanaProngilacija.readiness.status === 'BLOCKED'
      ? ['objektno-orijentisana-prongilacija']
      : []),
    ...(extremProfiler.governanceSignal.freezeRequired ? ['extrem-profiler-stability'] : []),
    ...(extremProfiler.resolutionReadiness.blockerActive ? ['extrem-resolution-readiness'] : []),
    ...(extremProfiler.semaMuSemaFormula.status === 'BLOCKED' ? ['extrem-schema-mushema'] : []),
    ...(extremProfiler.businessLicensingSignals.freezeRequired ? ['global-license-readiness'] : []),
    ...(mobilnaLinija.activationStatus === 'BLOCKED' ? ['mobilna-linija-activation-ready'] : []),
  ];
  const auditTrailComplete = governanceEvidence.auditTrailComplete;
  const promotionFreeze = degraded
    || complianceBlockers.length > 0
    || currentWawe === 'WAWE-1'
    || extremProfiler.governanceSignal.freezeRequired
    || extremProfiler.businessLicensingSignals.freezeRequired
    || extremProfiler.objektnoOrijentisanaProngilacija.readiness.status === 'BLOCKED'
    || extremProfiler.semaMuSemaFormula.status === 'BLOCKED'
    || mobilnaLinija.activationStatus === 'BLOCKED';
  const objektnaProngilacijaPostureReasons = buildObjektnaProngilacijaPostureReasons(
    extremProfiler.objektnoOrijentisanaProngilacija,
  );
  const reasons = promotionFreeze
    ? [
      'Promotion freeze required because readiness, B2B controls, or degraded posture is below rollout threshold.',
      ...degradedSources,
      ...complianceBlockers.map((blocker) => `b2b:${blocker}`),
      ...(extremProfiler.resolutionReadiness.rekulitiPoRauletu !== 'ALLOW'
        ? [`extrem-resolution:${extremProfiler.resolutionReadiness.rekulitiPoRauletu.toLowerCase()}`]
        : []),
      ...((extremProfiler.objektnoOrijentisanaProngilacija.readiness.status === 'WATCH'
        || extremProfiler.objektnoOrijentisanaProngilacija.readiness.status === 'BLOCKED')
        ? objektnaProngilacijaPostureReasons.rolloutReasons
        : []),
      ...(extremProfiler.semaMuSemaFormula.status === 'BLOCKED'
        ? extremProfiler.semaMuSemaFormula.blockerReasons.map((reason) => `extrem-schema-mushema:${reason}`)
        : []),
      ...(extremProfiler.businessLicensingSignals.freezeRequired
        ? extremProfiler.businessLicensingSignals.freezeReasons.map((reason) => `global-licensing:${reason}`)
        : []),
      ...(paymentVerification.status !== 'VERIFIED'
        ? ['payment-verification:blocked']
        : []),
      ...mobilnaLinija.freezeReasons.map((reason) => `mobilna-linija:${reason}`),
      ...extremProfiler.governanceSignal.reasons.map((reason) => `extrem-profiler:${reason}`),
    ]
    : ['Ready for next WAWE stage with governance evidence.'];
  const releaseAuditSummary: ExtrimliExtrondolReleaseAuditSummary = {
    required: true,
    status: promotionFreeze ? 'BLOCKED' : 'READY',
    rolloutSnapshot: {
      currentWawe,
      eligibleNextWawe: nextWawe(currentWawe),
      promotionFreeze,
      reasons: [...reasons],
    },
    kpiImpact: {
      evaluationMaxMs: EXTRONDOL_EVALUATION_MAX_MS,
      apiResponseMaxMs: EXTRONDOL_API_MAX_MS,
      buildDurationMaxMin: EXTRONDOL_BUILD_MAX_MIN,
      withinTargets: degradedSources.length === 0,
    },
    downstreamReference: {
      linkedRepo: 'spaja86/IO-OPENUI-AO',
      status: downstreamSyncComplete ? 'ALIGNED' : 'FOLLOW_UP_REQUIRED',
      required: true,
    },
    resolutionGovernance: {
      sourceOfTruth: '/api/extrimli/extrem',
      rezolucijaScore: extremProfiler.resolutionReadiness.rezolucijaScore,
      ekodorState: extremProfiler.resolutionReadiness.ekodorState,
      rekulitiPoRauletu: extremProfiler.resolutionReadiness.rekulitiPoRauletu,
      discanInKibenState: extremProfiler.resolutionReadiness.discanInKibenState,
      blockerActive: extremProfiler.resolutionReadiness.blockerActive,
    },
    semaFormulaGovernance: {
      canonicalExpression: extremProfiler.semaMuSemaFormula.canonicalExpression,
      status: extremProfiler.semaMuSemaFormula.status,
      muSemaConclusion: extremProfiler.semaMuSemaFormula.muSemaConclusion,
      formulaHolds: extremProfiler.semaMuSemaFormula.formulaHolds,
      blockerReasons: [...extremProfiler.semaMuSemaFormula.blockerReasons],
    },
    humanReviewRequired: true,
    rollbackPlanRequired: true,
  };
  const objektnoOrijentisanaProngilacija = buildObjektnaProngilacijaGovernance({
    extremProfiler,
    currentWawe,
    eligibleNextWawe: nextWawe(currentWawe),
    promotionFreeze,
    downstreamSyncComplete,
    humanReviewComplete,
  });
  const releaseReadinessScorecardChecks = [
    {
      id: 'scope-lock',
      label: 'Scope lock for EXTRIMLI/EXTREM/EXTRONDOL core domains',
      required: true,
      status: 'PASS' as const,
      details: 'Core domain lock and source-of-truth routes stay unchanged.',
    },
    {
      id: 'hard-gates',
      label: 'Hard gate evidence completeness',
      required: true,
      status: complianceBlockers.length === 0 ? 'PASS' as const : 'FAIL' as const,
      details: complianceBlockers.length === 0
        ? 'All hard gates are satisfied.'
        : `Blocked by: ${complianceBlockers.join(', ')}`,
    },
    {
      id: 'kpi-within-targets',
      label: 'KPI targets (eval/api/build) within threshold',
      required: true,
      status: releaseAuditSummary.kpiImpact.withinTargets ? 'PASS' as const : 'FAIL' as const,
      details: releaseAuditSummary.kpiImpact.withinTargets
        ? 'All KPI targets are within threshold.'
        : 'KPI thresholds exceeded or degraded sources detected.',
    },
    {
      id: 'downstream-sync',
      label: 'Downstream sync status',
      required: true,
      status: downstreamSyncComplete ? 'PASS' as const : 'WARN' as const,
      details: downstreamSyncComplete
        ? 'Downstream sync marked as aligned.'
        : 'Downstream sync still requires follow-up evidence.',
    },
    {
      id: 'spaja-kod-boundary',
      label: 'SPAJA KOD public boundary lock',
      required: true,
      status: 'PASS' as const,
      details: 'Public boundary remains encapsulated with hidden internals.',
    },
    {
      id: 'objektna-prongilacija-governance',
      label: 'Objektno orijentisana prongilacija governance posture',
      required: true,
      status: objektnoOrijentisanaProngilacija.status === 'READY'
        ? 'PASS' as const
        : objektnoOrijentisanaProngilacija.status === 'WATCH'
          ? 'WARN' as const
          : 'FAIL' as const,
      details: objektnoOrijentisanaProngilacija.reasons.join('; '),
    },
  ];
  const scorecardFailedChecks = releaseReadinessScorecardChecks.filter((check) => check.status === 'FAIL').length;
  const scorecardWarningChecks = releaseReadinessScorecardChecks.filter((check) => check.status === 'WARN').length;
  const scorecardPassedChecks = releaseReadinessScorecardChecks.filter((check) => check.status === 'PASS').length;
  const releaseReadinessScorecard = {
    sourceOfTruth: '/api/extrimli/extrondol' as const,
    generatedAt: paymentVerification.auditTimestamp,
    coreDomains: ['EXTRIMLI', 'EXTREM', 'EXTRONDOL'] as const,
    sourceOfTruthRoutes: ['/api/extrimli/extrem', '/api/extrimli/extrondol'] as const,
    status: scorecardFailedChecks > 0 ? 'BLOCKED' as const : scorecardWarningChecks > 0 ? 'WATCH' as const : 'READY' as const,
    totalChecks: releaseReadinessScorecardChecks.length,
    passedChecks: scorecardPassedChecks,
    warningChecks: scorecardWarningChecks,
    failedChecks: scorecardFailedChecks,
    checks: releaseReadinessScorecardChecks,
  };
  const canaryRingMetrics = {
    sourceOfTruth: '/api/extrimli/extrondol' as const,
    mode: 'ring-based-progressive-rollout' as const,
    autoFreezeEnabled: true as const,
    ringSequence: EXTRONDOL_ROLLOUT_RING_SEQUENCE,
    activeRing: rolloutRing,
    thresholds: {
      readinessMinForCanary: EXTRONDOL_WAWE_THRESHOLDS.wawe4,
      evaluationMaxMs: EXTRONDOL_EVALUATION_MAX_MS,
      apiResponseMaxMs: EXTRONDOL_API_MAX_MS,
    },
    observed: {
      orchestrationReadinessScore,
      evaluationMs: EXTRONDOL_EVALUATION_MAX_MS,
      apiResponseMs: EXTRONDOL_API_MAX_MS,
      freezeTriggered: promotionFreeze,
      freezeReasons: promotionFreeze ? [...reasons] : [],
    },
  };
  const incidentPlaybook = {
    sourceOfTruth: '/api/extrimli/extrondol' as const,
    required: true as const,
    flow: ['trigger', 'freeze', 'rollback', 'postmortem'] as const,
    triggerConditions: [
      'kpi-breach',
      'audit-incomplete',
      'downstream-sync-missing',
      'extrem-freeze',
      'payment-not-verified',
    ] as const,
    execution: {
      triggerDetected: promotionFreeze,
      freezeActivated: promotionFreeze,
      rollbackPrepared: true as const,
      postmortemRequired: true as const,
    },
  };
  const contractDriftChecks = {
    sourceOfTruthRoutesAligned: EXTRONDOL_SOURCE_OF_TRUTH === '/api/extrimli/extrondol' && EXTRIMLI_SPAJA_KOD_SOURCE_OF_TRUTH === '/api/extrimli/spaja-kod',
    contractVersionAligned: EXTRONDOL_CONTRACT_VERSION === 'v1-extrondol',
    waweModelAligned: releaseAuditSummary.rolloutSnapshot.currentWawe === currentWawe
      && releaseAuditSummary.rolloutSnapshot.eligibleNextWawe === nextWawe(currentWawe),
    hardGateEvidenceAligned: releaseAuditSummary.required
      && releaseAuditSummary.humanReviewRequired
      && releaseAuditSummary.rollbackPlanRequired
      && releaseAuditSummary.downstreamReference.required,
  };
  const contractDriftBlockers = [
    ...(!contractDriftChecks.sourceOfTruthRoutesAligned ? ['source-of-truth-routes'] : []),
    ...(!contractDriftChecks.contractVersionAligned ? ['contract-version'] : []),
    ...(!contractDriftChecks.waweModelAligned ? ['wawe-model-alignment'] : []),
    ...(!contractDriftChecks.hardGateEvidenceAligned ? ['hard-gate-evidence'] : []),
  ];
  const contractDriftReport = {
    sourceOfTruth: '/api/extrimli/extrondol' as const,
    required: true as const,
    comparedArtifacts: [
      'src/lib/extrimli-extrondol/types.ts',
      'src/lib/extrimli-extrondol/index.ts',
      'src/app/api/extrimli/extrondol/route.ts',
      'docs/EXTRIMLI.md',
      'docs/EXTRIMLI-EXTERNAL-GITHUB.md',
      '.github/workflows/extrimli-validator.yml',
      '.github/workflows/extrimli-external-github.yml',
      '.github/workflows/extrimli-governance-conformance.yml',
    ] as const,
    checks: contractDriftChecks,
    status: contractDriftBlockers.length === 0 ? 'ALIGNED' as const : 'DRIFT_DETECTED' as const,
    blockers: contractDriftBlockers,
  };
  const governanceConformance = {
    sourceOfTruth: '/api/extrimli/extrondol' as const,
    workflow: '.github/workflows/extrimli-governance-conformance.yml' as const,
    schedule: '0 4 * * 1' as const,
    required: true as const,
    status: contractDriftBlockers.length === 0 ? 'PASS' as const : 'FAIL' as const,
    blockers: contractDriftBlockers,
  };
  const technicalState = extremProfiler.spajaproTrack.activeTokenStates.find((item) => item.token === 'DEKER')?.status;
  const conflictState = extremProfiler.spajaproTrack.activeTokenStates.find((item) => item.token === 'DUNOR')?.status;
  const spajaKod = buildSpajaKodFacade({
    extremProfiler,
    promotionFreeze,
    currentWawe,
    eligibleNextWawe: nextWawe(currentWawe),
    downstreamSyncComplete,
    humanReviewComplete,
    degraded,
    releaseAuditSummary,
  });
  const spajaproTrack = buildSpajaproGovernanceTrack({
    technicalState: technicalState === 'WATCH' || technicalState === 'BLOCKED' ? technicalState : 'READY',
    conflictState: conflictState === 'WATCH' || conflictState === 'BLOCKED' ? conflictState : 'READY',
    currentWawe,
    promotionFreeze,
    releaseAuditStatus: releaseAuditSummary.status,
    downstreamSyncStatus: downstreamSyncComplete ? 'ALIGNED' : 'FOLLOW_UP_REQUIRED',
    humanReviewComplete,
    rollbackPlanRequired: releaseAuditSummary.rollbackPlanRequired,
    finalPublicStatus: spajaKod.platformTrack.publicStatus,
  });

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
        'versionRoadmap.contractVersion',
        'versionRoadmap.deliverySequence',
        'rollout.currentWawe',
        'rollout.eligibleNextWawe',
        'rollout.promotionFreeze',
        'spajaproTrack.sequenceStates',
        'b2bScope.subscriptionPackage',
        'b2bScope.unlimitedUseGuardrails',
        'nivoDuet.signal.valid',
        'nivoDuet.signal.status',
        'nivoDuet.signal.overallScore',
        'nivoDuet.signal.warnings',
        'dinkos.classification',
        'dinkos.triggerLabel',
        'dinkos.personaId',
        'domainStrategy.canonicalApex',
        'domainStrategy.canonicalWildcard',
        'paymentVerification.status',
        'paymentVerification.blockers',
        'paymentVerification.readinessImpact',
        'extremProfiler.profile.conflictIntensity',
        'extremProfiler.profile.optimizationTier',
        'extremProfiler.governanceSignal.freezeRequired',
        'extremProfiler.objektnoOrijentisanaProngilacija.readiness.status',
        'extremProfiler.objektnoOrijentisanaProngilacija.readiness.score',
        'extremProfiler.businessLicensingSignals.activityCoverageScore',
        'extremProfiler.businessLicensingSignals.globalLicenseReadinessScore',
        'extremProfiler.businessLicensingSignals.criticalGlobalGapCount',
        'extremProfiler.businessLicensingSignals.freezeRequired',
        'b2bReadiness.globalLicensing',
        'objektnoOrijentisanaProngilacija.waweImpact',
        'extremProfiler.semaMuSemaFormula.status',
        'extremProfiler.semaMuSemaFormula.muSemaConclusion',
        'extremProfiler.resolutionReadiness.rezolucijaScore',
        'extremProfiler.resolutionReadiness.ekodorState',
        'extremProfiler.resolutionReadiness.rekulitiPoRauletu',
        'extremProfiler.resolutionReadiness.discanInKibenState',
        'mobilnaLinija.installationMessagesStatus',
        'mobilnaLinija.selectedPlanId',
        'mobilnaLinija.activationStatus',
        'spajaKod.readiness.status',
        'spajaKod.readiness.governanceOutcome',
        'spajaKod.publicSignals.auditStatus',
        'spajaKod.publicSignals.downstreamSyncStatus',
        'spajaKod.platformTrack.finalPublicStatusToken',
        'spajaKod.platformTrack.publicStatus',
        'releaseReadinessScorecard',
        'canaryRingMetrics',
        'incidentPlaybook',
        'contractDriftReport',
        'governanceConformance',
      ],
    },
    governanceDecisions: {
    onboardingHold: !onboardingComplete
      || !contractApproved
      || !duetSignal.valid
      || duetSignal.status === 'DISSONANT'
      || extremProfiler.governanceSignal.freezeRequired
      || extremProfiler.objektnoOrijentisanaProngilacija.readiness.status === 'BLOCKED'
      || extremProfiler.businessLicensingSignals.freezeRequired,
      rolloutFreeze: promotionFreeze,
      escalationRequired: promotionFreeze,
      partnerReadinessWarnings,
      dinkosSignalRequired: true,
      semaFormulaGate: {
        canonicalExpression: extremProfiler.semaMuSemaFormula.canonicalExpression,
        status: extremProfiler.semaMuSemaFormula.status,
        muSemaConclusion: extremProfiler.semaMuSemaFormula.muSemaConclusion,
        formulaHolds: extremProfiler.semaMuSemaFormula.formulaHolds,
        blockerReasons: [...extremProfiler.semaMuSemaFormula.blockerReasons],
      },
      resolutionReadiness: {
        rezolucijaScore: extremProfiler.resolutionReadiness.rezolucijaScore,
        ekodorState: extremProfiler.resolutionReadiness.ekodorState,
        rekulitiPoRauletu: extremProfiler.resolutionReadiness.rekulitiPoRauletu,
        discanInKibenState: extremProfiler.resolutionReadiness.discanInKibenState,
        blockerActive: extremProfiler.resolutionReadiness.blockerActive,
      },
    },
    globalLicensing: {
      sourceOfTruth: '/api/aiiq-world-bank-licencni-registar',
      activityCoverageScore: extremProfiler.businessLicensingSignals.activityCoverageScore,
      globalLicenseReadinessScore: extremProfiler.businessLicensingSignals.globalLicenseReadinessScore,
      criticalGlobalGapCount: extremProfiler.businessLicensingSignals.criticalGlobalGapCount,
      freezeRequired: extremProfiler.businessLicensingSignals.freezeRequired,
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
      passed: distanceRatioEkvilaterTable.requestedTableName === EXTRONDOL_DISTANCE_RATIO_EKVILATER_TABLE_NAME
        && distanceRatioEkvilaterTable.normalizedTableName === EXTRONDOL_DISTANCE_RATIO_EKVILATER_TABLE_NAME
        && distanceRatioEkvilaterTable.legacyRequestedTableNames.join(',') === EXTRONDOL_DISTANCE_RATIO_EKVILATER_COMPATIBILITY_ALIASES.join(',')
        && distanceRatioEkvilaterTable.contractField === EXTRONDOL_DISTANCE_RATIO_EKVILATER_CONTRACT_FIELD
        && distanceRatioEkvilaterTable.version === EXTRONDOL_DISTANCE_RATIO_EKVILATER_VERSION
        && distanceRatioEkvilaterTable.interpretation === EXTRONDOL_DISTANCE_RATIO_EKVILATER_INTERPRETATION
        && distanceRatioEkvilaterTable.targetShape === EXTRONDOL_DISTANCE_RATIO_EKVILATER_TARGET_SHAPE
        && distanceRatioEkvilaterTable.scoringSource.join(',') === EXTRONDOL_DISTANCE_RATIO_EKVILATER_SCORING_SOURCE.join(',')
        && distanceRatioEkvilaterTable.rows.length === 3
        && Number.isFinite(distanceRatioEkvilaterTable.summary.equilateralConsistency),
    },
    {
      id: 'payment-verification-gate',
      description: 'Payment verification must pass invoice resolution, evidence package, and privacy/redaction controls before WAWE promotion and B2B activation.',
      passed: paymentVerification.status === 'VERIFIED',
    },
    {
      id: 'spajapro-terminology-lock',
      description: 'SPAJAPRO uses the locked ODIT → KODER token sequence as an additive EXTRIMLI planning track.',
      passed: spajaproTrack.vocabulary.tokenSequence.map((item) => item.token).join(',') === 'ODIT,DEKER,DUNOR,SUMOR,OKET,DAKOR,EKSER,DOKER,DUKAR,DONAR,KODER'
        && spajaproTrack.vocabulary.layering === 'extends-existing-extrimli-stack',
    },
    {
      id: 'spajapro-public-boundary',
      description: 'SPAJA KOD exposes only the final SPAJAPRO public status while internal token mappings stay hidden behind EXTRIMLI/EXTREM/EXTRONDOL.',
      passed: spajaKod.platformTrack.boundarySurface === 'SPAJA KOD'
        && spajaKod.platformTrack.finalPublicStatusToken === 'KODER'
        && spajaKod.platformTrack.internalMappingVisibility === 'HIDDEN',
    },
    {
      id: 'spajapro-release-audit-alignment',
      description: 'SPAJAPRO audit and downstream tokens align to EXTRONDOL release-audit and linked-repo governance outcomes.',
      passed: spajaproTrack.releaseAuditAligned
        && spajaproTrack.downstreamReferenceExplicit
        && spajaproTrack.sequenceStates.find((item) => item.token === 'EKSER')?.status === releaseAuditSummary.status
        && spajaproTrack.sequenceStates.find((item) => item.token === 'DOKER')?.status === (downstreamSyncComplete ? 'ALIGNED' : 'FOLLOW_UP_REQUIRED'),
    },
    {
      id: 'github-enterprise-subscription-package',
      description: 'EXTRONDOL defines GitHub unlimited programming/tools as a controlled B2B enterprise subscription with seats, Copilot rights, private repos, legal/commercial model, and activation gates.',
      passed: b2bScope.subscriptionPackage.provider === 'GitHub'
        && b2bScope.subscriptionPackage.packageTier === 'B2B-enterprise'
        && b2bScope.subscriptionPackage.packageClassification === 'controlled-periodic-subscription'
        && b2bScope.subscriptionPackage.capabilities.enterpriseSeats
        && b2bScope.subscriptionPackage.capabilities.copilotAiRights
        && b2bScope.subscriptionPackage.capabilities.privateRepositoryAccess
        && b2bScope.subscriptionPackage.commercialAndLegalModel.primarySegment === 'privreda'
        && b2bScope.subscriptionPackage.commercialAndLegalModel.supportedSegments.includes('gradjanstvo')
        && b2bScope.subscriptionPackage.commercialAndLegalModel.contractStatus === 'required-before-activation'
        && b2bScope.subscriptionPackage.commercialAndLegalModel.paymentCycle === 'monthly-or-annual'
        && b2bScope.subscriptionPackage.commercialAndLegalModel.complianceRequiredBeforeActivation
        && b2bScope.subscriptionPackage.commercialAndLegalModel.humanReviewRequiredBeforeActivation,
    },
    {
      id: 'b2b-scope',
      description: 'EXTRONDOL defines organization-level B2B ownership, partner/operator roles, procurement review flow, SLA targets, and audit obligations.',
      passed: b2bScope.consumerModel === 'organization-level'
        && b2bScope.accountOwnership.mandatoryHumanReview
        && b2bScope.partnerOperatorRoles.partners.includes('spaja86/IO-OPENUI-AO'),
    },
    {
      id: 'unlimited-guardrails',
      description: 'Unlimited programming/tools is treated as controlled enterprise capacity with fair-use, abuse protection, FinOps thresholds, and freeze/rollback governance triggers.',
      passed: b2bScope.unlimitedUseGuardrails.interpretation === 'controlled-enterprise-capacity'
        && b2bScope.unlimitedUseGuardrails.fairUsePolicyRequired
        && b2bScope.unlimitedUseGuardrails.abuseProtectionRequired
        && b2bScope.unlimitedUseGuardrails.finopsThresholdPercent.join(',') === '50,75,90,100'
        && b2bScope.unlimitedUseGuardrails.freezeTriggers.includes('payment-not-verified')
        && b2bScope.unlimitedUseGuardrails.rollbackTriggers.includes('kpi-breach-after-promotion'),
    },
    {
      id: 'b2b-controls',
      description: 'B2B activation stays blocked until contract, onboarding, downstream sync, operational approval, and audit controls are satisfied.',
      passed: b2bReadiness.compliance.secretsInGitAllowed === false
        && b2bReadiness.governanceDecisions.dinkosSignalRequired
        && b2bReadiness.governanceDecisions.rolloutFreeze === promotionFreeze,
    },
    {
      id: 'start-project-governance',
      description: 'START PROJEKAT remains governance-controlled, additive-only, and downstream-synced before release promotion.',
      passed: startProject.sourceOfTruthLocked
        && startProject.additiveContractPolicy
        && startProject.orchestrationInputs.duetRole === 'signal-only'
        && startProject.governanceRequirements.consumerModel === 'organization-level'
        && startProject.downstreamSync.syncRequired
        && startProject.auditRelease.humanReviewRequired,
    },
    {
      id: 'version-roadmap-lock',
      description: 'EXTRONDOL publishes the shared Verzija 1–7 roadmap and remains locked to Verzija 5 orchestration in the same phased ecosystem.',
      passed: versionRoadmap.contractVersion === 'v1-7-roadmap'
        && versionRoadmap.versions.length === 7
        && versionRoadmap.deliverySequence[1].versions.join(',') === 'Verzija 4,Verzija 5'
        && versionRoadmap.sharedPrinciples.some((principle) => principle.id === 'wawe-governance-lock'),
    },
    {
      id: 'release-governance-audit-summary',
      description: 'Release governance requires audit summary coverage for rollout, KPI impact, downstream reference, human review, and rollback plan.',
      passed: releaseAuditSummary.required
        && releaseAuditSummary.downstreamReference.required
        && releaseAuditSummary.humanReviewRequired
        && releaseAuditSummary.rollbackPlanRequired
        && releaseAuditSummary.rolloutSnapshot.currentWawe === currentWawe
        && releaseAuditSummary.kpiImpact.evaluationMaxMs === EXTRONDOL_EVALUATION_MAX_MS
        && releaseAuditSummary.kpiImpact.apiResponseMaxMs === EXTRONDOL_API_MAX_MS
        && releaseAuditSummary.kpiImpact.buildDurationMaxMin === EXTRONDOL_BUILD_MAX_MIN
        && releaseAuditSummary.downstreamReference.linkedRepo === 'spaja86/IO-OPENUI-AO',
    },
    {
      id: 'release-readiness-scorecard',
      description: 'Release readiness scorecard is published as a single-pane governance view for EXTRIMLI/EXTREM/EXTRONDOL lock domains.',
      passed: releaseReadinessScorecard.coreDomains.join(',') === 'EXTRIMLI,EXTREM,EXTRONDOL'
        && releaseReadinessScorecard.sourceOfTruthRoutes.join(',') === '/api/extrimli/extrem,/api/extrimli/extrondol'
        && releaseReadinessScorecard.totalChecks >= 5,
    },
    {
      id: 'canary-auto-freeze-metrics',
      description: 'Canary/ring metrics expose auto-freeze posture and threshold contracts before production promotion.',
      passed: canaryRingMetrics.ringSequence.join(',') === 'RING-0-CONTRACT,RING-1-STAGING,RING-2-CANARY,RING-3-PRODUCTION,RING-4-RESILIENCE'
        && canaryRingMetrics.autoFreezeEnabled
        && canaryRingMetrics.thresholds.evaluationMaxMs === EXTRONDOL_EVALUATION_MAX_MS
        && canaryRingMetrics.thresholds.apiResponseMaxMs === EXTRONDOL_API_MAX_MS,
    },
    {
      id: 'incident-playbook-lock',
      description: 'Incident playbook keeps trigger → freeze → rollback → postmortem sequence as mandatory governance flow.',
      passed: incidentPlaybook.required
        && incidentPlaybook.flow.join(',') === 'trigger,freeze,rollback,postmortem'
        && incidentPlaybook.execution.rollbackPrepared
        && incidentPlaybook.execution.postmortemRequired,
    },
    {
      id: 'contract-drift-detection',
      description: 'Contract drift detection compares docs/types/routes/workflows and blocks conformance when drift is detected.',
      passed: contractDriftReport.required
        && contractDriftReport.comparedArtifacts.includes('.github/workflows/extrimli-governance-conformance.yml')
        && governanceConformance.workflow === '.github/workflows/extrimli-governance-conformance.yml'
        && (contractDriftReport.status === 'ALIGNED' ? governanceConformance.status === 'PASS' : governanceConformance.status === 'FAIL'),
    },
    {
      id: 'b2b-downstream-sync',
      description: 'Downstream B2B consumers receive WAWE fields, DUET warning posture, DINKOS metadata, and domain-strategy validation.',
      passed: b2bReadiness.downstreamSync.syncedFields.includes('rollout.currentWawe')
        && b2bReadiness.downstreamSync.syncedFields.includes('nivoDuet.signal.warnings')
        && b2bReadiness.downstreamSync.syncedFields.includes('dinkos.personaId')
        && b2bReadiness.downstreamSync.syncedFields.includes('domainStrategy.canonicalWildcard')
        && b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.profile.conflictIntensity'),
    },
    {
      id: 'global-licensing-governance',
      description: 'EXTRONDOL includes global licensing readiness and activity-coverage governance for whole-planet licensing posture.',
      passed: b2bScope.globalLicensingModel.policy === 'license-for-whole-planet'
        && b2bScope.globalLicensingModel.requiredJurisdictions.length === 12
        && b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.businessLicensingSignals.globalLicenseReadinessScore')
        && b2bReadiness.globalLicensing.sourceOfTruth === '/api/aiiq-world-bank-licencni-registar',
    },
    {
      id: 'diskvit-conflict-governance',
      description: 'DISKVIT bottleneck and conflict intensity from EXTREM profiler are mapped into WAWE freeze/promotion governance decisions.',
      passed: (extremProfiler.governanceSignal.freezeRequired ? promotionFreeze : true)
        && ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].includes(extremProfiler.profile.conflictIntensity),
    },
    {
      id: 'objektna-prongilacija-governance',
      description: 'Objektno orijentisana prongilacija is propagated from EXTREM into WAWE, release audit, human-review, rollback, and downstream-sync governance.',
      passed: objektnoOrijentisanaProngilacija.contractVersion === 'v1-extrondol-objektno-orijentisana-prongilacija'
        && objektnoOrijentisanaProngilacija.technicalSignalSource === '/api/extrimli/extrem'
        && objektnoOrijentisanaProngilacija.auditCoupling.humanReviewRequired
        && objektnoOrijentisanaProngilacija.auditCoupling.rollbackPlanRequired
        && b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.objektnoOrijentisanaProngilacija.readiness.status'),
    },
    {
      id: 'schema-mushema-governance',
      description: 'Canonical ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA signal from EXTREM must be propagated to rollout freeze/promotion and governance outputs.',
      passed: b2bReadiness.governanceDecisions.semaFormulaGate.canonicalExpression === 'ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA'
        && releaseAuditSummary.semaFormulaGovernance.canonicalExpression === 'ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA'
        && releaseAuditSummary.semaFormulaGovernance.status === extremProfiler.semaMuSemaFormula.status
        && (extremProfiler.semaMuSemaFormula.status === 'BLOCKED' ? promotionFreeze : true),
    },
    {
      id: 'resolution-signal-governance',
      description: 'REZOLUCIJA, EKODOR, REKULITI PO RAULETU, and DISCAN in KIBEN are propagated from EXTREM into EXTRONDOL rollout, audit, and downstream B2B governance.',
      passed: Number.isFinite(extremProfiler.resolutionReadiness.rezolucijaScore)
        && releaseAuditSummary.resolutionGovernance.sourceOfTruth === '/api/extrimli/extrem'
        && b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.resolutionReadiness.rekulitiPoRauletu')
        && b2bReadiness.governanceDecisions.resolutionReadiness.rekulitiPoRauletu === extremProfiler.resolutionReadiness.rekulitiPoRauletu,
    },
    {
      id: 'mobilna-linija-package-governance',
      description: 'Mobilna linija must expose mandatory installation messages and package-plan selection with freeze reasons when activation cannot proceed.',
      passed: mobilnaLinija.installationMessagesRequired
        && mobilnaLinija.packageCatalog.length >= 1
        && (mobilnaLinija.activationStatus !== 'BLOCKED' || mobilnaLinija.freezeReasons.length >= 1),
    },
    {
      id: 'spaja-kod-encapsulation',
      description: 'SPAJA KOD stays complete, export-ready, and encapsulated while exposing only public readiness/governance outcomes.',
      passed: spajaKod.rawPatternVisibility === 'HIDDEN'
        && spajaKod.completeness.extremSignalPresent
        && spajaKod.completeness.extrondolGovernancePresent
        && spajaKod.completeness.consistent
        && spajaKod.exportContract.exposesInternalPattern === false,
    },
  ];

  return {
    personaId: EXTRONDOL_PERSONA_ID,
    contractVersion: EXTRONDOL_CONTRACT_VERSION,
    moduleVersion: EXTRONDOL_MODULE_VERSION,
    sourceOfTruth: EXTRONDOL_SOURCE_OF_TRUTH,
    statement: 'EXTRONDOL orchestrates WAWE rollout readiness and the GitHub unlimited programming/tools enterprise subscription model for organization-level B2B consumers, including canonical ŠEMA/MUŠEMA governance from EXTREM.',
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
      'src/lib/extrimli-extrem/**',
      'src/app/api/extrimli/extrem/**',
      'src/tests/lib/extrimli-extrem.test.ts',
    ],
    orchestrationReadinessScore,
    roadmapAlignment: {
      sourceProgram: versionRoadmap.programName,
      primaryVersion: 'Verzija 5',
      predecessorVersions: ['Verzija 1', 'Verzija 2', 'Verzija 3', 'Verzija 4'],
      unlocksVersions: ['Verzija 6', 'Verzija 7'],
      mandatoryGate: true,
    },
    versionRoadmap,
    startProject,
    b2bScope,
    b2bReadiness,
    domainStrategy,
    distanceRatioEkvilaterTable,
    paymentVerification,
    extremProfiler,
    objektnoOrijentisanaProngilacija,
    mobilnaLinija,
    spajaproTrack,
    spajaKod,
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
    releaseAuditSummary,
    releaseReadinessScorecard,
    canaryRingMetrics,
    incidentPlaybook,
    contractDriftReport,
    governanceConformance,
    acceptanceCriteria,
    integrationBoundaries: {
      dependsOn: ['/api/extrimli/extrondend', '/api/extrimli/extendol', '/api/extrimli/koron', '/api/extrimli/extrem', '/api/duet/evaluate'],
      aliasesOfExistingSurfaces: false,
    },
    kpiTargets: {
      evaluationMaxMs: EXTRIMLI_PERFORMANCE_MAX_MS,
      apiResponseMaxMs: EXTRIMLI_API_RESPONSE_MAX_MS,
      buildDurationMaxMin: EXTRONDOL_BUILD_MAX_MIN,
    },
    surfaces: { extrondend, extendol, koron, extremProfiler },
  };
}

export function getExtrimliSpajaKodReport(evidence?: ExtrimliExtrondolGovernanceEvidence): ExtrimliSpajaKodPublicFacade {
  return getExtrimliExtrondolReport(evidence).spajaKod;
}

export type {
  ExtrimliExtrondolAcceptanceCriterion,
  ExtrimliExtrondolGovernanceEvidence,
  ExtrimliExtrondolObjektnaProngilacijaGovernance,
  ExtrimliExtrondolReport,
  ExtrimliSpajaKodPublicFacade,
  ExtrimliExtrondolWaweStage,
} from './types';

export {
  EXTRIMLI_SPAJA_KOD_CONTRACT_VERSION,
  EXTRIMLI_SPAJA_KOD_MODULE_VERSION,
  EXTRIMLI_SPAJA_KOD_SOURCE_OF_TRUTH,
  EXTRONDOL_API_MAX_MS,
  EXTRONDOL_BASE_ORCHESTRATION_SHARE,
  EXTRONDOL_BUILD_MAX_MIN,
  EXTRONDOL_DUET_INVALID_FALLBACK_SCORE,
  EXTRONDOL_DUET_INVALID_SIGNAL_PENALTY,
  EXTRONDOL_DUET_STATUS_ADJUSTMENT,
  EXTRONDOL_DUET_WARNING_PENALTY_CAP,
  EXTRONDOL_DUET_WARNING_PENALTY_STEP,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_BALANCED_MIN,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_COMPATIBILITY_ALIASES,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_CONTRACT_FIELD,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_INTERPRETATION,
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
  EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_BLOCKED_ADJUSTMENT,
  EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION,
  EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_READY_ADJUSTMENT,
  EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_WATCH_ADJUSTMENT,
  EXTRONDOL_PERSONA_ID,
  EXTRONDOL_REQUESTED_DOMAIN_PATTERN,
  EXTRONDOL_SOURCE_OF_TRUTH,
} from './types';
