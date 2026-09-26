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

export const DEVELOPER_CREATE_VRH_NAVIGACIONI_SISTEM_SA_TREKEROM_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == NAVIGACIONI SISTEM SA TREKEROM' as const;

export const DEVELOPER_CREATE_VRH_KRALJEVSKI_SAT_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KRALJEVSKI SAT' as const;

export const DEVELOPER_CREATE_VRH_KRALJEVSKI_RAD_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KRALJEVSKI RAD' as const;

export const DEVELOPER_CREATE_VRH_IZVESTAJ_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == IZVEŠTAJ' as const;

export const DEVELOPER_CREATE_VRH_VINOGRADI_GROCKA_RESTORAN_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == VINOGRADI GROCKA, RESTORAN' as const;

export const DEVELOPER_CREATE_VRH_POSLOVNA_PONUDA_ZELEZARA_DOO_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == POSLOVNA PONUDA / ŽELEZARA D.O.O. SMEDEREVO' as const;

export const DEVELOPER_CREATE_VRH_IZVESTAJ_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == IZVEŠTAJ' as const;

export const DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES = [
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT MOZGA (MISLILAC)',
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPE UMA',
  DEVELOPER_CREATE_VRH_MAPA_UMA_ALIAS,
  DEVELOPER_CREATE_VRH_ZIVOPIS_U_DIGITALIZMU_ALIAS,
  DEVELOPER_CREATE_VRH_DIJALIZA_POGONSKOG_OMOTACA_ALIAS,
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == LEKSIKON',
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI PROSTOR',
  DEVELOPER_CREATE_VRH_NAVIGACIONI_SISTEM_SA_TREKEROM_ALIAS,
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == SARKAZAM / PRIVREDNA GRANA DIGITALIZMA / PROJEKTI ENTUZIJAZMA PO ČINU OBLASTIMA',
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AI IQ KONFERENCIJA ZA ŠTAMPU (NOVINE, DIGITALNE NOVINE)',
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADIO',
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MUZIČKA KUTIJA',
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AI IQ LABORATORIJA == LABORATORIJSKI NALAZI FAUNE I FLORE I GRAĐEVINSKOG MATERIJALA',
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == POSLOVNA PONUDA',
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == POSLOVNA PONUDA / PRETPLATA',
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KRALJEVSKI POKLONI ZA SVAČIJI ROĐENDAN',
  DEVELOPER_CREATE_VRH_KRALJEVSKI_SAT_ALIAS,
  DEVELOPER_CREATE_VRH_KRALJEVSKI_RAD_ALIAS,
  DEVELOPER_CREATE_VRH_IZVESTAJ_ALIAS,
  DEVELOPER_CREATE_VRH_VINOGRADI_GROCKA_RESTORAN_ALIAS,
  DEVELOPER_CREATE_VRH_POSLOVNA_PONUDA_ZELEZARA_DOO_ALIAS,
  DEVELOPER_CREATE_VRH_IZVESTAJ_ALIAS,
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

export const DEVELOPER_CREATE_IZVESTAJ_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == IZVEŠTAJ == additive-only bounded branch report / audit snapshot alias nad postojećim EXTRONDOL formatom, bez novih runtime ruta i bez paralelnog source-of-truth sistema' as const;

export const DEVELOPER_CREATE_IZVESTAJ_MEASURED_BRANCH_LAYERS = [
  'docs',
  'types',
  'routes',
  'tests',
  'workflows',
] as const;

export const DEVELOPER_CREATE_IZVESTAJ_PLATFORM_TRACKS = [
  'technical-track',
  'governance-track',
  'public-boundary-track',
  'business-track',
] as const;

export const DEVELOPER_CREATE_IZVESTAJ_REPORTING_LAYERS = [
  'EXTREM',
  'EXTRONDOL',
  'SPAJA KOD',
] as const;

export const DEVELOPER_CREATE_IZVESTAJ_REPORT_LOCK = {
  canonicalAlias: DEVELOPER_CREATE_VRH_IZVESTAJ_ALIAS,
  sourceOfTruth: '/api/extrimli/extrondol',
  canonicalFormat: 'developer-create-branch-report-v1',
  roadmapStageId: 'v5-extrondol-release-audit-and-orchestration',
  reportKind: 'additive-only-branch-report-audit-snapshot',
  noNewRuntimeRoutes: true,
  noParallelSourceOfTruth: true,
  measuredBranchLayers: DEVELOPER_CREATE_IZVESTAJ_MEASURED_BRANCH_LAYERS,
  platformTracks: DEVELOPER_CREATE_IZVESTAJ_PLATFORM_TRACKS,
  reportingLayers: DEVELOPER_CREATE_IZVESTAJ_REPORTING_LAYERS,
  requiredAuditBlocks: [
    'completed',
    'partial',
    'blocked',
    'branchCompletionPercent',
    'platformCompletionPercent',
    'promotionReadinessStatus',
    'nextStep',
    'rolloutPlan',
    'rollbackPlan',
    'humanReviewStatus',
    'downstreamReference',
    'measurableOutput',
    'acceptanceEvidence',
  ],
  ownershipSplit: {
    dokDikFor: 'EXTREM',
    dakDuk: 'EXTRONDOL',
    spajaKod: 'audit-safe-summary-only',
  },
  downstreamReference: 'docs/MULTI-REPO-LINKS.md -> spaja86/IO-OPENUI-AO (summary-only)',
} as const;

export const DEVELOPER_CREATE_CANONICAL_SCOPE_LOCK = {
  canonicalExpression: DEVELOPER_CREATE_VRH_CANONICAL_NARRATIVE_SENTENCE,
  boundedVocabulary: ['EXTRIMLI', 'EXTRONDOL', 'EXTREM', 'DOK', 'DUK', 'DAK', 'DIK', 'FOR'],
  noNewRuntimeRoutes: true,
  noParallelSourceOfTruth: true,
  ownershipSplit: {
    dokDikFor: 'EXTREM',
    dakDuk: 'EXTRONDOL',
    spajaKod: 'audit-safe-summary-only',
  },
} as const;

export type DeveloperCreateSurfaceStatus = 'READY' | 'WATCH' | 'BLOCKED';

export const resolveDeveloperCreateSurfaceStatus = ({
  promotionFreeze,
  degraded,
}: {
  promotionFreeze: boolean;
  degraded: boolean;
}): DeveloperCreateSurfaceStatus => (promotionFreeze ? 'BLOCKED' : degraded ? 'WATCH' : 'READY');

export const normalizeDeveloperCreateSurfaceStatus = (status: string): DeveloperCreateSurfaceStatus => (
  status === 'BLOCKED' || status === 'WATCH' ? status : 'READY'
);

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

export const DEVELOPER_CREATE_V700_ROADMAP_STAGE_ID =
  'v700-apdejt-na-verziju-700' as const;

export const DEVELOPER_CREATE_GAP_REGISTRY_ROADMAP_STAGE_IDS = {
  docs: 'v5-extrondol-release-audit-and-orchestration',
  types: 'v4-extrem-governance-hardening',
  routes: 'v5-extrondol-release-audit-and-orchestration',
  tests: 'v4-extrem-governance-hardening',
  workflows: DEVELOPER_CREATE_V700_ROADMAP_STAGE_ID,
} as const;

export type DeveloperCreateGapRegistryLayer = keyof typeof DEVELOPER_CREATE_GAP_REGISTRY_ROADMAP_STAGE_IDS;

export const createDeveloperCreateGapRegistryItem = ({
  id,
  layer,
  measurableOutput,
  status,
  blockerReason,
  roadmapStageId,
}: {
  id: string;
  layer: DeveloperCreateGapRegistryLayer;
  measurableOutput: string;
  status: 'READY' | 'WATCH' | 'BLOCKED';
  blockerReason: string | null;
  roadmapStageId?: string;
}) => ({
  id,
  layer,
  roadmapStageId: roadmapStageId ?? DEVELOPER_CREATE_GAP_REGISTRY_ROADMAP_STAGE_IDS[layer],
  measurableOutput,
  status,
  blockerReason,
});

export const DEVELOPER_CREATE_V700_SCOPE_STATEMENT =
  'APDEJT NA VERZIJU 700 remains an additive governance/program extension above v1-v7, without new runtime routes and without parallel source-of-truth systems.' as const;

export const DEVELOPER_CREATE_RANDOM_SELECTION_SCOPE_STATEMENT =
  'RANDOM selekcija svega is mapped only through Napoleon Diskaveri bounded selection outputs (status, blocker/watch reasons, review posture, downstream reference).' as const;

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

export const DEVELOPER_CREATE_LEKSIKON_CANONICAL_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == LEKSIKON' as const;

export const DEVELOPER_CREATE_LEKSIKON_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == LEKSIKON == additive-only bounded interpretativni rečnik/sloj objašnjenja bez novih runtime ruta i bez paralelnog source-of-truth sistema' as const;

export const DEVELOPER_CREATE_LEKSIKON_ROLE_CLASSIFICATION =
  'additive-only-bounded-leksikon-interpretative-vocabulary-track' as const;

export const DEVELOPER_CREATE_LEKSIKON_BOUNDED_SIGNALS = [
  'lexicon-readiness',
  'bounded-vocabulary-lock',
  'interpretation-layer-consistency',
  'summary-safe-governance-mirroring',
  'deterministic-fallback-signal',
] as const;

export const DEVELOPER_CREATE_LEKSIKON_SUMMARY_SAFE_FIELDS = [
  'canonicalAlias',
  'status',
  'blockerReason',
  'watchReasons',
  'reviewPosture',
  'downstreamReference',
  'lexiconSummary',
] as const;

export const DEVELOPER_CREATE_LEKSIKON_DOWNSTREAM_POLICY = {
  linkedRepo: 'spaja86/IO-OPENUI-AO',
  syncMode: 'summary-only',
  rawLexiconInternalsStayRepoLocal: true,
  rawExtremExtrondolInternalsStayRepoLocal: true,
} as const;

export const DEVELOPER_CREATE_IZVESTAJ_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == IZVEŠTAJ == additive-only canonical branch report alias over existing EXTREM, EXTRONDOL, and SPAJA KOD readiness/governance/summary surfaces without new runtime routes or parallel source-of-truth systems' as const;

export const DEVELOPER_CREATE_IZVESTAJ_ROLE_CLASSIFICATION =
  'additive-only-bounded-branch-report-alias' as const;

export const DEVELOPER_CREATE_IZVESTAJ_REQUIRED_BLOCKS = [
  'completed',
  'partial',
  'blocked',
  'branchCompletionPercent',
  'platformCompletionPercent',
  'promotionReadinessStatus',
  'nextStep',
  'rolloutPlan',
  'rollbackPlan',
  'humanReviewStatus',
  'downstreamReference',
] as const;

export const DEVELOPER_CREATE_IZVESTAJ_REQUIRED_AUDIT_FIELDS = [
  'roadmapStageId',
  'measurableOutput',
  'acceptanceEvidence',
  'rolloutPlan',
  'rollbackPlan',
  'humanReviewStatus',
  'downstreamReference',
  'branchCompletionPercent',
  'platformCompletionPercent',
] as const;

export const DEVELOPER_CREATE_IZVESTAJ_SOURCE_OF_TRUTH_LAYERS = {
  extrem: {
    sourceOfTruth: '/api/extrimli/extrem',
    boundedVocabulary: ['DOK', 'DIK', 'FOR'],
    role: 'technical-signal-and-readiness',
  },
  extrondol: {
    sourceOfTruth: '/api/extrimli/extrondol',
    boundedVocabulary: ['DAK', 'DUK'],
    role: 'governance-wawe-audit-rollout-rollback-human-review',
  },
  spajaKod: {
    sourceOfTruth: '/api/extrimli/spaja-kod',
    publicBoundary: 'audit-safe-summary-only',
    focus: ['status', 'reasons', 'nextStep'],
  },
} as const;

export const DEVELOPER_CREATE_PROMOCIJE_TIKETI_BONUSI_PROPUSNICE_ADMINISTRATIVNI_BONUSI_CANONICAL_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == PROMOCIJE / TIKETI / BONUSI / PROPUSNICE / ADMINISTRATIVNI BONUSI' as const;

export const DEVELOPER_CREATE_PROMOCIJE_TIKETI_BONUSI_PROPUSNICE_ADMINISTRATIVNI_BONUSI_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == PROMOCIJE / TIKETI / BONUSI / PROPUSNICE / ADMINISTRATIVNI BONUSI == additive-only bounded enterprise/governance paket pod Kompanija SPAJA / Digitalna Industrija bez novih runtime ruta i bez paralelnog source-of-truth sistema' as const;

export const DEVELOPER_CREATE_PROMOCIJE_TIKETI_BONUSI_PROPUSNICE_ADMINISTRATIVNI_BONUSI_ROLE_CLASSIFICATION =
  'additive-only-bounded-enterprise-promotions-tickets-bonuses-passes-admin-overrides-track' as const;

export const DEVELOPER_CREATE_PROMOCIJE_TIKETI_BONUSI_PROPUSNICE_ADMINISTRATIVNI_BONUSI_BOUNDED_SIGNALS = [
  'promocije-readiness',
  'tiketi-evidence',
  'bonusi-approval',
  'propusnice-eligibility',
  'administrativni-bonusi-human-review-override',
  'conflict-signal',
  'fallback-signal',
] as const;

export const DEVELOPER_CREATE_PROMOCIJE_TIKETI_BONUSI_PROPUSNICE_ADMINISTRATIVNI_BONUSI_SUBTRACKS = {
  promotions: 'promocije',
  ticketEvidence: 'tiketi',
  bonusApproval: 'bonusi',
  passEligibility: 'propusnice',
  administrativeBonusOverride: 'administrativni bonusi',
} as const;

export const DEVELOPER_CREATE_PROMOCIJE_TIKETI_BONUSI_PROPUSNICE_ADMINISTRATIVNI_BONUSI_SUMMARY_SAFE_FIELDS = [
  'canonicalAlias',
  'status',
  'blockerReason',
  'watchReasons',
  'reviewPosture',
  'downstreamReference',
  'enterpriseSummary',
  'subtrackStatuses',
  'humanReviewOverrideStatus',
] as const;

export const DEVELOPER_CREATE_PROMOCIJE_TIKETI_BONUSI_PROPUSNICE_ADMINISTRATIVNI_BONUSI_DOWNSTREAM_POLICY = {
  linkedRepo: 'spaja86/IO-OPENUI-AO',
  syncMode: 'summary-only',
  rawCommercialFormulasStayRepoLocal: true,
  rawTicketEvidenceStaysRepoLocal: true,
  rawAdministrativeInternalsStayRepoLocal: true,
} as const;

export const DEVELOPER_CREATE_KRALJEVSKO_TAKMICENJE_CANONICAL_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KRALJEVSKO TAKMIČENJE' as const;

export const DEVELOPER_CREATE_KRALJEVSKO_TAKMICENJE_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KRALJEVSKO TAKMIČENJE == additive-only bounded umetničko/takmičarski paket sa round-robin modelom, bez AI asistencije u izvođenju i bez novih runtime ruta ili paralelnog source-of-truth sistema' as const;

export const DEVELOPER_CREATE_KRALJEVSKO_TAKMICENJE_ROLE_CLASSIFICATION =
  'additive-only-bounded-kraljevsko-takmicenje-audit-governed-track' as const;

export const DEVELOPER_CREATE_KRALJEVSKO_TAKMICENJE_EVALUATION_CRITERIA = [
  'umetnicki-dizajn',
  'igracki-pohod',
  'lepota-glasa',
  'intonacija-umetnickog-pevanja',
  'stilski-aranzman',
  'pevacki-stil',
  'originalni-stav-autenticnost',
] as const;

export const DEVELOPER_CREATE_KRALJEVSKO_TAKMICENJE_AUTHENTICITY_RULES = [
  'samo-originalne-pesme',
  'bez-imitacije-idola',
  'bez-ai-asistencije-u-izvodjenju',
  'deterministic-ready-watch-blocked-validation',
] as const;

export const DEVELOPER_CREATE_KRALJEVSKO_TAKMICENJE_AUTHENTICITY_TOKEN_INPUT =
  'original-songs,no-imitation,no-ai-performance' as const;

export const DEVELOPER_CREATE_KRALJEVSKO_TAKMICENJE_TOURNAMENT_MODEL = {
  format: 'round-robin-svako-sa-svakim',
  reviewGates: ['human-review', 'governance-review', 'promotion-freeze-check', 'rollback-readiness'],
  releaseAuditRequired: true,
} as const;

export const DEVELOPER_CREATE_KRALJEVSKO_TAKMICENJE_REWARDS_POLICY = {
  targetGroup: 'prvih-100-takmicarki',
  policyMode: 'audit-safe-governance-only',
  requiresVerification: true,
  requiresHumanReview: true,
  priorityModel: 'score-then-governance-clearance',
} as const;

export const DEVELOPER_CREATE_KRALJEVSKI_POKLONI_ZA_SVACIJI_RODJENDAN_CANONICAL_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KRALJEVSKI POKLONI ZA SVAČIJI ROĐENDAN' as const;

export const DEVELOPER_CREATE_KRALJEVSKI_POKLONI_ZA_SVACIJI_RODJENDAN_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KRALJEVSKI POKLONI ZA SVAČIJI ROĐENDAN == additive-only bounded paket bez novih runtime ruta i bez novog source-of-truth sloja; ownership ostaje zaključan na EXTREM (DOK/DIK/FOR), EXTRONDOL (DAK/DUK) i SPAJA KOD (audit-safe summary-only).' as const;

export const DEVELOPER_CREATE_KRALJEVSKI_POKLONI_ZA_SVACIJI_RODJENDAN_ROLE_CLASSIFICATION =
  'additive-only-bounded-kraljevski-pokloni-za-svaciji-rodjendan-track' as const;

export const DEVELOPER_CREATE_KRALJEVSKI_POKLONI_ZA_SVACIJI_RODJENDAN_BOUNDED_SIGNALS = [
  'birthday-readiness',
  'gift-catalog-readiness',
  'coverage-for-everyone',
  'blocker-watch-reason-discipline',
  'deterministic-fallback-signal',
] as const;

export const DEVELOPER_CREATE_KRALJEVSKI_POKLONI_ZA_SVACIJI_RODJENDAN_FALLBACK_INPUTS = [
  'NaN',
  'Infinity',
  'empty',
  'conflict',
] as const;

export const DEVELOPER_CREATE_KRALJEVSKI_POKLONI_ZA_SVACIJI_RODJENDAN_SUMMARY_SAFE_FIELDS = [
  'canonicalAlias',
  'status',
  'blockerReason',
  'watchReasons',
  'reviewPosture',
  'downstreamReference',
  'birthdayGiftSummary',
  'fallbackInputStatus',
] as const;

export const DEVELOPER_CREATE_KRALJEVSKI_POKLONI_ZA_SVACIJI_RODJENDAN_DOWNSTREAM_POLICY = {
  linkedRepo: 'spaja86/IO-OPENUI-AO',
  syncMode: 'summary-only',
  rawGiftInterpretationStaysRepoLocal: true,
  rawExtremFormulasStayRepoLocal: true,
  rawExtrondolGovernanceFormulasStayRepoLocal: true,
} as const;

export const DEVELOPER_CREATE_KRALJEVSKI_SAT_CANONICAL_ALIAS =
  DEVELOPER_CREATE_VRH_KRALJEVSKI_SAT_ALIAS;

export const DEVELOPER_CREATE_KRALJEVSKI_SAT_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KRALJEVSKI SAT == additive-only bounded traka bez novih runtime ruta i bez paralelnog source-of-truth modela; ownership ostaje zaključan na EXTREM (tehnički readiness nad DIP/KAR/DUR/CUR/RET/DOK/OKOT signalima), EXTRONDOL (governance/freeze/promotion/rollback/release-audit) i SPAJA KOD (audit-safe summary-only).' as const;

export const DEVELOPER_CREATE_KRALJEVSKI_SAT_ROLE_CLASSIFICATION =
  'additive-only-bounded-kraljevski-sat-track' as const;

export const DEVELOPER_CREATE_KRALJEVSKI_SAT_BOUNDED_TOKEN_SET = [
  'DIP',
  'KAR',
  'DUR',
  'CUR',
  'RET',
  'DOK',
  'OKOT',
] as const;

export const DEVELOPER_CREATE_KRALJEVSKI_SAT_LAYER_OWNERSHIP_LOCK = {
  extrem: 'technical-readiness-signal-over-dip-kar-dur-cur-ret-dok-okot',
  extrondol: 'governance-freeze-promotion-rollback-release-audit',
  spajaKod: 'audit-safe-summary-only',
} as const;

export const DEVELOPER_CREATE_KRALJEVSKI_SAT_READINESS_LANGUAGE = [
  'READY',
  'WATCH',
  'BLOCKED',
] as const;

export const DEVELOPER_CREATE_KRALJEVSKI_SAT_SUMMARY_SAFE_FIELDS = [
  'canonicalAlias',
  'status',
  'blockerReason',
  'watchReasons',
  'reviewPosture',
  'downstreamReference',
  'kraljevskiSatTokenSummary',
  'fallbackInputStatus',
] as const;

export const DEVELOPER_CREATE_KRALJEVSKI_SAT_DOWNSTREAM_POLICY = {
  linkedRepo: 'spaja86/IO-OPENUI-AO',
  syncMode: 'summary-only',
  rawTokenInternalsStayRepoLocal: true,
  rawExtremFormulasStayRepoLocal: true,
  rawExtrondolGovernanceFormulasStayRepoLocal: true,
} as const;

export const DEVELOPER_CREATE_KRALJEVSKI_RAD_CANONICAL_ALIAS =
  DEVELOPER_CREATE_VRH_KRALJEVSKI_RAD_ALIAS;

export const DEVELOPER_CREATE_KRALJEVSKI_RAD_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KRALJEVSKI RAD == additive-only bounded traka bez novih runtime ruta i bez paralelnog source-of-truth modela; ownership ostaje zaključan na EXTREM (tehnički readiness nad DIR/DUR/DAR/RER/DIK/DUR/DAR/DJOMPA/DOKAT/KRUNA/ZOMBAT/DUKUS/NIKSON/KITAN/DIKAT/KVATRO/KALIMERO), EXTRONDOL (governance/freeze/promotion/rollback/release-audit) i SPAJA KOD (audit-safe summary-only).' as const;

export const DEVELOPER_CREATE_KRALJEVSKI_RAD_ROLE_CLASSIFICATION =
  'additive-only-bounded-kraljevski-rad-track' as const;

export const DEVELOPER_CREATE_KRALJEVSKI_RAD_BOUNDED_TOKEN_SEQUENCE = [
  'DIR',
  'DUR',
  'DAR',
  'RER',
  'DIK',
  'DUR',
  'DAR',
  'DJOMPA',
  'DOKAT',
  'KRUNA',
  'ZOMBAT',
  'DUKUS',
  'NIKSON',
  'KITAN',
  'DIKAT',
  'KVATRO',
  'KALIMERO',
] as const;

export const DEVELOPER_CREATE_KRALJEVSKI_RAD_FALLBACK_INPUTS = [
  'NaN',
  'Infinity',
  'empty',
  'conflict',
] as const;

export const DEVELOPER_CREATE_KRALJEVSKI_RAD_SUMMARY_SAFE_FIELDS = [
  'canonicalAlias',
  'status',
  'blockerReason',
  'watchReasons',
  'reviewPosture',
  'downstreamReference',
  'sequenceValidationSummary',
  'tokenOrderStatus',
  'duplicateRuleStatus',
  'fallbackInputStatus',
] as const;

export const DEVELOPER_CREATE_KRALJEVSKI_RAD_DOWNSTREAM_POLICY = {
  linkedRepo: 'spaja86/IO-OPENUI-AO',
  syncMode: 'summary-only',
  rawTokenInternalsStayRepoLocal: true,
  rawExtremFormulasStayRepoLocal: true,
  rawExtrondolGovernanceFormulasStayRepoLocal: true,
} as const;

export const DEVELOPER_CREATE_RADNI_PROSTOR_CANONICAL_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI PROSTOR' as const;

export const DEVELOPER_CREATE_RADNI_PROSTOR_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI PROSTOR == additive-only bounded alias bez novih ruta i bez novog source-of-truth sistema' as const;

export const DEVELOPER_CREATE_RADNI_PROSTOR_ROLE_CLASSIFICATION =
  'additive-only-bounded-radni-prostor-alias-track' as const;

export const DEVELOPER_CREATE_RADNI_PROSTOR_BOUNDED_TOKEN_SEQUENCE = [
  'OKUR',
  'DJUKUR',
  'DAR',
  'ZOR',
  'IKON',
  'ZULUM',
  'DABRE',
  'IZOS',
  'JAKOR',
  'DAPR',
  'ZUKUR',
  'ENTER',
  'DIKAR',
  'ZUMBUL',
  'SIRGED',
  'ZIKOR',
  'DJENDER',
  'ĆUR',
  'NIKON',
  'DERKO',
  'ZUKAL',
  'IKON',
  'ZAJDI',
] as const;

export const DEVELOPER_CREATE_RADNI_PROSTOR_FALLBACK_INPUTS = [
  'NaN',
  'Infinity',
  'empty',
  'conflict',
  'unknown-token',
] as const;

export const DEVELOPER_CREATE_RADNI_PROSTOR_NORMALIZATION_RULES = {
  trimWhitespace: true,
  uppercaseTokens: true,
  collapseMultipleSpaces: true,
  keepCanonicalOrder: true,
  unknownTokenHandling: 'map-to-watch-and-require-review',
  conflictHandling: 'map-to-blocked-and-require-review',
} as const;

export const DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_CANONICAL_ALIAS =
  DEVELOPER_CREATE_VRH_NAVIGACIONI_SISTEM_SA_TREKEROM_ALIAS;

export const DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == NAVIGACIONI SISTEM SA TREKEROM == additive-only bounded navigacioni/tracker alias bez novih ruta i bez paralelnog source-of-truth sistema' as const;

export const DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_ROLE_CLASSIFICATION =
  'additive-only-bounded-navigation-tracker-alias-track' as const;

export const DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_BOUNDED_TOKEN_VOCABULARY = {
  boundedVocabularyPhrase: 'EXTRIMLI EXTRONDOL EXTREM DOK DUK DAK DIK FOR',
  extremTechnicalOwnership: {
    tokens: ['DOK', 'DIK', 'FOR'],
    statusModel: ['READY', 'WATCH', 'BLOCKED'],
    role: 'navigacioni-i-treking-signal',
  },
  extrondolGovernanceOwnership: {
    tokens: ['DAK', 'DUK'],
    role: 'governance-freeze-promotion-audit-rollback-human-review',
  },
  spajaKodBoundary: {
    mode: 'audit-safe-summary-only',
    blocksRawFormulas: true,
    blocksInternalTokenMapping: true,
  },
} as const;

export const DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_REQUIRED_TRACKER_FIELDS = [
  'canonicalAlias',
  'status',
  'conflictIntensity',
  'currentWave',
  'auditEvidence',
  'rollbackReadiness',
  'downstreamReference',
] as const;

export const DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_REQUIRED_GOVERNANCE_OUTPUTS = [
  'promotionFreeze',
  'humanReviewStatus',
  'reviewPosture',
  'releaseAuditSummary',
  'rolloutPlan',
  'rollbackPlan',
] as const;

export const DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_TRACKER_CONTRACT = {
  requiredTrackerFields: DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_REQUIRED_TRACKER_FIELDS,
  requiredGovernanceOutputs:
    DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_REQUIRED_GOVERNANCE_OUTPUTS,
  ownershipSplit: {
    dokDikFor: 'EXTREM',
    dakDuk: 'EXTRONDOL',
    spajaKod: 'audit-safe-summary-only',
  },
  downstreamReference: 'spaja86/IO-OPENUI-AO',
} as const;

export const DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_SUMMARY_SAFE_FIELDS = [
  DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_REQUIRED_TRACKER_FIELDS[0],
  DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_REQUIRED_TRACKER_FIELDS[1],
  DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_REQUIRED_TRACKER_FIELDS[2],
  DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_REQUIRED_TRACKER_FIELDS[3],
  DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_REQUIRED_TRACKER_FIELDS[4],
  DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_REQUIRED_TRACKER_FIELDS[5],
  'reviewPosture',
  'promotionFreeze',
  DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_REQUIRED_TRACKER_FIELDS[6],
] as const;

export const DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_ACCEPTANCE_CRITERIA = [
  'no-new-extrimli-extrem-extrondol-routes',
  'preserve-canonical-narrative-and-additive-only-rule',
  'extrem-can-trigger-freeze-independently',
  'extrondol-must-provide-complete-release-audit-set',
  'spaja-kod-remains-summary-only-boundary',
] as const;

export const DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_DOWNSTREAM_POLICY = {
  linkedRepo: 'spaja86/IO-OPENUI-AO',
  syncMode: 'summary-only',
  rawTokenMappingStaysRepoLocal: true,
  rawExtremExtrondolInternalsStayRepoLocal: true,
} as const;

export const DEVELOPER_CREATE_KONSTRUKCIJE_I_PROJEKTOVANJE_CANONICAL_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KONSTRUKCIJE I PROJEKTOVANJE' as const;

export const DEVELOPER_CREATE_KONSTRUKCIJE_I_PROJEKTOVANJE_SCOPE_STATEMENT =
  'EXTRIMLI EXTRONDOL EXTREM DOK DUK DAK DIK FOR == VRH PROGRAMSKOG EKVILADENTA == KONSTRUKCIJE I PROJEKTOVANJE == additive-only bounded alias pod GRAĐEVINSKI FAKULTET / GRAĐEVINSKI AKT bez novih ruta i bez novog source-of-truth sistema' as const;

export const DEVELOPER_CREATE_KONSTRUKCIJE_I_PROJEKTOVANJE_ROLE_CLASSIFICATION =
  'additive-only-bounded-construction-design-alias-track' as const;

export const DEVELOPER_CREATE_KONSTRUKCIJE_I_PROJEKTOVANJE_BOUNDED_TOKEN_SEQUENCE = [
  'DUR',
  'DJON',
  'TUR',
  'ZIM',
  'UBAR',
  'DOKOR',
  'SINGAR',
  'UKOR',
  'IOP',
  'TUR',
  'UBAR',
  'SINGOF',
  'SIGRAD',
  'OKDEN',
  'UMAR',
] as const;

export const DEVELOPER_CREATE_KONSTRUKCIJE_I_PROJEKTOVANJE_FALLBACK_INPUTS = [
  'NaN',
  'Infinity',
  'empty',
  'conflict',
  'unknown-token',
] as const;

export const DEVELOPER_CREATE_KONSTRUKCIJE_I_PROJEKTOVANJE_BLOCKED_FALLBACK_INPUTS =
  DEVELOPER_CREATE_KONSTRUKCIJE_I_PROJEKTOVANJE_FALLBACK_INPUTS.filter((token) => token === 'conflict');

export const DEVELOPER_CREATE_KONSTRUKCIJE_I_PROJEKTOVANJE_WATCH_FALLBACK_INPUTS =
  DEVELOPER_CREATE_KONSTRUKCIJE_I_PROJEKTOVANJE_FALLBACK_INPUTS.filter((token) => token !== 'conflict');

export const DEVELOPER_CREATE_KONSTRUKCIJE_I_PROJEKTOVANJE_NORMALIZATION_RULES = {
  trimWhitespace: true,
  uppercaseTokens: true,
  collapseMultipleSpaces: true,
  keepCanonicalOrder: true,
  requireExactDuplicateCounts: true,
  duplicateTokenCounts: {
    TUR: 2,
    UBAR: 2,
  },
  unknownTokenHandling: 'map-to-watch-and-require-review',
  conflictHandling: 'map-to-blocked-and-require-review',
} as const;

export const DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_CANONICAL_ALIAS =
  DEVELOPER_CREATE_VRH_VINOGRADI_GROCKA_RESTORAN_ALIAS;

export const DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == VINOGRADI GROCKA, RESTORAN == additive-only bounded business-governance transition package bez novih ruta i bez paralelnog source-of-truth sistema' as const;

export const DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_ROLE_CLASSIFICATION =
  'additive-only-bounded-vinogradi-grocka-restoran-leadership-transition-track' as const;

export const DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_BOUNDED_VOCABULARY_PHRASE =
  'EXTRIMLI EXTRONDOL EXTREM DOK DUK DAK DIK FOR' as const;

export const DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_LEADERSHIP_TRANSITION = {
  dismissedExecutiveDirectorRole: 'izvršni-direktor-legacy-role',
  appointedExecutiveDirectors: ['JONAČIĆ SLAVIŠA', 'JONAČIĆ MARKO'],
  mandatoryAuditTrail: true,
  mandatoryEffectiveDate: true,
  publicSummaryPolicy: 'summary-only-without-internal-hr-details',
} as const;

export const DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_FALLBACK_INPUTS = [
  'NaN',
  'Infinity',
  'empty',
  'conflict',
] as const;

export const DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_SUMMARY_SAFE_FIELDS = [
  'canonicalAlias',
  'status',
  'blockerReason',
  'watchReasons',
  'reviewPosture',
  'downstreamReference',
  'effectiveDate',
  'auditTrailReference',
  'leadershipTransitionSummary',
] as const;

export const DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_CANONICAL_ALIAS =
  DEVELOPER_CREATE_VRH_POSLOVNA_PONUDA_ZELEZARA_DOO_ALIAS;

export const DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == POSLOVNA PONUDA / ŽELEZARA D.O.O. SMEDEREVO == additive-only bounded urgent-meeting intake paket bez novih ruta i bez paralelnog source-of-truth sistema' as const;

export const DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_ROLE_CLASSIFICATION =
  'additive-only-bounded-business-offer-zelezara-urgent-meeting-track' as const;

export const DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_BOUNDED_VOCABULARY_PHRASE =
  'EXTRIMLI EXTRONDOL EXTREM DOK DUK DAK DIK FOR' as const;

export const DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_URGENT_MEETING_INTAKE_PACKAGE = {
  objectiveOfCollaboration: 'prosirenje-poslovne-saradnje-i-industrijska-ekspanzija',
  executiveAppointments: [
    {
      name: 'BOGDAN PRAVILOVIĆ',
      role: 'izvrsni-direktor-poslovna-saradnja',
      scope: 'prosirenje-poslovne-saradnje',
    },
    {
      name: 'MILENKO SPAJIĆ',
      role: 'izvrsni-direktor-informacioni-segment-i-rudna-logistika',
      scope: 'informacioni-segment-iskopine-ruda-i-industrijska-logistika',
      privateIntakeContactRole: 'private-intake-contact',
    },
  ],
  infrastructureRequirements: {
    storageSqm: 2000,
    truckParkingSqm: 5000,
    storageRequirementLabel: 'skladiste-robe',
    parkingRequirementLabel: 'parking-kamiona',
    locationConstraint: 'blizu-zelezare',
  },
  newPlantsAndSectorsPlan: {
    required: true,
    purpose: 'novi-materijali-za-povecanje-trzisne-ekonomije-po-poslovnom-planu',
  },
  referenceListPlan: {
    required: true,
    status: 'pending-compilation',
  },
  timelines: {
    intakePriority: 'urgent-meeting',
    activationWindow: 'post-human-review-and-governance-gates',
  },
  privacyCompliance: {
    personalContactDataPolicy: 'private-intake-audit-evidence-only',
    phoneNumbersPublicSummaryAllowed: false,
    phoneNumbersDownstreamSyncAllowed: false,
    hrAndOperationalDetailsPublicSummaryAllowed: false,
  },
} as const;

export const DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_FALLBACK_INPUTS = [
  'NaN',
  'Infinity',
  'empty',
  'conflict',
] as const;

export const DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_SUMMARY_SAFE_FIELDS = [
  'canonicalAlias',
  'status',
  'blockerReason',
  'watchReasons',
  'reviewPosture',
  'downstreamReference',
  'urgentMeetingSummary',
  'businessCollaborationStatus',
  'locationReadinessStatus',
  'operationsPlanStatus',
  'procurementLogisticsStatus',
  'referenceListStatus',
] as const;
export const DEVELOPER_CREATE_AI_IQ_KONFERENCIJA_ZA_STAMPU_CANONICAL_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AI IQ KONFERENCIJA ZA ŠTAMPU (NOVINE, DIGITALNE NOVINE)' as const;

export const DEVELOPER_CREATE_AI_IQ_KONFERENCIJA_ZA_STAMPU_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AI IQ KONFERENCIJA ZA ŠTAMPU (NOVINE, DIGITALNE NOVINE) == bounded media-documentation explanation package' as const;

export const DEVELOPER_CREATE_AI_IQ_KONFERENCIJA_ZA_STAMPU_ROLE_CLASSIFICATION =
  'additive-only-bounded-media-documentation-explanation-track' as const;

export const DEVELOPER_CREATE_AI_IQ_KONFERENCIJA_ZA_STAMPU_TOKEN_VOCABULARY = {
  canonicalSequence: [
    'KIDOR',
    'ZUKUR',
    'SONG',
    'DEPOR',
    'DJAKUR',
    'ZIMBA',
    'OKUR',
    'DIKTAFON',
    'ZOND',
    'AKURA',
    'ZOMBUA',
    'IKON',
    'DESK',
    'DJIKURI',
    'ZMBABVE',
    'ORON',
    'DARS',
    'DJONGE',
    'DANAR',
    'ZULAI',
    'SERON',
    'DISPOR',
    'DUMBIR',
    'KALU',
    'ZUKAR',
    'DINAR',
    'DJOMPE',
    'NURUS',
  ],
  narrativeMediaTokens: ['KIDOR', 'ZUKUR', 'SONG', 'DEPOR', 'DJAKUR', 'ZIMBA', 'OKUR'],
  auditGovernanceTokens: ['DIKTAFON', 'ZOND', 'AKURA', 'ZOMBUA', 'IKON', 'DESK', 'DJIKURI'],
  visualEditorialTokens: ['ZMBABVE', 'ORON', 'DARS', 'DJONGE', 'DANAR', 'ZULAI', 'SERON'],
  fallbackSummaryTokens: ['DISPOR', 'DUMBIR', 'KALU', 'ZUKAR', 'DINAR', 'DJOMPE', 'NURUS'],
  fallbackSummaryRules: [
    'summary-only-public-output',
    'no-raw-extrem-or-extrondol-formulas',
    'deterministic-fallback-required-on-conflict',
    'no-new-runtime-media-engine',
  ],
} as const;


export const DEVELOPER_CREATE_RADIO_CANONICAL_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADIO' as const;

export const DEVELOPER_CREATE_RADIO_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADIO == additive-only bounded media/distribution/audio alias bez novih ruta i bez paralelnog source-of-truth sistema' as const;

export const DEVELOPER_CREATE_RADIO_ROLE_CLASSIFICATION =
  'additive-only-bounded-media-distribution-audio-alias-track' as const;

export const DEVELOPER_CREATE_RADIO_TOKEN_VOCABULARY = {
  canonicalSequence: ['DOR', 'TRU', 'SKU', 'GIVE', 'TRAJ', 'TUR', 'DIR', 'KON', 'ZION', 'KURA', 'DOKER'],
  distributionAudioTokens: ['DOR', 'TRU', 'SKU', 'GIVE'],
  scheduleContinuityTokens: ['TRAJ', 'TUR', 'DIR'],
  governanceFallbackTokens: ['KON', 'ZION', 'KURA', 'DOKER'],
  semanticPreservation: {
    TRU: 'preserve-existing-TRU-module-trust-readiness-meaning',
    DOKER: 'preserve-existing-DOKER-downstream-governance-meaning',
    SKU: 'preserve-existing-SKU-catalog-identity-meaning',
  },
  fallbackSummaryRules: [
    'summary-only-public-output',
    'no-raw-token-model-exposure',
    'deterministic-fallback-required-on-conflict',
    'no-new-runtime-radio-engine',
  ],
} as const;

export const DEVELOPER_CREATE_RADIO_NORMALIZATION_RULES = {
  trimWhitespace: true,
  uppercaseTokens: true,
  collapseMultipleSpaces: true,
  keepCanonicalOrder: true,
  unknownTokenHandling: 'map-to-watch-and-require-review',
  conflictHandling: 'map-to-blocked-and-require-review',
  preserveOverlappingMeanings: ['TRU', 'DOKER', 'SKU'],
} as const;

export const DEVELOPER_CREATE_RADIO_FALLBACK_INPUTS = [
  'NaN',
  'Infinity',
  'empty',
  'conflict',
  'unknown-token',
] as const;

export const DEVELOPER_CREATE_RADIO_SUMMARY_SAFE_FIELDS = [
  'canonicalAlias',
  'status',
  'blockerReason',
  'watchReasons',
  'reviewPosture',
  'downstreamReference',
  'radioSummary',
  'semanticPreservation',
] as const;

export const DEVELOPER_CREATE_RADIO_DOWNSTREAM_POLICY = {
  linkedRepo: 'spaja86/IO-OPENUI-AO',
  syncMode: 'summary-only',
  rawTokenModelExposure: false,
  repoLocalNarrativeRemainsRich: true,
} as const;

export const DEVELOPER_CREATE_MUZICKA_KUTIJA_CANONICAL_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MUZIČKA KUTIJA' as const;

export const DEVELOPER_CREATE_MUZICKA_KUTIJA_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MUZIČKA KUTIJA == additive-only bounded audio/instrument reflection alias bez novih ruta, bez novog muzičkog engine-a i bez paralelnog source-of-truth sistema' as const;

export const DEVELOPER_CREATE_MUZICKA_KUTIJA_ROLE_CLASSIFICATION =
  'additive-only-bounded-music-box-alias-track' as const;

export const DEVELOPER_CREATE_MUZICKA_KUTIJA_BOUNDED_DESCRIPTION =
  'UBACUJEM SVE INSTRUMENTE MUZIČKE' as const;

export const DEVELOPER_CREATE_MUZICKA_KUTIJA_BOUNDED_THEMATIC_SIGNALS = [
  'ubacujem-sve-instrumente-muzicke',
  'instrument-tabla',
  'ritam-i-duracije',
  'narativ-i-vokal',
  'audio-vizuelna-refleksija',
] as const;

export const DEVELOPER_CREATE_MUZICKA_KUTIJA_SUMMARY_SAFE_FIELDS = [
  'canonicalAlias',
  'status',
  'blockerReason',
  'watchReasons',
  'reviewPosture',
  'downstreamReference',
  'musicBoxSummary',
  'mappedLayerSummary',
] as const;

export const DEVELOPER_CREATE_MUZICKA_KUTIJA_DOWNSTREAM_POLICY = {
  linkedRepo: 'spaja86/IO-OPENUI-AO',
  syncMode: 'summary-only',
  rawInstrumentInternalsStayRepoLocal: true,
  rawAudioInternalsStayRepoLocal: true,
} as const;

export const DEVELOPER_CREATE_RADIO_MIKROFON_PROJECTION_CANONICAL_EQUALITY =
  'MIKROFON == MEGAFON, DISTRIBUTER, SAKSOFON' as const;

export const DEVELOPER_CREATE_RADIO_MIKROFON_PROJECTION_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADIO == MIKROFON == MEGAFON, DISTRIBUTER, SAKSOFON == additive-only bounded audio/distribution projection alias bez novih ruta i bez paralelnog source-of-truth sistema' as const;

export const DEVELOPER_CREATE_RADIO_MIKROFON_PROJECTION_ROLE_CLASSIFICATION =
  'additive-only-bounded-mikrofon-projection-alias' as const;

export const DEVELOPER_CREATE_RADIO_MIKROFON_PROJECTION_TOKEN_VOCABULARY = {
  canonicalSequence: ['MIKROFON', 'MEGAFON', 'DISTRIBUTER', 'SAKSOFON'],
  captureTokens: ['MIKROFON'],
  distributionTokens: ['MEGAFON', 'DISTRIBUTER'],
  tonalProjectionTokens: ['SAKSOFON'],
  semanticPreservation: {
    MIKROFON: 'bounded-audio-capture-entry-point-without-new-runtime-engine',
    MEGAFON: 'bounded-public-amplification-projection-without-new-distribution-engine',
    DISTRIBUTER: 'existing-summary-safe-distribution-governance-channel',
    SAKSOFON: 'bounded-tonal-expression-layer-inside-existing-audio-package',
  },
  fallbackSummaryRules: [
    'summary-only-public-output',
    'no-raw-token-model-exposure',
    'deterministic-fallback-required-on-conflict',
    'no-new-runtime-audio-distribution-engine',
  ],
} as const;

export const DEVELOPER_CREATE_RADIO_MIKROFON_PROJECTION_NORMALIZATION_RULES = {
  trimWhitespace: true,
  uppercaseTokens: true,
  collapseMultipleSpaces: true,
  keepCanonicalOrder: true,
  requireAllProjectionRoles: true,
  unknownTokenHandling: 'map-to-watch-and-require-review',
  conflictHandling: 'map-to-blocked-and-require-review',
} as const;

export const DEVELOPER_CREATE_RADIO_MIKROFON_PROJECTION_FALLBACK_INPUTS = [
  'NaN',
  'Infinity',
  'empty',
  'conflict',
  'unknown-token',
] as const;

export const DEVELOPER_CREATE_RADIO_MIKROFON_PROJECTION_SUMMARY_SAFE_FIELDS = [
  'canonicalEquality',
  'status',
  'blockerReason',
  'watchReasons',
  'reviewPosture',
  'downstreamReference',
  'mikrofonSummary',
  'semanticPreservation',
] as const;

export const DEVELOPER_CREATE_RADIO_MIKROFON_PROJECTION_DOWNSTREAM_POLICY = {
  linkedRepo: 'spaja86/IO-OPENUI-AO',
  syncMode: 'summary-only',
  rawTokenModelExposure: false,
  rawNarrativeStaysRepoLocal: true,
} as const;

export const DEVELOPER_CREATE_AI_IQ_LABORATORIJA_CANONICAL_ALIAS =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AI IQ LABORATORIJA == LABORATORIJSKI NALAZI FAUNE I FLORE I GRAĐEVINSKOG MATERIJALA' as const;

export const DEVELOPER_CREATE_AI_IQ_LABORATORIJA_SCOPE_STATEMENT =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AI IQ LABORATORIJA == LABORATORIJSKI NALAZI FAUNE I FLORE I GRAĐEVINSKOG MATERIJALA == additive-only laboratorijsko-interpretativni sloj nad PROGRAMSKI JEZIK PROUČAVANJA i PROGRAMSKI EKANALOG bez novih ruta i bez paralelnog source-of-truth sistema' as const;

export const DEVELOPER_CREATE_AI_IQ_LABORATORIJA_ROLE_CLASSIFICATION =
  'additive-only-bounded-laboratory-evidence-track' as const;

export const DEVELOPER_CREATE_AI_IQ_LABORATORIJA_DOMAIN_TRACKS = {
  aiIqLaboratorija: {
    canonicalName: 'AI IQ LABORATORIJA',
    role: 'krovni-laboratorijski-kontekst-audit-evidence-readiness-only',
  },
  faunaIFLora: {
    canonicalName: 'FAUNA I FLORA',
    role: 'bounded-prirodni-bioloski-evidencioni-domen',
  },
  gradjevinskiMaterijal: {
    canonicalName: 'GRAĐEVINSKI MATERIJAL',
    role: 'bounded-infrastrukturni-gradjevinski-evidencioni-domen',
  },
} as const;

export const DEVELOPER_CREATE_AI_IQ_LABORATORIJA_BOUNDED_TOKEN_SEQUENCE = [
  'ZUM',
  'DUM',
  'SAK',
  'IK',
  'MUN',
  'DIKOT',
  'DUN',
  'ZAT',
  'DJKUON',
  'SIM',
  'IKAR',
  'DUKAR',
  'IBAP',
  'IRO',
  'DUNOR',
  'IBAN',
  'UKOR',
  'UTVAR',
  'ZIPOT',
] as const;

export const DEVELOPER_CREATE_AI_IQ_LABORATORIJA_FALLBACK_INPUTS = [
  'NaN',
  'Infinity',
  'empty',
  'conflict',
  'unknown-token',
] as const;

export const DEVELOPER_CREATE_AI_IQ_LABORATORIJA_NORMALIZATION_RULES = {
  trimWhitespace: true,
  uppercaseTokens: true,
  collapseMultipleSpaces: true,
  keepCanonicalOrder: true,
  unknownTokenHandling: 'map-to-watch-and-require-review',
  conflictHandling: 'map-to-blocked-and-require-review',
} as const;

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

export const DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_SCOPE_LOCK =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == POSLOVNA PONUDA' as const;

export const DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_PRETPLATA_SCOPE_LOCK =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == POSLOVNA PONUDA / PRETPLATA' as const;

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

export const DEVELOPER_CREATE_SARADNJA_READY_VERCEL_CANONICAL_BUSINESS_MESSAGE = {
  greeting: 'Pozdravljam kompaniju Vercel.',
  collaborationProposal:
    'Šaljem alternativnu poslovnu saradnju da međusobnu pretplatu vršimo preko GitHub-a dok ne uspemo da se međusobno susretnemo.',
  closing: 'Srdačan pozdrav, Nikola Spajić',
} as const;

export const DEVELOPER_CREATE_SARADNJA_READY_GITHUB_SUBSCRIPTION_BRIDGE = {
  mode: 'github-subscription-bridge-until-in-person-meeting',
  additiveOnly: true,
  noNewRuntimeRoutes: true,
  noParallelSourceOfTruth: true,
  activationCriteria: [
    'contract-approval',
    'compliance-review',
    'human-review',
    'payment-verification',
    'downstream-reference',
  ],
  deactivationCriteria: ['in-person-meeting-confirmed', 'freeze-or-rollback-active'],
  communicationStatusLanguage: ['READY', 'WATCH', 'BLOCKED'],
} as const;

export const DEVELOPER_CREATE_SARADNJA_READY_WAWE_ALIGNMENT_LOCK = {
  mandatoryOrder: [
    'wawe-1-pre-release-validation',
    'wawe-2-build-and-staging',
    'wawe-3-downstream-sync',
    'wawe-4-progressive-rollout',
    'wawe-5-resilience-and-final-audit',
  ],
  skipForbidden: true,
} as const;

export const DEVELOPER_CREATE_SARADNJA_READY_AUDIT_FIELDS_LOCK = [
  'roadmapStageId',
  'measurableOutput',
  'acceptanceEvidence',
  'rolloutPlan',
  'rollbackPlan',
  'humanReviewStatus',
  'downstreamReference',
] as const;

export const DEVELOPER_CREATE_SARADNJA_READY_COMMUNICATION_FORMAT_LOCK = {
  statusLanguage: ['READY', 'WATCH', 'BLOCKED'],
  requiredSignals: ['blocker-reason', 'review-posture'],
} as const;

export const DEVELOPER_CREATE_SARADNJA_READY_CROSS_REPO_BOUNDARY_LOCK = {
  linkedRepo: 'spaja86/IO-OPENUI-AO',
  syncMode: 'summary-only',
  rawExtremExtrondolFormulasStayRepoLocal: true,
  internalCommercialScoringStaysRepoLocal: true,
} as const;

export const DEVELOPER_CREATE_SARADNJA_READY_FINAL_PACKAGE_LOCK = {
  outputType: 'single-audit-ready-business-package-for-vercel',
  governanceModel: 'existing-extrimli-extrondol-extrem',
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
  mandatoryAuditFields: DEVELOPER_CREATE_SARADNJA_READY_AUDIT_FIELDS_LOCK,
} as const;

export const DEVELOPER_CREATE_SARADNJA_READY_READINESS_SIGNALS = [
  'offer-clarity',
  'consistency',
  'collaboration-utility',
  'presentation-readiness',
  'stability',
] as const;

export const DEVELOPER_CREATE_SARADNJA_READY_SUMMARY_SAFE_FIELDS = [
  'canonicalAlias',
  'status',
  'blockerReason',
  'watchReasons',
  'reviewPosture',
  'downstreamReference',
  'businessSummary',
  'recommendationLevel',
] as const;

export const DEVELOPER_CREATE_SARADNJA_READY_PRODUCT_DISPOSITION =
  'poklon-za-rad-za-poslovnu-saradnju' as const;

export const DEVELOPER_CREATE_SARADNJA_READY_RECOMMENDATION_LEVEL =
  'EKSTREMNA_PREPORUKA' as const;

/**
 * Public governance contract for the repo-local DOKSA pretplata case.
 * Detailed intake identities stay in private intake/audit evidence, while this export
 * preserves the additive-only/public-safe boundaries that the markdown artifact must mirror.
 */
export const DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE = {
  canonicalSubscriberLegalEntity: 'DOKSA d.o.o. Zrenjanin',
  additiveOnlyScope: DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_PRETPLATA_SCOPE_LOCK,
  intakeContactOrAuthorizedSignerRole: 'private-intake-contact-or-authorized-signer',
  intakeContactOrAuthorizedSignerRequiresValidation: true,
  ownershipSplit: {
    extrem: 'technical-readiness-and-evidence-only',
    extrondol: 'review-freeze-promotion-rollback-payment-verification',
    spajaKod: 'audit-safe-summary-only',
  },
  activationHardGates: [
    'contract-approval',
    'compliance-review',
    'human-review',
    'payment-verification',
    'downstream-reference',
  ],
  directEmploymentRequestMessageHandling: {
    classification: 'private-intake-or-audit-evidence-only',
    publicSafeSummaryAllowed: false,
    downstreamSyncAllowed: false,
  },
  employmentOrPartnershipTrackSeparation: {
    pretplataTrack: 'billing-and-governance-only',
    employmentTrack: 'separate-human-review-commercial-track',
  },
  acceptanceCriteria: {
    noNewRuntimeRoutes: true,
    noParallelSourceOfTruth: true,
    noActivationWithoutConfirmedIdentityContractAndPayment: true,
    noPrivateMessagesOrContactsInPublicSafeSummary: true,
    downstreamSyncMode: 'summary-only',
  },
} as const;

export const DEVELOPER_CREATE_PROJECT_GRADATION_SCOPE_LOCK =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA' as const;

export const DEVELOPER_CREATE_PROJECT_GRADATION_BOUNDED_VOCABULARY = [
  'EXTRIMLI',
  'EXTRONDOL',
  'EXTREM',
  'DOK',
  'DUK',
  'DAK',
  'DIK',
  'FOR',
] as const;

export const DEVELOPER_CREATE_PROJECT_GRADATION_SMALL_PROJECT_MANIFEST_CORE = {
  role: 'manifest-core-with-minimal-readiness-proof',
  resistanceCriteria: {
    pass: 'meets-canonical-readiness-and-no-blocker',
    watch: 'partial-signal-needs-human-review',
    blocked: 'conflict-or-governance-blocker-present',
  },
  statusModel: ['READY', 'WATCH', 'BLOCKED'],
} as const;

export const DEVELOPER_CREATE_PROJECT_GRADATION_LARGE_PROJECT_ORTHOGONAL_PROJECTION = {
  role: 'large-project-as-orthogonal-projection-over-small-project',
  requiresProjectionSegments: true,
  segmentRule: 'each-segment-inherits-small-project-manifest-criteria-and-status-language',
  aggregateRule: 'segment-sum-forms-large-project-picture-without-changing-scope-lock',
} as const;

export const DEVELOPER_CREATE_PROJECT_GRADATION_LAYER_OWNERSHIP_LOCK = {
  dokDikFor: 'EXTREM',
  dakDuk: 'EXTRONDOL',
  spajaKod: 'audit-safe-summary-only',
} as const;

export const DEVELOPER_CREATE_PROJECT_GRADATION_RESISTANCE_GRADIENT_MODEL = {
  smallScope: 'lower-resistance-threshold-faster-validation',
  mediumScope: 'reinforced-review-and-governance-gate',
  largeScope: 'full-wawe-and-audit-discipline-before-promotion',
} as const;

export const DEVELOPER_CREATE_PROJECT_GRADATION_LANGUAGE_TRACK_BINDING = {
  sinemetricko: 'narrative-signal-lane',
  objektnoOrijentisano: 'structure-lane',
  proporcionalno: 'relation-lane',
  metricko: 'rhythm-cadence-lane',
  paradijogonalno: 'projection-orchestration-lane',
} as const;

export const DEVELOPER_CREATE_PROJECT_GRADATION_ITERATION_MANDATORY_OUTPUTS = {
  technicalReadinessSignal: 'required',
  governanceDecisionPosture: 'promote-freeze-rollback-required',
  auditSafeSummary: 'required-with-blocker-reason-and-downstream-reference',
} as const;

export const DEVELOPER_CREATE_PROJECT_GRADATION_ACCEPTANCE_LOCK = {
  confirmsLargeProjectOrthogonalProjection: true,
  confirmsDokDikForAndDakDukSplitUnchanged: true,
  confirmsManifestResistanceMappedByScopeGradation: true,
} as const;
