import type { PetljaInput, PetljaResult } from './types';
import { baseResult, buildGuard, finalizeResult, normalizeInput, validateFiniteNumber } from './utils';

const GOAL = 'Obrnuto odbrojavanje od start vrednosti ka end vrednosti.';

export function runNikPetlja(input: PetljaInput): PetljaResult {
  const normalized = normalizeInput(input);
  const result = baseResult('NIK PETLJA', GOAL, normalized);

  const errors = [
    ...validateFiniteNumber('start', normalized.start),
    ...validateFiniteNumber('end', normalized.end),
    ...validateFiniteNumber('step', normalized.step),
  ];

  if (normalized.step === 0) errors.push('step ne sme biti 0');
  if (normalized.step < 0) errors.push('step mora biti pozitivan za NIK PETLJU');
  if (normalized.start < normalized.end) errors.push('start mora biti >= end za NIK PETLJU');
  if (normalized.maxIterations < 1) errors.push('maxIterations mora biti >= 1');
  if (normalized.maxDurationMs < 0) errors.push('maxDurationMs mora biti >= 0');

  if (errors.length > 0) {
    return {
      ...result,
      warnings: errors,
      reason: 'invalid-input',
      completed: false,
    };
  }

  const guard = buildGuard(normalized.maxIterations, normalized.maxDurationMs);
  const trace = [];
  let accumulator = 0;
  let current = normalized.start;

  while (current >= normalized.end) {
    const decision = guard.canContinue();
    if (!decision.ok) return finalizeResult(result, guard, decision.reason!, accumulator, trace, []);

    guard.tick();
    accumulator += current;
    trace.push({ iteration: guard.getIterations(), value: current, accumulator });
    current -= normalized.step;
  }

  return finalizeResult(result, guard, 'completed', accumulator, trace, []);
}
