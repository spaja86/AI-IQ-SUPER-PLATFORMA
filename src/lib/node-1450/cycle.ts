import { analyzeTypeScriptDiagnostics } from './diagnostics';
import { createNode1450Plan } from './index';

/** Locations can move after edits, so comparison uses file/code counts, not line identity. */
export function compareDiagnosticRounds(before: Record<string, number>, after: Record<string, number>) {
  return [...new Set([...Object.keys(before), ...Object.keys(after)])].sort().map(code => ({
    code, before: before[code] ?? 0, after: after[code] ?? 0,
    countDelta: (after[code] ?? 0) - (before[code] ?? 0),
  }));
}

export function buildAnalysisRound(root: string, target: string, text: string, exitCode: number | null, previous?: string) {
  if (exitCode !== 0 && exitCode !== 1 && exitCode !== 2) throw new Error('Compiler did not complete normally.');
  // Keep target validation even on successful, empty compiler output.
  createNode1450Plan(root, 'TypeScript analysis cycle', [target]);
  if (!target.startsWith('src/lib/extrimli-extrem/') || !/\.tsx?$/.test(target)) throw new Error('Select an EXTREM TypeScript target.');
  const analysis = exitCode === 0
    ? { target, parsedDiagnostics: 0, targetDiagnostics: 0, groups: {} as Record<string, number>, findings: [] }
    : analyzeTypeScriptDiagnostics(root, text, target);
  if (exitCode === 0 && /error TS\d+/.test(text)) throw new Error('Compiler status conflicts with diagnostic output.');
  const prior = previous === undefined ? undefined : analyzeTypeScriptDiagnostics(root, previous, target);
  return {
    functionName: 'Function.analiza.typescripte.reper.typescript.return.to.analiza',
    compilerExitCode: exitCode, typecheckPassed: exitCode === 0, analysis,
    comparison: prior ? compareDiagnosticRounds(prior.groups, analysis.groups) : null,
    comparisonMeaning: 'Per-code count differences only; not proof that individual diagnostics were repaired.',
    nextStep: exitCode === 0 ? 'Review targeted tests before release.' : 'Prepare and review one minimal patch, run targeted tests, then rerun this command.',
    codeChanged: false, testsExecuted: false, deploymentExecuted: false,
  };
}
