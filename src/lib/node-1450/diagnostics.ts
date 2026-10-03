import { openSync, readSync, closeSync, fstatSync } from 'node:fs';
import { constants } from 'node:fs';
import { createNode1450Plan } from './index';

const LIMIT = 1024 * 1024;
/** Bounded, non-symlink file read. Caller explicitly selects a local diagnostic artifact. */
export function readDiagnosticArtifact(path: string): string {
  if (!/\.(log|txt)$/.test(path) || path.split(/[\\/]/).some(p => p.startsWith('.'))) {
    throw new Error('Diagnostics must be an explicit non-dot .log or .txt artifact.');
  }
  const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const stat = fstatSync(fd);
    if (!stat.isFile() || stat.size > LIMIT) throw new Error('Diagnostic artifact must be a regular file of at most 1 MiB.');
    const buffer = Buffer.alloc(LIMIT + 1);
    let size = 0;
    while (size < buffer.length) {
      const count = readSync(fd, buffer, size, buffer.length - size, null);
      if (!count) break;
      size += count;
    }
    if (size > LIMIT) throw new Error('Diagnostic artifact exceeds 1 MiB.');
    return buffer.subarray(0, size).toString('utf8');
  } finally { closeSync(fd); }
}

export function analyzeTypeScriptDiagnostics(root: string, text: string, target: string) {
  createNode1450Plan(root, 'Analyze saved TypeScript diagnostics', [target]);
  if (!target.startsWith('src/lib/extrimli-extrem/') || !/\.tsx?$/.test(target)) {
    throw new Error('This increment supports one EXTREM TypeScript source target.');
  }
  if (Buffer.byteLength(text) > LIMIT) throw new Error('Diagnostics exceed 1 MiB.');
  const findings: { file: string; line: number; column: number; code: string; recommendation: string }[] = [];
  let parsed = 0;
  const recommendations: Record<string, string> = {
    TS2322: 'Compare the declared type with the assigned value; preserve the intended contract instead of adding a cast.',
    TS2345: 'Compare argument shape with the callee signature and inspect nearby call sites.',
    TS2339: 'Check whether the property is missing from the contract or misspelled at the call site.',
    TS2305: 'Check the exported symbol and import path before adding or renaming an export.',
    TS2741: 'Inspect the required field and related fixtures before supplying its value.',
  };
  for (const row of text.split(/\r?\n/)) {
    const match = /^(.+?)\((\d+),(\d+)\): error (TS\d+): /.exec(row);
    if (!match) continue;
    parsed++;
    if (match[1] !== target) continue;
    const line = Number(match[2]), column = Number(match[3]);
    if (!Number.isSafeInteger(line) || !Number.isSafeInteger(column) || line < 1 || column < 1) continue;
    if (findings.length >= 1000) throw new Error('Too many target diagnostics.');
    findings.push({ file: target, line, column, code: match[4], recommendation: recommendations[match[4]] ?? 'Inspect the compiler diagnostic and source contract; no automatic fix is inferred.' });
  }
  if (!parsed) throw new Error('No supported plain tsc diagnostics found; input does not establish a successful check.');
  const groups: Record<string, number> = {};
  for (const finding of findings) groups[finding.code] = (groups[finding.code] ?? 0) + 1;
  return { mode: 'saved-diagnostics-analysis', target, parsedDiagnostics: parsed, targetDiagnostics: findings.length,
    groups, findings, evidence: 'User-supplied diagnostic locations; current source and revision have not been compared.',
    sourceContentsAnalyzed: false, checksExecuted: false, codeGenerated: false, humanReviewRequired: true,
    testPlan: ['Inspect the referenced lines and related tests.', 'After a reviewed change, rerun tsc and targeted EXTREM tests.'],
    rollback: 'No changes applied; any later patch requires a separate rollback plan.' };
}
