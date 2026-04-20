// SpajaUltraOmegaCore -∞Ω+∞ — Thread Messages API
// GET /api/spaja-pro/threads/messages?threadId=xxx

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');

    if (!threadId) {
      return NextResponse.json({ error: 'threadId je obavezan.' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    // Proveri da thread pripada korisniku
    const { data: thread } = await supabase
      .from('chat_threads')
      .select('id, user_id, is_shared')
      .eq('id', threadId)
      .single();

    if (!thread) {
      return NextResponse.json({ error: 'Konverzacija nije pronadjena.' }, { status: 404 });
    }

    // Dozvoljavamo pristup ako je vlasnik ili ako je shared
    if (thread.user_id !== user.id && !thread.is_shared) {
      return NextResponse.json({ error: 'Nemate pristup ovoj konverzaciji.' }, { status: 403 });
    }

    const { data: messages, error } = await supabase
      .from('chat_history')
      .select('id, role, content, model, tokens_used, created_at')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })
      .limit(200);

    if (error) {
      console.error('Messages fetch error:', error);
      return NextResponse.json({ error: 'Greska pri dohvatanju poruka.' }, { status: 500 });
    }

    return NextResponse.json({ messages: messages ?? [] });
  } catch (error) {
    console.error('Messages API error:', error);
    return NextResponse.json({ error: 'Greska servera.' }, { status: 500 });
  }
}
