import { createHash } from 'node:crypto';
import { load, JSON_SCHEMA } from 'js-yaml';

export const INVENTORY_VERSION = 1;
export const MAX_JSON_BYTES = 8 * 1024 * 1024;
export const PRESERVED_DISABLED = Object.freeze([
  'calculator-validator-agent', 'deploy-bot', 'gigatron-validator-agent',
]);
export const DRY_RUN_POLICY = Object.freeze({
  mode: 'dry-run', environment: 'dev', permissions: Object.freeze(['inventory:read']),
  execution: null, activate: false, costMicros: 0,
});

function fail(code) { throw new Error(code); }
export function assertJson(value) {
  let count = 0;
  const seen = new Set();
  function visit(node, depth) {
    if (++count > 200_000 || depth > 48) fail('json-limit');
    if (node === null || typeof node === 'boolean') return;
    if (typeof node === 'number' && Number.isFinite(node)) return;
    if (typeof node === 'string' && node.length <= MAX_JSON_BYTES) return;
    if (typeof node !== 'object' || seen.has(node)) fail('invalid-json-value');
    seen.add(node);
    if (!Array.isArray(node) && ![Object.prototype, null].includes(Object.getPrototypeOf(node))) fail('invalid-object');
    for (const [key, child] of Object.entries(node)) {
      if (['__proto__', 'constructor', 'prototype'].includes(key)) fail('unsafe-key');
      visit(child, depth + 1);
    }
    seen.delete(node);
  }
  visit(value, 0);
}

/** JSON syntax plus duplicate-key rejection, including escaped duplicate names. */
export function parseJsonStrict(text) {
  if (typeof text !== 'string' || Buffer.byteLength(text) > MAX_JSON_BYTES) fail('json-limit');
  const parsed = JSON.parse(text);
  assertJson(parsed);
  // JSON.parse alone silently keeps the last duplicate. YAML's JSON schema rejects it.
  load(text, { schema: JSON_SCHEMA, json: false });
  return parsed;
}

export function canonical(value) {
  assertJson(value);
  const sort = node => Array.isArray(node) ? node.map(sort)
    : node && typeof node === 'object'
      ? Object.fromEntries(Object.keys(node).sort().map(key => [key, sort(node[key])])) : node;
  return JSON.stringify(sort(value));
}
export const sha256 = value => createHash('sha256').update(value).digest('hex');

function identity(inventory) {
  assertJson(inventory);
  if (inventory?.schemaVersion !== INVENTORY_VERSION || inventory.repository !== 'spaja86/AI-IQ-SUPER-PLATFORMA'
      || !/^[a-f0-9]{40}$/.test(inventory.sourceRevision)) fail('invalid-inventory-header');
  if (!Array.isArray(inventory.agents) || inventory.agents.length !== 43) fail('expected-43-agents');
  const ids = new Set();
  for (const agent of inventory.agents) {
    if (!agent || typeof agent.id !== 'string' || !/^[a-z][a-z0-9-]{0,95}$/.test(agent.id)) fail('invalid-agent-id');
    if (ids.has(agent.id)) fail('duplicate-agent-id');
    ids.add(agent.id);
    if (typeof agent.configEnabled !== 'boolean' || agent.configuration?.enabled !== agent.configEnabled) fail('invalid-enabled');
    if (agent.executionObserved !== false || agent.importActivation !== false) fail('execution-claim-forbidden');
  }
  for (const id of PRESERVED_DISABLED) {
    if (inventory.agents.find(agent => agent.id === id)?.configEnabled !== false) fail('disabled-agent-protected');
  }
  if (inventory.agents.filter(agent => agent.configEnabled).length !== 40) fail('expected-40-enabled');
  for (const key of ['workflows', 'sourceFiles']) {
    if (!Array.isArray(inventory[key])) fail('invalid-catalog');
    const paths = inventory[key].map(item => item.path);
    if (new Set(paths).size !== paths.length) fail('duplicate-source-path');
  }
}

/** expected must be rebuilt by the trusted local builder, never supplied by the import file.
 * Matching the entire canonical snapshot prevents forged roles, permissions, capabilities,
 * enabled flags, provenance, stale source and hidden executable fields from being admitted.
 */
export function validateInventory(inventory, expected) {
  identity(inventory);
  identity(expected);
  if (canonical(inventory) !== canonical(expected)) fail('inventory-source-mismatch');
  return true;
}

/** Pure planner: no adapter, subprocess, workflow, credential, scheduler or network access. */
export function dryRunAgentImport(inventory, expected, request = DRY_RUN_POLICY) {
  if (canonical(request) !== canonical(DRY_RUN_POLICY)) fail('unsupported-import-permissions-or-execution');
  validateInventory(inventory, expected);
  const entries = inventory.agents.map(agent => ({
    id: agent.id,
    metadataCompatible: true,
    executionCompatible: false,
    configEnabled: agent.configEnabled,
    remainsConfigDisabled: !agent.configEnabled,
    importEnabled: false,
    disposition: agent.configEnabled ? 'metadata-only-blocked' : 'preserve-disabled',
    workflowDefinitionState: agent.workflowDefinitionState,
    requiredCapabilities: agent.requiredCapabilities,
    missing: agent.migrationBlockers,
    discrepancies: agent.discrepancies,
  }));
  return {
    schemaVersion: 1, mode: 'dry-run', target: 'spaja-deploy',
    inventorySha256: sha256(canonical(inventory)), sourceRevision: inventory.sourceRevision,
    effects: { writes: 0, networkRequests: 0, startedAgents: 0, deployments: 0, costMicros: 0 },
    summary: { total: entries.length, metadataCompatible: entries.length, executionCompatible: 0,
      configurationEnabled: 40, preservedDisabled: 3, importedEnabled: 0 },
    entries,
  };
}
