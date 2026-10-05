import { createNode1450Plan } from './node-1450';
import { dispatchVrhLoop } from './petlje/vrh-dispatcher';
import { validateVrhProfileRequest } from './petlje/vrh-individual-profiles';

/** Local numerical adapter only. Opt-in is not identity authorization or a sandbox. */
function validateIndirektInput(input: unknown) {
  return validateVrhProfileRequest({ kind: 'loop-call', version: '0.2', name: 'INDIREKT PETLJA', input });
}

export function prepareKreatorijumIndirektPlan(root: string, input: unknown) {
  const request = validateIndirektInput(input);
  const plan = createNode1450Plan(root, 'Review local INDIREKT waypoint execution through VRH', [
    'src/lib/kreatorijum-local-service.ts',
    'src/lib/petlje/indirekt-petlja.ts',
    'src/lib/petlje/vrh-individual-profiles.ts',
    'src/tests/lib/kreatorijum-local-service.test.ts',
  ]);
  return { plan, request, executionEnabled: false, executionPerformed: false, authorizationGranted: false };
}

export function executeKreatorijumIndirekt(input: unknown, options: unknown) {
  if (!options || typeof options !== 'object' || Array.isArray(options)
    || Object.keys(options).sort().join(',') !== 'execute,mode'
    || (options as Record<string, unknown>).execute !== true
    || (options as Record<string, unknown>).mode !== 'local-reference') {
    throw new Error('Explicit local-reference execution opt-in required; a plan is not approval');
  }
  const request = validateIndirektInput(input);
  const result = dispatchVrhLoop(request, 'reference');
  return {
    mode: 'local-reference', executionPerformed: true, authorizationGranted: false,
    result, numericalOutputUsable: result.completed && result.reason === 'completed',
    javaBuildVerified: false, nextBuildVerified: false, deploymentExecuted: false,
  };
}

/** Pure CLI parser: no file reads, shell commands or implicit execution. */
export function runKreatorijumLocalCommand(root: string, args: string[]) {
  const [command, json, flag] = args;
  if ((command !== 'indirekt-plan' && command !== 'indirekt-run')
    || !json || json.length > 32768
    || (command === 'indirekt-plan' ? args.length !== 2 : args.length !== 3 || flag !== '--execute')) {
    throw new Error('Usage: indirekt-plan <input-json> | indirekt-run <input-json> --execute');
  }
  const input: unknown = JSON.parse(json);
  return command === 'indirekt-plan' ? prepareKreatorijumIndirektPlan(root, input)
    : executeKreatorijumIndirekt(input, { execute: true, mode: 'local-reference' });
}
