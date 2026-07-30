import type { SekvencaTip } from '@/lib/types';

export const UIUX_STRUKTURNI_PODVICI_CILJ =
  'Generisati i upravljati masivnim prostorom UI/UX varijanti kroz pravila, ne ručno.' as const;

export const REFERENCE_DEPOT_POSSIBILITY_SPACE = 870_000_000_000n;

export type DepoTip = 'platform' | 'feature' | 'domain' | 'journey';
export type UXSegment = 'new' | 'returning' | 'power' | 'enterprise';
export type ResponsiveBreakpoints = 'sm' | 'md' | 'lg' | 'xl';

export interface DepoIdentityLayer {
  depoId: string;
  depoTip: DepoTip;
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
  stanja: ('default' | 'loading' | 'empty' | 'error' | 'success')[];
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
  informationArchitecture: InformationArchitectureLayer;
  components: ComponentLayer;
  styleSystem: StyleSystemLayer;
  metadata: {
    generatedAt: string;
    source: 'composition-generator';
    score?: number;
    stableCandidateId?: string;
  };
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
  stanja: ComponentLayer['stanja'][];
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
}

export interface KPIWeights {
  conversionRate: number;
  taskCompletion: number;
  errorRate: number;
  engagement: number;
}

export const DEFAULT_KPI_WEIGHTS: KPIWeights = {
  conversionRate: 0.4,
  taskCompletion: 0.2,
  errorRate: 0.25,
  engagement: 0.15,
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
}

export const OUTPUT_ARTIFACTS: OutputArtifacts = {
  canonicalSchema: 'canonical-uiux-schema.json',
  compatibilityMatrix: 'uiux-compatibility-matrix.json',
  kpiDashboard: 'uiux-kpi-dashboard',
  auditTrail: 'uiux-audit-trail',
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

function buildCandidate(
  seed: string,
  depo: DepoIdentityLayer,
  catalog: GeneratorCatalog,
  sequence: number,
): CanonicalUIUXSchema {
  const salt = `${depo.depoId}:${sequence}`;

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
    informationArchitecture,
    components,
    styleSystem,
    metadata: {
      generatedAt: new Date().toISOString(),
      source: 'composition-generator',
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

export function scoreVariant(metrics: KPIMetrics, weights: KPIWeights = DEFAULT_KPI_WEIGHTS): number {
  const conversion = clamp(metrics.conversionRate);
  const taskCompletion = clamp(1 - metrics.taskCompletionMs / 15000);
  const errorRate = clamp(1 - metrics.errorRate);
  const engagement = clamp(metrics.engagementScore);

  return Number(
    (
      conversion * weights.conversionRate +
      taskCompletion * weights.taskCompletion +
      errorRate * weights.errorRate +
      engagement * weights.engagement
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
