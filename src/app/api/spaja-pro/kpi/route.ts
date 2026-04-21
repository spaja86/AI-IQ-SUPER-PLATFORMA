// SpajaUltraOmegaCore -∞Ω+∞ — KPI Dashboard API
// Kompanija SPAJA — Digitalna Industrija
// GET /api/spaja-pro/kpi — Ključni pokazatelji uspešnosti SpajaPro sistema

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { getKesStatistike } from '@/lib/spaja-pro-mozak/cache';
import { AVAILABLE_MODELS } from '@/lib/openai/client';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();

    // ── Profil korisnika ──────────────────────────────────────────────
    const { data: profil } = await supabase
      .from('profiles')
      .select('plan, chat_messages_used, chat_messages_limit, created_at, preferred_model')
      .eq('id', user.id)
      .single();

    // ── Usage logs — poslednjih 30 dana ──────────────────────────────
    const pre30Dana = new Date();
    pre30Dana.setDate(pre30Dana.getDate() - 30);

    const { data: usageLogs } = await supabase
      .from('usage_logs')
      .select('action, tokens_used, cost_eur, created_at')
      .eq('user_id', user.id)
      .gte('created_at', pre30Dana.toISOString())
      .order('created_at', { ascending: false })
      .limit(500);

    const logs = usageLogs ?? [];

    // ── Analiza logova ────────────────────────────────────────────────

    // Chat poruke vs ostale akcije
    const chatLogs = logs.filter((l) => l.action === 'spaja_pro_chat');
    const feedbackLogs = logs.filter((l) => l.action.startsWith('feedback_'));
    const cacheHitLogs = logs.filter((l) => l.action === 'spaja_pro_chat_cache_hit');

    const ukupnoChats = chatLogs.length;
    const ukupnoTokena = chatLogs.reduce((s, l) => s + (l.tokens_used ?? 0), 0);
    const ukupnoTrosak = chatLogs.reduce((s, l) => s + (l.cost_eur ?? 0), 0);

    const prosecnoTokenaPoChat = ukupnoChats > 0
      ? Math.round(ukupnoTokena / ukupnoChats)
      : 0;
    const prosecnoTrosakPoChat = ukupnoChats > 0
      ? Math.round((ukupnoTrosak / ukupnoChats) * 10000) / 10000
      : 0;

    // Cache hit rate
    const ukupnoZahteva = ukupnoChats + cacheHitLogs.length;
    const cacheHitRate = ukupnoZahteva > 0
      ? Math.round((cacheHitLogs.length / ukupnoZahteva) * 100)
      : 0;

    // Feedback analiza
    let prosecnaFeedbackOcena = 0;
    if (feedbackLogs.length > 0) {
      const ocene = feedbackLogs
        .map((l) => {
          const m = /ocena_(\d)/.exec(l.action);
          return m?.[1] ? parseInt(m[1], 10) : 0;
        })
        .filter((o) => o > 0);
      if (ocene.length > 0) {
        prosecnaFeedbackOcena = Math.round((ocene.reduce((a, b) => a + b, 0) / ocene.length) * 10) / 10;
      }
    }

    // Dnevna distribucija (poslednjih 7 dana)
    const dnevnaStatistika: Array<{
      datum: string;
      chats: number;
      tokeni: number;
      trosak: number;
    }> = [];

    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const kljuc = d.toISOString().slice(0, 10);
      const dnevniLogs = chatLogs.filter((l) => l.created_at?.slice(0, 10) === kljuc);
      dnevnaStatistika.push({
        datum: kljuc,
        chats: dnevniLogs.length,
        tokeni: dnevniLogs.reduce((s, l) => s + (l.tokens_used ?? 0), 0),
        trosak: Math.round(dnevniLogs.reduce((s, l) => s + (l.cost_eur ?? 0), 0) * 10000) / 10000,
      });
    }

    // ── Keš statistike ────────────────────────────────────────────────
    const kesStatistike = getKesStatistike();

    // ── Model statistike ──────────────────────────────────────────────
    const modelInfo = AVAILABLE_MODELS.map((m) => ({
      id: m.id,
      naziv: m.naziv,
      cenaPo1kInput: m.cenaPo1kInput,
      cenaPo1kOutput: m.cenaPo1kOutput,
      minPlan: m.minPlan,
    }));

    // ── Procena NPS (simulirana iz feedback ocena) ────────────────────
    // NPS = %promotera (ocena 5) - %kritičara (ocena 1-2)
    let nps: number | null = null;
    if (feedbackLogs.length >= 3) {
      const sveOcene = feedbackLogs
        .map((l) => {
          const m = /ocena_(\d)/.exec(l.action);
          return m?.[1] ? parseInt(m[1], 10) : 0;
        })
        .filter((o) => o > 0);

      if (sveOcene.length >= 3) {
        const promoteri = sveOcene.filter((o) => o === 5).length;
        const kriticari = sveOcene.filter((o) => o <= 2).length;
        nps = Math.round(((promoteri - kriticari) / sveOcene.length) * 100);
      }
    }

    // ── Odgovor ────────────────────────────────────────────────────────

    return NextResponse.json({
      period: '30 dana',
      korisnik: {
        plan: profil?.plan ?? 'starter',
        preferredModel: profil?.preferred_model ?? 'gpt-4o-mini',
        clansvoOd: profil?.created_at,
        poruka: {
          iskorisceno: profil?.chat_messages_used ?? 0,
          limit: profil?.chat_messages_limit ?? 10,
        },
      },
      kpi: {
        ukupnoChats,
        ukupnoTokena,
        ukupnoTrosakEur: Math.round(ukupnoTrosak * 100) / 100,
        prosecnoTokenaPoChat,
        prosecnoTrosakPoChat,
        cacheHitRate: `${cacheHitRate}%`,
        feedbackDato: feedbackLogs.length,
        prosecnaFeedbackOcena: prosecnaFeedbackOcena || null,
        nps,
      },
      benchmarks: {
        ciljanoProsecnoTokena: 1500,
        ciljanoMaxTrosakPoChat: 0.01,
        ciljanoMinFeedbackOcena: 4.0,
        ciljanoMinNPS: 50,
      },
      dnevnaStatistika,
      kes: kesStatistike,
      dostupniModeli: modelInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('KPI API error:', error);
    return NextResponse.json({ error: 'Greška servera.' }, { status: 500 });
  }
}
