import type { PetljaInput, PetljaResult } from './types';
import {
  baseResult,
  buildGuard,
  createStatusTransition,
  finalizeResult,
  normalizeInput,
  resolveTerminalStatus,
  validateSequence,
} from './utils';

const GOAL = 'Linearna obrada ulazne sekvence sa determinističkim sabiranjem.';

export function runUrPelja(input: PetljaInput): PetljaResult {
  const normalized = normalizeInput(input);
  const result = baseResult('UR PELJA', GOAL, normalized);
  let status = result.status;
  const statusTrail = [...result.statusTrail];

  const errors = [
    ...validateSequence(normalized.sequence),
  ];

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
      return finalizeResult(result, guard, decision.reason!, accumulator, trace, [], status, statusTrail);
    }

    guard.tick();
    accumulator += value;
    trace.push({ iteration: guard.getIterations(), value, accumulator });
  }

  const terminal = resolveTerminalStatus('completed');
  const transition = createStatusTransition(status, terminal, 'completed', guard.getIterations());
  status = transition.status;
  statusTrail.push(transition.entry);
  return finalizeResult(result, guard, 'completed', accumulator, trace, [], status, statusTrail);
}
