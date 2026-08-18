// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/read-voice
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI_CONTRACT_VERSION,
  EXTRIMLI_MODULE_VERSION,
  prepareReadVoice,
} from '@/lib/extrimli';
import type { ExtrimliReadVoiceModifier, OpenAiVoice, ReadVoiceInput } from '@/lib/extrimli';
import { getOpenAI } from '@/lib/openai/client';
import { verifyUserFromToken } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const VALID_MODIFIERS: ExtrimliReadVoiceModifier[] = ['hard', 'ultra', 'rage', 'dilit'];
const VALID_VOICES: OpenAiVoice[] = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli-Contract-Version', EXTRIMLI_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Module-Version', EXTRIMLI_MODULE_VERSION);
}

function extractModifiers(body: Record<string, unknown>): ExtrimliReadVoiceModifier[] {
  const modifiers = new Set<ExtrimliReadVoiceModifier>();

  if (typeof body.mode === 'string' && VALID_MODIFIERS.includes(body.mode as ExtrimliReadVoiceModifier)) {
    modifiers.add(body.mode as ExtrimliReadVoiceModifier);
  }

  if (Array.isArray(body.modifiers)) {
    for (const value of body.modifiers) {
      if (typeof value === 'string' && VALID_MODIFIERS.includes(value as ExtrimliReadVoiceModifier)) {
        modifiers.add(value as ExtrimliReadVoiceModifier);
      }
    }
  }

  for (const modifier of VALID_MODIFIERS) {
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
      return apiError('BAD_REQUEST', 'Invalid JSON body');
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Body must be a JSON object');
    }

    const payload = body as Record<string, unknown>;
    if (payload.text === undefined) {
      return apiError('BAD_REQUEST', 'text is required');
    }

    const voice = typeof payload.voice === 'string' && VALID_VOICES.includes(payload.voice as OpenAiVoice)
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
      const response = apiSuccess(prepared, 422);
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
      return apiError('UNAUTHORIZED', 'Niste prijavljeni.');
    }

    let buffer: Buffer;
    try {
      const openai = getOpenAI();
      const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: prepared.selectedVoice,
        input: prepared.renderedText,
      });
      buffer = Buffer.from(await mp3.arrayBuffer());
    } catch (error) {
      if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
        return apiError('CONFIGURATION_ERROR', 'EXTRIMLI read voice nije konfigurisan.');
      }
      throw error;
    }

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
    return apiInternalError('extrimli/read-voice', error);
  }
}
