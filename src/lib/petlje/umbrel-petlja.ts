import type { PetljaInput, PetljaResult } from './types';
import { baseResult, normalizeInput } from './utils';
import { runForPetlja } from './for-petlja';
import { runItchPetlja } from './itch-petlja';
import { runUrPelja } from './ur-pelja';
import { runNikPetlja } from './nik-petlja';

const GOAL = 'Orkestracija svih petlji kroz jedinstven, stabilan i auditabilan rezultat.';

export function runUmbrelPetlja(input: PetljaInput): PetljaResult {
  const normalized = normalizeInput(input);
  const result = baseResult('UMBREL PETLJA', GOAL, normalized);

  const forResult = runForPetlja(input);
  const itchResult = runItchPetlja(input);
  const urResult = runUrPelja(input);
  const nikResult = runNikPetlja(input);

  const parts = [forResult, itchResult, urResult, nikResult];
  const warnings = parts.flatMap((p) => p.warnings.map((w) => `[${p.kind}] ${w}`));
  const completed = parts.every((p) => p.completed);

  return {
    ...result,
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
