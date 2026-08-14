// SpajaUltraOmegaCore -∞Ω+∞ — Persona Bank Health Endpoint
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/persona-bank/health
// Returns comprehensive health and coverage report for the Persona Bank.

import type { NextRequest } from 'next/server';
import { apiSuccess, apiInternalError } from '@/lib/api/response';
import {
  getPersonaBankStats,
  listPersonas,
  autoArchiveStalePersonas,
  PERSONA_BANK_CONTRACT_VERSION,
} from '@/lib/persona-bank';

export const dynamic = 'force-dynamic';

/**
 * GET /api/persona-bank/health
 *
 * Returns:
 * - overall health status (healthy/degraded/unavailable)
 * - total, active, dormant, archived persona counts
 * - octave coverage (1–16)
 * - hipermreza node coverage (1–256)
 * - stale persona count
 * - personas with missing attributes
 * - auto-archiving summary (if ?archive=true)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const runArchive = searchParams.get('archive') === 'true';

    // Auto-archiving is a state-mutating action — require admin token to prevent
    // unauthorized archiving via this public health endpoint.
    if (runArchive) {
      const authHeader = req.headers.get('authorization');
      const adminToken = process.env.ADMIN_API_TOKEN;
      const expectedHeader = 'Bearer ' + (adminToken ?? '');
      if (!adminToken || authHeader !== expectedHeader) {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Optionally run auto-archiving
    let archiveSummary: { archived: number } | undefined;
    if (runArchive) {
      const archived = autoArchiveStalePersonas('persona-bank-health-agent');
      archiveSummary = { archived };
    }

    const stats = getPersonaBankStats();
    const allPersonas = listPersonas();

    // Octave coverage: which octaves (1–16) have at least one active persona
    const octaveCoverage = Array.from(
      new Set(allPersonas.filter(p => p.status === 'active').map(p => p.octave))
    ).sort((a, b) => a - b);

    // Node coverage: hipermreza nodes with at least one active persona
    const nodeCoverage = Array.from(
      new Set(allPersonas.filter(p => p.status === 'active').map(p => p.hipermrezaNode))
    ).sort((a, b) => a - b);

    // Personas with missing required attributes — computed in a single pass
    const missingAttributePersonas = allPersonas
      .filter(p => p.status === 'active')
      .reduce<Array<{ id: string; name: string; missing: string[] }>>((acc, p) => {
        const missing: string[] = [];
        if (!p.attributes.traits?.length) missing.push('traits');
        if (!p.attributes.skills?.length) missing.push('skills');
        if (!p.attributes.domain) missing.push('domain');
        if (missing.length > 0) acc.push({ id: p.id, name: p.name, missing });
        return acc;
      }, []);

    // Overall health determination
    const octavesCovered = octaveCoverage.length;
    const overall =
      stats.total === 0
        ? 'unavailable'
        : octavesCovered >= 12
          ? 'healthy'
          : octavesCovered >= 6
            ? 'degraded'
            : 'unavailable';

    const healthReport = {
      overall,
      contractVersion: PERSONA_BANK_CONTRACT_VERSION,
      stats: {
        total: stats.total,
        active: stats.byStatus.active ?? 0,
        dormant: stats.byStatus.dormant ?? 0,
        archived: stats.byStatus.archived ?? 0,
        stale: stats.staleCount,
      },
      coverage: {
        octavesActive: octavesCovered,
        octavesTotal: 16,
        octaveCoverage,
        nodesActive: nodeCoverage.length,
        nodesTotal: 256,
        nodeCoverage,
      },
      missingAttributePersonas,
      ...(archiveSummary ? { archiveSummary } : {}),
      timestamp: new Date().toISOString(),
    };

    const response = apiSuccess(healthReport, 200);
    response.headers.set('X-PersonaBank-Contract-Version', PERSONA_BANK_CONTRACT_VERSION);
    response.headers.set('X-PersonaBank-Health', overall);
    return response;
  } catch (error) {
    return apiInternalError('persona-bank-health', error);
  }
}
