import type { PetljaInput, PetljaReason, PetljaResult, PetljaStatus } from './types';
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
import { runUmbrelPetlja } from './umbrel-petlja';

const GOAL =
  'Planinsko širenje od vrha ka podnožju uz ugrađeni UMBREL sloj koji u sebi nosi sve petlje.';

function resolveAggregateState(umbrella: PetljaResult): { reason: PetljaReason; status: PetljaStatus } {
  if (!umbrella.completed) {
    return {
      reason: umbrella.reason,
      status: umbrella.status,
    };
  }

  return { reason: 'completed', status: umbrella.status };
}

export function runDurmitorPetlja(input: PetljaInput): PetljaResult {
  const normalized = normalizeInput(input);
  const result = baseResult('DURMITOR PETLJA', GOAL, normalized);
  let status = result.status;
  const statusTrail = [...result.statusTrail];

  const errors = [
    ...validateFiniteNumber('start', normalized.start),
    ...validateFiniteNumber('end', normalized.end),
    ...validateFiniteNumber('step', normalized.step),
    ...validateFiniteNumber('target', normalized.target),
    ...validateSequence(normalized.sequence),
  ];

  if (normalized.step === 0) errors.push('step ne sme biti 0');
  if (!Number.isFinite(normalized.maxIterations)) errors.push('maxIterations mora biti konačan');
  if (!Number.isFinite(normalized.maxDurationMs)) errors.push('maxDurationMs mora biti konačan');
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

  const startTransition = createStatusTransition(status, 'MONSTER', 'execution-start', 0);
  status = startTransition.status;
  statusTrail.push(startTransition.entry);

  const guard = buildGuard(normalized.maxIterations, normalized.maxDurationMs);
  const umbrella = runUmbrelPetlja(normalized);
  for (let i = 0; i < umbrella.iterations; i += 1) guard.tick();
  statusTrail.push(
    ...umbrella.statusTrail.map((entry) => ({
      ...entry,
      reason: `[UMBREL PETLJA] ${entry.reason}`,
    })),
  );

  const warnings = umbrella.warnings.map((warning) => `[UMBREL PETLJA] ${warning}`);
  const trace = [];
  const landscapeWeight = normalized.sequence.length + 5;
  const ascending = normalized.step > 0;
  let current = normalized.start;
  let output = 0;
  let layerCount = 0;

  while ((ascending && current <= normalized.end) || (!ascending && current >= normalized.end)) {
    const decision = guard.canContinue();
    if (!decision.ok) {
      const terminal = resolveTerminalStatus(decision.reason!);
      const transition = createStatusTransition(status, terminal, `guard-stop:${decision.reason}`, guard.getIterations());
      status = transition.status;
      statusTrail.push(transition.entry);
      return finalizeResult(result, guard, decision.reason!, output + (Number.isFinite(umbrella.output) ? umbrella.output : 0), trace, warnings, status, statusTrail);
    }

    guard.tick();
    const layerWidth = ++layerCount;
    const layerValue = (Math.abs(current) + landscapeWeight) * layerWidth;
    output += layerValue;
    trace.push({ iteration: guard.getIterations(), value: layerValue, accumulator: output });
    current += normalized.step;
  }

  const aggregateState = resolveAggregateState(umbrella);
  const transition = createStatusTransition(
    status,
    aggregateState.status,
    aggregateState.reason,
    guard.getIterations(),
  );
  status = transition.status;
  statusTrail.push(transition.entry);

  return finalizeResult(
    result,
    guard,
    aggregateState.reason,
    output + (Number.isFinite(umbrella.output) ? umbrella.output : 0),
    trace,
    warnings,
    status,
    statusTrail,
  );
}
