import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${message}`);
    failed++;
    failures.push(`${name}: ${message}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function run(): Promise<void> {
  console.log('\n📄 DOKSA pretplata governance doc test\n');
  const filePath = fileURLToPath(import.meta.url);
  const root = path.resolve(path.dirname(filePath), '../../..');
  const doc = fs.readFileSync(path.join(root, 'docs/DOKSA-DOO-ZRENJANIN-PRETPLATA.md'), 'utf8');
  const billing = fs.readFileSync(path.join(root, 'BILLING.md'), 'utf8');
  const manifest = fs.readFileSync(path.join(root, 'docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md'), 'utf8');

  await test('DOKSA doc preserves additive-only pretplata scope and identity gates', () => {
    assert(
      doc.includes('DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == POSLOVNA PONUDA / PRETPLATA'),
      'pretplata scope lock missing',
    );
    assert(doc.includes('`DOKSA d.o.o. Zrenjanin`'), 'canonical legal entity missing');
    assert(doc.includes('`Vladimir Anđelković`'), 'signer/contact validation subject missing');
    assert(doc.includes('bez novih runtime ruta'), 'no-new-routes rule missing');
    assert(doc.includes('bez paralelnog source-of-truth sistema'), 'no-parallel-source-of-truth rule missing');
  });

  await test('DOKSA doc keeps private message out of public-safe and downstream surfaces', () => {
    assert(
      doc.includes('`Bato zaposli mi i drugare, ljubi brat`'),
      'private intake message reference missing',
    );
    assert(doc.includes('private intake evidence'), 'private evidence classification missing');
    assert(doc.includes('public-safe summary'), 'public-safe summary boundary missing');
    assert(doc.includes('downstream sync paketu'), 'downstream sync boundary missing');
  });

  await test('billing and main manifest reference the DOKSA pretplata governance artifact', () => {
    assert(
      billing.includes('docs/DOKSA-DOO-ZRENJANIN-PRETPLATA.md'),
      'BILLING.md must reference the DOKSA governance document',
    );
    assert(
      manifest.includes('docs/DOKSA-DOO-ZRENJANIN-PRETPLATA.md'),
      'Developer/Create manifest must reference the DOKSA governance document',
    );
    assert(
      manifest.includes('POSLOVNA PONUDA / PRETPLATA'),
      'Developer/Create manifest must mention the pretplata alias',
    );
  });

  console.log(`\nPassed: ${passed}, Failed: ${failed}`);
  if (failed > 0) {
    console.error('\nFailures:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
