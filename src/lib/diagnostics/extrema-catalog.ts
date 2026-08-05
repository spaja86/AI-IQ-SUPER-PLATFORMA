/**
 * 🔬 ExtremaCatalog — Dijagnostika Ekstrimiteta Ekstrema
 *
 * Katalog svih poznatih ekstremnih stanja po modulu.
 * Svaki unos definiše: id, module, condition, severity, remediation.
 *
 * AI IQ SUPER PLATFORMA — Kompanija SPAJA
 */

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type ExtremaSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type ExtremaModule =
  | 'gigatron'
  | 'nova-generacija'
  | 'calculator'
  | 'ci-cd'
  | 'network';

export type ExtremaConditionType =
  | 'invalid-input'
  | 'system-event'
  | 'agent-event'
  | 'network-event'
  | 'performance';

export interface ExtremaCatalogEntry {
  id: string;
  module: ExtremaModule;
  conditionType: ExtremaConditionType;
  condition: string;
  severity: ExtremaSeverity;
  remediation: string;
}

// ─── Katalog ──────────────────────────────────────────────────────────────────

export const EXTREMA_CATALOG: ExtremaCatalogEntry[] = [
  // ── GIGATRON ──────────────────────────────────────────────────────────────
  {
    id: 'GIG-001',
    module: 'gigatron',
    conditionType: 'invalid-input',
    condition: 'Negativna cena proizvoda (price < 0)',
    severity: 'CRITICAL',
    remediation: 'Odbaci unos, loguj SKU, obavesti procurement tim.',
  },
  {
    id: 'GIG-002',
    module: 'gigatron',
    conditionType: 'system-event',
    condition: 'Nulte zalihe pri pokušaju narudžbine (stock = 0)',
    severity: 'CRITICAL',
    remediation: 'Blokiraj narudžbinu, vrati 409 Conflict, obavesti kupca.',
  },
  {
    id: 'GIG-003',
    module: 'gigatron',
    conditionType: 'invalid-input',
    condition: 'PDV izvan opsega 0–100%',
    severity: 'CRITICAL',
    remediation: 'Odbaci unos, vrati 422 Unprocessable Entity, loguj SKU.',
  },
  {
    id: 'GIG-004',
    module: 'gigatron',
    conditionType: 'invalid-input',
    condition: 'Nevalidni SKU format (ne prati pattern GIG-XXXXX)',
    severity: 'WARNING',
    remediation: 'Označi proizvod kao nevalidni SKU, ne prikazuj u katalogu.',
  },
  {
    id: 'GIG-005',
    module: 'gigatron',
    conditionType: 'invalid-input',
    condition: 'Affiliate provizija < 0% ili > 100%',
    severity: 'CRITICAL',
    remediation: 'Odbaci konfiguraciju provizije, koristi defaultnu vrednost 5%.',
  },
  {
    id: 'GIG-006',
    module: 'gigatron',
    conditionType: 'invalid-input',
    condition: 'Cena = 0 pri procurement narudžbini',
    severity: 'WARNING',
    remediation: 'Zatraži manuelnu potvrdu pre procesiranja nulte cene.',
  },
  {
    id: 'GIG-007',
    module: 'gigatron',
    conditionType: 'performance',
    condition: 'API response > 200ms',
    severity: 'WARNING',
    remediation: 'Aktiviraj cache sloj, proveri DB indekse, eskaluj na infra tim.',
  },

  // ── NOVA GENERACIJA ───────────────────────────────────────────────────────
  {
    id: 'NG-001',
    module: 'nova-generacija',
    conditionType: 'system-event',
    condition: 'SpajaPro 16 Hipermreza: čvor nedostupan (od 256)',
    severity: 'CRITICAL',
    remediation: 'Pokreni kaskadni failover na alternativni čvor, loguj node ID.',
  },
  {
    id: 'NG-002',
    module: 'nova-generacija',
    conditionType: 'invalid-input',
    condition: 'Fairness engine RTP izvan opsega [85%, 100%]',
    severity: 'CRITICAL',
    remediation: 'Obustavi gaming sesiju, vrati RTP na 96% default, obavesti compliance.',
  },
  {
    id: 'NG-003',
    module: 'nova-generacija',
    conditionType: 'invalid-input',
    condition: 'Gaming seed = 0 ili null',
    severity: 'CRITICAL',
    remediation: 'Generiši novi kriptografski seed, odbaci null/zero seed.',
  },
  {
    id: 'NG-004',
    module: 'nova-generacija',
    conditionType: 'agent-event',
    condition: 'Persona desync: > 50 aktivnih persona',
    severity: 'WARNING',
    remediation: 'Pokreni re-sync dijagnostiku, ograniči nove persona kreacije.',
  },
  {
    id: 'NG-005',
    module: 'nova-generacija',
    conditionType: 'invalid-input',
    condition: 'Oktava van opsega [1–16]',
    severity: 'WARNING',
    remediation: 'Clamp vrednost na [1, 16], loguj original vrednost.',
  },
  {
    id: 'NG-006',
    module: 'nova-generacija',
    conditionType: 'performance',
    condition: 'Evaluacija > 50ms',
    severity: 'WARNING',
    remediation: 'Profiliraj evaluacijski path, optimizuj hot path u SpajaPro.',
  },
  {
    id: 'NG-007',
    module: 'nova-generacija',
    conditionType: 'agent-event',
    condition: 'Self-healing dijagnostika neuspela (max retry exceeded)',
    severity: 'CRITICAL',
    remediation: 'Eskaluj na human-review agenta, aktiviraj emergency fallback.',
  },

  // ── CALCULATOR ───────────────────────────────────────────────────────────
  {
    id: 'CALC-001',
    module: 'calculator',
    conditionType: 'invalid-input',
    condition: 'Deljenje nulom (division by zero)',
    severity: 'CRITICAL',
    remediation: 'Vrati grešku korisniku, ne propagiraj Infinity vrednost.',
  },
  {
    id: 'CALC-002',
    module: 'calculator',
    conditionType: 'invalid-input',
    condition: 'NaN propagacija u rezultatu',
    severity: 'CRITICAL',
    remediation: 'Odbaci kalkulaciju, loguj ulazne vrednosti, vrati 400.',
  },
  {
    id: 'CALC-003',
    module: 'calculator',
    conditionType: 'invalid-input',
    condition: 'Infinity rezultat kalkulacije',
    severity: 'WARNING',
    remediation: 'Označi rezultat kao overflow, prikaži korisniku upozorenje.',
  },
  {
    id: 'CALC-004',
    module: 'calculator',
    conditionType: 'performance',
    condition: 'Execution time > 100ms',
    severity: 'WARNING',
    remediation: 'Optimizuj algoritam, razmotriti async izvršavanje za teške kalkulacije.',
  },

  // ── CI/CD AGENT PIPELINE ──────────────────────────────────────────────────
  {
    id: 'CICD-001',
    module: 'ci-cd',
    conditionType: 'agent-event',
    condition: 'Agent loop detekcija (max retry exceeded)',
    severity: 'CRITICAL',
    remediation: 'Kill agent process, obavesti human-review, loguj audit trail.',
  },
  {
    id: 'CICD-002',
    module: 'ci-cd',
    conditionType: 'performance',
    condition: 'Build > 3 min (Nova Generacija KPI breach)',
    severity: 'WARNING',
    remediation: 'Analiziraj slow build korake, razmotriti paralelizaciju.',
  },
  {
    id: 'CICD-003',
    module: 'ci-cd',
    conditionType: 'agent-event',
    condition: 'Deadlock između agenata',
    severity: 'CRITICAL',
    remediation: 'Aktiviraj circuit breaker, resetuj agent state, obavesti ops.',
  },

  // ── NETWORK ──────────────────────────────────────────────────────────────
  {
    id: 'NET-001',
    module: 'network',
    conditionType: 'network-event',
    condition: 'WebSocket disconnect (neočekivano)',
    severity: 'WARNING',
    remediation: 'Pokušaj reconnect sa exponential backoff (max 5 pokušaja).',
  },
  {
    id: 'NET-002',
    module: 'network',
    conditionType: 'network-event',
    condition: 'API 5xx greška',
    severity: 'CRITICAL',
    remediation: 'Aktiviraj retry logiku, loguj request ID, eskaluj ako perzistira.',
  },
  {
    id: 'NET-003',
    module: 'network',
    conditionType: 'network-event',
    condition: 'DNS fail',
    severity: 'CRITICAL',
    remediation: 'Prebaci na backup DNS, obavesti infra tim.',
  },
  {
    id: 'NET-004',
    module: 'network',
    conditionType: 'network-event',
    condition: 'CORS blokada',
    severity: 'WARNING',
    remediation: 'Proveri allowed origins konfiguraciju, loguj blocked origin.',
  },
];

// ─── Pomoćne funkcije ─────────────────────────────────────────────────────────

export function getExtremaCatalog(): ExtremaCatalogEntry[] {
  return EXTREMA_CATALOG;
}

export function getExtremaByModule(module: ExtremaModule): ExtremaCatalogEntry[] {
  return EXTREMA_CATALOG.filter((e) => e.module === module);
}

export function getExtremaBySeverity(severity: ExtremaSeverity): ExtremaCatalogEntry[] {
  return EXTREMA_CATALOG.filter((e) => e.severity === severity);
}

export function getExtremaById(id: string): ExtremaCatalogEntry | undefined {
  return EXTREMA_CATALOG.find((e) => e.id === id);
}

export function getExtremaCatalogStats(): {
  total: number;
  byModule: Record<ExtremaModule, number>;
  bySeverity: Record<ExtremaSeverity, number>;
} {
  const byModule = {} as Record<ExtremaModule, number>;
  const bySeverity = {} as Record<ExtremaSeverity, number>;

  for (const entry of EXTREMA_CATALOG) {
    byModule[entry.module] = (byModule[entry.module] ?? 0) + 1;
    bySeverity[entry.severity] = (bySeverity[entry.severity] ?? 0) + 1;
  }

  return { total: EXTREMA_CATALOG.length, byModule, bySeverity };
}
