import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildInventory, parseAgentDocs, parseWorkflow, readSource, reconcileAgentStatus } from '../../../scripts/spaja-agent-inventory/build.mjs';
import { SOURCE_BASE_REVISION } from '../../../scripts/spaja-agent-inventory/cli.mjs';
import { canonical, DRY_RUN_POLICY, dryRunAgentImport, MAX_JSON_BYTES, parseJsonStrict,
  PRESERVED_DISABLED, sha256, validateInventory } from '../../lib/deploy/agent-inventory.mjs';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const inventory = buildInventory({ root, sourceRevision: SOURCE_BASE_REVISION });
const fixture = parseJsonStrict(readFileSync(join(root, 'docs/evidence/spaja-agent-inventory.json'), 'utf8'));
const clone = () => structuredClone(inventory);
const agent = id => inventory.agents.find(entry => entry.id === id);

test('checked-in inventory reproduces all 43 agents from the current source bytes', () => {
  assert.equal(validateInventory(fixture, inventory), true);
  assert.equal(inventory.agents.length, 43);
  assert.equal(inventory.agents.filter(entry => entry.configEnabled).length, 40);
  assert.deepEqual(inventory.agents.filter(entry => !entry.configEnabled).map(entry => entry.id), PRESERVED_DISABLED);
  assert.ok(inventory.agents.every(entry => entry.role !== 'not-documented' && entry.roleSource));
});

test('source manifests bind every read document, workflow, registry and policy file', () => {
  for (const source of inventory.sourceFiles) assert.equal(sha256(readFileSync(join(root, source.path))), source.sha256);
  assert.equal(inventory.workflows.length, 79);
  assert.ok(inventory.workflows.every(workflow => workflow.state === 'definition-present'));
  assert.deepEqual(inventory.deployRegistry.providers.map(p => p.id), ['vercel', 'spaja-local']);
  assert.deepEqual(inventory.deployRegistry.executableAgentAdapters, []);
});

test('dry-run is deterministic, zero cost and preserves inputs byte-for-byte', () => {
  const before = canonical(inventory);
  const report = dryRunAgentImport(inventory, inventory);
  assert.deepEqual(report, dryRunAgentImport(inventory, inventory));
  assert.equal(canonical(inventory), before);
  assert.deepEqual(report.effects, { writes: 0, networkRequests: 0, startedAgents: 0, deployments: 0, costMicros: 0 });
  assert.equal(report.summary.metadataCompatible, 43);
  assert.equal(report.summary.executionCompatible, 0);
  assert.ok(report.entries.every(entry => !entry.importEnabled && entry.missing.length > 0));
  assert.deepEqual(report, parseJsonStrict(readFileSync(join(root, 'docs/evidence/spaja-agent-import-dry-run.json'), 'utf8')));
});

for (const id of PRESERVED_DISABLED) {
  test(`${id} stays disabled and cannot be activated through inventory edits`, () => {
    const report = dryRunAgentImport(inventory, inventory).entries.find(entry => entry.id === id);
    assert.equal(report.remainsConfigDisabled, true);
    assert.equal(report.disposition, 'preserve-disabled');
    const changed = clone();
    const entry = changed.agents.find(item => item.id === id);
    entry.configEnabled = true; entry.configuration.enabled = true;
    assert.throws(() => dryRunAgentImport(changed, inventory), /disabled-agent-protected/);
  });
}

test('all three disabled agents have consistent bilingual status without claiming workflow enforcement', () => {
  for (const id of PRESERVED_DISABLED) {
    const entry = agent(id);
    const rows = [entry.documentation.registered, ...entry.documentation.registered.duplicateRows];
    assert.deepEqual(rows.map(row => row.language).sort(), ['en', 'sr']);
    assert.ok(rows.every(row => row.status === '⏸ Disabled'));
    assert.equal(entry.configEnabled, false);
    assert.ok(!entry.discrepancies.includes('documented-active-but-config-disabled'));
    assert.ok(entry.discrepancies.includes('disabled-config-workflow-enforcement-unverified'));
    assert.ok(entry.workflowReferences.length > 0);
    assert.ok(entry.dependencies.workflowPermissions.length > 0);
  }
  assert.ok(agent('calculator-validator-agent').workflowReferences.some(ref => ref.association === 'reviewed-association'));
});

for (const [id, filename] of [
  ['extrimli-cuz-validator-agent', 'extrimli-cuz-validator.yml'],
  ['mrkli-mrak-validator-agent', 'mrkli-mrak-validator.yml'],
]) {
  test(`${id}: shared omega workflow cannot hide the missing validator or imply a replacement`, () => {
    const entry = agent(id);
    const path = `.github/workflows/${filename}`;
    assert.equal(existsSync(join(root, path)), false);
    assert.ok(entry.workflowReferences.some(ref => ref.path === path && ref.association === 'config-reference'));
    assert.ok(entry.workflowDependencyClosure.includes('.github/workflows/omega-auto-build.yml'));
    assert.equal(entry.workflowDefinitionState, 'incomplete-definitions');
    assert.ok(entry.migrationBlockers.includes(`missing-workflow:${path}`));
    assert.ok(entry.discrepancies.includes('configured-active-but-workflow-missing'));
    assert.ok(!entry.discrepancies.includes('documented-active-but-workflow-missing'));
    const rows = [entry.documentation.registered, ...entry.documentation.registered.duplicateRows];
    assert.deepEqual(rows.map(row => row.language).sort(), ['en', 'sr']);
    assert.ok(rows.every(row => row.status === '⚠ Missing workflow'));
    assert.equal(entry.configuration.enabled, true); // Preserve the source declaration, never activate it.
    assert.equal(entry.configuration.status, 'active');
    const imported = dryRunAgentImport(inventory, inventory).entries.find(item => item.id === id);
    assert.equal(imported.executionCompatible, false);
    assert.equal(imported.importEnabled, false);
    const changed = clone();
    changed.agents.find(item => item.id === id).migrationBlockers = [];
    assert.throws(() => validateInventory(changed, inventory), /inventory-source-mismatch/);
  });
}

for (const [name, configuration, statuses, missing, definitions, expected] of [
  ['English-only active regression', { enabled: false }, ['⏸ Disabled', '✅ Active'], [], true,
    ['disabled-config-workflow-enforcement-unverified', 'documented-active-but-config-disabled']],
  ['English-only disabled regression', { enabled: true }, ['✅ Active', '⏸ Disabled'], [], true,
    ['documented-disabled-but-config-enabled', 'enabled-config-not-documented-active']],
  ['active config despite disabled flag', { enabled: false, status: 'active' }, ['⏸ Disabled'], [], false,
    ['configured-active-but-config-disabled']],
  ['active config and docs with absent validator', { enabled: true, status: 'active' }, ['🚀 Active'], ['missing.yml'], true,
    ['configured-active-but-workflow-missing', 'documented-active-but-workflow-missing']],
  ['explicit missing implementation', { enabled: true, status: 'active' }, ['⚠ Missing workflow'], ['missing.yml'], true,
    ['configured-active-but-workflow-missing']],
  ['catalog membership is not a runtime claim', { enabled: true }, ['⚙ Configured'], [], true, []],
  ['inactive is not active', { enabled: false }, ['Inactive'], [], false, []],
]) {
  test(`status reconciliation: ${name}`, () => {
    assert.deepEqual(reconcileAgentStatus({ configuration, rows: statuses.map(status => ({ status })),
      missingWorkflowPaths: missing, hasWorkflowDefinitions: definitions }), expected);
  });
}

test('human review is a manual role, while a present workflow is not runtime evidence', () => {
  assert.equal(agent('human-review').workflowDefinitionState, 'human-only');
  assert.ok(inventory.agents.every(entry => entry.executionObserved === false));
  assert.ok(inventory.workflows.every(workflow => workflow.executionObserved === false));
  assert.ok(agent('extrimli-cuz-validator-agent').migrationBlockers.includes('missing-workflow:.github/workflows/extrimli-cuz-validator.yml'));
  assert.ok(agent('mrkli-mrak-validator-agent').migrationBlockers.includes('missing-workflow:.github/workflows/mrkli-mrak-validator.yml'));
});

test('documentation-only and feature-track entries do not silently enlarge the 43-agent namespace', () => {
  assert.equal(inventory.discrepancies.documentedWithoutConfiguration.length, 16);
  assert.deepEqual(inventory.discrepancies.configuredWithoutDocumentation, []);
  assert.ok(inventory.discrepancies.featureTracksOutsideAgentNamespace.includes('force-validator-agent'));
  assert.ok(!inventory.agents.some(entry => entry.id === 'force-validator-agent'));
});

test('all sixteen identities outside the catalog are explicitly documented-only in both tables', () => {
  const docs = parseAgentDocs(readFileSync(join(root, 'AGENTS.md'), 'utf8'));
  for (const id of inventory.discrepancies.documentedWithoutConfiguration) {
    const row = docs.rows.get(id);
    assert.ok(row, id);
    const rows = [row, ...row.duplicateRows];
    assert.deepEqual(rows.map(item => item.language).sort(), ['en', 'sr'], id);
    assert.ok(rows.every(item => item.status === '📖 Documented only'), id);
    assert.ok(!inventory.agents.some(entry => entry.id === id));
  }
});

test('six previously undocumented configured roles cite their existing workflow and remain unverified', () => {
  for (const id of ['aktiviti-all-validator-agent', 'another-races-ops-agent', 'digitron-validator-agent',
    'geografija-realna-validator-agent', 'okrid-governance', 'tacskrin-validator-agent']) {
    const entry = agent(id);
    assert.equal(entry.roleSource, 'AGENTS.md');
    assert.equal(entry.documentation.registered.status, '⚙ Configured');
    const sections = [entry.documentation.roleSection, ...entry.documentation.duplicateSections.map(section => section.text.join('\n'))];
    assert.equal(sections.length, 2);
    for (const section of sections) {
      assert.ok(entry.workflowReferences.some(ref => section.includes(ref.path)), id);
      assert.ok(section.includes('execution unverified'), id);
    }
    assert.equal(entry.executionObserved, false);
    assert.equal(entry.importActivation, false);
    assert.ok(!entry.discrepancies.includes('enabled-config-not-documented-active'));
  }
});

test('linked persona aliases stay unresolved instead of binding to similarly named agents', () => {
  const link = agent('another-maks-agent').dependencies.linkedAgents.find(dep => dep.id === 'maksimus-2');
  assert.equal(link.resolution, 'unresolved-agent-or-persona');
  assert.equal(link.enabled, null);
  assert.ok(agent('maksimus-validator-agent').dependencies.linkedAgents.some(dep => dep.id === 'persona-bank-agent' && dep.resolution === 'documented-only'));
});

test('duplicate inventory IDs cannot hide an omitted agent', () => {
  const changed = clone(); changed.agents[1] = structuredClone(changed.agents[0]);
  assert.throws(() => validateInventory(changed, inventory), /duplicate-agent-id/);
});

for (const [name, mutate, error] of [
  ['count', value => value.agents.pop(), /expected-43-agents/],
  ['version', value => { value.schemaVersion = 2; }, /invalid-inventory-header/],
  ['enabled type', value => { value.agents[0].configEnabled = 'true'; }, /invalid-enabled/],
  ['runtime claim', value => { value.agents[0].executionObserved = true; }, /execution-claim-forbidden/],
  ['activation claim', value => { value.agents[0].importActivation = true; }, /execution-claim-forbidden/],
  ['source hash', value => { value.sourceFiles[0].sha256 = '0'.repeat(64); }, /inventory-source-mismatch/],
  ['source revision', value => { value.sourceRevision = '0'.repeat(40); }, /inventory-source-mismatch/],
  ['workflow permissions', value => { value.workflows[0].permissions = 'write-all'; }, /inventory-source-mismatch/],
  ['capabilities', value => { value.agents[0].requiredCapabilities = []; }, /inventory-source-mismatch/],
  ['hidden executable', value => { value.agents[0].execution = { shell: 'echo unsafe' }; }, /inventory-source-mismatch/],
  ['unknown root field', value => { value.apply = true; }, /inventory-source-mismatch/],
  ['source duplicate', value => { value.sourceFiles.push(value.sourceFiles[0]); }, /duplicate-source-path/],
  ['workflow duplicate', value => { value.workflows.push(value.workflows[0]); }, /duplicate-source-path/],
]) {
  test(`rejects changed ${name}`, () => {
    const changed = clone(); mutate(changed);
    assert.throws(() => dryRunAgentImport(changed, inventory), error);
  });
}

for (const [name, patch] of [
  ['apply', { mode: 'apply' }], ['production', { environment: 'production' }],
  ['activation', { activate: true }], ['positive cost', { costMicros: 1 }],
  ['negative cost', { costMicros: -1 }], ['missing permission', { permissions: [] }],
  ['write permission', { permissions: ['inventory:read', 'contents:write'] }],
  ['duplicate permission', { permissions: ['inventory:read', 'inventory:read'] }],
  ['shell', { execution: { kind: 'shell', command: 'node arbitrary.mjs' } }],
  ['workflow dispatch', { execution: { kind: 'github-workflow' } }],
  ['PR1373 adapter', { execution: { kind: 'file-manifest', files: ['README.md'] } }],
  ['secret injection', { env: { TEST_TOKEN: 'synthetic' } }],
  ['approval bypass', { humanApproval: true }],
]) {
  test(`dry-run refuses ${name}`, () => assert.throws(
    () => dryRunAgentImport(inventory, inventory, { ...DRY_RUN_POLICY, ...patch }), /unsupported-import-permissions-or-execution/));
}

test('malformed JSON, duplicate keys and escaped duplicate keys are rejected', () => {
  for (const text of ['{', '{"agents":{},"agents":{}}', '{"a":1,"\\u0061":2}', '{"agents":{"a":{},"a":{}}}']) {
    assert.throws(() => parseJsonStrict(text));
  }
  assert.deepEqual(parseJsonStrict('{"a":{"x":1},"b":{"x":2}}'), { a: { x: 1 }, b: { x: 2 } });
});

test('unsafe keys, oversized JSON and recursive in-memory objects fail closed', () => {
  assert.throws(() => parseJsonStrict('{"__proto__":{"enabled":true}}'), /unsafe-key/);
  assert.throws(() => parseJsonStrict('{"constructor":{}}'), /unsafe-key/);
  assert.throws(() => parseJsonStrict(' '.repeat(MAX_JSON_BYTES + 1)), /json-limit/);
  const cycle = {}; cycle.self = cycle;
  assert.throws(() => canonical(cycle), /invalid-json-value/);
});

test('YAML on stays a trigger; job permissions, conditions and dependencies are preserved', () => {
  const result = parseWorkflow('.github/workflows/example.yml', `name: example
on: [push, workflow_dispatch]
permissions:
  contents: read
jobs:
  check:
    runs-on: ubuntu-latest
    permissions:
      issues: write
    needs: [prior]
    if: always()
    steps:
      - run: echo safe
`);
  assert.deepEqual(result.triggers, ['push', 'workflow_dispatch']);
  assert.deepEqual(result.jobs[0].declaredPermissions, { issues: 'write' });
  assert.equal(result.jobs[0].inheritedPermissions, null);
  assert.deepEqual(result.jobs[0].needs, ['prior']);
  assert.equal(result.jobs[0].condition, 'always()');
});

test('YAML duplicate keys and executable custom tags cannot enter workflow evidence', () => {
  assert.throws(() => parseWorkflow('duplicate.yml', 'jobs: {}\njobs: {}'));
  assert.throws(() => parseWorkflow('tag.yml', 'jobs: !!js/function function() {}'));
});

test('local reusable workflow dependencies are included; external revisions stay unresolved', () => {
  assert.ok(agent('delet-validator-agent').workflowDependencyClosure.includes('.github/workflows/_validator-template.yml'));
  const ref = agent('calculator-validator-agent').dependencies.workflowPermissions
    .flatMap(workflow => workflow.references).find(item => item.value.endsWith('_validator-template.yml@main'));
  assert.equal(ref.resolution, 'external-reference-not-fetched');
  assert.equal(ref.immutable, false);
});

test('bilingual documentation remains separate evidence instead of a false duplicate-ID error', () => {
  const parsed = parseAgentDocs('### ci-bot\nSrpski opis\n# AGENTS (English)\n### ci-bot\nEnglish description');
  const section = parsed.sections.get('ci-bot');
  assert.equal(section.language, 'sr');
  assert.equal(section.duplicateSections[0].language, 'en');
  assert.deepEqual(inventory.agents.filter(entry => entry.discrepancies.includes('duplicate-documentation-in-same-language'))
    .map(entry => entry.id), ['nude-validator-agent']);
});

test('source reader refuses traversal and direct or intermediate symlinks', () => {
  const directory = mkdtempSync(join(tmpdir(), 'spaja-inventory-test-'));
  try {
    mkdirSync(join(directory, 'real'));
    writeFileSync(join(directory, 'real/file.json'), '{}');
    symlinkSync(join(directory, 'real'), join(directory, 'alias'));
    symlinkSync(join(directory, 'real/file.json'), join(directory, 'file.json'));
    assert.throws(() => readSource(directory, '../outside.json'), /unsafe-source-path/);
    assert.throws(() => readSource(directory, '/absolute.json'), /unsafe-source-path/);
    assert.throws(() => readSource(directory, 'file.json'), /source-symlink/);
    assert.throws(() => readSource(directory, 'alias/file.json'), /source-symlink/);
    assert.equal(readSource(directory, 'real/file.json'), '{}');
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('actual dry-run CLI succeeds with filesystem writes and subprocesses denied by Node', () => {
  const result = spawnSync(process.execPath, ['--permission', `--allow-fs-read=${root}`,
    'scripts/spaja-agent-inventory/cli.mjs', 'dry-run'], { cwd: root, encoding: 'utf8', timeout: 15_000, maxBuffer: MAX_JSON_BYTES });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).summary.importedEnabled, 0);
});

test('CLI rejects execution flags and forged imports with nonzero exit and no payload echo', () => {
  const directory = mkdtempSync(join(tmpdir(), 'spaja-inventory-cli-'));
  try {
    const input = join(directory, 'bad.json');
    writeFileSync(input, '{"secret":"synthetic-do-not-echo",');
    for (const args of [['apply'], ['dry-run', '--execute'], ['dry-run', '--input', input]]) {
      const result = spawnSync(process.execPath, ['scripts/spaja-agent-inventory/cli.mjs', ...args],
        { cwd: root, encoding: 'utf8', timeout: 15_000 });
      assert.equal(result.status, 1);
      assert.equal(result.stdout, '');
      assert.ok(!result.stderr.includes('synthetic-do-not-echo'));
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
