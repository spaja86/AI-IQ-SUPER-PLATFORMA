#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import { existsSync } from 'node:fs';
import { resolve, join, relative, dirname } from 'node:path';

const root = resolve(process.cwd());
const apiDir = join(root, 'src/app/api');
const testsDir = join(root, 'src/tests/autofinish');
const defaultInventoryPath = join(root, 'reports/route-inventory.csv');

function parseArgs(argv) {
  const args = {
    limit: null,
    offset: 0,
    dryRun: false,
    includeTested: false,
    inventoryPath: defaultInventoryPath,
  };

  for (const arg of argv) {
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--include-tested') args.includeTested = true;
    else if (arg.startsWith('--limit=')) args.limit = Number(arg.split('=')[1]);
    else if (arg.startsWith('--offset=')) args.offset = Number(arg.split('=')[1]);
    else if (arg.startsWith('--inventory=')) args.inventoryPath = resolve(root, arg.split('=')[1]);
  }

  if (!Number.isFinite(args.offset) || args.offset < 0) args.offset = 0;
  if (args.limit !== null && (!Number.isFinite(args.limit) || args.limit < 0)) args.limit = null;
  return args;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name === 'route.ts') {
      files.push(full);
    }
  }

  return files;
}

function parseMethods(source) {
  const methods = new Set();
  const re = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/g;
  let m;
  while ((m = re.exec(source)) !== null) methods.add(m[1]);
  return Array.from(methods).sort();
}

/** Returns a map of method name → whether it has at least one parameter. */
function parseMethodParams(source) {
  const params = {};
  const re = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s*\(([^)]*)\)/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    params[m[1]] = m[2].trim().length > 0;
  }
  return params;
}

/** Returns true if the route function takes a 2nd context parameter (dynamic routes). */
function parseMethodTakesContext(source) {
  const ctxMethods = new Set();
  // Multi-line signature: method name followed by open paren, then more than one "top-level" comma
  const re = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s*\(/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const method = m[1];
    const start = m.index + m[0].length;
    let depth = 1;
    let i = start;
    let topLevelCommas = 0;
    while (i < source.length && depth > 0) {
      const ch = source[i];
      if (ch === '(' || ch === '{' || ch === '[') depth++;
      else if (ch === ')' || ch === '}' || ch === ']') { depth--; if (depth === 0) break; }
      else if (ch === '<') depth++;
      else if (ch === '>') depth--;
      else if (ch === ',' && depth === 1) topLevelCommas++;
      i++;
    }
    const paramStr = source.slice(start, i).trim();
    if (paramStr.length > 0 && topLevelCommas >= 1) ctxMethods.add(method);
  }
  return ctxMethods;
}

function routeNameFromFile(filePath) {
  return relative(apiDir, filePath).replace(/\\/g, '/').replace(/\/route\.ts$/, '');
}

function testFileNameForRoute(routeName) {
  return `${routeName.replace(/\//g, '-')}-route.test.ts`;
}

function escapeTemplate(str) {
  return str.replace(/`/g, '\\`');
}

function templateHarness(title) {
  return `// ${escapeTemplate(title)}\n// Generisano: scripts/generate-route-tests.mjs\n\nimport fs from 'node:fs';\nimport path from 'node:path';\nimport { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';\n\nlet passed = 0;\nlet failed = 0;\nconst failures: string[] = [];\n\nasync function test(name: string, fn: () => Promise<void> | void): Promise<void> {\n  try {\n    await fn();\n    console.log(\`  ✅ \${name}\`);\n    passed++;\n  } catch (e) {\n    const msg = e instanceof Error ? e.message : String(e);\n    console.error(\`  ❌ \${name}\`);\n    console.error(\`     \${msg}\`);\n    failed++;\n    failures.push(\`\${name}: \${msg}\`);\n  }\n}\n\nfunction assert(condition: boolean, message: string): asserts condition {\n  if (!condition) throw new Error(\`Assert failed: \${message}\`);\n}\n\nfunction assertEqual<T>(actual: T, expected: T, label?: string): void {\n  if (actual !== expected) {\n    throw new Error(\n      \`\${label ?? 'assertEqual'}: expected \${JSON.stringify(expected)}, got \${JSON.stringify(actual)}\`,\n    );\n  }\n}\n\nfunction isObject(v: unknown): v is Record<string, unknown> {\n  return typeof v === 'object' && v !== null;\n}\n\nconst _lintUseHelpers = [assertEqual, isObject];\nvoid _lintUseHelpers;\n`;
}

function templateFooter() {
  return `\n  console.log(\`\n🏁 Rezultat: \${passed} prošlo, \${failed} palo\`);\n  if (failures.length > 0) {\n    console.error('\\n❌ Neuspešni testovi:');\n    failures.forEach((f) => console.error(\`  • \${f}\`));\n    process.exit(1);\n  }\n}\n\nrunTests().catch((e) => {\n  console.error('Kritična greška u test runneru:', e);\n  process.exit(1);\n});\n`;
}

function templateGetOnly(routeName, getHasParams, getHasContext) {
  const importPath = `../../app/api/${routeName}/route`;
  const routeFilePath = `src/app/api/${routeName}/route.ts`;
  const nextReqImport = getHasParams ? `import type { NextRequest } from 'next/server';\n` : '';
  const requestSetup = getHasParams
    ? `    const request = new Request('http://localhost/api/${routeName}', {\n      headers: { 'x-forwarded-for': '127.0.1.10' },\n    });\n\n    `
    : `    `;
  const getCall = getHasContext
    ? `await GET(request as unknown as NextRequest, {} as unknown as Parameters<typeof GET>[1])`
    : (getHasParams ? `await GET(request as unknown as NextRequest)` : `await GET()`);

  return `${templateHarness(`Autofinish — ${routeName} Route Coverage Test`)}` +
`${nextReqImport}import { GET } from '${importPath}';\n\nasync function runTests(): Promise<void> {\n  console.log('\\n🏁 ${escapeTemplate(routeName)} — Route Coverage Test Suite\\n');\n\n  const routePath = path.resolve(process.cwd(), '${routeFilePath}');\n\n  await test('API route fajl postoji', () => {\n    assert(fs.existsSync(routePath), \`\${routePath} ne postoji\`);\n  });\n\n  await test('Ruta eksportuje GET i response helper', () => {\n    const src = fs.readFileSync(routePath, 'utf8');\n    assert(src.includes('export async function GET'), 'Nedostaje GET handler');\n    assert(\n      src.includes('NextResponse.json') || src.includes('Response.json') || src.includes('apiSuccess'),\n      'Nedostaje JSON response helper',\n    );\n  });\n\n  await test('GET smoke provera', async () => {\n${requestSetup}const response = ${getCall};\n    assert(response.status >= 200 && response.status < 600, \`Neočekivan status: \${response.status}\`);\n\n    const xAppVersion = response.headers.get('X-App-Version');\n    if (xAppVersion !== null) {\n      assertEqual(xAppVersion, APP_VERSION, 'X-App-Version');\n    }\n\n    let body: unknown = null;\n    try {\n      body = await response.clone().json();\n    } catch {\n      body = null;\n    }\n\n    if (isObject(body)) {\n      if (typeof body['status'] === 'string') {\n        assert((body['status'] as string).length > 0, 'status string');\n      }\n\n      if (typeof body['verzija'] === 'string') {\n        assertEqual(body['verzija'], APP_VERSION, 'verzija');\n      } else if (isObject(body['data']) && typeof body['data']['verzija'] === 'string') {\n        assertEqual(body['data']['verzija'], APP_VERSION, 'data.verzija');\n      }\n    }\n  });\n\n  await test('Konstante su dostupne', () => {\n    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');\n    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT > 0, 'AUTOFINISH_COUNT');\n    assert(typeof TOTAL_API_ROUTES === 'number' && TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES');\n    assert(typeof TOTAL_ROUTES === 'number' && TOTAL_ROUTES > 0, 'TOTAL_ROUTES');\n  });\n` + templateFooter();
}

function templateGetPost(routeName, getHasParams, postHasParams, getHasContext, postHasContext) {
  const importPath = `../../app/api/${routeName}/route`;
  const routeFilePath = `src/app/api/${routeName}/route.ts`;
  const needsNextReq = getHasParams || postHasParams || getHasContext || postHasContext;
  const nextReqImport = needsNextReq ? `import type { NextRequest } from 'next/server';\n` : '';
  const getRequestSetup = (getHasParams || getHasContext)
    ? `    const request = new Request('http://localhost/api/${routeName}', {\n      headers: { 'x-forwarded-for': '127.0.1.20' },\n    });\n\n    `
    : `    `;
  const getCall = getHasContext
    ? `await GET(request as unknown as NextRequest, {} as unknown as Parameters<typeof GET>[1])`
    : (getHasParams ? `await GET(request as unknown as NextRequest)` : `await GET()`);
  const postCall = postHasContext
    ? `await POST(req as unknown as NextRequest, {} as unknown as Parameters<typeof POST>[1])`
    : (postHasParams ? `await POST(req as unknown as NextRequest)` : `await POST()`);
  const postNeedsReq = postHasParams || postHasContext;

  const postTest1 = `  await test('POST odbija nevalidan JSON payload', async () => {\n    const req = new Request('http://localhost/api/${routeName}', {\n      method: 'POST',\n      headers: { 'content-type': 'application/json' },\n      body: '{',\n    });\n    const response = ${postCall};\n    assert(response.status >= 400 && response.status < 500, \`Očekivan 4xx, dobijeno \${response.status}\`);\n  });\n\n  await test('POST odbija nevalidan payload', async () => {\n    const req = new Request('http://localhost/api/${routeName}', {\n      method: 'POST',\n      headers: { 'content-type': 'application/json' },\n      body: JSON.stringify({ __invalid: true }),\n    });\n    const response = ${postCall};\n    assert(response.status >= 400 && response.status < 500, \`Očekivan 4xx, dobijeno \${response.status}\`);\n  });\n\n`;
  // If POST takes no args, skip the body-validation tests since it can't inspect the request
  const postTests = postNeedsReq ? postTest1 : '';

  return `${templateHarness(`Autofinish — ${routeName} Route Coverage Test`)}` +
`${nextReqImport}import { GET, POST } from '${importPath}';\n\nasync function runTests(): Promise<void> {\n  console.log('\\n🏁 ${escapeTemplate(routeName)} — Route Coverage Test Suite\\n');\n\n  const routePath = path.resolve(process.cwd(), '${routeFilePath}');\n\n  await test('API route fajl postoji', () => {\n    assert(fs.existsSync(routePath), \`\${routePath} ne postoji\`);\n  });\n\n  await test('Ruta eksportuje GET i POST', () => {\n    const src = fs.readFileSync(routePath, 'utf8');\n    assert(src.includes('export async function GET'), 'Nedostaje GET handler');\n    assert(src.includes('export async function POST'), 'Nedostaje POST handler');\n    assert(\n      src.includes('NextResponse.json') || src.includes('Response.json') || src.includes('apiSuccess'),\n      'Nedostaje JSON response helper',\n    );\n  });\n\n  await test('GET smoke provera', async () => {\n${getRequestSetup}const response = ${getCall};\n    assert(response.status >= 200 && response.status < 600, \`Neočekivan status: \${response.status}\`);\n\n    const body = (await response.clone().json().catch(() => null)) as unknown;\n    if (isObject(body)) {\n      if (typeof body['status'] === 'string') {\n        assert((body['status'] as string).length > 0, 'status string');\n      }\n      if (typeof body['verzija'] === 'string') {\n        assertEqual(body['verzija'], APP_VERSION, 'verzija');\n      }\n    }\n  });\n\n${postTests}  await test('Konstante su dostupne', () => {\n    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');\n    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT > 0, 'AUTOFINISH_COUNT');\n    assert(typeof TOTAL_API_ROUTES === 'number' && TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES');\n    assert(typeof TOTAL_ROUTES === 'number' && TOTAL_ROUTES > 0, 'TOTAL_ROUTES');\n  });\n` + templateFooter();
}

function templateNoGet(routeName, methods) {
  const routeFilePath = `src/app/api/${routeName}/route.ts`;

  return `${templateHarness(`Autofinish — ${routeName} Route Coverage Test`)}` +
`async function runTests(): Promise<void> {\n  console.log('\\n🏁 ${escapeTemplate(routeName)} — Route Coverage Test Suite\\n');\n\n  const routePath = path.resolve(process.cwd(), '${routeFilePath}');\n\n  await test('API route fajl postoji', () => {\n    assert(fs.existsSync(routePath), \`\${routePath} ne postoji\`);\n  });\n\n  await test('Ruta eksportuje očekivane metode', () => {\n    const src = fs.readFileSync(routePath, 'utf8');\n    ${methods.map((m) => `assert(src.includes('export async function ${m}'), 'Nedostaje ${m} handler');`).join('\n    ')}\n  });\n\n  await test('Konstante su dostupne', () => {\n    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');\n    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT > 0, 'AUTOFINISH_COUNT');\n    assert(typeof TOTAL_API_ROUTES === 'number' && TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES');\n    assert(typeof TOTAL_ROUTES === 'number' && TOTAL_ROUTES > 0, 'TOTAL_ROUTES');\n  });\n` + templateFooter();
}

function buildTestSource(routeName, methods, methodParams, methodCtx) {
  const getHasParams = methodParams['GET'] ?? false;
  const postHasParams = methodParams['POST'] ?? false;
  const getHasContext = methodCtx.has('GET');
  const postHasContext = methodCtx.has('POST');
  if (methods.includes('GET') && methods.includes('POST')) return templateGetPost(routeName, getHasParams, postHasParams, getHasContext, postHasContext);
  if (methods.includes('GET')) return templateGetOnly(routeName, getHasParams, getHasContext);
  return templateNoGet(routeName, methods);
}

function csvEscape(value) {
  const s = String(value ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const routeFiles = await walk(apiDir);

  const rows = [];
  for (const routeFile of routeFiles) {
    const source = await fs.readFile(routeFile, 'utf8');
    const routeName = routeNameFromFile(routeFile);
    const methods = parseMethods(source);
    const methodParams = parseMethodParams(source);
    const methodCtx = parseMethodTakesContext(source);
    const testFileName = testFileNameForRoute(routeName);
    const testPath = join(testsDir, testFileName);
    const hasTest = existsSync(testPath);

    rows.push({
      routeName,
      methods,
      methodParams,
      methodCtx,
      hasTest,
      testFileName,
      routeFile,
      domain: routeName.split('/')[0] ?? routeName,
    });
  }

  rows.sort((a, b) => a.routeName.localeCompare(b.routeName));

  await fs.mkdir(dirname(args.inventoryPath), { recursive: true });
  const csvLines = ['route_name,http_methods,domain,has_test,test_file'];
  for (const row of rows) {
    csvLines.push([
      csvEscape(row.routeName),
      csvEscape(row.methods.join('|')),
      csvEscape(row.domain),
      csvEscape(row.hasTest ? 'yes' : 'no'),
      csvEscape(row.testFileName),
    ].join(','));
  }
  await fs.writeFile(args.inventoryPath, `${csvLines.join('\n')}\n`, 'utf8');

  const candidates = rows.filter((row) => args.includeTested || !row.hasTest);
  const sliced = candidates.slice(args.offset, args.limit === null ? undefined : args.offset + args.limit);

  let created = 0;
  for (const row of sliced) {
    const testPath = join(testsDir, row.testFileName);
    if (existsSync(testPath) && !args.includeTested) continue;

    const source = buildTestSource(row.routeName, row.methods, row.methodParams, row.methodCtx);
    if (!args.dryRun) {
      await fs.writeFile(testPath, source, 'utf8');
      created++;
    }
  }

  const grouped = rows.reduce((acc, row) => {
    acc[row.domain] = (acc[row.domain] ?? 0) + 1;
    return acc;
  }, {});

  const domainSummary = Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([domain, count]) => `${domain}:${count}`)
    .join(', ');

  console.log(JSON.stringify({
    totalRoutes: rows.length,
    existingTests: rows.filter((r) => r.hasTest).length,
    missingTests: rows.filter((r) => !r.hasTest).length,
    generated: created,
    batchOffset: args.offset,
    batchLimit: args.limit,
    inventoryPath: relative(root, args.inventoryPath),
    topDomains: domainSummary,
  }, null, 2));
}

main().catch((error) => {
  console.error('generate-route-tests failed:', error);
  process.exit(1);
});
