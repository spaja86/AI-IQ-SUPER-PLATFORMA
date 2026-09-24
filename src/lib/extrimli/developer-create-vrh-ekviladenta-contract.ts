export const DEVELOPER_CREATE_VRH_MAIN_MANIFEST_DOCUMENT =
  'docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md' as const;

export const DEVELOPER_CREATE_VRH_CANONICAL_NARRATIVE_SENTENCE =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA' as const;

export const DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES = [
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT MOZGA (MISLILAC)',
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPE UMA',
] as const;

export const DEVELOPER_CREATE_VRH_FOUR_PERMANENT_LAYERS = {
  developerCreateVrh: {
    canonicalName: 'DEVELOPER AND CREATE / VRH',
    role: 'apex-orchestration-meaning-only',
  },
  extrem: {
    canonicalName: 'EXTREM',
    role: 'technical-signal',
  },
  extrondol: {
    canonicalName: 'EXTRONDOL',
    role: 'governance-WAWE-audit-freeze-promotion',
  },
  spajaKod: {
    canonicalName: 'SPAJA KOD',
    role: 'audit-safe-public-summary',
  },
} as const;

export const DEVELOPER_CREATE_VRH_CANONICAL_TOKEN_VOCABULARY = {
  dok: 'technical-readiness-proof',
  dik: 'technical-consistency-proof',
  dak: 'governance-promotion-decision',
  duk: 'human-review-and-rollback-governance',
  for: 'technical-execution-loop',
} as const;

export const DEVELOPER_CREATE_VRH_NARRATIVE_CONTRACT_BOUNDARY = {
  narrativeRole: 'interpretative-apex-layer',
  contractRole:
    'readiness-blocker-human-review-rollout-rollback-downstream-reference',
  noNewRuntimeModule: true,
  noParallelSourceOfTruth: true,
} as const;

export const DEVELOPER_CREATE_VRH_VISUAL_EVIDENCE_POLICY = {
  role: 'audit-and-documentation-evidence-only',
  confirmsExistingContract: true,
  introducesNewLogic: false,
  introducesNewSemantics: false,
  introducesNewSourceOfTruth: false,
} as const;

export const DEVELOPER_CREATE_VRH_DOWNSTREAM_SUMMARY_POLICY = {
  linkedRepo: 'spaja86/IO-OPENUI-AO',
  syncMode: 'summary-only',
  repoLocalNarrativeRemainsRich: true,
  rawNarrativeStaysRepoLocal: true,
} as const;

export const DEVELOPER_CREATE_VRH_SUCCESSFUL_NARRATIVE_CRITERIA = {
  requiresSharedStoryAcross: ['docs', 'types', 'routes', 'tests', 'workflows'],
  stableWithoutPerFileRetelling: true,
  failureMode:
    'narrative-not-stabilized-if-each-file-needs-a-new-explanation',
} as const;
