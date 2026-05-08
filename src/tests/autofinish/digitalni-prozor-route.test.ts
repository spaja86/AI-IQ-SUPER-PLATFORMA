// Autofinish #1159 — DIGITALNI PROZOR ruta pokrivenost
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/digitalni-prozor-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/digitalni-prozor/page';
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
  console.log('\n🪟 DIGITALNI PROZOR ruta — Unit Test Suite (#1159)\n');

  const entries = sitemap();
  const digitalniProzorUrl = `${BASE_URL}/digitalni-prozor`;

  await test('Sitemap sadrži /digitalni-prozor', () => {
    assert(entries.some((entry) => entry.url === digitalniProzorUrl), `/digitalni-prozor nije u sitemap-u (${digitalniProzorUrl})`);
  });

  await test('metadata.title za digitalni-prozor je definisan', () => {
    assert(typeof metadata.title === 'string' && metadata.title.includes('DIGITALNI PROZOR'), `metadata.title: ${String(metadata.title)}`);
  });

  await test('Navigation sadrži /digitalni-prozor link', () => {
    const navPath = path.resolve(process.cwd(), 'src/components/Navigation.tsx');
    const navSource = fs.readFileSync(navPath, 'utf8');
    assert(navSource.includes("href: '/digitalni-prozor'"), 'Navigation.tsx nema link ka /digitalni-prozor');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspješni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});

