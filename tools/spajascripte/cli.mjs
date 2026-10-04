import { readFileSync, writeFileSync, mkdtempSync, rmSync, watchFile, unwatchFile } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { compile } from './compiler.mjs';
const [command, file] = process.argv.slice(2);
function tool(executable, args) {
  const result = spawnSync(executable, args, { encoding: 'utf8', timeout: 10000, maxBuffer: 65536, env: { ...process.env, JAVA_TOOL_OPTIONS: '', JDK_JAVA_OPTIONS: '', _JAVA_OPTIONS: '' } });
  if (result.error) throw new Error(`${executable}: ${result.error.code}; install a supported JDK (21 recommended)`);
  if (result.status !== 0) throw new Error(`${executable} failed: ${result.stderr}`);
  return result.stdout;
}
function execute(action) {
  const program = compile(readFileSync(file, 'utf8'));
  if (action === 'check') { console.log('Valid Spajascripte v0.1'); return; }
  if (action === 'emit') { console.log(program.java); return; }
  const directory = mkdtempSync(join(tmpdir(), 'spajascripte-'));
  try {
    const javaFile = join(directory, 'SpajascripteProgram.java');
    writeFileSync(javaFile, program.java);
    tool('javac', ['-J-Xmx128m', '-proc:none', '-d', directory, javaFile]);
    if (action === 'run') process.stdout.write(tool('java', ['-Xmx64m', '-cp', directory, 'SpajascripteProgram']));
    else console.log('Java compilation passed (temporary artifacts removed).');
  } finally { rmSync(directory, { recursive: true, force: true }); }
}
try {
  if (!file || !['check', 'emit', 'build', 'run', 'watch'].includes(command)) throw new Error('Usage: node cli.mjs check|emit|build|run|watch <file.spaja>');
  if (command === 'watch') {
    const rebuild = () => { try { execute('build'); } catch (error) { console.error(error.message); } };
    rebuild();
    watchFile(file, { interval: 1000 }, rebuild);
    process.on('SIGINT', () => { unwatchFile(file); process.exit(0); });
  } else execute(command);
} catch (error) { console.error(error.message); process.exitCode = 1; }
