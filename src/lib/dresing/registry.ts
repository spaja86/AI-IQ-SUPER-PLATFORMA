// SpajaUltraOmegaCore -∞Ω+∞ — DRESING
// Kompanija SPAJA — Digitalna Industrija

import type { DresingOccasion, DresingStyle } from './types';

/** Expected formality level per occasion (0–10) */
export const OCCASION_FORMALITY: Record<DresingOccasion, number> = {
  formal:   9,
  business: 7,
  evening:  7,
  casual:   3,
  outdoor:  3,
  sport:    1,
  beach:    1,
};

export const OCCASION_LABELS: Record<DresingOccasion, string> = {
  business: 'Business / Professional',
  casual:   'Casual',
  sport:    'Sport / Active',
  formal:   'Formal / Black Tie',
  beach:    'Beach / Resort',
  outdoor:  'Outdoor / Nature',
  evening:  'Evening / Gala',
};

/** Style coherence bonus per occasion */
export const STYLE_OCCASION_BONUS: Partial<Record<DresingStyle, DresingOccasion[]>> = {
  classic:     ['business', 'formal', 'evening'],
  minimalist:  ['business', 'casual', 'evening'],
  sporty:      ['sport', 'casual', 'outdoor'],
  bohemian:    ['outdoor', 'casual', 'beach'],
  streetwear:  ['casual', 'sport'],
  neutral:     ['business', 'casual', 'outdoor', 'formal', 'evening', 'sport', 'beach'],
};

export const VALID_OCCASIONS = Object.keys(OCCASION_FORMALITY) as DresingOccasion[];
export const VALID_STYLES = Object.keys(STYLE_OCCASION_BONUS) as DresingStyle[];

/** Weather adaptation text by temperature range */
export function getWeatherAdaptation(tempC: number, windKmh: number, precipitation: number): string {
  const parts: string[] = [];
  if (tempC < -10)       parts.push('heavy winter insulation (down jacket, thermal base layer)');
  else if (tempC < 5)   parts.push('warm coat and layering');
  else if (tempC < 15)  parts.push('light jacket or cardigan');
  else if (tempC < 25)  parts.push('comfortable mid-layer');
  else if (tempC < 35)  parts.push('light, breathable fabrics');
  else                   parts.push('ultra-light, moisture-wicking fabrics — extreme heat');

  if (windKmh > 40)      parts.push('windproof outer layer');
  if (precipitation > 50) parts.push('waterproof or water-resistant outerwear');

  return parts.length ? parts.join('; ') : 'No special weather adaptation required.';
}
