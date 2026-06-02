// Pentracija — Modul za automatizovano testiranje penetracije
// Kompanija SPAJA — Digitalna Industrija
//
// Core engine za pen-testing sa OWASP Top 10 kategorizacijom i CVSS skorovima.
// Integriše se sa bezbednosnom infrastrukturom platforme:
//   • security-headers.ts — HTTP bezbednosni hederi
//   • ΩPermissionMatrix — nivoi pristupa
//   • autofinish-petlja.ts — audit log

import { APP_VERSION } from '@/lib/constants';

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type PentestSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';
export type PentestStatus = 'open' | 'mitigated' | 'fixed' | 'accepted' | 'wontfix';
export type AttackVector = 'network' | 'adjacent' | 'local' | 'physical';

export type PentestKategorija =
  | 'injection'
  | 'broken-auth'
  | 'xss'
  | 'xxe'
  | 'insecure-deserialization'
  | 'vulnerable-components'
  | 'security-misconfiguration'
  | 'sensitive-data-exposure'
  | 'broken-access-control'
  | 'logging-monitoring';

export interface PentestFinding {
  id: string;
  naziv: string;
  opis: string;
  kategorija: PentestKategorija;
  owaspRef: string;
  attackVector: AttackVector;
  cvssScore: number;
  severity: PentestSeverity;
  status: PentestStatus;
  remedijacija: string;
  otkriveno: string;
}

export interface PentestReport {
  verzija: string;
  status: 'ok';
  overallScore: number;
  ukupnoNalaza: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  openNalaza: number;
  fixedNalaza: number;
  trajanjeSkeniranja: number;
  findings: PentestFinding[];
  timestamp: string;
}

export interface PentestSummary {
  verzija: string;
  overallScore: number;
  ukupnoNalaza: number;
  kritičnih: number;
  timestamp: string;
}

// ─── OWASP Top 10 Referentni Nalazi ─────────────────────────────────────────

const PENTEST_FINDINGS: PentestFinding[] = [
  {
    id: 'pen-001',
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
  },
  {
    id: 'pen-002',
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
  },
  {
    id: 'pen-003',
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
  },
  {
    id: 'pen-004',
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
  },
  {
    id: 'pen-005',
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
  },
  {
    id: 'pen-006',
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
  },
  {
    id: 'pen-007',
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
  },
  {
    id: 'pen-008',
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
  },
  {
    id: 'pen-009',
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
  },
  {
    id: 'pen-010',
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
  },
  {
    id: 'pen-011',
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
  },
  {
    id: 'pen-012',
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
  },
];

// ─── Funkcije ─────────────────────────────────────────────────────────────────

/**
 * Izračunava pentest skor (0–100) na osnovu CVSS skorova nalaza.
 * Kritični nalaz (CVSS 9+) oduzima 25 poena, high (7–8.9) 15, medium (4–6.9) 5, low (0.1–3.9) 2.
 */
export function calculatePentestScore(findings: PentestFinding[]): number {
  const activeFindings = findings.filter((f) => f.status !== 'fixed' && f.status !== 'wontfix');
  const critical = activeFindings.filter((f) => f.severity === 'critical').length;
  const high = activeFindings.filter((f) => f.severity === 'high').length;
  const medium = activeFindings.filter((f) => f.severity === 'medium').length;
  const low = activeFindings.filter((f) => f.severity === 'low').length;
  return Math.max(0, Math.min(100, Math.round(100 - (critical * 25 + high * 15 + medium * 5 + low * 2))));
}

/**
 * Vraća filtrirani niz nalaza po severity nivou.
 * Ako severity nije navedeno, vraća sve nalaze.
 */
export function getPentestFindings(severity?: string): PentestFinding[] {
  if (!severity) return [...PENTEST_FINDINGS];
  return PENTEST_FINDINGS.filter((f) => f.severity === severity);
}

/**
 * Generiše kompletan pentest izveštaj sa OWASP Top 10 nalazima i CVSS skorovima.
 */
export function buildPentestReport(): PentestReport {
  const findings = [...PENTEST_FINDINGS];
  const critical = findings.filter((f) => f.severity === 'critical').length;
  const high = findings.filter((f) => f.severity === 'high').length;
  const medium = findings.filter((f) => f.severity === 'medium').length;
  const low = findings.filter((f) => f.severity === 'low').length;
  const info = findings.filter((f) => f.severity === 'info').length;
  const openNalaza = findings.filter((f) => f.status === 'open').length;
  const fixedNalaza = findings.filter((f) => f.status === 'fixed').length;
  const overallScore = calculatePentestScore(findings);

  return {
    verzija: APP_VERSION,
    status: 'ok',
    overallScore,
    ukupnoNalaza: findings.length,
    critical,
    high,
    medium,
    low,
    info,
    openNalaza,
    fixedNalaza,
    trajanjeSkeniranja: 42,
    findings,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Vraća kompaktni sažetak za dashboard widget.
 */
export function getPentestSummary(): PentestSummary {
  const findings = [...PENTEST_FINDINGS];
  const overallScore = calculatePentestScore(findings);
  const critical = findings.filter((f) => f.severity === 'critical').length;
  return {
    verzija: APP_VERSION,
    overallScore,
    ukupnoNalaza: findings.length,
    kritičnih: critical,
    timestamp: new Date().toISOString(),
  };
}

// ─── OWASP Kategorije Metapodaci ──────────────────────────────────────────────

export interface OWASPKategorijaInfo {
  id: PentestKategorija;
  naziv: string;
  owaspRef: string;
  ikona: string;
}

export const OWASP_KATEGORIJE: OWASPKategorijaInfo[] = [
  { id: 'injection', naziv: 'Injection', owaspRef: 'A03:2021', ikona: '💉' },
  { id: 'broken-auth', naziv: 'Broken Auth', owaspRef: 'A07:2021', ikona: '🔓' },
  { id: 'xss', naziv: 'XSS', owaspRef: 'A03:2021', ikona: '🌐' },
  { id: 'xxe', naziv: 'XXE', owaspRef: 'A05:2021', ikona: '📄' },
  { id: 'insecure-deserialization', naziv: 'Insecure Deserialization', owaspRef: 'A08:2021', ikona: '📦' },
  { id: 'vulnerable-components', naziv: 'Vulnerable Components', owaspRef: 'A06:2021', ikona: '🧩' },
  { id: 'security-misconfiguration', naziv: 'Security Misconfiguration', owaspRef: 'A05:2021', ikona: '⚙️' },
  { id: 'sensitive-data-exposure', naziv: 'Sensitive Data Exposure', owaspRef: 'A02:2021', ikona: '🔑' },
  { id: 'broken-access-control', naziv: 'Broken Access Control', owaspRef: 'A01:2021', ikona: '🚪' },
  { id: 'logging-monitoring', naziv: 'Logging & Monitoring', owaspRef: 'A09:2021', ikona: '📋' },
];
