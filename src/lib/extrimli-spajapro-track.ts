export type SpajaproSequenceToken =
  | 'ODIT'
  | 'DEKER'
  | 'DUNOR'
  | 'SUMOR'
  | 'OKET'
  | 'DAKOR'
  | 'EKSER'
  | 'DOKER'
  | 'DUKAR'
  | 'DONAR'
  | 'KODER';

export type SpajaproSignalRole =
  | 'identity-introduction'
  | 'technical-state'
  | 'conflict-risk'
  | 'orchestration'
  | 'freeze'
  | 'promotion'
  | 'audit'
  | 'downstream-sync'
  | 'human-review'
  | 'rollback'
  | 'final-public-status';

export type SpajaproTokenStatus =
  | 'ACTIVE'
  | 'READY'
  | 'WATCH'
  | 'BLOCKED'
  | 'PENDING'
  | 'REQUIRED'
  | 'ALIGNED'
  | 'FOLLOW_UP_REQUIRED';

export interface SpajaproTokenSpec {
  token: SpajaproSequenceToken;
  position: number;
  stableMeaning: string;
  signalRole: SpajaproSignalRole;
  governanceUse: string;
}

export interface SpajaproTokenState {
  token: SpajaproSequenceToken;
  position: number;
  signalRole: SpajaproSignalRole;
  status: SpajaproTokenStatus;
  signalSource: string;
  summary: string;
  publicVisible: boolean;
}

export interface ExtrimliSpajaproVocabulary {
  trackId: 'spajapro-extrimli-planning-track';
  platformName: 'SPAJAPRO';
  platformMode: 'platforma-umesto-chatgpt';
  layering: 'extends-existing-extrimli-stack';
  publicBoundary: 'SPAJA KOD';
  sourceOfTruth: readonly ['/api/extrimli/extrem', '/api/extrimli/extrondol', '/api/extrimli/spaja-kod'];
  downstreamRepo: 'spaja86/IO-OPENUI-AO';
  additiveOnly: true;
  tokenSequence: readonly SpajaproTokenSpec[];
}

export interface ExtrimliSpajaproExtremTrack {
  vocabulary: ExtrimliSpajaproVocabulary;
  technicalSignalEngine: 'EXTREM';
  governanceConsumer: 'EXTRONDOL';
  publicBoundary: 'SPAJA KOD';
  internalOnlyMapping: true;
  freezeControlledByExtrem: boolean;
  activeTokenStates: readonly SpajaproTokenState[];
}

export interface ExtrimliSpajaproGovernanceTrack {
  vocabulary: ExtrimliSpajaproVocabulary;
  orchestrationLayer: 'EXTRONDOL';
  technicalSignalSource: '/api/extrimli/extrem';
  publicBoundary: 'SPAJA KOD';
  sequenceStates: readonly SpajaproTokenState[];
  releaseAuditAligned: boolean;
  downstreamReferenceExplicit: boolean;
}

export interface ExtrimliSpajaproPublicBoundaryStatus {
  platformName: 'SPAJAPRO';
  platformMode: 'platforma-umesto-chatgpt';
  boundarySurface: 'SPAJA KOD';
  finalPublicStatusToken: 'KODER';
  publicStatus: 'READY' | 'WATCH' | 'BLOCKED';
  internalMappingVisibility: 'HIDDEN';
  summary: string;
}

export const SPAJAPRO_TRACK_ID = 'spajapro-extrimli-planning-track';
export const SPAJAPRO_PLATFORM_NAME = 'SPAJAPRO';
export const SPAJAPRO_PLATFORM_MODE = 'platforma-umesto-chatgpt';
export const SPAJAPRO_PUBLIC_BOUNDARY = 'SPAJA KOD';

const SPAJAPRO_TOKEN_SEQUENCE: readonly SpajaproTokenSpec[] = [
  {
    token: 'ODIT',
    position: 1,
    stableMeaning: 'Platform identity and introduction for the SPAJAPRO planning track.',
    signalRole: 'identity-introduction',
    governanceUse: 'Locks the track as an EXTRIMLI extension instead of a replacement.',
  },
  {
    token: 'DEKER',
    position: 2,
    stableMeaning: 'Technical state signal derived from EXTREM readiness posture.',
    signalRole: 'technical-state',
    governanceUse: 'Carries readiness/watch/blocked posture into orchestration review.',
  },
  {
    token: 'DUNOR',
    position: 3,
    stableMeaning: 'Conflict and risk signal derived from DISKVIT pressure and profiler blockers.',
    signalRole: 'conflict-risk',
    governanceUse: 'Highlights whether technical conflict pressure requires intervention.',
  },
  {
    token: 'SUMOR',
    position: 4,
    stableMeaning: 'WAWE orchestration token for staged rollout progression.',
    signalRole: 'orchestration',
    governanceUse: 'Maps the active WAWE stage and next eligible progression checkpoint.',
  },
  {
    token: 'OKET',
    position: 5,
    stableMeaning: 'Promotion freeze control token.',
    signalRole: 'freeze',
    governanceUse: 'Represents whether blockers or degraded posture force rollout freeze.',
  },
  {
    token: 'DAKOR',
    position: 6,
    stableMeaning: 'Promotion authorization token.',
    signalRole: 'promotion',
    governanceUse: 'Confirms whether progression to the next WAWE stage is allowed.',
  },
  {
    token: 'EKSER',
    position: 7,
    stableMeaning: 'Release audit token.',
    signalRole: 'audit',
    governanceUse: 'Reflects audit-ready versus blocked release summary posture.',
  },
  {
    token: 'DOKER',
    position: 8,
    stableMeaning: 'Downstream synchronization token.',
    signalRole: 'downstream-sync',
    governanceUse: 'Keeps linked-repo alignment to spaja86/IO-OPENUI-AO explicit.',
  },
  {
    token: 'DUKAR',
    position: 9,
    stableMeaning: 'Human-review checkpoint token.',
    signalRole: 'human-review',
    governanceUse: 'Prevents promotion without explicit human-review evidence.',
  },
  {
    token: 'DONAR',
    position: 10,
    stableMeaning: 'Rollback readiness token.',
    signalRole: 'rollback',
    governanceUse: 'Keeps rollback as a required release-gate control.',
  },
  {
    token: 'KODER',
    position: 11,
    stableMeaning: 'Final public status token exposed only through the SPAJA KOD boundary.',
    signalRole: 'final-public-status',
    governanceUse: 'Represents the final public-safe readiness posture for external consumers.',
  },
] as const;

function statusFromTechnicalState(rekulitiPoRauletu: 'ALLOW' | 'WARN' | 'FREEZE'): 'READY' | 'WATCH' | 'BLOCKED' {
  if (rekulitiPoRauletu === 'FREEZE') return 'BLOCKED';
  if (rekulitiPoRauletu === 'WARN') return 'WATCH';
  return 'READY';
}

function statusFromConflict(conflictIntensity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'): 'READY' | 'WATCH' | 'BLOCKED' {
  if (conflictIntensity === 'HIGH' || conflictIntensity === 'CRITICAL') return 'BLOCKED';
  if (conflictIntensity === 'MODERATE') return 'WATCH';
  return 'READY';
}

export function getSpajaproVocabulary(): ExtrimliSpajaproVocabulary {
  return {
    trackId: SPAJAPRO_TRACK_ID,
    platformName: SPAJAPRO_PLATFORM_NAME,
    platformMode: SPAJAPRO_PLATFORM_MODE,
    layering: 'extends-existing-extrimli-stack',
    publicBoundary: SPAJAPRO_PUBLIC_BOUNDARY,
    sourceOfTruth: ['/api/extrimli/extrem', '/api/extrimli/extrondol', '/api/extrimli/spaja-kod'],
    downstreamRepo: 'spaja86/IO-OPENUI-AO',
    additiveOnly: true,
    tokenSequence: SPAJAPRO_TOKEN_SEQUENCE,
  };
}

export function buildSpajaproExtremTrack(params: {
  freezeRequired: boolean;
  conflictIntensity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  rekulitiPoRauletu: 'ALLOW' | 'WARN' | 'FREEZE';
}): ExtrimliSpajaproExtremTrack {
  const vocabulary = getSpajaproVocabulary();
  return {
    vocabulary,
    technicalSignalEngine: 'EXTREM',
    governanceConsumer: 'EXTRONDOL',
    publicBoundary: 'SPAJA KOD',
    internalOnlyMapping: true,
    freezeControlledByExtrem: params.freezeRequired,
    activeTokenStates: [
      {
        token: 'ODIT',
        position: 1,
        signalRole: 'identity-introduction',
        status: 'ACTIVE',
        signalSource: '/api/extrimli/extrem',
        summary: 'SPAJAPRO remains a planning track layered on the existing EXTRIMLI stack.',
        publicVisible: false,
      },
      {
        token: 'DEKER',
        position: 2,
        signalRole: 'technical-state',
        status: statusFromTechnicalState(params.rekulitiPoRauletu),
        signalSource: '/api/extrimli/extrem#resolutionReadiness',
        summary: `Technical-state token mirrors EXTREM resolution policy ${params.rekulitiPoRauletu}.`,
        publicVisible: false,
      },
      {
        token: 'DUNOR',
        position: 3,
        signalRole: 'conflict-risk',
        status: statusFromConflict(params.conflictIntensity),
        signalSource: '/api/extrimli/extrem#profile.conflictIntensity',
        summary: `Conflict-risk token mirrors DISKVIT conflict intensity ${params.conflictIntensity}.`,
        publicVisible: false,
      },
      {
        token: 'OKET',
        position: 5,
        signalRole: 'freeze',
        status: params.freezeRequired ? 'BLOCKED' : 'READY',
        signalSource: '/api/extrimli/extrem#governanceSignal.freezeRequired',
        summary: params.freezeRequired
          ? 'EXTREM independently requires a freeze before EXTRONDOL promotion can continue.'
          : 'EXTREM does not independently block EXTRONDOL promotion.',
        publicVisible: false,
      },
    ],
  };
}

export function buildSpajaproGovernanceTrack(params: {
  technicalState: 'READY' | 'WATCH' | 'BLOCKED';
  conflictState: 'READY' | 'WATCH' | 'BLOCKED';
  currentWawe: string;
  promotionFreeze: boolean;
  releaseAuditStatus: 'READY' | 'BLOCKED';
  downstreamSyncStatus: 'ALIGNED' | 'FOLLOW_UP_REQUIRED';
  humanReviewComplete: boolean;
  rollbackPlanRequired: boolean;
  finalPublicStatus: 'READY' | 'WATCH' | 'BLOCKED';
}): ExtrimliSpajaproGovernanceTrack {
  const vocabulary = getSpajaproVocabulary();
  const sequenceStates: readonly SpajaproTokenState[] = [
    {
      token: 'ODIT',
      position: 1,
      signalRole: 'identity-introduction',
      status: 'ACTIVE',
      signalSource: '/api/extrimli/extrondol',
      summary: 'SPAJAPRO is locked as a new planning track on top of EXTRIMLI.',
      publicVisible: false,
    },
    {
      token: 'DEKER',
      position: 2,
      signalRole: 'technical-state',
      status: params.technicalState,
      signalSource: '/api/extrimli/extrem',
      summary: 'Technical-state posture is imported from EXTREM readiness interpretation.',
      publicVisible: false,
    },
    {
      token: 'DUNOR',
      position: 3,
      signalRole: 'conflict-risk',
      status: params.conflictState,
      signalSource: '/api/extrimli/extrem',
      summary: 'Conflict-risk posture is imported from EXTREM conflict intensity.',
      publicVisible: false,
    },
    {
      token: 'SUMOR',
      position: 4,
      signalRole: 'orchestration',
      status: 'ACTIVE',
      signalSource: '/api/extrimli/extrondol#rollout.currentWawe',
      summary: `WAWE orchestration is currently staged at ${params.currentWawe}.`,
      publicVisible: false,
    },
    {
      token: 'OKET',
      position: 5,
      signalRole: 'freeze',
      status: params.promotionFreeze ? 'BLOCKED' : 'READY',
      signalSource: '/api/extrimli/extrondol#rollout.promotionFreeze',
      summary: params.promotionFreeze
        ? 'Promotion freeze remains active because one or more blockers are unresolved.'
        : 'Promotion freeze is cleared for the current governance posture.',
      publicVisible: false,
    },
    {
      token: 'DAKOR',
      position: 6,
      signalRole: 'promotion',
      status: params.promotionFreeze ? 'PENDING' : 'READY',
      signalSource: '/api/extrimli/extrondol#rollout.eligibleNextWawe',
      summary: params.promotionFreeze
        ? 'Promotion token remains pending until the freeze is cleared.'
        : 'Promotion token is ready for the next eligible WAWE.',
      publicVisible: false,
    },
    {
      token: 'EKSER',
      position: 7,
      signalRole: 'audit',
      status: params.releaseAuditStatus,
      signalSource: '/api/extrimli/extrondol#releaseAuditSummary',
      summary: `Release audit posture is ${params.releaseAuditStatus}.`,
      publicVisible: false,
    },
    {
      token: 'DOKER',
      position: 8,
      signalRole: 'downstream-sync',
      status: params.downstreamSyncStatus,
      signalSource: 'spaja86/IO-OPENUI-AO',
      summary: `Downstream sync with spaja86/IO-OPENUI-AO is ${params.downstreamSyncStatus}.`,
      publicVisible: false,
    },
    {
      token: 'DUKAR',
      position: 9,
      signalRole: 'human-review',
      status: params.humanReviewComplete ? 'READY' : 'REQUIRED',
      signalSource: '/api/extrimli/extrondol#b2bReadiness.compliance.humanReviewComplete',
      summary: params.humanReviewComplete
        ? 'Human-review evidence is complete.'
        : 'Human-review evidence is still required before promotion.',
      publicVisible: false,
    },
    {
      token: 'DONAR',
      position: 10,
      signalRole: 'rollback',
      status: params.rollbackPlanRequired ? 'REQUIRED' : 'READY',
      signalSource: '/api/extrimli/extrondol#releaseAuditSummary.rollbackPlanRequired',
      summary: params.rollbackPlanRequired
        ? 'Rollback control remains a mandatory release requirement.'
        : 'Rollback control is marked ready.',
      publicVisible: false,
    },
    {
      token: 'KODER',
      position: 11,
      signalRole: 'final-public-status',
      status: params.finalPublicStatus,
      signalSource: '/api/extrimli/spaja-kod',
      summary: `Final public-safe SPAJAPRO posture is ${params.finalPublicStatus}.`,
      publicVisible: true,
    },
  ];
  return {
    vocabulary,
    orchestrationLayer: 'EXTRONDOL',
    technicalSignalSource: '/api/extrimli/extrem',
    publicBoundary: 'SPAJA KOD',
    sequenceStates,
    releaseAuditAligned: sequenceStates[6].status === params.releaseAuditStatus,
    downstreamReferenceExplicit: sequenceStates[7].signalSource === 'spaja86/IO-OPENUI-AO',
  };
}

export function buildSpajaproPublicBoundaryStatus(params: {
  publicStatus: 'READY' | 'WATCH' | 'BLOCKED';
}): ExtrimliSpajaproPublicBoundaryStatus {
  return {
    platformName: 'SPAJAPRO',
    platformMode: 'platforma-umesto-chatgpt',
    boundarySurface: 'SPAJA KOD',
    finalPublicStatusToken: 'KODER',
    publicStatus: params.publicStatus,
    internalMappingVisibility: 'HIDDEN',
    summary: params.publicStatus === 'BLOCKED'
      ? 'SPAJA KOD exposes only the final BLOCKED posture for SPAJAPRO while internal token mappings stay hidden.'
      : params.publicStatus === 'WATCH'
        ? 'SPAJA KOD exposes a WATCH posture for SPAJAPRO while internal token mappings stay hidden.'
        : 'SPAJA KOD exposes a READY posture for SPAJAPRO while internal token mappings stay hidden.',
  };
}
