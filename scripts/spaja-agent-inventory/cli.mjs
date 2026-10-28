#!/usr/bin/env node
import { lstatSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { buildInventory } from './build.mjs';
import { dryRunAgentImport, MAX_JSON_BYTES, parseJsonStrict, validateInventory } from '../../src/lib/deploy/agent-inventory.mjs';

// Reviewed main base. Per-file hashes bind the actual working snapshot, including
// this branch's package metadata. This is not a claim that HEAD equals this SHA.
export const SOURCE_BASE_REVISION = 'f6c2be5b25d5849193c9067b1f3f5aa67480d4ef';
const root = fileURLToPath(new URL('../../', import.meta.url));
const defaultInput = resolve(root, 'docs/evidence/spaja-agent-inventory.json');

export function main(args) {
  const [command, flag, inputPath, ...extra] = args;
  if (!['generate', 'check', 'dry-run'].includes(command) || extra.length
      || (flag !== undefined && (flag !== '--input' || !inputPath || command === 'generate'))) {
    throw new Error('usage: generate | check [--input file] | dry-run [--input file]');
  }
  const expected = buildInventory({ root, sourceRevision: SOURCE_BASE_REVISION });
  // Generation is also validated; a changed count or protected flag fails closed.
  validateInventory(expected, expected);
  if (command === 'generate') return expected;
  const path = inputPath ? resolve(inputPath) : defaultInput;
  const stat = lstatSync(path);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > MAX_JSON_BYTES) throw new Error('invalid-input-file');
  const inventory = parseJsonStrict(readFileSync(path, 'utf8'));
  validateInventory(inventory, expected);
  return command === 'dry-run' ? dryRunAgentImport(inventory, expected)
    : { valid: true, agents: inventory.agents.length, executionAuthorized: false };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.stdout.write(`${JSON.stringify(main(process.argv.slice(2)), null, 2)}\n`); }
  catch (error) {
    // Never echo untrusted imported content, YAML excerpts, env values or commands.
    const code = /^[a-z0-9-]+$/.test(error.message) ? error.message : 'inventory-validation-failed';
    process.stderr.write(`SPAJA inventory rejected: ${code}\n`);
    process.exitCode = 1;
  }
}
