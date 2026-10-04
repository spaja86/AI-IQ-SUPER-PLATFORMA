import type { PetljaInput, PetljaKind } from './types';
import { resolveVrhLoop } from './vrh-registry';

export interface SpajascripteLoopCall {
  kind: 'loop-call';
  version: '0.1';
  name: PetljaKind;
  input: Required<Pick<PetljaInput, 'start' | 'end' | 'step' | 'maxIterations' | 'maxDurationMs' | 'status'>>;
}

/** Strict single-call dialect. Not combined with LET/PRINT programs yet. */
export function parseLoopCall(source: string): SpajascripteLoopCall {
  if (typeof source !== 'string' || source.length > 4096) throw new Error('Invalid loop source size');
  const match = /^LOOP (\{[^\r\n]*\})$/.exec(source.trim());
  if (!match) throw new Error('Expected LOOP JSON on one line');
  return validateLoopCall({ kind: 'loop-call', version: '0.1', ...JSON.parse(match[1]) });
}

export function validateLoopCall(value: unknown): SpajascripteLoopCall {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid loop AST');
  const call = value as Record<string, unknown>;
  if (Object.keys(call).sort().join(',') !== 'input,kind,name,version' || call.kind !== 'loop-call' || call.version !== '0.1' || typeof call.name !== 'string') throw new Error('Invalid loop AST fields');
  resolveVrhLoop(call.name); // exact registered name; unknown/prototype keys rejected
  if (!call.input || typeof call.input !== 'object' || Array.isArray(call.input)) throw new Error('Invalid loop input');
  const input = call.input as Record<string, unknown>;
  if (Object.keys(input).sort().join(',') !== 'end,maxDurationMs,maxIterations,start,status,step') throw new Error('Explicit input fields required');
  for (const key of ['start', 'end', 'step']) if (typeof input[key] !== 'number' || !Number.isFinite(input[key]) || Math.abs(input[key] as number) > 1000000) throw new Error('Invalid range value');
  if (!Number.isInteger(input.maxIterations) || (input.maxIterations as number) < 1 || (input.maxIterations as number) > 1000) throw new Error('maxIterations must be 1..1000');
  if (!Number.isInteger(input.maxDurationMs) || (input.maxDurationMs as number) < 1 || (input.maxDurationMs as number) > 1000) throw new Error('maxDurationMs must be 1..1000');
  if (!['ACTIVATED', 'DISABLED', 'MONSTER', 'DEAD'].includes(input.status as string)) throw new Error('Canonical status required');
  return { kind: 'loop-call', version: '0.1', name: call.name as PetljaKind, input: { ...input } as SpajascripteLoopCall['input'] };
}

export function executeLoopCall(value: unknown, target: 'reference' | 'java') {
  const call = validateLoopCall(value);
  if (target !== 'reference') throw new Error('Named loop Java translation is not verified');
  if (call.name !== 'FOR PETLJA') throw new Error('Registered loop has no verified Spajascripte adapter yet');
  return resolveVrhLoop(call.name)(call.input);
}
