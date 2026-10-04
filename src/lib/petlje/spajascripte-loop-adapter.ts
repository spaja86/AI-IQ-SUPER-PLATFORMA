import { validateVrhLoopRequest, dispatchVrhLoop, type VrhLoopRequest } from './vrh-dispatcher';

export type SpajascripteLoopCall = VrhLoopRequest;

/** Strict single-call dialect. Not combined with LET/PRINT programs yet. */
export function parseLoopCall(source: string): SpajascripteLoopCall {
  if (typeof source !== 'string' || source.length > 4096) throw new Error('Invalid loop source size');
  const match = /^LOOP (\{[^\r\n]*\})$/.exec(source.trim());
  if (!match) throw new Error('Expected LOOP JSON on one line');
  return validateLoopCall({ kind: 'loop-call', version: '0.1', ...JSON.parse(match[1]) });
}

/** Compatibility delegates: validation and execution rules live in VRH only. */
export const validateLoopCall = validateVrhLoopRequest;
export const executeLoopCall = dispatchVrhLoop;
