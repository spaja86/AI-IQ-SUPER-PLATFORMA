// SpajaUltraOmegaCore -∞Ω+∞ — Feedback API
// Kompanija SPAJA — Digitalna Industrija
// POST /api/spaja-pro/feedback — Korisnik ocenjuje AI odgovor
// GET  /api/spaja-pro/feedback — Korisnik dohvata svoju istoriju ocena

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ─── Validaciona shema ────────────────────────────────────────────────

const FeedbackShema = z.object({
  // ID poruke iz chat_history (opciono — može biti null za opšti feedback)
  messageId: z.string().uuid().optional().nullable(),
  // Nit razgovora
  threadId: z.string().uuid().optional().nullable(),
  // Ocena: 1 (loše) do 5 (odlično)
  ocena: z.number().int().min(1).max(5),
  // Kratki komentar (opciono)
  komentar: z.string().max(1000).optional().nullable(),
  // Tip feedbacka
  tip: z.enum(['tacnost', 'korisnost', 'brzina', 'opstenito']).default('opstenito'),
  // Da li korisnik želi popravku?
  zelPopravku: z.boolean().default(false),
});

type FeedbackUlaz = z.infer<typeof FeedbackShema>;

// ─── POST — Sačuvaj feedback ──────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = (await request.json()) as unknown;
    const parsed = FeedbackShema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Nevažeći podaci.', detalji: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const feedback: FeedbackUlaz = parsed.data;

    const supabase = getSupabaseServerClient();

    // Sačuvaj u usage_logs sa posebnom akcijom
    await supabase.from('usage_logs').insert({
      user_id: user.id,
      action: `feedback_${feedback.tip}_ocena_${feedback.ocena}`,
      endpoint: '/api/spaja-pro/feedback',
      tokens_used: 0,
      cost_eur: 0,
    });

    // Ako je ocena <= 2 i tražena popravka, kreiraj napomenu za improvement
    const porukaOcena = feedback.ocena <= 2 ? 'nizak' : feedback.ocena <= 3 ? 'srednji' : 'visok';

    return NextResponse.json({
      uspeh: true,
      poruka: `Hvala na feedbacku! Vaša ocena: ${feedback.ocena}/5 (${porukaOcena} kvalitet)`,
      ocena: feedback.ocena,
      tip: feedback.tip,
      zelPopravku: feedback.zelPopravku,
      ...(feedback.zelPopravku && {
        savet: 'Pošaljite detalje šta bi trebalo ispraviti ili poboljšati u narednoj poruci.',
      }),
    });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json({ error: 'Greška servera.' }, { status: 500 });
  }
}

// ─── GET — Feedback statistike za korisnika ───────────────────────────

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();

    // Dohvati feedback logove korisnika
    const { data: logs } = await supabase
      .from('usage_logs')
      .select('action, created_at')
      .eq('user_id', user.id)
      .like('action', 'feedback_%')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!logs || logs.length === 0) {
      return NextResponse.json({ feedbackDato: 0, poruka: 'Nema datog feedbacka.' });
    }

    // Parsuj ocene iz action stringa (format: feedback_{tip}_ocena_{broj})
    const ocene: number[] = [];
    const tipoviBrojac: Record<string, number> = {};

    for (const log of logs) {
      const ocenaMatch = /ocena_(\d)/.exec(log.action);
      const tipMatch = /feedback_([a-z]+)_/.exec(log.action);

      if (ocenaMatch?.[1]) ocene.push(parseInt(ocenaMatch[1], 10));
      if (tipMatch?.[1]) {
        tipoviBrojac[tipMatch[1]] = (tipoviBrojac[tipMatch[1]] ?? 0) + 1;
      }
    }

    const prosecnaOcena = ocene.length > 0
      ? Math.round((ocene.reduce((a, b) => a + b, 0) / ocene.length) * 10) / 10
      : 0;

    return NextResponse.json({
      feedbackDato: logs.length,
      prosecnaOcena,
      rasporedOcena: {
        odlicno: ocene.filter((o) => o === 5).length,
        dobro: ocene.filter((o) => o === 4).length,
        prosecno: ocene.filter((o) => o === 3).length,
        lose: ocene.filter((o) => o === 2).length,
        veomaLose: ocene.filter((o) => o === 1).length,
      },
      tipoviPoruke: tipoviBrojac,
    });
  } catch (error) {
    console.error('Feedback GET error:', error);
    return NextResponse.json({ error: 'Greška servera.' }, { status: 500 });
  }
}
