// SpajaUltraOmegaCore -∞Ω+∞ — Translate API
// POST /api/spaja-pro/translate — srpski ↔ engleski prevod sa kontekstom

import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai/client';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import {
  generisiPrevodInstrukciju,
  getPrevodniKonteksti,
  getPrevodniParovi,
} from '@/lib/spaja-pro-mozak/prevodilac';
import type { PrevodKontekst, PareziJezika } from '@/lib/spaja-pro-mozak/prevodilac';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = (await request.json()) as {
      tekst?: string;
      par?: PareziJezika;
      kontekst?: PrevodKontekst;
    };

    const { tekst, par = 'auto', kontekst = 'opsti' } = body;

    if (!tekst || typeof tekst !== 'string' || tekst.trim().length === 0) {
      return NextResponse.json({ error: 'Tekst za prevod je obavezan.' }, { status: 400 });
    }

    if (tekst.length > 10000) {
      return NextResponse.json({ error: 'Tekst je predug (max 10.000 karaktera).' }, { status: 400 });
    }

    const aiInstrukcija = generisiPrevodInstrukciju(par, kontekst);

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Ti si specijalizovani prevodilac za srpski i engleski jezik. ${aiInstrukcija}`,
        },
        {
          role: 'user',
          content: `Prevedi sledeći tekst:\n\n${tekst}`,
        },
      ],
      max_tokens: 3000,
      temperature: 0.3,
    });

    const prevod = completion.choices[0]?.message?.content ?? '';
    const tokensUsed = completion.usage?.total_tokens ?? 0;

    const supabase = getSupabaseServerClient();
    await supabase.from('usage_logs').insert({
      user_id: user.id,
      action: 'spaja_pro_translate',
      endpoint: '/api/spaja-pro/translate',
      tokens_used: tokensUsed,
      cost_eur: 0,
    });

    return NextResponse.json({
      prevod,
      par,
      kontekst,
      tokensUsed,
    });
  } catch (error) {
    console.error('Translate error:', error);
    return NextResponse.json({ error: 'Greška pri prevođenju.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    parovi: getPrevodniParovi(),
    konteksti: getPrevodniKonteksti(),
  });
}
