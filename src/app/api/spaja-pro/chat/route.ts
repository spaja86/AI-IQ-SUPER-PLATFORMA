// SpajaUltraOmegaCore -∞Ω+∞ — SpajaPro AI Chat API (Streaming)
// Kompanija SPAJA — Digitalna Industrija
// POST /api/spaja-pro/chat — streaming AI chat sa OpenAI
// Uključuje: injection zaštita, PII maskiranje, smart routing, caching, self-check

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
import { zastitiPrompt } from '@/lib/spaja-pro-mozak/prompt-zastita';
import { rutirajModel, jeReasoningModel } from '@/lib/spaja-pro-mozak/model-router';
import { verifikujOdgovor } from '@/lib/spaja-pro-mozak/self-check';
import { generisiCacheKljuc, dohvatiIzKesa, sacuvajUKes } from '@/lib/spaja-pro-mozak/cache';
import { generisiFormatInstrukciju } from '@/lib/spaja-pro-mozak/formatiranje';
import { evaluirajOdgovor } from '@/lib/spaja-pro-mozak/evaluator';
import { detektujZapamtiZahtev, dodajUMemoriju } from '@/lib/spaja-pro-mozak/kontekst-memorija';
import { analizirajPoruku as analizirajKodPoruku } from '@/lib/spaja-pro-mozak/kod-analizator';
import { analizirajKontekst, generisiKontekstInstrukciju } from '@/lib/spaja-pro-mozak/razgovorni-agent';
import { generisiCitatInstrukciju } from '@/lib/spaja-pro-mozak/citati';
import { jeSlozeniZahtev, kreirajPlan } from '@/lib/spaja-pro-mozak/planiranje';
import { detektujSablon } from '@/lib/spaja-pro-mozak/prompt-sabloni';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const pocetakVremeMs = Date.now();

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
    const requestedModel = body.model ?? null;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Poruka je obavezna.' }, { status: 400 });
    }

    // ── 1. Zaštita: Injection detekcija + PII maskiranje ──────────────
    const zastitaRezultat = zastitiPrompt(message);

    if (!zastitaRezultat.jeBezbedan) {
      return NextResponse.json(
        {
          error: zastitaRezultat.razlogOdbijanja ?? 'Poruka nije bezbedna za obradu.',
          ...(zastitaRezultat.jeInjection && { kod: 'INJECTION_DETECTED' }),
        },
        { status: 400 },
      );
    }

    // Koristi obrađenu poruku (sa maskiranim PII)
    const obradjenaPoruka = zastitaRezultat.obradjenaPoruka;

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

    // ── 2. Smart Model Routing ─────────────────────────────────────────
    const rutingRezultat = rutirajModel(
      obradjenaPoruka,
      profile.plan,
      profile.preferred_model,
      requestedModel,
    );

    const model: ModelId = rutingRezultat.model;
    if (!isModelAllowed(model, profile.plan)) {
      return NextResponse.json({
        error: `Model ${model} nije dostupan za ${profile.plan} plan. Nadogradite plan.`,
        currentPlan: profile.plan,
      }, { status: 403 });
    }

    // ── 3. Cache lookup ────────────────────────────────────────────────
    // Keširaj samo za kratke/srednje upite bez konverzacionog konteksta
    const cacheKljuc = generisiCacheKljuc(obradjenaPoruka, model, SPAJA_PRO_SYSTEM_PROMPT);
    const cacheRezultat = !threadId ? dohvatiIzKesa(cacheKljuc) : { pronadjen: false as const };

    if (cacheRezultat.pronadjen) {
      // Cache hit — vrati odgovor bez AI poziva
      const latencijaMs = Date.now() - pocetakVremeMs;
      await supabase.from('usage_logs').insert({
        user_id: user.id,
        action: 'spaja_pro_chat_cache_hit',
        endpoint: '/api/spaja-pro/chat',
        tokens_used: cacheRezultat.tokeniKorisceni,
        cost_eur: 0, // Keš hit = 0 trošak
      });

      return NextResponse.json({
        reply: cacheRezultat.odgovor,
        tokensUsed: cacheRezultat.tokeniKorisceni,
        messagesRemaining: limit === UNLIMITED_CHAT ? 'neograniceno' : Math.max(0, limit - profile.chat_messages_used),
        plan: profile.plan,
        model: cacheRezultat.model,
        fromCache: true,
        latencijaMs,
        rutingInfo: {
          kompleksnost: rutingRezultat.kompleksnost,
          razlog: rutingRezultat.razlog,
        },
      });
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
      const threadTitle = obradjenaPoruka.slice(0, 80) + (obradjenaPoruka.length > 80 ? '...' : '');
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

    // ── Novi moduli — pre-processing middleware ─────────────────────

    // 1. Detektuj "zapamti" zahtev i ažuriraj memoriju
    const zapamtiRezultat = detektujZapamtiZahtev(obradjenaPoruka);
    if (zapamtiRezultat.jeZahtev && zapamtiRezultat.novaStavka) {
      const novaMemorija = dodajUMemoriju(profile.memory, zapamtiRezultat.novaStavka);
      await supabase.from('profiles').update({ memory: novaMemorija, updated_at: new Date().toISOString() }).eq('id', user.id);
      systemPrompt += `\n\nNovo zapamćeno: ${zapamtiRezultat.informacija}`;
    }

    // 2. Detektuj prompt šablon i zameni poruku sa popunjenim šablonom
    const sablonRezultat = detektujSablon(obradjenaPoruka);
    const efektivnaPoruka = sablonRezultat.pronadjen && sablonRezultat.popunjenPrompt
      ? sablonRezultat.popunjenPrompt
      : obradjenaPoruka;

    // 3. Adaptivni format — detektuj optimalni format i dodaj instrukciju
    const formatInstrukcija = generisiFormatInstrukciju(efektivnaPoruka);
    if (formatInstrukcija) {
      systemPrompt += formatInstrukcija;
    }

    // 4. Code analyzer — prepoznaj kod i dodaj analitičku instrukciju
    const kodAnaliza = analizirajKodPoruku(efektivnaPoruka);
    if (kodAnaliza.sadrzKod && kodAnaliza.aiInstrukcija) {
      systemPrompt += `\n\n${kodAnaliza.aiInstrukcija}`;
    }

    // 5. Razgovorni agent — proveri da li nedostaje kontekst
    const razgovornaAnaliza = analizirajKontekst(efektivnaPoruka, conversationHistory);
    if (razgovornaAnaliza.nedostaje.length > 0) {
      const kontekstInstrukcija = generisiKontekstInstrukciju(razgovornaAnaliza);
      if (kontekstInstrukcija) {
        systemPrompt += kontekstInstrukcija;
      }
    }

    // 6. Citati — dodaj instrukciju za navođenje izvora za složene zahteve
    const jeSlozeni = jeSlozeniZahtev(efektivnaPoruka);
    if (jeSlozeni) {
      systemPrompt += generisiCitatInstrukciju();
    }

    // 7. Task planner — za složene zahteve dodaj plan strukturu
    if (jeSlozeni) {
      const plan = kreirajPlan(efektivnaPoruka);
      if (plan.jeSlozeni && plan.aiInstrukcija) {
        systemPrompt += `\n\n${plan.aiInstrukcija}`;
      }
    }

    const openai = getOpenAI();

    // Reasoning modeli (o1, o3) ne podržavaju system poruke ni streaming
    const isReasoningModel = jeReasoningModel(model);
    const useStream = wantStream && !isReasoningModel;

    if (useStream) {
      // ── Streaming Response ──────────────────────────────────────
      const stream = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: efektivnaPoruka },
        ],
        max_tokens: rutingRezultat.tokenBudzet,
        temperature: rutingRezultat.temperatura,
        stream: true,
      });

      let fullReply = '';
      let totalInputTokens = 0;
      let totalOutputTokens = 0;

      const encoder = new TextEncoder();

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            // Pošalji meta event sa threadId i routing informacijama
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({
                type: 'meta',
                threadId: activeThreadId,
                rutingInfo: {
                  model,
                  kompleksnost: rutingRezultat.kompleksnost,
                  razlog: rutingRezultat.razlog,
                },
                piiDetektovano: zastitaRezultat.detektovaniPII.length > 0,
              })}\n\n`),
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

            // Self-check verifikacija odgovora
            const selfCheck = verifikujOdgovor(obradjenaPoruka, fullReply);

            // Evaluator — 5-dimenzionalna ocena odgovora
            const evaluacija = evaluirajOdgovor(efektivnaPoruka, fullReply);

            // Sacuvaj poruke u bazu nakon zavrsetka streama
            const tokensUsed = totalInputTokens + totalOutputTokens;
            await supabase.from('chat_history').insert([
              { user_id: user.id, thread_id: activeThreadId, role: 'user' as const, content: obradjenaPoruka, model, tokens_used: 0 },
              { user_id: user.id, thread_id: activeThreadId, role: 'assistant' as const, content: fullReply, model, tokens_used: tokensUsed },
            ]);

            await supabase.from('profiles').update({
              chat_messages_used: profile.chat_messages_used + 1,
            }).eq('id', user.id);

            const latencijaMs = Date.now() - pocetakVremeMs;
            const costEur = calculateCostEur(model, totalInputTokens, totalOutputTokens);
            await supabase.from('usage_logs').insert({
              user_id: user.id,
              action: 'spaja_pro_chat',
              endpoint: '/api/spaja-pro/chat',
              tokens_used: tokensUsed,
              cost_eur: costEur,
            });

            // Keširaj odgovor za buduće identične upite
            sacuvajUKes(cacheKljuc, fullReply, model, tokensUsed);

            // Update thread title to first message if it was auto-created
            if (activeThreadId && !threadId) {
              await supabase.from('chat_threads').update({
                updated_at: new Date().toISOString(),
              }).eq('id', activeThreadId);
            }

            // Pošalji završni event sa metapodacima i self-check rezultatom
            const remaining = limit === UNLIMITED_CHAT ? 'neograniceno' : Math.max(0, limit - profile.chat_messages_used - 1);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({
                type: 'done',
                tokensUsed,
                messagesRemaining: remaining,
                plan: profile.plan,
                model,
                threadId: activeThreadId,
                latencijaMs,
                selfCheck: {
                  konfidensNivo: selfCheck.konfidensNivo,
                  konfidensProcenat: selfCheck.konfidensProcenat,
                  upozoravanja: selfCheck.upozoravanja,
                  preporuke: selfCheck.preporuke,
                },
                evaluacija: {
                  ukupanSkor: evaluacija.ukupanSkor,
                  nivoKvaliteta: evaluacija.nivoKvaliteta,
                  formatiranPrikaz: evaluacija.formatiranPrikaz,
                  trebaPonovo: evaluacija.trebaPonovo,
                },
                moduli: {
                  formatDetektovan: sablonRezultat.pronadjen ? sablonRezultat.sablon?.id : null,
                  sadrzKod: kodAnaliza.sadrzKod,
                  jeSlozeni,
                  zapamceno: zapamtiRezultat.jeZahtev,
                },
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
            { role: 'user', content: efektivnaPoruka },
          ]
        : [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: efektivnaPoruka },
          ];

      let reply: string;
      let tokensUsed: number;

      if (isReasoningModel) {
        // Reasoning models don't support tool calling
        const completion = await openai.chat.completions.create({
          model,
          messages: chatMessages,
          max_tokens: rutingRezultat.tokenBudzet,
        });
        reply = completion.choices[0]?.message?.content ?? 'Nema odgovora.';
        tokensUsed = completion.usage?.total_tokens ?? 0;
      } else {
        // Non-reasoning models get tool calling
        const result = await chatWithTools(openai, model, chatMessages, rutingRezultat.tokenBudzet, rutingRezultat.temperatura);
        reply = result.reply;
        tokensUsed = result.totalTokens;
      }

      // Self-check verifikacija odgovora
      const selfCheck = verifikujOdgovor(obradjenaPoruka, reply);

      // Evaluator — 5-dimenzionalna ocena odgovora
      const evaluacija = evaluirajOdgovor(efektivnaPoruka, reply);

      // Keširaj odgovor
      sacuvajUKes(cacheKljuc, reply, model, tokensUsed);

      // Sacuvaj obe poruke u istoriju
      await supabase.from('chat_history').insert([
        { user_id: user.id, thread_id: activeThreadId, role: 'user' as const, content: obradjenaPoruka, model, tokens_used: 0 },
        { user_id: user.id, thread_id: activeThreadId, role: 'assistant' as const, content: reply, model, tokens_used: tokensUsed },
      ]);

      await supabase.from('profiles').update({
        chat_messages_used: profile.chat_messages_used + 1,
      }).eq('id', user.id);

      const latencijaMs = Date.now() - pocetakVremeMs;

      // Approximate cost split: 70% input, 30% output tokens
      // (exact split unavailable since chatWithTools aggregates total tokens)
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
        latencijaMs,
        rutingInfo: {
          kompleksnost: rutingRezultat.kompleksnost,
          razlog: rutingRezultat.razlog,
        },
        selfCheck: {
          konfidensNivo: selfCheck.konfidensNivo,
          konfidensProcenat: selfCheck.konfidensProcenat,
          upozoravanja: selfCheck.upozoravanja,
          preporuke: selfCheck.preporuke,
        },
        evaluacija: {
          ukupanSkor: evaluacija.ukupanSkor,
          nivoKvaliteta: evaluacija.nivoKvaliteta,
          formatiranPrikaz: evaluacija.formatiranPrikaz,
          trebaPonovo: evaluacija.trebaPonovo,
        },
        moduli: {
          formatDetektovan: sablonRezultat.pronadjen ? sablonRezultat.sablon?.id : null,
          sadrzKod: kodAnaliza.sadrzKod,
          jeSlozeni,
          zapamceno: zapamtiRezultat.jeZahtev,
        },
        piiDetektovano: zastitaRezultat.detektovaniPII.length > 0,
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
