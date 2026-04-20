// SpajaUltraOmegaCore -∞Ω+∞ — SpajaPro AI Chat API (Streaming)
// Kompanija SPAJA — Digitalna Industrija
// POST /api/spaja-pro/chat — streaming AI chat sa OpenAI

import { NextRequest, NextResponse } from 'next/server';
import {
  getOpenAI,
  SPAJA_PRO_SYSTEM_PROMPT,
  CHAT_LIMITS,
  isModelAllowed,
  calculateCostEur,
} from '@/lib/openai/client';
import { UNLIMITED_CHAT } from '@/lib/stripe/config';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import type { ModelId } from '@/lib/supabase/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = (await request.json()) as {
      message?: string;
      threadId?: string;
      model?: ModelId;
      stream?: boolean;
    };
    const { message, threadId, stream: wantStream = true } = body;
    const requestedModel = body.model ?? 'gpt-4o-mini';

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
      .select('plan, chat_messages_used, chat_messages_limit, custom_instructions, preferred_model, memory')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profil nije pronadjen.' }, { status: 404 });
    }

    const limit = CHAT_LIMITS[profile.plan] ?? 10;
    if (limit !== UNLIMITED_CHAT && profile.chat_messages_used >= limit) {
      return NextResponse.json({
        error: `Dostigli ste limit od ${limit} poruka za ${profile.plan} plan. Nadogradite plan za vise poruka.`,
        limitReached: true,
        currentPlan: profile.plan,
      }, { status: 429 });
    }

    // Odredi model — korisnik moze overridovati, inace koristi preferred iz profila
    const model: ModelId = requestedModel ?? profile.preferred_model ?? 'gpt-4o-mini';
    if (!isModelAllowed(model, profile.plan)) {
      return NextResponse.json({
        error: `Model ${model} nije dostupan za ${profile.plan} plan. Nadogradite plan.`,
        currentPlan: profile.plan,
      }, { status: 403 });
    }

    // Ako je threadId dat, proveri da postoji i pripada korisniku
    let activeThreadId = threadId ?? null;
    if (activeThreadId) {
      const { data: thread } = await supabase
        .from('chat_threads')
        .select('id')
        .eq('id', activeThreadId)
        .eq('user_id', user.id)
        .single();
      if (!thread) {
        // Thread ne postoji — ignoriši, koristićemo null
        activeThreadId = null;
      }
    }

    // Ako nema thread-a, kreiraj novi
    if (!activeThreadId) {
      const threadTitle = message.slice(0, 80) + (message.length > 80 ? '...' : '');
      const { data: newThread } = await supabase
        .from('chat_threads')
        .insert({
          user_id: user.id,
          title: threadTitle,
          model,
        })
        .select('id')
        .single();
      if (newThread) {
        activeThreadId = newThread.id;
      }
    }

    // Dohvati poslednjih 20 poruka za kontekst iz thread-a
    let historyQuery = supabase
      .from('chat_history')
      .select('role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (activeThreadId) {
      historyQuery = historyQuery.eq('thread_id', activeThreadId);
    }

    const { data: recentMessages } = await historyQuery;

    const conversationHistory = (recentMessages ?? [])
      .reverse()
      .map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    // Pripremi system prompt sa custom instructions i memorijom
    let systemPrompt = SPAJA_PRO_SYSTEM_PROMPT;
    if (profile.custom_instructions) {
      systemPrompt += `\n\nKorisnikove custom instrukcije:\n${profile.custom_instructions}`;
    }
    if (profile.memory) {
      systemPrompt += `\n\nKorisnikova memorija (kontekst iz prethodnih sesija):\n${profile.memory}`;
    }

    const openai = getOpenAI();

    // Reasoning modeli (o1, o3) ne podržavaju system poruke ni streaming
    const isReasoningModel = model.startsWith('o1') || model.startsWith('o3');
    const useStream = wantStream && !isReasoningModel;

    if (useStream) {
      // ── Streaming Response ──────────────────────────────────────
      const stream = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message },
        ],
        max_tokens: 4096,
        temperature: 0.7,
        stream: true,
      });

      let fullReply = '';
      let totalInputTokens = 0;
      let totalOutputTokens = 0;

      const encoder = new TextEncoder();

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            // Send threadId as the first SSE event
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'meta', threadId: activeThreadId })}\n\n`),
            );

            for await (const chunk of stream) {
              const delta = chunk.choices[0]?.delta?.content;
              if (delta) {
                fullReply += delta;
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'delta', content: delta })}\n\n`),
                );
              }
              // Pokupi token usage iz poslednjeg chunk-a
              if (chunk.usage) {
                totalInputTokens = chunk.usage.prompt_tokens ?? 0;
                totalOutputTokens = chunk.usage.completion_tokens ?? 0;
              }
            }

            // Sacuvaj poruke u bazu nakon zavrsetka streama
            const tokensUsed = totalInputTokens + totalOutputTokens;
            await supabase.from('chat_history').insert([
              { user_id: user.id, thread_id: activeThreadId, role: 'user' as const, content: message, model, tokens_used: 0 },
              { user_id: user.id, thread_id: activeThreadId, role: 'assistant' as const, content: fullReply, model, tokens_used: tokensUsed },
            ]);

            await supabase.from('profiles').update({
              chat_messages_used: profile.chat_messages_used + 1,
            }).eq('id', user.id);

            const costEur = calculateCostEur(model, totalInputTokens, totalOutputTokens);
            await supabase.from('usage_logs').insert({
              user_id: user.id,
              action: 'spaja_pro_chat',
              endpoint: '/api/spaja-pro/chat',
              tokens_used: tokensUsed,
              cost_eur: costEur,
            });

            // Update thread title to first message if it was auto-created
            if (activeThreadId && !threadId) {
              await supabase.from('chat_threads').update({
                updated_at: new Date().toISOString(),
              }).eq('id', activeThreadId);
            }

            // Pošalji završni event sa metapodacima
            const remaining = limit === UNLIMITED_CHAT ? 'neograniceno' : Math.max(0, limit - profile.chat_messages_used - 1);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({
                type: 'done',
                tokensUsed,
                messagesRemaining: remaining,
                plan: profile.plan,
                model,
                threadId: activeThreadId,
              })}\n\n`),
            );

            controller.close();
          } catch (err) {
            console.error('Streaming error:', err);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'Greska pri streamingu.' })}\n\n`),
            );
            controller.close();
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    } else {
      // ── Non-streaming Response (reasoning models or explicit request) ──
      // Supports tool calling for non-reasoning models
      const { chatWithTools } = await import('@/lib/tools');

      const chatMessages: { role: 'user' | 'assistant' | 'system'; content: string }[] = isReasoningModel
        ? [
            { role: 'user', content: `[System Instructions]\n${systemPrompt}` },
            ...conversationHistory,
            { role: 'user', content: message },
          ]
        : [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: message },
          ];

      let reply: string;
      let tokensUsed: number;

      if (isReasoningModel) {
        // Reasoning models don't support tool calling
        const completion = await openai.chat.completions.create({
          model,
          messages: chatMessages,
          max_tokens: 4096,
        });
        reply = completion.choices[0]?.message?.content ?? 'Nema odgovora.';
        tokensUsed = completion.usage?.total_tokens ?? 0;
      } else {
        // Non-reasoning models get tool calling
        const result = await chatWithTools(openai, model, chatMessages, 4096, 0.7);
        reply = result.reply;
        tokensUsed = result.totalTokens;
      }

      // Sacuvaj obe poruke u istoriju
      await supabase.from('chat_history').insert([
        { user_id: user.id, thread_id: activeThreadId, role: 'user' as const, content: message, model, tokens_used: 0 },
        { user_id: user.id, thread_id: activeThreadId, role: 'assistant' as const, content: reply, model, tokens_used: tokensUsed },
      ]);

      await supabase.from('profiles').update({
        chat_messages_used: profile.chat_messages_used + 1,
      }).eq('id', user.id);

      const costEur = calculateCostEur(model, Math.floor(tokensUsed * 0.7), Math.floor(tokensUsed * 0.3));
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
        messagesRemaining: limit === UNLIMITED_CHAT ? 'neograniceno' : Math.max(0, limit - profile.chat_messages_used - 1),
        plan: profile.plan,
        model,
        threadId: activeThreadId,
      });
    }
  } catch (error) {
    console.error('SpajaPro chat error:', error);
    return NextResponse.json(
      { error: 'Greska pri obradi poruke. Pokusajte ponovo.' },
      { status: 500 },
    );
  }
}
