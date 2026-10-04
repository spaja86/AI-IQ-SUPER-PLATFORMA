import { createNode1450Plan } from './index';

/** Read-only integration handoff. Does not parse or execute user programs. */
export function createSpajascripteNode1450Plan(root: string) {
  const plan = createNode1450Plan(root, 'Review Spajascripte named-loop integration while preserving existing VRH loop semantics', [
    'src/lib/petlje/spajascripte-reference-program.ts',
    'src/tests/lib/spajascripte-reference-program.test.ts',
    'src/lib/petlje/spajascripte-loop-adapter.ts',
    'src/lib/petlje/vrh-registry.ts',
    'src/tests/lib/spajascripte-loop-adapter.test.ts',
    'scripts/spajascripte-loop-demo.ts',
    'docs/SPAJASCRIPTE-LOOP-ADAPTER.md',
  ]);
  return {
    ...plan,
    integration: {
      node1450Role: 'read-only-review-planner',
      executionEngine: 'existing-nodejs-typescript-runtime',
      referenceLoop: 'FOR PETLJA',
      javaTranslationVerified: false,
      combinedLetLoopPrintImplemented: true,
      toolsSourceScope: 'tools/spajascripte is outside planner allowlist; not broadened here',
      gates: [
        'Define combined LET/LOOP/PRINT AST without discarding full PetljaResult.',
        'Compare reference adapter against original runner and retain limits/status handling.',
        'Reject Java named-loop target until real JVM translation and parity are verified.',
        'Review permissions and rollback before executing any generated plan.',
      ],
    },
  };
}
