/**
 * 🔬 ExtremaAPI — Dijagnostika Ekstrimiteta Ekstrema
 *
 * POST /api/diagnostics/extrema  — pokreni dijagnostiku na zahtev
 * GET  /api/diagnostics/extrema/report — posled izveštaj (audit log)
 *
 * Interno korišćenje — nije javno izloženo.
 *
 * AI IQ SUPER PLATFORMA — Kompanija SPAJA
 */

import { NextResponse } from 'next/server';
import { runExtremaDiagnostics, runFullDiagnostics, generateReport } from '@/lib/diagnostics/extrema-engine';
import { reportExtrema } from '@/lib/diagnostics/extrema-reporter';
import { type ExtremaModule } from '@/lib/diagnostics/extrema-catalog';

export const dynamic = 'force-dynamic';

const VALID_MODULES: ExtremaModule[] = [
  'gigatron',
  'nova-generacija',
  'calculator',
  'ci-cd',
  'network',
];

/**
 * POST /api/diagnostics/extrema
 *
 * Body:
 * {
 *   module?: ExtremaModule | "all",
 *   inputs: Record<string, unknown>  // za single module
 *   inputsByModule?: Partial<Record<ExtremaModule, Record<string, unknown>>>  // za all
 * }
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Body mora biti objekat' }, { status: 400 });
  }

  const { module, inputs, inputsByModule } = body as {
    module?: string;
    inputs?: Record<string, unknown>;
    inputsByModule?: Partial<Record<ExtremaModule, Record<string, unknown>>>;
  };

  // Full scan svih modula
  if (!module || module === 'all') {
    const moduleInputs = inputsByModule ?? {};
    const report = runFullDiagnostics(moduleInputs);
    reportExtrema(report, { consoleOutput: false });
    return NextResponse.json(report);
  }

  // Single modul
  if (!VALID_MODULES.includes(module as ExtremaModule)) {
    return NextResponse.json(
      { error: `Nepoznat modul: ${module}. Validni: ${VALID_MODULES.join(', ')}` },
      { status: 400 },
    );
  }

  if (!inputs || typeof inputs !== 'object') {
    return NextResponse.json(
      { error: 'inputs polje je obavezno za single-module dijagnostiku' },
      { status: 400 },
    );
  }

  const findings = runExtremaDiagnostics(module as ExtremaModule, inputs);
  const report = generateReport(findings, module as ExtremaModule);
  reportExtrema(report, { consoleOutput: false });

  return NextResponse.json(report);
}
