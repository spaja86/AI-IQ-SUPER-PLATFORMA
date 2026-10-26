import { readFile, stat, writeFile } from 'node:fs/promises';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePrSnapshot, PR_IMPORT_MAX_BYTES, serializePrs, summarizePrs } from '../src/lib/github-pr-import.ts';

try {
  const args = process.argv.slice(2);
  if (args.length !== 2) throw new Error('Upotreba: node --import tsx scripts/import-github-prs.mts INPUT.json OUTPUT.json');
  const input = resolve(args[0]), output = resolve(args[1]);
  const rel = relative(fileURLToPath(new URL('../', import.meta.url)), output);
  if (!rel || (!rel.startsWith('..') && !isAbsolute(rel))) throw new Error('Izlaz sa PR podacima mora biti izvan repozitorijuma.');
  if ((await stat(input)).size > PR_IMPORT_MAX_BYTES) throw new Error('Paket je veći od 16 MiB.');
  const snapshot = parsePrSnapshot(await readFile(input, 'utf8'));
  await writeFile(output, serializePrs(snapshot.pull_requests), { flag: 'wx', mode: 0o600 });
  console.log(JSON.stringify({ status: 'imported', ...summarizePrs(snapshot.pull_requests), output, codeExecution: false, remoteCiVerified: false }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Uvoz nije uspeo.');
  process.exitCode = 1;
}
