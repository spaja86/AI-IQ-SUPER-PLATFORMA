import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/ai-iq-world-bank-licencna-analiza/page';
import { navigation } from '../../lib/navigation';
import { BASE_URL } from '../../lib/constants';

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
  console.log('\n📑 AI IQ WORLD BANK Licencna Analiza route coverage — Unit Test Suite\n');

  const entries = sitemap();
  const routeUrl = `${BASE_URL}/ai-iq-world-bank-licencna-analiza`;

  const apiFiles = [
    'src/app/api/aiiq-world-bank-licencni-registar/route.ts',
    'src/app/api/aiiq-world-bank-licencni-gap-izvestaj/route.ts',
    'src/app/api/aiiq-world-bank-licencna-checklista/route.ts',
    'src/app/api/aiiq-world-bank-licencni-expirations/route.ts',
    'src/app/api/aiiq-world-bank-licencna-nabavka-status/route.ts',
    'src/app/api/aiiq-world-bank-licencni-compliance-izvestaj/route.ts',
  ].map((p) => path.resolve(process.cwd(), p));

  await test('Sitemap sadrži novu stranicu', () => {
    assert(entries.some((entry) => entry.url === routeUrl), 'ruta nije u sitemap-u');
  });

  await test('Metadata title je postavljen', () => {
    assert(
      typeof metadata.title === 'string' && metadata.title.includes('Licencna Analiza') && metadata.title.includes('Srbija'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('Navigation sadrži novu stavku', () => {
    assert(
      navigation.some((item) => item.href === '/ai-iq-world-bank-licencna-analiza'),
      'navigation nema licencnu analizu',
    );
  });

  await test('Svi predviđeni API route fajlovi postoje', () => {
    for (const f of apiFiles) {
      assert(fs.existsSync(f), `nedostaje: ${f}`);
    }
  });

  await test('Centralni API koristi buildAIIQWorldBankLicencniRegistar', () => {
    const src = fs.readFileSync(path.resolve(process.cwd(), 'src/app/api/aiiq-world-bank-licencni-registar/route.ts'), 'utf8');
    assert(src.includes('buildAIIQWorldBankLicencniRegistar'), 'builder nije povezan u centralnom API-u');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
