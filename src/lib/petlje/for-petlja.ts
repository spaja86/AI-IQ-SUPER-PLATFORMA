import type { PetljaInput, PetljaResult } from './types';
import { baseResult, buildGuard, finalizeResult, normalizeInput, validateFiniteNumber } from './utils';

const GOAL = 'Sekvencijalno iteriranje od start do end sa kontrolisanim korakom.';

export function runForPetlja(input: PetljaInput): PetljaResult {
  const normalized = normalizeInput(input);
  const result = baseResult('FOR PETLJA', GOAL, normalized);

  const errors = [
    ...validateFiniteNumber('start', normalized.start),
    ...validateFiniteNumber('end', normalized.end),
    ...validateFiniteNumber('step', normalized.step),
  ];

  if (normalized.step === 0) errors.push('step ne sme biti 0');
  if (normalized.maxIterations < 1) errors.push('maxIterations mora biti >= 1');
  if (normalized.maxDurationMs < 0) errors.push('maxDurationMs mora biti >= 0');
  if (normalized.start < normalized.end && normalized.step < 0) errors.push('step mora biti pozitivan kada je start < end');
  if (normalized.start > normalized.end && normalized.step > 0) errors.push('step mora biti negativan kada je start > end');

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
  let sum = 0;
  let current = normalized.start;
  const ascending = normalized.step > 0;

  while ((ascending && current <= normalized.end) || (!ascending && current >= normalized.end)) {
    const decision = guard.canContinue();
    if (!decision.ok) return finalizeResult(result, guard, decision.reason!, sum, trace, []);

    guard.tick();
    sum += current;
    trace.push({ iteration: guard.getIterations(), value: current, accumulator: sum });
    current += normalized.step;
  }

  return finalizeResult(result, guard, 'completed', sum, trace, []);
}
