// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

import type { RawWeatherData, WeatherRiskFactors } from './types';
import { clamp, round } from './utils';

/**
 * Normalises raw weather data into EXTRIMLI risk factors.
 *
 * Wind risk modifier  : 0 (calm) → 10 (hurricane) based on wind speed
 * Terrain risk modifier: precipitation (rain/snow) drives slippery ground risk
 * Gear recommendation : temperature-based layering guidance
 * Overall weather score: weighted composite (wind 40%, precipitation 35%, visibility 25%)
 */
export function adaptWeather(data: RawWeatherData): WeatherRiskFactors {
  const warnings: string[] = [];

  const wind    = typeof data.windSpeedKph    === 'number' && Number.isFinite(data.windSpeedKph)    ? data.windSpeedKph    : null;
  const precip  = typeof data.precipitationMm === 'number' && Number.isFinite(data.precipitationMm) ? data.precipitationMm : null;
  const temp    = typeof data.temperatureC    === 'number' && Number.isFinite(data.temperatureC)    ? data.temperatureC    : null;
  const vis     = typeof data.visibilityKm    === 'number' && Number.isFinite(data.visibilityKm)    ? data.visibilityKm    : null;

  if (wind === null)   warnings.push('windSpeedKph missing — using neutral value');
  if (precip === null) warnings.push('precipitationMm missing — using neutral value');
  if (temp === null)   warnings.push('temperatureC missing — gear recommendation unavailable');
  if (vis === null)    warnings.push('visibilityKm missing — using neutral value');

  // Wind risk: 0 kph → 0, 120+ kph → 10
  const windRiskModifier = round(clamp((wind ?? 0) / 12, 0, 10), 2);

  // Terrain risk: 0 mm → 0, 50+ mm → 10
  const terrainRiskModifier = round(clamp((precip ?? 0) / 5, 0, 10), 2);

  // Visibility risk: 10+ km → 0, 0 km → 10
  const visRisk = round(clamp(10 - (vis ?? 10), 0, 10), 2);

  const overallWeatherScore = round(
    windRiskModifier * 0.40 +
    terrainRiskModifier * 0.35 +
    visRisk * 0.25,
    2
  );

  let gearRecommendation = 'Standard gear required.';
  if (temp !== null) {
    if (temp < -10) {
      gearRecommendation = 'Extreme cold — full thermal insulation, wind-proof outer layer, face protection essential.';
    } else if (temp < 0) {
      gearRecommendation = 'Cold conditions — insulated base layer and waterproof outer layer required.';
    } else if (temp < 10) {
      gearRecommendation = 'Cool conditions — layered clothing recommended, light gloves advisable.';
    } else if (temp < 25) {
      gearRecommendation = 'Comfortable temperature — standard sport gear appropriate.';
    } else {
      gearRecommendation = 'Hot conditions — lightweight breathable gear, hydration pack recommended.';
    }
  }

  const valid = wind !== null && precip !== null;

  return {
    windRiskModifier,
    terrainRiskModifier,
    gearRecommendation,
    overallWeatherScore,
    valid,
    warnings,
  };
}
