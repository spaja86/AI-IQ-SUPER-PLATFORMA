// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI Motion Contract
// Kompanija SPAJA — Digitalna Industrija

export const EXTRIMLI_MOTION_ALIAS = 'NIKOGEN_ODRT_KIGON_DIHROT_UKAN' as const;
export const EXTRIMLI_MOTION_LAYER_VERSION = 'v1-motion-layer' as const;

export type ExtrimliMotionType = 'orbital' | 'axis-rotate';
export type ExtrimliMotionIntensity = 'low' | 'medium' | 'high';
export type ExtrimliMotionMode = 'full' | 'paused' | 'reduced';

interface BaseMotionPreset {
  durationSec: number;
  direction: 'normal' | 'reverse';
  amplitudePx: number;
  sizePx: number;
}

const MOTION_PRESETS: Record<ExtrimliMotionIntensity, BaseMotionPreset> = {
  low: {
    durationSec: 12,
    direction: 'normal',
    amplitudePx: 3,
    sizePx: 16,
  },
  medium: {
    durationSec: 8,
    direction: 'normal',
    amplitudePx: 5,
    sizePx: 18,
  },
  high: {
    durationSec: 5,
    direction: 'reverse',
    amplitudePx: 7,
    sizePx: 20,
  },
};

export interface ExtrimliMotionGuardrails {
  maxSimultaneousItems: number;
  transformOnly: true;
}

export const EXTRIMLI_MOTION_GUARDRAILS: ExtrimliMotionGuardrails = {
  maxSimultaneousItems: 6,
  transformOnly: true,
};

export interface ExtrimliMotionRequest {
  type: ExtrimliMotionType;
  intensity?: ExtrimliMotionIntensity;
  mode?: ExtrimliMotionMode;
  itemIndex?: number;
  maxAnimatedItems?: number;
}

export interface ExtrimliMotionResolved {
  animate: boolean;
  type: ExtrimliMotionType;
  durationSec: number;
  direction: 'normal' | 'reverse';
  amplitudePx: number;
  sizePx: number;
  playState: 'running' | 'paused';
}

export function resolveExtrimliMotion(request: ExtrimliMotionRequest): ExtrimliMotionResolved {
  const intensity = request.intensity ?? 'medium';
  const mode = request.mode ?? 'full';
  const preset = MOTION_PRESETS[intensity];
  const maxAnimatedItems = request.maxAnimatedItems ?? EXTRIMLI_MOTION_GUARDRAILS.maxSimultaneousItems;
  const itemIndex = request.itemIndex ?? 0;
  const withinGuardrail = itemIndex < maxAnimatedItems;
  const animate = mode === 'full' && withinGuardrail;

  return {
    animate,
    type: request.type,
    durationSec: preset.durationSec,
    direction: preset.direction,
    amplitudePx: preset.amplitudePx,
    sizePx: preset.sizePx,
    playState: mode === 'paused' ? 'paused' : 'running',
  };
}

export function resolveMotionMode(prefersReducedMotion: boolean, requested: ExtrimliMotionMode): ExtrimliMotionMode {
  if (prefersReducedMotion && requested === 'full') {
    return 'reduced';
  }

  return requested;
}
