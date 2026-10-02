import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNode1450Plan } from '../../lib/node-1450';

const root = mkdtempSync(join(tmpdir(), 'node1450-'));
try {
  mkdirSync(join(root, 'src'));
  writeFileSync(join(root, 'src/example.ts'), 'export const value = 1;');
  const plan = createNode1450Plan(root, ' Review example ', ['src/example.ts', 'src/example.ts']);
  assert.equal(plan.goal, 'Review example');
  assert.deepEqual(plan.targets, ['src/example.ts']);
  assert.equal(plan.checksExecuted, false);
  assert.equal(plan.codeGenerated, false);
  assert.equal(plan.humanReviewRequired, true);
  assert.ok(plan.steps.every(step => step.outcome === 'not-executed'));
  for (const file of ['../example.ts', '/tmp/example.ts', '.env', 'src/.env.ts', 'src/../example.ts', 'contracts/example.sol', 'src/secrets.ts', 'src/missing.ts', 'src\\example.ts']) {
    assert.throws(() => createNode1450Plan(root, 'review', [file]));
  }
  assert.throws(() => createNode1450Plan(root, '', ['src/example.ts']));
  assert.throws(() => createNode1450Plan(root, 'review', []));
  assert.throws(() => createNode1450Plan(root, 'x'.repeat(2001), ['src/example.ts']));
  assert.throws(() => createNode1450Plan(root, 'review', Array(21).fill('src/example.ts')));
  symlinkSync(join(root, 'src/example.ts'), join(root, 'src/link.ts'));
  assert.throws(() => createNode1450Plan(root, 'review', ['src/link.ts']));
  console.log('NODE 1450 planner assertions passed (valid plan, boundaries, symlink, limits, no execution claims).');
} finally {
  rmSync(root, { recursive: true, force: true });
}
