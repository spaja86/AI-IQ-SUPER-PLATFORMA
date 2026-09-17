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
} from './utils';

const GOAL = 'Obilazak opsega radi zaključavanja vrednosti koja je najbliža targetu bez promene izvornog smera.';

export function runOkredPetlja(input: PetljaInput): PetljaResult {
  const normalized = normalizeInput(input);
  const result = baseResult('OKRED PETLJA', GOAL, normalized);
  let status = result.status;
  const statusTrail = [...result.statusTrail];

  const errors = [
    ...validateFiniteNumber('start', normalized.start),
    ...validateFiniteNumber('end', normalized.end),
    ...validateFiniteNumber('step', normalized.step),
    ...validateFiniteNumber('target', normalized.target),
  ];

  if (normalized.step === 0) errors.push('step ne sme biti 0');
  if (normalized.maxIterations < 1) errors.push('maxIterations mora biti >= 1');
  if (normalized.maxDurationMs < 0) errors.push('maxDurationMs mora biti >= 0');
  if (normalized.start < normalized.end && normalized.step < 0) errors.push('step mora biti pozitivan kada je start < end');
  if (normalized.start > normalized.end && normalized.step > 0) errors.push('step mora biti negativan kada je start > end');

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
  let current = normalized.start;
  const ascending = normalized.step > 0;
  let bestValue = normalized.start;
  let bestDistance = Number.POSITIVE_INFINITY;
  let enteredMonster = false;

  while ((ascending && current <= normalized.end) || (!ascending && current >= normalized.end)) {
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
      return finalizeResult(result, guard, decision.reason!, bestValue, trace, [], status, statusTrail);
    }

    guard.tick();
    const distance = Math.abs(normalized.target - current);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestValue = current;
    }
    trace.push({ iteration: guard.getIterations(), value: current, accumulator: bestValue });
    current += normalized.step;
  }

  const terminal = resolveTerminalStatus('completed');
  const transition = createStatusTransition(status, terminal, 'completed', guard.getIterations());
  status = transition.status;
  statusTrail.push(transition.entry);
  return finalizeResult(result, guard, 'completed', bestValue, trace, [], status, statusTrail);
}
