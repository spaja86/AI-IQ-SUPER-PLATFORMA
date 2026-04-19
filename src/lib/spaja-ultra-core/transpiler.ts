import type { ASTNode } from './parser';

function normalizeCommandName(name: string, arg: string): { runtimeMethod: string; runtimeArg: string } {
  const upper = name.toLocaleUpperCase('sr-RS');

  if (upper === 'MOŽE' || upper === 'MOZE') return { runtimeMethod: 'moze', runtimeArg: arg };
  if (upper === 'ŽELIM' || upper === 'ZELIM') return { runtimeMethod: 'zelim', runtimeArg: arg };
  if (upper === 'DO') return { runtimeMethod: 'do', runtimeArg: arg };
  if (upper === 'WAIT') return { runtimeMethod: 'wait', runtimeArg: arg };
  if (upper === 'ASSERT') return { runtimeMethod: 'assert', runtimeArg: arg };
  if (upper === 'PRIV') return { runtimeMethod: 'priv', runtimeArg: arg };
  if (upper === 'ECHO') return { runtimeMethod: 'do', runtimeArg: `ECHO ${arg}`.trim() };

  throw new Error(`Transpajler ne podržava naredbu: "${name}"`);
}

export function transpile(ast: ASTNode[]): string {
  const bodyLines = ast.map((node, index) => {
    if (node.type !== 'Command') {
      throw new Error(`Nevalidan AST čvor na poziciji ${index}: očekivan je type="Command".`);
    }

    const arg = node.args.join(' ');
    const { runtimeMethod, runtimeArg } = normalizeCommandName(node.name, arg);

    return `  await runtime.${runtimeMethod}(${JSON.stringify(runtimeArg)}, ctx);`;
  });

  return `return (async function(runtime, ctx) {\n${bodyLines.join('\n')}\n});`;
}
