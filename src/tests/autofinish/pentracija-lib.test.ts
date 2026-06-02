// Pentracija — Unit Testovi (lib)
// Kompanija SPAJA — Digitalna Industrija
//
// Testira: buildPentestReport(), getPentestFindings(), calculatePentestScore(), getPentestSummary()

import {
  buildPentestReport,
  getPentestFindings,
  calculatePentestScore,
  getPentestSummary,
} from '../../lib/pentracija';
import type { PentestFinding } from '../../lib/pentracija';
import { APP_VERSION } from '../../lib/constants';

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
    console.error(`  ❌ ${name}\n     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(
      `${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

async function runTests(): Promise<void> {
  console.log('\n🎯 Pentracija — Unit Test Suite\n');

  // ─── buildPentestReport() ──────────────────────────────────────────────────
  await test('buildPentestReport() vraća objekat', () => {
    const r = buildPentestReport();
    assert(typeof r === 'object' && r !== null, 'mora biti objekat');
  });

  await test('buildPentestReport() status === "ok"', () => {
    assertEqual(buildPentestReport().status, 'ok', 'status');
  });

  await test('buildPentestReport() verzija === APP_VERSION', () => {
    assertEqual(buildPentestReport().verzija, APP_VERSION, 'verzija');
  });

  await test('buildPentestReport() ukupnoNalaza > 0', () => {
    assert(buildPentestReport().ukupnoNalaza > 0, 'ukupnoNalaza > 0');
  });

  await test('buildPentestReport() ukupnoNalaza === findings.length', () => {
    const r = buildPentestReport();
    assertEqual(r.ukupnoNalaza, r.findings.length, 'ukupno=length');
  });

  await test('buildPentestReport() findings je niz', () => {
    assert(Array.isArray(buildPentestReport().findings), 'mora biti niz');
  });

  await test('buildPentestReport() overallScore je u opsegu 0–100', () => {
    const s = buildPentestReport().overallScore;
    assert(s >= 0 && s <= 100, `overallScore van opsega: ${s}`);
  });

  await test('buildPentestReport() zbrojevi severity-a konzistentni', () => {
    const r = buildPentestReport();
    const suma = r.critical + r.high + r.medium + r.low + r.info;
    assertEqual(suma, r.ukupnoNalaza, 'suma severity-a');
  });

  await test('buildPentestReport() svaki finding ima obavezna polja', () => {
    const VALID_SEVERITIES = ['info', 'low', 'medium', 'high', 'critical'];
    const VALID_STATUSI = ['open', 'mitigated', 'fixed', 'accepted', 'wontfix'];
    const VALID_VEKTORI = ['network', 'adjacent', 'local', 'physical'];
    const VALID_KATEGORIJE = [
      'injection', 'broken-auth', 'xss', 'xxe', 'insecure-deserialization',
      'vulnerable-components', 'security-misconfiguration', 'sensitive-data-exposure',
      'broken-access-control', 'logging-monitoring',
    ];
    for (const f of buildPentestReport().findings) {
      assert(typeof f.id === 'string' && f.id.length > 0, `id nevalidan: ${f.id}`);
      assert(typeof f.naziv === 'string' && f.naziv.length > 0, `naziv nevalidan: ${f.id}`);
      assert(typeof f.opis === 'string' && f.opis.length > 0, `opis nevalidan: ${f.id}`);
      assert(VALID_KATEGORIJE.includes(f.kategorija), `kategorija nevalidna: ${f.kategorija}`);
      assert(VALID_VEKTORI.includes(f.attackVector), `attackVector nevalidan: ${f.attackVector}`);
      assert(f.cvssScore >= 0 && f.cvssScore <= 10, `CVSS van opsega: ${f.cvssScore}`);
      assert(VALID_SEVERITIES.includes(f.severity), `severity nevalidan: ${f.severity}`);
      assert(VALID_STATUSI.includes(f.status), `status nevalidan: ${f.status}`);
      assert(typeof f.remedijacija === 'string' && f.remedijacija.length > 0, `remedijacija nevalidna: ${f.id}`);
    }
  });

  await test('buildPentestReport() trajanjeSkeniranja > 0', () => {
    assert(buildPentestReport().trajanjeSkeniranja > 0, 'trajanje > 0');
  });

  await test('buildPentestReport() timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(buildPentestReport().timestamp)), 'timestamp mora biti validan ISO');
  });

  // ─── getPentestFindings() ─────────────────────────────────────────────────
  await test('getPentestFindings() bez filtera vraća sve nalaze', () => {
    const all = getPentestFindings();
    assert(Array.isArray(all), 'mora biti niz');
    assert(all.length > 0, 'ne sme biti prazan');
  });

  await test('getPentestFindings("critical") vraća samo critical', () => {
    const critical = getPentestFindings('critical');
    for (const f of critical) {
      assertEqual(f.severity, 'critical' as PentestFinding['severity'], `severity mora biti critical, dobijen: ${f.severity}`);
    }
  });

  await test('getPentestFindings("high") vraća samo high', () => {
    const high = getPentestFindings('high');
    for (const f of high) {
      assertEqual(f.severity, 'high' as PentestFinding['severity'], `severity mora biti high`);
    }
  });

  await test('getPentestFindings("medium") vraća samo medium', () => {
    const medium = getPentestFindings('medium');
    assert(medium.length > 0, 'mora postojati bar jedan medium nalaz');
    for (const f of medium) {
      assertEqual(f.severity, 'medium' as PentestFinding['severity'], 'severity mora biti medium');
    }
  });

  await test('getPentestFindings() ne mutira originalni niz', () => {
    const a1 = getPentestFindings();
    const a2 = getPentestFindings();
    assertEqual(a1.length, a2.length, 'dužina mora biti konzistentna');
  });

  // ─── calculatePentestScore() ──────────────────────────────────────────────
  await test('calculatePentestScore() vraća vrednost 0–100', () => {
    const findings = getPentestFindings();
    const score = calculatePentestScore(findings);
    assert(score >= 0 && score <= 100, `skor ${score} van opsega 0–100`);
  });

  await test('calculatePentestScore([]) vraća 100', () => {
    assertEqual(calculatePentestScore([]), 100, 'prazna lista = skor 100');
  });

  await test('calculatePentestScore() ignoruje fixed i wontfix nalaze', () => {
    const fixedOnly: PentestFinding[] = [
      {
        id: 'x-001', naziv: 'Test', opis: 'Test', kategorija: 'injection',
        owaspRef: 'A03', attackVector: 'network', cvssScore: 9.8,
        severity: 'critical', status: 'fixed', remedijacija: 'Fixed', otkriveno: '2026-01-01',
      },
    ];
    assertEqual(calculatePentestScore(fixedOnly), 100, 'fixed critical ne sme umanjiti skor');
  });

  await test('calculatePentestScore() smanjuje skor za open critical', () => {
    const openCritical: PentestFinding[] = [
      {
        id: 'x-002', naziv: 'Test', opis: 'Test', kategorija: 'injection',
        owaspRef: 'A03', attackVector: 'network', cvssScore: 9.8,
        severity: 'critical', status: 'open', remedijacija: 'Plan', otkriveno: '2026-01-01',
      },
    ];
    const score = calculatePentestScore(openCritical);
    assert(score < 100, `skor ${score} trebao biti manji od 100 za open critical`);
  });

  // ─── getPentestSummary() ──────────────────────────────────────────────────
  await test('getPentestSummary() vraća objekat sa verzijom', () => {
    const s = getPentestSummary();
    assertEqual(s.verzija, APP_VERSION, 'verzija');
  });

  await test('getPentestSummary() overallScore 0–100', () => {
    const s = getPentestSummary();
    assert(s.overallScore >= 0 && s.overallScore <= 100, `overallScore ${s.overallScore} van opsega`);
  });

  await test('getPentestSummary() ukupnoNalaza > 0', () => {
    assert(getPentestSummary().ukupnoNalaza > 0, 'ukupno mora biti > 0');
  });

  await test('getPentestSummary() timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(getPentestSummary().timestamp)), 'timestamp mora biti ISO');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspješni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Greška:', e);
  process.exit(1);
});
