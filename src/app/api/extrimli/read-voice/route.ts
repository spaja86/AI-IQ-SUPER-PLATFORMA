// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/read-voice
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI_CONTRACT_VERSION,
  EXTRIMLI_MODULE_VERSION,
  EXTRIMLI_READ_VOICE_MODIFIERS,
  EXTRIMLI_READ_VOICE_VOICES,
  prepareReadVoice,
} from '@/lib/extrimli';
import type { ExtrimliReadVoiceModifier, OpenAiVoice, ReadVoiceInput } from '@/lib/extrimli';
import { getOpenAI } from '@/lib/openai/client';
import { verifyUserFromToken } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli-Contract-Version', EXTRIMLI_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Module-Version', EXTRIMLI_MODULE_VERSION);
}

function extractModifiers(body: Record<string, unknown>): ExtrimliReadVoiceModifier[] {
  const modifiers = new Set<ExtrimliReadVoiceModifier>();

  if (typeof body.mode === 'string' && EXTRIMLI_READ_VOICE_MODIFIERS.includes(body.mode as ExtrimliReadVoiceModifier)) {
    modifiers.add(body.mode as ExtrimliReadVoiceModifier);
  }

  if (Array.isArray(body.modifiers)) {
    for (const value of body.modifiers) {
      if (typeof value === 'string' && EXTRIMLI_READ_VOICE_MODIFIERS.includes(value as ExtrimliReadVoiceModifier)) {
        modifiers.add(value as ExtrimliReadVoiceModifier);
      }
    }
  }

  for (const modifier of EXTRIMLI_READ_VOICE_MODIFIERS) {
    if (body[modifier] === true) modifiers.add(modifier);
  }

  return [...modifiers];
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      const response = apiError('BAD_REQUEST', 'Invalid JSON body');
      setHeaders(response);
      return response;
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      const response = apiError('BAD_REQUEST', 'Body must be a JSON object');
      setHeaders(response);
      return response;
    }

    const payload = body as Record<string, unknown>;
    if (payload.text === undefined) {
      const response = apiError('BAD_REQUEST', 'text is required');
      setHeaders(response);
      return response;
    }

    const voice = typeof payload.voice === 'string' && EXTRIMLI_READ_VOICE_VOICES.includes(payload.voice as OpenAiVoice)
      ? payload.voice as OpenAiVoice
      : undefined;

    const input: ReadVoiceInput = {
      text: typeof payload.text === 'string' ? payload.text : String(payload.text ?? ''),
      modifiers: extractModifiers(payload),
      voice,
      locale: payload.locale === 'en' ? 'en' : 'sr',
      preview: payload.preview === true,
    };

    const prepared = prepareReadVoice(input);
    if (!prepared.valid) {
      const response = apiError(
        'UNPROCESSABLE_ENTITY',
        prepared.warnings[0] ?? 'Invalid EXTRIMLI read voice input.',
        prepared,
      );
      setHeaders(response);
      return response;
    }

    if (input.preview) {
      const response = apiSuccess(prepared, 200);
      setHeaders(response);
      return response;
    }

    const user = await verifyUserFromToken(req.headers.get('authorization'));
    if (!user) {
      const response = apiError('UNAUTHORIZED', 'Niste prijavljeni.');
      setHeaders(response);
      return response;
    }

    if (!process.env.OPENAI_API_KEY) {
      const response = apiError('CONFIGURATION_ERROR', 'EXTRIMLI read voice nije konfigurisan.');
      setHeaders(response);
      return response;
    }

    const openai = getOpenAI();
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: prepared.selectedVoice,
      input: prepared.renderedText,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());

    const response = new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(buffer.length),
      },
    });
    setHeaders(response);
    response.headers.set('X-Extrimli-Read-Voice-Label', prepared.requestLabel);
    response.headers.set('X-Extrimli-Read-Voice-Modifiers', prepared.modifiers.join(','));
    response.headers.set('X-Extrimli-Read-Voice-Voice', prepared.selectedVoice);
    return response;
  } catch (error) {
    const response = apiInternalError('extrimli/read-voice', error);
    setHeaders(response);
    return response;
  }
}
