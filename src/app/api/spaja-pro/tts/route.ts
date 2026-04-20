// SpajaUltraOmegaCore -∞Ω+∞ — Text-to-Speech API
// POST /api/spaja-pro/tts — konvertuje tekst u govor (OpenAI TTS)

import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai/client';
import { verifyUserFromToken } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = (await request.json()) as { text?: string; voice?: string };
    const { text, voice = 'alloy' } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Tekst je obavezan.' }, { status: 400 });
    }

    if (text.length > 4096) {
      return NextResponse.json({ error: 'Tekst je predug (max 4096 karaktera).' }, { status: 400 });
    }

    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    const selectedVoice = validVoices.includes(voice) ? voice : 'alloy';

    const openai = getOpenAI();
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: selectedVoice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(buffer.length),
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json({ error: 'Greska pri generisanju govora.' }, { status: 500 });
  }
}
