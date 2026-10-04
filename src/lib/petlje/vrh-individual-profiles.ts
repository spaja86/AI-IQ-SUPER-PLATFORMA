import type { PetljaInput, PetljaKind } from './types';
import { resolveVrhLoop } from './vrh-registry';

/** Reviewed SPAJA segment classification; numerical algorithms stay unchanged. */
export const VRH_INDIVIDUAL_PROFILES = Object.freeze({
  'FOR PETLJA': 'RANGE',
  'NIK PETLJA': 'RANGE',
  'DOR PETLJA': 'RANGE',
  'DAR PETLJA': 'RANGE',
  'GAR PETLJA': 'RANGE',
  'UK PETLJA': 'RANGE',
  'ZUM PETLJA': 'RANGE',
  'DJUPRE PETLJA': 'RANGE',
  'DOMBRE PETLJA': 'RANGE',
  'DOMBRA PETLJA': 'RANGE',
  'DOMBAR PETLJA': 'RANGE',
  'DOMPOR PETLJA': 'RANGE',
  'SAR PETLJA': 'RANGE',
  'OKRED PETLJA': 'RANGE',
  'ITCH PETLJA': 'TARGET',
  'KUR PETLJA': 'TARGET',
  'DOMPRE PETLJA': 'TARGET',
  'OMBA PETLJA': 'TARGET',
  'DOKON PETLJA': 'TARGET',
  'DONKI PETLJA': 'TARGET',
  'DOK PETLJA': 'TARGET',
  'DIREKT PETLJA': 'TARGET',
  'UR PELJA': 'SEQUENCE',
  'EXE PETLJA': 'SEQUENCE',
  'YU PETLJA': 'SEQUENCE',
  'ZAR PETLJA': 'SEQUENCE',
  'DER PETLJA': 'SEQUENCE',
  'ZUR PETLJA': 'SEQUENCE',
  'IZI PETLJA': 'SEQUENCE',
  'KRUMPE PETLJA': 'SEQUENCE',
  'DOKSI PETLJA': 'SEQUENCE',
  'DUMPIR PETLJA': 'SEQUENCE',
  'ZUMBA PETLJA': 'SEQUENCE',
  'DIK PETLJA': 'SEQUENCE',
  'INDIREKT PETLJA': 'SEQUENCE',
} as const);

export interface VrhProfileRequest { kind: 'loop-call'; version: '0.2'; name: keyof typeof VRH_INDIVIDUAL_PROFILES; input: PetljaInput; }

export function validateVrhProfileRequest(value: unknown): VrhProfileRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid request');
  const call = value as Record<string, unknown>;
  if (Object.keys(call).sort().join(',') !== 'input,kind,name,version' || call.kind !== 'loop-call' || call.version !== '0.2' || typeof call.name !== 'string' || !Object.hasOwn(VRH_INDIVIDUAL_PROFILES, call.name)) throw new Error('Unsupported profile request');
  if (!call.input || typeof call.input !== 'object' || Array.isArray(call.input)) throw new Error('Invalid profile input');
  const input = call.input as Record<string, unknown>;
  const name = call.name as keyof typeof VRH_INDIVIDUAL_PROFILES;
  const profile = VRH_INDIVIDUAL_PROFILES[name];
  const fields = profile === 'RANGE' ? ['start', 'end', 'step', 'target'] : profile === 'TARGET' ? ['start', 'target', 'step'] : ['start', 'target', 'sequence'];
  const expected = [...fields, 'maxIterations', 'maxDurationMs', 'status'].sort().join(',');
  if (Object.keys(input).sort().join(',') !== expected) throw new Error('Explicit profile fields required');
  const bounded = (n: unknown) => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= 1000000;
  for (const field of fields.filter(f => f !== 'sequence')) if (!bounded(input[field])) throw new Error('Invalid numeric value');
  if (fields.includes('sequence') && (!Array.isArray(input.sequence) || input.sequence.length > 1000 || !input.sequence.every(bounded))) throw new Error('Invalid bounded sequence');
  for (const field of ['maxIterations', 'maxDurationMs']) if (!Number.isInteger(input[field]) || (input[field] as number) < 1 || (input[field] as number) > 1000) throw new Error('Budget must be integer 1..1000');
  if (!['ACTIVATED', 'DISABLED', 'MONSTER', 'DEAD'].includes(input.status as string)) throw new Error('Canonical status required');
  return { kind: 'loop-call', version: '0.2', name, input: { ...input, ...(Array.isArray(input.sequence) ? { sequence: [...input.sequence] } : {}) } as PetljaInput };
}

export function dispatchVrhProfile(value: unknown, target: 'reference' | 'java') {
  const call = validateVrhProfileRequest(value);
  if (target !== 'reference') throw new Error('Java profile translation unverified');
  return resolveVrhLoop(call.name as PetljaKind)(call.input);
}
