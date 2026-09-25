export const DEVELOPER_CREATE_VRH_MAIN_MANIFEST_DOCUMENT =
  'docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md' as const;

export const DEVELOPER_CREATE_VRH_CANONICAL_NARRATIVE_SENTENCE =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA' as const;

export const DEVELOPER_CREATE_VRH_DIJALIZA_POGONSKOG_OMOTACA_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == DIJALIZA POGONSKOG OMOTAČA' as const;

export const DEVELOPER_CREATE_VRH_ZIVOPIS_U_DIGITALIZMU_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == ŽIVOPIS U DIGITALIZMU' as const;

export const DEVELOPER_CREATE_VRH_MAPA_UMA_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPA UMA' as const;

export const DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES = [
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT MOZGA (MISLILAC)',
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPE UMA',
  DEVELOPER_CREATE_VRH_MAPA_UMA_ALIAS,
  DEVELOPER_CREATE_VRH_ZIVOPIS_U_DIGITALIZMU_ALIAS,
  DEVELOPER_CREATE_VRH_DIJALIZA_POGONSKOG_OMOTACA_ALIAS,
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == SARKAZAM / PRIVREDNA GRANA DIGITALIZMA / PROJEKTI ENTUZIJAZMA PO ČINU OBLASTIMA',
] as const;

export const DEVELOPER_CREATE_VRH_DIJALIZA_POGONSKOG_OMOTACA_ALIAS_BOUNDARY = {
  classification: 'documentation-and-interpretative-alias-only',
  noNewRuntimeModule: true,
  noParallelSourceOfTruth: true,
  ownershipSplit: {
    dokDikFor: 'EXTREM',
    dakDuk: 'EXTRONDOL',
    spajaKod: 'audit-safe-summary-only',
  },
} as const;

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

export const DEVELOPER_CREATE_NAPOLEON_DISKAVERI_CANONICAL_ALIAS =
  'SELEKCIONIRANJE U SELEKCIJAMA PREMA AKTIVNOM NADMAŠAJU / NAPOLEON DISKAVERI' as const;

export const DEVELOPER_CREATE_NAPOLEON_DISKAVERI_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPE UMA == SELEKCIONIRANJE U SELEKCIJAMA PREMA AKTIVNOM NADMAŠAJU / NAPOLEON DISKAVERI' as const;

export const DEVELOPER_CREATE_NAPOLEON_DISKAVERI_BOUNDED_SIGNALS = [
  'selection-in-selection',
  'active-surpass-readiness',
  'bounded-discovery',
  'napoleon-diskaveri',
] as const;

export const DEVELOPER_CREATE_NOTES_1450_CANONICAL_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == NOTES 1450' as const;

export const DEVELOPER_CREATE_NOTES_1450_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == NOTES 1450 == bounded radni-handoff paket za nastavak rada' as const;

export const DEVELOPER_CREATE_NOTES_1450_ROLE_CLASSIFICATION =
  'additive-only-bounded-work-continuation-package' as const;

export const DEVELOPER_CREATE_NOTES_1450_BOUNDED_SIGNALS = [
  'goal-clarity',
  'context-integrity',
  'task-continuity',
  'ai-material-saturation-risk',
  'deterministic-next-step',
] as const;

export const DEVELOPER_CREATE_SARKAZAM_PRIVREDNA_GRANA_DIGITALIZMA_CANONICAL_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == SARKAZAM / PRIVREDNA GRANA DIGITALIZMA / PROJEKTI ENTUZIJAZMA PO ČINU OBLASTIMA' as const;

export const DEVELOPER_CREATE_SARKAZAM_PRIVREDNA_GRANA_DIGITALIZMA_SCOPE_CLASSIFICATION =
  'audit-only-interpretative-enterprise-policy-pedagogical-alias' as const;

export const DEVELOPER_CREATE_SARKAZAM_PRIVREDNA_GRANA_DIGITALIZMA_BOUNDED_SIGNALS = [
  'sarkazam-marker',
  'privredna-grana-digitalizma',
  'projekti-entuzijazma',
  'oblast-cin-summary',
] as const;

export const DEVELOPER_CREATE_SARKAZAM_PRIVREDNA_GRANA_DIGITALIZMA_FALLBACK_INPUTS = [
  'NaN',
  'Infinity',
  'empty',
  'conflict',
] as const;

export const DEVELOPER_CREATE_AUDIO_VISUAL_KONTRABAS_CANONICAL_NAME =
  'DEVELOPER AND CREATE / AUDIO-VIZUELNI KONTRABAS PAKET' as const;

export const DEVELOPER_CREATE_AUDIO_VISUAL_KONTRABAS_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AUDIO-VIZUELNI KONTRABAS PAKET' as const;

export const DEVELOPER_CREATE_AUDIO_VISUAL_BOUNDED_SIGNAL_VOCABULARY = {
  regtonskeProporcije: 'tonal-proportion-and-registration-guidance-only',
  vuferskeKontrabasovnePromene: 'low-end-dynamic-balance-guidance-only',
  tonskiAspektKontrabasa: 'bounded-contrabass-dramaturgy-without-new-dsp-engine',
  ciklusnoNadglasavanjeIPodglasavanje:
    'cyclical-overvoice-undervoice-transition-guidance-only',
} as const;

export const DEVELOPER_CREATE_AUDIO_VISUAL_SCENE_VOCABULARY = [
  {
    token: 'GUN',
    meaning: 'ulazni glasovni kadar',
    role: 'voice-capture-entry',
    mappedTrack: 'SINEMETRIČKO PROGRAMIRANJE',
  },
  {
    token: 'DEN',
    meaning: 'narativni glasovni kadar',
    role: 'voice-narrative-sequence',
    mappedTrack: 'SINEMETRIČKO PROGRAMIRANJE',
  },
  {
    token: 'DIN',
    meaning: 'intonacioni signal',
    role: 'voice-inflection-anchor',
    mappedTrack: 'SINEMETRIČKO PROGRAMIRANJE',
  },
  {
    token: 'KON',
    meaning: 'glasovni kontekst',
    role: 'narrative-context-bridge',
    mappedTrack: 'SINEMETRIČKO PROGRAMIRANJE',
  },
  {
    token: 'SUR',
    meaning: 'scenska površina glasa',
    role: 'voice-surface-layer',
    mappedTrack: 'SINEMETRIČKO PROGRAMIRANJE',
  },
  {
    token: 'DIR',
    meaning: 'direktna reprodukcija',
    role: 'playback-direct-lane',
    mappedTrack: 'OBJEKTNO ORIJENTISANA REPRODUKCIJA',
  },
  {
    token: 'DUR',
    meaning: 'dualna reprodukcija',
    role: 'playback-dual-layer',
    mappedTrack: 'OBJEKTNO ORIJENTISANA REPRODUKCIJA',
  },
  {
    token: 'DOG',
    meaning: 'dogradnja glasa',
    role: 'playback-extension-layer',
    mappedTrack: 'OBJEKTNO ORIJENTISANA REPRODUKCIJA',
  },
  {
    token: 'DUK',
    meaning: 'audio-scene preklop distinct od governance DUK tokena',
    role: 'playback-scene-switch',
    mappedTrack: 'OBJEKTNO ORIJENTISANA REPRODUKCIJA',
  },
  {
    token: 'DOP',
    meaning: 'dopunski montažni prelaz',
    role: 'montage-support-transition',
    mappedTrack: 'PARADIJOGONALNO PROGRAMIRANJE',
  },
  {
    token: 'KIDO',
    meaning: 'kadar i dogadjaj orkestracija',
    role: 'montage-event-orchestration',
    mappedTrack: 'PARADIJOGONALNO PROGRAMIRANJE',
  },
  {
    token: 'DUKAT',
    meaning: 'zaključani montažni takt',
    role: 'montage-lockstep-cadence',
    mappedTrack: 'PARADIJOGONALNO PROGRAMIRANJE',
  },
  {
    token: 'DJUKAS',
    meaning: 'sekvencijalni spoj kadrova',
    role: 'montage-sequence-join',
    mappedTrack: 'PARADIJOGONALNO PROGRAMIRANJE',
  },
  {
    token: 'DIKTON',
    meaning: 'tonska proporcija glasa',
    role: 'tonal-proportion-anchor',
    mappedTrack: 'PROPORCIONALNO PROGRAMIRANJE',
  },
  {
    token: 'GRAFON',
    meaning: 'graf tonskog kretanja',
    role: 'tonal-curve-graph',
    mappedTrack: 'PROPORCIONALNO PROGRAMIRANJE',
  },
  {
    token: 'SIRON',
    meaning: 'širina tonalnog spektra',
    role: 'tonal-spectrum-width',
    mappedTrack: 'PROPORCIONALNO PROGRAMIRANJE',
  },
  {
    token: 'DJOKUZ',
    meaning: 'ciklični ulaz nadglasa',
    role: 'overvoice-cycle-entry',
    mappedTrack: 'METRIČKO PROGRAMIRANJE',
  },
  {
    token: 'OTKUZ',
    meaning: 'ciklični izlaz podglasa',
    role: 'undervoice-cycle-exit',
    mappedTrack: 'METRIČKO PROGRAMIRANJE',
  },
  {
    token: 'DIPAS',
    meaning: 'trajanje prelaza',
    role: 'duration-transition-meter',
    mappedTrack: 'METRIČKO PROGRAMIRANJE',
  },
  {
    token: 'CVIKROT',
    meaning: 'ritmička rotacija ciklusa',
    role: 'cycle-rotation-meter',
    mappedTrack: 'METRIČKO PROGRAMIRANJE',
  },
  {
    token: 'ZIPAN',
    meaning: 'zatvaranje ciklusa',
    role: 'cycle-closeout-meter',
    mappedTrack: 'METRIČKO PROGRAMIRANJE',
  },
] as const;

export const DEVELOPER_CREATE_SARADNJA_READY_SCOPE_LOCK =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA' as const;

export const DEVELOPER_CREATE_SARADNJA_READY_BOUNDED_VOCABULARY = [
  'EXTRIMLI',
  'EXTRONDOL',
  'EXTREM',
  'DOK',
  'DUK',
  'DAK',
  'DIK',
  'FOR',
] as const;

export const DEVELOPER_CREATE_SARADNJA_READY_LAYER_RESPONSIBILITIES = {
  extrem: 'technical-readiness-and-execution-signal-dok-dik-for',
  extrondol: 'governance-review-freeze-promotion-rollback-dak-duk',
  spajaKod: 'public-audit-safe-summary-without-internal-formulas',
  vrh: 'interpretative-orchestration-layer-without-new-runtime-source-of-truth',
} as const;

export const DEVELOPER_CREATE_SARADNJA_READY_SPAJA_BAZA_POLICY = {
  model: 'infinitely-extendable-knowledge-layer',
  ingestionAndIndexingSurface:
    'existing-api-ingest-crawl-index-search-citations-health-metrics',
  requiredGovernance:
    'source-quality-audit-trail-incident-procedure-rollout-rollback',
  requiredStabilityMetrics: ['latency', 'citation-rate', 'failed-jobs'],
} as const;

export const DEVELOPER_CREATE_SARADNJA_READY_GITHUB_VERCEL_OPERATING_MODEL = {
  declaration: 'poklanjam-na-rad-github-i-vercel',
  githubRole: 'code-source-of-truth-workflow-governance-audit-evidence',
  vercelRole: 'controlled-deployment-layer-with-clear-gates',
  secretsBoundary: 'secrets-management-only-no-secrets-in-repository',
} as const;

export const DEVELOPER_CREATE_SARADNJA_READY_QUALITY_GATES = {
  mandatoryHumanReviewBeforePromotion: true,
  statusLanguage: ['READY', 'WATCH', 'BLOCKED'],
  requiresDownstreamReference: true,
  requiresRollbackPlan: true,
  requiresKpiImpactSummary: true,
} as const;

export const DEVELOPER_CREATE_SARADNJA_READY_PACKAGE = {
  packageLock: 'single-manifest-roadmap-phases-acceptance-criteria',
  standardizedAuditSummaryForEachChange: true,
  signature: 'Srdačan pozdrav, Nikola Spajić',
} as const;
