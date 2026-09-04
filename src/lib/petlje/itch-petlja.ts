import type { PetljaInput, PetljaResult } from './types';
import {
  baseResult,
  buildGuard,
  createStatusTransition,
  finalizeResult,
  normalizeInput,
  resolveTerminalStatus,
  validateFiniteNumber,
} from './utils';

const GOAL = 'Iterativno približavanje ka target vrednosti uz kontrolisani korak.';

export function runItchPetlja(input: PetljaInput): PetljaResult {
  const normalized = normalizeInput(input);
  const result = baseResult('ITCH PETLJA', GOAL, normalized);
  let status = result.status;
  const statusTrail = [...result.statusTrail];

  const errors = [
    ...validateFiniteNumber('start', normalized.start),
    ...validateFiniteNumber('target', normalized.target),
    ...validateFiniteNumber('step', normalized.step),
  ];

  if (normalized.step === 0) errors.push('step ne sme biti 0');
  if (normalized.maxIterations < 1) errors.push('maxIterations mora biti >= 1');
  if (normalized.maxDurationMs < 0) errors.push('maxDurationMs mora biti >= 0');

  if (errors.length > 0) {
    const transition = createStatusTransition(status, 'DISABLED', 'invalid-input', 0);
    status = transition.status;
    statusTrail.push(transition.entry);
    return {
      ...result,
      warnings: errors,
      reason: 'invalid-input',
      completed: false,
      status,
      statusTrail,
    };
  }

  if (status !== 'ACTIVATED') {
    const transition = createStatusTransition(status, status, 'blocked-by-status', 0);
    status = transition.status;
    statusTrail.push(transition.entry);
    return {
      ...result,
      warnings: ['petlja je blokirana zbog početnog statusa'],
      reason: 'blocked-status',
      completed: false,
      status,
      statusTrail,
    };
  }

  const guard = buildGuard(normalized.maxIterations, normalized.maxDurationMs);
  const trace = [];
  const step = Math.abs(normalized.step);
  let current = normalized.start;
  let enteredMonster = false;

  while (current !== normalized.target) {
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
      return finalizeResult(result, guard, decision.reason!, current, trace, [], status, statusTrail);
    }

    guard.tick();

    if (current < normalized.target) {
      current = Math.min(current + step, normalized.target);
    } else {
      current = Math.max(current - step, normalized.target);
    }

    const traceAccumulator = trace.length > 0 ? trace[trace.length - 1].accumulator + current : current;
    trace.push({ iteration: guard.getIterations(), value: current, accumulator: traceAccumulator });
  }

  const terminal = resolveTerminalStatus('completed');
  const transition = createStatusTransition(status, terminal, 'completed', guard.getIterations());
  status = transition.status;
  statusTrail.push(transition.entry);
  return finalizeResult(result, guard, 'completed', current, trace, [], status, statusTrail);
}
