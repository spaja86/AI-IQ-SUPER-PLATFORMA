import type { ExtrimliExtrondendReport } from '../extrimli-extrondend';
import type { ExtrimliExtendolReport } from '../extrimli-extendol';
import type { ExtrimliKoronHealthReport } from '../extrimli-koron';
import type { DuetInput, DuetStatus } from '../duet';
import type { ExtrimliExtremProfilerReport, ExtrimliSpajaKodPublicStatus } from '../extrimli-extrem';
import type { ExtrimliVersionRoadmap, ExtrimliVersionRoadmapVersionId } from '../extrimli-version-roadmap';
import type {
  ExtrimliDokerKuratIzekDokarGovernanceTrack,
  ExtrimliDokerKuratIzekDokarPublicBoundaryStatus,
} from '../extrimli-doker-kurat-izek-dokar-track';
import type {
  ExtrimliSpajaproGovernanceTrack,
  ExtrimliSpajaproPublicBoundaryStatus,
} from '../extrimli-spajapro-track';
import { EXTRIMLI_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION } from '../extrimli-objektna-prongilacija-contract';
import { EXTRIMLI_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION } from '../extrimli-objektno-orijentisana-reprodukcija-contract';
import { EXTRIMLI_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_CONTRACT_VERSION } from '../extrimli-objektno-orijentusano-uzdizanje-epskih-elikvadenata-contract';

export type ExtrimliExtrondolWaweStage = 'WAWE-1' | 'WAWE-2' | 'WAWE-3' | 'WAWE-4' | 'WAWE-5';
export type ExtrimliExtrondolMobilnaLinijaActivationStatus = 'READY' | 'WATCH' | 'BLOCKED';

export interface ExtrimliExtrondolAcceptanceCriterion {
  id: string;
  description: string;
  passed: boolean;
}

export interface ExtrimliExtrondolDomainStrategy {
  requestedPattern: string;
  requestedPatternRejected: boolean;
  canonicalApex: string;
  canonicalWildcard: string;
  valid: boolean;
  invalidReason: string | null;
}

export interface ExtrimliExtrondolNivoDuetSignal {
  valid: boolean;
  status: DuetStatus;
  overallScore: number;
  warnings: string[];
}

export interface ExtrimliExtrondolNivoDuetSection {
  sourceOfTruth: string;
  triggerLabel: string;
  mapping: {
    fromDuet: ['valid', 'status', 'overallScore', 'warnings'];
    toOrchestration: ['rollout.currentWawe', 'rollout.eligibleNextWawe', 'rollout.promotionFreeze'];
  };
  duetInputProfile: {
    objective: DuetInput['objective'];
    mode: DuetInput['mode'];
    energyMatch: DuetInput['energyMatch'];
    clarityScore: number;
    reciprocityScore: number;
    trustScore: number;
    rhythmScore: number;
    tensionLevel: number;
    sharedWindowHours: number;
  };
  signal: ExtrimliExtrondolNivoDuetSignal;
}

export interface ExtrimliExtrondolDinkosContract {
  domain: 'DINKOS';
  classification: 'signal';
  ownership: string;
  triggerLabel: string;
  personaId: string;
  routeSegment: 'nivo-duet';
  degradedMode: 'partial-payload-no-500';
}

export interface ExtrimliExtrondolMobilnaLinijaPackagePlan {
  id: string;
  name: string;
  tier: 'BASIC' | 'SMART' | 'PRO';
  monthlyPriceEur: number;
  dataCapGb: number;
  supportsEsim: boolean;
  minSignalStrengthPercent: number;
  installationMessage: string;
}

export interface ExtrimliExtrondolMobilnaLinijaReadiness {
  lineType: 'Mobilna linija';
  installationMessagesRequired: true;
  installationMessagesStatus: ExtrimliExtrondolMobilnaLinijaActivationStatus;
  deviceCompatibilityStatus: ExtrimliExtrondolMobilnaLinijaActivationStatus;
  packageCatalog: readonly ExtrimliExtrondolMobilnaLinijaPackagePlan[];
  selectedPlanId: string | null;
  activationStatus: ExtrimliExtrondolMobilnaLinijaActivationStatus;
  selectionRules: readonly string[];
  freezeReasons: string[];
}

export interface ExtrimliExtrondolB2bScope {
  consumerModel: 'organization-level';
  subscriptionPackage: {
    provider: 'GitHub';
    offerName: 'PRETPLATA ZA NEOGRANIČENO PROGRAMIRANJE I ALATE';
    packageTier: 'B2B-enterprise';
    packageClassification: 'controlled-periodic-subscription';
    capabilities: {
      enterpriseSeats: true;
      copilotAiRights: true;
      privateRepositoryAccess: true;
      governanceLayer: 'github-actions-audit';
      supportSla: 'business-critical';
    };
    commercialAndLegalModel: {
      primarySegment: 'privreda';
      supportedSegments: readonly ['privreda', 'gradjanstvo'];
      billingOwner: string;
      contractStatus: 'required-before-activation';
      paymentCycle: 'monthly-or-annual';
      complianceRequiredBeforeActivation: true;
      humanReviewRequiredBeforeActivation: true;
    };
  };
  accountOwnership: {
    owner: string;
    operatingEntity: string;
    mandatoryHumanReview: true;
  };
  partnerOperatorRoles: {
    owner: readonly string[];
    operators: readonly string[];
    partners: readonly string[];
    reviewers: readonly string[];
  };
  procurementReviewFlow: {
    steps: readonly ['request-submitted', 'procurement-review', 'compliance-review', 'operational-approval', 'activation'];
    activationRequires: readonly ['contract-approved', 'onboarding-complete', 'downstream-sync-complete', 'human-review-complete'];
  };
  slaExpectations: {
    tier: 'enterprise-governed';
    evaluationMaxMs: number;
    apiResponseMaxMs: number;
    buildDurationMaxMin: number;
    supportWindow: 'business-critical';
  };
  unlimitedUseGuardrails: {
    interpretation: 'controlled-enterprise-capacity';
    fairUsePolicyRequired: true;
    abuseProtectionRequired: true;
    finopsThresholdPercent: readonly [50, 75, 90, 100];
    freezeTriggers: readonly ['kpi-breach', 'audit-incomplete', 'payment-not-verified'];
    rollbackTriggers: readonly ['kpi-breach-after-promotion', 'payment-revoked', 'governance-regression'];
  };
  globalLicensingModel: {
    sourceOfTruth: '/api/aiiq-world-bank-licencni-registar';
    policy: 'license-for-whole-planet';
    requiredJurisdictions: readonly ['RS', 'EU', 'US', 'UK', 'UAE', 'SG', 'JP', 'IN', 'BR', 'CA', 'AU', 'ZA'];
    readinessFormula: '0.45*globalLicenseReadiness + 0.35*activityCoverage + 0.20*(100-criticalGapPenalty)';
    freezeWhen: readonly ['global-license-readiness-below-threshold', 'critical-global-license-gap-detected'];
  };
  auditObligations: readonly string[];
}

export interface ExtrimliExtrondolB2bReadiness {
  tenant: {
    organizationId: string;
    organizationName: string;
    accountOwner: string;
    environmentTier: 'B2B';
    rolloutRing: 'RING-0-CONTRACT' | 'RING-1-STAGING' | 'RING-2-CANARY' | 'RING-3-PRODUCTION' | 'RING-4-RESILIENCE';
  };
  support: {
    slaTier: 'enterprise-governed';
    status: 'ACTIVE' | 'ATTENTION';
    escalationRequired: boolean;
  };
  compliance: {
    contractApproved: boolean;
    onboardingComplete: boolean;
    operationalApproval: boolean;
    humanReviewComplete: boolean;
    auditTrailComplete: boolean;
    secretsInGitAllowed: false;
    blockers: string[];
  };
  downstreamSync: {
    linkedRepo: string;
    status: 'ALIGNED' | 'FOLLOW_UP_REQUIRED';
    syncedFields: readonly string[];
  };
  governanceDecisions: {
    onboardingHold: boolean;
    rolloutFreeze: boolean;
    escalationRequired: boolean;
    partnerReadinessWarnings: readonly string[];
    dinkosSignalRequired: true;
    resolutionReadiness: {
      rezolucijaScore: number;
      ekodorState: ExtrimliExtremProfilerReport['resolutionReadiness']['ekodorState'];
      rekulitiPoRauletu: ExtrimliExtremProfilerReport['resolutionReadiness']['rekulitiPoRauletu'];
      discanInKibenState: ExtrimliExtremProfilerReport['resolutionReadiness']['discanInKibenState'];
      blockerActive: boolean;
    };
    semaFormulaGate: {
      canonicalExpression: 'ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA';
      status: ExtrimliExtremProfilerReport['semaMuSemaFormula']['status'];
      muSemaConclusion: ExtrimliExtremProfilerReport['semaMuSemaFormula']['muSemaConclusion'];
      formulaHolds: boolean;
      blockerReasons: string[];
    };
    petljeGovernance: {
      sourceOfTruth: '/api/extrimli/extrem';
      readinessScore: number;
      conflictScore: number;
      freezeRequired: boolean;
      blockedSignals: ExtrimliExtremProfilerReport['petljeSignals']['summary']['blockedSignals'];
      watchSignals: ExtrimliExtremProfilerReport['petljeSignals']['summary']['watchSignals'];
      degradedSignals: ExtrimliExtremProfilerReport['petljeSignals']['summary']['degradedSignals'];
    };
    objektnoOrijentisanaReprodukcijaGovernance: {
      sourceOfTruth: '/api/extrimli/extrem';
      status: ExtrimliExtremProfilerReport['objektnoOrijentisanaReprodukcija']['readiness']['status'];
      readinessScore: number;
      reviewRequiredBeforeWideRollout: boolean;
      blockerReasons: string[];
      watchReasons: string[];
    };
    epicElikvadentiGovernance: {
      sourceOfTruth: '/api/extrimli/extrem';
      status: ExtrimliExtremProfilerReport['objektnoOrijentusanoUzdizanjeEpskihElikvadenata']['readiness']['status'];
      readinessScore: number;
      reviewRequiredBeforeWideRollout: boolean;
      blockerReasons: string[];
      watchReasons: string[];
    };
  };
  globalLicensing: {
    sourceOfTruth: '/api/aiiq-world-bank-licencni-registar';
    activityCoverageScore: number;
    globalLicenseReadinessScore: number;
    criticalGlobalGapCount: number;
    freezeRequired: boolean;
  };
}

export interface ExtrimliExtrondolGovernanceEvidence {
  auditTrailComplete?: boolean;
  downstreamSyncComplete?: boolean;
  humanReviewComplete?: boolean;
  onboardingComplete?: boolean;
}

export interface ExtrimliExtrondolObjektnaProngilacijaGovernance {
  term: 'Objektno orijentisana prongilacija';
  sourceOfTruth: '/api/extrimli/extrondol';
  technicalSignalSource: '/api/extrimli/extrem';
  contractVersion: typeof EXTRIMLI_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION;
  additiveOnly: true;
  status: ExtrimliExtremProfilerReport['objektnoOrijentisanaProngilacija']['readiness']['status'];
  readinessScore: number;
  ownershipModel: {
    extrem: 'technical-object-state-signal';
    extrondol: 'wawe-orchestration-audit-consumer';
    spajaKod: 'public-encapsulated-boundary';
  };
  waweImpact: {
    currentWawe: ExtrimliExtrondolWaweStage;
    eligibleNextWawe: ExtrimliExtrondolWaweStage;
    promotionFreeze: boolean;
    stageRules: readonly [
      { stage: 'WAWE-1'; requirement: string },
      { stage: 'WAWE-2'; requirement: string },
      { stage: 'WAWE-3'; requirement: string },
      { stage: 'WAWE-4'; requirement: string },
      { stage: 'WAWE-5'; requirement: string }
    ];
  };
  auditCoupling: {
    releaseAuditSummaryRequired: true;
    humanReviewRequired: true;
    rollbackPlanRequired: true;
    downstreamSyncRequired: true;
  };
  reasons: string[];
}

export interface ExtrimliExtrondolObjektnoOrijentisanaReprodukcijaGovernance {
  term: 'Objektno orijentisana reprodukcija';
  sourceOfTruth: '/api/extrimli/extrondol';
  technicalSignalSource: '/api/extrimli/extrem';
  contractVersion: typeof EXTRIMLI_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION;
  additiveOnly: true;
  status: ExtrimliExtremProfilerReport['objektnoOrijentisanaReprodukcija']['readiness']['status'];
  readinessScore: number;
  governanceVisibility: 'audit-safe-readiness-only';
  ownershipModel: {
    extrem: 'technical-reproduction-signal';
    extrondol: 'wawe-orchestration-audit-consumer';
    spajaKod: 'public-encapsulated-boundary';
  };
  waweImpact: {
    currentWawe: ExtrimliExtrondolWaweStage;
    eligibleNextWawe: ExtrimliExtrondolWaweStage;
    promotionFreeze: boolean;
    reviewRequiredBeforeWideRollout: boolean;
  };
  auditCoupling: {
    releaseAuditSummaryRequired: true;
    humanReviewRequired: true;
    rollbackPlanRequired: true;
    downstreamSyncRequired: true;
  };
  reasons: string[];
}

export interface ExtrimliExtrondolEpicElikvadentiGovernance {
  term: 'Objektno orijentusano uzdizanje epskih elikvadenata';
  sourceOfTruth: '/api/extrimli/extrondol';
  technicalSignalSource: '/api/extrimli/extrem';
  contractVersion: typeof EXTRIMLI_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_CONTRACT_VERSION;
  additiveOnly: true;
  status: ExtrimliExtremProfilerReport['objektnoOrijentusanoUzdizanjeEpskihElikvadenata']['readiness']['status'];
  readinessScore: number;
  governanceVisibility: 'audit-safe-readiness-only';
  ownershipModel: {
    extrem: 'technical-epic-equivalent-signal';
    extrondol: 'wawe-orchestration-audit-consumer';
    spajaKod: 'public-encapsulated-boundary';
  };
  waweImpact: {
    currentWawe: ExtrimliExtrondolWaweStage;
    eligibleNextWawe: ExtrimliExtrondolWaweStage;
    promotionFreeze: boolean;
    reviewRequiredBeforeWideRollout: boolean;
  };
  auditCoupling: {
    releaseAuditSummaryRequired: true;
    humanReviewRequired: true;
    rollbackPlanRequired: true;
    downstreamSyncRequired: true;
  };
  reasons: string[];
}

export interface ExtrimliExtrondolPetljeGovernance {
  term: 'EXTRIMLI EXTRONDOL EXTREM PETLJE';
  sourceOfTruth: '/api/extrimli/extrondol';
  technicalSignalSource: '/api/extrimli/extrem';
  additiveOnly: true;
  ownershipModel: {
    extrem: 'technical-petlja-signal-layer';
    extrondol: 'wawe-orchestration-audit-consumer';
    direktModule: 'standalone-direct-communication-module-preserved';
  };
  status: 'READY' | 'WATCH' | 'BLOCKED';
  readinessScore: number;
  conflictScore: number;
  freezeRequired: boolean;
  blockedSignals: ExtrimliExtremProfilerReport['petljeSignals']['summary']['blockedSignals'];
  watchSignals: ExtrimliExtremProfilerReport['petljeSignals']['summary']['watchSignals'];
  degradedSignals: ExtrimliExtremProfilerReport['petljeSignals']['summary']['degradedSignals'];
  rolloutImpact: {
    currentWawe: ExtrimliExtrondolWaweStage;
    eligibleNextWawe: ExtrimliExtrondolWaweStage;
    promotionFreeze: boolean;
  };
  auditCoupling: {
    releaseAuditSummaryRequired: true;
    humanReviewRequired: true;
    rollbackPlanRequired: true;
    downstreamSyncRequired: true;
  };
  reasons: string[];
}

export interface ExtrimliExtrondolKraljevskiPravniUniverzitetGovernance {
  term: 'KRALJEVSKI PRAVNI UNIVERZITET';
  sourceOfTruth: '/api/extrimli/extrondol';
  technicalSignalSource: '/api/extrimli/extrem';
  contractVersion: ExtrimliExtremProfilerReport['kraljevskiPravniUniverzitetTrack']['contractVersion'];
  additiveOnly: true;
  governanceVisibility: 'audit-safe-governance-only';
  status: ExtrimliExtremProfilerReport['kraljevskiPravniUniverzitetTrack']['readiness']['status'];
  completenessScore: number;
  consistencyScore: number;
  conflictScore: number;
  legislativeBoundary: {
    sourceMaterialPolicy: 'documentation-only';
    primaryCharter: 'POVELJA O ZAKONODAVNOM PRAVU';
    citizenshipOrder: 'PRAVNI POREDAK PO PRAVU GRAĐANSTVA';
    publicBoundary: 'SPAJA KOD';
  };
  releaseChecklist: {
    currentWawe: ExtrimliExtrondolWaweStage;
    eligibleNextWawe: ExtrimliExtrondolWaweStage;
    promotionFreeze: boolean;
    humanReviewRequired: true;
    rollbackPlanRequired: true;
    downstreamReferenceRequired: true;
    auditSummaryRequired: true;
  };
  waweImpact: 'promotion-frozen' | 'review-before-promotion' | 'eligible-for-promotion';
  publicStatus: 'SAFE_SUMMARY_READY' | 'SAFE_SUMMARY_REVIEW' | 'SAFE_SUMMARY_BLOCKED';
  reasons: string[];
  warnings: string[];
  blockerReasons: string[];
}

export interface ExtrimliExtrondolReleaseAuditSummary {
  required: true;
  status: 'READY' | 'BLOCKED';
  rolloutSnapshot: {
    currentWawe: ExtrimliExtrondolWaweStage;
    eligibleNextWawe: ExtrimliExtrondolWaweStage;
    promotionFreeze: boolean;
    reasons: string[];
  };
  kpiImpact: {
    evaluationMaxMs: number;
    apiResponseMaxMs: number;
    buildDurationMaxMin: number;
    withinTargets: boolean;
  };
  downstreamReference: {
    linkedRepo: string;
    status: 'ALIGNED' | 'FOLLOW_UP_REQUIRED';
    required: true;
  };
  resolutionGovernance: {
    sourceOfTruth: '/api/extrimli/extrem';
    rezolucijaScore: number;
    ekodorState: ExtrimliExtremProfilerReport['resolutionReadiness']['ekodorState'];
    rekulitiPoRauletu: ExtrimliExtremProfilerReport['resolutionReadiness']['rekulitiPoRauletu'];
    discanInKibenState: ExtrimliExtremProfilerReport['resolutionReadiness']['discanInKibenState'];
    blockerActive: boolean;
  };
  semaFormulaGovernance: {
    canonicalExpression: 'ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA';
    status: ExtrimliExtremProfilerReport['semaMuSemaFormula']['status'];
    muSemaConclusion: ExtrimliExtremProfilerReport['semaMuSemaFormula']['muSemaConclusion'];
    formulaHolds: boolean;
    blockerReasons: string[];
  };
  petljeGovernance: {
    sourceOfTruth: '/api/extrimli/extrem';
    readinessScore: number;
    conflictScore: number;
    freezeRequired: boolean;
    blockedSignals: ExtrimliExtremProfilerReport['petljeSignals']['summary']['blockedSignals'];
    watchSignals: ExtrimliExtremProfilerReport['petljeSignals']['summary']['watchSignals'];
    degradedSignals: ExtrimliExtremProfilerReport['petljeSignals']['summary']['degradedSignals'];
  };
  objektnoOrijentisanaReprodukcijaGovernance: {
    sourceOfTruth: '/api/extrimli/extrem';
    status: ExtrimliExtremProfilerReport['objektnoOrijentisanaReprodukcija']['readiness']['status'];
    readinessScore: number;
    reviewRequiredBeforeWideRollout: boolean;
    blockerReasons: string[];
    watchReasons: string[];
  };
  epicElikvadentiGovernance: {
    sourceOfTruth: '/api/extrimli/extrem';
    status: ExtrimliExtremProfilerReport['objektnoOrijentusanoUzdizanjeEpskihElikvadenata']['readiness']['status'];
    readinessScore: number;
    reviewRequiredBeforeWideRollout: boolean;
    blockerReasons: string[];
    watchReasons: string[];
  };
  kraljevskiPravniUniverzitetGovernance: {
    sourceOfTruth: '/api/extrimli/extrem';
    status: ExtrimliExtremProfilerReport['kraljevskiPravniUniverzitetTrack']['readiness']['status'];
    completenessScore: number;
    consistencyScore: number;
    conflictScore: number;
    reviewRequiredBeforePromotion: boolean;
    blockerReasons: string[];
    watchReasons: string[];
  };
  humanReviewRequired: true;
  rollbackPlanRequired: true;
}

export interface ExtrimliExtrondolReleaseReadinessScorecardCheck {
  id: string;
  label: string;
  required: boolean;
  status: 'PASS' | 'WARN' | 'FAIL';
  details: string;
}

export interface ExtrimliExtrondolReleaseReadinessScorecard {
  sourceOfTruth: '/api/extrimli/extrondol';
  generatedAt: string;
  coreDomains: readonly ['EXTRIMLI', 'EXTREM', 'EXTRONDOL'];
  sourceOfTruthRoutes: readonly ['/api/extrimli/extrem', '/api/extrimli/extrondol'];
  status: 'READY' | 'WATCH' | 'BLOCKED';
  totalChecks: number;
  passedChecks: number;
  warningChecks: number;
  failedChecks: number;
  checks: ExtrimliExtrondolReleaseReadinessScorecardCheck[];
}

export interface ExtrimliExtrondolCanaryRingMetrics {
  sourceOfTruth: '/api/extrimli/extrondol';
  mode: 'ring-based-progressive-rollout';
  autoFreezeEnabled: true;
  ringSequence: readonly ['RING-0-CONTRACT', 'RING-1-STAGING', 'RING-2-CANARY', 'RING-3-PRODUCTION', 'RING-4-RESILIENCE'];
  activeRing: ExtrimliExtrondolB2bReadiness['tenant']['rolloutRing'];
  thresholds: {
    readinessMinForCanary: number;
    evaluationMaxMs: number;
    apiResponseMaxMs: number;
  };
  observed: {
    orchestrationReadinessScore: number;
    evaluationMs: number;
    apiResponseMs: number;
    freezeTriggered: boolean;
    freezeReasons: string[];
  };
}

export interface ExtrimliExtrondolIncidentPlaybook {
  sourceOfTruth: '/api/extrimli/extrondol';
  required: true;
  flow: readonly ['trigger', 'freeze', 'rollback', 'postmortem'];
  triggerConditions: readonly ['kpi-breach', 'audit-incomplete', 'downstream-sync-missing', 'extrem-freeze', 'payment-not-verified'];
  execution: {
    triggerDetected: boolean;
    freezeActivated: boolean;
    rollbackPrepared: true;
    postmortemRequired: true;
  };
}

export interface ExtrimliExtrondolContractDriftReport {
  sourceOfTruth: '/api/extrimli/extrondol';
  required: true;
  comparedArtifacts: readonly [
    'src/lib/extrimli-extrondol/types.ts',
    'src/lib/extrimli-extrondol/index.ts',
    'src/app/api/extrimli/extrondol/route.ts',
    'docs/EXTRIMLI.md',
    'docs/EXTRIMLI-EXTERNAL-GITHUB.md',
    '.github/workflows/extrimli-validator.yml',
    '.github/workflows/extrimli-external-github.yml',
    '.github/workflows/extrimli-governance-conformance.yml'
  ];
  checks: {
    sourceOfTruthRoutesAligned: boolean;
    contractVersionAligned: boolean;
    waweModelAligned: boolean;
    hardGateEvidenceAligned: boolean;
  };
  status: 'ALIGNED' | 'DRIFT_DETECTED';
  blockers: string[];
}

export interface ExtrimliExtrondolGovernanceConformance {
  sourceOfTruth: '/api/extrimli/extrondol';
  workflow: '.github/workflows/extrimli-governance-conformance.yml';
  schedule: '0 4 * * 1';
  required: true;
  status: 'PASS' | 'FAIL';
  blockers: string[];
}

export type ExtrimliExtrondolPaymentVerificationStatus = 'VERIFIED' | 'BLOCKED';
export type ExtrimliExtrondolPaymentResolutionPath = 'paid' | 'correction-resolved' | 'unresolved';
export type ExtrimliExtrondolPaymentReferenceClassification = 'public-safe' | 'internal-only' | 'unclassified';

export interface ExtrimliExtrondolPaymentVerification {
  sourceOfTruth: '/api/vercel-status';
  ownershipActionSurface: '/api/owner/vercel-ownership';
  gate: 'pre-wawe-promotion-and-b2b-activation';
  expectedInvoice: {
    billingOwner: string;
    invoiceNumber: string;
    invoiceAmount: string;
  };
  status: ExtrimliExtrondolPaymentVerificationStatus;
  invoiceResolutionPath: ExtrimliExtrondolPaymentResolutionPath;
  evidence: {
    billingOwnerLocked: boolean;
    invoiceMatchesExpected: boolean;
    invoiceRequested: boolean;
    currentInvoicePaid: boolean;
    invoiceCorrectionRequested: boolean;
    correctedInvoiceResolved: boolean;
    currentInvoiceEvidenceCaptured: boolean;
    bankStatementCaptured: boolean;
    paymentReferenceCaptured: boolean;
    paymentReferenceClassification: ExtrimliExtrondolPaymentReferenceClassification;
    paymentReferencePublicSafeApproved: boolean;
    publicAnnouncementRedacted: boolean;
    publicAnnouncementPublished: boolean;
  };
  blockers: string[];
  auditTimestamp: string;
  readinessImpact: {
    promotionFreezeRequired: boolean;
    blockerCount: number;
    releaseAuditStatus: 'READY' | 'BLOCKED';
  };
}

export interface ExtrimliExtrondolStartProject {
  initiativeId: 'OKRID-2026-EXTRIMLI-START-001';
  programName: 'START PROJEKAT';
  sourceOfTruthLocked: true;
  additiveContractPolicy: true;
  orchestrationInputs: {
    upstreamSurfaces: readonly ['EXTRONDEND', 'EXTENDOL', 'KORON', 'EXTREM-PROFILER'];
    duetRole: 'signal-only';
  };
  rolloutProgram: {
    wawes: readonly [
      { stage: 'WAWE-1'; focus: 'pre-deploy-readiness'; freezeRequired: true },
      { stage: 'WAWE-2'; focus: 'build-and-staging'; freezeRequired: true },
      { stage: 'WAWE-3'; focus: 'downstream-sync-evidence'; freezeRequired: true },
      { stage: 'WAWE-4'; focus: 'production-rollout'; freezeRequired: false },
      { stage: 'WAWE-5'; focus: 'post-deploy-resilience'; freezeRequired: false }
    ];
    releaseMode: 'governance-controlled';
  };
  governanceRequirements: {
    consumerModel: 'organization-level';
    requiredEvidence: readonly [
      'contract-approved',
      'onboarding-complete',
      'downstream-sync-complete',
      'audit-trail-complete',
      'human-review-complete'
    ];
    procurementReviewFlow: readonly [
      'request-submitted',
      'procurement-review',
      'compliance-review',
      'operational-approval',
      'activation'
    ];
  };
  domainStrategyLock: {
    requestedPattern: string;
    canonicalApex: string;
    canonicalWildcard: string;
    rejectPatternsLike: readonly ['spaja.nivo*spaja'];
  };
  mandatoryOutputs: readonly [
    'versionRoadmap',
    'rollout.currentWawe',
    'rollout.eligibleNextWawe',
    'rollout.promotionFreeze',
    'dokerKuratIzekDokarTrack',
    'spajaproTrack',
    'nivoDuet',
    'dinkos',
    'distanceRatioEkvilaterTable',
    'paymentVerification',
    'extremProfiler',
    'extremProfiler.businessLicensingSignals',
    'extremProfiler.objektnoOrijentisanaProngilacija',
    'extremProfiler.objektnoOrijentisanaReprodukcija',
    'extremProfiler.objektnoOrijentusanoUzdizanjeEpskihElikvadenata',
    'extremProfiler.resolutionReadiness',
    'extremProfiler.semaMuSemaFormula',
    'b2bReadiness.globalLicensing',
    'objektnoOrijentisanaProngilacija',
    'objektnoOrijentisanaReprodukcija',
    'epicElikvadenti',
    'mobilnaLinija',
    'spajaKod',
    'releaseReadinessScorecard',
    'canaryRingMetrics',
    'incidentPlaybook',
    'contractDriftReport',
    'governanceConformance'
  ];
  downstreamSync: {
    linkedRepo: 'spaja86/IO-OPENUI-AO';
    syncRequired: true;
    syncedContractFields: readonly [
      'versionRoadmap',
      'rollout.currentWawe',
      'rollout.eligibleNextWawe',
      'rollout.promotionFreeze',
      'dokerKuratIzekDokarTrack',
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
      'extremProfiler.objektnoOrijentisanaProngilacija.readiness',
      'extremProfiler.objektnoOrijentisanaReprodukcija.readiness',
      'extremProfiler.objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness',
      'b2bReadiness.globalLicensing',
      'mobilnaLinija',
      'objektnoOrijentisanaProngilacija',
      'objektnoOrijentisanaReprodukcija',
      'epicElikvadenti',
      'spajaKod',
      'spajaKod.platformTrack',
      'releaseReadinessScorecard',
      'canaryRingMetrics',
      'incidentPlaybook',
      'contractDriftReport',
      'governanceConformance'
    ];
  };
  qualityGates: {
    validatorCoverage: readonly [
      'extrimli-validator-agent',
      'ci-bot',
      'security-scanner',
      'multi-repo-sync-agent'
    ];
    kpiTargets: {
      evaluationMaxMs: number;
      apiResponseMaxMs: number;
      buildDurationMaxMin: number;
    };
  };
  auditRelease: {
    humanReviewRequired: true;
    rollbackRequired: true;
    downstreamReferenceRequired: true;
  };
}

export interface ExtrimliExtrondolDistanceRatioEkvilaterRow {
  edgeId: 'extrondend-extendol' | 'extrondend-koron' | 'extendol-koron';
  from: 'EXTRONDEND' | 'EXTENDOL' | 'KORON';
  to: 'EXTRONDEND' | 'EXTENDOL' | 'KORON';
  fromScore: number;
  toScore: number;
  distance: number;
  distanceRatio: number;
  equilateralAlignment: number;
  balanced: boolean;
}

export type ExtrimliExtrondolDistanceRatioEkvilaterExtrondendExtendolRow =
  ExtrimliExtrondolDistanceRatioEkvilaterRow & {
    edgeId: 'extrondend-extendol';
    from: 'EXTRONDEND';
    to: 'EXTENDOL';
  };

export type ExtrimliExtrondolDistanceRatioEkvilaterExtrondendKoronRow =
  ExtrimliExtrondolDistanceRatioEkvilaterRow & {
    edgeId: 'extrondend-koron';
    from: 'EXTRONDEND';
    to: 'KORON';
  };

export type ExtrimliExtrondolDistanceRatioEkvilaterExtendolKoronRow =
  ExtrimliExtrondolDistanceRatioEkvilaterRow & {
    edgeId: 'extendol-koron';
    from: 'EXTENDOL';
    to: 'KORON';
  };

type ExtrimliExtrondolDistanceRatioCompatibilityAlias =
  'DISANCE RATOR EKVILATER'; // Intentional legacy typo-only alias; consumers must not correct it.

export interface ExtrimliExtrondolDistanceRatioEkvilaterTable {
  requestedTableName: 'DISTANCE RATIO EKVILATER';
  normalizedTableName: 'DISTANCE RATIO EKVILATER';
  legacyRequestedTableNames: readonly ExtrimliExtrondolDistanceRatioCompatibilityAlias[];
  contractField: 'distanceRatioEkvilaterTable';
  version: 'v1-distance-ratio-ekvilater';
  interpretation: 'derived-readiness-table';
  targetShape: 'EQUILATERAL';
  scoringSource: readonly ['extrondend.aggregationScore', 'extendol.unifiedReadinessScore', 'koron.readinessScore'];
  rows: readonly [
    ExtrimliExtrondolDistanceRatioEkvilaterExtrondendExtendolRow,
    ExtrimliExtrondolDistanceRatioEkvilaterExtrondendKoronRow,
    ExtrimliExtrondolDistanceRatioEkvilaterExtendolKoronRow,
  ];
  summary: {
    averageDistance: number;
    maxDistance: number;
    minDistance: number;
    equilateralConsistency: number;
    interpretation: 'balanced' | 'watch' | 'skewed';
  };
}

export interface ExtrimliSpajaKodPublicFacade {
  surfaceName: 'SPAJA KOD';
  contractVersion: 'v1-spaja-kod';
  moduleVersion: '1.0.0';
  sourceOfTruth: '/api/extrimli/spaja-kod';
  publicSurfaceType: 'encapsulated-facade';
  representationMode: 'system-encapsulation';
  encapsulationStatus: 'ACTIVE';
  rawPatternVisibility: 'HIDDEN';
  completeness: {
    extremSignalPresent: boolean;
    extrondolGovernancePresent: boolean;
    consistent: boolean;
    exportReady: boolean;
  };
  interpretation: string;
  readiness: {
    status: ExtrimliSpajaKodPublicStatus;
    governanceOutcome: ExtrimliExtremProfilerReport['spajaKodEncapsulation']['readiness']['governanceOutcome'];
    promotionFreeze: boolean;
    currentWawe: ExtrimliExtrondolWaweStage;
    eligibleNextWawe: ExtrimliExtrondolWaweStage;
  };
  publicSignals: {
    systemStatus: 'STABLE' | 'ATTENTION' | 'BLOCKED';
    auditStatus: 'READY' | 'BLOCKED';
    downstreamSyncStatus: 'ALIGNED' | 'FOLLOW_UP_REQUIRED';
    kraljevskiPravniUniverzitetStatus: ExtrimliExtremProfilerReport['kraljevskiPravniUniverzitetTrack']['readiness']['status'];
    humanReviewRequired: true;
    rollbackPlanRequired: true;
    degraded: boolean;
  };
  platformTrack: ExtrimliSpajaproPublicBoundaryStatus;
  dokerKuratIzekDokarTrack: ExtrimliDokerKuratIzekDokarPublicBoundaryStatus;
  blockers: string[];
  exportContract: {
    includedInInstrukcija: true;
    downstreamConsumer: 'spaja86/IO-OPENUI-AO';
    exposesInternalPattern: false;
  };
}

export interface ExtrimliExtrondolReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  sourceOfTruth: string;
  statement: string;
  ownership: string;
  triggerLabel: string;
  pathScope: string[];
  orchestrationReadinessScore: number;
  roadmapAlignment: {
    sourceProgram: string;
    primaryVersion: ExtrimliVersionRoadmapVersionId;
    predecessorVersions: readonly ExtrimliVersionRoadmapVersionId[];
    unlocksVersions: readonly ExtrimliVersionRoadmapVersionId[];
    mandatoryGate: true;
  };
  versionRoadmap: ExtrimliVersionRoadmap;
  startProject: ExtrimliExtrondolStartProject;
  b2bScope: ExtrimliExtrondolB2bScope;
  b2bReadiness: ExtrimliExtrondolB2bReadiness;
  domainStrategy: ExtrimliExtrondolDomainStrategy;
  distanceRatioEkvilaterTable: ExtrimliExtrondolDistanceRatioEkvilaterTable;
  paymentVerification: ExtrimliExtrondolPaymentVerification;
  extremProfiler: ExtrimliExtremProfilerReport;
  petljeGovernance: ExtrimliExtrondolPetljeGovernance;
  kraljevskiPravniUniverzitetGovernance: ExtrimliExtrondolKraljevskiPravniUniverzitetGovernance;
  objektnoOrijentisanaProngilacija: ExtrimliExtrondolObjektnaProngilacijaGovernance;
  objektnoOrijentisanaReprodukcija: ExtrimliExtrondolObjektnoOrijentisanaReprodukcijaGovernance;
  epicElikvadenti: ExtrimliExtrondolEpicElikvadentiGovernance;
  dokerKuratIzekDokarTrack: ExtrimliDokerKuratIzekDokarGovernanceTrack;
  spajaproTrack: ExtrimliSpajaproGovernanceTrack;
  spajaKod: ExtrimliSpajaKodPublicFacade;
  mobilnaLinija: ExtrimliExtrondolMobilnaLinijaReadiness;
  nivoDuet: ExtrimliExtrondolNivoDuetSection;
  dinkos: ExtrimliExtrondolDinkosContract;
  rollout: {
    currentWawe: ExtrimliExtrondolWaweStage;
    eligibleNextWawe: ExtrimliExtrondolWaweStage;
    promotionFreeze: boolean;
    reasons: string[];
  };
  degraded: boolean;
  degradedMode: 'partial-payload-no-500';
  degradedSources: string[];
  releaseAuditSummary: ExtrimliExtrondolReleaseAuditSummary;
  releaseReadinessScorecard: ExtrimliExtrondolReleaseReadinessScorecard;
  canaryRingMetrics: ExtrimliExtrondolCanaryRingMetrics;
  incidentPlaybook: ExtrimliExtrondolIncidentPlaybook;
  contractDriftReport: ExtrimliExtrondolContractDriftReport;
  governanceConformance: ExtrimliExtrondolGovernanceConformance;
  acceptanceCriteria: ExtrimliExtrondolAcceptanceCriterion[];
  integrationBoundaries: {
    dependsOn: string[];
    aliasesOfExistingSurfaces: false;
  };
  kpiTargets: {
    evaluationMaxMs: number;
    apiResponseMaxMs: number;
    buildDurationMaxMin: number;
  };
  surfaces: {
    extrondend: ExtrimliExtrondendReport;
    extendol: ExtrimliExtendolReport;
    koron: ExtrimliKoronHealthReport;
    extremProfiler: ExtrimliExtremProfilerReport;
  };
}

export const EXTRONDOL_CONTRACT_VERSION = 'v1-extrondol';
export const EXTRONDOL_MODULE_VERSION = '1.0.0';
export const EXTRONDOL_PERSONA_ID = 'extrimli-extrondol-orchestrator';
export const EXTRONDOL_SOURCE_OF_TRUTH = '/api/extrimli/extrondol';
export const EXTRONDOL_EVALUATION_MAX_MS = 50;
export const EXTRONDOL_API_MAX_MS = 200;
export const EXTRONDOL_BUILD_MAX_MIN = 3;
export const EXTRONDOL_DINKOS_PERSONA_ID = 'extrimli-dinkos-signal-core';
export const EXTRONDOL_DINKOS_TRIGGER_LABEL = 'dinkos:logic-change';
export const EXTRONDOL_NIVO_DUET_SEGMENT = 'nivo-duet';
export const EXTRONDOL_NIVO_DUET_TRIGGER_LABEL = 'nivo-duet:logic-change';
export const EXTRONDOL_REQUESTED_DOMAIN_PATTERN = 'spaja.nivo*spaja';
export const EXTRONDOL_CANONICAL_APEX_DOMAIN = 'spaja.nivo-spaja';
export const EXTRONDOL_CANONICAL_WILDCARD_DOMAIN = '*.spaja.nivo-spaja';
export const EXTRONDOL_BASE_ORCHESTRATION_SHARE = 0.82;
export const EXTRONDOL_NIVO_DUET_SHARE = 0.18;
export const EXTRONDOL_DUET_WARNING_PENALTY_STEP = 4;
export const EXTRONDOL_DUET_WARNING_PENALTY_CAP = 12;
export const EXTRONDOL_DUET_INVALID_SIGNAL_PENALTY = 25;
export const EXTRONDOL_DUET_INVALID_FALLBACK_SCORE = 50;
export const EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION = EXTRIMLI_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION;
export const EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_READY_ADJUSTMENT = 2;
export const EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_WATCH_ADJUSTMENT = -4;
export const EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_BLOCKED_ADJUSTMENT = -12;
export const EXTRONDOL_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION = EXTRIMLI_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION;
export const EXTRONDOL_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_READY_ADJUSTMENT = 1;
export const EXTRONDOL_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_WATCH_ADJUSTMENT = -4;
export const EXTRONDOL_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_BLOCKED_ADJUSTMENT = -10;
export const EXTRONDOL_EPIC_ELIKVADENTI_CONTRACT_VERSION = EXTRIMLI_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_CONTRACT_VERSION;
export const EXTRONDOL_EPIC_ELIKVADENTI_READY_ADJUSTMENT = 2;
export const EXTRONDOL_EPIC_ELIKVADENTI_WATCH_ADJUSTMENT = -5;
export const EXTRONDOL_EPIC_ELIKVADENTI_BLOCKED_ADJUSTMENT = -14;
export const EXTRONDOL_DISTANCE_RATIO_EKVILATER_TABLE_NAME = 'DISTANCE RATIO EKVILATER';
export const EXTRONDOL_DISTANCE_RATIO_EKVILATER_CONTRACT_FIELD = 'distanceRatioEkvilaterTable';
export const EXTRONDOL_DISTANCE_RATIO_EKVILATER_VERSION = 'v1-distance-ratio-ekvilater';
export const EXTRONDOL_DISTANCE_RATIO_EKVILATER_INTERPRETATION = 'derived-readiness-table';
export const EXTRONDOL_DISTANCE_RATIO_EKVILATER_TARGET_SHAPE = 'EQUILATERAL';
// Legacy typo-only alias preserved for compatibility; do not reuse as canonical naming.
export const EXTRONDOL_DISTANCE_RATIO_EKVILATER_COMPATIBILITY_ALIASES = ['DISANCE RATOR EKVILATER'] as const;
export const EXTRONDOL_DISTANCE_RATIO_EKVILATER_SCORING_SOURCE = [
  'extrondend.aggregationScore',
  'extendol.unifiedReadinessScore',
  'koron.readinessScore',
] as const;
export const EXTRONDOL_DISTANCE_RATIO_EKVILATER_BALANCED_MIN = 80;
export const EXTRONDOL_DISTANCE_RATIO_EKVILATER_WATCH_MIN = 55;
export const EXTRONDOL_DUET_STATUS_ADJUSTMENT = {
  HARMONIZED: 4,
  ALIGNED: 2,
  FRAGILE: -6,
  DISSONANT: -14,
} as const;
export const EXTRIMLI_SPAJA_KOD_CONTRACT_VERSION = 'v1-spaja-kod';
export const EXTRIMLI_SPAJA_KOD_MODULE_VERSION = '1.0.0';
export const EXTRIMLI_SPAJA_KOD_SOURCE_OF_TRUTH = '/api/extrimli/spaja-kod';
