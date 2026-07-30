/**
 * 📈 DEPON-12 — Reporting & Exports
 *
 * CSV, PDF, and BI tool exports with scheduled reporting,
 * state-level data aggregation, and compliance reports.
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';

export const DEPON_ID: DeponId = 'DEPON-12';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ReportFormat = 'csv' | 'pdf' | 'xlsx' | 'json' | 'parquet';

export type ReportType =
  | 'user-summary'
  | 'state-analytics'
  | 'payment-reconciliation'
  | 'compliance-audit'
  | 'usage-forecast'
  | 'security-incidents'
  | 'executive-summary';

export type ReportSchedule = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'on-demand';

export type ReportStatus = 'queued' | 'generating' | 'ready' | 'failed' | 'expired';

export type ReportJob = {
  jobId: string;
  type: ReportType;
  format: ReportFormat;
  stateCode: string | null;
  requestedBy: string;
  schedule: ReportSchedule;
  status: ReportStatus;
  dateRangeStart: Date;
  dateRangeEnd: Date;
  fileSize: number | null;
  downloadUrl: string | null;
  expiresAt: Date | null;
  createdAt: Date;
  completedAt: Date | null;
};

export type ReportColumn = {
  key: string;
  header: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  format?: string;
};

export type ReportSchema = {
  type: ReportType;
  columns: ReportColumn[];
  defaultFormat: ReportFormat;
  maxRowsPerExport: number;
};

// ─── Report Schemas ───────────────────────────────────────────────────────────

export const REPORT_SCHEMAS: Record<ReportType, ReportSchema> = {
  'user-summary': {
    type: 'user-summary',
    defaultFormat: 'csv',
    maxRowsPerExport: 1_000_000,
    columns: [
      { key: 'userId', header: 'User ID', type: 'string' },
      { key: 'stateCode', header: 'State', type: 'string' },
      { key: 'tier', header: 'Tier', type: 'string' },
      { key: 'createdAt', header: 'Created At', type: 'date', format: 'YYYY-MM-DD' },
      { key: 'lastLoginAt', header: 'Last Login', type: 'date', format: 'YYYY-MM-DD' },
      { key: 'totalSpendUsd', header: 'Total Spend (USD)', type: 'number' },
    ],
  },
  'state-analytics': {
    type: 'state-analytics',
    defaultFormat: 'xlsx',
    maxRowsPerExport: 500_000,
    columns: [
      { key: 'stateCode', header: 'State', type: 'string' },
      { key: 'date', header: 'Date', type: 'date', format: 'YYYY-MM-DD' },
      { key: 'activeUsers', header: 'Active Users', type: 'number' },
      { key: 'newUsers', header: 'New Users', type: 'number' },
      { key: 'totalEvents', header: 'Total Events', type: 'number' },
      { key: 'revenueUsd', header: 'Revenue (USD)', type: 'number' },
    ],
  },
  'payment-reconciliation': {
    type: 'payment-reconciliation',
    defaultFormat: 'csv',
    maxRowsPerExport: 500_000,
    columns: [
      { key: 'paymentId', header: 'Payment ID', type: 'string' },
      { key: 'userId', header: 'User ID', type: 'string' },
      { key: 'stateCode', header: 'State', type: 'string' },
      { key: 'amount', header: 'Amount', type: 'number' },
      { key: 'taxAmount', header: 'Tax', type: 'number' },
      { key: 'status', header: 'Status', type: 'string' },
      { key: 'createdAt', header: 'Date', type: 'date', format: 'YYYY-MM-DD HH:mm:ss' },
    ],
  },
  'compliance-audit': {
    type: 'compliance-audit',
    defaultFormat: 'pdf',
    maxRowsPerExport: 100_000,
    columns: [
      { key: 'auditId', header: 'Audit ID', type: 'string' },
      { key: 'action', header: 'Action', type: 'string' },
      { key: 'actorId', header: 'Actor', type: 'string' },
      { key: 'stateCode', header: 'State', type: 'string' },
      { key: 'laws', header: 'Laws', type: 'string' },
      { key: 'timestamp', header: 'Timestamp', type: 'date', format: 'YYYY-MM-DD HH:mm:ss' },
    ],
  },
  'usage-forecast': {
    type: 'usage-forecast',
    defaultFormat: 'json',
    maxRowsPerExport: 10_000,
    columns: [
      { key: 'stateCode', header: 'State', type: 'string' },
      { key: 'forecastDate', header: 'Forecast Date', type: 'date', format: 'YYYY-MM-DD' },
      { key: 'predictedUsers', header: 'Predicted Users', type: 'number' },
      { key: 'confidenceInterval', header: 'Confidence %', type: 'number' },
    ],
  },
  'security-incidents': {
    type: 'security-incidents',
    defaultFormat: 'pdf',
    maxRowsPerExport: 10_000,
    columns: [
      { key: 'incidentId', header: 'Incident ID', type: 'string' },
      { key: 'severity', header: 'Severity', type: 'string' },
      { key: 'stateCode', header: 'State', type: 'string' },
      { key: 'description', header: 'Description', type: 'string' },
      { key: 'resolvedAt', header: 'Resolved At', type: 'date', format: 'YYYY-MM-DD HH:mm:ss' },
    ],
  },
  'executive-summary': {
    type: 'executive-summary',
    defaultFormat: 'pdf',
    maxRowsPerExport: 1_000,
    columns: [
      { key: 'metric', header: 'Metric', type: 'string' },
      { key: 'value', header: 'Value', type: 'string' },
      { key: 'change', header: 'Change %', type: 'number' },
      { key: 'period', header: 'Period', type: 'string' },
    ],
  },
};

// ─── Service Functions ────────────────────────────────────────────────────────

export function buildReportJob(params: {
  type: ReportType;
  requestedBy: string;
  dateRangeStart: Date;
  dateRangeEnd: Date;
  stateCode?: string;
  format?: ReportFormat;
  schedule?: ReportSchedule;
}): ReportJob {
  const schema = REPORT_SCHEMAS[params.type];
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  return {
    jobId: `rpt_${params.type}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    type: params.type,
    format: params.format ?? schema.defaultFormat,
    stateCode: params.stateCode ?? null,
    requestedBy: params.requestedBy,
    schedule: params.schedule ?? 'on-demand',
    status: 'queued',
    dateRangeStart: params.dateRangeStart,
    dateRangeEnd: params.dateRangeEnd,
    fileSize: null,
    downloadUrl: null,
    expiresAt,
    createdAt: new Date(),
    completedAt: null,
  };
}

export function getReportSchema(type: ReportType): ReportSchema {
  return REPORT_SCHEMAS[type];
}

export function validateDateRange(start: Date, end: Date): { valid: boolean; error?: string } {
  if (start >= end) return { valid: false, error: 'dateRangeStart must be before dateRangeEnd' };
  const maxRangeDays = 366;
  const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays > maxRangeDays) {
    return { valid: false, error: `Date range cannot exceed ${maxRangeDays} days` };
  }
  return { valid: true };
}

export function getHealthStatus(): {
  depon: string;
  status: 'ok';
  version: string;
  reportTypes: number;
} {
  return { depon: DEPON_ID, status: 'ok', version: '1.0.0', reportTypes: Object.keys(REPORT_SCHEMAS).length };
}
