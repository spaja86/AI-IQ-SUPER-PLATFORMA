import type { PetljaInput, PetljaResult } from './types';
import { baseResult, buildGuard, finalizeResult, normalizeInput, validateSequence } from './utils';

const GOAL = 'Linearna obrada ulazne sekvence sa determinističkim sabiranjem.';

export function runUrPelja(input: PetljaInput): PetljaResult {
  const normalized = normalizeInput(input);
  const result = baseResult('UR PELJA', GOAL, normalized);

  const errors = [
    ...validateSequence(normalized.sequence),
  ];

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

  for (const value of normalized.sequence) {
    const decision = guard.canContinue();
    if (!decision.ok) return finalizeResult(result, guard, decision.reason!, accumulator, trace, []);

    guard.tick();
    accumulator += value;
    trace.push({ iteration: guard.getIterations(), value, accumulator });
  }

  return finalizeResult(result, guard, 'completed', accumulator, trace, []);
}
