// SpajaUltraOmegaCore -∞Ω+∞ — Billing Engine Matrix
// Kompanija SPAJA — Digitalna Industrija
// GET /api/billing-engine-matrix — matrica: događaj → endžin → polje

import { NextResponse } from 'next/server';
import { ENGINE_EVENT_MATRIX, getEngineMatrix } from '@/lib/billing/events';
import { ENTITLEMENT_MAP } from '@/lib/billing/entitlement';
import { APP_VERSION } from '@/lib/constants';
import type { PlanTip } from '@/lib/supabase/types';

export async function GET() {
  const matrix = getEngineMatrix();

  // Napravi mapu: event_type → spisak endžina koji reaguju
  const eventToEngines: Record<string, string[]> = {};
  for (const [engineId, eventTypes] of Object.entries(ENGINE_EVENT_MATRIX)) {
    for (const et of eventTypes) {
      if (!eventToEngines[et]) eventToEngines[et] = [];
      eventToEngines[et].push(engineId);
    }
  }

  // Plan → pristupačni endžini
  const planToEngines: Record<string, string[]> = {};
  for (const [plan, ent] of Object.entries(ENTITLEMENT_MAP) as [PlanTip, (typeof ENTITLEMENT_MAP)[PlanTip]][]) {
    planToEngines[plan] = ent.endzini.filter((e) => e.dostupno).map((e) => e.engineId);
  }

  return NextResponse.json({
    sistem: 'Billing Engine Matrix — SPAJA',
    verzija: APP_VERSION,
    engineMatrix: matrix,
    eventToEngines,
    planToEngines,
    ukupnoEndžina: matrix.length,
    ukupnoEventTipova: Object.keys(eventToEngines).length,
    timestamp: new Date().toISOString(),
  });
}
