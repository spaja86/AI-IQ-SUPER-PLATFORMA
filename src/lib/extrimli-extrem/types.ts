import type { ExtrimliVersionRoadmap, ExtrimliVersionRoadmapVersionId } from '../extrimli-version-roadmap';
import type { ExtrimliDokerKuratIzekDokarExtremTrack } from '../extrimli-doker-kurat-izek-dokar-track';
import type { ExtrimliSpajaproExtremTrack } from '../extrimli-spajapro-track';
import type { EkvivalentDomain, EkvivalentRelationType } from '../ekvivalent-network/types';
import type { PetljaInput, PetljaReason, PetljaStatus } from '../petlje';
import { EXTRIMLI_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION } from '../extrimli-objektna-prongilacija-contract';
import { EXTRIMLI_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION } from '../extrimli-objektno-orijentisana-reprodukcija-contract';
import { EXTRIMLI_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_CONTRACT_VERSION } from '../extrimli-objektno-orijentusano-uzdizanje-epskih-elikvadenata-contract';

export type ExtrimliExtremConflictIntensity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type ExtrimliExtremOptimizationTier =
  | 'MAXIMUM_GRAPHICS_UNLOCK'
  | 'BALANCED_OPTIMIZATION'
  | 'AGGRESSIVE_OPTIMIZATION'
  | 'EXTREME_PROFILING_REQUIRED';

export type ExtrimliExtremEkodorState = 'ALIGNED' | 'WATCH' | 'BLOCKED';
export type ExtrimliExtremDiscanInKibenState = 'CLEAR' | 'WATCH' | 'BLOCKED';
export type ExtrimliExtremRekulitiPoRauletuPolicy = 'ALLOW' | 'WARN' | 'FREEZE';
export type ExtrimliExtremMobilnaLinijaDeviceType = 'ANDROID' | 'IOS' | 'ROUTER_4G' | 'ROUTER_5G' | 'UNKNOWN';
export type ExtrimliExtremMobilnaLinijaInstallationStatus = 'READY' | 'WATCH' | 'BLOCKED';
export type ExtrimliExtremMobilnaLinijaPackageTier = 'BASIC' | 'SMART' | 'PRO' | 'NONE';
export type ExtrimliExtremObjektnaProngilacijaStatus = 'READY' | 'WATCH' | 'BLOCKED';
export type ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaStatus = 'READY' | 'WATCH' | 'BLOCKED';
export type ExtrimliExtremFunkcionalnoProgramiranjeUzvisenogMisanogTokaStatus = 'READY' | 'WATCH' | 'BLOCKED';
export type ExtrimliExtremFunkcionalnoProgramiranjeEksplicitnogMisaonogTokaStatus = 'READY' | 'WATCH' | 'BLOCKED';
export type ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaStatus = 'READY' | 'WATCH' | 'BLOCKED';
export type ExtrimliExtremProporcionalnoProgramiranjeStatus = 'READY' | 'WATCH' | 'BLOCKED';

export interface ExtrimliExtremObjektnaProngilacijaProfileInput {
  objectStateIntegrityPercent: number;
  methodBehaviorCohesionPercent: number;
  delegationCoveragePercent: number;
  compositionCoveragePercent: number;
  instanceClarityPercent: number;
}

export interface ExtrimliExtremObjektnaProngilacijaDomainObject {
  id: 'objekat-core' | 'instanca-flow' | 'metoda-bridge';
  title: string;
  role: 'objekat' | 'instanca' | 'metoda';
  responsibility: string;
  stateAttributes: readonly string[];
  methods: readonly string[];
  collaborationModel: 'enkapsulacija' | 'delegacija' | 'kompozicija';
}

export interface ExtrimliExtremObjektnaProngilacijaSignal {
  term: 'Objektno orijentisana prongilacija';
  contractVersion: typeof EXTRIMLI_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION;
  additiveOnly: true;
  sourceOfTruth: '/api/extrimli/extrem';
  triggerLabel: 'extrem:logic-change';
  scopeLock: readonly ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'];
  meaningLock: {
    canonicalName: 'Objektno orijentisana prongilacija';
    statement: string;
    existingContractBeforeThisChange: false;
  };
  ownershipModel: {
    extrem: 'technical-object-state-signal';
    extrondol: 'wawe-orchestration-audit-consumer';
    spajaKod: 'public-encapsulated-boundary';
  };
  profileInput: ExtrimliExtremObjektnaProngilacijaProfileInput;
  domainModel: {
    objectRole: string;
    instanceRole: string;
    attributeRole: string;
    methodRole: string;
    delegationRole: string;
    compositionRole: string;
    domainObjects: readonly [
      ExtrimliExtremObjektnaProngilacijaDomainObject,
      ExtrimliExtremObjektnaProngilacijaDomainObject,
      ExtrimliExtremObjektnaProngilacijaDomainObject
    ];
  };
  readiness: {
    score: number;
    status: ExtrimliExtremObjektnaProngilacijaStatus;
    readinessSignal: boolean;
    degraded: boolean;
    watchReasons: string[];
    blockerReasons: string[];
  };
}

export interface ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaProfileInput {
  energeticFlowStabilityPercent: number;
  functionalTransformationCohesionPercent: number;
  thoughtChainDeterminismPercent: number;
  conflictPressurePercent: number;
}

export interface ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaSignal {
  term: 'FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA';
  contractVersion: 'v1-funkcinalno-programiranje-energetskog-misaonog-toka';
  additiveOnly: true;
  sourceOfTruth: '/api/extrimli/extrem';
  triggerLabel: 'extrem:logic-change';
  scopeLock: readonly ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'];
  meaningLock: {
    canonicalName: 'FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA';
    statement: string;
    interpretationLayer: 'technical-signal';
    existingContractBeforeThisChange: false;
    aliasesOfExistingSurfaces: false;
  };
  ownershipModel: {
    extrem: 'technical-functional-energy-signal';
    extrondol: 'wawe-orchestration-audit-consumer';
    spajaKod: 'public-encapsulated-boundary';
  };
  canonicalVocabulary: {
    energeticFlowStability: {
      canonicalField: 'profileInput.energeticFlowStabilityPercent';
      meaning: 'energetska-stabilnost-toka';
    };
    functionalTransformationCohesion: {
      canonicalField: 'profileInput.functionalTransformationCohesionPercent';
      meaning: 'kohezija-funkcionalnih-transformacija';
    };
    thoughtChainDeterminism: {
      canonicalField: 'profileInput.thoughtChainDeterminismPercent';
      meaning: 'deterministicki-misaoni-lanac';
    };
    conflictPressure: {
      canonicalField: 'profileInput.conflictPressurePercent';
      meaning: 'konfliktni-pritisak';
    };
    readinessStatus: {
      canonicalField: 'readiness.status';
      meaning: 'wawe-readiness-posture';
    };
  };
  profileInput: ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaProfileInput;
  processingModel: {
    energeticFlowRole: string;
    transformationRole: string;
    determinismRole: string;
    conflictRole: string;
    publicBoundaryRole: string;
  };
  readiness: {
    score: number;
    status: ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaStatus;
    readyForWaweProgression: boolean;
    degraded: boolean;
    watchReasons: string[];
    blockerReasons: string[];
  };
}

export interface ExtrimliExtremFunkcionalnoProgramiranjeUzvisenogMisanogTokaProfileInput {
  elevatedThoughtFlowStabilityPercent: number;
  functionalTransformationCohesionPercent: number;
  reasoningDeterminismPercent: number;
  conflictDegradationPressurePercent: number;
}

export interface ExtrimliExtremFunkcionalnoProgramiranjeUzvisenogMisanogTokaSignal {
  term: 'FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA';
  contractVersion: typeof EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_CONTRACT_VERSION;
  additiveOnly: true;
  sourceOfTruth: '/api/extrimli/extrem';
  triggerLabel: 'extrem:logic-change';
  scopeLock: readonly ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'];
  meaningLock: {
    canonicalName: 'FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA';
    spellingDecision: 'exact-user-term-locked';
    statement: string;
    interpretationLayer: 'technical-elevated-thought-signal';
    existingContractBeforeThisChange: false;
    aliasesOfExistingSurfaces: false;
  };
  ownershipModel: {
    extrem: 'technical-elevated-thought-signal';
    extrondol: 'wawe-orchestration-audit-consumer';
    spajaKod: 'public-encapsulated-boundary';
  };
  canonicalVocabulary: {
    elevatedThoughtFlowStability: {
      canonicalField: 'profileInput.elevatedThoughtFlowStabilityPercent';
      meaning: 'stabilnost-uzvisenog-misanog-toka';
    };
    functionalTransformationCohesion: {
      canonicalField: 'profileInput.functionalTransformationCohesionPercent';
      meaning: 'kohezija-funkcionalnih-transformacija';
    };
    reasoningDeterminism: {
      canonicalField: 'profileInput.reasoningDeterminismPercent';
      meaning: 'deterministickost-rezonovanja';
    };
    conflictDegradationPressure: {
      canonicalField: 'profileInput.conflictDegradationPressurePercent';
      meaning: 'pritisak-konflikta-i-degradacije';
    };
    readinessStatus: {
      canonicalField: 'readiness.status';
      meaning: 'wawe-readiness-posture';
    };
  };
  profileInput: ExtrimliExtremFunkcionalnoProgramiranjeUzvisenogMisanogTokaProfileInput;
  processingModel: {
    elevatedThoughtFlowRole: string;
    transformationRole: string;
    determinismRole: string;
    conflictRole: string;
    publicBoundaryRole: string;
  };
  readiness: {
    score: number;
    status: ExtrimliExtremFunkcionalnoProgramiranjeUzvisenogMisanogTokaStatus;
    readyForWaweProgression: boolean;
    degraded: boolean;
    watchReasons: string[];
    blockerReasons: string[];
  };
}

export interface ExtrimliExtremFunkcionalnoProgramiranjeEksplicitnogMisaonogTokaProfileInput {
  explicitThoughtFlowTraceabilityPercent: number;
  functionalExplicitTransformationCohesionPercent: number;
  explicitReasoningDeterminismPercent: number;
  vocabularyAlignmentPercent: number;
  conflictPressurePercent: number;
}

export interface ExtrimliExtremFunkcionalnoProgramiranjeEksplicitnogMisaonogTokaSignal {
  term: 'FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA';
  contractVersion: typeof EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_EKSPLICITNOG_MISAONOG_TOKA_CONTRACT_VERSION;
  additiveOnly: true;
  sourceOfTruth: '/api/extrimli/extrem';
  triggerLabel: 'extrem:logic-change';
  scopeLock: readonly ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'];
  meaningLock: {
    canonicalName: 'FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA';
    spellingDecision: 'exact-user-term-locked';
    statement: string;
    interpretationLayer: 'technical-explicit-thought-signal';
    existingContractBeforeThisChange: false;
    aliasesOfExistingSurfaces: false;
  };
  ownershipModel: {
    extrem: 'technical-explicit-thought-signal';
    extrondol: 'wawe-orchestration-audit-consumer';
    spajaKod: 'public-encapsulated-boundary';
  };
  canonicalVocabulary: {
    explicitThoughtFlowTraceability: {
      canonicalField: 'profileInput.explicitThoughtFlowTraceabilityPercent';
      meaning: 'sledljivost-eksplicitnog-misaonog-toka';
    };
    functionalExplicitTransformationCohesion: {
      canonicalField: 'profileInput.functionalExplicitTransformationCohesionPercent';
      meaning: 'kohezija-funkcionalnih-eksplicitnih-transformacija';
    };
    explicitReasoningDeterminism: {
      canonicalField: 'profileInput.explicitReasoningDeterminismPercent';
      meaning: 'deterministickost-eksplicitnog-rezonovanja';
    };
    vocabularyAlignment: {
      canonicalField: 'profileInput.vocabularyAlignmentPercent';
      meaning: 'poravnanje-kanonskog-vokabulara';
    };
    conflictPressure: {
      canonicalField: 'profileInput.conflictPressurePercent';
      meaning: 'konfliktni-pritisak';
    };
    readinessStatus: {
      canonicalField: 'readiness.status';
      meaning: 'wawe-readiness-posture';
    };
  };
  profileInput: ExtrimliExtremFunkcionalnoProgramiranjeEksplicitnogMisaonogTokaProfileInput;
  processingModel: {
    explicitThoughtFlowRole: string;
    transformationRole: string;
    determinismRole: string;
    vocabularyRole: string;
    conflictRole: string;
    publicBoundaryRole: string;
  };
  readiness: {
    score: number;
    status: ExtrimliExtremFunkcionalnoProgramiranjeEksplicitnogMisaonogTokaStatus;
    readyForWaweProgression: boolean;
    degraded: boolean;
    watchReasons: string[];
    blockerReasons: string[];
  };
}

export interface ExtrimliExtremFunkcionalnoProgramiranjePravednogMisaonogTokaProfileInput {
  fairThoughtFlowStabilityPercent: number;
  functionalFairnessCohesionPercent: number;
  fairnessReasoningDeterminismPercent: number;
  evidentiaryCompletenessPercent: number;
  conflictBiasPressurePercent: number;
}

export interface ExtrimliExtremFunkcionalnoProgramiranjePravednogMisaonogTokaSignal {
  term: 'FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA';
  contractVersion: typeof EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_PRAVEDNOG_MISAONOG_TOKA_CONTRACT_VERSION;
  additiveOnly: true;
  sourceOfTruth: '/api/extrimli/extrem';
  triggerLabel: 'extrem:logic-change';
  scopeLock: readonly ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'];
  meaningLock: {
    canonicalName: 'FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA';
    spellingDecision: 'exact-user-term-locked';
    statement: string;
    interpretationLayer: 'technical-fair-thought-signal';
    existingContractBeforeThisChange: false;
    aliasesOfExistingSurfaces: false;
  };
  ownershipModel: {
    extrem: 'technical-fair-thought-signal';
    extrondol: 'wawe-orchestration-audit-consumer';
    spajaKod: 'public-encapsulated-boundary';
  };
  canonicalVocabulary: {
    fairThoughtFlowStability: {
      canonicalField: 'profileInput.fairThoughtFlowStabilityPercent';
      meaning: 'stabilnost-pravednog-misaonog-toka';
    };
    functionalFairnessCohesion: {
      canonicalField: 'profileInput.functionalFairnessCohesionPercent';
      meaning: 'kohezija-funkcionalne-pravednosti';
    };
    fairnessReasoningDeterminism: {
      canonicalField: 'profileInput.fairnessReasoningDeterminismPercent';
      meaning: 'deterministickost-pravednog-rezonovanja';
    };
    evidentiaryCompleteness: {
      canonicalField: 'profileInput.evidentiaryCompletenessPercent';
      meaning: 'evidentiary-completeness';
    };
    conflictBiasPressure: {
      canonicalField: 'profileInput.conflictBiasPressurePercent';
      meaning: 'pritisak-konflikta-i-pristrasnosti';
    };
    readinessStatus: {
      canonicalField: 'readiness.status';
      meaning: 'wawe-readiness-posture';
    };
  };
  profileInput: ExtrimliExtremFunkcionalnoProgramiranjePravednogMisaonogTokaProfileInput;
  processingModel: {
    fairThoughtFlowRole: string;
    fairnessRole: string;
    determinismRole: string;
    evidenceRole: string;
    conflictBiasRole: string;
    publicBoundaryRole: string;
  };
  readiness: {
    score: number;
    status: ExtrimliExtremFunkcionalnoProgramiranjePravednogMisaonogTokaStatus;
    readyForWaweProgression: boolean;
    degraded: boolean;
    watchReasons: string[];
    blockerReasons: string[];
  };
}

export interface ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaProfileInput {
  legalThoughtFlowStabilityPercent: number;
  functionalLegalTransformationCohesionPercent: number;
  legalReasoningDeterminismPercent: number;
  evidentiaryCompletenessPercent: number;
  conflictEscalationPressurePercent: number;
}

export interface ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaSignal {
  term: 'FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA';
  contractVersion: typeof EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_CONTRACT_VERSION;
  additiveOnly: true;
  sourceOfTruth: '/api/extrimli/extrem';
  triggerLabel: 'extrem:logic-change';
  scopeLock: readonly ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'];
  meaningLock: {
    canonicalName: 'FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA';
    spellingDecision: 'exact-user-term-locked';
    statement: string;
    interpretationLayer: 'technical-legal-reasoning-signal';
    existingContractBeforeThisChange: false;
    aliasesOfExistingSurfaces: false;
  };
  ownershipModel: {
    extrem: 'technical-legal-reasoning-signal';
    extrondol: 'wawe-orchestration-audit-consumer';
    spajaKod: 'public-encapsulated-boundary';
  };
  canonicalVocabulary: {
    legalThoughtFlowStability: {
      canonicalField: 'profileInput.legalThoughtFlowStabilityPercent';
      meaning: 'stabilnost-pravnog-misaonog-toka';
    };
    functionalLegalTransformationCohesion: {
      canonicalField: 'profileInput.functionalLegalTransformationCohesionPercent';
      meaning: 'kohezija-funkcionalnih-pravnih-transformacija';
    };
    legalReasoningDeterminism: {
      canonicalField: 'profileInput.legalReasoningDeterminismPercent';
      meaning: 'deterministicko-pravno-zakljucivanje';
    };
    evidentiaryCompleteness: {
      canonicalField: 'profileInput.evidentiaryCompletenessPercent';
      meaning: 'evidentiary-completeness';
    };
    conflictEscalationPressure: {
      canonicalField: 'profileInput.conflictEscalationPressurePercent';
      meaning: 'konfliktno-eskalacioni-pritisak';
    };
    readinessStatus: {
      canonicalField: 'readiness.status';
      meaning: 'wawe-readiness-posture';
    };
  };
  legalCoupling: {
    sourceTrack: 'KRALJEVSKI PRAVNI UNIVERZITET';
    primaryCharter: 'POVELJA O ZAKONODAVNOM PRAVU';
    citizenshipOrder: 'PRAVNI POREDAK PO PRAVU GRAĐANSTVA';
    sourceMaterialPolicy: 'documentation-only';
    ownershipBoundary: 'NIKOLA SPAJIĆ';
    reviewRequirements: {
      humanReviewRequired: true;
      rollbackPlanRequired: true;
      downstreamReferenceRequired: true;
      publicBoundaryRequired: true;
    };
  };
  profileInput: ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaProfileInput;
  processingModel: {
    legalThoughtFlowRole: string;
    transformationRole: string;
    determinismRole: string;
    evidenceRole: string;
    conflictRole: string;
    publicBoundaryRole: string;
  };
  readiness: {
    score: number;
    status: ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaStatus;
    readyForWaweProgression: boolean;
    degraded: boolean;
    watchReasons: string[];
    blockerReasons: string[];
  };
}

export interface ExtrimliExtremProporcionalnoProgramiranjeProfileInput {
  functionalTransformationPercent: number;
  objectEncapsulationCompositionPercent: number;
  proportionalBalancePercent: number;
  conditionalFactReadinessPercent: number;
  protkrovFunkcijaPressurePercent: number;
  objektneParadoksalneEtapePressurePercent: number;
}

export interface ExtrimliExtremProporcionalnoProgramiranjeSignal {
  term: 'PROPORCIONALNO PROGRAMIRANJE';
  contractVersion: typeof EXTRIMLI_EXTREM_PROPORCIONALNO_PROGRAMIRANJE_CONTRACT_VERSION;
  additiveOnly: true;
  sourceOfTruth: '/api/extrimli/extrem';
  triggerLabel: 'extrem:logic-change';
  scopeLock: readonly ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'];
  meaningLock: {
    canonicalName: 'PROPORCIONALNO PROGRAMIRANJE';
    interpretation: 'INOVACIJA PROGRAMSKIH JEZIKA';
    spellingDecision: 'exact-user-term-locked';
    statement: string;
    interpretationLayer: 'technical-language-innovation-signal';
    existingContractBeforeThisChange: false;
    aliasesOfExistingSurfaces: false;
  };
  ownershipModel: {
    extrem: 'technical-paradigm-merge-signal';
    extrondol: 'wawe-orchestration-audit-consumer';
    spajaKod: 'public-encapsulated-boundary';
  };
  canonicalVocabulary: {
    functionalTransformation: {
      canonicalField: 'profileInput.functionalTransformationPercent';
      meaning: 'funkcionalna-transformacija';
    };
    objectEncapsulationComposition: {
      canonicalField: 'profileInput.objectEncapsulationCompositionPercent';
      meaning: 'objektna-enkapsulacija-i-kompozicija';
    };
    proportionalBalance: {
      canonicalField: 'profileInput.proportionalBalancePercent';
      meaning: 'proporcionalni-odnos-funkcija-i-objekata';
    };
    conditionalFacts: {
      canonicalField: 'profileInput.conditionalFactReadinessPercent';
      meaning: 'uslovne-cinjenice';
    };
    protkrovFunkcija: {
      canonicalField: 'subSignals.protkrovFunkcija.pressurePercent';
      meaning: 'funkcijska-dominacija';
    };
    objektneParadoksalneEtape: {
      canonicalField: 'subSignals.objektneParadoksalneEtape.pressurePercent';
      meaning: 'objektna-dominacija';
    };
    readinessStatus: {
      canonicalField: 'readiness.status';
      meaning: 'wawe-readiness-posture';
    };
  };
  profileInput: ExtrimliExtremProporcionalnoProgramiranjeProfileInput;
  sourceSignals: {
    functionalTracks: readonly [
      'FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA',
      'FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA',
      'FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA',
      'FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA',
      'FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA'
    ];
    objectTracks: readonly [
      'Objektno orijentisana prongilacija',
      'Objektno orijentisana reprodukcija',
      'OBJEKTNO ORIJENTUSANO UZDIZANJE EPSKIH ELIKVADENATA'
    ];
    synthesisRule: 'functional-object-proportional-balance';
  };
  processingModel: {
    functionalTransformationRole: string;
    objectStructureRole: string;
    proportionalityRole: string;
    conditionalFactsRole: string;
    publicBoundaryRole: string;
  };
  subSignals: {
    protkrovFunkcija: {
      term: 'PROTKROV FUNKCIJA';
      pressurePercent: number;
      status: ExtrimliExtremProporcionalnoProgramiranjeStatus;
      role: string;
    };
    objektneParadoksalneEtape: {
      term: 'OBJEKTNE PARADOKSALNE ETAPE';
      pressurePercent: number;
      status: ExtrimliExtremProporcionalnoProgramiranjeStatus;
      role: string;
    };
  };
  readiness: {
    score: number;
    status: ExtrimliExtremProporcionalnoProgramiranjeStatus;
    readyForWaweProgression: boolean;
    degraded: boolean;
    watchReasons: string[];
    blockerReasons: string[];
  };
}

export type ExtrimliExtremFunkcionalnoProgramiranjePravednogMisaonogTokaStatus = 'READY' | 'WATCH' | 'BLOCKED';

export type ExtrimliExtremObjektnoOrijentisanaReprodukcijaStatus = 'READY' | 'WATCH' | 'BLOCKED';

export interface ExtrimliExtremObjektnoOrijentisanaReprodukcijaProfileInput {
  objectStateReproducibilityPercent: number;
  methodDeterminismPercent: number;
  instanceReplayConsistencyPercent: number;
  delegationStabilityPercent: number;
  compositionSafetyPercent: number;
}

export interface ExtrimliExtremObjektnoOrijentisanaReprodukcijaCheckpoint {
  id: 'state-snapshot' | 'method-replay' | 'instance-replay' | 'delegation-trace' | 'composition-guard';
  label: string;
  responsibility: string;
  auditSafe: boolean;
}

export interface ExtrimliExtremObjektnoOrijentisanaReprodukcijaSignal {
  term: 'Objektno orijentisana reprodukcija';
  contractVersion: typeof EXTRIMLI_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION;
  additiveOnly: true;
  sourceOfTruth: '/api/extrimli/extrem';
  triggerLabel: 'extrem:logic-change';
  scopeLock: readonly ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'];
  meaningLock: {
    canonicalName: 'Objektno orijentisana reprodukcija';
    statement: string;
    existingContractBeforeThisChange: false;
  };
  ownershipModel: {
    extrem: 'technical-reproduction-signal';
    extrondol: 'wawe-orchestration-audit-consumer';
    spajaKod: 'public-encapsulated-boundary';
  };
  profileInput: ExtrimliExtremObjektnoOrijentisanaReprodukcijaProfileInput;
  reproductionModel: {
    stateRole: string;
    behaviorRole: string;
    replayRole: string;
    delegationRole: string;
    compositionRole: string;
    checkpoints: readonly [
      ExtrimliExtremObjektnoOrijentisanaReprodukcijaCheckpoint,
      ExtrimliExtremObjektnoOrijentisanaReprodukcijaCheckpoint,
      ExtrimliExtremObjektnoOrijentisanaReprodukcijaCheckpoint,
      ExtrimliExtremObjektnoOrijentisanaReprodukcijaCheckpoint,
      ExtrimliExtremObjektnoOrijentisanaReprodukcijaCheckpoint
    ];
  };
  readiness: {
    score: number;
    status: ExtrimliExtremObjektnoOrijentisanaReprodukcijaStatus;
    readyForWaweProgression: boolean;
    degraded: boolean;
    watchReasons: string[];
    blockerReasons: string[];
  };
}

export type ExtrimliExtremEpicElikvadentStatus = 'READY' | 'WATCH' | 'BLOCKED';

export interface ExtrimliExtremEpicElikvadentProfileInput {
  objectElevationIntegrityPercent: number;
  epicEquivalentCoveragePercent: number;
  functionalEquivalenceCohesionPercent: number;
  ascentDelegationPercent: number;
  encapsulationGuardPercent: number;
}

export interface ExtrimliExtremEpicElikvadentEquivalent {
  id: 'epic-objekat-core' | 'epic-instanca-flow' | 'epic-metoda-bridge';
  label: string;
  domain: EkvivalentDomain;
  relationType: EkvivalentRelationType;
  epicState: 'EPIC' | 'WATCH' | 'BLOCKED';
  equivalenceScore: number;
  auditSafe: boolean;
  rationale: string;
}

export interface ExtrimliExtremEpicElikvadentSignal {
  term: 'Objektno orijentusano uzdizanje epskih elikvadenata';
  contractVersion: typeof EXTRIMLI_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_CONTRACT_VERSION;
  additiveOnly: true;
  sourceOfTruth: '/api/extrimli/extrem';
  triggerLabel: 'extrem:logic-change';
  scopeLock: readonly ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'];
  meaningLock: {
    canonicalName: 'Objektno orijentusano uzdizanje epskih elikvadenata';
    statement: string;
    interpretationLayer: 'technical-signal';
    existingContractBeforeThisChange: false;
  };
  ownershipModel: {
    extrem: 'technical-epic-equivalent-signal';
    extrondol: 'wawe-orchestration-audit-consumer';
    spajaKod: 'public-encapsulated-boundary';
  };
  profileInput: ExtrimliExtremEpicElikvadentProfileInput;
  controlledEquivalents: {
    sourceDomain: 'EKVIVALENT NETWORK';
    supportedDomains: readonly ['MODULE', 'KNOWLEDGE', 'PERSONA'];
    epicRelationTypes: readonly ['FULL', 'FUNCTIONAL', 'SUBSTITUTABLE'];
    watchRelationTypes: readonly ['PARTIAL', 'CONTEXTUAL'];
    entities: readonly [
      ExtrimliExtremEpicElikvadentEquivalent,
      ExtrimliExtremEpicElikvadentEquivalent,
      ExtrimliExtremEpicElikvadentEquivalent
    ];
  };
  readiness: {
    score: number;
    status: ExtrimliExtremEpicElikvadentStatus;
    readyForWaweProgression: boolean;
    degraded: boolean;
    watchReasons: string[];
    blockerReasons: string[];
  };
}

export interface ExtrimliExtremProfileInput {
  sceneLoadPercent: number;
  gpuContentionPercent: number;
  cpuContentionPercent: number;
  renderCycleLatencyMs: number;
}

export interface ExtrimliExtremResolutionInput {
  rezolucijaCompletenessPercent: number;
  ekodorAlignmentPercent: number;
  discanPressurePercent: number;
}

export interface ExtrimliExtremMobilnaLinijaInput {
  lineType: 'Mobilna linija';
  deviceType: ExtrimliExtremMobilnaLinijaDeviceType;
  deviceModel: string;
  supportsEsim: boolean;
  osVersionMajor: number;
  signalStrengthPercent: number;
}

export interface ExtrimliExtremSemaFormulaInput {
  sema: number;
  allSema: number;
  expectedMuSema: number;
}

export type ExtrimliExtremSemaFormulaStatus = 'PASSED' | 'BLOCKED';
export type ExtrimliSpajaKodPublicStatus = 'READY' | 'WATCH' | 'BLOCKED';
export type ExtrimliExtremPetljaSignalName =
  | 'DJUPRE PETLJA'
  | 'DOMPRE PETLJA'
  | 'KRUMPE PETLJA'
  | 'DOMBRE PETLJA'
  | 'OMBA PETLJA'
  | 'DOKSI PETLJA'
  | 'DOMBRA PETLJA'
  | 'DOKON PETLJA'
  | 'DUMPIR PETLJA'
  | 'DOMBAR PETLJA'
  | 'ZUMBA PETLJA'
  | 'DONKI PETLJA'
  | 'DOMPOR PETLJA'
  | 'DOK PETLJA'
  | 'DIK PETLJA'
  | 'SAR PETLJA'
  | 'OKRED PETLJA'
  | 'DIREKT PETLJA'
  | 'INDIREKT PETLJA';
export type ExtrimliExtremPetljaSignalCategory = 'RANGE' | 'TARGET' | 'SEQUENCE';
export type ExtrimliExtremPetljaSignalStatus = 'READY' | 'WATCH' | 'BLOCKED';

export interface ExtrimliExtremPetljaSignalInput {
  kind: ExtrimliExtremPetljaSignalName;
  category: ExtrimliExtremPetljaSignalCategory;
  input: Pick<PetljaInput, 'start' | 'end' | 'step' | 'target' | 'sequence' | 'maxIterations' | 'maxDurationMs' | 'status'>;
}

export interface ExtrimliExtremPetljaSignalResult {
  kind: ExtrimliExtremPetljaSignalName;
  category: ExtrimliExtremPetljaSignalCategory;
  runner: 'canonical-petlja';
  preservedStandaloneDirektModule: boolean;
  input: ExtrimliExtremPetljaSignalInput['input'];
  petljaStatus: PetljaStatus;
  reason: PetljaReason;
  output: number;
  iterations: number;
  completed: boolean;
  readinessScore: number;
  conflictScore: number;
  status: ExtrimliExtremPetljaSignalStatus;
  degraded: boolean;
  warnings: string[];
}

export interface ExtrimliExtremPetljaSignalSection {
  term: 'EXTRIMLI EXTRONDOL EXTREM PETLJE';
  sourceOfTruth: '/api/extrimli/extrem';
  triggerLabel: 'petlje:logic-change';
  additiveOnly: true;
  ownershipModel: {
    extrem: 'technical-petlja-signal-layer';
    extrondol: 'wawe-orchestration-audit-consumer';
    direktModule: 'standalone-direct-communication-module-preserved';
  };
  contractBoundary: {
    existingSourceOfTruthRoutes: readonly ['/api/extrimli/extrem', '/api/extrimli/extrondol'];
    standaloneDirektModulePreserved: true;
    direktPetljaMode: 'separate-loop-contract';
    indirektPetljaMode: 'separate-loop-contract';
  };
  categoryMap: {
    RANGE: readonly ExtrimliExtremPetljaSignalName[];
    TARGET: readonly ExtrimliExtremPetljaSignalName[];
    SEQUENCE: readonly ExtrimliExtremPetljaSignalName[];
  };
  signals: ExtrimliExtremPetljaSignalResult[];
  summary: {
    readinessScore: number;
    conflictScore: number;
    freezeRequired: boolean;
    blockedSignals: ExtrimliExtremPetljaSignalName[];
    watchSignals: ExtrimliExtremPetljaSignalName[];
    degradedSignals: ExtrimliExtremPetljaSignalName[];
  };
}

export interface ExtrimliExtremSemaFormulaEvaluation {
  canonicalExpression: 'ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA';
  scopeLock: readonly ['EXTRIMLI', 'EXTRONDOL', 'EXTREM'];
  inputs: ExtrimliExtremSemaFormulaInput;
  computedMuSema: number;
  formulaHolds: boolean;
  status: ExtrimliExtremSemaFormulaStatus;
  deterministic: boolean;
  inputSubstitutions: string[];
  blockerReasons: string[];
  muSemaConclusion: 'MUŠEMA_CONFIRMED' | 'MUŠEMA_BLOCKED';
}

export interface ExtrimliExtremSpajaKodEncapsulation {
  surfaceName: 'SPAJA KOD';
  contractVersion: 'v1-spaja-kod';
  representationMode: 'system-encapsulation';
  encapsulationStatus: 'ACTIVE';
  rawPatternVisibility: 'HIDDEN';
  exposurePolicy: {
    exposesRawPatternModel: false;
    exposesFormulaInternals: false;
    exposesInternalSignalInputs: false;
    exposesOnlySystemSignals: true;
  };
  publicInterpretation: string;
  readiness: {
    status: ExtrimliSpajaKodPublicStatus;
    governanceOutcome: ExtrimliExtremRekulitiPoRauletuPolicy;
    blockerCount: number;
  };
  publicSignals: readonly [
    'readiness-status',
    'governance-outcome',
    'promotion-freeze',
    'audit-blockers'
  ];
  blockers: string[];
}

export interface ExtrimliExtremAcceptanceCriterion {
  id: string;
  description: string;
  passed: boolean;
}

export interface ExtrimliExtremBusinessLicensingSignals {
  sourceOfTruth: '/api/aiiq-world-bank-licencni-registar';
  activityCoverageScore: number;
  globalLicenseReadinessScore: number;
  criticalGlobalGapCount: number;
  freezeRequired: boolean;
  freezeReasons: string[];
}

export type ExtrimliExtremKraljevskiPravniTrackTerm =
  | 'KRALJEVSKI PRAVNI UNIVERZITET'
  | 'KRALJEVSKA POLITIKA'
  | 'NIKOLA SPAJIĆ'
  | 'ZAKON SILNOG'
  | 'POVELJA O ZAKONODAVNOM PRAVU'
  | 'PRAVNI POREDAK PO PRAVU GRAĐANSTVA';

export type ExtrimliExtremKraljevskiPravniTrackStatus = 'READY' | 'WATCH' | 'BLOCKED';

export interface ExtrimliExtremKraljevskiPravniTrackRelationship {
  to: ExtrimliExtremKraljevskiPravniTrackTerm;
  relation:
    | 'defines-authority'
    | 'governs-policy'
    | 'names-custodian'
    | 'codifies-legislative-right'
    | 'anchored-to-charter'
    | 'constrains-citizenship-order'
    | 'reviewed-under-policy'
    | 'permits-reviewed-enforcement';
}

export interface ExtrimliExtremKraljevskiPravniTrackVocabularyEntry {
  term: ExtrimliExtremKraljevskiPravniTrackTerm;
  meaning: string;
  scope: string;
  owner: string;
  allowedRelationships: readonly ExtrimliExtremKraljevskiPravniTrackRelationship[];
}

export interface ExtrimliExtremKraljevskiPravniTrack {
  trackId: 'extrimli-kraljevski-pravni-univerzitet';
  contractVersion: 'v1-kraljevski-pravni-univerzitet';
  additiveOnly: true;
  classification: 'legal-governance-track';
  technicalSourceOfTruth: '/api/extrimli/extrem';
  governanceSourceOfTruth: '/api/extrimli/extrondol';
  publicBoundary: '/api/extrimli/spaja-kod';
  vocabulary: readonly [
    ExtrimliExtremKraljevskiPravniTrackVocabularyEntry,
    ExtrimliExtremKraljevskiPravniTrackVocabularyEntry,
    ExtrimliExtremKraljevskiPravniTrackVocabularyEntry,
    ExtrimliExtremKraljevskiPravniTrackVocabularyEntry,
    ExtrimliExtremKraljevskiPravniTrackVocabularyEntry,
    ExtrimliExtremKraljevskiPravniTrackVocabularyEntry
  ];
  documentationBoundary: {
    sourceMaterialPolicy: 'documentation-only';
    sourceReferences: readonly [{
      label: string;
      usage: 'repo-doc-reference';
    }];
    completedTopics: readonly [
      'KRALJEVSKI PRAVNI UNIVERZITET',
      'KRALJEVSKA POLITIKA',
      'NIKOLA SPAJIĆ',
      'ZAKON SILNOG',
      'PRAVNI POREDAK PO PRAVU GRAĐANSTVA'
    ];
    primaryContentGap: {
      topic: 'POVELJA O ZAKONODAVNOM PRAVU';
      status: 'DEFINED' | 'COMPLETED';
      summary: string;
    };
  };
  structuredSignals: {
    charterCompleteness: {
      requiredSections: readonly ['authority', 'ratification', 'publication', 'review', 'citizenship-boundary', 'enforcement-limit'];
      completedSections: readonly ['authority', 'ratification', 'publication', 'review', 'citizenship-boundary', 'enforcement-limit'];
      completenessScore: number;
      status: ExtrimliExtremKraljevskiPravniTrackStatus;
    };
    legislativeAuthorityDefinition: {
      authorityHolder: 'KRALJEVSKI PRAVNI UNIVERZITET';
      policyBridge: 'KRALJEVSKA POLITIKA';
      namedCustodian: 'NIKOLA SPAJIĆ';
      legislativeCharter: 'POVELJA O ZAKONODAVNOM PRAVU';
      enforcementDoctrine: 'ZAKON SILNOG';
      status: ExtrimliExtremKraljevskiPravniTrackStatus;
    };
    citizenshipOrderPrinciples: {
      canonicalOrder: 'PRAVNI POREDAK PO PRAVU GRAĐANSTVA';
      principles: readonly string[];
      lawfulParticipation: readonly string[];
      unlawfulParticipation: readonly string[];
      status: ExtrimliExtremKraljevskiPravniTrackStatus;
    };
    conflictEscalation: {
      warningTriggers: readonly string[];
      blockTriggers: readonly string[];
      evidenceRequiredBeforeEscalation: readonly string[];
      activeWarnings: readonly string[];
      activeBlocks: readonly string[];
      status: ExtrimliExtremKraljevskiPravniTrackStatus;
    };
    reviewRequirements: {
      humanReviewRequired: true;
      rollbackPlanRequired: true;
      downstreamReferenceRequired: true;
      publicBoundaryRequired: true;
      status: ExtrimliExtremKraljevskiPravniTrackStatus;
    };
    blockedActionsAgainstDeclaredOrder: {
      actions: readonly string[];
      enforcementMode: 'neutral-governance-boundary';
      status: ExtrimliExtremKraljevskiPravniTrackStatus;
    };
  };
  neutralRuleSet: {
    unacceptableConduct: readonly string[];
    warningTriggers: readonly string[];
    blockTriggers: readonly string[];
    evidenceRequiredBeforeEscalation: readonly string[];
    lawfulCivicManeuvers: readonly string[];
    unlawfulCivicManeuvers: readonly string[];
  };
  readiness: {
    completenessScore: number;
    consistencyScore: number;
    conflictScore: number;
    status: ExtrimliExtremKraljevskiPravniTrackStatus;
    watchReasons: string[];
    blockerReasons: string[];
  };
}

export interface ExtrimliExtremProfilerReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  sourceOfTruth: string;
  statement: string;
  ownership: string;
  triggerLabel: string;
  pathScope: string[];
  terminology: {
    diskvitRole: 'browser-graphics-bottleneck-layer';
    conflictModel: 'conflict-proportional';
    conflictInputs: readonly ['sceneLoadPercent', 'gpuContentionPercent', 'cpuContentionPercent', 'renderCycleLatencyMs'];
    normalizedVocabulary: {
      REZOLUCIJA: {
        canonicalField: 'resolutionReadiness.rezolucijaScore';
        meaning: 'resolution-readiness-dimension';
      };
      EKODOR: {
        canonicalField: 'resolutionReadiness.ekodorState';
        meaning: 'readiness-alignment-signal';
      };
      'REKULITI PO RAULETU': {
        canonicalField: 'resolutionReadiness.rekulitiPoRauletu';
        meaning: 'resolution-routing-policy';
      };
      DISCAN: {
        canonicalField: 'resolutionInput.discanPressurePercent';
        meaning: 'blocking-pressure-input';
      };
      KIBEN: {
        canonicalField: 'resolutionReadiness.kibenLane';
        meaning: 'governance-lane';
      };
    };
  };
  profileInput: ExtrimliExtremProfileInput;
  resolutionInput: ExtrimliExtremResolutionInput;
  mobilnaLinija: {
    contractVersion: 'v1-mobilna-linija-installation';
    input: ExtrimliExtremMobilnaLinijaInput;
    deviceCompatibility: {
      deviceTypeProvided: boolean;
      compatible: boolean;
      status: ExtrimliExtremMobilnaLinijaInstallationStatus;
      reasons: string[];
    };
    installationMessages: {
      required: true;
      status: ExtrimliExtremMobilnaLinijaInstallationStatus;
      messages: string[];
      missingFields: string[];
    };
    packagePlanHint: {
      recommendedPlanTier: ExtrimliExtremMobilnaLinijaPackageTier;
      readiness: ExtrimliExtremMobilnaLinijaInstallationStatus;
      reason: string;
    };
  };
  profile: {
    bottleneckDetected: boolean;
    bottleneckLayer: 'DISKVIT';
    conflictScore: number;
    conflictIntensity: ExtrimliExtremConflictIntensity;
    optimizationTier: ExtrimliExtremOptimizationTier;
  };
  businessLicensingSignals: ExtrimliExtremBusinessLicensingSignals;
  kraljevskiPravniUniverzitetTrack: ExtrimliExtremKraljevskiPravniTrack;
  semaMuSemaFormula: ExtrimliExtremSemaFormulaEvaluation;
  spajaKodEncapsulation: ExtrimliExtremSpajaKodEncapsulation;
  petljeSignals: ExtrimliExtremPetljaSignalSection;
  objektnoOrijentisanaProngilacija: ExtrimliExtremObjektnaProngilacijaSignal;
  funkcinalnoProgramiranjeEnergetskogMisaonogToka: ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaSignal;
  funkcionalnoProgramiranjeUzvisenogMisanogToka: ExtrimliExtremFunkcionalnoProgramiranjeUzvisenogMisanogTokaSignal;
  funkcionalnoProgramiranjeEksplicitnogMisaonogToka: ExtrimliExtremFunkcionalnoProgramiranjeEksplicitnogMisaonogTokaSignal;
  funkcionalnoProgramiranjePravednogMisaonogToka: ExtrimliExtremFunkcionalnoProgramiranjePravednogMisaonogTokaSignal;
  funkionalnoProgramiranjePravnogMisaonogToka: ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaSignal;
  proporcionalnoProgramiranje: ExtrimliExtremProporcionalnoProgramiranjeSignal;
  objektnoOrijentisanaReprodukcija: ExtrimliExtremObjektnoOrijentisanaReprodukcijaSignal;
  objektnoOrijentusanoUzdizanjeEpskihElikvadenata: ExtrimliExtremEpicElikvadentSignal;
  resolutionReadiness: {
    rezolucijaScore: number;
    ekodorState: ExtrimliExtremEkodorState;
    rekulitiPoRauletu: ExtrimliExtremRekulitiPoRauletuPolicy;
    discanInKibenState: ExtrimliExtremDiscanInKibenState;
    kibenLane: 'KIBEN';
    readinessSignal: boolean;
    blockerActive: boolean;
  };
  optimization: {
    maximumGraphicsUnlockThreshold: {
      maxConflictScore: number;
      maxRenderCycleLatencyMs: number;
      maxGpuContentionPercent: number;
    };
    maximumGraphicsUnlockEligible: boolean;
  };
  governanceSignal: {
    freezeRequired: boolean;
    wawePromotionEligible: boolean;
    reasons: string[];
  };
  dokerKuratIzekDokarTrack: ExtrimliDokerKuratIzekDokarExtremTrack;
  spajaproTrack: ExtrimliSpajaproExtremTrack;
  roadmapAlignment: {
    sourceProgram: string;
    primaryVersion: ExtrimliVersionRoadmapVersionId;
    predecessorVersions: readonly ExtrimliVersionRoadmapVersionId[];
    unlocksVersions: readonly ExtrimliVersionRoadmapVersionId[];
    mandatoryGate: true;
  };
  versionRoadmap: ExtrimliVersionRoadmap;
  kpiTargets: {
    evaluationMaxMs: number;
    apiResponseMaxMs: number;
  };
  kpiObserved: {
    evaluationMs: number;
    apiResponseMs: number;
    withinTargets: boolean;
  };
  degraded: boolean;
  degradedMode: 'partial-payload-no-500';
  degradedSources: string[];
  acceptanceCriteria: ExtrimliExtremAcceptanceCriterion[];
  integrationBoundaries: {
    aliasesOfExistingSurfaces: false;
  };
}

export const EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION = 'v1-extrem-profiler';
export const EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION = '1.0.0';
export const EXTRIMLI_EXTREM_PROFILER_PERSONA_ID = 'extrimli-extrem-profiler-core';
export const EXTRIMLI_EXTREM_PROFILER_SOURCE_OF_TRUTH = '/api/extrimli/extrem';
export const EXTRIMLI_EXTREM_PROFILER_EVALUATION_MAX_MS = 50;
export const EXTRIMLI_EXTREM_PROFILER_API_MAX_MS = 200;
export const EXTRIMLI_EXTREM_PROFILER_MAX_CONFLICT_FOR_UNLOCK = 35;
export const EXTRIMLI_EXTREM_PROFILER_MAX_LATENCY_FOR_UNLOCK = 45;
export const EXTRIMLI_EXTREM_PROFILER_MAX_GPU_CONTENTION_FOR_UNLOCK = 40;
export const EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY = 70;
export const EXTRIMLI_EXTREM_EKODOR_MIN_FOR_ALIGNED = 65;
export const EXTRIMLI_EXTREM_EKODOR_MIN_FOR_WATCH = 45;
export const EXTRIMLI_EXTREM_DISCAN_MAX_FOR_CLEAR = 35;
export const EXTRIMLI_EXTREM_DISCAN_MAX_FOR_WATCH = 60;
export const EXTRIMLI_EXTREM_PETLJE_SIGNAL_TRIGGER_LABEL = 'petlje:logic-change';
export const EXTRIMLI_EXTREM_PETLJE_READY_MIN_SCORE = 75;
export const EXTRIMLI_EXTREM_PETLJE_WATCH_MIN_SCORE = 50;
export const EXTRIMLI_EXTREM_MOBILNA_LINIJA_INSTALLATION_CONTRACT_VERSION = 'v1-mobilna-linija-installation';
export const EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_READY = 55;
export const EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_WATCH = 35;
export const EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_ANDROID_MAJOR = 10;
export const EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_IOS_MAJOR = 15;
export const EXTRIMLI_EXTREM_SHEMA_MUSHEMA_CANONICAL_EXPRESSION = 'ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA';
export const EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION = EXTRIMLI_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION;
export const EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_READY_SCORE = 75;
export const EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_WATCH_SCORE = 55;
export const EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_CONTRACT_VERSION = 'v1-funkcinalno-programiranje-energetskog-misaonog-toka';
export const EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_MIN_READY_SCORE = 78;
export const EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_MIN_WATCH_SCORE = 60;
export const EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_CONTRACT_VERSION = 'v1-funkcionalno-programiranje-uzvisenog-misanog-toka';
export const EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_MIN_READY_SCORE = 79;
export const EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_MIN_WATCH_SCORE = 61;
export const EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_EKSPLICITNOG_MISAONOG_TOKA_CONTRACT_VERSION = 'v1-funkcionalno-programiranje-eksplicitnog-misaonog-toka';
export const EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_EKSPLICITNOG_MISAONOG_TOKA_MIN_READY_SCORE = 80;
export const EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_EKSPLICITNOG_MISAONOG_TOKA_MIN_WATCH_SCORE = 62;
export const EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_PRAVEDNOG_MISAONOG_TOKA_CONTRACT_VERSION = 'v1-funkcionalno-programiranje-pravednog-misaonog-toka';
export const EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_PRAVEDNOG_MISAONOG_TOKA_MIN_READY_SCORE = 81;
export const EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_PRAVEDNOG_MISAONOG_TOKA_MIN_WATCH_SCORE = 63;
export const EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_CONTRACT_VERSION = 'v1-funkionalno-programiranje-pravnog-misaonog-toka';
export const EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_MIN_READY_SCORE = 80;
export const EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_MIN_WATCH_SCORE = 62;
export const EXTRIMLI_EXTREM_PROPORCIONALNO_PROGRAMIRANJE_CONTRACT_VERSION = 'v1-proporcionalno-programiranje';
export const EXTRIMLI_EXTREM_PROPORCIONALNO_PROGRAMIRANJE_MIN_READY_SCORE = 80;
export const EXTRIMLI_EXTREM_PROPORCIONALNO_PROGRAMIRANJE_MIN_WATCH_SCORE = 62;
export const EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION = EXTRIMLI_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION;
export const EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_MIN_READY_SCORE = 78;
export const EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_MIN_WATCH_SCORE = 60;
export const EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_CONTRACT_VERSION = EXTRIMLI_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_CONTRACT_VERSION;
export const EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_MIN_READY_SCORE = 76;
export const EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_MIN_WATCH_SCORE = 58;
