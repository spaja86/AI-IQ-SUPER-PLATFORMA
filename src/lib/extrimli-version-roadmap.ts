export type ExtrimliVersionRoadmapVersionId =
  | 'Verzija 1'
  | 'Verzija 2'
  | 'Verzija 3'
  | 'Verzija 4'
  | 'Verzija 5'
  | 'Verzija 6'
  | 'Verzija 7';

export interface ExtrimliVersionRoadmapStage {
  id: ExtrimliVersionRoadmapVersionId;
  releaseOrder: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  slug: string;
  focusArea: 'runtime' | 'integration' | 'readiness' | 'governance' | 'release' | 'multi-repo' | 'enterprise';
  status: 'ACTIVE-BASELINE' | 'ACTIVE-EXPANSION' | 'PLANNED';
  summary: string;
  primaryArtifacts: readonly string[];
  unlocks: readonly ExtrimliVersionRoadmapVersionId[];
}

export interface ExtrimliVersionRoadmapPrinciple {
  id: string;
  statement: string;
}

export interface ExtrimliDeveloperCreateDailyTaskTemplate {
  priority: 1 | 2 | 3;
  required: true;
  roadmapStageBinding: 'single-active-roadmap-stage';
  measurableOutputRequired: true;
  acceptanceEvidenceRequired: true;
  endOfDayStatusRequired: true;
  derivedFrom: 'existing-modules-validators-and-workflows';
  focus: string;
}

export const EXTRIMLI_DEVELOPER_CREATE_DAILY_CADENCE_BLOCKS = [
  'morning-startup',
  'deep-focus-block',
  'midday-checkpoint',
  'end-of-day-closeout',
] as const;

export const EXTRIMLI_DEVELOPER_CREATE_DAILY_TASK_PRIORITIES = [1, 2, 3] as const;

export const EXTRIMLI_DEVELOPER_CREATE_DAILY_CLOSEOUT_STATUSES = [
  'completed',
  'carried-over',
  'blocked',
] as const;

export interface ExtrimliDeveloperCreateDailyOperationalCadence {
  governanceArtifact: true;
  derivedFromExistingModulesValidatorsAndWorkflows: true;
  noNewRuntimeDomain: true;
  cadenceBlocks: typeof EXTRIMLI_DEVELOPER_CREATE_DAILY_CADENCE_BLOCKS;
  taskPriorities: typeof EXTRIMLI_DEVELOPER_CREATE_DAILY_TASK_PRIORITIES;
  requiredTaskFields: readonly ['priority', 'roadmapStageId', 'measurableOutput', 'acceptanceEvidence', 'endOfDayStatus'];
  endOfDayStatuses: typeof EXTRIMLI_DEVELOPER_CREATE_DAILY_CLOSEOUT_STATUSES;
  qualityGatesInheritedFromCiBot: readonly ['lint', 'test', 'smoke', 'predeploy', 'build'];
  taskTemplate: readonly [
    ExtrimliDeveloperCreateDailyTaskTemplate,
    ExtrimliDeveloperCreateDailyTaskTemplate,
    ExtrimliDeveloperCreateDailyTaskTemplate
  ];
}

export interface ExtrimliVersionRoadmapDeliveryWave {
  wave: 'FOUNDATION' | 'GOVERNANCE' | 'OPERATING-MODEL';
  versions: readonly ExtrimliVersionRoadmapVersionId[];
  outcome: string;
}

export const EXTRIMLI_DEVELOPER_CREATE_MANDATORY_ARTIFACTS = {
  docs: [
    'docs/EXTRIMLI.md',
    'docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md',
    'docs/EXTRIMLI-VRH-PROGRAMSKOG-EKVILADENTA.md',
    'docs/AI-IQ-WORLD-BANK-AI-IDENTITY-FINANCE-GOVERNANCE.md',
    'docs/EXTRIMLI-METRICKO-PROGRAMIRANJE.md',
    'docs/EXTRIMLI-SINEMETRICKO-PROGRAMIRANJE.md',
    'docs/EXTRIMLI-PARADIJOGONALNO-PROGRAMIRANJE.md',
    'docs/AI-IQ-PROGRAMSKI-JEZIK.md',
    'docs/PROGRAMSKI-JEZIK-INFORMACIONIH-TOKOVA.md',
    'docs/MULTI-REPO-LINKS.md',
    'docs/EXTRIMLI-EXTERNAL-GITHUB.md',
  ],
  runtime: [
    'src/lib/extrimli-extrem/**',
    'src/lib/extrimli-extrondol/**',
    'src/lib/ai-identity-finance-governance.ts',
    'src/lib/extrimli-world-bank-persona/**',
  ],
  routes: [
    'src/app/api/extrimli/extrem/route.ts',
    'src/app/api/extrimli/extrondol/route.ts',
    'src/app/api/extrimli/spaja-kod/route.ts',
  ],
  tests: [
    'src/tests/lib/extrimli-extrem.test.ts',
    'src/tests/lib/extrimli-extrondol.test.ts',
    'src/tests/lib/extrimli-world-bank-persona.test.ts',
    'src/tests/api/extrimli-route.test.ts',
  ],
  governance: [
    '.github/workflows/extrimli-validator.yml',
    '.github/workflows/extrimli-governance-conformance.yml',
    '.github/workflows/extrimli-external-github.yml',
  ],
} as const;

export const EXTRIMLI_DEVELOPER_CREATE_LOCKED_CORE_ARTIFACTS = [
  'docs/EXTRIMLI.md',
  'docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md',
  'docs/EXTRIMLI-VRH-PROGRAMSKOG-EKVILADENTA.md',
  'docs/AI-IQ-WORLD-BANK-AI-IDENTITY-FINANCE-GOVERNANCE.md',
  'docs/EXTRIMLI-METRICKO-PROGRAMIRANJE.md',
  'docs/EXTRIMLI-SINEMETRICKO-PROGRAMIRANJE.md',
  'docs/EXTRIMLI-PARADIJOGONALNO-PROGRAMIRANJE.md',
  'docs/AI-IQ-PROGRAMSKI-JEZIK.md',
  'docs/PROGRAMSKI-JEZIK-INFORMACIONIH-TOKOVA.md',
  'docs/MULTI-REPO-LINKS.md',
  'docs/EXTRIMLI-EXTERNAL-GITHUB.md',
  'src/lib/extrimli-extrem/**',
  'src/lib/extrimli-extrondol/**',
  'src/lib/ai-identity-finance-governance.ts',
  'src/lib/extrimli-world-bank-persona/**',
  'src/app/api/extrimli/extrem/route.ts',
  'src/app/api/extrimli/extrondol/route.ts',
  'src/app/api/extrimli/spaja-kod/route.ts',
  'src/tests/lib/extrimli-extrem.test.ts',
  'src/tests/lib/extrimli-extrondol.test.ts',
  'src/tests/lib/extrimli-world-bank-persona.test.ts',
  'src/tests/api/extrimli-route.test.ts',
  '.github/workflows/extrimli-validator.yml',
  '.github/workflows/extrimli-governance-conformance.yml',
  '.github/workflows/extrimli-external-github.yml',
] as const;

export type ExtrimliDeveloperCreateMandatoryArtifacts = typeof EXTRIMLI_DEVELOPER_CREATE_MANDATORY_ARTIFACTS;
export type ExtrimliDeveloperCreateLockedCoreArtifact = typeof EXTRIMLI_DEVELOPER_CREATE_LOCKED_CORE_ARTIFACTS[number];

export interface ExtrimliDeveloperCreateProgramLock {
  sourceProgramDoc: 'docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md';
  additiveOnly: true;
  sourceOfTruthRoutes: readonly ['/api/extrimli/extrem', '/api/extrimli/extrondol', '/api/extrimli/spaja-kod'];
  lockedCoreArtifacts: readonly ExtrimliDeveloperCreateLockedCoreArtifact[];
  mandatoryArtifacts: ExtrimliDeveloperCreateMandatoryArtifacts;
  ownershipBoundary: {
    extrimli: 'base-runtime-domain';
    extrem: 'technical-signal-and-profiler';
    extrondol: 'wawe-orchestration-audit-freeze-promotion';
    dok: 'EXTREM';
    dik: 'EXTREM';
    for: 'EXTREM';
    dak: 'EXTRONDOL';
    duk: 'EXTRONDOL';
    spajaKod: 'public-audit-safe-boundary';
  };
  driftZeroLayers: readonly ['docs', 'types', 'routes', 'tests', 'workflows'];
  dailyOperationalCadence: ExtrimliDeveloperCreateDailyOperationalCadence;
  realizationSequence: readonly [
    'documentation-lock-and-roadmap',
    'terminology-and-ownership-alignment',
    'type-contract-alignment',
    'route-and-health-outputs',
    'test-and-governance-conformance',
    'daily-task-cadence',
    'downstream-sync-and-public-summary',
    ...ExtrimliDeveloperCreateRealizationStep[]
  ];
  implementationStreams: readonly [
    ExtrimliDeveloperCreateImplementationStream<'stream-a-domain-model-and-types'>,
    ExtrimliDeveloperCreateImplementationStream<'stream-b-api-stability-and-degraded-behavior'>,
    ExtrimliDeveloperCreateImplementationStream<'stream-c-consistency-health-and-governance-signals'>,
    ExtrimliDeveloperCreateImplementationStream<'stream-d-release-gates-and-rollback'>,
    ExtrimliDeveloperCreateImplementationStream<'stream-e-downstream-sync-and-public-summary'>
  ];
  expansionTracks: readonly [
    'wawe-canary-dashboard',
    'contract-evolution-log',
    'single-pane-audit-summary',
    'freeze-rollback-rehearsal',
    'persona-bank-and-analytics-sync',
    'spaja-kod-public-safe-aggregate',
    'cross-repo-reference-expansion',
    'analytics-kpi-trend-watch',
    'versioned-readiness-review',
    ...ExtrimliDeveloperCreateExpansionTrack[]
  ];
  prExecutionLock: {
    singleRoadmapStagePerPr: true;
    measurableOutputRequired: true;
    requiredFields: readonly ['roadmapStageId', 'measurableOutput', 'acceptanceEvidence'];
  };
  operationalAuditPackage: {
    required: true;
    standardizedPrDescription: true;
    requiredFields: readonly ['rolloutPlan', 'rollbackPlan', 'kpiImpact', 'humanReviewStatus', 'downstreamReference'];
  };
  acceptanceLock: {
    noNewSourceOfTruthRoutes: true;
    sourceOfTruthRoutesStable: true;
    driftZeroRequired: true;
    allowedStatuses: readonly ['READY', 'WATCH', 'BLOCKED'];
    degradedPolicy: 'partial-payload-no-500';
    humanReviewRequired: true;
    securityRequired: true;
    rollbackRequired: true;
  };
  definitionOfDone: {
    additiveOnlyRequired: true;
    dokDikDakDukSplitLocked: true;
    sourceOfTruthRoutesStable: true;
    docsTypesRoutesTestsWorkflowsAligned: true;
    downstreamReferenceRequired: true;
    humanReviewRequired: true;
    securityRequired: true;
    rollbackRequired: true;
  };
}

export type ExtrimliDeveloperCreateRealizationStep =
  | 'documentation-lock-and-roadmap'
  | 'terminology-and-ownership-alignment'
  | 'type-contract-alignment'
  | 'route-and-health-outputs'
  | 'test-and-governance-conformance'
  | 'daily-task-cadence'
  | 'downstream-sync-and-public-summary';

export type ExtrimliDeveloperCreateImplementationStreamId =
  | 'stream-a-domain-model-and-types'
  | 'stream-b-api-stability-and-degraded-behavior'
  | 'stream-c-consistency-health-and-governance-signals'
  | 'stream-d-release-gates-and-rollback'
  | 'stream-e-downstream-sync-and-public-summary';

export interface ExtrimliDeveloperCreateImplementationStream<TId extends ExtrimliDeveloperCreateImplementationStreamId = ExtrimliDeveloperCreateImplementationStreamId> {
  id: TId;
  title: string;
  focus: string;
}

export type ExtrimliDeveloperCreateExpansionTrack =
  | 'wawe-canary-dashboard'
  | 'contract-evolution-log'
  | 'single-pane-audit-summary'
  | 'freeze-rollback-rehearsal'
  | 'persona-bank-and-analytics-sync'
  | 'spaja-kod-public-safe-aggregate'
  | 'cross-repo-reference-expansion'
  | 'analytics-kpi-trend-watch'
  | 'versioned-readiness-review';

export interface ExtrimliVersionRoadmap {
  contractVersion: 'v1-7-roadmap';
  programName: 'EXTRIMLI EXTRONDOL EXTREM';
  model: 'single-ecosystem-phased-roadmap';
  baselineSurfaceVersions: readonly ['v1', 'v3', 'v1-extrem-profiler', 'v1-extrondol'];
  sourceOfTruthSurfaces: readonly [
    '/api/extrimli/health',
    '/api/extrimli-3/health',
    '/api/extrimli/extrem',
    '/api/extrimli/extrondol',
    '/api/extrimli/spaja-kod'
  ];
  versions: readonly [
    ExtrimliVersionRoadmapStage,
    ExtrimliVersionRoadmapStage,
    ExtrimliVersionRoadmapStage,
    ExtrimliVersionRoadmapStage,
    ExtrimliVersionRoadmapStage,
    ExtrimliVersionRoadmapStage,
    ExtrimliVersionRoadmapStage
  ];
  sharedPrinciples: readonly ExtrimliVersionRoadmapPrinciple[];
  deliverySequence: readonly [
    ExtrimliVersionRoadmapDeliveryWave,
    ExtrimliVersionRoadmapDeliveryWave,
    ExtrimliVersionRoadmapDeliveryWave
  ];
  developerCreateLock: ExtrimliDeveloperCreateProgramLock;
  downstreamSync: {
    linkedRepo: 'spaja86/IO-OPENUI-AO';
    referencesRequired: true;
    additiveOnly: true;
    requiredLabels: readonly [
      'extrimli:logic-change',
      'extrondend:logic-change',
      'extrondol:logic-change',
      'extrem:logic-change'
    ];
  };
  enterpriseOperatingModel: {
    runtimeSourceOfTruth: 'Vercel Git integration';
    governanceLayer: 'GitHub Actions';
    humanReviewRequired: true;
    securityScanningRequired: true;
    rollbackPlanRequired: true;
  };
}

const EXTRIMLI_DEVELOPER_CREATE_LOCK: ExtrimliDeveloperCreateProgramLock = {
  sourceProgramDoc: 'docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md',
  additiveOnly: true,
  sourceOfTruthRoutes: ['/api/extrimli/extrem', '/api/extrimli/extrondol', '/api/extrimli/spaja-kod'],
  lockedCoreArtifacts: [...EXTRIMLI_DEVELOPER_CREATE_LOCKED_CORE_ARTIFACTS],
  mandatoryArtifacts: EXTRIMLI_DEVELOPER_CREATE_MANDATORY_ARTIFACTS,
  ownershipBoundary: {
    extrimli: 'base-runtime-domain',
    extrem: 'technical-signal-and-profiler',
    extrondol: 'wawe-orchestration-audit-freeze-promotion',
    dok: 'EXTREM',
    dik: 'EXTREM',
    for: 'EXTREM',
    dak: 'EXTRONDOL',
    duk: 'EXTRONDOL',
    spajaKod: 'public-audit-safe-boundary',
  },
  driftZeroLayers: ['docs', 'types', 'routes', 'tests', 'workflows'],
  dailyOperationalCadence: {
    governanceArtifact: true,
    derivedFromExistingModulesValidatorsAndWorkflows: true,
    noNewRuntimeDomain: true,
    cadenceBlocks: EXTRIMLI_DEVELOPER_CREATE_DAILY_CADENCE_BLOCKS,
    taskPriorities: EXTRIMLI_DEVELOPER_CREATE_DAILY_TASK_PRIORITIES,
    requiredTaskFields: ['priority', 'roadmapStageId', 'measurableOutput', 'acceptanceEvidence', 'endOfDayStatus'],
    endOfDayStatuses: EXTRIMLI_DEVELOPER_CREATE_DAILY_CLOSEOUT_STATUSES,
    qualityGatesInheritedFromCiBot: ['lint', 'test', 'smoke', 'predeploy', 'build'],
    taskTemplate: [
      {
        priority: 1,
        required: true,
        roadmapStageBinding: 'single-active-roadmap-stage',
        measurableOutputRequired: true,
        acceptanceEvidenceRequired: true,
        endOfDayStatusRequired: true,
        derivedFrom: 'existing-modules-validators-and-workflows',
        focus: 'Dokumentacioni lock i terminološko/ownership poravnanje za aktivnu roadmap fazu.',
      },
      {
        priority: 2,
        required: true,
        roadmapStageBinding: 'single-active-roadmap-stage',
        measurableOutputRequired: true,
        acceptanceEvidenceRequired: true,
        endOfDayStatusRequired: true,
        derivedFrom: 'existing-modules-validators-and-workflows',
        focus: 'Contract/type i route/health izlaz za istu roadmap fazu bez novih runtime ruta.',
      },
      {
        priority: 3,
        required: true,
        roadmapStageBinding: 'single-active-roadmap-stage',
        measurableOutputRequired: true,
        acceptanceEvidenceRequired: true,
        endOfDayStatusRequired: true,
        derivedFrom: 'existing-modules-validators-and-workflows',
        focus: 'Test/workflow enforcement, audit summary i closeout status za istu roadmap fazu.',
      },
    ],
  },
  realizationSequence: [
    'documentation-lock-and-roadmap',
    'terminology-and-ownership-alignment',
    'type-contract-alignment',
    'route-and-health-outputs',
    'test-and-governance-conformance',
    'daily-task-cadence',
    'downstream-sync-and-public-summary',
  ],
  implementationStreams: [
    {
      id: 'stream-a-domain-model-and-types',
      title: 'Stream A — Domain model i tipovi',
      focus: 'Standardizacija EXTRIMLI/EXTREM/EXTRONDOL kontrakata bez breaking promena.',
    },
    {
      id: 'stream-b-api-stability-and-degraded-behavior',
      title: 'Stream B — API surface stabilnost i degradacija',
      focus: 'Stabilnost postojećih ruta uz partial-payload-no-500 fallback ponašanje.',
    },
    {
      id: 'stream-c-consistency-health-and-governance-signals',
      title: 'Stream C — DOK/DIK/DAK/DUK/FOR consistency health',
      focus: 'Jedinstven dokDikDakDukConsistencyHealth za tehnički i governance ownership split.',
    },
    {
      id: 'stream-d-release-gates-and-rollback',
      title: 'Stream D — Release gates i rollback',
      focus: 'Freeze/promotion/human-review/rollback hard gate orkestracija.',
    },
    {
      id: 'stream-e-downstream-sync-and-public-summary',
      title: 'Stream E — Downstream sync i public-safe summary',
      focus: 'Multi-repo mapiranje prema docs/MULTI-REPO-LINKS.md i IO-OPENUI-AO.',
    },
  ],
  expansionTracks: [
    'wawe-canary-dashboard',
    'contract-evolution-log',
    'single-pane-audit-summary',
    'freeze-rollback-rehearsal',
    'persona-bank-and-analytics-sync',
    'spaja-kod-public-safe-aggregate',
    'cross-repo-reference-expansion',
    'analytics-kpi-trend-watch',
    'versioned-readiness-review',
  ],
  prExecutionLock: {
    singleRoadmapStagePerPr: true,
    measurableOutputRequired: true,
    requiredFields: ['roadmapStageId', 'measurableOutput', 'acceptanceEvidence'],
  },
  operationalAuditPackage: {
    required: true,
    standardizedPrDescription: true,
    requiredFields: ['rolloutPlan', 'rollbackPlan', 'kpiImpact', 'humanReviewStatus', 'downstreamReference'],
  },
  acceptanceLock: {
    noNewSourceOfTruthRoutes: true,
    sourceOfTruthRoutesStable: true,
    driftZeroRequired: true,
    allowedStatuses: ['READY', 'WATCH', 'BLOCKED'],
    degradedPolicy: 'partial-payload-no-500',
    humanReviewRequired: true,
    securityRequired: true,
    rollbackRequired: true,
  },
  definitionOfDone: {
    additiveOnlyRequired: true,
    dokDikDakDukSplitLocked: true,
    sourceOfTruthRoutesStable: true,
    docsTypesRoutesTestsWorkflowsAligned: true,
    downstreamReferenceRequired: true,
    humanReviewRequired: true,
    securityRequired: true,
    rollbackRequired: true,
  },
};

const EXTRIMLI_VERSION_ROADMAP: ExtrimliVersionRoadmap = {
  contractVersion: 'v1-7-roadmap',
  programName: 'EXTRIMLI EXTRONDOL EXTREM',
  model: 'single-ecosystem-phased-roadmap',
  baselineSurfaceVersions: ['v1', 'v3', 'v1-extrem-profiler', 'v1-extrondol'],
  sourceOfTruthSurfaces: [
    '/api/extrimli/health',
    '/api/extrimli-3/health',
    '/api/extrimli/extrem',
    '/api/extrimli/extrondol',
    '/api/extrimli/spaja-kod',
  ],
  versions: [
    {
      id: 'Verzija 1',
      releaseOrder: 1,
      slug: 'core-extrimli-stabilization',
      focusArea: 'runtime',
      status: 'ACTIVE-BASELINE',
      summary: 'Locks the base EXTRIMLI runtime domain for sport, risk, gear, performance, events, and weather with stable KPI boundaries.',
      primaryArtifacts: ['src/lib/extrimli/**', 'src/app/api/extrimli/**'],
      unlocks: ['Verzija 2', 'Verzija 3'],
    },
    {
      id: 'Verzija 2',
      releaseOrder: 2,
      slug: 'canonical-integration-layer',
      focusArea: 'integration',
      status: 'PLANNED',
      summary: 'Locks V2 as the additive-only canonical mapping layer that standardizes readiness, degraded, audit, downstream sync, and Developer/Create ↔ VRH ↔ RADNI TAKT terminology between core EXTRIMLI and higher governance surfaces.',
      primaryArtifacts: ['src/lib/extrimli-extendol/**', 'src/lib/extrimli-extrondend/**', 'docs/EXTRIMLI.md'],
      unlocks: ['Verzija 3', 'Verzija 4', 'Verzija 5'],
    },
    {
      id: 'Verzija 3',
      releaseOrder: 3,
      slug: 'advanced-readiness-profile-expansion',
      focusArea: 'readiness',
      status: 'ACTIVE-EXPANSION',
      summary: 'Expands v3 as the advanced readiness layer with additive EXTREM profiling for exponential progression, octaval topology, sequential reproduction, exposure, torque, stable aggregate inputs, and repo-wide RADNI TAKT readiness reflection.',
      primaryArtifacts: ['src/lib/extrimli-3/**', 'src/app/api/extrimli-3/**'],
      unlocks: ['Verzija 4', 'Verzija 5'],
    },
    {
      id: 'Verzija 4',
      releaseOrder: 4,
      slug: 'extrem-governance-hardening',
      focusArea: 'governance',
      status: 'ACTIVE-EXPANSION',
      summary: 'Makes EXTREM the mandatory profiler and freeze gate with deterministic READY | WATCH | BLOCKED governance for conflict intensity, optimization tier, resolution readiness, VRH fallback hardening, browser bottleneck audit, additive epic elikvadenti uplift readiness, and Developer/Create repo-wide reflection hardening.',
      primaryArtifacts: ['src/lib/extrimli-extrem/**', 'src/app/api/extrimli/extrem/**'],
      unlocks: ['Verzija 5', 'Verzija 6', 'Verzija 7'],
    },
    {
      id: 'Verzija 5',
      releaseOrder: 5,
      slug: 'extrondol-release-orchestration',
      focusArea: 'release',
      status: 'ACTIVE-EXPANSION',
      summary: 'Makes EXTRONDOL the primary WAWE orchestration surface for release audit, Developer/Create/VRH downstream summary propagation, payment/compliance gates, rollback-aware rollout decisions, and epic elikvadenti review/freeze propagation.',
      primaryArtifacts: ['src/lib/extrimli-extrondol/**', 'src/app/api/extrimli/extrondol/**'],
      unlocks: ['Verzija 6', 'Verzija 7'],
    },
    {
      id: 'Verzija 6',
      releaseOrder: 6,
      slug: 'multi-repo-persona-sync',
      focusArea: 'multi-repo',
      status: 'PLANNED',
      summary: 'Extends EXTRIMLI, EXTREM, and EXTRONDOL into a full cross-repo lifecycle with Developer/Create reflection sync, persona-bank status, analytics, and resilience monitoring.',
      primaryArtifacts: ['docs/MULTI-REPO-LINKS.md', '.agent-config.json', 'src/lib/persona-bank/**'],
      unlocks: ['Verzija 7'],
    },
    {
      id: 'Verzija 7',
      releaseOrder: 7,
      slug: 'enterprise-operating-model',
      focusArea: 'enterprise',
      status: 'PLANNED',
      summary: 'Completes the enterprise operating model with clear runtime/governance boundaries, mandatory human review, security scanning, and self-healing release discipline.',
      primaryArtifacts: ['docs/EXTRIMLI-EXTERNAL-GITHUB.md', '.github/workflows/extrimli-external-github.yml'],
      unlocks: [],
    },
  ],
  sharedPrinciples: [
    {
      id: 'no-breaking-source-of-truth',
      statement: 'No breaking changes are allowed on locked source-of-truth endpoints.',
    },
    {
      id: 'additive-only-expansion',
      statement: 'All roadmap growth remains additive-only and backward-compatible.',
    },
    {
      id: 'wawe-governance-lock',
      statement: 'WAWE 1–5 remains the canonical rollout model across the ecosystem.',
    },
    {
      id: 'kpi-budget-lock',
      statement: 'Evaluation stays ≤ 50ms, API response stays ≤ 200ms, and build stays ≤ 3 min where applicable.',
    },
    {
      id: 'downstream-explicitness',
      statement: 'Downstream references and sync to spaja86/IO-OPENUI-AO must remain explicit.',
    },
    {
      id: 'review-security-rollback',
      statement: 'Human review, security scanning, and rollback planning are mandatory before promotion.',
    },
  ],
  deliverySequence: [
    {
      wave: 'FOUNDATION',
      versions: ['Verzija 1', 'Verzija 2', 'Verzija 3'],
      outcome: 'Close runtime and readiness foundations before governance hardening.',
    },
    {
      wave: 'GOVERNANCE',
      versions: ['Verzija 4', 'Verzija 5'],
      outcome: 'Apply mandatory profiler and release-orchestration governance on top of stable signals.',
    },
    {
      wave: 'OPERATING-MODEL',
      versions: ['Verzija 6', 'Verzija 7'],
      outcome: 'Finish multi-repo and enterprise operating posture after governance is stable.',
    },
  ],
  developerCreateLock: EXTRIMLI_DEVELOPER_CREATE_LOCK,
  downstreamSync: {
    linkedRepo: 'spaja86/IO-OPENUI-AO',
    referencesRequired: true,
    additiveOnly: true,
    requiredLabels: [
      'extrimli:logic-change',
      'extrondend:logic-change',
      'extrondol:logic-change',
      'extrem:logic-change',
    ],
  },
  enterpriseOperatingModel: {
    runtimeSourceOfTruth: 'Vercel Git integration',
    governanceLayer: 'GitHub Actions',
    humanReviewRequired: true,
    securityScanningRequired: true,
    rollbackPlanRequired: true,
  },
};

function toExtrimliDeveloperCreateLockComparable(
  lock: ExtrimliDeveloperCreateProgramLock,
) {
  const {
    sourceProgramDoc,
    additiveOnly,
    sourceOfTruthRoutes,
    lockedCoreArtifacts,
    mandatoryArtifacts,
    ownershipBoundary,
    driftZeroLayers,
    realizationSequence,
    implementationStreams,
    expansionTracks,
    prExecutionLock,
    operationalAuditPackage,
    acceptanceLock,
    definitionOfDone,
    ...unexpectedTopLevel
  } = lock;
  assertNoExtraKeys(unexpectedTopLevel);

  const {
    extrimli,
    extrem,
    extrondol,
    dok,
    dik,
    for: technicalFor,
    dak,
    duk,
    spajaKod,
    ...unexpectedOwnershipBoundary
  } = ownershipBoundary;
  assertNoExtraKeys(unexpectedOwnershipBoundary);

  const {
    additiveOnlyRequired,
    dokDikDakDukSplitLocked,
    sourceOfTruthRoutesStable,
    docsTypesRoutesTestsWorkflowsAligned,
    downstreamReferenceRequired,
    humanReviewRequired,
    securityRequired,
    rollbackRequired,
    ...unexpectedDefinitionOfDone
  } = definitionOfDone;
  assertNoExtraKeys(unexpectedDefinitionOfDone);

  const {
    docs,
    runtime,
    routes,
    tests,
    governance,
    ...unexpectedMandatoryArtifacts
  } = mandatoryArtifacts;
  assertNoExtraKeys(unexpectedMandatoryArtifacts);

  const {
    singleRoadmapStagePerPr,
    measurableOutputRequired,
    requiredFields: prExecutionRequiredFields,
    ...unexpectedPrExecutionLock
  } = prExecutionLock;
  assertNoExtraKeys(unexpectedPrExecutionLock);

  const {
    required: operationalAuditPackageRequired,
    standardizedPrDescription,
    requiredFields: operationalAuditRequiredFields,
    ...unexpectedOperationalAuditPackage
  } = operationalAuditPackage;
  assertNoExtraKeys(unexpectedOperationalAuditPackage);

  const {
    noNewSourceOfTruthRoutes,
    sourceOfTruthRoutesStable: acceptanceSourceOfTruthRoutesStable,
    driftZeroRequired,
    allowedStatuses,
    degradedPolicy,
    humanReviewRequired: acceptanceHumanReviewRequired,
    securityRequired: acceptanceSecurityRequired,
    rollbackRequired: acceptanceRollbackRequired,
    ...unexpectedAcceptanceLock
  } = acceptanceLock;
  assertNoExtraKeys(unexpectedAcceptanceLock);

  return {
    sourceProgramDoc,
    additiveOnly,
    sourceOfTruthRoutes: [...sourceOfTruthRoutes],
    lockedCoreArtifacts: [...lockedCoreArtifacts],
    mandatoryArtifacts: {
      docs: [...docs],
      runtime: [...runtime],
      routes: [...routes],
      tests: [...tests],
      governance: [...governance],
    },
    ownershipBoundary: {
      extrimli,
      extrem,
      extrondol,
      dok,
      dik,
      for: technicalFor,
      dak,
      duk,
      spajaKod,
    },
    driftZeroLayers: [...driftZeroLayers],
    realizationSequence: [...realizationSequence],
    implementationStreams: implementationStreams.map((stream) => ({ ...stream })),
    expansionTracks: [...expansionTracks],
    prExecutionLock: {
      singleRoadmapStagePerPr,
      measurableOutputRequired,
      requiredFields: [...prExecutionRequiredFields],
    },
    operationalAuditPackage: {
      required: operationalAuditPackageRequired,
      standardizedPrDescription,
      requiredFields: [...operationalAuditRequiredFields],
    },
    acceptanceLock: {
      noNewSourceOfTruthRoutes,
      sourceOfTruthRoutesStable: acceptanceSourceOfTruthRoutesStable,
      driftZeroRequired,
      allowedStatuses: [...allowedStatuses],
      degradedPolicy,
      humanReviewRequired: acceptanceHumanReviewRequired,
      securityRequired: acceptanceSecurityRequired,
      rollbackRequired: acceptanceRollbackRequired,
    },
    definitionOfDone: {
      additiveOnlyRequired,
      dokDikDakDukSplitLocked,
      sourceOfTruthRoutesStable,
      docsTypesRoutesTestsWorkflowsAligned,
      downstreamReferenceRequired,
      humanReviewRequired,
      securityRequired,
      rollbackRequired,
    },
  };
}

function assertNoExtraKeys<T extends Record<string, never>>(_value: T): void {}

function serializeExtrimliDeveloperCreateLock(
  lock: ExtrimliDeveloperCreateProgramLock,
): string {
  return JSON.stringify(toExtrimliDeveloperCreateLockComparable(lock));
}

function hasAlignedExtrimliDeveloperCreateLockKeyset(
  lock: ExtrimliDeveloperCreateProgramLock,
): boolean {
  const normalizedLock = toExtrimliDeveloperCreateLockComparable(lock);
  const rawTopLevelKeys = Object.keys(lock).sort().join(',');
  const normalizedTopLevelKeys = Object.keys(normalizedLock).sort().join(',');
  const rawOwnershipKeys = Object.keys(lock.ownershipBoundary).sort().join(',');
  const normalizedOwnershipKeys = Object.keys(normalizedLock.ownershipBoundary).sort().join(',');
  const rawDefinitionOfDoneKeys = Object.keys(lock.definitionOfDone).sort().join(',');
  const normalizedDefinitionOfDoneKeys = Object.keys(normalizedLock.definitionOfDone).sort().join(',');

  return rawTopLevelKeys === normalizedTopLevelKeys
    && rawOwnershipKeys === normalizedOwnershipKeys
    && rawDefinitionOfDoneKeys === normalizedDefinitionOfDoneKeys;
}

export function isExtrimliDeveloperCreateLockAligned(
  lock: ExtrimliDeveloperCreateProgramLock,
): boolean {
  return hasAlignedExtrimliDeveloperCreateLockKeyset(lock)
    && hasAlignedExtrimliDeveloperCreateLockKeyset(EXTRIMLI_DEVELOPER_CREATE_LOCK)
    && serializeExtrimliDeveloperCreateLock(lock)
    === serializeExtrimliDeveloperCreateLock(EXTRIMLI_DEVELOPER_CREATE_LOCK);
}

export function getExtrimliVersionRoadmap(): ExtrimliVersionRoadmap {
  return EXTRIMLI_VERSION_ROADMAP;
}
