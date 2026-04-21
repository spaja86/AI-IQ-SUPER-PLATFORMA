// SpajaUltraOmegaCore -∞Ω+∞ — Task Planner API
// POST /api/spaja-pro/plan — razbija složene zahteve u CoT korake i vraća plan

import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai/client';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import {
  kreirajPlan,
  formatirajPlanZaPrikaz,
} from '@/lib/spaja-pro-mozak/planiranje';
import { SPAJA_PRO_SYSTEM_PROMPT } from '@/lib/openai/client';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = (await request.json()) as {
      zahtev?: string;
      izvrsiSaPlanom?: boolean; // Da li da pozove OpenAI sa plan instrukcijom
    };

    const { zahtev, izvrsiSaPlanom = false } = body;

    if (!zahtev || typeof zahtev !== 'string' || zahtev.trim().length === 0) {
      return NextResponse.json({ error: 'Zahtev je obavezan.' }, { status: 400 });
    }

    if (zahtev.length > 5000) {
      return NextResponse.json({ error: 'Zahtev je predug (max 5.000 karaktera).' }, { status: 400 });
    }

    const plan = kreirajPlan(zahtev);
    const planPrikaz = formatirajPlanZaPrikaz(plan);

    if (!izvrsiSaPlanom) {
      // Samo vrati plan bez AI izvršavanja
      return NextResponse.json({
        plan: {
          jeSlozeni: plan.jeSlozeni,
          kategorija: plan.kategorija,
          koraci: plan.koraci,
          ukupnoKoraka: plan.ukupnoKoraka,
          procenjenovreme: plan.procenjenovreme,
        },
        planPrikaz,
      });
    }

    // Izvršenje plana sa OpenAI
    const supabase = getSupabaseServerClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, chat_messages_used')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profil nije pronađen.' }, { status: 404 });
    }

    const openai = getOpenAI();
    const systemPrompt = plan.jeSlozeni
      ? `${SPAJA_PRO_SYSTEM_PROMPT}\n\n${plan.aiInstrukcija}`
      : SPAJA_PRO_SYSTEM_PROMPT;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: zahtev },
      ],
      max_tokens: 4000,
      temperature: 0.5,
    });

    const odgovor = completion.choices[0]?.message?.content ?? 'Nema odgovora.';
    const tokensUsed = completion.usage?.total_tokens ?? 0;

    await supabase.from('usage_logs').insert({
      user_id: user.id,
      action: 'spaja_pro_plan_execute',
      endpoint: '/api/spaja-pro/plan',
      tokens_used: tokensUsed,
      cost_eur: 0,
    });

    return NextResponse.json({
      plan: {
        jeSlozeni: plan.jeSlozeni,
        kategorija: plan.kategorija,
        koraci: plan.koraci,
        ukupnoKoraka: plan.ukupnoKoraka,
        procenjenovreme: plan.procenjenovreme,
      },
      planPrikaz,
      odgovor,
      tokensUsed,
    });
  } catch (error) {
    console.error('Plan error:', error);
    return NextResponse.json({ error: 'Greška pri planiranju.' }, { status: 500 });
  }
}
