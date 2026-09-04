/**
 * 🔬 ExtremaAPI — Report endpoint
 *
 * GET /api/diagnostics/extrema/report
 *
 * Vraća poslednji audit log i statistike.
 * Interno korišćenje — nije javno izloženo.
 *
 * AI IQ SUPER PLATFORMA — Kompanija SPAJA
 */

import { NextResponse } from 'next/server';
import { getAuditLog } from '@/lib/diagnostics/extrema-reporter';
import { getExtremaCatalogStats } from '@/lib/diagnostics/extrema-catalog';

export const dynamic = 'force-dynamic';

/**
 * GET /api/diagnostics/extrema/report
 *
 * Query params:
 * - limit: max broj audit log unosa (default: 100)
 * - severity: filter po severity (CRITICAL|WARNING|INFO)
 * - module: filter po modulu
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = parseInt(searchParams.get('limit') ?? '100', 10);
  const limit = Math.min(isNaN(parsed) ? 100 : parsed, 500);
  const severityFilter = searchParams.get('severity');
  const moduleFilter = searchParams.get('module');

  let log = getAuditLog();

  if (severityFilter) {
    log = log.filter((e) => e.level === severityFilter.toUpperCase());
  }

  if (moduleFilter) {
    log = log.filter((e) => e.module === moduleFilter);
  }

  // Poslednji N unosa (reverse chronological)
  const entries = log.slice(-limit).reverse();

  const stats = getExtremaCatalogStats();

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    totalEntries: log.length,
    showing: entries.length,
    catalogStats: stats,
    entries,
  });
}
