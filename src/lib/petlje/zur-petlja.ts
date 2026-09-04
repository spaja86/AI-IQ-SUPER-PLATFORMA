import type { PetljaInput, PetljaResult } from './types';
import {
  baseResult,
  blockedPetljaResult,
  buildGuard,
  createStatusTransition,
  finalizeResult,
  invalidPetljaResult,
  normalizeInput,
  resolveTerminalStatus,
  validateFiniteNumber,
  validateSequence,
} from './utils';

const GOAL = 'Pronalaženje elementa sekvence koji je najbliži target vrednosti.';

export function runZurPetlja(input: PetljaInput): PetljaResult {
  const normalized = normalizeInput(input);
  const result = baseResult('ZUR PETLJA', GOAL, normalized);
  let status = result.status;
  const statusTrail = [...result.statusTrail];

  const errors = [
    ...validateSequence(normalized.sequence),
    ...validateFiniteNumber('target', normalized.target),
  ];

  if (normalized.maxIterations < 1) errors.push('maxIterations mora biti >= 1');
  if (normalized.maxDurationMs < 0) errors.push('maxDurationMs mora biti >= 0');

  if (errors.length > 0) {
    const transition = createStatusTransition(status, 'DISABLED', 'invalid-input', 0);
    status = transition.status;
    statusTrail.push(transition.entry);
    return invalidPetljaResult(result, status, statusTrail, errors);
  }

  if (status !== 'ACTIVATED') {
    const transition = createStatusTransition(status, status, 'blocked-by-status', 0);
    status = transition.status;
    statusTrail.push(transition.entry);
    return blockedPetljaResult(result, status, statusTrail);
  }

  const guard = buildGuard(normalized.maxIterations, normalized.maxDurationMs);
  const trace = [];
  let bestValue = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  let enteredMonster = false;

  for (const value of normalized.sequence) {
    if (!enteredMonster) {
      const transition = createStatusTransition(status, 'MONSTER', 'execution-start', guard.getIterations());
      status = transition.status;
      statusTrail.push(transition.entry);
      enteredMonster = true;
    }

    const decision = guard.canContinue();
    if (!decision.ok) {
      const terminal = resolveTerminalStatus(decision.reason!);
      const transition = createStatusTransition(status, terminal, `guard-stop:${decision.reason}`, guard.getIterations());
      status = transition.status;
      statusTrail.push(transition.entry);
      return finalizeResult(result, guard, decision.reason!, bestDistance === Number.POSITIVE_INFINITY ? 0 : bestValue, trace, [], status, statusTrail);
    }

    guard.tick();
    const distance = Math.abs(normalized.target - value);
    if (distance < bestDistance || (distance === bestDistance && value < bestValue)) {
      bestDistance = distance;
      bestValue = value;
    }
    trace.push({ iteration: guard.getIterations(), value, accumulator: bestDistance === Number.POSITIVE_INFINITY ? 0 : bestValue });
  }

  const terminal = resolveTerminalStatus('completed');
  const transition = createStatusTransition(status, terminal, 'completed', guard.getIterations());
  status = transition.status;
  statusTrail.push(transition.entry);
  return finalizeResult(result, guard, 'completed', bestDistance === Number.POSITIVE_INFINITY ? 0 : bestValue, trace, [], status, statusTrail);
}
