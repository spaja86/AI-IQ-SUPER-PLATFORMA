import { lstatSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { load, JSON_SCHEMA } from 'js-yaml';
import { assertJson, INVENTORY_VERSION, parseJsonStrict, sha256 } from '../../src/lib/deploy/agent-inventory.mjs';

export const REPOSITORY = 'spaja86/AI-IQ-SUPER-PLATFORMA';
// Reviewed associations where config does not name a workflow. These are evidence
// mappings, NOT executable entrypoints or guesses based on similar agent names.
const REVIEWED_WORKFLOWS = {
  'multi-repo-sync-agent': 'multi-repo-sync.yml',
  'calculator-validator-agent': 'calculator-validator.yml',
  'analytics-bot': 'analytics-bot.yml',
  'madagaskar-validator-agent': 'madagaskar-validator.yml',
  'konvenkcionalni-odnosi-validator-agent': 'konvenkcionalni-odnosi-validator.yml',
  'adutiv-validator-agent': 'adutiv-validator.yml',
  'chatgpt-katalog-validator-agent': 'chatgpt-katalog-validator.yml',
};
const unique = values => [...new Set(values)].sort();
const pointer = part => String(part).replaceAll('~', '~0').replaceAll('/', '~1');
export function leaves(value, path = '') {
  if (typeof value === 'string') return [{ pointer: path, value }];
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key, child]) => leaves(child, `${path}/${pointer(key)}`));
}

/** No traversal, symlinks (including intermediate directories), special files or large reads. */
export function readSource(root, relative) {
  if (typeof relative !== 'string' || relative.includes('\\') || relative.startsWith('/')
      || relative.split('/').some(part => !part || part === '.' || part === '..')) throw new Error('unsafe-source-path');
  const base = realpathSync(root);
  let current = base;
  for (const part of relative.split('/')) {
    current = join(current, part);
    if (lstatSync(current).isSymbolicLink()) throw new Error('source-symlink');
  }
  const stat = lstatSync(current);
  if (!current.startsWith(`${base}${sep}`) || !stat.isFile() || stat.size > 1_048_576) throw new Error('invalid-source-file');
  return readFileSync(current, 'utf8');
}

export function parseAgentDocs(text) {
  const sections = new Map();
  const rows = new Map();
  let current = null;
  let language = 'sr';
  text.split('\n').forEach((line, index) => {
    if (/^# AGENTS \(English\)/.test(line)) language = 'en';
    const heading = line.match(/^### ([a-z][a-z0-9-]+)(?:\s|$)/);
    if (heading) {
      const id = heading[1];
      current = { line: index + 1, language, text: [], duplicateSections: [] };
      if (sections.has(id)) sections.get(id).duplicateSections.push(current);
      else sections.set(id, current);
    } else if (/^#{1,3} /.test(line)) current = null;
    if (current) current.text.push(line);
    const cells = line.split('|').map(cell => cell.trim());
    if (cells.length === 8 && /^[a-z][a-z0-9-]+$/.test(cells[1])) {
      const row = { role: cells[2], trigger: cells[3], owner: cells[4],
        status: cells[5], scope: cells[6], line: index + 1, language, duplicateRows: [] };
      if (rows.has(cells[1])) rows.get(cells[1]).duplicateRows.push(row);
      else rows.set(cells[1], row);
    }
  });
  return { sections, rows };
}

/** Compare declarations only; neither an enabled flag nor a YAML file proves execution. */
export function reconcileAgentStatus({ configuration, rows, missingWorkflowPaths, hasWorkflowDefinitions }) {
  const active = rows.some(row => /\bActive\b/i.test(row.status));
  const disabled = rows.some(row => /\bDisabled\b/i.test(row.status));
  const issues = [];
  if (!configuration.enabled && active) issues.push('documented-active-but-config-disabled');
  if (configuration.enabled && disabled) issues.push('documented-disabled-but-config-enabled');
  if (!configuration.enabled && configuration.status === 'active') issues.push('configured-active-but-config-disabled');
  if (missingWorkflowPaths.length) {
    if (active) issues.push('documented-active-but-workflow-missing');
    if (configuration.status === 'active') issues.push('configured-active-but-workflow-missing');
  }
  if (!configuration.enabled && hasWorkflowDefinitions) issues.push('disabled-config-workflow-enforcement-unverified');
  // Configured and Missing workflow describe catalog/implementation state, not runtime health.
  if (configuration.enabled && rows.some(row => !/\b(?:Active|Configured|Missing workflow)\b/i.test(row.status))) {
    issues.push('enabled-config-not-documented-active');
  }
  return unique(issues);
}

export function parseWorkflow(path, text) {
  const definition = load(text, { schema: JSON_SCHEMA, json: false });
  assertJson(definition);
  if (!definition || typeof definition !== 'object' || Array.isArray(definition)
      || !definition.jobs || typeof definition.jobs !== 'object') throw new Error('invalid-workflow');
  const all = leaves(definition);
  const references = all.filter(item => item.pointer.endsWith('/uses')).map(item => ({
    ...item,
    resolution: item.value.startsWith('./.github/workflows/') ? 'local-workflow'
      : item.value.startsWith('./') ? 'local-action'
        : 'external-reference-not-fetched',
    immutable: /@[a-f0-9]{40}$/.test(item.value),
  }));
  const jobs = Object.entries(definition.jobs).map(([id, job]) => ({
    id, needs: job.needs ?? [], runsOn: job['runs-on'] ?? null, uses: job.uses ?? null,
    condition: job.if ?? null, environment: job.environment ?? null,
    declaredPermissions: job.permissions ?? null,
    inheritedPermissions: job.permissions === undefined ? (definition.permissions ?? 'repository-default-unknown') : null,
    timeoutMinutes: job['timeout-minutes'] ?? null,
  }));
  const commands = all.filter(item => /\/(run|script|test_commands)$/.test(item.pointer));
  const secretNames = unique(all.flatMap(item => [...item.value.matchAll(/secrets\.([A-Za-z_][A-Za-z0-9_]*)/g)].map(m => m[1])));
  const capabilities = ['github-actions-runtime', 'github-event-context', 'isolated-workspace'];
  if (commands.length) capabilities.push('restricted-process-execution');
  if (all.some(item => /setup-node|\bnpm\b|\bnpx\b|\bnode\b/.test(item.value))) capabilities.push('nodejs-toolchain');
  if (references.some(item => item.resolution === 'external-reference-not-fetched')) capabilities.push('external-action-resolution');
  if (all.some(item => /\bnpm (ci|install|audit)\b|\bcurl\b|\bfetch\(/.test(item.value))) capabilities.push('controlled-network');
  if (secretNames.length || all.some(item => /secrets\[|secrets\s*}}/.test(item.value))) capabilities.push('scoped-secret-access');
  if (definition.permissions || jobs.some(job => job.declaredPermissions)) capabilities.push('scoped-github-permissions');
  if (definition.on?.schedule) capabilities.push('bounded-scheduler');
  if (all.some(item => /github-script@/.test(item.value))) capabilities.push('github-api');
  const issues = [];
  if (!definition.on) issues.push('workflow-trigger-missing');
  if (!definition.permissions) issues.push('repository-default-permissions-unknown');
  if (references.some(item => !item.immutable && !item.value.startsWith('./'))) issues.push('mutable-external-reference');
  if (references.some(item => item.resolution === 'external-reference-not-fetched')) issues.push('external-code-not-inspected');
  if (jobs.some(job => !job.uses && job.timeoutMinutes === null)) issues.push('explicit-job-timeout-missing');
  if (all.some(item => item.value === 'write-all')) issues.push('broad-write-permissions');
  return { path, sha256: sha256(text), state: 'definition-present', definition,
    triggers: definition.on ?? null, permissions: definition.permissions ?? null,
    jobs, references, commands, secretNames, capabilities: unique(capabilities), issues: unique(issues),
    enabledFlagEnforcement: 'not-proven', executionObserved: false };
}

function sourceState(read, path) {
  if (/[*?]/.test(path)) return 'pattern-not-expanded';
  try { read(path); return 'file-present'; } catch (error) {
    if (error.code === 'ENOENT') return 'missing';
    throw error;
  }
}

export function buildInventory({ root, sourceRevision }) {
  if (!/^[a-f0-9]{40}$/.test(sourceRevision)) throw new Error('invalid-source-revision');
  root = resolve(root);
  const sourceFiles = new Map();
  const read = path => {
    const text = readSource(root, path);
    sourceFiles.set(path, { path, sha256: sha256(text) });
    return text;
  };
  const config = parseJsonStrict(read('.agent-config.json'));
  const pkg = parseJsonStrict(read('package.json'));
  read('package-lock.json');
  const docs = parseAgentDocs(read('AGENTS.md'));
  const registryText = read('src/lib/deploy/deploy-registry.ts');
  read('src/lib/deploy/deployment-provider.ts');
  read('src/lib/deploy/local-deployment-adapter.ts');
  read('src/lib/deploy/agent-inventory.mjs');
  read('scripts/spaja-agent-inventory/build.mjs');
  read('scripts/spaja-agent-inventory/cli.mjs');
  if (!config.agents || Object.keys(config.agents).length !== 43) throw new Error('expected-43-agents');
  const ids = Object.keys(config.agents).sort();
  if (ids.some(id => typeof config.agents[id].enabled !== 'boolean')) throw new Error('invalid-enabled');
  const workflowPaths = readdirSync(join(root, '.github/workflows')).filter(name => /\.ya?ml$/.test(name))
    .sort().map(name => `.github/workflows/${name}`);
  const workflows = workflowPaths.map(path => {
    const text = read(path);
    try { return parseWorkflow(path, text); } catch {
      return { path, sha256: sha256(text), state: 'invalid-definition', issues: ['yaml-or-workflow-invalid'],
        references: [], capabilities: [], executionObserved: false };
    }
  });
  const byPath = new Map(workflows.map(workflow => [workflow.path, workflow]));
  function closure(paths) {
    const found = new Set();
    const issues = new Set();
    function visit(path, stack) {
      if (stack.has(path)) { issues.add('workflow-dependency-cycle'); return; }
      if (found.has(path)) return;
      found.add(path);
      const workflow = byPath.get(path);
      if (!workflow) { issues.add(`missing-workflow:${path}`); return; }
      workflow.issues.forEach(issue => issues.add(issue));
      for (const ref of workflow.references) {
        if (ref.resolution === 'local-workflow') visit(ref.value.slice(2), new Set([...stack, path]));
      }
    }
    paths.forEach(path => visit(path, new Set()));
    return { paths: [...found].sort(), issues: [...issues].sort() };
  }
  const agents = ids.map(id => {
    const configuration = config.agents[id];
    const values = leaves(configuration);
    const row = docs.rows.get(id) ?? null;
    const section = docs.sections.get(id);
    const roleLine = section?.text.find(line => /^- \*\*Role\*\*:/.test(line));
    const refs = values.filter(item => /^\.github\/workflows\/[^*?\s]+\.ya?ml$/.test(item.value))
      .map(item => ({ path: item.value, evidence: `/.agent-config.json/agents/${id}${item.pointer}`, association: 'config-reference' }));
    if (REVIEWED_WORKFLOWS[id]) refs.push({ path: `.github/workflows/${REVIEWED_WORKFLOWS[id]}`,
      evidence: 'scripts/spaja-agent-inventory/build.mjs:REVIEWED_WORKFLOWS', association: 'reviewed-association' });
    const deps = closure(unique(refs.map(ref => ref.path)));
    const definitions = deps.paths.map(path => byPath.get(path)).filter(Boolean);
    const linkedAgents = unique(configuration.linkedAgents ?? []).map(target => ({ id: target,
      resolution: ids.includes(target) ? 'configured-agent' : docs.sections.has(target) || docs.rows.has(target)
        ? 'documented-only' : 'unresolved-agent-or-persona', enabled: config.agents[target]?.enabled ?? null }));
    const repositoryDependencies = unique(values.filter(item => /^spaja86\/[A-Za-z0-9_.-]+$/.test(item.value)).map(item => item.value));
    const testSuites = values.filter(item => /testSuite/i.test(item.pointer)).map(item => ({ ...item,
      resolution: item.value.startsWith('src/') ? sourceState(read, item.value) : 'suite-alias-unresolved' }));
    const fileDependencies = unique(values.flatMap(item => item.value.match(/(?:src|scripts|docs|platforms)\/[A-Za-z0-9_./*-]+\.(?:[cm]?[jt]sx?|md|json)/g) ?? []))
      .map(path => ({ path, state: sourceState(read, path) }));
    const commands = values.filter(item => /command|requiredChecks/i.test(item.pointer));
    const scripts = unique(commands.flatMap(item => [...item.value.matchAll(/\bnpm run ([a-zA-Z0-9:_-]+)/g)].map(m => m[1])))
      .map(name => ({ name, definition: pkg.scripts?.[name] ?? null }));
    const discrepancies = [];
    if (!section && !row) discrepancies.push('configuration-missing-from-AGENTS.md');
    if (!row) discrepancies.push('missing-registered-agents-row');
    const sectionVariants = section ? [section, ...section.duplicateSections] : [];
    const rowVariants = row ? [row, ...row.duplicateRows] : [];
    if (sectionVariants.length > new Set(sectionVariants.map(s => s.language)).size
        || rowVariants.length > new Set(rowVariants.map(r => r.language)).size) discrepancies.push('duplicate-documentation-in-same-language');
    if (new Set(rowVariants.map(r => r.status)).size > 1) discrepancies.push('conflicting-documentation-statuses');
    discrepancies.push(...reconcileAgentStatus({ configuration, rows: rowVariants,
      missingWorkflowPaths: deps.paths.filter(path => !byPath.has(path)),
      hasWorkflowDefinitions: definitions.length > 0 }));
    if (!configuration.enabled && refs.length) discrepancies.push('disabled-config-has-workflow-definition-reference');
    if (id === 'human-review') discrepancies.push('human-role-is-not-an-executable-agent');
    const capabilities = unique(['human-approval-before-activation', 'audit-log', 'zero-cost-admission',
      ...definitions.flatMap(workflow => workflow.capabilities),
      ...(commands.length ? ['restricted-process-execution', 'nodejs-toolchain'] : []),
      ...(repositoryDependencies.length ? ['cross-repository-policy'] : []),
      ...(id === 'human-review' ? ['human-review-binding'] : []),
      ...(id === 'deploy-bot' ? ['deployment-approval', 'verified-quality-gates'] : []),
    ]);
    const missing = ['agent-execution-adapter-not-implemented', 'human-activation-approval-not-granted',
      'execution-budget-and-permission-policy-not-bound', ...deps.issues,
      ...(!refs.length && id !== 'human-review' ? ['workflow-association-missing'] : []),
      ...(linkedAgents.some(agent => agent.resolution !== 'configured-agent') ? ['unresolved-linked-agents'] : []),
      ...(fileDependencies.some(file => file.state === 'missing') ? ['missing-referenced-files'] : []),
      ...(testSuites.some(suite => suite.resolution === 'suite-alias-unresolved') ? ['unresolved-test-suite-alias'] : []),
      ...(scripts.some(script => script.definition === null) ? ['missing-npm-script'] : []),
    ];
    return {
      id, role: configuration.role ?? row?.role ?? roleLine?.replace(/^- \*\*Role\*\*:\s*/, '') ?? definitions[0]?.definition?.name ?? 'not-documented',
      roleSource: configuration.role ? '.agent-config.json' : row || roleLine ? 'AGENTS.md'
        : definitions[0]?.definition?.name ? `${definitions[0].path}#/name` : null,
      configEnabled: configuration.enabled, configuration,
      documentation: { sectionLine: section?.line ?? null, registered: row,
        roleSection: section ? section.text.join('\n').trim() : null,
        duplicateSections: section?.duplicateSections ?? [] },
      workflowReferences: refs, workflowDependencyClosure: deps.paths,
      workflowDefinitionState: id === 'human-review' ? 'human-only'
        : refs.length === 0 ? 'no-associated-definition'
          : deps.paths.some(path => !byPath.has(path) || byPath.get(path).state !== 'definition-present')
            ? 'incomplete-definitions' : 'definitions-present-runtime-unverified',
      dependencies: { linkedAgents, repositories: repositoryDependencies, linkedModules: configuration.linkedModules ?? [],
        testSuites, files: fileDependencies, npmScripts: scripts, commandDeclarations: commands,
        workflowPermissions: definitions.map(workflow => ({ path: workflow.path, declared: workflow.permissions ?? null,
          jobs: workflow.jobs ?? [], secretNames: workflow.secretNames ?? [], references: workflow.references })),
      },
      requiredCapabilities: capabilities, migrationBlockers: unique(missing), discrepancies: unique(discrepancies),
      executionObserved: false, importActivation: false,
    };
  });
  const documentedIds = unique([...docs.sections.keys(), ...docs.rows.keys()]);
  const providers = [...registryText.matchAll(/^  ('[^']+'|[a-z-]+): \{ scope: '([^']+)', executionDefault: '([^']+)', resultVerification: '([^']+)', rollback: '([^']+)' \},?$/gm)]
    .map(m => ({ id: m[1].replaceAll("'", ''), scope: m[2], executionDefault: m[3], resultVerification: m[4], rollback: m[5] }));
  return {
    schemaVersion: INVENTORY_VERSION, repository: REPOSITORY, sourceRevision,
    evidenceScope: 'local-source-snapshot-no-runtime-observation',
    sourceFiles: [...sourceFiles.values()].sort((a, b) => a.path.localeCompare(b.path, 'en')),
    governance: Object.fromEntries(['orgSettings', 'deploymentGovernance', 'finops', 'xpDelivery', 'contributionFlow']
      .map(key => [key, config[key] ?? null])),
    packageDependencies: { dependencies: pkg.dependencies ?? {}, devDependencies: pkg.devDependencies ?? {} },
    deployRegistry: { providers, platformIds: [...registryText.matchAll(/^    id: '([^']+)'/gm)].map(m => m[1]),
      executableAgentAdapters: [], registryKind: 'deployment-platforms-not-agent-runtime' },
    relatedDraft: { number: 1373, revision: 'af227ea66de81268c637041432e02b99eefd726c',
      status: 'draft-at-review-2026-10-28', includedInThisBranch: false,
      adapters: ['file-manifest', 'generate-module', 'verify-module'],
      compatibility: 'bounded-development-tasks-only-not-configured-project-agents' },
    discrepancies: {
      documentedWithoutConfiguration: documentedIds.filter(id => !ids.includes(id)),
      configuredWithoutDocumentation: ids.filter(id => !documentedIds.includes(id)),
      conflictingDocumentedStatuses: documentedIds.filter(id => {
        const row = docs.rows.get(id);
        return row && new Set([row, ...row.duplicateRows].map(r => r.status)).size > 1;
      }),
      featureTracksOutsideAgentNamespace: Object.keys(config.featureTracks ?? {}).filter(id => id.endsWith('-agent')).sort(),
      enabledDoesNotProveExecution: true, workflowDefinitionsDoNotProveExecution: true,
    },
    agents, workflows,
  };
}
