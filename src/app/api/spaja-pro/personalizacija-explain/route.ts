// SpajaUltraOmegaCore -∞Ω+∞ — Personalization Explainability API
// GET /api/spaja-pro/personalizacija-explain
// Vraća razlog personalizacije za poslednji odgovor korisnika (PERTENIZACIJA 2/3).

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { buildExplainabilityPayload } from '@/lib/personalizacija/engine-v2';
import { buildExplainabilityPayloadV3, isPersonalizationV3Enabled } from '@/lib/personalizacija/engine-v3';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('preferred_model, preferred_language, custom_instructions, memory, personalization_version, stable_preferences, contextual_preferences, personalization_confidence, personalization_updated_at, personalization_enabled, personalization_opt_out, adaptive_preferences, personalization_feedback, personalization_v3_score')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profil nije pronađen.' }, { status: 404 });
    }

    const profileVersion = profile.personalization_version ?? 'v1';
    const profileInput = {
      custom_instructions: profile.custom_instructions,
      memory: profile.memory,
      preferred_model: profile.preferred_model,
      preferred_language: profile.preferred_language ?? null,
      personalization_version: profileVersion,
      stable_preferences: profile.stable_preferences as Record<string, unknown> | null,
      contextual_preferences: profile.contextual_preferences as Record<string, unknown> | null,
      personalization_confidence: profile.personalization_confidence ?? 0,
      personalization_updated_at: profile.personalization_updated_at ?? null,
      personalization_enabled: profile.personalization_enabled ?? true,
      personalization_opt_out: profile.personalization_opt_out ?? false,
      adaptive_preferences: profile.adaptive_preferences as Record<string, unknown> | null,
      personalization_feedback: profile.personalization_feedback as Record<string, unknown> | null,
      personalization_v3_score: profile.personalization_v3_score ?? 0,
    };

    const explainability =
      profileVersion === 'v3' && isPersonalizationV3Enabled()
        ? buildExplainabilityPayloadV3(user.id, profileInput)
        : buildExplainabilityPayload(user.id, profileInput);

    return NextResponse.json({
      status: 'ok',
      explainability,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Personalizacija explain GET error:', error);
    return NextResponse.json({ error: 'Greška servera.' }, { status: 500 });
  }
}
