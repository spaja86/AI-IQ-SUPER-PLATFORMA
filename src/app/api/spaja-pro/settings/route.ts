// SpajaUltraOmegaCore -∞Ω+∞ — User Settings API
// GET/PUT /api/spaja-pro/settings — custom instructions, model preferences, memory, personalization v2

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { getModelsForPlan } from '@/lib/openai/client';
import type { ModelId, PlanTip } from '@/lib/supabase/types';
import {
  applyStablePreferenceUpdate,
  buildExplainabilityPayload,
  type StablePreferences,
} from '@/lib/personalizacija/engine-v2';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, custom_instructions, preferred_model, preferred_language, memory, personalization_version, stable_preferences, contextual_preferences, personalization_confidence, personalization_updated_at, personalization_enabled, personalization_opt_out')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profil nije pronadjen.' }, { status: 404 });
    }

    const availableModels = getModelsForPlan(profile.plan as PlanTip);

    const explainability = buildExplainabilityPayload(user.id, {
      custom_instructions: profile.custom_instructions,
      memory: profile.memory,
      preferred_model: profile.preferred_model,
      preferred_language: profile.preferred_language ?? null,
      personalization_version: profile.personalization_version ?? 'v1',
      stable_preferences: profile.stable_preferences as Record<string, unknown> | null,
      contextual_preferences: profile.contextual_preferences as Record<string, unknown> | null,
      personalization_confidence: profile.personalization_confidence ?? 0,
      personalization_updated_at: profile.personalization_updated_at ?? null,
      personalization_enabled: profile.personalization_enabled ?? true,
      personalization_opt_out: profile.personalization_opt_out ?? false,
    });

    return NextResponse.json({
      customInstructions: profile.custom_instructions ?? '',
      preferredModel: profile.preferred_model ?? 'gpt-4o-mini',
      preferredLanguage: profile.preferred_language ?? 'sr',
      memory: profile.memory ?? '',
      plan: profile.plan,
      availableModels,
      personalizacijaV2: {
        verzija: profile.personalization_version ?? 'v1',
        enabled: profile.personalization_enabled ?? true,
        optOut: profile.personalization_opt_out ?? false,
        konfidens: profile.personalization_confidence ?? 0,
        azurirano: profile.personalization_updated_at ?? null,
        stablePreferences: profile.stable_preferences ?? null,
        contextualPreferences: profile.contextual_preferences ?? null,
        explainability,
      },
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
      // v2 personalization fields
      personalizationEnabled?: boolean;
      personalizationOptOut?: boolean;
      personalizationVersion?: 'v1' | 'v2';
      stablePreferences?: Partial<StablePreferences>;
      resetPersonalization?: boolean;
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
      personalization_enabled?: boolean;
      personalization_opt_out?: boolean;
      personalization_version?: string;
      stable_preferences?: Record<string, unknown> | null;
      contextual_preferences?: Record<string, unknown> | null;
      personalization_confidence?: number;
      personalization_updated_at?: string | null;
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

    // ── v2 personalization fields ────────────────────────────────────
    if (body.resetPersonalization === true) {
      updateData.stable_preferences = null;
      updateData.contextual_preferences = null;
      updateData.personalization_confidence = 0;
      updateData.personalization_updated_at = null;
      updateData.personalization_version = 'v1';
    } else {
      if (body.personalizationEnabled !== undefined) {
        updateData.personalization_enabled = body.personalizationEnabled;
      }
      if (body.personalizationOptOut !== undefined) {
        updateData.personalization_opt_out = body.personalizationOptOut;
      }
      if (body.personalizationVersion !== undefined) {
        updateData.personalization_version = body.personalizationVersion;
      }
      if (body.stablePreferences !== undefined) {
        // Merge with existing stable preferences — fetch current first
        const { data: current } = await supabase
          .from('profiles')
          .select('stable_preferences')
          .eq('id', user.id)
          .single();
        const merged = applyStablePreferenceUpdate(
          current?.stable_preferences as Record<string, unknown> | null,
          body.stablePreferences,
        );
        updateData.stable_preferences = merged;
        updateData.personalization_updated_at = new Date().toISOString();
      }
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

