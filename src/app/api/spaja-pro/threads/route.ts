// SpajaUltraOmegaCore -∞Ω+∞ — SpajaPro Threads API
// Kompanija SPAJA — Digitalna Industrija
// GET /api/spaja-pro/threads — lista konverzacija
// POST /api/spaja-pro/threads — kreiraj novu konverzaciju
// DELETE /api/spaja-pro/threads?id=xxx — obrisi konverzaciju

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import type { ModelId } from '@/lib/supabase/types';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();
    const { data: threads, error } = await supabase
      .from('chat_threads')
      .select('id, title, model, is_shared, share_id, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Threads fetch error:', error);
      return NextResponse.json({ error: 'Greska pri dohvatanju konverzacija.' }, { status: 500 });
    }

    return NextResponse.json({ threads: threads ?? [] });
  } catch (error) {
    console.error('Threads API error:', error);
    return NextResponse.json({ error: 'Greska servera.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = (await request.json()) as { title?: string; model?: string };
    const supabase = getSupabaseServerClient();

    const { data: thread, error } = await supabase
      .from('chat_threads')
      .insert({
        user_id: user.id,
        title: body.title ?? 'Nova konverzacija',
        model: (body.model ?? 'gpt-4o-mini') as ModelId,
      })
      .select('id, title, model, created_at, updated_at')
      .single();

    if (error) {
      console.error('Thread create error:', error);
      return NextResponse.json({ error: 'Greska pri kreiranju konverzacije.' }, { status: 500 });
    }

    return NextResponse.json({ thread });
  } catch (error) {
    console.error('Thread create API error:', error);
    return NextResponse.json({ error: 'Greska servera.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('id');

    if (!threadId) {
      return NextResponse.json({ error: 'Thread ID je obavezan.' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    // Obrisi sve poruke iz thread-a
    await supabase
      .from('chat_history')
      .delete()
      .eq('thread_id', threadId)
      .eq('user_id', user.id);

    // Obrisi thread
    const { error } = await supabase
      .from('chat_threads')
      .delete()
      .eq('id', threadId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Thread delete error:', error);
      return NextResponse.json({ error: 'Greska pri brisanju konverzacije.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Thread delete API error:', error);
    return NextResponse.json({ error: 'Greska servera.' }, { status: 500 });
  }
}
