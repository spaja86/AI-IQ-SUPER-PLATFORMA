// Autofinish #1263 — Unit testovi Srbija licencni autofinish report

import fs from 'node:fs';
import path from 'node:path';
import {
  getAutofinishSrbijaLicencniReport,
} from '../../lib/autofinish-petlja';
import {
  buildAIIQWorldBankLicencniRegistar,
  getLicencniComplianceIzvestaj,
} from '../../lib/aiiq-world-bank-licencni-registar';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
} from '../../lib/constants';

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

function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n🇷🇸 Autofinish Srbija licencni report — Test Suite (#1263)\n');

  const report = getAutofinishSrbijaLicencniReport();
  const reg = buildAIIQWorldBankLicencniRegistar();
  const compliance = getLicencniComplianceIzvestaj('mesecni');

  await test('verzija === APP_VERSION', () => {
    assertEqual(report.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(report.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('timestamp je validan ISO', () => {
    assert(!Number.isNaN(Date.parse(report.timestamp)), 'timestamp');
  });

  await test('report je zaključan na Srbiju', () => {
    assertEqual(report.drzava, 'Srbija', 'drzava');
    assertEqual(report.valuta, 'RSD', 'valuta');
    assertEqual(report.rezimNabavke, 'kupujemo_sve_licence', 'rezimNabavke');
  });

  await test('regulatori nisu prazni', () => {
    assert(report.regulatori.length >= 2, 'regulatori.length');
  });

  await test('ukupno/u_nabavci/potvrdjene prate compliance izveštaj', () => {
    assertEqual(report.ukupnoLicenci, compliance.ukupnoLicenci, 'ukupnoLicenci');
    assertEqual(report.uNabavci, compliance.uNabavci, 'uNabavci');
    assertEqual(report.potvrdjene, compliance.potvrdjene, 'potvrdjene');
    assertEqual(report.coverageProcenat, compliance.coverageProcenat, 'coverageProcenat');
    assertEqual(report.kriticniGapovi, compliance.kriticniGapovi, 'kriticniGapovi');
  });

  await test('topDelatnosti su konzistentne sa registrom', () => {
    assert(report.topDelatnosti.length > 0, 'topDelatnosti.length');
    for (const item of report.topDelatnosti) {
      const coverage = reg.coveragePoDelatnosti.find((x) => x.delatnost === item.delatnost);
      assert(Boolean(coverage), `coverage postoji za ${item.delatnost}`);
      assertEqual(item.ukupnoLicenci, coverage!.ukupnoLicenci, `ukupnoLicenci ${item.delatnost}`);
    }
  });

  await test('topLicenceZaNabavku sadrže samo licence iz nabavke', () => {
    assert(report.topLicenceZaNabavku.length > 0, 'topLicenceZaNabavku.length');
    for (const item of report.topLicenceZaNabavku) {
      assert(reg.nabavka.some((x) => x.licenca === item.licenca && x.delatnost === item.delatnost), `nabavka sadrži ${item.licenca}`);
    }
  });

  await test('API ruta i widget fajl postoje', () => {
    const routeFile = path.resolve(process.cwd(), 'src/app/api/autofinish-srbija-licencni-report/route.ts');
    const widgetFile = path.resolve(process.cwd(), 'src/app/autofinish/SrbijaLicencniReportWidget.tsx');
    assert(fs.existsSync(routeFile), 'route fajl postoji');
    assert(fs.existsSync(widgetFile), 'widget fajl postoji');
  });

  await test('autofinish page koristi Srbija widget', () => {
    const pageSource = fs.readFileSync(path.resolve(process.cwd(), 'src/app/autofinish/page.tsx'), 'utf8');
    assert(pageSource.includes('SrbijaLicencniReportWidget'), 'widget import/render');
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
