import { realpathSync, statSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { DEVELOPER_CREATE_NOTES_1450_CANONICAL_ALIAS } from '../extrimli/developer-create-vrh-ekviladenta-contract';

export const NODE_1450_ALIAS = 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == NODE 1450';

/** Deterministic read-only planner, not an LLM, compiler or code generator. */
export function createNode1450Plan(root: string, goal: string, files: string[]) {
  if (!goal.trim() || goal.length > 2000) throw new Error('Goal must contain 1–2000 characters.');
  if (!files.length || files.length > 20) throw new Error('Select 1–20 existing source files.');
  const base = realpathSync(root);
  const targets = [...new Set(files)].map((file) => {
    if (isAbsolute(file) || file.includes('\\') || file.split('/').some(p => p === '..' || p.startsWith('.'))) {
      throw new Error('Unsafe target path.');
    }
    if (!/^(src|scripts|docs)\//.test(file) || !/\.(ts|tsx|js|mjs|md)$/.test(file)
      || /(^|\/)(secrets?|credentials?)(\/|\.)/i.test(file)) throw new Error('Target is outside the source allowlist.');
    const actual = realpathSync(resolve(base, file));
    const rel = relative(base, actual);
    if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)
      || actual !== resolve(base, file) || !statSync(actual).isFile()) throw new Error('Target must be a regular non-symlink source file inside the repository.');
    return file;
  });
  return {
    canonicalAlias: NODE_1450_ALIAS,
    handoffReference: DEVELOPER_CREATE_NOTES_1450_CANONICAL_ALIAS,
    mode: 'read-only-plan', status: 'proposed', goal: goal.trim(), targets,
    ownership: { technical: 'EXTREM / DOK–DIK–FOR', governance: 'EXTRONDOL / DAK–DUK', summary: 'SPAJA KOD' },
    steps: [
      { owner: 'EXTREM', action: 'Inspect target source and relevant tests; prepare a minimal diff.', outcome: 'not-executed' },
      { owner: 'EXTRONDOL', action: 'Review scope, security, rollback and human approval before publication.', outcome: 'not-executed' },
      { owner: 'SPAJA KOD', action: 'Summarize verified checks separately from proposed work.', outcome: 'not-executed' },
    ],
    suggestedChecks: ['git diff --check', 'npm run lint', 'npx tsc --noEmit', 'npm test'],
    checksExecuted: false, codeGenerated: false,
    humanReviewRequired: true,
    forbiddenOperations: ['secret-access', 'automatic-code-write', 'merge', 'deploy', 'payment', 'billing-mutation'],
    rollback: 'No changes applied by this planner; any later change requires its own rollback plan.',
  };
}
