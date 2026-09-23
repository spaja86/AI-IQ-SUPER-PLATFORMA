import { SEED_PERSONAS } from './persona-bank/seed';
import type { PersonaRegistrationInput, PersonaStatus, PersonaType } from './persona-bank';

export type AiIdentityFinanceGovernanceStatus = 'READY' | 'WATCH' | 'BLOCKED';

export interface AiIdentityFinanceGovernancePersonaRecord {
  personaId: string;
  name: string;
  type: PersonaType;
  domain: string;
  octave: number;
  hipermrezaNode: number;
  linkedAgents: string[];
  identityCard: {
    canonicalName: 'AI LIČNA KARTA';
    auditSafePublicView: true;
    lifecycleStatus: 'active' | 'dormant';
    readinessStatus: AiIdentityFinanceGovernanceStatus;
    governanceStatus: AiIdentityFinanceGovernanceStatus;
    activationApprovalSource: 'persona-bank.auditLog + EXTRONDOL human review';
    fields: readonly ['personaId', 'name', 'domain', 'octave', 'hipermrezaNode', 'linkedAgents', 'lifecycleStatus', 'readinessStatus', 'governanceStatus'];
  };
  bankAccountGovernance: {
    canonicalName: 'AI BANKARSKI RAČUN';
    governanceOnlyModel: true;
    realBankDataInGitAllowed: false;
    kycDataInGitAllowed: false;
    paymentVerificationRequired: true;
    contractApprovalRequired: true;
    complianceReviewRequired: true;
    humanReviewRequired: true;
    downstreamSyncRequired: true;
    rollbackPlanRequired: true;
    finopsGuardrailsRequired: true;
    payoutCompensationMode: 'premium-rollout-regime';
    masterBillingCycle: 'monthly-or-annual';
    weeklyTargetEur: 12000;
    status: AiIdentityFinanceGovernanceStatus;
    blockers: string[];
    publicSummary: string;
  };
}

export interface AiIdentityFinanceGovernancePackage {
  contractVersion: 'v1-ai-identity-finance-governance';
  canonicalName: 'AI LIČNA KARTA + AI BANKARSKI RAČUN';
  additiveOnly: true;
  sourceOfTruthRoutes: readonly ['/api/extrimli/extrem', '/api/extrimli/extrondol', '/api/extrimli/spaja-kod'];
  ownershipModel: {
    technical: 'EXTREM';
    governance: 'EXTRONDOL';
    publicBoundary: 'SPAJA KOD';
  };
  rolloutScope: {
    mode: 'extrimli-reference-then-all-seeded-ai-personas';
    referencePersonaId: 'extrimli-core';
    totalSeededPersonas: number;
    linkedRepo: 'spaja86/IO-OPENUI-AO';
    downstreamSyncPolicy: 'audit-safe-summary-only';
  };
  identityCard: {
    canonicalName: 'AI LIČNA KARTA';
    auditSafePublicView: true;
    noSensitiveOperationalDataInGit: true;
    activationApprovalTrackedInAuditLog: true;
  };
  identityCardPolicy: {
    uniquePersonaIdentityInPersonaBankRequired: true;
    auditSafePublicViewOnly: true;
    noSensitiveOperationalDataInGit: true;
    activationApprovalTrackedInAuditLog: true;
  };
  bankAccountGovernance: {
    canonicalName: 'AI BANKARSKI RAČUN';
    governanceOnlyModel: true;
    realBankAccountStoredInGit: false;
    rawStatementsStoredInGit: false;
    secretsStoredInGit: false;
    kycStoredInGit: false;
  };
  bankAccountGovernancePolicy: {
    governanceModelOnly: true;
    noRealAccountNumbersInGit: true;
    noRawStatementsInGit: true;
    noSecretsInGit: true;
    noKycDataInGit: true;
  };
  aiIqWorldBankPrepiska: {
    canonicalName: 'AI IQ WORLD BANK PREPISKA';
    canonicalSourceDocument: 'docs/AI-IQ-WORLD-BANK-AI-IDENTITY-FINANCE-GOVERNANCE.md';
    sourceMaterialPolicy: 'documentation-only';
    evidenceRole: 'identity-finance-governance-evidence';
    noRuntimeAuthority: true;
    allowedEvidence: readonly [
      'approval-status',
      'compliance-status',
      'payment-verification-status',
      'human-review-status',
      'downstream-sync-status',
      'payout-compensation-regime'
    ];
    forbiddenEvidence: readonly [
      'real-bank-account-numbers',
      'kyc-documents',
      'raw-statements',
      'payment-secrets',
      'operational-credentials'
    ];
    publicSummary: string;
  };
  compensationModel: {
    weeklyTargetEur: 12000;
    cadence: 'weekly';
    executionMode: 'business-target-only';
    classification: 'business-finops-target-only';
    payoutMode: 'premium-rollout-regime';
    masterBillingCycle: 'monthly-or-annual';
    hardBlockers: readonly [
      'contract-approval',
      'compliance-review',
      'payment-verification',
      'human-review',
      'rollback-plan',
      'finops-guardrails'
    ];
  };
  technicalSignals: {
    identityCompletenessScore: number;
    financialReadinessScore: number;
    combinedTechnicalScore: number;
    status: AiIdentityFinanceGovernanceStatus;
    deterministicFallbackRequired: boolean;
    boundedByExistingRoutes: true;
    blockers: string[];
  };
  catalogSummary: {
    totalPersonas: number;
    ready: number;
    watch: number;
    blocked: number;
  };
  personas: AiIdentityFinanceGovernancePersonaRecord[];
  packageOutputs: {
    auditShortSummary: string;
    publicSummary: string;
    governanceChecklistStatus: string;
  };
}

export interface AiIdentityFinanceGovernanceBuildOptions {
  readinessStatus: AiIdentityFinanceGovernanceStatus;
  readinessScore: number;
  deterministicFallbackRequired: boolean;
  promotionFreeze: boolean;
  linkedRepo?: 'spaja86/IO-OPENUI-AO';
  blockers?: string[];
}

export const AI_IDENTITY_FINANCE_GOVERNANCE_CONTRACT_VERSION = 'v1-ai-identity-finance-governance' as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function deriveIdentityCompleteness(persona: PersonaRegistrationInput): number {
  const checks = [
    Boolean(persona.id),
    Boolean(persona.name),
    Boolean(persona.type),
    Number.isFinite(persona.octave),
    Number.isFinite(persona.hipermrezaNode),
    Boolean(persona.attributes?.domain),
    Boolean(persona.attributes?.tone),
    Array.isArray(persona.attributes?.traits) && persona.attributes.traits.length > 0,
    Array.isArray(persona.attributes?.skills) && persona.attributes.skills.length > 0,
    Array.isArray(persona.linkedAgents) && persona.linkedAgents.length > 0,
  ];
  return round((checks.filter(Boolean).length / checks.length) * 100);
}

function mapLifecycleStatus(status: AiIdentityFinanceGovernanceStatus): 'active' | 'dormant' {
  return status === 'READY' ? 'active' : 'dormant';
}

export function buildAiIdentityFinanceGovernancePackage(
  options: AiIdentityFinanceGovernanceBuildOptions,
): AiIdentityFinanceGovernancePackage {
  const baseBlockers = Array.from(new Set(options.blockers ?? []));
  let identityCompletenessTotal = 0;
  const personas = SEED_PERSONAS.map((persona) => {
    const completenessScore = deriveIdentityCompleteness(persona);
    identityCompletenessTotal += completenessScore;
    const personaStatus = options.readinessStatus === 'BLOCKED' || options.promotionFreeze
      ? 'BLOCKED'
      : completenessScore < 100
        ? 'WATCH'
        : options.readinessStatus;
    const lifecycleStatus = mapLifecycleStatus(personaStatus);
    const blockers = [
      ...(completenessScore < 100 ? ['identity-card-incomplete'] : []),
      ...baseBlockers,
    ];

    return {
      personaId: persona.id ?? persona.name,
      name: persona.name,
      type: persona.type,
      domain: persona.attributes?.domain ?? 'unassigned-audit-safe-domain',
      octave: persona.octave,
      hipermrezaNode: persona.hipermrezaNode,
      linkedAgents: [...(persona.linkedAgents ?? [])],
      identityCard: {
        canonicalName: 'AI LIČNA KARTA' as const,
        auditSafePublicView: true as const,
        lifecycleStatus,
        readinessStatus: personaStatus,
        governanceStatus: options.readinessStatus,
        activationApprovalSource: 'persona-bank.auditLog + EXTRONDOL human review' as const,
        fields: ['personaId', 'name', 'domain', 'octave', 'hipermrezaNode', 'linkedAgents', 'lifecycleStatus', 'readinessStatus', 'governanceStatus'] as const,
      },
      bankAccountGovernance: {
        canonicalName: 'AI BANKARSKI RAČUN' as const,
        governanceOnlyModel: true as const,
        realBankDataInGitAllowed: false as const,
        kycDataInGitAllowed: false as const,
        paymentVerificationRequired: true as const,
        contractApprovalRequired: true as const,
        complianceReviewRequired: true as const,
        humanReviewRequired: true as const,
        downstreamSyncRequired: true as const,
        rollbackPlanRequired: true as const,
        finopsGuardrailsRequired: true as const,
        payoutCompensationMode: 'premium-rollout-regime' as const,
        masterBillingCycle: 'monthly-or-annual' as const,
        weeklyTargetEur: 12000,
        status: personaStatus,
        blockers,
        publicSummary: 'Audit-safe AI identity-finance governance only; no real account numbers, raw statements, secrets, or KYC data are stored in Git.',
      },
    };
  });

  const identityCompletenessScore = round(
    identityCompletenessTotal / Math.max(personas.length, 1),
  );
  const financialReadinessScore = round(
    (clamp(options.readinessScore, 0, 100) * 0.7) + ((options.promotionFreeze ? 35 : 85) * 0.3),
  );
  const combinedTechnicalScore = round((identityCompletenessScore * 0.5) + (financialReadinessScore * 0.5));
  const ready = personas.filter((persona) => persona.bankAccountGovernance.status === 'READY').length;
  const watch = personas.filter((persona) => persona.bankAccountGovernance.status === 'WATCH').length;
  const blocked = personas.filter((persona) => persona.bankAccountGovernance.status === 'BLOCKED').length;

  return {
    contractVersion: AI_IDENTITY_FINANCE_GOVERNANCE_CONTRACT_VERSION,
    canonicalName: 'AI LIČNA KARTA + AI BANKARSKI RAČUN',
    additiveOnly: true,
    sourceOfTruthRoutes: ['/api/extrimli/extrem', '/api/extrimli/extrondol', '/api/extrimli/spaja-kod'],
    ownershipModel: {
      technical: 'EXTREM',
      governance: 'EXTRONDOL',
      publicBoundary: 'SPAJA KOD',
    },
    rolloutScope: {
      mode: 'extrimli-reference-then-all-seeded-ai-personas',
      referencePersonaId: 'extrimli-core',
      totalSeededPersonas: personas.length,
      linkedRepo: options.linkedRepo ?? 'spaja86/IO-OPENUI-AO',
      downstreamSyncPolicy: 'audit-safe-summary-only',
    },
    identityCard: {
      canonicalName: 'AI LIČNA KARTA',
      auditSafePublicView: true,
      noSensitiveOperationalDataInGit: true,
      activationApprovalTrackedInAuditLog: true,
    },
    identityCardPolicy: {
      uniquePersonaIdentityInPersonaBankRequired: true,
      auditSafePublicViewOnly: true,
      noSensitiveOperationalDataInGit: true,
      activationApprovalTrackedInAuditLog: true,
    },
    bankAccountGovernance: {
      canonicalName: 'AI BANKARSKI RAČUN',
      governanceOnlyModel: true,
      realBankAccountStoredInGit: false,
      rawStatementsStoredInGit: false,
      secretsStoredInGit: false,
      kycStoredInGit: false,
    },
    bankAccountGovernancePolicy: {
      governanceModelOnly: true,
      noRealAccountNumbersInGit: true,
      noRawStatementsInGit: true,
      noSecretsInGit: true,
      noKycDataInGit: true,
    },
    aiIqWorldBankPrepiska: {
      canonicalName: 'AI IQ WORLD BANK PREPISKA',
      canonicalSourceDocument: 'docs/AI-IQ-WORLD-BANK-AI-IDENTITY-FINANCE-GOVERNANCE.md',
      sourceMaterialPolicy: 'documentation-only',
      evidenceRole: 'identity-finance-governance-evidence',
      noRuntimeAuthority: true,
      allowedEvidence: [
        'approval-status',
        'compliance-status',
        'payment-verification-status',
        'human-review-status',
        'downstream-sync-status',
        'payout-compensation-regime',
      ],
      forbiddenEvidence: [
        'real-bank-account-numbers',
        'kyc-documents',
        'raw-statements',
        'payment-secrets',
        'operational-credentials',
      ],
      publicSummary: 'AI IQ WORLD BANK prepiska ostaje documentation-only governance evidence: dozvoljeni su samo approval/compliance/payment/human-review/downstream-sync/payout statusi bez realnih bankarskih zapisa, KYC podataka ili sekreta u Git-u.',
    },
    compensationModel: {
      weeklyTargetEur: 12000,
      cadence: 'weekly',
      executionMode: 'business-target-only',
      classification: 'business-finops-target-only',
      payoutMode: 'premium-rollout-regime',
      masterBillingCycle: 'monthly-or-annual',
      hardBlockers: ['contract-approval', 'compliance-review', 'payment-verification', 'human-review', 'rollback-plan', 'finops-guardrails'],
    },
    technicalSignals: {
      identityCompletenessScore,
      financialReadinessScore,
      combinedTechnicalScore,
      status: options.promotionFreeze ? 'BLOCKED' : options.readinessStatus,
      deterministicFallbackRequired: options.deterministicFallbackRequired,
      boundedByExistingRoutes: true,
      blockers: baseBlockers,
    },
    catalogSummary: {
      totalPersonas: personas.length,
      ready,
      watch,
      blocked,
    },
    personas,
    packageOutputs: {
      auditShortSummary: 'AI lična karta i AI bankarski račun ostaju additive-only identity/governance paket nad postojećim EXTREM/EXTRONDOL/SPAJA KOD surface-ovima.',
      publicSummary: 'Svaki seedovani AI dobija audit-safe ličnu kartu i governance-bounded bankarski/payout profil bez uvođenja novih source-of-truth ruta i bez čuvanja stvarnih bankarskih podataka u Git-u.',
      governanceChecklistStatus: '12000 EUR weekly ostaje business/finops target only; AI IQ WORLD BANK prepiska ostaje documentation-only governance evidence; contract approval, compliance review, payment verification, human review, rollback plan i FinOps guardrails ostaju obavezni hard gate-ovi za svaki AI paket.',
    },
  };
}

export function buildAiIdentityFinancePersonaAttributes(
  aiPersona: AiIdentityFinanceGovernancePersonaRecord,
): {
  aiIdentityCard: AiIdentityFinanceGovernancePersonaRecord['identityCard'];
  aiBankAccountGovernance: AiIdentityFinanceGovernancePersonaRecord['bankAccountGovernance'];
} {
  return {
    aiIdentityCard: aiPersona.identityCard,
    aiBankAccountGovernance: aiPersona.bankAccountGovernance,
  };
}

export function mapAiGovernanceStatusToPersonaStatus(
  status: AiIdentityFinanceGovernanceStatus,
): Exclude<PersonaStatus, 'archived'> {
  return status === 'READY' ? 'active' : 'dormant';
}
