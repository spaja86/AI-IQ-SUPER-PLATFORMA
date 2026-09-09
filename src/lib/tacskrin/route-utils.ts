// SpajaUltraOmegaCore -∞Ω+∞ — TACSKRIN Route Utils
// Kompanija SPAJA — Digitalna Industrija

import { TACSKRIN_CONTRACT_VERSION, TACSKRIN_MODULE_VERSION } from './types';
import type { TacskrinInput, TacskrinResult } from './types';

export function setTacskrinHeaders(res: Response, result?: TacskrinResult): void {
  res.headers.set('X-Tacskrin-Contract-Version', TACSKRIN_CONTRACT_VERSION);
  res.headers.set('X-Tacskrin-Module-Version', TACSKRIN_MODULE_VERSION);

  if (result) {
    res.headers.set('X-Tacskrin-Valid', String(result.valid));
    res.headers.set('X-Tacskrin-Status', result.status);
    res.headers.set('X-Tacskrin-Equivalent', String(result.equivalent));
  }
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every((entry) => typeof entry === 'string' && entry.trim().length > 0);
}

export function validateTacskrinRequestShape(candidate: Record<string, unknown>): string | null {
  const { referenceId, projectionExpression, layers, signalStrength, strictOrder } = candidate;

  if (referenceId !== undefined && typeof referenceId !== 'string') return 'referenceId must be a string';
  if (projectionExpression !== undefined && typeof projectionExpression !== 'string') return 'projectionExpression must be a string';
  if (projectionExpression === '') return 'projectionExpression must be a non-empty string';

  if (layers !== undefined) {
    if (!Array.isArray(layers)) return 'layers must be an array of non-empty strings';
    if (layers.some((entry) => typeof entry !== 'string' || entry.trim().length === 0)) {
      return 'layers must contain only non-empty strings';
    }
  }

  const hasExpression = typeof projectionExpression === 'string' && projectionExpression.trim().length > 0;
  const hasLayers = isNonEmptyStringArray(layers);

  if (!hasExpression && !hasLayers) {
    return 'projectionExpression or layers is required';
  }

  if (signalStrength !== undefined) {
    if (typeof signalStrength !== 'number') return 'signalStrength must be a number';
    if (!Number.isFinite(signalStrength)) return 'signalStrength must be a finite number';
  }

  if (strictOrder !== undefined && typeof strictOrder !== 'boolean') {
    return 'strictOrder must be a boolean';
  }

  return null;
}

export function mapTacskrinInput(candidate: Record<string, unknown>): TacskrinInput {
  const { referenceId, projectionExpression, layers, signalStrength, strictOrder } = candidate;

  return {
    referenceId: typeof referenceId === 'string' ? referenceId : undefined,
    projectionExpression: typeof projectionExpression === 'string' ? projectionExpression : undefined,
    layers: Array.isArray(layers) ? (layers as string[]) : undefined,
    signalStrength: typeof signalStrength === 'number' ? signalStrength : undefined,
    strictOrder: typeof strictOrder === 'boolean' ? strictOrder : undefined,
  };
}
