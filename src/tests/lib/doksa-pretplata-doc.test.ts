import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE,
  DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_PRETPLATA_SCOPE_LOCK,
} from '../../lib/extrimli/developer-create-vrh-ekviladenta-contract';

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
  const doc = await fs.readFile(path.join(root, 'docs/DOKSA-DOO-ZRENJANIN-PRETPLATA.md'), 'utf8');
  const billing = await fs.readFile(path.join(root, 'BILLING.md'), 'utf8');
  const manifest = await fs.readFile(path.join(root, 'docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md'), 'utf8');

  await test('DOKSA doc preserves additive-only pretplata scope and identity gates', () => {
    assert(
      doc.includes(DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_PRETPLATA_SCOPE_LOCK),
      'pretplata scope lock missing',
    );
    assert(
      doc.includes(`\`${DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE.canonicalSubscriberLegalEntity}\``),
      'canonical legal entity missing',
    );
    assert(
      doc.includes('private intake evidencija') &&
        doc.includes('proverljivog ovlašćenja'),
      'signer/contact validation boundary missing',
    );
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE.acceptanceCriteria.noNewRuntimeRoutes,
      'contract must keep no-new-runtime-routes enabled',
    );
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE.acceptanceCriteria.noParallelSourceOfTruth,
      'contract must keep no-parallel-source-of-truth enabled',
    );
    assert(
      doc.includes(
        'nema novih runtime ruta',
      ),
      'no-new-routes rule missing',
    );
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE.acceptanceCriteria
        .noActivationWithoutConfirmedIdentityContractAndPayment,
      'contract must keep identity/contract/payment activation gate enabled',
    );
    assert(
      doc.includes(
        'nema paralelnog source-of-truth sistema',
      ),
      'no-parallel-source-of-truth rule missing',
    );
    assert(
      doc.includes('nema aktivacije bez potvrđenog identiteta, ugovora i uplate'),
      'identity/contract/payment activation gate missing',
    );
  });

  await test('DOKSA doc keeps private message out of public-safe and downstream surfaces', () => {
    assert(doc.includes('Direktna poruka'), 'private intake message boundary section missing');
    assert(doc.includes('private intake evidence'), 'private evidence classification missing');
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE.directEmploymentRequestMessageHandling
        .publicSafeSummaryAllowed === false,
      'contract must keep public-safe summary disabled for the private message',
    );
    assert(
      doc.includes(
        'public-safe summary',
      ),
      'public-safe summary boundary missing',
    );
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE.directEmploymentRequestMessageHandling
        .downstreamSyncAllowed === false,
      'contract must keep downstream sync disabled for the private message',
    );
    assert(
      doc.includes(
        'downstream sync paketu',
      ),
      'downstream sync boundary missing',
    );
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
