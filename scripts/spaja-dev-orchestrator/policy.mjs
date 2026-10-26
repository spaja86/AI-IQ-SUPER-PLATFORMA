import { createHash } from 'node:crypto';
import { lstatSync, realpathSync, readFileSync } from 'node:fs';
import { join, sep } from 'node:path';

export const MODES = Object.freeze([3, 6, 9, 12, 15, 18, 24]);
export const DEFAULT_LIMITS = Object.freeze({
  taskMs: 30_000, totalTaskMs: 600_000, maxAttempts: 3,
  heapMb: 64, rssMb: 192, outputBytes: 16_384, artifactBytes: 65_536,
  costMicros: 0,
});
export const digest = value => createHash('sha256').update(value).digest('hex');
export function keys(value, allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      Object.keys(value).some(key => !allowed.includes(key))) throw new Error('Unknown fields or invalid object.');
}
export function relativeFile(value) {
  if (typeof value !== 'string' || value.length > 240 ||
      !/^[a-zA-Z0-9_./-]+\.(?:mjs|js|ts|json|md)$/.test(value) ||
      value.split('/').some(p => !p || p.startsWith('.') || p === 'node_modules')) {
    throw new Error('Only explicit relative source paths are allowed.');
  }
  return value;
}
export function safeFile(root, relative) {
  relativeFile(relative);
  let path = root;
  for (const part of relative.split('/')) {
    path = join(path, part);
    if (lstatSync(path).isSymbolicLink()) throw new Error('Symlinks are not allowed.');
  }
  if (!realpathSync(path).startsWith(`${root}${sep}`) || !lstatSync(path).isFile() || lstatSync(path).size > 1_048_576) {
    throw new Error('Source must be a regular file of at most 1 MiB within workspace.');
  }
  return path;
}
export function validatePlan(input) {
  keys(input, ['version', 'hours', 'limits', 'tasks']);
  if (input.version !== 1 || !MODES.includes(input.hours ?? 3)) throw new Error('Unsupported plan version or hours.');
  keys(input.limits ?? {}, Object.keys(DEFAULT_LIMITS));
  const limits = { ...DEFAULT_LIMITS, ...input.limits };
  const minimum = { taskMs: 100, totalTaskMs: 100, maxAttempts: 1, heapMb: 16, rssMb: 32, outputBytes: 256, artifactBytes: 4096, costMicros: 0 };
  for (const [key, value] of Object.entries(limits)) {
    if (!Number.isSafeInteger(value) || value < minimum[key] || value > DEFAULT_LIMITS[key]) throw new Error(`Invalid limit: ${key}`);
  }
  if (limits.taskMs > limits.totalTaskMs) throw new Error('Task budget exceeds total budget.');
  if (!Array.isArray(input.tasks) || input.tasks.length < 1 || input.tasks.length > 64) throw new Error('Plan needs 1–64 tasks.');
  const tasks = input.tasks.map(task => {
    const specific = { 'generate-module': ['moduleName', 'operation'], 'verify-module': ['source'], 'file-manifest': ['files'] };
    if (!specific[task?.kind]) throw new Error('Unsupported task adapter.');
    keys(task, ['id', 'kind', 'dependsOn', ...specific[task.kind]]);
    if (typeof task.id !== 'string' || !/^[a-z][a-z0-9-]{0,47}$/.test(task.id)) throw new Error('Invalid task id.');
    const dependsOn = task.dependsOn ?? [];
    if (!Array.isArray(dependsOn) || new Set(dependsOn).size !== dependsOn.length || dependsOn.length > 64) throw new Error('Invalid dependencies.');
    if (task.kind === 'generate-module' && (typeof task.moduleName !== 'string' || !/^[a-zA-Z][a-zA-Z0-9_]{0,47}$/.test(task.moduleName) || !['sum', 'clamp'].includes(task.operation))) throw new Error('Invalid module blueprint.');
    if (task.kind === 'verify-module' && !dependsOn.includes(task.source)) throw new Error('Verification must depend on its source.');
    if (task.kind === 'file-manifest') {
      if (!Array.isArray(task.files) || task.files.length < 1 || task.files.length > 32 || new Set(task.files).size !== task.files.length) throw new Error('Invalid source list.');
      task.files.forEach(relativeFile);
    }
    return structuredClone({ ...task, dependsOn });
  });
  const byId = new Map(tasks.map(t => [t.id, t]));
  if (byId.size !== tasks.length) throw new Error('Duplicate task ids.');
  const visited = new Set();
  const visit = (id, stack = new Set()) => {
    if (stack.has(id) || !byId.has(id)) throw new Error('Cycle or missing dependency.');
    if (visited.has(id)) return;
    for (const dependency of byId.get(id).dependsOn) visit(dependency, new Set([...stack, id]));
    visited.add(id);
  };
  tasks.forEach(t => {
    visit(t.id);
    if (t.kind === 'verify-module' && byId.get(t.source)?.kind !== 'generate-module') throw new Error('Verification source must generate a module.');
  });
  return { version: 1, hours: input.hours ?? 3, limits, tasks };
}

// A deterministic code generator, not an AI agent. Inputs cannot supply source code.
export function moduleFiles(task) {
  const body = task.operation === 'sum'
    ? "export function calculate(values) {\n  if (!Array.isArray(values) || values.some(x => typeof x !== 'number' || !Number.isFinite(x))) throw new TypeError('finite numbers required');\n  const result = values.reduce((a, b) => a + b, 0);\n  if (!Number.isFinite(result)) throw new RangeError('sum overflow');\n  return result;\n}\n"
    : "export function calculate(value, min, max) {\n  if (![value, min, max].every(x => typeof x === 'number' && Number.isFinite(x)) || min > max) throw new TypeError('ordered finite bounds required');\n  return Math.min(max, Math.max(min, value));\n}\n";
  const cases = task.operation === 'sum'
    ? "test('empty and mixed signs', () => { assert.equal(calculate([]), 0); assert.equal(calculate([2, -3, 5]), 4); });\ntest('invalid input and overflow', () => { assert.throws(() => calculate([NaN])); assert.throws(() => calculate(['2'])); assert.throws(() => calculate([Number.MAX_VALUE, Number.MAX_VALUE])); });\n"
    : "test('clamps and preserves values', () => { assert.equal(calculate(-2, 0, 10), 0); assert.equal(calculate(12, 0, 10), 10); assert.equal(calculate(5, 0, 10), 5); });\ntest('invalid bounds', () => { assert.throws(() => calculate(1, 3, 2)); assert.throws(() => calculate(NaN, 0, 1)); });\n";
  return {
    [`${task.moduleName}.mjs`]: body,
    [`${task.moduleName}.test.mjs`]: `import { test } from 'node:test';\nimport assert from 'node:assert/strict';\nimport { calculate } from './${task.moduleName}.mjs';\n${cases}`,
  };
}

export function manifest(workspace, files) {
  return files.map(file => ({ path: file, sha256: digest(readFileSync(safeFile(workspace, file))) }));
}
