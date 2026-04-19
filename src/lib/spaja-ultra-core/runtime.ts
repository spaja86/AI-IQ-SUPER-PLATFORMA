export interface AuditRecord {
  id: string;
  timestamp: string;
  cmd: string;
  arg: string;
  status: 'ok' | 'error';
  message?: string;
  duration?: number;
}

export interface RuntimeOptions {
  maxWaitMs?: number;
  logger?: (record: AuditRecord) => void;
}

export interface RuntimeContext {
  roles?: string[];
  onOutput?: (line: string) => void;
  [key: string]: unknown;
}

type TokenType = 'number' | 'boolean' | 'identifier' | 'operator' | 'paren' | 'eof';

interface Token {
  type: TokenType;
  value: string;
}

type ExpressionNode =
  | { type: 'Literal'; value: number | boolean }
  | { type: 'Identifier'; name: string }
  | { type: 'Unary'; operator: '!' | '-'; right: ExpressionNode }
  | {
    type: 'Binary';
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | '&&' | '||';
    left: ExpressionNode;
    right: ExpressionNode;
  };

const DEFAULT_MAX_WAIT_MS = 5000;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function makeRecordId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return bytesToHex(bytes);
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isIdentifierStart(char: string): boolean {
  return /[\p{L}_]/u.test(char);
}

function isIdentifierPart(char: string): boolean {
  return /[\p{L}\p{N}_.]/u.test(char);
}

function isDigit(char: string): boolean {
  return /[0-9]/.test(char);
}

function tokenizeExpression(input: string): Token[] {
  const tokens: Token[] = [];
  let position = 0;

  while (position < input.length) {
    const char = input[position];

    if (/\s/.test(char)) {
      position += 1;
      continue;
    }

    const twoChar = input.slice(position, position + 2);
    if (['==', '!=', '<=', '>=', '&&', '||'].includes(twoChar)) {
      tokens.push({ type: 'operator', value: twoChar });
      position += 2;
      continue;
    }

    if (['<', '>', '!', '-'].includes(char)) {
      tokens.push({ type: 'operator', value: char });
      position += 1;
      continue;
    }

    if (char === '(' || char === ')') {
      tokens.push({ type: 'paren', value: char });
      position += 1;
      continue;
    }

    if (isDigit(char) || (char === '.' && isDigit(input[position + 1] ?? ''))) {
      let end = position + 1;
      while (end < input.length && /[0-9.]/.test(input[end])) {
        end += 1;
      }
      const value = input.slice(position, end);
      if (!/^\d+(\.\d+)?$/.test(value) && !/^\.\d+$/.test(value)) {
        throw new Error(`Nevalidan broj u ASSERT izrazu: "${value}"`);
      }
      tokens.push({ type: 'number', value: value.startsWith('.') ? `0${value}` : value });
      position = end;
      continue;
    }

    if (isIdentifierStart(char)) {
      let end = position + 1;
      while (end < input.length && isIdentifierPart(input[end])) {
        end += 1;
      }
      const value = input.slice(position, end);
      if (value === 'true' || value === 'false') {
        tokens.push({ type: 'boolean', value });
      } else {
        tokens.push({ type: 'identifier', value });
      }
      position = end;
      continue;
    }

    throw new Error(`Nepodržan token u ASSERT izrazu: "${char}"`);
  }

  tokens.push({ type: 'eof', value: '' });
  return tokens;
}

class ExpressionParser {
  private index = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): ExpressionNode {
    const expression = this.parseOr();
    this.expect('eof');
    return expression;
  }

  private parseOr(): ExpressionNode {
    let node = this.parseAnd();
    while (this.match('operator', '||')) {
      const right = this.parseAnd();
      node = { type: 'Binary', operator: '||', left: node, right };
    }
    return node;
  }

  private parseAnd(): ExpressionNode {
    let node = this.parseEquality();
    while (this.match('operator', '&&')) {
      const right = this.parseEquality();
      node = { type: 'Binary', operator: '&&', left: node, right };
    }
    return node;
  }

  private parseEquality(): ExpressionNode {
    let node = this.parseRelational();
    while (true) {
      if (this.match('operator', '==')) {
        const right = this.parseRelational();
        node = { type: 'Binary', operator: '==', left: node, right };
        continue;
      }
      if (this.match('operator', '!=')) {
        const right = this.parseRelational();
        node = { type: 'Binary', operator: '!=', left: node, right };
        continue;
      }
      break;
    }
    return node;
  }

  private parseRelational(): ExpressionNode {
    let node = this.parseUnary();
    while (true) {
      if (this.match('operator', '<')) {
        const right = this.parseUnary();
        node = { type: 'Binary', operator: '<', left: node, right };
        continue;
      }
      if (this.match('operator', '<=')) {
        const right = this.parseUnary();
        node = { type: 'Binary', operator: '<=', left: node, right };
        continue;
      }
      if (this.match('operator', '>')) {
        const right = this.parseUnary();
        node = { type: 'Binary', operator: '>', left: node, right };
        continue;
      }
      if (this.match('operator', '>=')) {
        const right = this.parseUnary();
        node = { type: 'Binary', operator: '>=', left: node, right };
        continue;
      }
      break;
    }
    return node;
  }

  private parseUnary(): ExpressionNode {
    if (this.match('operator', '!')) {
      return { type: 'Unary', operator: '!', right: this.parseUnary() };
    }
    if (this.match('operator', '-')) {
      return { type: 'Unary', operator: '-', right: this.parseUnary() };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): ExpressionNode {
    const token = this.peek();

    if (token.type === 'number') {
      this.advance();
      return { type: 'Literal', value: Number(token.value) };
    }

    if (token.type === 'boolean') {
      this.advance();
      return { type: 'Literal', value: token.value === 'true' };
    }

    if (token.type === 'identifier') {
      this.advance();
      return { type: 'Identifier', name: token.value };
    }

    if (this.match('paren', '(')) {
      const expression = this.parseOr();
      this.expect('paren', ')');
      return expression;
    }

    throw new Error(`Nevalidan izraz u ASSERT-u kod tokena: "${token.value || 'EOF'}"`);
  }

  private match(type: TokenType, value?: string): boolean {
    const token = this.peek();
    if (token.type !== type) return false;
    if (value !== undefined && token.value !== value) return false;
    this.advance();
    return true;
  }

  private expect(type: TokenType, value?: string): Token {
    const token = this.peek();
    if (token.type !== type || (value !== undefined && token.value !== value)) {
      throw new Error(`Očekivan token ${value ?? type}, dobijen: "${token.value || token.type}"`);
    }
    return this.advance();
  }

  private peek(): Token {
    const token = this.tokens[this.index];
    if (!token) {
      throw new Error('Interna greška parsera: EOF token nedostaje.');
    }
    return token;
  }

  private advance(): Token {
    const token = this.peek();
    this.index += 1;
    return token;
  }
}

function resolveIdentifier(ctx: RuntimeContext, path: string): unknown {
  const segments = path.split('.');
  let current: unknown = ctx;

  for (const segment of segments) {
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }

    if (!Object.prototype.hasOwnProperty.call(current, segment)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

function evaluateExpressionNode(node: ExpressionNode, ctx: RuntimeContext): unknown {
  const toNumber = (value: unknown, source: string): number => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      throw new Error(`ASSERT očekuje numeričku vrednost za ${source}.`);
    }
    return numeric;
  };

  if (node.type === 'Literal') {
    return node.value;
  }

  if (node.type === 'Identifier') {
    return resolveIdentifier(ctx, node.name);
  }

  if (node.type === 'Unary') {
    const right = evaluateExpressionNode(node.right, ctx);
    if (node.operator === '!') return !Boolean(right);
    return -toNumber(right, 'unarni operator -');
  }

  if (node.operator === '&&') {
    return Boolean(evaluateExpressionNode(node.left, ctx)) && Boolean(evaluateExpressionNode(node.right, ctx));
  }

  if (node.operator === '||') {
    return Boolean(evaluateExpressionNode(node.left, ctx)) || Boolean(evaluateExpressionNode(node.right, ctx));
  }

  const left = evaluateExpressionNode(node.left, ctx);
  const right = evaluateExpressionNode(node.right, ctx);

  switch (node.operator) {
    case '==':
      return left === right;
    case '!=':
      return left !== right;
    case '<':
      return toNumber(left, 'levu stranu operatora <') < toNumber(right, 'desnu stranu operatora <');
    case '<=':
      return toNumber(left, 'levu stranu operatora <=') <= toNumber(right, 'desnu stranu operatora <=');
    case '>':
      return toNumber(left, 'levu stranu operatora >') > toNumber(right, 'desnu stranu operatora >');
    case '>=':
      return toNumber(left, 'levu stranu operatora >=') >= toNumber(right, 'desnu stranu operatora >=');
    default:
      return false;
  }
}

function evaluateAssertionExpression(expression: string, ctx: RuntimeContext): boolean {
  const parser = new ExpressionParser(tokenizeExpression(expression));
  return Boolean(evaluateExpressionNode(parser.parse(), ctx));
}

export class SpajaRuntime {
  private readonly auditLog: AuditRecord[] = [];

  constructor(private readonly options: RuntimeOptions = {}) {}

  async moze(permission: string, _ctx: RuntimeContext): Promise<void> {
    await this.withAudit('MOŽE', permission, async () => {
      return Promise.resolve();
    });
  }

  async zelim(wish: string, _ctx: RuntimeContext): Promise<void> {
    await this.withAudit('ŽELIM', wish, async () => {
      return Promise.resolve();
    });
  }

  async do(command: string, ctx: RuntimeContext): Promise<void> {
    await this.withAudit('DO', command, async () => {
      const trimmed = command.trim();
      if (trimmed.toLocaleUpperCase('sr-RS').startsWith('ECHO ')) {
        const output = trimmed.slice(5).trimStart();
        ctx.onOutput?.(output);
        return;
      }

      ctx.onOutput?.(`[DO] ${command}`);
    });
  }

  async wait(ms: string, _ctx: RuntimeContext): Promise<void> {
    await this.withAudit('WAIT', ms, async () => {
      const parsed = Number(ms);
      if (!Number.isFinite(parsed) || parsed < 0) {
        throw new Error(`WAIT očekuje nenegativan broj milisekundi, dobijeno: "${ms}"`);
      }

      const maxWait = Math.max(0, this.options.maxWaitMs ?? DEFAULT_MAX_WAIT_MS);
      const bounded = Math.min(Math.round(parsed), maxWait);
      await new Promise<void>((resolve) => {
        setTimeout(resolve, bounded);
      });
    });
  }

  async assert(expr: string, ctx: RuntimeContext): Promise<void> {
    await this.withAudit('ASSERT', expr, async () => {
      const passed = evaluateAssertionExpression(expr, ctx);
      if (!passed) {
        throw new Error(`ASSERT nije prošao: ${expr}`);
      }
    });
  }

  async priv(role: string, ctx: RuntimeContext): Promise<void> {
    await this.withAudit('PRIV', role, async () => {
      const roles = Array.isArray(ctx.roles) ? ctx.roles : [];
      if (!roles.includes(role)) {
        throw new Error(`Nedozvoljena uloga: ${role}`);
      }
    });
  }

  getAuditLog(): AuditRecord[] {
    return [...this.auditLog];
  }

  clearAuditLog(): void {
    this.auditLog.length = 0;
  }

  private async withAudit(cmd: string, arg: string, action: () => Promise<void>): Promise<void> {
    const startedAt = Date.now();
    const timestamp = new Date(startedAt).toISOString();

    try {
      await action();

      const record: AuditRecord = {
        id: makeRecordId(),
        timestamp,
        cmd,
        arg,
        status: 'ok',
        duration: Date.now() - startedAt,
      };
      this.auditLog.push(record);
      this.options.logger?.(record);
    } catch (error) {
      const record: AuditRecord = {
        id: makeRecordId(),
        timestamp,
        cmd,
        arg,
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startedAt,
      };
      this.auditLog.push(record);
      this.options.logger?.(record);
      throw error;
    }
  }
}

export function createRuntime(options?: RuntimeOptions): SpajaRuntime {
  return new SpajaRuntime(options);
}
