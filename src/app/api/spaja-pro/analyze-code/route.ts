// SpajaUltraOmegaCore -∞Ω+∞ — Code Analyzer API
// POST /api/spaja-pro/analyze-code — analizira kod za bugove, security i code smells

import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai/client';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { analizirajPoruku } from '@/lib/spaja-pro-mozak/kod-analizator';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = (await request.json()) as {
      kod?: string;
      duboka?: boolean; // Da li da pozove OpenAI za duboku analizu
    };

    const { kod, duboka = false } = body;

    if (!kod || typeof kod !== 'string' || kod.trim().length === 0) {
      return NextResponse.json({ error: 'Kod je obavezan.' }, { status: 400 });
    }

    if (kod.length > 20000) {
      return NextResponse.json({ error: 'Kod je predug (max 20.000 karaktera).' }, { status: 400 });
    }

    // Statička analiza
    const statickaAnaliza = analizirajPoruku(kod);

    if (!duboka || !statickaAnaliza.sadrzKod) {
      return NextResponse.json({
        sadrzKod: statickaAnaliza.sadrzKod,
        jezik: statickaAnaliza.jezik,
        problemi: statickaAnaliza.problemi,
        kvalitetSkor: statickaAnaliza.kvalitetSkor,
        aiAnaliza: null,
      });
    }

    // Duboka analiza sa OpenAI (samo ako je korisnik tražio)
    const supabase = getSupabaseServerClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, chat_messages_used, chat_messages_limit')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profil nije pronađen.' }, { status: 404 });
    }

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Ti si ekspert za code review i sigurnost softvera. Analiziraj kod i daj konkretan, strukturiran izveštaj na srpskom jeziku.',
        },
        {
          role: 'user',
          content: statickaAnaliza.aiInstrukcija + '\n\n```' + statickaAnaliza.jezik + '\n' + kod + '\n```',
        },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const aiAnaliza = completion.choices[0]?.message?.content ?? '';

    await supabase.from('usage_logs').insert({
      user_id: user.id,
      action: 'spaja_pro_analyze_code',
      endpoint: '/api/spaja-pro/analyze-code',
      tokens_used: completion.usage?.total_tokens ?? 0,
      cost_eur: 0,
    });

    return NextResponse.json({
      sadrzKod: statickaAnaliza.sadrzKod,
      jezik: statickaAnaliza.jezik,
      problemi: statickaAnaliza.problemi,
      kvalitetSkor: statickaAnaliza.kvalitetSkor,
      aiAnaliza,
    });
  } catch (error) {
    console.error('Analyze-code error:', error);
    return NextResponse.json({ error: 'Greška pri analizi koda.' }, { status: 500 });
  }
}
