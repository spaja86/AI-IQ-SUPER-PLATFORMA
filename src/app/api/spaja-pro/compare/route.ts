// SpajaUltraOmegaCore -∞Ω+∞ — A/B Compare API
// POST /api/spaja-pro/compare — generiše dva odgovora različitih stilova za poređenje

import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI, SPAJA_PRO_SYSTEM_PROMPT } from '@/lib/openai/client';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import {
  generisiABPromptPar,
  formatirajABOdgovor,
  getABSystemPromptovi,
  jePogodan_za_AB,
} from '@/lib/spaja-pro-mozak/a-b-odgovor';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = (await request.json()) as {
      poruka?: string;
    };

    const { poruka } = body;

    if (!poruka || typeof poruka !== 'string' || poruka.trim().length === 0) {
      return NextResponse.json({ error: 'Poruka je obavezna.' }, { status: 400 });
    }

    if (poruka.length > 3000) {
      return NextResponse.json({ error: 'Poruka je preduga (max 3.000 karaktera).' }, { status: 400 });
    }

    if (!jePogodan_za_AB(poruka)) {
      return NextResponse.json({
        error: 'Poruka nije pogodna za A/B poređenje (previše kratka ili dugačka).',
        minimumReci: 5,
        maximumReci: 200,
      }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, chat_messages_used, chat_messages_limit')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profil nije pronađen.' }, { status: 404 });
    }

    const par = generisiABPromptPar(poruka);
    const [systemPromptA, systemPromptB] = getABSystemPromptovi(SPAJA_PRO_SYSTEM_PROMPT, par);

    const openai = getOpenAI();

    // Pozovi oba odgovora paralelno
    const [completionA, completionB] = await Promise.all([
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPromptA },
          { role: 'user', content: poruka },
        ],
        max_tokens: 1500,
        temperature: 0.6,
      }),
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPromptB },
          { role: 'user', content: poruka },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    ]);

    const varijantaA = completionA.choices[0]?.message?.content ?? 'Nema odgovora.';
    const varijantaB = completionB.choices[0]?.message?.content ?? 'Nema odgovora.';
    const tokensUsed =
      (completionA.usage?.total_tokens ?? 0) + (completionB.usage?.total_tokens ?? 0);

    const abOdgovor = formatirajABOdgovor(varijantaA, varijantaB, par);

    await supabase.from('usage_logs').insert({
      user_id: user.id,
      action: 'spaja_pro_ab_compare',
      endpoint: '/api/spaja-pro/compare',
      tokens_used: tokensUsed,
      cost_eur: 0,
    });

    return NextResponse.json({
      varijantaA,
      varijantaB,
      par: {
        opisA: par.opisA,
        opisB: par.opisB,
        stilA: par.stilA,
        stilB: par.stilB,
      },
      formatiranPrikaz: abOdgovor.formatiranPrikaz,
      opisRazlike: abOdgovor.opisRazlike,
      tokensUsed,
    });
  } catch (error) {
    console.error('Compare error:', error);
    return NextResponse.json({ error: 'Greška pri poređenju odgovora.' }, { status: 500 });
  }
}
