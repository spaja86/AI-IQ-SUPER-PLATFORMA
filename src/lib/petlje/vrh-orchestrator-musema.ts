import type { PetljaInput } from './types';
import { resolveVrhLoop } from './vrh-registry';

export const VRH_ORCHESTRATOR_MUSEMA = Object.freeze({
  version: '0.4', names: ['UMBREL PETLJA', 'DURMITOR PETLJA'] as const,
  maxIterations: 1000, maxDurationMs: 1000, maxSequenceLength: 1000, maxMagnitude: 1000000,
});

export function validateVrhOrchestratorMusema(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid mušema request');
  const call = value as Record<string, unknown>;
  if (Object.keys(call).sort().join(',') !== 'input,kind,name,version' || call.kind !== 'loop-call' || call.version !== '0.4' || !VRH_ORCHESTRATOR_MUSEMA.names.includes(call.name as 'UMBREL PETLJA' | 'DURMITOR PETLJA')) throw new Error('Unsupported orchestrator mušema');
  if (!call.input || typeof call.input !== 'object' || Array.isArray(call.input)) throw new Error('Invalid mušema input');
  const input = call.input as Record<string, unknown>;
  if (Object.keys(input).sort().join(',') !== 'end,maxDurationMs,maxIterations,sequence,start,status,step,target') throw new Error('Explicit mušema fields required');
  const bounded = (n: unknown) => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= VRH_ORCHESTRATOR_MUSEMA.maxMagnitude;
  for (const key of ['start', 'end', 'step', 'target']) if (!bounded(input[key])) throw new Error('Invalid mušema numeric value');
  if (!Array.isArray(input.sequence) || input.sequence.length > VRH_ORCHESTRATOR_MUSEMA.maxSequenceLength || !input.sequence.every(bounded)) throw new Error('Invalid mušema sequence');
  for (const key of ['maxIterations', 'maxDurationMs']) if (!Number.isInteger(input[key]) || (input[key] as number) < 1 || (input[key] as number) > 1000) throw new Error('Mušema budget must be 1..1000');
  if (!['ACTIVATED', 'DISABLED', 'MONSTER', 'DEAD'].includes(input.status as string)) throw new Error('Canonical numerical status required');
  return { name: call.name as 'UMBREL PETLJA' | 'DURMITOR PETLJA', input: { ...input, sequence: [...input.sequence] } as PetljaInput };
}

export function dispatchVrhOrchestrator(value: unknown, target: 'reference' | 'java') {
  const call = validateVrhOrchestratorMusema(value);
  if (target !== 'reference') throw new Error('Orchestrator Java translation unverified');
  return resolveVrhLoop(call.name)(call.input);
}
