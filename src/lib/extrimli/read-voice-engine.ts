// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI Read Voice
// Kompanija SPAJA — Digitalna Industrija

import type {
  ExtrimliReadVoiceLocale,
  ExtrimliReadVoiceModifier,
  OpenAiVoice,
  ReadVoiceInput,
  ReadVoicePreview,
} from './types';

export const EXTRIMLI_READ_VOICE_MODIFIERS: ExtrimliReadVoiceModifier[] = ['hard', 'ultra', 'rage', 'dilit'];
export const EXTRIMLI_READ_VOICE_VOICES: OpenAiVoice[] = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

function normalizeModifiers(input: ReadVoiceInput['modifiers']): ExtrimliReadVoiceModifier[] {
  if (!Array.isArray(input)) return [];

  const seen = new Set<ExtrimliReadVoiceModifier>();
  for (const modifier of input) {
    if (EXTRIMLI_READ_VOICE_MODIFIERS.includes(modifier) && !seen.has(modifier)) {
      seen.add(modifier);
    }
  }
  return [...seen];
}

function selectVoice(modifiers: ExtrimliReadVoiceModifier[], voice?: OpenAiVoice): OpenAiVoice {
  if (voice && EXTRIMLI_READ_VOICE_VOICES.includes(voice)) return voice;
  if (modifiers.includes('rage')) return 'onyx';
  if (modifiers.includes('ultra')) return 'nova';
  if (modifiers.includes('hard')) return 'echo';
  if (modifiers.includes('dilit')) return 'shimmer';
  return 'alloy';
}

function resolveLocale(locale?: ExtrimliReadVoiceLocale): ExtrimliReadVoiceLocale {
  return locale === 'en' ? 'en' : 'sr';
}

export function prepareReadVoice(input: ReadVoiceInput): ReadVoicePreview {
  const startedAt = Date.now();
  const warnings: string[] = [];
  const text = typeof input.text === 'string' ? input.text.trim() : '';
  const modifiers = normalizeModifiers(input.modifiers);
  const locale = resolveLocale(input.locale);

  if (!text) {
    warnings.push('text is required');
  }
  if (text.length > 4096) {
    warnings.push('text exceeds the 4096 character limit');
  }

  const selectedVoice = selectVoice(modifiers, input.voice);
  const requestLabel = ['EXTRIMLI', ...modifiers.map((modifier) => modifier.toUpperCase())].join(' ');
  const intro = modifiers.length === 0
    ? ''
    : locale === 'en'
      ? `${requestLabel} voice read. `
      : `${requestLabel} glasovno čitanje. `;

  return {
    requestLabel,
    renderedText: `${intro}${text}`.trim(),
    selectedVoice,
    locale,
    modifiers,
    valid: warnings.length === 0,
    warnings,
    durationMs: Date.now() - startedAt,
  };
}
