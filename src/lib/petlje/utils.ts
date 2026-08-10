import {
  PETLJA_DEFAULT_MAX_DURATION_MS,
  PETLJA_DEFAULT_MAX_ITERATIONS,
  type PetljaInput,
  type PetljaKind,
  type PetljaResult,
  type PetljaRuntimeGuard,
  type PetljaTracePoint,
  type PetljaReason,
} from './types';

export function normalizeInput(input: PetljaInput): Required<Pick<PetljaInput, 'start' | 'end' | 'step' | 'target' | 'sequence' | 'maxIterations' | 'maxDurationMs'>> {
  return {
    start: input.start ?? 0,
    end: input.end ?? 0,
    step: input.step ?? 1,
    target: input.target ?? 0,
    sequence: Array.isArray(input.sequence) ? input.sequence : [],
    maxIterations: Math.floor(input.maxIterations ?? PETLJA_DEFAULT_MAX_ITERATIONS),
    maxDurationMs: Math.floor(input.maxDurationMs ?? PETLJA_DEFAULT_MAX_DURATION_MS),
  };
}

export function validateFiniteNumber(name: string, value: number): string[] {
  if (Number.isNaN(value)) return [`${name} mora biti broj (NaN nije dozvoljen)`];
  if (!Number.isFinite(value)) return [`${name} mora biti konačan broj (Infinity nije dozvoljen)`];
  return [];
}

export function validateSequence(sequence: number[]): string[] {
  const errors: string[] = [];
  for (let i = 0; i < sequence.length; i++) {
    const val = sequence[i];
    if (Number.isNaN(val)) errors.push(`sequence[${i}] je NaN`);
    else if (!Number.isFinite(val)) errors.push(`sequence[${i}] nije konačan broj`);
  }
  return errors;
}

export function buildGuard(maxIterations: number, maxDurationMs: number): PetljaRuntimeGuard {
  const startedAt = Date.now();
  let iterations = 0;

  return {
    canContinue: () => {
      if (maxIterations < 1) return { ok: false, reason: 'max-iterations' };
      if (maxDurationMs <= 0) return { ok: false, reason: 'time-limit' };
      if (iterations >= maxIterations) return { ok: false, reason: 'max-iterations' };
      const elapsed = Date.now() - startedAt;
      if (elapsed >= maxDurationMs) return { ok: false, reason: 'time-limit' };
      return { ok: true };
    },
    getIterations: () => iterations,
    getDurationMs: () => Date.now() - startedAt,
    tick: () => {
      iterations += 1;
    },
  };
}

export function baseResult(kind: PetljaKind, goal: string, input: Required<Pick<PetljaInput, 'start' | 'end' | 'step' | 'target' | 'sequence' | 'maxIterations' | 'maxDurationMs'>>): PetljaResult {
  return {
    kind,
    goal,
    input,
    output: 0,
    iterations: 0,
    completed: false,
    reason: 'invalid-input',
    warnings: [],
    durationMs: 0,
    trace: [],
  };
}

export function finalizeResult(
  result: PetljaResult,
  guard: PetljaRuntimeGuard,
  reason: PetljaReason,
  output: number,
  trace: PetljaTracePoint[],
  warnings: string[] = [],
): PetljaResult {
  return {
    ...result,
    output,
    trace,
    warnings,
    iterations: guard.getIterations(),
    durationMs: guard.getDurationMs(),
    completed: reason === 'completed',
    reason,
  };
}
