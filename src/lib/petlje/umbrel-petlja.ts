import type { PetljaInput, PetljaResult, PetljaStatus } from './types';
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
import { runDjuprePetlja } from './djupre-petlja';
import { runDomprePetlja } from './dompre-petlja';
import { runKrumpePetlja } from './krumpe-petlja';
import { runDombrePetlja } from './dombre-petlja';
import { runOmbaPetlja } from './omba-petlja';
import { runDoksiPetlja } from './doksi-petlja';
import { runDombraPetlja } from './dombra-petlja';
import { runDokonPetlja } from './dokon-petlja';
import { runDumpirPetlja } from './dumpir-petlja';
import { runDombarPetlja } from './dombar-petlja';
import { runZumbaPetlja } from './zumba-petlja';
import { runDonkiPetlja } from './donki-petlja';
import { runDomporPetlja } from './dompor-petlja';
import { runDokPetlja } from './dok-petlja';
import { runDikPetlja } from './dik-petlja';
import { runSarPetlja } from './sar-petlja';
import { runOkredPetlja } from './okred-petlja';
import { runDirektPetlja } from './direkt-petlja';
import { runIndirektPetlja } from './indirekt-petlja';

const GOAL = 'Orkestracija svih petlji kroz jedinstven, stabilan i auditabilan rezultat.';

function aggregateParts(parts: PetljaResult[]) {
  const warnings: string[] = [];
  const safeOutputs: number[] = [];
  let completed = true;
  let hasDead = false;
  let hasDisabled = false;
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

  const status: PetljaStatus =
    hasDead ? 'DEAD'
      : hasDisabled ? 'DISABLED'
      : completed ? 'ACTIVATED'
      : 'DEAD';
  const reason =
    status === 'DEAD'
      ? (firstDeadReason ?? (firstIncompleteReason === 'time-limit' || firstIncompleteReason === 'max-iterations' ? firstIncompleteReason : 'max-iterations'))
      : status === 'DISABLED'
        ? (firstDisabledReason ?? firstIncompleteReason ?? 'invalid-input')
        : 'completed';

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

  const startedAt = Date.now();
  const parts: PetljaResult[] = [];
  let consumed = 0;
  let budgetStop: 'max-iterations' | 'time-limit' | undefined;
  if (!Number.isFinite(normalized.maxIterations) || normalized.maxIterations < 1 || !Number.isFinite(normalized.maxDurationMs) || normalized.maxDurationMs < 0) {
    return { ...result, status: 'DISABLED', completed: false, reason: 'invalid-input', warnings: ['Invalid finite UMBREL budget'] };
  }
  const runners = [
    runForPetlja,
    runItchPetlja,
    runUrPelja,
    runNikPetlja,
    runDorPetlja,
    runExePetlja,
    runKurPetlja,
    runDarPetlja,
    runYuPetlja,
    runZarPetlja,
    runDerPetlja,
    runGarPetlja,
    runZurPetlja,
    runIziPetlja,
    runUkPetlja,
    runZumPetlja,
    runDjuprePetlja,
    runDomprePetlja,
    runKrumpePetlja,
    runDombrePetlja,
    runOmbaPetlja,
    runDoksiPetlja,
    runDombraPetlja,
    runDokonPetlja,
    runDumpirPetlja,
    runDombarPetlja,
    runZumbaPetlja,
    runDonkiPetlja,
    runDomporPetlja,
    runDokPetlja,
    runDikPetlja,
    runSarPetlja,
    runOkredPetlja,
    runDirektPetlja,
    runIndirektPetlja,
  ];
  for (const runner of runners) {
    const remainingIterations = normalized.maxIterations - consumed;
    const remainingDurationMs = Math.max(0, normalized.maxDurationMs - (Date.now() - startedAt));
    if (remainingIterations <= 0) { budgetStop = 'max-iterations'; break; }
    if (remainingDurationMs <= 0) { budgetStop = 'time-limit'; break; }
    const part = runner({ ...normalized, sequence: [...normalized.sequence], maxIterations: remainingIterations, maxDurationMs: remainingDurationMs });
    parts.push(part);
    consumed += part.iterations;
  }
  const aggregated = aggregateParts(parts);
  if (budgetStop) {
    aggregated.completed = false;
    aggregated.status = 'DEAD';
    aggregated.reason = budgetStop;
    aggregated.warnings.push(`UMBREL shared budget exhausted; ${runners.length - parts.length} runners not executed`);
  }

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
    durationMs: Date.now() - startedAt,
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
