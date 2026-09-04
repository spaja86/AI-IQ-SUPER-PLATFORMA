// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

/** Clamps a number to [min, max]. Returns min for NaN, max for Infinity, min for -Infinity. */
export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  if (value === Infinity)  return max;
  if (value === -Infinity) return min;
  return Math.max(min, Math.min(max, value));
}

/** Rounds to given decimal places. */
export function round(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/** Converts miles-per-hour to kilometres-per-hour. */
export function mphToKph(mph: number): number {
  if (!Number.isFinite(mph) || mph < 0) return 0;
  return round(mph * 1.60934);
}

/** Converts kilometres-per-hour to miles-per-hour. */
export function kphToMph(kph: number): number {
  if (!Number.isFinite(kph) || kph < 0) return 0;
  return round(kph / 1.60934);
}

/** Converts feet to metres. */
export function ftToM(ft: number): number {
  if (!Number.isFinite(ft) || ft < 0) return 0;
  return round(ft * 0.3048);
}

/** Converts metres to feet. */
export function mToFt(m: number): number {
  if (!Number.isFinite(m) || m < 0) return 0;
  return round(m / 0.3048);
}

/** Validates that a value is a finite number >= 0. */
export function isValidNonNegative(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/** Validates that a value is within [min, max] inclusive. */
export function isInRange(value: unknown, min: number, max: number): value is number {
  return isValidNonNegative(value) && (value as number) >= min && (value as number) <= max;
}

/** Returns a safe SKU string (alphanumeric + dash/underscore, 3–32 chars). */
export function isValidSku(sku: unknown): sku is string {
  return (
    typeof sku === 'string' &&
    /^[A-Za-z0-9_-]{3,32}$/.test(sku)
  );
}
