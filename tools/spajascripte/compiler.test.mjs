import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { compile, parse, validate, generateJava } from './compiler.mjs';
const example = fileURLToPath(new URL('./example.spaja', import.meta.url));
const output = compile(readFileSync(example, 'utf8'));
assert.equal(output.expectedOutput, '42\n');
assert(output.java.includes('final int sp_1 = sp_0 + 22;'));
assert.equal(compile('LET class = -2\nPRINT class + 5').expectedOutput, '3\n');
for (const input of ['', 'PRINT unknown', 'LET x = 1\nLET x = 2', 'PRINT 1; System.exit(0)', 'PRINT Runtime.getRuntime()', 'PRINT 1 +', 'PRINT 999999999 + 999999999 + 999999999', 'x'.repeat(16385)]) assert.throws(() => compile(input));
assert.equal(compile('PRINT 0').expectedOutput, '0\n');
assert(compile('PRINT 008').java.includes('println(8)'));
assert.equal(compile('PRINT 008').expectedOutput, '8\n');
const jdk = spawnSync('javac', ['-version'], { encoding: 'utf8' });
if (jdk.error) console.log('SKIP: JVM integration; javac unavailable. Parser/generator tests passed.');
else {
  const run = spawnSync(process.execPath, [fileURLToPath(new URL('./cli.mjs', import.meta.url)), 'run', example], { encoding: 'utf8', timeout: 30000 });
  assert.equal(run.status, 0, run.stderr); assert.equal(run.stdout, output.expectedOutput);
  console.log('PASS: JVM output matches reference result.');
}
console.log('PASS: parser, generator, negative cases and bounded arithmetic.');

const ast = parse('LET number = 4\nPRINT number + 2');
assert.equal(ast.statements[0].line, 1);
assert.equal(ast.statements[1].terms[0].kind, 'identifier');
assert.equal(validate(ast).statements[1].type, 'int32');
assert.equal(generateJava(ast), compile('LET number = 4\nPRINT number + 2').java);
assert.throws(() => validate(parse('PRINT missing')));
assert.throws(() => generateJava({ kind: 'program', version: '0.1', statements: [{ kind: 'print', line: 1, terms: [{ kind: 'integer', value: 'System.exit(0)' }] }] }));
assert.throws(() => generateJava({ kind: 'program', version: '0.1', statements: [{ kind: 'let', name: 'x;exit', line: 1, terms: [{ kind: 'integer', value: 1 }] }] }));
assert.throws(() => compile('LET high = 999999999 + 999999999\nPRINT high + 999999999 + -999999999'));
assert.deepEqual(ast, parse('LET number = 4\nPRINT number + 2'));
console.log('PASS: AST structure, int32 validation, generator trust boundary and intermediate overflow rejection.');
