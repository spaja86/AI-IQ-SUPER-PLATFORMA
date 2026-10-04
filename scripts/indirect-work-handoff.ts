import { createNode1450Plan } from '../src/lib/node-1450';
import { validateWorkRequest, runComputerJob } from './computer-work-protocol.mjs';

export function prepareIndirectWork(root: string, revision: string) {
  const plan = createNode1450Plan(root, 'Review fixed local reference-test service before explicit execution', ['scripts/computer-work-protocol.mjs', 'scripts/local-verification.mjs']);
  const request = validateWorkRequest({ version: 'v1', service: 'reference-tests', expectedRevision: revision });
  return { route: ['digital-computer', 'NODE1450', 'work-musema', 'local-service'], plan, request, executionApproved: false };
}
export function executeIndirectWork(root: string, revision: string, control: { execute: boolean }) {
  const handoff = prepareIndirectWork(root, revision);
  return { handoff, job: runComputerJob(root, handoff.request, control) };
}
