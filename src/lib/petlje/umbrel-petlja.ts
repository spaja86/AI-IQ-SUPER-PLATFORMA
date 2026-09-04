import type { PetljaInput, PetljaResult } from './types';
import { baseResult, createStatusTransition, normalizeInput } from './utils';
import { runForPetlja } from './for-petlja';
import { runItchPetlja } from './itch-petlja';
import { runUrPelja } from './ur-pelja';
import { runNikPetlja } from './nik-petlja';

const GOAL = 'Orkestracija svih petlji kroz jedinstven, stabilan i auditabilan rezultat.';

export function runUmbrelPetlja(input: PetljaInput): PetljaResult {
  const normalized = normalizeInput(input);
  const result = baseResult('UMBREL PETLJA', GOAL, normalized);
  let status = result.status;
  const statusTrail = [...result.statusTrail];

  if (status !== 'ACTIVATED') {
    const transition = createStatusTransition(status, status, 'blocked-by-status', 0);
    status = transition.status;
    statusTrail.push(transition.entry);
    return {
      ...result,
      status,
      statusTrail,
      reason: 'blocked-status',
      completed: false,
      warnings: ['petlja je blokirana zbog početnog statusa'],
    };
  }

  const startTransition = createStatusTransition(status, 'MONSTER', 'execution-start', 0);
  status = startTransition.status;
  statusTrail.push(startTransition.entry);

  const forResult = runForPetlja(normalized);
  const itchResult = runItchPetlja(normalized);
  const urResult = runUrPelja(normalized);
  const nikResult = runNikPetlja(normalized);

  const parts = [forResult, itchResult, urResult, nikResult];
  const warnings = parts.flatMap((p) => p.warnings.map((w) => `[${p.kind}] ${w}`));
  const completed = parts.every((p) => p.completed);
  const partStatuses = parts.map((p) => p.status);
  const mergedTrails = parts
    .flatMap((p, runnerOrder) => p.statusTrail.map((entry) => ({
      ...entry,
      reason: `[${p.kind}] ${entry.reason}`,
      runnerOrder,
    })))
    .sort((a, b) => a.iteration - b.iteration || a.runnerOrder - b.runnerOrder);

  const aggregateStatus =
    partStatuses.includes('DEAD') ? 'DEAD'
      : partStatuses.includes('DISABLED') ? 'DISABLED'
      : partStatuses.includes('MONSTER') ? 'MONSTER'
      : 'ACTIVATED';
  statusTrail.push(...mergedTrails.map(({ runnerOrder: _runnerOrder, ...entry }) => entry));
  const transition = createStatusTransition(status, aggregateStatus, 'umbrella-aggregate', parts.reduce((acc, p) => acc + p.iterations, 0));
  status = transition.status;
  statusTrail.push(transition.entry);

  return {
    ...result,
    status,
    statusTrail,
    output: parts.reduce((acc, p) => acc + p.output, 0),
    iterations: parts.reduce((acc, p) => acc + p.iterations, 0),
    completed,
    reason: completed ? 'completed' : (parts.find((p) => !p.completed)?.reason ?? 'invalid-input'),
    warnings,
    durationMs: parts.reduce((acc, p) => acc + p.durationMs, 0),
    trace: [
      { iteration: 1, value: forResult.output, accumulator: forResult.output },
      { iteration: 2, value: itchResult.output, accumulator: forResult.output + itchResult.output },
      { iteration: 3, value: urResult.output, accumulator: forResult.output + itchResult.output + urResult.output },
      { iteration: 4, value: nikResult.output, accumulator: forResult.output + itchResult.output + urResult.output + nikResult.output },
    ],
  };
}
