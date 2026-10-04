import { runSpajaPetlja } from './spaja-petlja';
import { VRH_INDIVIDUAL_PROFILES } from './vrh-individual-profiles';
import type { PetljaInput, PetljaKind, SpajaSegmentConfig } from './types';

/** Strict composite v0.3 only. Fallback excluded until stale-export behavior is reviewed. */
export function validateVrhSpajaRequest(value: unknown): PetljaInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid SPAJA request');
  const call = value as Record<string, unknown>;
  if (Object.keys(call).sort().join(',') !== 'input,kind,name,version' || call.kind !== 'loop-call' || call.version !== '0.3' || call.name !== 'SPAJA PETLJA') throw new Error('Invalid SPAJA contract');
  if (!call.input || typeof call.input !== 'object' || Array.isArray(call.input)) throw new Error('Invalid input');
  const input = call.input as Record<string, unknown>;
  const keys = ['start', 'end', 'step', 'target', 'sequence', 'maxIterations', 'maxDurationMs', 'status', 'spajaSegments', 'spajaTransferPolicy', 'spajaExportFields', 'spajaImportTarget'];
  if (Object.keys(input).sort().join(',') !== keys.sort().join(',')) throw new Error('Explicit SPAJA fields required');
  const bounded = (n: unknown) => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= 1000000;
  for (const key of ['start', 'end', 'step', 'target']) if (!bounded(input[key])) throw new Error('Invalid number');
  if (!Array.isArray(input.sequence) || input.sequence.length > 1000 || !input.sequence.every(bounded)) throw new Error('Invalid sequence');
  for (const key of ['maxIterations', 'maxDurationMs']) if (!Number.isInteger(input[key]) || (input[key] as number) < 1 || (input[key] as number) > 1000) throw new Error('Budget must be 1..1000');
  if (!['ACTIVATED', 'DISABLED', 'MONSTER', 'DEAD'].includes(input.status as string)) throw new Error('Canonical status required');
  if (!['strict', 'fallback'].includes(input.spajaTransferPolicy as string)) throw new Error('Explicit strict or fallback policy required');
  if (!['start', 'end', 'target', 'sequence'].includes(input.spajaImportTarget as string)) throw new Error('Invalid import target');
  if (!Array.isArray(input.spajaExportFields) || !input.spajaExportFields.length || input.spajaExportFields.length > 3 || new Set(input.spajaExportFields).size !== input.spajaExportFields.length || !input.spajaExportFields.every(f => ['output', 'iterations', 'warnings-count'].includes(f))) throw new Error('Invalid export fields');
  if (!Array.isArray(input.spajaSegments) || !input.spajaSegments.length || input.spajaSegments.length > 10) throw new Error('Invalid segments');
  let count = 0;
  const segments: SpajaSegmentConfig[] = input.spajaSegments.map((segment, index) => {
    if (!segment || typeof segment !== 'object' || Object.keys(segment).sort().join(',') !== 'importFromPrevious,loops,segment' || !['RANGE', 'TARGET', 'SEQUENCE'].includes(segment.segment) || typeof segment.importFromPrevious !== 'boolean' || (index === 0 && segment.importFromPrevious)) throw new Error('Invalid segment configuration');
    if (!Array.isArray(segment.loops) || !segment.loops.length || new Set(segment.loops).size !== segment.loops.length) throw new Error('Explicit unique loops required');
    count += segment.loops.length;
    if (count > 35) throw new Error('Maximum 35 configured calls');
    for (const name of segment.loops) if (typeof name !== 'string' || !Object.hasOwn(VRH_INDIVIDUAL_PROFILES, name) || VRH_INDIVIDUAL_PROFILES[name as keyof typeof VRH_INDIVIDUAL_PROFILES] !== segment.segment) throw new Error('Loop not allowed in segment');
    return { segment: segment.segment, importFromPrevious: segment.importFromPrevious, loops: [...segment.loops] as PetljaKind[] };
  });
  return { ...input, sequence: [...input.sequence], spajaExportFields: [...input.spajaExportFields], spajaSegments: segments } as PetljaInput;
}

export function dispatchVrhSpaja(value: unknown, target: 'reference' | 'java') {
  const input = validateVrhSpajaRequest(value);
  if (target !== 'reference') throw new Error('SPAJA Java translation unverified');
  return runSpajaPetlja(input);
}
