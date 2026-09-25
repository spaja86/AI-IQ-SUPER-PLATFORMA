export type ExtrimliInnovationReadinessStatus = 'READY' | 'WATCH' | 'BLOCKED';
export type ExtrimliInnovationGovernanceStatus = 'promote' | 'freeze' | 'rollback';
export type ExtrimliInnovationWavePriority = 'critical' | 'high' | 'medium' | 'experimental';
export type ExtrimliInnovationTrack =
  | 'funkcionalno'
  | 'objektno'
  | 'proporcionalno'
  | 'metriko'
  | 'paradijogonalno'
  | 'audio-vizuelno';

export interface ExtrimliInnovationRegistryEntry {
  id: string;
  name: string;
  clusterId: string;
  clusterIndex: number;
  innovationIndex: number;
  expectedEffect: string;
  readinessStatus: ExtrimliInnovationReadinessStatus;
  governanceStatus: ExtrimliInnovationGovernanceStatus;
  wavePriority: ExtrimliInnovationWavePriority;
  track: ExtrimliInnovationTrack;
  deterministicFallbackQuality: 'strong' | 'bounded' | 'degraded';
  downstreamTag: 'summary-only-io-openui-ao';
}

export interface ExtrimliInnovationRegistryCluster {
  clusterId: string;
  clusterName: string;
  innovationCount: 100;
  readinessSummary: Record<ExtrimliInnovationReadinessStatus, number>;
  governanceSummary: Record<ExtrimliInnovationGovernanceStatus, number>;
}

export interface ExtrimliInnovationRegistryModel {
  canonicalAlias: 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == 13000 INOVACIJA';
  additiveOnly: true;
  sourceOfTruthRoutes: readonly ['/api/extrimli/extrem', '/api/extrimli/extrondol', '/api/extrimli/spaja-kod'];
  ownershipLock: {
    dokDikFor: 'EXTREM';
    dakDuk: 'EXTRONDOL';
    spajaKod: 'audit-safe-summary-only';
  };
  matrix: {
    clusterCount: 130;
    innovationsPerCluster: 100;
    targetInnovationCount: 13000;
  };
  phaseMapping: readonly [
    { id: 'V1'; focus: string },
    { id: 'V2'; focus: string },
    { id: 'V3'; focus: string },
    { id: 'V4'; focus: string },
    { id: 'V5'; focus: string },
    { id: 'V6'; focus: string },
    { id: 'V7'; focus: string },
    { id: 'V700'; focus: string }
  ];
  cadence: {
    daily: readonly ['cluster-planning', 'technical-validation', 'governance-decision', 'summary-publish'];
    weekly: readonly ['wave-prioritization', 'blocker-closure'];
    monthly: readonly ['audit', 'ecosystem-benchmark'];
  };
  governancePolicy: {
    humanReviewGateRequired: true;
    rolloutRollbackRequired: true;
    auditSummaryRequired: true;
    freezeReasonRequiredWhenBlocked: true;
  };
  kpi: {
    coveragePercent: number;
    qualityReadyWithoutCriticalBlockersPercent: number;
    governancePromotionRatioPercent: number;
    governanceRollbackRatioPercent: number;
    ecosystemStabilityPercent: number;
  };
  totals: {
    totalInnovations: number;
    byReadiness: Record<ExtrimliInnovationReadinessStatus, number>;
    byGovernance: Record<ExtrimliInnovationGovernanceStatus, number>;
    byWavePriority: Record<ExtrimliInnovationWavePriority, number>;
    byTrack: Record<ExtrimliInnovationTrack, number>;
    blockedCriticalCount: number;
  };
  clusters: ExtrimliInnovationRegistryCluster[];
  innovations: ExtrimliInnovationRegistryEntry[];
  summarySafeDashboard: {
    totalInnovations: number;
    clusterCount: number;
    coveragePercent: number;
    readiness: Record<ExtrimliInnovationReadinessStatus, number>;
    governance: Record<ExtrimliInnovationGovernanceStatus, number>;
    blockerReasons: readonly [
      'governance-review-required',
      'deterministic-fallback-quality-degraded',
      'wave-freeze-priority-critical'
    ];
    downstreamReference: 'docs/MULTI-REPO-LINKS.md -> spaja86/IO-OPENUI-AO (summary-only)';
  };
}

const CLUSTER_COUNT = 130 as const;
const INNOVATIONS_PER_CLUSTER = 100 as const;
const TRACKS: readonly ExtrimliInnovationTrack[] = [
  'funkcionalno',
  'objektno',
  'proporcionalno',
  'metriko',
  'paradijogonalno',
  'audio-vizuelno',
] as const;

function toClusterId(index: number): string {
  return `CLUSTER-${String(index).padStart(3, '0')}`;
}

function toInnovationId(clusterIndex: number, innovationIndex: number): string {
  return `INOV-${String(clusterIndex).padStart(3, '0')}-${String(innovationIndex).padStart(3, '0')}`;
}

function resolveReadiness(globalIndex: number): ExtrimliInnovationReadinessStatus {
  if (globalIndex % 10 === 0) return 'BLOCKED';
  if (globalIndex % 3 === 0) return 'WATCH';
  return 'READY';
}

function resolveWavePriority(
  readinessStatus: ExtrimliInnovationReadinessStatus,
  globalIndex: number,
): ExtrimliInnovationWavePriority {
  if (readinessStatus === 'BLOCKED') return globalIndex % 2 === 0 ? 'critical' : 'high';
  if (readinessStatus === 'WATCH') return globalIndex % 2 === 0 ? 'high' : 'medium';
  return globalIndex % 5 === 0 ? 'medium' : 'experimental';
}

function resolveFallbackQuality(
  readinessStatus: ExtrimliInnovationReadinessStatus,
): ExtrimliInnovationRegistryEntry['deterministicFallbackQuality'] {
  if (readinessStatus === 'BLOCKED') return 'degraded';
  if (readinessStatus === 'WATCH') return 'bounded';
  return 'strong';
}

export function buildExtrimliInnovationRegistry(): ExtrimliInnovationRegistryModel {
  const innovations: ExtrimliInnovationRegistryEntry[] = [];
  const clusters: ExtrimliInnovationRegistryCluster[] = [];

  const byReadiness: Record<ExtrimliInnovationReadinessStatus, number> = {
    READY: 0,
    WATCH: 0,
    BLOCKED: 0,
  };
  const byGovernance: Record<ExtrimliInnovationGovernanceStatus, number> = {
    promote: 0,
    freeze: 0,
    rollback: 0,
  };
  const byWavePriority: Record<ExtrimliInnovationWavePriority, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    experimental: 0,
  };
  const byTrack: Record<ExtrimliInnovationTrack, number> = {
    funkcionalno: 0,
    objektno: 0,
    proporcionalno: 0,
    metriko: 0,
    paradijogonalno: 0,
    'audio-vizuelno': 0,
  };
  let blockedCriticalCount = 0;
  let globalIndex = 0;

  for (let clusterIndex = 1; clusterIndex <= CLUSTER_COUNT; clusterIndex += 1) {
    const clusterReadiness: Record<ExtrimliInnovationReadinessStatus, number> = {
      READY: 0,
      WATCH: 0,
      BLOCKED: 0,
    };
    const clusterGovernance: Record<ExtrimliInnovationGovernanceStatus, number> = {
      promote: 0,
      freeze: 0,
      rollback: 0,
    };

    for (let innovationIndex = 1; innovationIndex <= INNOVATIONS_PER_CLUSTER; innovationIndex += 1) {
      const readinessStatus = resolveReadiness(globalIndex);
      const governanceStatus: ExtrimliInnovationGovernanceStatus =
        readinessStatus === 'READY' ? 'promote' : readinessStatus === 'WATCH' ? 'freeze' : 'rollback';
      const wavePriority = resolveWavePriority(readinessStatus, globalIndex);
      const track = TRACKS[globalIndex % TRACKS.length];

      if (readinessStatus === 'BLOCKED' && wavePriority === 'critical') blockedCriticalCount += 1;

      const entry: ExtrimliInnovationRegistryEntry = {
        id: toInnovationId(clusterIndex, innovationIndex),
        name: `INOVACIJA ${clusterIndex}.${innovationIndex} / ${track.toUpperCase()}`,
        clusterId: toClusterId(clusterIndex),
        clusterIndex,
        innovationIndex,
        expectedEffect: `Poboljsanje ekosistema kroz ${track} traku u klasteru ${clusterIndex}.`,
        readinessStatus,
        governanceStatus,
        wavePriority,
        track,
        deterministicFallbackQuality: resolveFallbackQuality(readinessStatus),
        downstreamTag: 'summary-only-io-openui-ao',
      };

      innovations.push(entry);
      byReadiness[readinessStatus] += 1;
      byGovernance[governanceStatus] += 1;
      byWavePriority[wavePriority] += 1;
      byTrack[track] += 1;
      clusterReadiness[readinessStatus] += 1;
      clusterGovernance[governanceStatus] += 1;
      globalIndex += 1;
    }

    clusters.push({
      clusterId: toClusterId(clusterIndex),
      clusterName: `INOVACIONI KLASTER ${String(clusterIndex).padStart(3, '0')}`,
      innovationCount: INNOVATIONS_PER_CLUSTER,
      readinessSummary: clusterReadiness,
      governanceSummary: clusterGovernance,
    });
  }

  const totalInnovations = innovations.length;
  const coveragePercent = Math.round((totalInnovations / (CLUSTER_COUNT * INNOVATIONS_PER_CLUSTER)) * 10000) / 100;
  const qualityReadyWithoutCriticalBlockersPercent = Math.round(((byReadiness.READY - blockedCriticalCount) / totalInnovations) * 10000) / 100;
  const governancePromotionRatioPercent = Math.round((byGovernance.promote / totalInnovations) * 10000) / 100;
  const governanceRollbackRatioPercent = Math.round((byGovernance.rollback / totalInnovations) * 10000) / 100;
  const ecosystemStabilityPercent = Math.round(((byReadiness.READY + byReadiness.WATCH) / totalInnovations) * 10000) / 100;

  return {
    canonicalAlias: 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == 13000 INOVACIJA',
    additiveOnly: true,
    sourceOfTruthRoutes: ['/api/extrimli/extrem', '/api/extrimli/extrondol', '/api/extrimli/spaja-kod'],
    ownershipLock: {
      dokDikFor: 'EXTREM',
      dakDuk: 'EXTRONDOL',
      spajaKod: 'audit-safe-summary-only',
    },
    matrix: {
      clusterCount: CLUSTER_COUNT,
      innovationsPerCluster: INNOVATIONS_PER_CLUSTER,
      targetInnovationCount: CLUSTER_COUNT * INNOVATIONS_PER_CLUSTER,
    },
    phaseMapping: [
      { id: 'V1', focus: 'taxonomy-standardization' },
      { id: 'V2', focus: 'registry-standardization' },
      { id: 'V3', focus: 'extrem-innovation-scoring' },
      { id: 'V4', focus: 'extrem-deterministic-fallback-discipline' },
      { id: 'V5', focus: 'extrondol-release-orchestration' },
      { id: 'V6', focus: 'multi-repo-summary-sync-io-openui-ao' },
      { id: 'V7', focus: 'enterprise-governance-and-audit-scaling' },
      { id: 'V700', focus: 'full-13000-ecosystem-governance-extension' },
    ],
    cadence: {
      daily: ['cluster-planning', 'technical-validation', 'governance-decision', 'summary-publish'],
      weekly: ['wave-prioritization', 'blocker-closure'],
      monthly: ['audit', 'ecosystem-benchmark'],
    },
    governancePolicy: {
      humanReviewGateRequired: true,
      rolloutRollbackRequired: true,
      auditSummaryRequired: true,
      freezeReasonRequiredWhenBlocked: true,
    },
    kpi: {
      coveragePercent,
      qualityReadyWithoutCriticalBlockersPercent,
      governancePromotionRatioPercent,
      governanceRollbackRatioPercent,
      ecosystemStabilityPercent,
    },
    totals: {
      totalInnovations,
      byReadiness,
      byGovernance,
      byWavePriority,
      byTrack,
      blockedCriticalCount,
    },
    clusters,
    innovations,
    summarySafeDashboard: {
      totalInnovations,
      clusterCount: CLUSTER_COUNT,
      coveragePercent,
      readiness: { ...byReadiness },
      governance: { ...byGovernance },
      blockerReasons: [
        'governance-review-required',
        'deterministic-fallback-quality-degraded',
        'wave-freeze-priority-critical',
      ],
      downstreamReference: 'docs/MULTI-REPO-LINKS.md -> spaja86/IO-OPENUI-AO (summary-only)',
    },
  };
}
