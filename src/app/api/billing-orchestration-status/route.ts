// SpajaUltraOmegaCore -∞Ω+∞ — Billing Orchestration Status
// Kompanija SPAJA — Digitalna Industrija
// GET /api/billing-orchestration-status

import { NextResponse } from 'next/server';
import { getOrchestrationStatus } from '@/lib/billing/orchestration';
import { getEngineMatrix } from '@/lib/billing/events';
import { ENTITLEMENT_MAP, getEntitlementSummary } from '@/lib/billing/entitlement';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import type { PlanTip } from '@/lib/supabase/types';

export async function GET() {
  const status = getOrchestrationStatus();
  const matrix = getEngineMatrix();
  const entitlements = (Object.keys(ENTITLEMENT_MAP) as PlanTip[]).map((plan) => getEntitlementSummary(plan));

  return NextResponse.json({
    sistem: 'Billing Orchestration Status — SPAJA',
    verzija: APP_VERSION,
    autofinish: AUTOFINISH_COUNT,
    orchestration: status,
    engineMatrix: matrix,
    entitlements,
    ukupnoEndžina: matrix.length,
    ukupnoPlanova: entitlements.length,
    timestamp: new Date().toISOString(),
  });
}
