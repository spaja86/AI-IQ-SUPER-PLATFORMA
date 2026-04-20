// SpajaUltraOmegaCore -∞Ω+∞ — User Settings API
// GET/PUT /api/spaja-pro/settings — custom instructions, model preferences, memory

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { getModelsForPlan } from '@/lib/openai/client';
import type { ModelId, PlanTip } from '@/lib/supabase/types';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, custom_instructions, preferred_model, preferred_language, memory')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profil nije pronadjen.' }, { status: 404 });
    }

    const availableModels = getModelsForPlan(profile.plan as PlanTip);

    return NextResponse.json({
      customInstructions: profile.custom_instructions ?? '',
      preferredModel: profile.preferred_model ?? 'gpt-4o-mini',
      preferredLanguage: profile.preferred_language ?? 'sr',
      memory: profile.memory ?? '',
      plan: profile.plan,
      availableModels,
    });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Greska servera.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = (await request.json()) as {
      customInstructions?: string;
      preferredModel?: ModelId;
      preferredLanguage?: string;
      memory?: string;
    };

    const supabase = getSupabaseServerClient();

    // Validacija duzine custom instructions
    if (body.customInstructions !== undefined && body.customInstructions.length > 2000) {
      return NextResponse.json({ error: 'Custom instrukcije su preduge (max 2000 karaktera).' }, { status: 400 });
    }

    // Validacija duzine memorije
    if (body.memory !== undefined && body.memory.length > 4000) {
      return NextResponse.json({ error: 'Memorija je preduga (max 4000 karaktera).' }, { status: 400 });
    }

    const updateData: {
      updated_at: string;
      custom_instructions?: string | null;
      preferred_model?: ModelId;
      preferred_language?: string;
      memory?: string | null;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (body.customInstructions !== undefined) {
      updateData.custom_instructions = body.customInstructions || null;
    }
    if (body.preferredModel !== undefined) {
      updateData.preferred_model = body.preferredModel;
    }
    if (body.preferredLanguage !== undefined) {
      updateData.preferred_language = body.preferredLanguage;
    }
    if (body.memory !== undefined) {
      updateData.memory = body.memory || null;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (error) {
      console.error('Settings update error:', error);
      return NextResponse.json({ error: 'Greska pri azuriranju podesavanja.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Greska servera.' }, { status: 500 });
  }
}
