export interface ASTNode {
  type: 'Command';
  name: string;
  args: string[];
}

const COMMAND_PATTERN = /^([\p{L}_][\p{L}\p{N}_]*)\s*:\s*(.*)$/u;

const SUPPORTED_COMMANDS = new Set<string>([
  'MOŽE',
  'MOZE',
  'ŽELIM',
  'ZELIM',
  'DO',
  'WAIT',
  'ASSERT',
  'PRIV',
  'ECHO',
]);

function normalizeCommand(raw: string): string {
  const upper = raw.trim().toLocaleUpperCase('sr-RS');
  if (!SUPPORTED_COMMANDS.has(upper)) {
    throw new Error(`Nepodržana naredba: "${raw}"`);
  }

  if (upper === 'MOZE') return 'MOŽE';
  if (upper === 'ZELIM') return 'ŽELIM';
  return upper;
}

function parseArgs(argument: string): string[] {
  const value = argument.trim();
  if (!value) return [];
  return [value];
}

export function parseSpajaUltra(input: string): ASTNode[] {
  const ast: ASTNode[] = [];
  const lines = input.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    const match = trimmed.match(COMMAND_PATTERN);
    if (!match) {
      throw new Error(`Nevalidna linija ${index + 1}: "${line}". Očekivan format je "NAREDBA: argument".`);
    }

    const name = normalizeCommand(match[1]);
    const args = parseArgs(match[2]);

    ast.push({
      type: 'Command',
      name,
      args,
    });
  }

  return ast;
}
