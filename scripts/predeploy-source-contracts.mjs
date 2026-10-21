import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import ts from 'typescript';

// Explicit source contracts, not a discovery list or a claim of live availability.
// The extreme route shares a contract with its canonical procesuiranje-svega API.
export const sourceContracts = [
  { key: 'analizaSvega', slug: 'analiza-svega', prefix: 'ANALIZA', header: 'Analiza', builder: 'buildAnalizaSvega', payload: 'filtered' },
  { key: 'potencijalSvegaOvogaDoSada', slug: 'potencijal-svega-ovoga-do-sada', prefix: 'POTENCIJAL', header: 'Potencijal', builder: 'buildPotencijalSvegaOvogaDoSada', payload: 'potencijal' },
  { key: 'ekstremnoProcesuiranjeSvega', slug: 'procesuiranje-svega', prefix: 'PROCESUIRANJE_SVEGA', header: 'Procesuiranje', builder: 'buildProcesuiranjeSvega', additionalRoute: { slug: 'ekstremno-procesuiranje-svega', builder: 'buildEkstremnoProcesuiranjeSvega' } },
  { key: 'procesuiranje3', slug: 'procesuiranje-3', prefix: 'PROCESUIRANJE_3', header: 'Procesuiranje3', builder: 'buildProcesuiranje3' },
  { key: 'maksimusSvega', slug: 'maksimus-svega', prefix: 'MAKSIMUS_SVEGA', header: 'Maksimus', builder: 'buildMaksimusSvega' },
  { key: 'maksimus2', slug: 'maksimus-2', prefix: 'MAKSIMUS_2', header: 'Maksimus2', builder: 'buildMaksimus2', blocker: false },
  { key: 'maksimus3', slug: 'maksimus-3', prefix: 'MAKSIMUS_3', header: 'Maksimus3', builder: 'buildMaksimus3', blocker: false },
];

function descendants(node) {
  const nodes = [];
  function visit(child) {
    nodes.push(child);
    ts.forEachChild(child, visit);
  }
  if (node) visit(node);
  return nodes;
}

const exported = node => node?.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
const propertyName = node => node && (ts.isIdentifier(node) || ts.isStringLiteral(node)) ? node.text : undefined;
const property = (object, name) => object.properties.find(node => ts.isPropertyAssignment(node) && propertyName(node.name) === name)?.initializer;
const identifier = (node, name) => node && ts.isIdentifier(node) && node.text === name;

function exportedStrings(source) {
  const values = new Map();
  for (const statement of source?.statements ?? []) {
    if (!ts.isVariableStatement(statement) || !exported(statement)
      || !(statement.declarationList.flags & ts.NodeFlags.Const)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer && ts.isStringLiteral(declaration.initializer)) {
        values.set(declaration.name.text, declaration.initializer.text);
      }
    }
  }
  return values;
}

function imports(source, moduleName) {
  const names = new Map();
  for (const node of source?.statements ?? []) {
    if (!ts.isImportDeclaration(node) || node.moduleSpecifier.text !== moduleName || node.importClause?.isTypeOnly) continue;
    const bindings = node.importClause?.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    for (const binding of bindings.elements) {
      if (!binding.isTypeOnly) names.set(binding.name.text, (binding.propertyName ?? binding.name).text);
    }
  }
  return names;
}

// Follow local function calls from the exported entry point. Comments, type
// declarations and uncalled header helpers cannot satisfy the route checks.
function functionNodes(source, entry) {
  const functions = new Map((source?.statements ?? [])
    .filter(node => ts.isFunctionDeclaration(node) && node.name && node.body)
    .map(node => [node.name.text, node]));
  const first = functions.get(entry);
  if (!first || !exported(first)) return [];
  const seen = new Set();
  const nodes = [];
  function visit(name) {
    if (seen.has(name) || !functions.has(name)) return;
    seen.add(name);
    function walk(node) {
      if (ts.isFunctionLike(node)) return;
      nodes.push(node);
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) visit(node.expression.text);
      ts.forEachChild(node, walk);
    }
    walk(functions.get(name).body);
  }
  visit(entry);
  return nodes;
}

export async function checkSourceContracts(repoRoot, readSource = path => readFile(resolve(repoRoot, path), 'utf8')) {
  const cache = new Map();
  async function parse(path) {
    if (!cache.has(path)) cache.set(path, (async () => {
      try {
        const source = ts.createSourceFile(path, await readSource(path), ts.ScriptTarget.Latest, true);
        return source.parseDiagnostics.length ? { error: `invalid TypeScript: ${path}` } : { source };
      } catch (error) {
        return { error: `cannot read ${path} (${error.code ?? 'read error'})` };
      }
    })());
    return cache.get(path);
  }

  const navigation = await parse('src/lib/navigation.ts');
  const results = await Promise.all(sourceContracts.map(async spec => {
    const libraryPath = `src/lib/${spec.slug}.ts`;
    const library = await parse(libraryPath);
    const values = exportedStrings(library.source);
    const contractName = `${spec.prefix}_CONTRACT_VERSION`;
    const modelName = `${spec.prefix}_MODEL_VERSION`;
    const sourceName = `${spec.prefix}_SOURCE_OF_TRUTH`;
    const contractVersion = values.get(contractName) ?? 'unknown';
    const modelVersion = values.get(modelName) ?? 'unknown';
    const failures = [library.error, navigation.error].filter(Boolean);
    const requireCheck = (condition, message) => { if (!condition) failures.push(message); };
    requireCheck(/^v\d+$/.test(contractVersion), `${libraryPath}: missing/invalid ${contractName}`);
    requireCheck(/^\d+\.\d+\.\d+$/.test(modelVersion), `${libraryPath}: missing/invalid ${modelName}`);
    requireCheck(descendants(navigation.source).some(node => ts.isObjectLiteralExpression(node)
      && property(node, 'href') && ts.isStringLiteral(property(node, 'href'))
      && property(node, 'href').text === `/${spec.slug}`), `navigation: missing href /${spec.slug}`);

    const routes = [spec, ...(spec.additionalRoute ? [spec.additionalRoute] : [])];
    for (const route of routes) {
      const routePath = `src/app/api/${route.slug}/route.ts`;
      const parsed = await parse(routePath);
      if (parsed.error) failures.push(parsed.error);
      const nodes = functionNodes(parsed.source, 'GET');
      requireCheck(nodes.length > 0, `${routePath}: missing exported GET implementation`);
      const imported = imports(parsed.source, `@/lib/${spec.slug}`);
      requireCheck(nodes.some(node => ts.isCallExpression(node) && ts.isIdentifier(node.expression)
        && imported.get(node.expression.text) === route.builder), `${routePath}: GET must call ${route.builder} from ${libraryPath}`);

      const builderNodes = functionNodes(library.source, route.builder);
      requireCheck(builderNodes.some(node => {
        if (!ts.isObjectLiteralExpression(node)) return false;
        const origin = property(node, 'sourceOfTruth');
        const sourceMatches = origin && (ts.isStringLiteral(origin) ? origin.text === `/api/${spec.slug}`
          : identifier(origin, sourceName) && values.get(sourceName) === `/api/${spec.slug}`);
        return sourceMatches && identifier(property(node, 'contractVersion'), contractName)
          && identifier(property(node, 'modelVersion'), modelName);
      }), `${libraryPath}: ${route.builder} must supply matching sourceOfTruth and version metadata`);

      for (const [suffix, versionName, metaKey] of [
        ['Contract-Version', contractName, 'contractVersion'],
        ['Model-Version', modelName, 'modelVersion'],
      ]) {
        const header = `X-${spec.header}-${suffix}`;
        requireCheck(nodes.some(node => {
          if (!ts.isCallExpression(node) || !ts.isPropertyAccessExpression(node.expression)
            || node.expression.name.text !== 'set' || node.arguments.length !== 2) return false;
          const receiver = node.expression.expression;
          if (!ts.isPropertyAccessExpression(receiver) || receiver.name.text !== 'headers') return false;
          const [key, value] = node.arguments;
          if (!ts.isStringLiteral(key) || key.text !== header) return false;
          if (ts.isIdentifier(value)) return imported.get(value.text) === versionName;
          return Boolean(spec.payload && ts.isPropertyAccessExpression(value) && value.name.text === metaKey
            && ts.isPropertyAccessExpression(value.expression) && value.expression.name.text === 'meta'
            && identifier(value.expression.expression, spec.payload));
        }), `${routePath}: missing/mismatched ${header} assignment`);
      }
    }
    return [spec.key, {
      contractVersion, modelVersion, contractReady: failures.length === 0,
      validation: 'source-only', libraryPath,
      routePaths: routes.map(route => `src/app/api/${route.slug}/route.ts`),
      failures, ...(spec.blocker === false ? { blocker: false } : {}),
    }];
  }));
  return Object.fromEntries(results);
}
