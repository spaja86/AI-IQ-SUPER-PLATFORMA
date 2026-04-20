// SpajaUltraOmegaCore -∞Ω+∞ — Available Models API
// GET /api/spaja-pro/models — lista dostupnih modela za korisnikov plan

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { getModelsForPlan, AVAILABLE_MODELS } from '@/lib/openai/client';
import type { PlanTip } from '@/lib/supabase/types';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      // Za neprijavljene korisnike vrati sve modele sa info o planovima
      return NextResponse.json({
        models: AVAILABLE_MODELS.map((m) => ({ ...m, available: false })),
      });
    }

    const supabase = getSupabaseServerClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    const plan = (profile?.plan ?? 'starter') as PlanTip;
    const available = getModelsForPlan(plan);
    const availableIds = new Set(available.map((m) => m.id));

    return NextResponse.json({
      models: AVAILABLE_MODELS.map((m) => ({
        ...m,
        available: availableIds.has(m.id),
      })),
      currentPlan: plan,
    });
  } catch (error) {
    console.error('Models API error:', error);
    return NextResponse.json({ error: 'Greska servera.' }, { status: 500 });
  }
}
