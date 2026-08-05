/**
 * 🔬 DiagnosticsEngine — Dijagnostika Ekstrimiteta Ekstrema
 *
 * Srž dijagnostičkog sistema: detekcija, klasifikacija i generisanje izveštaja
 * o ekstremnim stanjima u svim modulima AI IQ SUPER PLATFORMA.
 *
 * AI IQ SUPER PLATFORMA — Kompanija SPAJA
 */

import {
  EXTREMA_CATALOG,
  type ExtremaCatalogEntry,
  type ExtremaModule,
  type ExtremaSeverity,
} from './extrema-catalog';

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export interface ExtremaRule {
  /** ID iz kataloga (npr. 'GIG-001') */
  catalogId: string;
  /** Funkcija koja proverava vrednost i vraća true ako je ekstrem detektovan */
  check: (value: unknown) => boolean;
}

export interface ExtremaFinding {
  catalogEntry: ExtremaCatalogEntry;
  detectedAt: string; // ISO timestamp
  value: unknown;
  module: ExtremaModule;
  severity: ExtremaSeverity;
}

export interface ExtremaReport {
  generatedAt: string;
  module: ExtremaModule | 'all';
  totalFindings: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  findings: ExtremaFinding[];
  status: 'OK' | 'DEGRADED' | 'CRITICAL';
}

// ─── Ugrađena pravila po modulu ───────────────────────────────────────────────

export const BUILT_IN_RULES: ExtremaRule[] = [
  // GIGATRON
  {
    catalogId: 'GIG-001',
    check: (v) => typeof v === 'number' && v < 0,
  },
  {
    catalogId: 'GIG-002',
    check: (v) => typeof v === 'number' && v === 0,
  },
  {
    catalogId: 'GIG-003',
    check: (v) => typeof v === 'number' && (v < 0 || v > 100),
  },
  {
    catalogId: 'GIG-004',
    check: (v) => typeof v === 'string' && !/^GIG-\d{5}$/.test(v),
  },
  {
    catalogId: 'GIG-005',
    check: (v) => typeof v === 'number' && (v < 0 || v > 100),
  },
  {
    catalogId: 'GIG-006',
    check: (v) => typeof v === 'number' && v === 0,
  },
  {
    catalogId: 'GIG-007',
    check: (v) => typeof v === 'number' && v > 200,
  },

  // NOVA GENERACIJA
  {
    catalogId: 'NG-001',
    check: (v) => v === null || v === undefined || v === false,
  },
  {
    catalogId: 'NG-002',
    check: (v) => typeof v === 'number' && (v < 85 || v > 100),
  },
  {
    catalogId: 'NG-003',
    check: (v) => v === 0 || v === null || v === undefined,
  },
  {
    catalogId: 'NG-004',
    check: (v) => typeof v === 'number' && v > 50,
  },
  {
    catalogId: 'NG-005',
    check: (v) => typeof v === 'number' && (v < 1 || v > 16),
  },
  {
    catalogId: 'NG-006',
    check: (v) => typeof v === 'number' && v > 50,
  },
  {
    catalogId: 'NG-007',
    check: (v) => v === true,
  },

  // CALCULATOR
  {
    catalogId: 'CALC-001',
    check: (v) => v === 0 || v === null || v === undefined,
  },
  {
    catalogId: 'CALC-002',
    check: (v) => typeof v === 'number' && isNaN(v),
  },
  {
    catalogId: 'CALC-003',
    check: (v) => typeof v === 'number' && !isFinite(v) && !isNaN(v),
  },
  {
    catalogId: 'CALC-004',
    check: (v) => typeof v === 'number' && v > 100,
  },

  // CI/CD
  {
    catalogId: 'CICD-001',
    check: (v) => v === true,
  },
  {
    catalogId: 'CICD-002',
    check: (v) => typeof v === 'number' && v > 180000, // 3 min u ms
  },
  {
    catalogId: 'CICD-003',
    check: (v) => v === true,
  },

  // NETWORK
  {
    catalogId: 'NET-001',
    check: (v) => v === true,
  },
  {
    catalogId: 'NET-002',
    check: (v) => typeof v === 'number' && v >= 500 && v < 600,
  },
  {
    catalogId: 'NET-003',
    check: (v) => v === true,
  },
  {
    catalogId: 'NET-004',
    check: (v) => v === true,
  },
];

// ─── Engine funkcije ──────────────────────────────────────────────────────────

/**
 * Detektuje ekstremna stanja za dati katalogId i vrednost.
 * Vraća pronađeni katalog unos ako je ekstrem detektovan, inače undefined.
 */
export function detectExtreme(
  catalogId: string,
  value: unknown,
  customCheck?: (value: unknown) => boolean,
): ExtremaCatalogEntry | undefined {
  const entry = EXTREMA_CATALOG.find((e) => e.id === catalogId);
  if (!entry) return undefined;

  const rule = BUILT_IN_RULES.find((r) => r.catalogId === catalogId);
  const checkFn = customCheck ?? rule?.check;
  if (!checkFn) return undefined;

  return checkFn(value) ? entry : undefined;
}

/**
 * Klasifikuje finding u severity kategoriju.
 */
export function classifyExtreme(finding: ExtremaFinding): ExtremaSeverity {
  return finding.severity;
}

/**
 * Pokreće dijagnostiku za dati modul sa skupom {catalogId -> value} parova.
 * Vraća listu detektovanih nalaza.
 */
export function runExtremaDiagnostics(
  module: ExtremaModule,
  inputs: Record<string, unknown>,
): ExtremaFinding[] {
  const findings: ExtremaFinding[] = [];
  const now = new Date().toISOString();

  const moduleEntries = EXTREMA_CATALOG.filter((e) => e.module === module);

  for (const entry of moduleEntries) {
    if (!(entry.id in inputs)) continue;

    const value = inputs[entry.id];
    const detected = detectExtreme(entry.id, value);
    if (detected) {
      findings.push({
        catalogEntry: detected,
        detectedAt: now,
        value,
        module,
        severity: detected.severity,
      });
    }
  }

  return findings;
}

/**
 * Generiše strukturirani JSON izveštaj iz liste nalaza.
 */
export function generateReport(
  findings: ExtremaFinding[],
  module: ExtremaModule | 'all' = 'all',
): ExtremaReport {
  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;
  const warningCount = findings.filter((f) => f.severity === 'WARNING').length;
  const infoCount = findings.filter((f) => f.severity === 'INFO').length;

  let status: ExtremaReport['status'] = 'OK';
  if (criticalCount > 0) status = 'CRITICAL';
  else if (warningCount > 0) status = 'DEGRADED';

  return {
    generatedAt: new Date().toISOString(),
    module,
    totalFindings: findings.length,
    criticalCount,
    warningCount,
    infoCount,
    findings,
    status,
  };
}

/**
 * Pokreće punu dijagnostiku svih modula i generiše objedinjeni izveštaj.
 */
export function runFullDiagnostics(
  inputsByModule: Partial<Record<ExtremaModule, Record<string, unknown>>>,
): ExtremaReport {
  const allFindings: ExtremaFinding[] = [];

  for (const [module, inputs] of Object.entries(inputsByModule) as [
    ExtremaModule,
    Record<string, unknown>,
  ][]) {
    const findings = runExtremaDiagnostics(module, inputs);
    allFindings.push(...findings);
  }

  return generateReport(allFindings, 'all');
}
