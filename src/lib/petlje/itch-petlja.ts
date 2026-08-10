import type { PetljaInput, PetljaResult } from './types';
import { baseResult, buildGuard, finalizeResult, normalizeInput, validateFiniteNumber } from './utils';

const GOAL = 'Iterativno približavanje ka target vrednosti uz kontrolisani korak.';

export function runItchPetlja(input: PetljaInput): PetljaResult {
  const normalized = normalizeInput(input);
  const result = baseResult('ITCH PETLJA', GOAL, normalized);

  const errors = [
    ...validateFiniteNumber('start', normalized.start),
    ...validateFiniteNumber('target', normalized.target),
    ...validateFiniteNumber('step', normalized.step),
  ];

  if (normalized.step === 0) errors.push('step ne sme biti 0');
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
  const step = Math.abs(normalized.step);
  let current = normalized.start;

  while (current !== normalized.target) {
    const decision = guard.canContinue();
    if (!decision.ok) return finalizeResult(result, guard, decision.reason!, current, trace, []);

    guard.tick();

    if (current < normalized.target) {
      current = Math.min(current + step, normalized.target);
    } else {
      current = Math.max(current - step, normalized.target);
    }

    const traceAccumulator = trace.length > 0 ? trace[trace.length - 1].accumulator + current : current;
    trace.push({ iteration: guard.getIterations(), value: current, accumulator: traceAccumulator });
  }

  return finalizeResult(result, guard, 'completed', current, trace, []);
}
