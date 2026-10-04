/** Strict v0.1 DSL, not Java passthrough. No eval or arbitrary Java fragments. */
export function compile(source) {
  if (typeof source !== 'string' || Buffer.byteLength(source) > 16384) throw new Error('Source exceeds 16 KiB');
  const symbols = new Map();
  const statements = [], body = [];
  function expression(text, line) {
    const parts = text.split('+').map(p => p.trim());
    if (parts.length > 32 || parts.some(p => !p)) throw new Error(`Line ${line}: invalid expression`);
    return parts.map(p => {
      if (/^-?\d{1,9}$/.test(p)) return { java: String(Number(p)), value: Number(p) };
      if (symbols.has(p)) return symbols.get(p);
      throw new Error(`Line ${line}: undefined name or unsupported expression`);
    });
  }
  for (const [index, raw] of source.split(/\r?\n/).entries()) {
    const line = index + 1, text = raw.trim();
    if (!text || text.startsWith('#')) continue;
    if (statements.length >= 100) throw new Error('Maximum 100 statements');
    const declaration = /^LET ([a-z][a-z0-9_]{0,31}) = (.+)$/.exec(text);
    const print = /^PRINT (.+)$/.exec(text);
    if (!declaration && !print) throw new Error(`Line ${line}: expected LET or PRINT`);
    const terms = expression(declaration ? declaration[2] : print[1], line);
    const value = terms.reduce((sum, term) => sum + term.value, 0);
    if (!Number.isSafeInteger(value) || Math.abs(value) > 2147483647) throw new Error(`Line ${line}: integer overflow`);
    const java = terms.map(t => t.java).join(' + ');
    if (declaration) {
      const name = declaration[1];
      if (symbols.has(name)) throw new Error(`Line ${line}: duplicate variable`);
      const generated = `sp_${symbols.size}`;
      symbols.set(name, { java: generated, value });
      body.push(`    final int ${generated} = ${java};`);
      statements.push({ kind: 'let', name, value });
    } else {
      body.push(`    System.out.println(${java});`);
      statements.push({ kind: 'print', value });
    }
  }
  if (!statements.length) throw new Error('Empty program');
  return { version: '0.1', statements, expectedOutput: statements.filter(s => s.kind === 'print').map(s => String(s.value)).join('\n') + (statements.some(s => s.kind === 'print') ? '\n' : ''), java: `public final class SpajascripteProgram {\n  public static void main(String[] args) {\n${body.join('\n')}\n  }\n}\n` };
}
