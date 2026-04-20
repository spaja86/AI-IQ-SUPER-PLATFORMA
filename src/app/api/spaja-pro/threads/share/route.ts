// SpajaUltraOmegaCore -∞Ω+∞ — Share Thread API
// POST /api/spaja-pro/threads/share — deli konverzaciju javnim linkom

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';

function generateShareId(): string {
  const array = new Uint8Array(9);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 12);
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = (await request.json()) as { threadId?: string };
    const { threadId } = body;

    if (!threadId) {
      return NextResponse.json({ error: 'threadId je obavezan.' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    // Proveri da thread pripada korisniku
    const { data: thread } = await supabase
      .from('chat_threads')
      .select('id, share_id, is_shared')
      .eq('id', threadId)
      .eq('user_id', user.id)
      .single();

    if (!thread) {
      return NextResponse.json({ error: 'Konverzacija nije pronadjena.' }, { status: 404 });
    }

    // Ako vec ima share_id, vrati ga
    if (thread.is_shared && thread.share_id) {
      return NextResponse.json({ shareId: thread.share_id, alreadyShared: true });
    }

    // Generiši novi share ID
    const shareId = generateShareId();
    const { error } = await supabase
      .from('chat_threads')
      .update({ is_shared: true, share_id: shareId })
      .eq('id', threadId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Share error:', error);
      return NextResponse.json({ error: 'Greska pri deljenju.' }, { status: 500 });
    }

    return NextResponse.json({ shareId });
  } catch (error) {
    console.error('Share API error:', error);
    return NextResponse.json({ error: 'Greska servera.' }, { status: 500 });
  }
}
