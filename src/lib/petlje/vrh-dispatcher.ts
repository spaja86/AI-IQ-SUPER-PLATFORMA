import { dispatchVrhOrchestrator } from './vrh-orchestrator-musema';
import { dispatchVrhSpaja } from './vrh-spaja-profile';
/** Shared bounded VRH execution boundary, delegates to existing numerical loop runtime. */
import type { PetljaInput, PetljaKind } from './types';
import { dispatchVrhProfile } from './vrh-individual-profiles';
import { resolveVrhLoop } from './vrh-registry';

export interface VrhLoopRequest {
  kind: 'loop-call';
  version: '0.1';
  name: PetljaKind;
  input: Required<Pick<PetljaInput, 'start' | 'end' | 'step' | 'maxIterations' | 'maxDurationMs' | 'status'>>;
}

export function validateVrhLoopRequest(value: unknown): VrhLoopRequest {
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
  return { kind: 'loop-call', version: '0.1', name: call.name as PetljaKind, input: { ...input } as VrhLoopRequest['input'] };
}

export function dispatchVrhLoop(value: unknown, target: 'reference' | 'java') {
  if (value && typeof value === 'object' && (value as { version?: unknown }).version === '0.4') return dispatchVrhOrchestrator(value, target);
  if (value && typeof value === 'object' && (value as { version?: unknown }).version === '0.3') return dispatchVrhSpaja(value, target);
  if (value && typeof value === 'object' && (value as { version?: unknown }).version === '0.2') return dispatchVrhProfile(value, target);
  const call = validateVrhLoopRequest(value);
  if (target !== 'reference') throw new Error('Named loop Java translation is not verified');
  if (call.name !== 'FOR PETLJA') throw new Error('Registered loop has no verified VRH execution profile yet');
  return resolveVrhLoop(call.name)(call.input);
}
