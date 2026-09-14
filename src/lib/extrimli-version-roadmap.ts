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

export interface ExtrimliVersionRoadmapDeliveryWave {
  wave: 'FOUNDATION' | 'GOVERNANCE' | 'OPERATING-MODEL';
  versions: readonly ExtrimliVersionRoadmapVersionId[];
  outcome: string;
}

export interface ExtrimliVersionRoadmap {
  contractVersion: 'v1-7-roadmap';
  programName: 'EXTRIMLI EXTRONDOL EXTREM';
  model: 'single-ecosystem-phased-roadmap';
  baselineSurfaceVersions: readonly ['v1', 'v3', 'v1-extrem-profiler', 'v1-extrondol'];
  sourceOfTruthSurfaces: readonly [
    '/api/extrimli/health',
    '/api/extrimli-3/health',
    '/api/extrimli/extrem',
    '/api/extrimli/extrondol'
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
      summary: 'Standardizes readiness, degraded, audit, and downstream sync metadata between core EXTRIMLI and higher governance surfaces.',
      primaryArtifacts: ['src/lib/extrimli-extendol/**', 'src/lib/extrimli-extrondend/**', 'docs/EXTRIMLI.md'],
      unlocks: ['Verzija 3', 'Verzija 4', 'Verzija 5'],
    },
    {
      id: 'Verzija 3',
      releaseOrder: 3,
      slug: 'advanced-readiness-profile-expansion',
      focusArea: 'readiness',
      status: 'ACTIVE-EXPANSION',
      summary: 'Expands v3 as the advanced scoring layer with sport-specific profiles, readiness signals, weather-aware scoring, and stable aggregate inputs.',
      primaryArtifacts: ['src/lib/extrimli-3/**', 'src/app/api/extrimli-3/**'],
      unlocks: ['Verzija 4', 'Verzija 5'],
    },
    {
      id: 'Verzija 4',
      releaseOrder: 4,
      slug: 'extrem-governance-hardening',
      focusArea: 'governance',
      status: 'ACTIVE-EXPANSION',
      summary: 'Makes EXTREM the mandatory profiler and freeze gate for conflict intensity, optimization tier, resolution readiness, and browser bottleneck audit.',
      primaryArtifacts: ['src/lib/extrimli-extrem/**', 'src/app/api/extrimli/extrem/**'],
      unlocks: ['Verzija 5', 'Verzija 6', 'Verzija 7'],
    },
    {
      id: 'Verzija 5',
      releaseOrder: 5,
      slug: 'extrondol-release-orchestration',
      focusArea: 'release',
      status: 'ACTIVE-EXPANSION',
      summary: 'Makes EXTRONDOL the primary WAWE orchestration surface for release audit, payment/compliance gates, and rollback-aware rollout decisions.',
      primaryArtifacts: ['src/lib/extrimli-extrondol/**', 'src/app/api/extrimli/extrondol/**'],
      unlocks: ['Verzija 6', 'Verzija 7'],
    },
    {
      id: 'Verzija 6',
      releaseOrder: 6,
      slug: 'multi-repo-persona-sync',
      focusArea: 'multi-repo',
      status: 'PLANNED',
      summary: 'Extends EXTRIMLI, EXTREM, and EXTRONDOL into a full cross-repo lifecycle with snapshot sync, persona-bank status, analytics, and resilience monitoring.',
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

export function getExtrimliVersionRoadmap(): ExtrimliVersionRoadmap {
  return EXTRIMLI_VERSION_ROADMAP;
}
