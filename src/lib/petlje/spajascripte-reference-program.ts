import { dispatchVrhLoop } from './vrh-dispatcher';
import { validateVrhProfileRequest } from './vrh-individual-profiles';
import { validateVrhSpajaRequest } from './vrh-spaja-profile';
import { validateVrhOrchestratorMusema } from './vrh-orchestrator-musema';
import { validateLoopCall } from './spajascripte-loop-adapter';
import type { PetljaResult } from './types';

type Instruction =
  | { kind: 'let'; name: string; value: number }
  | { kind: 'call'; name: string; start: string; end: string; step: string; limit: number; timeout: number }
  | { kind: 'profile-call'; name: string; loop: string; input: unknown }
  | { kind: 'print'; name: string; field: 'output' | 'status' | 'reason' | 'completed' | 'warnings' | 'transferEvents' | 'fallbackSummary' };
const identifier = '[a-z][a-z0-9_]{0,31}';
const operand = `(?:-?\\d{1,7}|${identifier})`;

/** Parse entire program before execution. Separate reference dialect, not Java compiler. */
export function parseReferenceProgram(source: string): Instruction[] {
  if (typeof source !== 'string' || source.length > 16384) throw new Error('Invalid program size');
  const instructions: Instruction[] = [];
  for (const raw of source.split(/\r?\n/)) {
    const text = raw.trim();
    if (!text || text.startsWith('#')) continue;
    if (instructions.length >= 100) throw new Error('Maximum 100 instructions');
    const letMatch = new RegExp(`^LET (${identifier}) = (-?\\d{1,7})$`).exec(text);
    const call = new RegExp(`^CALL FOR PETLJA FROM (${operand}) TO (${operand}) STEP (${operand}) LIMIT (\\d{1,4}) TIMEOUT (\\d{1,4}) AS (${identifier})$`).exec(text);
    const profileCall = new RegExp(`^CALL "([^"]{1,64})" WITH (\\{.*\\}) AS (${identifier})$`).exec(text);
    const print = new RegExp(`^PRINT (${identifier})\\.(output|status|reason|completed|warnings|transferEvents|fallbackSummary)$`).exec(text);
    if (letMatch) instructions.push({ kind: 'let', name: letMatch[1], value: Number(letMatch[2]) });
    else if (call) instructions.push({ kind: 'call', start: call[1], end: call[2], step: call[3], limit: Number(call[4]), timeout: Number(call[5]), name: call[6] });
    else if (profileCall) instructions.push({ kind: 'profile-call', loop: profileCall[1], input: JSON.parse(profileCall[2]), name: profileCall[3] });
    else if (print) instructions.push({ kind: 'print', name: print[1], field: print[2] as Extract<Instruction, { kind: 'print' }>['field'] });
    else throw new Error('Unsupported reference instruction');
  }
  if (!instructions.length || instructions.filter(i => (i.kind === 'call' || i.kind === 'profile-call')).length > 10) throw new Error('Empty program or more than 10 calls');
  return instructions;
}

export function runReferenceProgram(source: string) {
  const instructions = parseReferenceProgram(source);
  const numbers = new Map<string, number>(), names = new Set<string>();
  const calls = new Map<number, unknown>();
  const resultNames = new Set<string>();
  function resolve(value: string) {
    const number = /^-?\d+$/.test(value) ? Number(value) : numbers.get(value);
    if (number === undefined || !Number.isFinite(number) || Math.abs(number) > 1000000) throw new Error('Unknown or out-of-range numeric value');
    return number;
  }
  // Preflight all names and limits before running even one loop.
  instructions.forEach((instruction, index) => {
    if (instruction.kind === 'print') {
      if (!resultNames.has(instruction.name)) throw new Error('PRINT requires an earlier loop result');
      return;
    }
    if (names.has(instruction.name)) throw new Error('Duplicate binding');
    names.add(instruction.name);
    if (instruction.kind === 'let') numbers.set(instruction.name, resolve(String(instruction.value)));
    else if (instruction.kind === 'profile-call') {
      const version = instruction.loop === 'SPAJA PETLJA' ? '0.3' : ['UMBREL PETLJA', 'DURMITOR PETLJA'].includes(instruction.loop) ? '0.4' : '0.2';
      const request = { kind: 'loop-call', version, name: instruction.loop, input: instruction.input };
      if (version === '0.2') validateVrhProfileRequest(request);
      else if (version === '0.3') validateVrhSpajaRequest(request);
      else validateVrhOrchestratorMusema(request);
      calls.set(index, request);
      resultNames.add(instruction.name);
    } else {
      calls.set(index, validateLoopCall({ kind: 'loop-call', version: '0.1', name: 'FOR PETLJA', input: {
        start: resolve(instruction.start), end: resolve(instruction.end), step: resolve(instruction.step),
        maxIterations: instruction.limit, maxDurationMs: instruction.timeout, status: 'ACTIVATED',
      } }));
      resultNames.add(instruction.name);
    }
  });
  const results = new Map<string, PetljaResult>(), output: string[] = [];
  instructions.forEach((instruction, index) => {
    if (instruction.kind === 'call' || instruction.kind === 'profile-call') results.set(instruction.name, dispatchVrhLoop(calls.get(index), 'reference'));
    if (instruction.kind === 'print') {
      const result = results.get(instruction.name)!;
      if (instruction.field === 'output' && (!result.completed || result.fallbackSummary?.successful === false)) throw new Error('Cannot PRINT output of incomplete loop; inspect status/reason');
      const value = result[instruction.field];
      output.push(value === undefined ? 'null' : typeof value === 'object' ? JSON.stringify(value) : String(value));
    }
  });
  return { target: 'reference' as const, output, results: [...results].map(([name, result]) => ({ name, result })), javaTranslationVerified: false as const };
}
