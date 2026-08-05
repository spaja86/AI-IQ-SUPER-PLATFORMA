/**
 * 🔬 ExtremaReporter — Dijagnostika Ekstrimiteta Ekstrema
 *
 * Loguje nalaze u console + strukturirani audit log.
 * Podržava GitHub Issue auto-create za CRITICAL nalaze i PR komentare.
 *
 * AI IQ SUPER PLATFORMA — Kompanija SPAJA
 */

import { type ExtremaFinding, type ExtremaReport } from './extrema-engine';
import { type ExtremaSeverity } from './extrema-catalog';

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export interface AuditLogEntry {
  timestamp: string;
  level: ExtremaSeverity | 'INFO';
  module: string;
  findingId: string;
  condition: string;
  remediation: string;
  value: unknown;
}

export interface ReporterOptions {
  /** Da li loguje u konzolu */
  consoleOutput?: boolean;
  /** Callback za emitovanje audit log unosa (za custom storage) */
  onAuditEntry?: (entry: AuditLogEntry) => void;
}

// ─── In-memory audit log (server-side singleton) ──────────────────────────────

const _auditLog: AuditLogEntry[] = [];

export function getAuditLog(): AuditLogEntry[] {
  return [..._auditLog];
}

export function clearAuditLog(): void {
  _auditLog.length = 0;
}

// ─── Simboli za konzolni prikaz ───────────────────────────────────────────────

const SEVERITY_ICON: Record<ExtremaSeverity, string> = {
  CRITICAL: '🔴',
  WARNING: '🟡',
  INFO: '🔵',
};

// ─── Reporting funkcije ───────────────────────────────────────────────────────

/**
 * Loguje jedan finding u konzolu i audit log.
 */
export function reportFinding(
  finding: ExtremaFinding,
  options: ReporterOptions = {},
): AuditLogEntry {
  const { consoleOutput = true, onAuditEntry } = options;
  const icon = SEVERITY_ICON[finding.severity] ?? '⚪';

  const entry: AuditLogEntry = {
    timestamp: finding.detectedAt,
    level: finding.severity,
    module: finding.module,
    findingId: finding.catalogEntry.id,
    condition: finding.catalogEntry.condition,
    remediation: finding.catalogEntry.remediation,
    value: finding.value,
  };

  _auditLog.push(entry);

  if (consoleOutput) {
    console.log(
      `${icon} [EXTREMA][${finding.severity}][${finding.module.toUpperCase()}] ` +
        `${finding.catalogEntry.id}: ${finding.catalogEntry.condition}`,
    );
    console.log(`   ↳ Remediation: ${finding.catalogEntry.remediation}`);
  }

  if (onAuditEntry) {
    onAuditEntry(entry);
  }

  return entry;
}

/**
 * Loguje kompletan izveštaj u konzolu i audit log.
 */
export function reportExtrema(
  report: ExtremaReport,
  options: ReporterOptions = {},
): AuditLogEntry[] {
  const { consoleOutput = true } = options;
  const entries: AuditLogEntry[] = [];

  if (consoleOutput) {
    const statusIcon =
      report.status === 'CRITICAL' ? '🔴' : report.status === 'DEGRADED' ? '🟡' : '✅';
    console.log(
      `\n${statusIcon} [EXTREMA REPORT] Module: ${report.module} | Status: ${report.status}`,
    );
    console.log(
      `   Findings: ${report.totalFindings} total | ` +
        `${report.criticalCount} critical | ${report.warningCount} warning | ${report.infoCount} info`,
    );
    console.log(`   Generated: ${report.generatedAt}\n`);
  }

  for (const finding of report.findings) {
    const entry = reportFinding(finding, options);
    entries.push(entry);
  }

  return entries;
}

/**
 * Formatira izveštaj kao GitHub Markdown komentar (za PR komentare).
 */
export function formatReportAsMarkdown(report: ExtremaReport): string {
  const statusIcon =
    report.status === 'CRITICAL' ? '🔴' : report.status === 'DEGRADED' ? '🟡' : '✅';

  const lines: string[] = [
    `## ${statusIcon} Dijagnostika Ekstrimiteta Ekstrema`,
    '',
    `**Modul:** \`${report.module}\` | **Status:** \`${report.status}\` | **Generisano:** ${report.generatedAt}`,
    '',
    `| Metrika | Vrednost |`,
    `|---------|----------|`,
    `| Ukupno nalaza | ${report.totalFindings} |`,
    `| 🔴 CRITICAL | ${report.criticalCount} |`,
    `| 🟡 WARNING | ${report.warningCount} |`,
    `| 🔵 INFO | ${report.infoCount} |`,
    '',
  ];

  if (report.findings.length > 0) {
    lines.push('### Detalji nalaza', '');
    lines.push('| ID | Modul | Severity | Uslov | Remedijacija |');
    lines.push('|----|-------|----------|-------|--------------|');
    for (const f of report.findings) {
      const icon = SEVERITY_ICON[f.severity] ?? '';
      lines.push(
        `| \`${f.catalogEntry.id}\` | ${f.module} | ${icon} ${f.severity} | ${f.catalogEntry.condition} | ${f.catalogEntry.remediation} |`,
      );
    }
    lines.push('');
  } else {
    lines.push('✅ Nema detektovanih ekstrema.', '');
  }

  lines.push(
    '---',
    '*Automatski generisano od strane Dijagnostika Ekstrimiteta Ekstrema sistema — AI IQ SUPER PLATFORMA*',
  );

  return lines.join('\n');
}

/**
 * Priprema payload za GitHub Issue kreiranje (za CRITICAL nalaze).
 * Vraća strukturirani objekat koji caller može koristiti sa GitHub API.
 */
export function buildGitHubIssuePayload(findings: ExtremaFinding[]): {
  title: string;
  body: string;
  labels: string[];
} | null {
  const criticalFindings = findings.filter((f) => f.severity === 'CRITICAL');
  if (criticalFindings.length === 0) return null;

  const modules = [...new Set(criticalFindings.map((f) => f.module))];
  const title = `🔴 CRITICAL Extrema: ${criticalFindings.length} nalaza u [${modules.join(', ')}]`;

  const bodyLines = [
    '## 🔬 Dijagnostika Ekstrimiteta Ekstrema — CRITICAL Nalaz',
    '',
    `**Detektovano:** ${new Date().toISOString()}`,
    `**CRITICAL nalaza:** ${criticalFindings.length}`,
    '',
    '| ID | Modul | Uslov | Remedijacija |',
    '|----|-------|-------|--------------|',
  ];

  for (const f of criticalFindings) {
    bodyLines.push(
      `| \`${f.catalogEntry.id}\` | ${f.module} | ${f.catalogEntry.condition} | ${f.catalogEntry.remediation} |`,
    );
  }

  bodyLines.push(
    '',
    '---',
    '*Auto-kreirano od strane ExtremaReporter — AI IQ SUPER PLATFORMA*',
  );

  return {
    title,
    body: bodyLines.join('\n'),
    labels: ['extrema:critical', 'security:review-needed', 'agent:auto-generated'],
  };
}
