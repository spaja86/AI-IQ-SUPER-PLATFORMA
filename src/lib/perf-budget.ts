// SpajaUltraOmegaCore -∞Ω+∞ — Performance Budget & CI Quality Gates
// Kompanija SPAJA — Digitalna Industrija
//
// Talas 5 (P1): CI kvalitet — performance budget, quality gates, flaky test quarantine.
//
// Implementira:
//   • Performance budget konstante (Core Web Vitals, bundle size, latency)
//   • CI quality gate definicije (min coverage, max bundle, max latency)
//   • Flaky test quarantine lista
//   • Budget check helpers za CI pipelines
//
// Upotreba:
//   import { checkLatencyBudget, CI_QUALITY_GATES } from '@/lib/perf-budget';
//   const result = checkLatencyBudget('api', 450);

// ─── Core Web Vitals Budgets ──────────────────────────────────────────────────

/**
 * Core Web Vitals budgeti za produkciju.
 * Izvor: Google PageSpeed Insights preporuke.
 */
export const CORE_WEB_VITALS_BUDGET = {
  /** Largest Contentful Paint — max millisekundi */
  LCP_MS: 2500,
  /** First Input Delay — max millisekundi */
  FID_MS: 100,
  /** Cumulative Layout Shift — max skor */
  CLS_MAX: 0.1,
  /** Time to First Byte — max millisekundi */
  TTFB_MS: 600,
  /** First Contentful Paint — max millisekundi */
  FCP_MS: 1800,
  /** Total Blocking Time — max millisekundi */
  TBT_MS: 200,
  /** Interaction to Next Paint — max millisekundi */
  INP_MS: 200,
} as const;

// ─── Bundle Size Budgets ──────────────────────────────────────────────────────

/**
 * Bundle size budgeti za Next.js build.
 * Vrednosti u kilobajtima (gzipped).
 */
export const BUNDLE_SIZE_BUDGET_KB = {
  /** Maksimalni ukupni JavaScript bundle (gzip). */
  TOTAL_JS: 500,
  /** Maksimalni First Load JS po ruti. */
  FIRST_LOAD_JS: 200,
  /** Maksimalni chunk size. */
  MAX_CHUNK: 150,
  /** Maksimalni CSS bundle. */
  CSS: 50,
  /** Maksimalni inicijalni HTML. */
  HTML: 20,
} as const;

// ─── API Latency Budgets ──────────────────────────────────────────────────────

/**
 * Maksimalna dozvoljena latencija po kategoriji API ruta (P95, ms).
 */
export const API_LATENCY_BUDGET_MS: Record<string, number> = {
  /** Autentifikacija — brza, kritična putanja. */
  auth: 300,
  /** Billing operacije. */
  billing: 500,
  /** AI/OpenAI pozivi — uzima u obzir streaming. */
  ai: 5000,
  /** Gaming akcije — real-time zahtevi. */
  gaming: 100,
  /** Analytics endpointi. */
  analytics: 800,
  /** Health check. */
  health: 50,
  /** Generički API. */
  default: 500,
};

// ─── CI Quality Gates ─────────────────────────────────────────────────────────

export interface QualityGate {
  id: string;
  naziv: string;
  opis: string;
  /** Minimalni prag koji mora biti ispunjen. */
  minValue?: number;
  /** Maksimalni prag koji ne sme biti premašen. */
  maxValue?: number;
  /** Da li je blokira merge ako fail. */
  blocker: boolean;
}

/**
 * Definicije CI quality gate-ova.
 * Koristiti u GitHub Actions / Vercel build hoooks.
 */
export const CI_QUALITY_GATES: QualityGate[] = [
  {
    id: 'test-coverage-lines',
    naziv: 'Test Coverage — Lines',
    opis: 'Minimalni procenat pokrivenosti linija koda testovima.',
    minValue: 70,
    blocker: true,
  },
  {
    id: 'test-coverage-branches',
    naziv: 'Test Coverage — Branches',
    opis: 'Minimalni procenat pokrivenosti grana (branch coverage).',
    minValue: 60,
    blocker: false,
  },
  {
    id: 'bundle-total-js',
    naziv: 'Bundle Size — Total JS',
    opis: `Maksimalni ukupni JavaScript bundle (KB, gzip): ${BUNDLE_SIZE_BUDGET_KB.TOTAL_JS}KB.`,
    maxValue: BUNDLE_SIZE_BUDGET_KB.TOTAL_JS,
    blocker: true,
  },
  {
    id: 'bundle-first-load',
    naziv: 'Bundle Size — First Load JS',
    opis: `Maksimalni First Load JS po ruti (KB): ${BUNDLE_SIZE_BUDGET_KB.FIRST_LOAD_JS}KB.`,
    maxValue: BUNDLE_SIZE_BUDGET_KB.FIRST_LOAD_JS,
    blocker: true,
  },
  {
    id: 'api-latency-p95',
    naziv: 'API Latency P95',
    opis: 'Maksimalna P95 latencija za generičke API rute (ms).',
    maxValue: API_LATENCY_BUDGET_MS.default,
    blocker: true,
  },
  {
    id: 'lcp-budget',
    naziv: 'Core Web Vitals — LCP',
    opis: `Largest Contentful Paint mora biti < ${CORE_WEB_VITALS_BUDGET.LCP_MS}ms.`,
    maxValue: CORE_WEB_VITALS_BUDGET.LCP_MS,
    blocker: false,
  },
  {
    id: 'typescript-errors',
    naziv: 'TypeScript Errors',
    opis: 'Broj TypeScript grešaka mora biti 0.',
    maxValue: 0,
    blocker: true,
  },
  {
    id: 'security-vulnerabilities',
    naziv: 'Security Vulnerabilities',
    opis: 'Kritične npm audit vulnerabilities moraju biti 0.',
    maxValue: 0,
    blocker: true,
  },
  {
    id: 'a11y-violations',
    naziv: 'Accessibility Violations',
    opis: 'Kritične a11y greške (axe-core) moraju biti 0.',
    maxValue: 0,
    blocker: false,
  },
] as const;

// ─── Flaky Test Quarantine ────────────────────────────────────────────────────

export interface FlakyTestEntry {
  testFile: string;
  testName: string;
  /** Razlog za karantin. */
  reason: string;
  /** Datum kada je stavljen u karantin (ISO). */
  quarantinedAt: string;
  /** Ticket za praćenje fixa. */
  ticket?: string;
  /** Da li je fiksiran (treba ukloniti iz karantina). */
  fixed: boolean;
}

/**
 * Lista flaky testova u karantinu.
 * Testovi u karantinu se preskačaju u CI-u, ali se prate za fix.
 */
export const FLAKY_TEST_QUARANTINE: FlakyTestEntry[] = [
  // Primer: dodati flaky testove ovde
  // {
  //   testFile: 'src/tests/autofinish/billing-race-condition.test.ts',
  //   testName: 'concurrent checkout race',
  //   reason: 'Intermitentno pada zbog timing-a u CI okruženju',
  //   quarantinedAt: '2026-05-01',
  //   ticket: 'SPAJA-1234',
  //   fixed: false,
  // },
];

// ─── Helper Funkcije ──────────────────────────────────────────────────────────

/**
 * Proverava da li latencija prolazi budget za datu kategoriju.
 */
export function checkLatencyBudget(
  category: string,
  measuredMs: number,
): { passed: boolean; budget: number; measured: number; overByMs: number } {
  const budget = API_LATENCY_BUDGET_MS[category] ?? API_LATENCY_BUDGET_MS.default;
  const passed = measuredMs <= budget;
  return {
    passed,
    budget,
    measured: measuredMs,
    overByMs: passed ? 0 : measuredMs - budget,
  };
}

/**
 * Proverava da li bundle size prolazi budget.
 */
export function checkBundleSizeBudget(
  type: keyof typeof BUNDLE_SIZE_BUDGET_KB,
  measuredKb: number,
): { passed: boolean; budget: number; measured: number; overByKb: number } {
  const budget = BUNDLE_SIZE_BUDGET_KB[type];
  const passed = measuredKb <= budget;
  return {
    passed,
    budget,
    measured: measuredKb,
    overByKb: passed ? 0 : measuredKb - budget,
  };
}

/**
 * Evaluira sve quality gate-ove za dati skup metrika.
 */
export function evaluateQualityGates(
  metrics: Record<string, number>,
): { gateId: string; passed: boolean; blocking: boolean }[] {
  return CI_QUALITY_GATES.map((gate) => {
    const value = metrics[gate.id];
    if (value === undefined) {
      return { gateId: gate.id, passed: true, blocking: false }; // Nema metrike = skip
    }

    let passed = true;
    if (gate.minValue !== undefined && value < gate.minValue) passed = false;
    if (gate.maxValue !== undefined && value > gate.maxValue) passed = false;

    return { gateId: gate.id, passed, blocking: gate.blocker && !passed };
  });
}
