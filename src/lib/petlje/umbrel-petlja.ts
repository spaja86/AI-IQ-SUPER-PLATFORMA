import type { PetljaInput, PetljaResult } from './types';
import { baseResult, createStatusTransition, normalizeInput } from './utils';
import { runForPetlja } from './for-petlja';
import { runItchPetlja } from './itch-petlja';
import { runUrPelja } from './ur-pelja';
import { runNikPetlja } from './nik-petlja';
import { runDorPetlja } from './dor-petlja';
import { runExePetlja } from './exe-petlja';
import { runKurPetlja } from './kur-petlja';
import { runDarPetlja } from './dar-petlja';
import { runYuPetlja } from './yu-petlja';
import { runZarPetlja } from './zar-petlja';
import { runDerPetlja } from './der-petlja';
import { runGarPetlja } from './gar-petlja';
import { runZurPetlja } from './zur-petlja';
import { runIziPetlja } from './izi-petlja';
import { runUkPetlja } from './uk-petlja';
import { runZumPetlja } from './zum-petlja';

const GOAL = 'Orkestracija svih petlji kroz jedinstven, stabilan i auditabilan rezultat.';

function aggregateParts(parts: PetljaResult[]) {
  const warnings: string[] = [];
  const safeOutputs: number[] = [];
  let completed = true;
  let hasDead = false;
  let hasDisabled = false;
  let hasMonster = false;
  let totalOutput = 0;
  let totalIterations = 0;
  let totalDurationMs = 0;
  let firstDeadReason: 'max-iterations' | 'time-limit' | undefined;
  let firstDisabledReason: 'invalid-input' | 'blocked-status' | undefined;
  let firstIncompleteReason: PetljaResult['reason'] | undefined;

  for (const part of parts) {
    completed = completed && part.completed;
    hasDead = hasDead || part.status === 'DEAD';
    hasDisabled = hasDisabled || part.status === 'DISABLED';
    hasMonster = hasMonster || part.status === 'MONSTER';
    totalIterations += part.iterations;
    totalDurationMs += part.durationMs;

    const safeOutput = Number.isFinite(part.output) ? part.output : 0;
    safeOutputs.push(safeOutput);
    totalOutput += safeOutput;

    for (const warning of part.warnings) {
      warnings.push(`[${part.kind}] ${warning}`);
    }

    if (!firstIncompleteReason && !part.completed) {
      firstIncompleteReason = part.reason;
    }

    if (!firstDeadReason && part.status === 'DEAD' && (part.reason === 'max-iterations' || part.reason === 'time-limit')) {
      firstDeadReason = part.reason;
    }

    if (!firstDisabledReason && part.status === 'DISABLED' && (part.reason === 'invalid-input' || part.reason === 'blocked-status')) {
      firstDisabledReason = part.reason;
    }
  }

  const status =
    hasDead ? 'DEAD'
      : hasDisabled ? 'DISABLED'
      : hasMonster ? 'MONSTER'
      : 'ACTIVATED';
  const reason =
    status === 'DEAD'
      ? (firstDeadReason ?? 'max-iterations')
      : status === 'DISABLED'
        ? (firstDisabledReason ?? firstIncompleteReason ?? 'invalid-input')
        : completed
          ? 'completed'
          : (firstIncompleteReason ?? 'max-iterations');

  return {
    completed,
    status,
    reason,
    warnings,
    safeOutputs,
    totalOutput,
    totalIterations,
    totalDurationMs,
  };
}

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
  const dorResult = runDorPetlja(normalized);
  const exeResult = runExePetlja(normalized);
  const kurResult = runKurPetlja(normalized);
  const darResult = runDarPetlja(normalized);
  const yuResult = runYuPetlja(normalized);
  const zarResult = runZarPetlja(normalized);
  const derResult = runDerPetlja(normalized);
  const garResult = runGarPetlja(normalized);
  const zurResult = runZurPetlja(normalized);
  const iziResult = runIziPetlja(normalized);
  const ukResult = runUkPetlja(normalized);
  const zumResult = runZumPetlja(normalized);

  const parts = [
    forResult,
    itchResult,
    urResult,
    nikResult,
    dorResult,
    exeResult,
    kurResult,
    darResult,
    yuResult,
    zarResult,
    derResult,
    garResult,
    zurResult,
    iziResult,
    ukResult,
    zumResult,
  ];
  const aggregated = aggregateParts(parts);

  const mergedTrails = parts
    .flatMap((p, runnerOrder) => p.statusTrail.map((entry) => ({
      ...entry,
      reason: `[${p.kind}] ${entry.reason}`,
      runnerOrder,
    })))
    .sort((a, b) => a.iteration - b.iteration || a.runnerOrder - b.runnerOrder);

  let traceAccumulator = 0;
  statusTrail.push(...mergedTrails.map(({ runnerOrder: _runnerOrder, ...entry }) => entry));
  const transition = createStatusTransition(status, aggregated.status, 'umbrella-aggregate', aggregated.totalIterations);
  status = transition.status;
  statusTrail.push(transition.entry);

  return {
    ...result,
    status,
    statusTrail,
    output: aggregated.totalOutput,
    iterations: aggregated.totalIterations,
    completed: aggregated.completed,
    reason: aggregated.reason,
    warnings: aggregated.warnings,
    durationMs: aggregated.totalDurationMs,
    trace: parts.map((part, index) => {
      traceAccumulator += aggregated.safeOutputs[index];
      return {
        iteration: index + 1,
        value: aggregated.safeOutputs[index],
        accumulator: traceAccumulator,
      };
    }),
  };
}
