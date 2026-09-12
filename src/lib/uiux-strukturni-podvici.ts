import type { SekvencaTip } from '@/lib/types';

export const UIUX_STRUKTURNI_PODVICI_CILJ =
  'Generisati i upravljati masivnim prostorom UI/UX varijanti kroz pravila, ne ručno.' as const;

export const REFERENCE_DEPOT_POSSIBILITY_SPACE = 870_000_000_000n;
export const DEPON_DIVERSITY_TARGET_SPACE = 700_000_000_000_000_000_000_000_000n;

export type DepoTip = 'platform' | 'feature' | 'domain' | 'journey';
export type UXSegment = 'new' | 'returning' | 'power' | 'enterprise';
export type ResponsiveBreakpoints = 'sm' | 'md' | 'lg' | 'xl';
export type DeponUXRole = 'core-operational' | 'marketplace';
export type ScreenState = 'default' | 'loading' | 'empty' | 'error' | 'success';
export type DeviceClass = 'mobile' | 'tablet' | 'desktop' | 'wall';
export type UXIntent =
  | 'task-completion'
  | 'compliance-review'
  | 'discovery'
  | 'ranking'
  | 'recommendation'
  | 'monetization'
  | 'enterprise-review';
export type VariantLifecycleStatus = 'draft' | 'candidate' | 'stable' | 'fallback';

export interface DepoIdentityLayer {
  depoId: string;
  depoTip: DepoTip;
  deponRole?: DeponUXRole;
  domen: string;
  korisnickiSegment: UXSegment;
  trziste: string;
}

export interface InformationArchitectureLayer {
  navigacija: string[];
  sekcije: string[];
  prioriteti: string[];
}

export interface ComponentLayer {
  sekvence: SekvencaTip[];
  varijante: string[];
  stanja: ScreenState[];
}

export interface StyleSystemLayer {
  tema: 'svetla' | 'tamna' | 'auto';
  tokenSet: string;
  responsive: ResponsiveBreakpoints[];
  a11yNivo: 'AA' | 'AAA';
}

export interface CanonicalUIUXSchema {
  schemaVersion: string;
  identity: DepoIdentityLayer;
  deliveryContext: VariantDeliveryContext;
  informationArchitecture: InformationArchitectureLayer;
  components: ComponentLayer;
  styleSystem: StyleSystemLayer;
  performanceBudget: PerformanceBudget;
  governance: VariantGovernance;
  metadata: {
    generatedAt: string;
    source: 'composition-generator';
    candidateId?: string;
    score?: number;
    rolloutPriority?: number;
    variantFamily?: string;
    stableCandidateId?: string;
  };
}

export interface VariantDeliveryContext {
  drzava: string;
  uredjaj: DeviceClass;
  intent: UXIntent;
  lifecycle: VariantLifecycleStatus;
}

export interface PerformanceBudget {
  maxRenderMs: number;
  maxHydrationMs: number;
  maxInteractionMs: number;
}

export interface VariantGovernance {
  requiredA11y: StyleSystemLayer['a11yNivo'];
  blockedPatterns: string[];
  fallbackStableCandidateId: string;
  auditTrailKey: string;
}

export interface CompatibilityMatrix {
  fromVersion: string;
  toVersion: string;
  backwardCompatible: boolean;
  migracija: 'none' | 'optional' | 'required';
}

export const SCHEMA_REGISTRY = {
  current: '1.0.0',
  supported: ['1.0.0', '0.9.0'],
  compatibility: [
    {
      fromVersion: '0.9.0',
      toVersion: '1.0.0',
      backwardCompatible: true,
      migracija: 'optional',
    },
  ] satisfies CompatibilityMatrix[],
};

export interface GeneratorCatalog {
  navigacije: string[][];
  sekcije: string[][];
  prioriteti: string[][];
  sekvence: SekvencaTip[][];
  varijante: string[][];
  stanja: ScreenState[][];
  stilovi: StyleSystemLayer[];
}

export interface ConstraintViolation {
  ruleId: string;
  severity: 'warning' | 'error';
  message: string;
}

export interface StructureRule {
  id: string;
  severity: 'warning' | 'error';
  check: (schema: CanonicalUIUXSchema) => boolean;
  message: string;
}

export const UX_RULES: StructureRule[] = [
  {
    id: 'required-cta-on-checkout',
    severity: 'error',
    check: (schema) => {
      const hasCheckout = schema.informationArchitecture.sekcije.includes('checkout');
      if (!hasCheckout) return true;
      return schema.components.sekvence.includes('cta');
    },
    message: 'Checkout tok mora imati CTA sekvencu.',
  },
  {
    id: 'a11y-baseline',
    severity: 'error',
    check: (schema) => schema.styleSystem.a11yNivo === 'AA' || schema.styleSystem.a11yNivo === 'AAA',
    message: 'Svaka varijanta mora ispuniti najmanje AA nivo pristupačnosti.',
  },
  {
    id: 'hero-priority-consistency',
    severity: 'warning',
    check: (schema) => {
      const hasHero = schema.components.sekvence.includes('hero');
      if (!hasHero) return true;
      return schema.informationArchitecture.prioriteti[0] === 'value-proposition';
    },
    message: 'Hero sekvenca treba da ima value-proposition kao prvi prioritet.',
  },
];

export interface GovernanceHeuristics {
  blockedPatterns: string[];
  requiredA11y: StyleSystemLayer['a11yNivo'];
  maxRenderMs: number;
}

export const GOVERNANCE_HEURISTICS: GovernanceHeuristics = {
  blockedPatterns: ['hidden-primary-cta', 'scroll-jump-nav', 'contrast-under-aa'],
  requiredA11y: 'AA',
  maxRenderMs: 120,
};

export interface KPIMetrics {
  conversionRate: number;
  taskCompletionMs: number;
  errorRate: number;
  engagementScore: number;
  retentionRate?: number;
  trustScore?: number;
}

export interface KPIWeights {
  conversionRate: number;
  taskCompletion: number;
  errorRate: number;
  engagement: number;
  retention: number;
  trust: number;
}

export const DEFAULT_KPI_WEIGHTS: KPIWeights = {
  conversionRate: 0.3,
  taskCompletion: 0.2,
  errorRate: 0.2,
  engagement: 0.1,
  retention: 0.1,
  trust: 0.1,
};

export interface RankedVariant {
  schema: CanonicalUIUXSchema;
  score: number;
  metrics: KPIMetrics;
  stable: boolean;
}

export interface SelectionContext {
  segment: UXSegment;
  fallbackStableId?: string;
}

export interface ExperimentStopCriteria {
  minSampleSize: number;
  maxRuntimeDays: number;
  maxErrorRate: number;
  minLift: number;
}

export interface ExperimentModel {
  id: string;
  depoId: string;
  strategy: 'ab' | 'multi-armed-bandit';
  variants: string[];
  stopCriteria: ExperimentStopCriteria;
}

export interface DeponDiversityAxis {
  id: string;
  label: string;
  cardinality: number;
  description: string;
}

export interface DeponDiversityKPI {
  metric: 'depon-uiux-diversity-space';
  label: 'razlicitosti-depona';
  targetLabel: '700000 ZILIJARDI';
  minimumSpace: bigint;
  currentReferenceSpace: bigint;
}

export interface DeponRoleCatalog {
  role: DeponUXRole;
  deponRange: string;
  primaryIntents: UXIntent[];
  allowedSequences: SekvencaTip[][];
  defaultTokenSets: string[];
  supportedStates: ScreenState[];
}

export interface DeponRolloutStage {
  priority: number;
  deponId: string;
  role: DeponUXRole;
  reason: string;
}

export interface VariantSelectionAuditEntry {
  depoId: string;
  candidateId: string;
  stableCandidateId: string | null;
  selectedAt: string;
  selectedBy: 'kpi-model' | 'stable-fallback' | 'manual-override';
  segment: UXSegment;
  intent: UXIntent;
  fallbackUsed: boolean;
  score: number | null;
  auditTrailKey: string;
  reason: string;
}

export interface OperatingPhase {
  faza: 1 | 2 | 3 | 4;
  naziv: string;
  outcomes: string[];
}

export const OPERATING_MODEL: OperatingPhase[] = [
  { faza: 1, naziv: 'Standardizacija šeme i pravila', outcomes: ['Canonical schema', 'Validation rules'] },
  { faza: 2, naziv: 'Generator + validacija + katalog', outcomes: ['Composition generator', 'Compatibility matrix'] },
  { faza: 3, naziv: 'Selekcija + eksperimentacija', outcomes: ['KPI scoring', 'A/B and MAB experiments'] },
  { faza: 4, naziv: 'Skaliranje i cross-repo sync', outcomes: ['Multi-depo rollout', 'Audit traces'] },
];

export interface OutputArtifacts {
  canonicalSchema: string;
  compatibilityMatrix: string;
  kpiDashboard: string;
  auditTrail: string;
  variantRegistry: string;
  rolloutPolicy: string;
}

export const OUTPUT_ARTIFACTS: OutputArtifacts = {
  canonicalSchema: 'canonical-uiux-schema.json',
  compatibilityMatrix: 'uiux-compatibility-matrix.json',
  kpiDashboard: 'uiux-kpi-dashboard',
  auditTrail: 'uiux-audit-trail',
  variantRegistry: 'depon-variant-registry.json',
  rolloutPolicy: 'depon-rollout-policy.json',
};

export interface RiskMitigation {
  risk: string;
  mitigation: string;
}

export const RISK_REGISTER: RiskMitigation[] = [
  {
    risk: 'Kompleksnost prostora varijanti',
    mitigation: 'Ograničiti kombinacije kroz modularne kataloške blokove i validacione limite.',
  },
  {
    risk: 'Nekonzistentan UX između varijanti',
    mitigation: 'Primena centralnih heuristika i obaveznih a11y/perf pravila.',
  },
  {
    risk: 'Operativno preopterećenje timova',
    mitigation: 'Fazno uvođenje sa prioritetnim use-case rollout-om i stabilnim fallback-om.',
  },
  {
    risk: 'Accessibility drift između DEPON slojeva',
    mitigation: 'Centralizovati AA/AAA proveru, zabranjene obrasce i fallback stable kandidate.',
  },
];

export const DEPON_DIVERSITY_KPI: DeponDiversityKPI = {
  metric: 'depon-uiux-diversity-space',
  label: 'razlicitosti-depona',
  targetLabel: '700000 ZILIJARDI',
  minimumSpace: DEPON_DIVERSITY_TARGET_SPACE,
  currentReferenceSpace: REFERENCE_DEPOT_POSSIBILITY_SPACE,
};

export const DEPON_DIVERSITY_AXES: DeponDiversityAxis[] = [
  { id: 'segment', label: 'Segment', cardinality: 4, description: 'new, returning, power, enterprise' },
  { id: 'state', label: 'Drzava', cardinality: 50, description: 'US state / market segmentation' },
  { id: 'depon-role', label: 'DEPON role', cardinality: 2, description: 'core-operational or marketplace' },
  { id: 'variant-status', label: 'Variant status', cardinality: 4, description: 'draft, candidate, stable, fallback' },
  { id: 'device', label: 'Uredjaj', cardinality: 4, description: 'mobile, tablet, desktop, wall' },
  { id: 'accessibility', label: 'Accessibility', cardinality: 2, description: 'AA or AAA' },
  { id: 'intent', label: 'Intent', cardinality: 7, description: 'task/compliance/discovery/ranking/etc.' },
  { id: 'navigation-catalog', label: 'Navigation catalog', cardinality: 750_000, description: 'Rule-curated nav templates' },
  { id: 'ia-catalog', label: 'IA catalog', cardinality: 900_000, description: 'Canonical information architecture combinations' },
  { id: 'component-catalog', label: 'Component catalog', cardinality: 1_500_000, description: 'Allowed component sequence families' },
  { id: 'screen-state-packs', label: 'State packs', cardinality: 500, description: 'Reusable loading/empty/error/success packs' },
  { id: 'token-systems', label: 'Token systems', cardinality: 256, description: 'Unified token/theme sets' },
  { id: 'experiment-families', label: 'Experiment families', cardinality: 128, description: 'Governed family-level experiments' },
];

export const DEPON_ROLE_CATALOGS: DeponRoleCatalog[] = [
  {
    role: 'core-operational',
    deponRange: 'DEPON-01..DEPON-12',
    primaryIntents: ['task-completion', 'compliance-review', 'enterprise-review'],
    allowedSequences: [
      ['hero', 'progres', 'cta'],
      ['hero', 'tabela', 'cta'],
      ['tekst', 'lista', 'cta'],
    ],
    defaultTokenSets: ['spaja-core-aa', 'spaja-core-aaa'],
    supportedStates: ['default', 'loading', 'empty', 'error', 'success'],
  },
  {
    role: 'marketplace',
    deponRange: 'DEPON-13..DEPON-18',
    primaryIntents: ['discovery', 'ranking', 'recommendation', 'monetization', 'compliance-review', 'enterprise-review'],
    allowedSequences: [
      ['hero', 'statistika', 'tabela', 'cta'],
      ['hero', 'tabela', 'lista', 'cta'],
      ['hero', 'lista', 'cta'],
      ['tekst', 'lista', 'baner', 'cta'],
      ['hero', 'kartice', 'tabela', 'cta'],
      ['tekst', 'kartice', 'cta'],
      ['hero', 'statistika', 'kartice', 'cta'],
      ['hero', 'progres', 'cta'],
      ['hero', 'kartice', 'lista', 'cta'],
      ['hero', 'baner', 'lista', 'cta'],
      ['hero', 'tekst', 'kartice', 'cta'],
      ['hero', 'tabela', 'kartice', 'cta'],
      ['tekst', 'tabela', 'cta'],
      ['hero', 'kartice', 'cta'],
      ['hero', 'statistika', 'lista', 'cta'],
      ['hero', 'tabela', 'baner', 'cta'],
    ],
    defaultTokenSets: ['spaja-market-aa', 'spaja-market-aaa'],
    supportedStates: ['default', 'loading', 'empty', 'error', 'success'],
  },
];

export const DEPON_ROLLOUT_PLAN: DeponRolloutStage[] = [
  { priority: 1, deponId: 'DEPON-15', role: 'marketplace', reason: 'Pilot surface for discovery, ranking, filters, and recommendations.' },
  { priority: 2, deponId: 'DEPON-02', role: 'core-operational', reason: 'State dashboard is the next highest-value controlled UX surface.' },
  { priority: 3, deponId: 'DEPON-08', role: 'core-operational', reason: 'API/admin control surface benefits from task-first governance.' },
  { priority: 4, deponId: 'DEPON-ALL-REMAINING', role: 'core-operational', reason: 'Scale governed patterns across remaining DEPON UI layers.' },
];

export function estimatePossibilitySpace(cardinalities: number[]): bigint {
  return cardinalities.reduce<bigint>((acc, value) => {
    const safeValue = Math.max(1, Math.floor(value));
    return acc * BigInt(safeValue);
  }, 1n);
}

function createSeededIndex(seed: string, salt: string, max: number): number {
  let hash = 0;
  const raw = `${seed}::${salt}`;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  }
  return max === 0 ? 0 : hash % max;
}

function extractCanonicalDeponId(depoId: string): string | null {
  const match = depoId.match(/^(DEPON-\d{2})(?:-[A-Za-z0-9-]+)?$/i);
  if (!match) return null;
  return match[1]!.toUpperCase();
}

function normalizeToParentDeponId(depoId: string): string {
  return extractCanonicalDeponId(depoId) ?? depoId.toUpperCase();
}

function resolveDeponRoleFromCanonicalId(canonicalId: string | null): DeponUXRole {
  if (!canonicalId) return 'core-operational';
  const normalized = Number.parseInt(canonicalId.replace('DEPON-', ''), 10);
  return Number.isFinite(normalized) && normalized >= 13 && normalized <= 18 ? 'marketplace' : 'core-operational';
}

export function resolveDeponRole(depoId: string): DeponUXRole {
  return resolveDeponRoleFromCanonicalId(extractCanonicalDeponId(depoId));
}

function resolveDeponRoleFromIdentity(identity: Pick<DepoIdentityLayer, 'depoId' | 'deponRole'>): DeponUXRole {
  const canonicalId = extractCanonicalDeponId(identity.depoId);
  if (!canonicalId) return identity.deponRole ?? 'core-operational';
  const derivedRole = resolveDeponRoleFromCanonicalId(canonicalId);
  if (identity.deponRole && identity.deponRole !== derivedRole) {
    throw new Error(`DEPON role mismatch for ${identity.depoId}: expected ${derivedRole}, got ${identity.deponRole}`);
  }
  return derivedRole;
}

function buildCandidate(
  seed: string,
  depo: DepoIdentityLayer,
  catalog: GeneratorCatalog,
  sequence: number,
): CanonicalUIUXSchema {
  const salt = `${depo.depoId}:${sequence}`;
  const resolvedRole = resolveDeponRoleFromIdentity(depo);

  const informationArchitecture: InformationArchitectureLayer = {
    navigacija: catalog.navigacije[createSeededIndex(seed, `${salt}:nav`, catalog.navigacije.length)] ?? [],
    sekcije: catalog.sekcije[createSeededIndex(seed, `${salt}:sec`, catalog.sekcije.length)] ?? [],
    prioriteti: catalog.prioriteti[createSeededIndex(seed, `${salt}:prio`, catalog.prioriteti.length)] ?? [],
  };

  const components: ComponentLayer = {
    sekvence: catalog.sekvence[createSeededIndex(seed, `${salt}:seq`, catalog.sekvence.length)] ?? [],
    varijante: catalog.varijante[createSeededIndex(seed, `${salt}:var`, catalog.varijante.length)] ?? [],
    stanja: catalog.stanja[createSeededIndex(seed, `${salt}:state`, catalog.stanja.length)] ?? ['default'],
  };

  const styleSystem =
    catalog.stilovi[createSeededIndex(seed, `${salt}:style`, catalog.stilovi.length)] ?? {
      tema: 'auto',
      tokenSet: 'default',
      responsive: ['sm', 'md', 'lg'],
      a11yNivo: 'AA',
    };

  return {
    schemaVersion: SCHEMA_REGISTRY.current,
    identity: depo,
    deliveryContext: {
      drzava: depo.trziste.toUpperCase(),
      uredjaj: 'desktop',
      intent: resolvedRole === 'marketplace' ? 'discovery' : 'task-completion',
      lifecycle: 'candidate',
    },
    informationArchitecture,
    components,
    styleSystem,
    performanceBudget: {
      maxRenderMs: GOVERNANCE_HEURISTICS.maxRenderMs,
      maxHydrationMs: 180,
      maxInteractionMs: 100,
    },
    governance: {
      requiredA11y: GOVERNANCE_HEURISTICS.requiredA11y,
      blockedPatterns: GOVERNANCE_HEURISTICS.blockedPatterns,
      fallbackStableCandidateId: `${depo.depoId}-stable`,
      auditTrailKey: `${depo.depoId}:uiux-audit-trail`,
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      source: 'composition-generator',
      candidateId: `${depo.depoId}-${sequence}`,
      rolloutPriority: resolveRolloutPriority(depo.depoId),
    },
  };
}

export function estimateDiversityMatrixSpace(axes: DeponDiversityAxis[] = DEPON_DIVERSITY_AXES): bigint {
  return estimatePossibilitySpace(axes.map((axis) => axis.cardinality));
}

export function meetsDeponDiversityTarget(axes: DeponDiversityAxis[] = DEPON_DIVERSITY_AXES): boolean {
  return estimateDiversityMatrixSpace(axes) >= DEPON_DIVERSITY_KPI.minimumSpace;
}

export function getDeponRoleCatalog(role: DeponUXRole): DeponRoleCatalog {
  const catalog = DEPON_ROLE_CATALOGS.find((item) => item.role === role);
  if (!catalog) throw new Error(`Unknown DEPON role catalog: ${role}`);
  return catalog;
}

export function resolveRolloutPriority(depoId: string): number {
  const canonicalId = normalizeToParentDeponId(depoId);
  return (
    DEPON_ROLLOUT_PLAN.find((stage) => stage.deponId.toUpperCase() === canonicalId)?.priority ??
    DEPON_ROLLOUT_PLAN.length + 1
  );
}

export function buildCanonicalDeponSchema(input: {
  identity: DepoIdentityLayer;
  navigacija: string[];
  sekcije: string[];
  prioriteti: string[];
  sekvence: SekvencaTip[];
  varijante: string[];
  stanja: ScreenState[];
  styleSystem: StyleSystemLayer;
  deliveryContext?: Partial<VariantDeliveryContext>;
  performanceBudget?: Partial<PerformanceBudget>;
  metadata?: Partial<CanonicalUIUXSchema['metadata']>;
}): CanonicalUIUXSchema {
  const roleCatalog = getDeponRoleCatalog(resolveDeponRoleFromIdentity(input.identity));
  const resolvedIntent = input.deliveryContext?.intent ?? roleCatalog.primaryIntents[0]!;
  if (!roleCatalog.primaryIntents.includes(resolvedIntent)) {
    throw new Error(`Unsupported intent ${resolvedIntent} for DEPON role ${roleCatalog.role}`);
  }
  if (!meetsRequiredA11y(input.styleSystem.a11yNivo, GOVERNANCE_HEURISTICS.requiredA11y)) {
    throw new Error(
      `A11y level ${input.styleSystem.a11yNivo} does not meet required baseline ${GOVERNANCE_HEURISTICS.requiredA11y}`,
    );
  }
  if (!roleCatalog.allowedSequences.some((sequence) => sequencesEqual(sequence, input.sekvence))) {
    throw new Error(`Unsupported sequence ${input.sekvence.join('>')} for DEPON role ${roleCatalog.role}`);
  }
  if (!input.stanja.every((state) => roleCatalog.supportedStates.includes(state))) {
    throw new Error(`Unsupported screen state for DEPON role ${roleCatalog.role}`);
  }
  return {
    schemaVersion: SCHEMA_REGISTRY.current,
    identity: input.identity,
    deliveryContext: {
      drzava: input.deliveryContext?.drzava ?? input.identity.trziste.toUpperCase(),
      uredjaj: input.deliveryContext?.uredjaj ?? 'desktop',
      intent: resolvedIntent,
      lifecycle: input.deliveryContext?.lifecycle ?? 'stable',
    },
    informationArchitecture: {
      navigacija: input.navigacija,
      sekcije: input.sekcije,
      prioriteti: input.prioriteti,
    },
    components: {
      sekvence: input.sekvence,
      varijante: input.varijante,
      stanja: input.stanja,
    },
    styleSystem: input.styleSystem,
    performanceBudget: {
      maxRenderMs: input.performanceBudget?.maxRenderMs ?? GOVERNANCE_HEURISTICS.maxRenderMs,
      maxHydrationMs: input.performanceBudget?.maxHydrationMs ?? 180,
      maxInteractionMs: input.performanceBudget?.maxInteractionMs ?? 100,
    },
    governance: {
      requiredA11y: GOVERNANCE_HEURISTICS.requiredA11y,
      blockedPatterns: GOVERNANCE_HEURISTICS.blockedPatterns,
      fallbackStableCandidateId: input.metadata?.stableCandidateId ?? `${input.identity.depoId}-stable`,
      auditTrailKey: `${input.identity.depoId}:uiux-audit-trail`,
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      source: 'composition-generator',
      candidateId: input.metadata?.candidateId ?? `${input.identity.depoId}-manual`,
      score: input.metadata?.score,
      rolloutPriority: input.metadata?.rolloutPriority ?? resolveRolloutPriority(input.identity.depoId),
      variantFamily: input.metadata?.variantFamily,
      stableCandidateId: input.metadata?.stableCandidateId ?? `${input.identity.depoId}-stable`,
    },
  };
}

export function validateStructure(
  schema: CanonicalUIUXSchema,
  rules: StructureRule[] = UX_RULES,
): ConstraintViolation[] {
  return rules
    .filter((rule) => !rule.check(schema))
    .map((rule) => ({
      ruleId: rule.id,
      severity: rule.severity,
      message: rule.message,
    }));
}

export function generateStructuredVariants(input: {
  depo: DepoIdentityLayer;
  catalog: GeneratorCatalog;
  seed: string;
  maxCandidates: number;
  rules?: StructureRule[];
}): CanonicalUIUXSchema[] {
  const max = Math.max(1, Math.min(input.maxCandidates, 200));
  const rules = input.rules ?? UX_RULES;
  const variants: CanonicalUIUXSchema[] = [];

  let index = 0;
  while (variants.length < max && index < max * 5) {
    const candidate = buildCandidate(input.seed, input.depo, input.catalog, index);
    const violations = validateStructure(candidate, rules);
    const hasErrors = violations.some((v) => v.severity === 'error');
    if (!hasErrors) variants.push(candidate);
    index++;
  }

  return variants;
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

export function meetsRequiredA11y(actual: StyleSystemLayer['a11yNivo'], required: StyleSystemLayer['a11yNivo']): boolean {
  const rank = { AA: 1, AAA: 2 } as const;
  return rank[actual] >= rank[required];
}

function sequencesEqual(left: SekvencaTip[], right: SekvencaTip[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function scoreVariant(metrics: KPIMetrics, weights: KPIWeights = DEFAULT_KPI_WEIGHTS): number {
  const conversion = clamp(metrics.conversionRate);
  const taskCompletion = clamp(1 - metrics.taskCompletionMs / 15000);
  const errorRate = clamp(1 - metrics.errorRate);
  const engagement = clamp(metrics.engagementScore);
  const retention = clamp(metrics.retentionRate ?? conversion);
  const trust = clamp(metrics.trustScore ?? errorRate);

  return Number(
    (
      conversion * weights.conversionRate +
      taskCompletion * weights.taskCompletion +
      errorRate * weights.errorRate +
      engagement * weights.engagement +
      retention * weights.retention +
      trust * weights.trust
    ).toFixed(6),
  );
}

export function rankVariants(
  candidates: Array<{ schema: CanonicalUIUXSchema; metrics: KPIMetrics; stable?: boolean }>,
): RankedVariant[] {
  return candidates
    .map((candidate) => {
      const score = scoreVariant(candidate.metrics);
      return {
        schema: {
          ...candidate.schema,
          metadata: {
            ...candidate.schema.metadata,
            score,
          },
        },
        score,
        metrics: candidate.metrics,
        stable: candidate.stable ?? false,
      } satisfies RankedVariant;
    })
    .sort((a, b) => b.score - a.score);
}

export function selectBestVariant(
  ranked: RankedVariant[],
  context: SelectionContext,
): RankedVariant | null {
  if (ranked.length === 0) return null;

  const segmentPreferred = ranked.filter((item) => item.schema.identity.korisnickiSegment === context.segment);
  if (segmentPreferred.length > 0) return segmentPreferred[0];

  if (context.fallbackStableId) {
    const stableFallback = ranked.find((item) => item.schema.metadata.stableCandidateId === context.fallbackStableId);
    if (stableFallback) return stableFallback;
  }

  const firstStable = ranked.find((item) => item.stable);
  return firstStable ?? ranked[0];
}

export function shouldStopExperiment(
  metrics: { sampleSize: number; runtimeDays: number; errorRate: number; lift: number },
  criteria: ExperimentStopCriteria,
): boolean {
  if (metrics.errorRate > criteria.maxErrorRate) return true;
  if (metrics.runtimeDays >= criteria.maxRuntimeDays && metrics.sampleSize >= criteria.minSampleSize) return true;
  return metrics.sampleSize >= criteria.minSampleSize && metrics.lift >= criteria.minLift;
}

export function detectBlockedPatterns(patterns: string[]): string[] {
  const blocked = new Set(GOVERNANCE_HEURISTICS.blockedPatterns);
  return patterns.filter((pattern) => blocked.has(pattern));
}

export function isSchemaVersionSupported(version: string): boolean {
  return SCHEMA_REGISTRY.supported.includes(version);
}

export function buildVariantSelectionAuditEntry(params: {
  selected: RankedVariant;
  context: SelectionContext & { depoId: string; intent: UXIntent };
  reason?: string;
  selectedBy?: VariantSelectionAuditEntry['selectedBy'];
}): VariantSelectionAuditEntry {
  const stableCandidateId = params.selected.schema.metadata.stableCandidateId ?? null;
  const candidateId = params.selected.schema.metadata.candidateId ?? `${params.context.depoId}-candidate`;
  const resolvedSelectedBy =
    params.selectedBy ??
    (params.context.fallbackStableId && candidateId === params.context.fallbackStableId ? 'stable-fallback' : 'kpi-model');
  const fallbackUsed = resolvedSelectedBy === 'stable-fallback';

  return {
    depoId: params.context.depoId,
    candidateId,
    stableCandidateId,
    selectedAt: new Date().toISOString(),
    selectedBy: resolvedSelectedBy,
    segment: params.context.segment,
    intent: params.context.intent,
    fallbackUsed,
    score: params.selected.score ?? null,
    auditTrailKey: params.selected.schema.governance.auditTrailKey,
    reason: params.reason ?? 'Controlled selection from governed DEPON variant space.',
  };
}
