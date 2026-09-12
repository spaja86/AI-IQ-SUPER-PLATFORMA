import { buildGeneratorZaPoslovneRacune } from '../../lib/generator-za-poslovne-racune';
import { buildDigitalnaIndustrijaIzvozFaktura } from '../../lib/digitalna-industrija-izvoz-faktura';
import {
  PDF_EXPORT_CONTRACT_VERSION,
  buildPoslovniRacuniPdfDocument,
  buildIzvozFakturaPdfDocument,
} from '../../lib/export-pdf';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

async function runTests(): Promise<void> {
  console.log('\n📄 PDF Export Test Suite\n');

  await test('Generator računa nosi export contract v1', () => {
    const result = buildGeneratorZaPoslovneRacune('test-user');
    assert(result.exportContract.version === PDF_EXPORT_CONTRACT_VERSION, 'generator export contract version');
    assert(result.exportContract.artifacts.some((artifact) => artifact.format === 'pdf'), 'generator pdf artifact');
  });

  await test('Generator računa PDF je validan PDF payload', () => {
    const pdf = buildPoslovniRacuniPdfDocument(buildGeneratorZaPoslovneRacune('test-user'));
    const content = Buffer.from(pdf).toString('utf8');
    const head = content.slice(0, 8);
    assert(head.startsWith('%PDF-1.4'), 'pdf header');
    assert(content.includes('Ukupno racuna'), 'pdf ascii-safe racuna content');
    assert(!content.includes('Ukupno računa'), 'pdf should not contain raw non-ascii racuna content');
  });

  await test('Izvoz faktura nosi export contract v1 i PDF payload', () => {
    const result = buildDigitalnaIndustrijaIzvozFaktura('test-user');
    assert(result.exportContract.version === PDF_EXPORT_CONTRACT_VERSION, 'faktura export contract version');
    const pdf = buildIzvozFakturaPdfDocument(result);
    const content = Buffer.from(pdf).toString('utf8');
    const head = content.slice(0, 8);
    assert(head.startsWith('%PDF-1.4'), 'invoice pdf header');
    assert(content.includes('Izvozne fakture'), 'invoice ascii-safe content');
    assert(content.includes('DIGITALNA INDUSTRIJA - IZVOZ FAKTURA PDF'), 'invoice title should be ascii-safe');
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    failures.forEach((failure) => console.error(`  • ${failure}`));
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Kritična greška u PDF testovima:', error);
  process.exit(1);
});
