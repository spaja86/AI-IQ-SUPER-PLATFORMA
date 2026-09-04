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

const GOAL = 'Obrnuto odbrojavanje od start vrednosti ka end vrednosti.';

export function runNikPetlja(input: PetljaInput): PetljaResult {
  const normalized = normalizeInput(input);
  const result = baseResult('NIK PETLJA', GOAL, normalized);
  let status = result.status;
  const statusTrail = [...result.statusTrail];

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

  if (status === 'DISABLED' || status === 'DEAD') {
    const transition = createStatusTransition(status, status, 'blocked-by-status', 0);
    status = transition.status;
    statusTrail.push(transition.entry);
    return {
      ...result,
      warnings: ['petlja je blokirana zbog početnog statusa'],
      reason: 'invalid-input',
      completed: false,
      status,
      statusTrail,
    };
  }

  const guard = buildGuard(normalized.maxIterations, normalized.maxDurationMs);
  const trace = [];
  let accumulator = 0;
  let current = normalized.start;
  let enteredMonster = false;

  while (current >= normalized.end) {
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
      return finalizeResult(result, guard, decision.reason!, accumulator, trace, [], status, statusTrail);
    }

    guard.tick();
    accumulator += current;
    trace.push({ iteration: guard.getIterations(), value: current, accumulator });
    current -= normalized.step;
  }

  const terminal = resolveTerminalStatus('completed');
  const transition = createStatusTransition(status, terminal, 'completed', guard.getIterations());
  status = transition.status;
  statusTrail.push(transition.entry);
  return finalizeResult(result, guard, 'completed', accumulator, trace, [], status, statusTrail);
}
