// SpajaUltraOmegaCore -∞Ω+∞ — SpajaPro AI Chat API
// Kompanija SPAJA — Digitalna Industrija
// POST /api/spaja-pro/chat — realni AI chat sa OpenAI

import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI, SPAJA_PRO_SYSTEM_PROMPT, CHAT_LIMITS } from '@/lib/openai/client';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = (await request.json()) as { message?: string };
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Poruka je obavezna.' }, { status: 400 });
    }

    if (message.length > 4000) {
      return NextResponse.json({ error: 'Poruka je preduga (max 4000 karaktera).' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    // Proveri korisnikov plan i limite
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, chat_messages_used, chat_messages_limit')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profil nije pronadjen.' }, { status: 404 });
    }

    const limit = CHAT_LIMITS[profile.plan] ?? 10;
    if (limit !== -1 && profile.chat_messages_used >= limit) {
      return NextResponse.json({
        error: `Dostigli ste limit od ${limit} poruka za ${profile.plan} plan. Nadogradite plan za vise poruka.`,
        limitReached: true,
        currentPlan: profile.plan,
      }, { status: 429 });
    }

    // Dohvati poslednjih 10 poruka za kontekst
    const { data: recentMessages } = await supabase
      .from('chat_history')
      .select('role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const conversationHistory = (recentMessages ?? [])
      .reverse()
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    // Pozovi OpenAI
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SPAJA_PRO_SYSTEM_PROMPT },
        ...conversationHistory,
        { role: 'user', content: message },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? 'Nema odgovora.';
    const tokensUsed = completion.usage?.total_tokens ?? 0;

    // Sacuvaj obe poruke u istoriju
    await supabase.from('chat_history').insert([
      { user_id: user.id, role: 'user' as const, content: message, tokens_used: 0 },
      { user_id: user.id, role: 'assistant' as const, content: reply, tokens_used: tokensUsed },
    ]);

    // Azuriraj brojac poruka
    await supabase.from('profiles').update({
      chat_messages_used: profile.chat_messages_used + 1,
    }).eq('id', user.id);

    // Loguj koriscenje
    const costEur = tokensUsed * 0.00000015; // Approx cost per token
    await supabase.from('usage_logs').insert({
      user_id: user.id,
      action: 'spaja_pro_chat',
      endpoint: '/api/spaja-pro/chat',
      tokens_used: tokensUsed,
      cost_eur: costEur,
    });

    return NextResponse.json({
      reply,
      tokensUsed,
      messagesRemaining: limit === -1 ? 'neograniceno' : Math.max(0, limit - profile.chat_messages_used - 1),
      plan: profile.plan,
    });
  } catch (error) {
    console.error('SpajaPro chat error:', error);
    return NextResponse.json(
      { error: 'Greska pri obradi poruke. Pokusajte ponovo.' },
      { status: 500 },
    );
  }
}
