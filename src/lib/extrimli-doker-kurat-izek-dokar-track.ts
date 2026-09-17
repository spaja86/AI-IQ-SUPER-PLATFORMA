export type DokerKuratIzekDokarToken =
  | 'DOKER'
  | 'KURAT'
  | 'IZEK'
  | 'DOKAR';

export type DokerKuratIzekDokarSignalRole =
  | 'downstream-sync'
  | 'technical-risk'
  | 'audit-review'
  | 'rollback-control';

export type DokerKuratIzekDokarTokenStatus =
  | 'READY'
  | 'WATCH'
  | 'BLOCKED'
  | 'REQUIRED'
  | 'ALIGNED'
  | 'FOLLOW_UP_REQUIRED';

export interface DokerKuratIzekDokarTokenSpec {
  token: DokerKuratIzekDokarToken;
  position: number;
  stableMeaning: string;
  signalRole: DokerKuratIzekDokarSignalRole;
  governanceUse: string;
}

export interface DokerKuratIzekDokarTokenState {
  token: DokerKuratIzekDokarToken;
  position: number;
  signalRole: DokerKuratIzekDokarSignalRole;
  status: DokerKuratIzekDokarTokenStatus;
  signalSource: string;
  summary: string;
  publicVisible: boolean;
}

export interface ExtrimliDokerKuratIzekDokarVocabulary {
  trackId: 'extrimli-doker-kurat-izek-dokar-track';
  contractVersion: 'v1-doker-kurat-izek-dokar-track';
  additiveOnly: true;
  ordered: true;
  mandatoryTokens: true;
  publicBoundary: 'SPAJA KOD';
  technicalSourceOfTruth: '/api/extrimli/extrem';
  governanceSourceOfTruth: '/api/extrimli/extrondol';
  downstreamRepo: 'spaja86/IO-OPENUI-AO';
  tokenSequence: readonly [
    DokerKuratIzekDokarTokenSpec,
    DokerKuratIzekDokarTokenSpec,
    DokerKuratIzekDokarTokenSpec,
    DokerKuratIzekDokarTokenSpec
  ];
}

export interface ExtrimliDokerKuratIzekDokarExtremTrack {
  vocabulary: ExtrimliDokerKuratIzekDokarVocabulary;
  technicalSignalEngine: 'EXTREM';
  governanceConsumer: 'EXTRONDOL';
  publicBoundary: 'SPAJA KOD';
  internalOnlyMapping: true;
  freezeControlledByExtrem: boolean;
  sequenceStates: readonly [
    DokerKuratIzekDokarTokenState,
    DokerKuratIzekDokarTokenState,
    DokerKuratIzekDokarTokenState,
    DokerKuratIzekDokarTokenState
  ];
}

export interface ExtrimliDokerKuratIzekDokarGovernanceTrack {
  vocabulary: ExtrimliDokerKuratIzekDokarVocabulary;
  orchestrationLayer: 'EXTRONDOL';
  technicalSignalSource: '/api/extrimli/extrem';
  publicBoundary: 'SPAJA KOD';
  sequenceStates: readonly [
    DokerKuratIzekDokarTokenState,
    DokerKuratIzekDokarTokenState,
    DokerKuratIzekDokarTokenState,
    DokerKuratIzekDokarTokenState
  ];
  releaseAuditAligned: boolean;
  downstreamReferenceExplicit: boolean;
}

export interface ExtrimliDokerKuratIzekDokarPublicBoundaryStatus {
  boundarySurface: 'SPAJA KOD';
  contractVersion: 'v1-doker-kurat-izek-dokar-track';
  publicStatus: 'READY' | 'WATCH' | 'BLOCKED';
  internalMappingVisibility: 'HIDDEN';
  tokenSummaries: readonly [
    { token: 'DOKER'; status: DokerKuratIzekDokarTokenStatus; summary: string },
    { token: 'KURAT'; status: DokerKuratIzekDokarTokenStatus; summary: string },
    { token: 'IZEK'; status: DokerKuratIzekDokarTokenStatus; summary: string },
    { token: 'DOKAR'; status: DokerKuratIzekDokarTokenStatus; summary: string }
  ];
  summary: string;
}

const DOKER_KURAT_IZEK_DOKAR_VOCABULARY: ExtrimliDokerKuratIzekDokarVocabulary = {
  trackId: 'extrimli-doker-kurat-izek-dokar-track',
  contractVersion: 'v1-doker-kurat-izek-dokar-track',
  additiveOnly: true,
  ordered: true,
  mandatoryTokens: true,
  publicBoundary: 'SPAJA KOD',
  technicalSourceOfTruth: '/api/extrimli/extrem',
  governanceSourceOfTruth: '/api/extrimli/extrondol',
  downstreamRepo: 'spaja86/IO-OPENUI-AO',
  tokenSequence: [
    {
      token: 'DOKER',
      position: 1,
      stableMeaning: 'Downstream synchronization token reused without changing its existing SPAJAPRO meaning.',
      signalRole: 'downstream-sync',
      governanceUse: 'Keeps linked-repo alignment explicit before rollout widens.',
    },
    {
      token: 'KURAT',
      position: 2,
      stableMeaning: 'Technical conflict and freeze-pressure token.',
      signalRole: 'technical-risk',
      governanceUse: 'Carries EXTREM technical risk posture into WAWE freeze decisions.',
    },
    {
      token: 'IZEK',
      position: 3,
      stableMeaning: 'Audit and human-review checkpoint token.',
      signalRole: 'audit-review',
      governanceUse: 'Binds release-audit readiness and review evidence to promotion posture.',
    },
    {
      token: 'DOKAR',
      position: 4,
      stableMeaning: 'Rollback-preservation token.',
      signalRole: 'rollback-control',
      governanceUse: 'Keeps rollback readiness mandatory before public promotion.',
    },
  ],
};

function statusFromConflict(conflictIntensity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'): 'READY' | 'WATCH' | 'BLOCKED' {
  if (conflictIntensity === 'HIGH' || conflictIntensity === 'CRITICAL') return 'BLOCKED';
  if (conflictIntensity === 'MODERATE') return 'WATCH';
  return 'READY';
}

export function getDokerKuratIzekDokarVocabulary(): ExtrimliDokerKuratIzekDokarVocabulary {
  return DOKER_KURAT_IZEK_DOKAR_VOCABULARY;
}

export function buildDokerKuratIzekDokarExtremTrack(params: {
  freezeRequired: boolean;
  conflictIntensity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}): ExtrimliDokerKuratIzekDokarExtremTrack {
  const technicalRiskStatus = statusFromConflict(params.conflictIntensity);
  const sequenceStates: ExtrimliDokerKuratIzekDokarExtremTrack['sequenceStates'] = [
    {
      token: 'DOKER',
      position: 1,
      signalRole: 'downstream-sync',
      status: params.freezeRequired ? 'BLOCKED' : technicalRiskStatus,
      signalSource: '/api/extrimli/extrem#governanceSignal.freezeRequired',
      summary: params.freezeRequired
        ? 'Technical blockers keep downstream sync from being promoted.'
        : `Technical posture is ${technicalRiskStatus} for downstream-sync preparation.`,
      publicVisible: false,
    },
    {
      token: 'KURAT',
      position: 2,
      signalRole: 'technical-risk',
      status: technicalRiskStatus,
      signalSource: '/api/extrimli/extrem#profile.conflictIntensity',
      summary: `Technical-risk token mirrors DISKVIT conflict intensity ${params.conflictIntensity}.`,
      publicVisible: false,
    },
    {
      token: 'IZEK',
      position: 3,
      signalRole: 'audit-review',
      status: params.freezeRequired ? 'BLOCKED' : technicalRiskStatus === 'WATCH' ? 'WATCH' : 'READY',
      signalSource: '/api/extrimli/extrem#governanceSignal.wawePromotionEligible',
      summary: params.freezeRequired
        ? 'Audit/review checkpoint cannot clear while EXTREM freeze is active.'
        : technicalRiskStatus === 'WATCH'
          ? 'Audit/review checkpoint remains watch-bound because technical risk still needs review.'
          : 'Audit/review checkpoint is technically clear for governance consumption.',
      publicVisible: false,
    },
    {
      token: 'DOKAR',
      position: 4,
      signalRole: 'rollback-control',
      status: params.freezeRequired || technicalRiskStatus !== 'READY' ? 'REQUIRED' : 'READY',
      signalSource: '/api/extrimli/extrem#governanceSignal.reasons',
      summary: params.freezeRequired || technicalRiskStatus !== 'READY'
        ? 'Rollback preservation stays mandatory while technical risk or freeze posture exists.'
        : 'Rollback preservation is technically ready and remains bounded for promotion.',
      publicVisible: false,
    },
  ];

  return {
    vocabulary: getDokerKuratIzekDokarVocabulary(),
    technicalSignalEngine: 'EXTREM',
    governanceConsumer: 'EXTRONDOL',
    publicBoundary: 'SPAJA KOD',
    internalOnlyMapping: true,
    freezeControlledByExtrem: params.freezeRequired,
    sequenceStates,
  };
}

export function buildDokerKuratIzekDokarGovernanceTrack(params: {
  technicalRiskStatus: 'READY' | 'WATCH' | 'BLOCKED';
  promotionFreeze: boolean;
  releaseAuditStatus: 'READY' | 'BLOCKED';
  downstreamSyncComplete: boolean;
  humanReviewComplete: boolean;
  rollbackPlanRequired: boolean;
}): ExtrimliDokerKuratIzekDokarGovernanceTrack {
  const sequenceStates: ExtrimliDokerKuratIzekDokarGovernanceTrack['sequenceStates'] = [
    {
      token: 'DOKER',
      position: 1,
      signalRole: 'downstream-sync',
      status: params.downstreamSyncComplete ? 'ALIGNED' : 'FOLLOW_UP_REQUIRED',
      signalSource: 'spaja86/IO-OPENUI-AO',
      summary: `Downstream sync with spaja86/IO-OPENUI-AO is ${params.downstreamSyncComplete ? 'ALIGNED' : 'FOLLOW_UP_REQUIRED'}.`,
      publicVisible: false,
    },
    {
      token: 'KURAT',
      position: 2,
      signalRole: 'technical-risk',
      status: params.promotionFreeze ? 'BLOCKED' : params.technicalRiskStatus,
      signalSource: '/api/extrimli/extrem',
      summary: params.promotionFreeze
        ? 'Governance promotes EXTREM technical risk into an active freeze posture.'
        : `Governance imports EXTREM technical-risk posture ${params.technicalRiskStatus}.`,
      publicVisible: false,
    },
    {
      token: 'IZEK',
      position: 3,
      signalRole: 'audit-review',
      status: params.releaseAuditStatus === 'BLOCKED' ? 'BLOCKED' : params.humanReviewComplete ? 'READY' : 'REQUIRED',
      signalSource: '/api/extrimli/extrondol#releaseAuditSummary',
      summary: params.releaseAuditStatus === 'BLOCKED'
        ? 'Audit/review checkpoint is blocked until release audit passes.'
        : params.humanReviewComplete
          ? 'Audit/review checkpoint is ready with human-review evidence attached.'
          : 'Audit/review checkpoint still requires human-review evidence.',
      publicVisible: false,
    },
    {
      token: 'DOKAR',
      position: 4,
      signalRole: 'rollback-control',
      status: params.rollbackPlanRequired ? 'REQUIRED' : params.promotionFreeze ? 'WATCH' : 'READY',
      signalSource: '/api/extrimli/extrondol#releaseAuditSummary.rollbackPlanRequired',
      summary: params.rollbackPlanRequired
        ? 'Rollback control remains mandatory before promotion.'
        : params.promotionFreeze
          ? 'Rollback control stays under watch while promotion freeze is active.'
          : 'Rollback control is ready for the current rollout posture.',
      publicVisible: false,
    },
  ];

  return {
    vocabulary: getDokerKuratIzekDokarVocabulary(),
    orchestrationLayer: 'EXTRONDOL',
    technicalSignalSource: '/api/extrimli/extrem',
    publicBoundary: 'SPAJA KOD',
    sequenceStates,
    releaseAuditAligned: sequenceStates[2].status === (params.releaseAuditStatus === 'BLOCKED' ? 'BLOCKED' : params.humanReviewComplete ? 'READY' : 'REQUIRED'),
    downstreamReferenceExplicit: sequenceStates[0].signalSource === 'spaja86/IO-OPENUI-AO',
  };
}

export function buildDokerKuratIzekDokarPublicBoundaryStatus(params: {
  sequenceStates: ExtrimliDokerKuratIzekDokarGovernanceTrack['sequenceStates'];
  promotionFreeze: boolean;
}): ExtrimliDokerKuratIzekDokarPublicBoundaryStatus {
  const publicStatus = params.promotionFreeze
    ? 'BLOCKED'
    : params.sequenceStates.some((state) => state.status === 'WATCH' || state.status === 'REQUIRED' || state.status === 'FOLLOW_UP_REQUIRED')
      ? 'WATCH'
      : 'READY';

  return {
    boundarySurface: 'SPAJA KOD',
    contractVersion: 'v1-doker-kurat-izek-dokar-track',
    publicStatus,
    internalMappingVisibility: 'HIDDEN',
    tokenSummaries: [
      {
        token: 'DOKER',
        status: params.sequenceStates[0].status,
        summary: 'Downstream alignment remains explicit for linked-repo consumers.',
      },
      {
        token: 'KURAT',
        status: params.sequenceStates[1].status,
        summary: 'Technical risk is exposed only as a bounded public posture.',
      },
      {
        token: 'IZEK',
        status: params.sequenceStates[2].status,
        summary: 'Audit/review readiness is exposed without internal governance details.',
      },
      {
        token: 'DOKAR',
        status: params.sequenceStates[3].status,
        summary: 'Rollback readiness stays visible as a public-safe requirement.',
      },
    ],
    summary: publicStatus === 'BLOCKED'
      ? 'SPAJA KOD exposes a BLOCKED summary for DOKER/KURAT/IZEK/DOKAR while internal mapping stays hidden.'
      : publicStatus === 'WATCH'
        ? 'SPAJA KOD exposes a WATCH summary for DOKER/KURAT/IZEK/DOKAR while internal mapping stays hidden.'
        : 'SPAJA KOD exposes a READY summary for DOKER/KURAT/IZEK/DOKAR while internal mapping stays hidden.',
  };
}
