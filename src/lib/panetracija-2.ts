// Panetracija 2 — V2 Modul za automatizovano testiranje penetracije
// Kompanija SPAJA — Digitalna Industrija
//
// V2 engine za pen-testing sa proširenim tipovima, scan session store-om,
// CVSS 3.1 vektorima, CWE ID-evima, istorijom skenova i trend analizom.
// Integriše se sa bezbednosnom infrastrukturom platforme:
//   • security-headers.ts — HTTP bezbednosni hederi
//   • ΩPermissionMatrix — nivoi pristupa (panetracija2:read / panetracija2:execute)
//   • autofinish-petlja.ts — audit log

import { APP_VERSION } from '@/lib/constants';
import type { PentestFinding, PentestKategorija, PentestSeverity, PentestStatus } from '@/lib/pentracija';
import { OWASP_KATEGORIJE } from '@/lib/pentracija';

// Re-export za lakši uvoz
export type { PentestKategorija, PentestSeverity, PentestStatus };
export { OWASP_KATEGORIJE };

// ─── Tipovi V2 ────────────────────────────────────────────────────────────────

export type AttackVectorV2 = 'network' | 'adjacent' | 'local' | 'physical';
export type ScanSessionStatus = 'pending' | 'running' | 'completed' | 'failed';

/** Prošireni finding sa CVSS 3.1 vektorom, CWE ID-em, nosiocem i rokom */
export interface PentestFindingV2 extends PentestFinding {
  cvssVector: string;        // npr. "AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
  cweId: string;             // npr. "CWE-89"
  potvrdio?: string;         // ko je potvrdio nalaz
  nosioc?: string;           // vlasnik remedijacije
  rokRemedijacije?: string;  // ISO datum rok za popravku
  prioritet: 1 | 2 | 3;     // 1=highest, 3=lowest
}

/** Encapsulira jedan scan run */
export interface PentestScanSession {
  scanId: string;
  startedAt: string;
  completedAt?: string;
  status: ScanSessionStatus;
  triggeredBy: string;
  durationMs?: number;
  overallScore?: number;
  ukupnoNalaza?: number;
}

/** Kompaktni sažetak scan sesije za istoriju */
export interface PentestScanSummary {
  scanId: string;
  startedAt: string;
  completedAt?: string;
  status: ScanSessionStatus;
  durationMs?: number;
  overallScore?: number;
  ukupnoNalaza?: number;
}

/** Delta skora između skenova */
export interface PentestTrend {
  scanId: string;
  timestamp: string;
  overallScore: number;
  delta: number;    // razlika od prethodnog skena (0 za prvi)
}

/** V2 kompletan izveštaj */
export interface PentestReportV2 {
  verzija: string;
  status: 'ok';
  scanId: string;
  overallScore: number;
  ukupnoNalaza: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  openNalaza: number;
  fixedNalaza: number;
  durationMs: number;
  findings: PentestFindingV2[];
  history: PentestScanSummary[];
  trendovi: PentestTrend[];
  timestamp: string;
}

/** V2 kompaktni sažetak za dashboard widget */
export interface PentestSummaryV2 {
  verzija: string;
  overallScore: number;
  ukupnoNalaza: number;
  kritičnih: number;
  openNalaza: number;
  trendDelta: number;
  lastScanId?: string;
  timestamp: string;
}

// ─── Prošireni Katalog Nalaza V2 ─────────────────────────────────────────────

const PENTEST_FINDINGS_V2: PentestFindingV2[] = [
  // ── Injection ──
  {
    id: 'p2-001',
    naziv: 'SQL Injection na pretrazi',
    opis: 'Query parametri nisu sanitizovani kroz ORM sloj pre prosljeđivanja bazi',
    kategorija: 'injection',
    owaspRef: 'A03:2021 — Injection',
    attackVector: 'network',
    cvssScore: 7.5,
    severity: 'high',
    status: 'mitigated',
    remedijacija: 'Korišćen Supabase parameterizovani upiti — direktni SQL stringovi uklonjeni',
    otkriveno: '2026-01-10',
    cvssVector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N',
    cweId: 'CWE-89',
    nosioc: 'Backend Tim',
    rokRemedijacije: '2026-02-01',
    prioritet: 1,
  },
  {
    id: 'p2-002',
    naziv: 'Command Injection u file upload procesoru',
    opis: 'Nevalidovani filenames mogu sadržavati shell metakaraktere koji se prosljeđuju OS komandama',
    kategorija: 'injection',
    owaspRef: 'A03:2021 — Injection',
    attackVector: 'network',
    cvssScore: 9.1,
    severity: 'critical',
    status: 'open',
    remedijacija: 'Implementirati striktnu validaciju filename-a (whitelist alfanumeričkih znakova + ekstenzija)',
    otkriveno: '2026-03-20',
    cvssVector: 'AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H',
    cweId: 'CWE-78',
    nosioc: 'Security Tim',
    rokRemedijacije: '2026-04-15',
    prioritet: 1,
  },
  // ── Broken Auth ──
  {
    id: 'p2-003',
    naziv: 'Nema JWT expiry rotacije',
    opis: 'JWT tokeni nemaju kratke expiry time i refresh-token rotaciju',
    kategorija: 'broken-auth',
    owaspRef: 'A07:2021 — Identification and Authentication Failures',
    attackVector: 'network',
    cvssScore: 6.5,
    severity: 'medium',
    status: 'open',
    remedijacija: 'Implementirati access token (15 min) + refresh token rotaciju (7 dana)',
    otkriveno: '2026-01-15',
    cvssVector: 'AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:L/A:N',
    cweId: 'CWE-613',
    nosioc: 'Auth Tim',
    rokRemedijacije: '2026-05-01',
    prioritet: 1,
  },
  {
    id: 'p2-004',
    naziv: 'Brute-force zaštita nedostaje na login endpointu',
    opis: 'Login endpoint ne ograničava broj pokušaja — mogući credential stuffing napadi',
    kategorija: 'broken-auth',
    owaspRef: 'A07:2021 — Identification and Authentication Failures',
    attackVector: 'network',
    cvssScore: 7.3,
    severity: 'high',
    status: 'mitigated',
    remedijacija: 'Rate limit na /api/auth/login: 5 pokušaja/min po IP, progresivna blokada',
    otkriveno: '2026-02-10',
    cvssVector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N',
    cweId: 'CWE-307',
    nosioc: 'Auth Tim',
    rokRemedijacije: '2026-03-01',
    prioritet: 1,
  },
  // ── XSS ──
  {
    id: 'p2-005',
    naziv: 'Reflected XSS u greška stranicama',
    opis: 'Korisnički input se reflektuje u error porukama bez escaping-a',
    kategorija: 'xss',
    owaspRef: 'A03:2021 — Injection',
    attackVector: 'network',
    cvssScore: 5.4,
    severity: 'medium',
    status: 'fixed',
    remedijacija: 'Next.js auto-escape u JSX + DOMPurify za dinamički HTML sadržaj',
    otkriveno: '2026-02-01',
    cvssVector: 'AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N',
    cweId: 'CWE-79',
    potvrdio: 'Security Audit Team',
    prioritet: 2,
  },
  // ── XXE ──
  {
    id: 'p2-006',
    naziv: 'XXE u XML parsiranju',
    opis: 'XML parser prihvata external entity reference',
    kategorija: 'xxe',
    owaspRef: 'A05:2021 — Security Misconfiguration',
    attackVector: 'network',
    cvssScore: 4.3,
    severity: 'medium',
    status: 'wontfix',
    remedijacija: 'Platforma ne koristi XML ulaz — JSON-only API, rizik nije primenjiv',
    otkriveno: '2026-02-15',
    cvssVector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N',
    cweId: 'CWE-611',
    prioritet: 3,
  },
  // ── Insecure Deserialization ──
  {
    id: 'p2-007',
    naziv: 'Insecure Deserialization u cron payload-ima',
    opis: 'Cron job payload-i nisu validovani pre deserijalizacije',
    kategorija: 'insecure-deserialization',
    owaspRef: 'A08:2021 — Software and Data Integrity Failures',
    attackVector: 'network',
    cvssScore: 6.8,
    severity: 'medium',
    status: 'open',
    remedijacija: 'Implementirati Zod schema validaciju na svim cron endpoint-ima',
    otkriveno: '2026-03-01',
    cvssVector: 'AV:N/AC:H/PR:L/UI:N/S:U/C:H/I:H/A:N',
    cweId: 'CWE-502',
    nosioc: 'Backend Tim',
    rokRemedijacije: '2026-06-01',
    prioritet: 1,
  },
  // ── Vulnerable Components ──
  {
    id: 'p2-008',
    naziv: 'Zastareli npm paketi sa poznatim CVE',
    opis: 'npm audit identifikovao 2 moderate ranjivosti u tranzitivnim zavisnostima',
    kategorija: 'vulnerable-components',
    owaspRef: 'A06:2021 — Vulnerable and Outdated Components',
    attackVector: 'network',
    cvssScore: 4.0,
    severity: 'low',
    status: 'mitigated',
    remedijacija: 'Dependabot aktivan, npm audit fix pokrenut, CI blokira critical CVE',
    otkriveno: '2026-03-15',
    cvssVector: 'AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:L/A:N',
    cweId: 'CWE-1104',
    nosioc: 'DevOps Tim',
    prioritet: 3,
  },
  {
    id: 'p2-009',
    naziv: 'Supply Chain napad na tranzitivne zavisnosti',
    opis: 'Tranzitivne zavisnosti u npm grafu nisu proveravane na integritet (lockfile bypass)',
    kategorija: 'vulnerable-components',
    owaspRef: 'A06:2021 — Vulnerable and Outdated Components',
    attackVector: 'network',
    cvssScore: 8.1,
    severity: 'high',
    status: 'open',
    remedijacija: 'Aktivirati npm provenance attestation, pinning exact versions u lockfile, CI npm audit --audit-level=high',
    otkriveno: '2026-04-10',
    cvssVector: 'AV:N/AC:H/PR:N/UI:N/S:C/C:H/I:H/A:N',
    cweId: 'CWE-829',
    nosioc: 'Security Tim',
    rokRemedijacije: '2026-07-01',
    prioritet: 1,
  },
  // ── Security Misconfiguration ──
  {
    id: 'p2-010',
    naziv: 'Nedostaje Content Security Policy na svim stranicama',
    opis: 'CSP header nije prisutan na svim Next.js stranicama, samo na API rutama',
    kategorija: 'security-misconfiguration',
    owaspRef: 'A05:2021 — Security Misconfiguration',
    attackVector: 'network',
    cvssScore: 4.7,
    severity: 'medium',
    status: 'open',
    remedijacija: 'Proširiti security-headers.ts da pokriva sve stranice kroz Next.js middleware',
    otkriveno: '2026-04-01',
    cvssVector: 'AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N',
    cweId: 'CWE-693',
    nosioc: 'Frontend Tim',
    rokRemedijacije: '2026-06-15',
    prioritet: 2,
  },
  {
    id: 'p2-011',
    naziv: 'Rate Limiting na svim API rutama',
    opis: 'checkRateLimitGlobal() implementiran na svim /api/* rutama — zaštita od DDoS',
    kategorija: 'security-misconfiguration',
    owaspRef: 'A05:2021 — Security Misconfiguration',
    attackVector: 'network',
    cvssScore: 0,
    severity: 'info',
    status: 'fixed',
    remedijacija: 'Kompletno implementirano — rate limiting aktivan',
    otkriveno: '2025-09-01',
    cvssVector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N',
    cweId: 'CWE-770',
    prioritet: 3,
  },
  {
    id: 'p2-012',
    naziv: 'HTTPS i HSTS aktivan',
    opis: 'Strict-Transport-Security header sa max-age=63072000 konfigurisan',
    kategorija: 'security-misconfiguration',
    owaspRef: 'A05:2021 — Security Misconfiguration',
    attackVector: 'network',
    cvssScore: 0,
    severity: 'info',
    status: 'fixed',
    remedijacija: 'Vercel edge mreža automatski forsira HTTPS',
    otkriveno: '2025-08-01',
    cvssVector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N',
    cweId: 'CWE-319',
    prioritet: 3,
  },
  // ── Sensitive Data Exposure ──
  {
    id: 'p2-013',
    naziv: 'API ključevi u env varijablama bez rotacije',
    opis: 'OpenAI i Stripe API ključevi se ne rotiraju redovno',
    kategorija: 'sensitive-data-exposure',
    owaspRef: 'A02:2021 — Cryptographic Failures',
    attackVector: 'local',
    cvssScore: 5.5,
    severity: 'medium',
    status: 'accepted',
    remedijacija: 'Ključevi u Vercel Env Secrets, rotacija kvartalno — prihvaćen operativni rizik',
    otkriveno: '2026-04-15',
    cvssVector: 'AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
    cweId: 'CWE-312',
    nosioc: 'DevOps Tim',
    prioritet: 2,
  },
  // ── Broken Access Control ──
  {
    id: 'p2-014',
    naziv: 'Nedostaje authorization na autofinish API rutama',
    opis: 'Autofinish endpointi (monitoring, status) dostupni bez autentifikacije',
    kategorija: 'broken-access-control',
    owaspRef: 'A01:2021 — Broken Access Control',
    attackVector: 'network',
    cvssScore: 3.7,
    severity: 'low',
    status: 'accepted',
    remedijacija: 'Monitoring rute su javne by design — informacije nisu senzitivne',
    otkriveno: '2026-05-01',
    cvssVector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N',
    cweId: 'CWE-862',
    prioritet: 3,
  },
  // ── Logging & Monitoring ──
  {
    id: 'p2-015',
    naziv: 'Audit log bez centralizovanog SIEM',
    opis: 'ΩAuditLogger beleži lokalno, ali nema centralizovano SIEM integrisanje',
    kategorija: 'logging-monitoring',
    owaspRef: 'A09:2021 — Security Logging and Monitoring Failures',
    attackVector: 'local',
    cvssScore: 3.1,
    severity: 'low',
    status: 'open',
    remedijacija: 'Integracija sa eksternim SIEM (Splunk/Datadog) planirana za Faza 7',
    otkriveno: '2026-05-15',
    cvssVector: 'AV:L/AC:L/PR:H/UI:N/S:U/C:L/I:N/A:N',
    cweId: 'CWE-778',
    nosioc: 'SecOps Tim',
    rokRemedijacije: '2026-12-01',
    prioritet: 2,
  },
  // ── CSRF ──
  {
    id: 'p2-016',
    naziv: 'CSRF zaštita na state-changing endpoint-ima',
    opis: 'Neki POST endpointi ne proveravaju SameSite cookie atribut ili CSRF token',
    kategorija: 'broken-access-control',
    owaspRef: 'A01:2021 — Broken Access Control',
    attackVector: 'network',
    cvssScore: 6.1,
    severity: 'medium',
    status: 'mitigated',
    remedijacija: 'SameSite=Strict na session cookie-ima, Origin header validacija na kritičnim POST rutama',
    otkriveno: '2026-04-20',
    cvssVector: 'AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:N',
    cweId: 'CWE-352',
    nosioc: 'Backend Tim',
    prioritet: 2,
  },
  // ── SSRF ──
  {
    id: 'p2-017',
    naziv: 'SSRF u proksi servis endpoint-ima',
    opis: 'Proksi endpointi prosleđuju URL-ove bez validacije — mogući interni mrežni pristup',
    kategorija: 'broken-access-control',
    owaspRef: 'A01:2021 — Broken Access Control',
    attackVector: 'network',
    cvssScore: 8.6,
    severity: 'high',
    status: 'open',
    remedijacija: 'Implementirati allowlist za dozvoljene domene, blokirati linkove na interno-mrežne opsege (169.254.x.x, 10.x.x.x)',
    otkriveno: '2026-05-20',
    cvssVector: 'AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:L/A:N',
    cweId: 'CWE-918',
    nosioc: 'Security Tim',
    rokRemedijacije: '2026-07-15',
    prioritet: 1,
  },
  // ── Race Condition ──
  {
    id: 'p2-018',
    naziv: 'Race condition u billing webhook procesoru',
    opis: 'Idempotency ključ nije implementiran — dupli Stripe webhook eventi mogu dovesti do duplog naplate',
    kategorija: 'insecure-deserialization',
    owaspRef: 'A08:2021 — Software and Data Integrity Failures',
    attackVector: 'network',
    cvssScore: 7.0,
    severity: 'high',
    status: 'open',
    remedijacija: 'Implementirati idempotency ključeve u Supabase, deduplicirati Stripe event ID-eve',
    otkriveno: '2026-05-25',
    cvssVector: 'AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:H/A:H',
    cweId: 'CWE-362',
    nosioc: 'Billing Tim',
    rokRemedijacije: '2026-07-01',
    prioritet: 1,
  },
  // ── Supply Chain ──
  {
    id: 'p2-019',
    naziv: 'GitHub Actions workflow injection u pull_request event-ima',
    opis: 'CI workflow koristi ${{ github.event.pull_request.title }} bez sanitizacije — injection mogućnost',
    kategorija: 'vulnerable-components',
    owaspRef: 'A06:2021 — Vulnerable and Outdated Components',
    attackVector: 'network',
    cvssScore: 8.3,
    severity: 'high',
    status: 'open',
    remedijacija: 'Koristiti environment variable intermediary: env: TITLE=${{ github.event.pull_request.title }} i $TITLE u run blokovima',
    otkriveno: '2026-05-28',
    cvssVector: 'AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:N',
    cweId: 'CWE-77',
    nosioc: 'DevOps Tim',
    rokRemedijacije: '2026-06-30',
    prioritet: 1,
  },
  {
    id: 'p2-020',
    naziv: 'Insecure Direct Object Reference na invoice endpoint-u',
    opis: 'GET /api/invoice?id=UUID ne proverava da li autentifikovani korisnik ima pristup tom invoice-u',
    kategorija: 'broken-access-control',
    owaspRef: 'A01:2021 — Broken Access Control',
    attackVector: 'network',
    cvssScore: 7.1,
    severity: 'high',
    status: 'mitigated',
    remedijacija: 'Dodat RLS policy u Supabase koji filtrira invoice po user_id, server-side ownership check',
    otkriveno: '2026-04-05',
    cvssVector: 'AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:L/A:N',
    cweId: 'CWE-639',
    potvrdio: 'Security Audit Team',
    nosioc: 'Backend Tim',
    prioritet: 1,
  },
];

// ─── Scan Session Store (in-memory ring-buffer) ───────────────────────────────

const MAX_HISTORY = 10;
const scanSessionHistory: PentestScanSession[] = [];

/** Generiše pseudo-UUID (bez crypto dependency) */
function generateScanId(): string {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 10);
  return `scan-${ts}-${rnd}`;
}

/**
 * Pokreće novu scan sesiju i dodaje je u ring-buffer istorije.
 */
export function startScanSession(triggeredBy = 'api'): PentestScanSession {
  const session: PentestScanSession = {
    scanId: generateScanId(),
    startedAt: new Date().toISOString(),
    status: 'running',
    triggeredBy,
  };

  scanSessionHistory.push(session);
  if (scanSessionHistory.length > MAX_HISTORY) {
    scanSessionHistory.shift();
  }
  return session;
}

/**
 * Označava scan sesiju kao završenu.
 * Vraća ažuriranu sesiju ili baca grešku ako scanId nije pronađen.
 */
export function completeScanSession(scanId: string): PentestScanSession {
  const session = scanSessionHistory.find((s) => s.scanId === scanId);
  if (!session) {
    throw new Error(`Scan sesija nije pronađena: ${scanId}`);
  }
  const completedAt = new Date().toISOString();
  const durationMs = Date.parse(completedAt) - Date.parse(session.startedAt);
  const overallScore = calculatePentestScoreV2(PENTEST_FINDINGS_V2);
  session.completedAt = completedAt;
  session.status = 'completed';
  session.durationMs = durationMs;
  session.overallScore = overallScore;
  session.ukupnoNalaza = PENTEST_FINDINGS_V2.length;
  return session;
}

/**
 * Vraća istoriju skenova (kompaktni sažetci, max MAX_HISTORY).
 */
export function getScanHistory(): PentestScanSummary[] {
  return [...scanSessionHistory]
    .reverse()
    .map(({ scanId, startedAt, completedAt, status, durationMs, overallScore, ukupnoNalaza }) => ({
      scanId,
      startedAt,
      completedAt,
      status,
      durationMs,
      overallScore,
      ukupnoNalaza,
    }));
}

// ─── Core Engine Funkcije ─────────────────────────────────────────────────────

/**
 * Izračunava pentest skor (0–100) na osnovu aktivnih nalaza.
 * Critical: -25, High: -15, Medium: -5, Low: -2 po nalasku.
 */
export function calculatePentestScoreV2(findings: PentestFindingV2[]): number {
  const active = findings.filter((f) => f.status !== 'fixed' && f.status !== 'wontfix');
  const critical = active.filter((f) => f.severity === 'critical').length;
  const high = active.filter((f) => f.severity === 'high').length;
  const medium = active.filter((f) => f.severity === 'medium').length;
  const low = active.filter((f) => f.severity === 'low').length;
  return Math.max(0, Math.min(100, Math.round(100 - (critical * 25 + high * 15 + medium * 5 + low * 2))));
}

/**
 * Vraća filtrirani niz V2 nalaza po severity, kategoriji i statusu.
 */
export function getPentestFindingsV2(filters: {
  severity?: string;
  kategorija?: string;
  status?: string;
} = {}): PentestFindingV2[] {
  let result = [...PENTEST_FINDINGS_V2];
  if (filters.severity) result = result.filter((f) => f.severity === filters.severity);
  if (filters.kategorija) result = result.filter((f) => f.kategorija === filters.kategorija);
  if (filters.status) result = result.filter((f) => f.status === filters.status);
  return result;
}

/**
 * Generiše kompletan V2 pentest izveštaj.
 */
export function buildPentestReportV2(scanId?: string): PentestReportV2 {
  const findings = [...PENTEST_FINDINGS_V2];
  const critical = findings.filter((f) => f.severity === 'critical').length;
  const high = findings.filter((f) => f.severity === 'high').length;
  const medium = findings.filter((f) => f.severity === 'medium').length;
  const low = findings.filter((f) => f.severity === 'low').length;
  const info = findings.filter((f) => f.severity === 'info').length;
  const openNalaza = findings.filter((f) => f.status === 'open').length;
  const fixedNalaza = findings.filter((f) => f.status === 'fixed').length;
  const overallScore = calculatePentestScoreV2(findings);
  const resolvedScanId = scanId ?? generateScanId();

  return {
    verzija: APP_VERSION,
    status: 'ok',
    scanId: resolvedScanId,
    overallScore,
    ukupnoNalaza: findings.length,
    critical,
    high,
    medium,
    low,
    info,
    openNalaza,
    fixedNalaza,
    durationMs: 42_000,
    findings,
    history: getScanHistory(),
    trendovi: getPentestTrend(5),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Vraća kompaktni V2 sažetak za dashboard widget.
 */
export function getPentestSummaryV2(): PentestSummaryV2 {
  const findings = [...PENTEST_FINDINGS_V2];
  const overallScore = calculatePentestScoreV2(findings);
  const critical = findings.filter((f) => f.severity === 'critical').length;
  const openNalaza = findings.filter((f) => f.status === 'open').length;
  const history = getScanHistory();
  const trendDelta =
    history.length >= 2
      ? (history[0].overallScore ?? overallScore) - (history[1].overallScore ?? overallScore)
      : 0;

  return {
    verzija: APP_VERSION,
    overallScore,
    ukupnoNalaza: findings.length,
    kritičnih: critical,
    openNalaza,
    trendDelta,
    lastScanId: history[0]?.scanId,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Vraća trend skora poslednjih N skenova iz istorije.
 * Delta je razlika od prethodnog skena (0 za prvi ili ako nema istorije).
 */
export function getPentestTrend(n: number): PentestTrend[] {
  const currentScore = calculatePentestScoreV2(PENTEST_FINDINGS_V2);
  const history = getScanHistory().slice(0, n);

  if (history.length === 0) {
    // Nema istorije — vrati sintetički trend jedne tačke
    return [
      {
        scanId: 'baseline',
        timestamp: new Date().toISOString(),
        overallScore: currentScore,
        delta: 0,
      },
    ];
  }

  return history.map((session, idx) => {
    const score = session.overallScore ?? currentScore;
    const prevScore = idx < history.length - 1 ? (history[idx + 1].overallScore ?? currentScore) : score;
    return {
      scanId: session.scanId,
      timestamp: session.startedAt,
      overallScore: score,
      delta: score - prevScore,
    };
  });
}
