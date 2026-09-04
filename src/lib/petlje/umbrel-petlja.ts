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
  let traceAccumulator = 0;
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
    trace: parts.map((part, index) => {
      traceAccumulator += part.output;
      return {
        iteration: index + 1,
        value: part.output,
        accumulator: traceAccumulator,
      };
    }),
  };
}
