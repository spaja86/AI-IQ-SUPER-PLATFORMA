import type { AiiqLanguageAstNode } from './types';

/** Adapter for compiler AST, not a compiler, executor or source of approval. */
export function createAiiqBuildPlan(ast: readonly AiiqLanguageAstNode[]) {
  if (!Array.isArray(ast) || ast.length !== 4) throw new Error('Build-plan requires exactly four directives');
  const fields = new Map<string, string>();
  for (const node of ast) {
    if (!node || typeof node.op !== 'string' || typeof node.value !== 'string' || fields.has(node.op)) throw new Error('Invalid/duplicate build directive');
    fields.set(node.op, node.value);
  }
  const intent = fields.get('INTENT');
  if (intent !== 'JAVA_BUILD' && intent !== 'NEXT_BUILD' && intent !== 'JAVA_AND_NEXT_BUILD') throw new Error('Unsupported build intent');
  if (fields.get('RULE') !== 'NO_SECRET ALLOWLIST HUMAN_REVIEW' || fields.get('ORCHESTRATE') !== 'CHECK_THEN_BUILD_THEN_TEST' || fields.get('OUTPUT') !== 'VERIFIED_BUILD_REPORT') throw new Error('Unsupported build policy');
  const targets = intent === 'JAVA_AND_NEXT_BUILD' ? ['java', 'next'] : intent === 'JAVA_BUILD' ? ['java'] : ['next'];
  return {
    contractVersion: 'proposal-v1', mode: 'read-only-build-plan', status: 'proposed',
    humanReviewRequired: true, executionEnabled: false, buildsExecuted: false, buildVerified: false,
    targets: targets.map(target => ({ target, steps: [
      { action: 'check-toolchain', status: 'not-executed' },
      { action: target === 'java' ? 'generate-reviewed-java' : 'validate-next-project', status: 'not-executed' },
      { action: target === 'java' ? 'javac-generated-source' : 'next-build', status: 'not-executed' },
      { action: 'run-approved-tests', status: 'not-executed' },
    ], blockers: target === 'java' ? ['jdk-availability-unverified', 'named-vrh-loop-java-translation-unverified'] : ['project-build-state-unverified'] })),
    forbiddenOperations: ['arbitrary-shell', 'secret-access', 'automatic-write', 'merge', 'deploy', 'payment'],
  };
}

export const AIIQ_BUILD_PLAN_EXAMPLE: readonly AiiqLanguageAstNode[] = [
  { op: 'INTENT', value: 'JAVA_AND_NEXT_BUILD' },
  { op: 'RULE', value: 'NO_SECRET ALLOWLIST HUMAN_REVIEW' },
  { op: 'ORCHESTRATE', value: 'CHECK_THEN_BUILD_THEN_TEST' },
  { op: 'OUTPUT', value: 'VERIFIED_BUILD_REPORT' },
];
