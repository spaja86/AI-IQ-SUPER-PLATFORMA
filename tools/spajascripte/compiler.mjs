/** Strict bounded DSL → AST → validated integer IR → Java. No eval. */
export function parse(source) {
  if (typeof source !== 'string' || Buffer.byteLength(source) > 16384) throw new Error('Source exceeds 16 KiB');
  const statements = [];
  for (const [index, raw] of source.split(/\r?\n/).entries()) {
    const text = raw.trim(), line = index + 1;
    if (!text || text.startsWith('#')) continue;
    if (statements.length >= 100) throw new Error('Maximum 100 statements');
    const declaration = /^LET ([a-z][a-z0-9_]{0,31}) = (.+)$/.exec(text);
    const print = /^PRINT (.+)$/.exec(text);
    if (!declaration && !print) throw new Error(`Line ${line}: expected LET or PRINT`);
    const parts = (declaration ? declaration[2] : print[1]).split('+').map(p => p.trim());
    if (!parts.length || parts.length > 32) throw new Error(`Line ${line}: invalid expression`);
    const terms = parts.map(p => {
      if (/^-?\d{1,9}$/.test(p)) return { kind: 'integer', value: Number(p) };
      if (/^[a-z][a-z0-9_]{0,31}$/.test(p)) return { kind: 'identifier', name: p };
      throw new Error(`Line ${line}: unsupported expression`);
    });
    statements.push({ kind: declaration ? 'let' : 'print', ...(declaration ? { name: declaration[1] } : {}), line, terms });
  }
  if (!statements.length) throw new Error('Empty program');
  return { kind: 'program', version: '0.1', statements };
}

/** Validates external AST too: the generator must never trust raw Java text. */
export function validate(ast) {
  if (!ast || ast.kind !== 'program' || ast.version !== '0.1' || !Array.isArray(ast.statements) || !ast.statements.length || ast.statements.length > 100) throw new Error('Invalid AST');
  const symbols = new Map(), statements = [];
  const namePattern = /^[a-z][a-z0-9_]{0,31}$/;
  for (const statement of ast.statements) {
    if (!statement || !['let', 'print'].includes(statement.kind) || !Number.isInteger(statement.line) || statement.line < 1 || !Array.isArray(statement.terms) || !statement.terms.length || statement.terms.length > 32) throw new Error('Invalid statement');
    const terms = statement.terms.map(term => {
      if (term?.kind === 'integer' && Number.isInteger(term.value) && Math.abs(term.value) <= 999999999) return { java: String(term.value), value: term.value };
      if (term?.kind === 'identifier' && typeof term.name === 'string' && namePattern.test(term.name) && symbols.has(term.name)) return { ...symbols.get(term.name) };
      throw new Error(`Line ${statement.line}: undefined name or invalid term`);
    });
    let value = 0;
    for (const term of terms) {
      value += term.value;
      if (!Number.isSafeInteger(value) || Math.abs(value) > 2147483647) throw new Error(`Line ${statement.line}: integer overflow`);
    }
    const expression = terms.map(term => term.java).join(' + ');
    if (statement.kind === 'let') {
      if (typeof statement.name !== 'string' || !namePattern.test(statement.name) || symbols.has(statement.name)) throw new Error(`Line ${statement.line}: invalid or duplicate variable`);
      const javaName = `sp_${symbols.size}`;
      symbols.set(statement.name, { java: javaName, value });
      statements.push({ kind: 'let', name: statement.name, javaName, expression, value, type: 'int32' });
    } else statements.push({ kind: 'print', expression, value, type: 'int32' });
  }
  return { statements };
}

/** Always validates its input; no public raw-IR emission path. */
export function generateJava(ast) {
  const { statements } = validate(ast);
  const body = statements.map(s => s.kind === 'let' ? `    final int ${s.javaName} = ${s.expression};` : `    System.out.println(${s.expression});`);
  return `public final class SpajascripteProgram {\n  public static void main(String[] args) {\n${body.join('\n')}\n  }\n}\n`;
}

export function compile(source) {
  const ast = parse(source), { statements } = validate(ast);
  const prints = statements.filter(s => s.kind === 'print');
  return { version: '0.1', ast, statements, expectedOutput: prints.map(s => String(s.value)).join('\n') + (prints.length ? '\n' : ''), java: generateJava(ast) };
}
